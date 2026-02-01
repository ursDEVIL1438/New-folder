const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['OD', 'Leave', 'Permission', 'Certificate', 'Grievance', 'Complaint'],
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fromDate: {
        type: Date
    },
    toDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Resolved'],
        default: 'Pending'
    },
    remarks: { // Faculty/Admin comments
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
