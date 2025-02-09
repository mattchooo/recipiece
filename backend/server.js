const express = require("express");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Image upload (connect to ML model later)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
    }
    res.json({ message: "Image received", filename: req.file.originalname });
});

app.listen(5000, () => console.log("Server running on port 5000"));