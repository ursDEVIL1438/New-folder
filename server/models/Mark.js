const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
    examType: {
        type: String, // e.g., "Internal 1", "Internal 2", "Semester"
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    department: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    records: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        score: {
            type: Number,
            required: true
        },
        maxScore: {
            type: Number,
            required: true,
            default: 100
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

markSchema.index({ examType: 1, subject: 1, department: 1, year: 1, section: 1 }, { unique: true });

const Mark = mongoose.model('Mark', markSchema);
module.exports = Mark;
