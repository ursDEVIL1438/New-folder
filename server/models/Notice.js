const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetAudience: { // e.g., "All", "Students", "Faculty", "CSE", "Year 1"
        type: [String],
        default: ["All"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notice = mongoose.model('Notice', noticeSchema);
module.exports = Notice;
