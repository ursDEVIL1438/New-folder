const Request = require('../models/Request');

// @desc    Create a request (OD, Leave, etc.)
// @route   POST /api/requests
// @access  Private/Student
const createRequest = async (req, res) => {
    const { type, description, fromDate, toDate } = req.body;

    try {
        const request = new Request({
            type,
            description,
            fromDate,
            toDate,
            student: req.user._id
        });

        const createdRequest = await request.save();
        res.status(201).json(createdRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get my requests
// @route   GET /api/requests/my
// @access  Private/Student
const getMyRequests = async (req, res) => {
    try {
        const requests = await Request.find({ student: req.user._id }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all requests (for Admin/Faculty)
// @route   GET /api/requests
// @access  Private/Faculty/Admin
const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find({}).populate('student', 'name email department year section').sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update request status
// @route   PUT /api/requests/:id
// @access  Private/Faculty/Admin
const updateRequestStatus = async (req, res) => {
    const { status, remarks } = req.body;

    try {
        const request = await Request.findById(req.params.id);

        if (request) {
            request.status = status;
            request.remarks = remarks || request.remarks;
            const updatedRequest = await request.save();
            res.json(updatedRequest);
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createRequest, getMyRequests, getAllRequests, updateRequestStatus };
