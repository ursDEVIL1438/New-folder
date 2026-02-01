const express = require('express');
const router = express.Router();
const { createRequest, getMyRequests, getAllRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('student'), createRequest)
    .get(protect, authorize('faculty', 'admin'), getAllRequests);

router.get('/my', protect, authorize('student'), getMyRequests);
router.put('/:id', protect, authorize('faculty', 'admin'), updateRequestStatus);

module.exports = router;
