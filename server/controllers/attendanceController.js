const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private/Faculty
const markAttendance = async (req, res) => {
    const { date, subject, department, year, section, records } = req.body;

    try {
        const attendance = new Attendance({
            date,
            subject,
            faculty: req.user._id,
            department,
            year,
            section,
            records
        });

        const createdAttendance = await attendance.save();
        res.status(201).json(createdAttendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get attendance for a student
// @route   GET /api/attendance/student
// @access  Private/Student
const getStudentAttendance = async (req, res) => {
    try {
        // Find all attendance records where this student exists in 'records' array
        const attendance = await Attendance.find({ "records.student": req.user._id });

        // Calculate percentage (simplified)
        let totalClasses = attendance.length;
        let presentCount = 0;

        attendance.forEach(record => {
            const studentRecord = record.records.find(r => r.student.toString() === req.user._id.toString());
            if (studentRecord && studentRecord.status === 'Present') {
                presentCount++;
            }
        });

        res.json({
            attendanceRecords: attendance,
            stats: {
                totalClasses,
                presentCount,
                percentage: totalClasses === 0 ? 0 : ((presentCount / totalClasses) * 100).toFixed(2)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get attendance by Class (Filter)
// @route   GET /api/attendance/class
// @access  Private/Faculty/Admin
const getClassAttendance = async (req, res) => {
    const { department, year, section, date, subject } = req.query;
    let query = { department, year, section };
    if (date) query.date = date; // Exact match for simplicity
    if (subject) query.subject = subject;

    try {
        const attendance = await Attendance.find(query).populate('records.student', 'name email');
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { markAttendance, getStudentAttendance, getClassAttendance };
