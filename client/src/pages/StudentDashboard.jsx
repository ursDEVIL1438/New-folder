import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { BookOpen, Calendar, Clock, Award, Plus } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import axios from 'axios';
import { toast } from 'react-toastify';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const StudentDashboard = () => {
    const { user } = useAuth();
    const [attendanceData, setAttendanceData] = useState(null);
    const [marks, setMarks] = useState([]);
    const [requests, setRequests] = useState([]);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requestForm, setRequestForm] = useState({
        type: 'OD',
        description: '',
        fromDate: '',
        toDate: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [attRes, marksRes, reqRes] = await Promise.all([
                axios.get('/api/attendance/student'),
                axios.get('/api/marks/student'),
                axios.get('/api/requests/my')
            ]);
            setAttendanceData(attRes.data);
            setMarks(marksRes.data);
            setRequests(reqRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/requests', requestForm);
            toast.success('Request submitted successfully');
            setShowRequestForm(false);
            fetchData();
            setRequestForm({ type: 'OD', description: '', fromDate: '', toDate: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit request');
        }
    };

    const attendanceChartData = {
        labels: ['Present', 'Absent'],
        datasets: [
            {
                data: [attendanceData?.stats?.presentCount || 0, (attendanceData?.stats?.totalClasses || 0) - (attendanceData?.stats?.presentCount || 0)],
                backgroundColor: ['#4F46E5', '#E5E7EB'],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div className=\"space-y-6\">
    {/* Header */ }
            <div>
                <h1 className=\"text-2xl font-bold text-gray-900\">Student Dashboard</h1>
                <p className=\"text-gray-500\">Welcome back, {user?.name}</p>
            </div >

    {/* Stats Grid */ }
    < div className =\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6\">
        < StatCard
title =\"Attendance\" 
value = {`${attendanceData?.stats?.percentage || 0}%`}
icon = { Clock }
color =\"primary\"
    />
    <StatCard
        title=\"Department\" 
value = { user?.department }
icon = { BookOpen }
color =\"secondary\"
    />
    <StatCard
        title=\"Pending Requests\" 
value = { requests.filter(r => r.status === 'Pending').length }
icon = { Calendar }
color =\"orange\"
    />
    <StatCard
        title=\"CGPA\" 
value =\"8.5\" 
icon = { Award }
color =\"green\"
    />
            </div >

    <div className=\"grid grid-cols-1 lg:grid-cols-3 gap-6\">
{/* Attendance Chart */ }
<div className=\"bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1\">
    < h2 className =\"text-lg font-bold text-gray-900 mb-4\">Attendance Overview</h2>
        < div className =\"h-64 flex items-center justify-center\">
{
    attendanceData ? (
        <Doughnut data={attendanceChartData} options={{ maintainAspectRatio: false }} />
    ) : (
        <p>Loading...</p>
    )
}
                    </div >
                </div >

    {/* Marks Table */ }
    < div className =\"bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2\">
        < h2 className =\"text-lg font-bold text-gray-900 mb-4\">Recent Internal Marks</h2>
            < div className =\"overflow-x-auto\">
                < table className =\"w-full text-left\">
                    < thead >
                    <tr className=\"border-b border-gray-100 text-sm text-gray-500\">
                        < th className =\"pb-3\">Subject</th>
                            < th className =\"pb-3\">Exam</th>
                                < th className =\"pb-3\">Score</th>
                                    < th className =\"pb-3\">Max</th>
                                </tr >
                            </thead >
    <tbody className=\"text-sm\">
{
    marks.length > 0 ? marks.map((mark) => (
        <tr key={mark._id} className=\"border-b last:border-0 border-gray-50\">
    < td className =\"py-3 font-medium\">{mark.subject}</td>
    < td className =\"py-3 text-gray-500\">{mark.examType}</td>
    < td className =\"py-3 font-bold text-primary\">{mark.score}</td>
    < td className =\"py-3 text-gray-500\">{mark.maxScore}</td>
                                    </tr >
                                )) : (
        <tr><td colSpan=\"4\" className=\"py-4 text-center text-gray-500\">No marks found</td></tr >
                                )
}
                            </tbody >
                        </table >
                    </div >
                </div >
            </div >

    {/* Requests Section */ }
    < div className =\"bg-white p-6 rounded-2xl shadow-sm border border-gray-100\">
        < div className =\"flex items-center justify-between mb-6\">
            < h2 className =\"text-lg font-bold text-gray-900\">My Requests & Grievances</h2>
                < button
onClick = {() => setShowRequestForm(!showRequestForm)}
className =\"flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium\"
    >
    <Plus size={16} />
                        New Request
                    </button >
                </div >

    { showRequestForm && (
        <form onSubmit={handleRequestSubmit} className=\"mb-8 p-6 bg-gray-50 rounded-xl animate-fade-in\">
            < div className =\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">
                < div >
                <label className=\"block text-xs font-medium text-gray-700 mb-1\">Type</label>
                    < select
className =\"w-full p-2 border border-gray-200 rounded-lg\"
value = { requestForm.type }
onChange = {(e) => setRequestForm({ ...requestForm, type: e.target.value })}
                                >
    <option value=\"OD\">On Duty (OD)</option>
        < option value =\"Leave\">Leave</option>
            < option value =\"Permission\">Permission</option>
                < option value =\"Certificate\">Certificate</option>
                    < option value =\"Grievance\">Grievance</option>
                                </select >
                            </div >
                            <div>
                                <label className=\"block text-xs font-medium text-gray-700 mb-1\">Description / Reason</label>
                                <input 
                                    type=\"text\" 
required
className =\"w-full p-2 border border-gray-200 rounded-lg\"
value = { requestForm.description }
onChange = {(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                                />
                            </div >
                            <div>
                                <label className=\"block text-xs font-medium text-gray-700 mb-1\">From Date</label>
                                <input 
                                    type=\"date\" 
className =\"w-full p-2 border border-gray-200 rounded-lg\"
value = { requestForm.fromDate }
onChange = {(e) => setRequestForm({ ...requestForm, fromDate: e.target.value })}
                                />
                            </div >
                            <div>
                                <label className=\"block text-xs font-medium text-gray-700 mb-1\">To Date</label>
                                <input 
                                    type=\"date\" 
className =\"w-full p-2 border border-gray-200 rounded-lg\"
value = { requestForm.toDate }
onChange = {(e) => setRequestForm({ ...requestForm, toDate: e.target.value })}
                                />
                            </div >
                        </div >
    <div className=\"flex justify-end gap-2\">
        < button
type =\"button\"
onClick = {() => setShowRequestForm(false)}
className =\"px-4 py-2 text-gray-500 hover:text-gray-700 text-sm\"
    >
    Cancel
                            </button >
    <button
        type=\"submit\"
className =\"px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm\"
    >
    Submit Request
                            </button >
                        </div >
                    </form >
                )}

<div className=\"overflow-x-auto\">
    < table className =\"w-full text-left\">
        < thead >
        <tr className=\"border-b border-gray-100 text-sm text-gray-500\">
            < th className =\"pb-3\">Type</th>
                < th className =\"pb-3\">Description</th>
                    < th className =\"pb-3\">From</th>
                        < th className =\"pb-3\">Status</th>
                            </tr >
                        </thead >
    <tbody className=\"text-sm\">
{
    requests.map((req) => (
        <tr key={req._id} className=\"border-b last:border-0 border-gray-50\">
    < td className =\"py-3\">
    < span className = {`px-2 py-1 rounded-md text-xs font-medium
                                            ${req.type === 'Grievance' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}
                                        `}>
    { req.type }
                                        </span >
                                    </td >
    <td className=\"py-3 text-gray-600\">{req.description}</td>
        < td className =\"py-3 text-gray-500\">{req.fromDate ? new Date(req.fromDate).toLocaleDateString() : '-'}</td>
            < td className =\"py-3\">
                < span className = {`px-2 py-1 rounded-full text-xs font-medium
                                            ${req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        req.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'}
                                        `}>
    { req.status }
                                        </span >
                                    </td >
                                </tr >
                            ))}
                        </tbody >
                    </table >
                </div >
            </div >
        </div >
    );
};

export default StudentDashboard;
