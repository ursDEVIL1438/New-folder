const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    subject: { // E.g., "Mathematics", "Physics" or a Subject code
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
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late'],
            default: 'Present'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure one attendance record per subject per day per class
attendanceSchema.index({ date: 1, subject: 1, department: 1, year: 1, section: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
