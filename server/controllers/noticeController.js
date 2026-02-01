const Notice = require('../models/Notice');

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private/Faculty/Admin
const createNotice = async (req, res) => {
    const { title, content, targetAudience } = req.body;

    try {
        const notice = new Notice({
            title,
            content,
            targetAudience, // Array of strings
            postedBy: req.user._id
        });

        const createdNotice = await notice.save();
        res.status(201).json(createdNotice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get notices
// @route   GET /api/notices
// @access  Private
const getNotices = async (req, res) => {
    try {
        // Simple logic: fetch all for now, or filter based on user role/dept if complex
        const notices = await Notice.find({}).populate('postedBy', 'name role').sort({ createdAt: -1 });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createNotice, getNotices };
