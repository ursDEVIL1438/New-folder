const express = require('express');
const router = express.Router();
const { createNotice, getNotices } = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('faculty', 'admin'), createNotice)
    .get(protect, getNotices);

module.exports = router;
