const express = require('express');
const router = express.Router();
const { addMarks, getStudentMarks, getClassMarks } = require('../controllers/markController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('faculty', 'admin'), addMarks);

router.get('/student', protect, authorize('student'), getStudentMarks);
router.get('/class', protect, authorize('faculty', 'admin'), getClassMarks);

module.exports = router;
