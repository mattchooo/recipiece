const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require('path');
const fs = require("fs");
const exec = require("child_process");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = 5000;
app.use(cors({ origin: "*" }));
app.use(express.json());

// Path to the food images directory
const imageDir = path.join(__dirname, '..', 'uploaded_images');
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
}

// Configure Multer for disk storage (better for multiple clients)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imageDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

// Upload Image Endpoint
app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
    }
    
    // Trigger food detection after uploading the image
    const imagePath = path.join(imageDir, req.file.filename);

    // Run food_detection.py script (you may need to adjust the command depending on the environment)
    exec(`python3 ../food_detection.py ${imagePath}`, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error executing script: ${stderr}`);
            return res.status(500).json({ error: "Failed to process image" });
        }

        console.log("Food detection result:", stdout);
        res.json({ message: "Image uploaded and processed", result: stdout });
    });
});

// Fetch Food Labels
app.get("/food-labels", (req, res) => {
    try {
        const categories = fs.readdirSync(imageDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        res.json({ labels: categories });
    } catch (error) {
        console.error("Error reading food labels:", error);
        res.status(500).json({ error: "Failed to retrieve food labels" });
    }
});

app.listen(PORT, () => console.log("Server running on port " + PORT));