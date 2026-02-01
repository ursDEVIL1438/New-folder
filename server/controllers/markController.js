const Mark = require('../models/Mark');

// @desc    Upload Internal Marks
// @route   POST /api/marks
// @access  Private/Faculty
const addMarks = async (req, res) => {
    const { examType, subject, department, year, section, records } = req.body;

    try {
        const mark = new Mark({
            examType,
            subject,
            faculty: req.user._id,
            department,
            year,
            section,
            records
        });

        const createdMark = await mark.save();
        res.status(201).json(createdMark);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get marks for a student
// @route   GET /api/marks/student
// @access  Private/Student
const getStudentMarks = async (req, res) => {
    try {
        const marks = await Mark.find({ "records.student": req.user._id });
        // Filter out other students' data before sending
        const formattedMarks = marks.map(mark => {
            const studentRecord = mark.records.find(r => r.student.toString() === req.user._id.toString());
            return {
                _id: mark._id,
                examType: mark.examType,
                subject: mark.subject,
                score: studentRecord.score,
                maxScore: studentRecord.maxScore,
                date: mark.createdAt
            };
        });
        res.json(formattedMarks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all marks for a class
// @route   GET /api/marks/class
// @access  Private/Faculty/Admin
const getClassMarks = async (req, res) => {
    const { department, year, section, subject, examType } = req.query;
    let query = { department, year, section };
    if (subject) query.subject = subject;
    if (examType) query.examType = examType;

    try {
        const marks = await Mark.find(query).populate('records.student', 'name email');
        res.json(marks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { addMarks, getStudentMarks, getClassMarks };
