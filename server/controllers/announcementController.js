const Announcement = require('../models/announcement');

module.exports.postAnnouncement = async (req, res, next) => {
    const { title, tag, name, description } = req.body;

    try {
        const newAnnouncement = await Announcement.create({
            title: title,
            name: name,
            tag: tag,
            description: description
        });

        console.log('Announcement created:', newAnnouncement.toJSON());
        res.status(201).json({ message: 'Announcement created successfully' });
    } catch (error) {
        console.log('Error:', error);
    }
};

module.exports.getAllAnnouncements = async (req, res, next) => {
    Announcement.findAll()
        .then(announcements => {
            res.send(announcements);
        })
        .catch(error => { 
            console.log('Error:', error); 
        });
};