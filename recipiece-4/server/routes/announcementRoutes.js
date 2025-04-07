const express = require('express');
const announcementController = require('../controllers/announcementController');

const router = express.Router();

router.post('/add-announcement', announcementController.postAnnouncement);
router.get('/announcements', announcementController.getAllAnnouncements);

module.exports = router;
