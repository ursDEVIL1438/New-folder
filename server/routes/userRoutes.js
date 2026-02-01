const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile, getUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/login', authUser);
router.route('/')
    .post(registerUser) // Open for demo purposes, usually admin protected
    .get(protect, authorize('admin', 'faculty'), getUsers);
router.route('/profile').get(protect, getUserProfile);

module.exports = router;
