const express = require('express');
const router = express.Router();
const { markAttendance, getStudentAttendance, getClassAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('faculty', 'admin'), markAttendance);

router.get('/student', protect, authorize('student'), getStudentAttendance);
router.get('/class', protect, authorize('faculty', 'admin'), getClassAttendance);

module.exports = router;
