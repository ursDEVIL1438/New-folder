import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import { Users, Building, Bell, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [noticeForm, setNoticeForm] = useState({ title: '', content: '', targetAudience: 'All' });

    const handlePostNotice = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/notices', { ...noticeForm, targetAudience: [noticeForm.targetAudience] });
            toast.success('Notice Posted Successfully');
            setNoticeForm({ title: '', content: '', targetAudience: 'All' });
        } catch (error) {
            toast.error('Failed to post notice');
        }
    };

    return (
        <div className=\"space-y-6\">
            < div >
            <h1 className=\"text-2xl font-bold text-gray-900\">Admin Overview</h1>
                < p className =\"text-gray-500\">Institution details and global settings</p>
            </div >

    <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6\">
        < StatCard title =\"Total Students\" value=\"1240\" icon={Users} color=\"primary\" />
            < StatCard title =\"Total Faculty\" value=\"85\" icon={Users} color=\"secondary\" />
                < StatCard title =\"Departments\" value=\"8\" icon={Building} color=\"accent\" />
                    < StatCard title =\"Complaints\" value=\"3\" icon={AlertTriangle} color=\"orange\" />
            </div >

    <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">
{/* Post Notice */ }
<div className=\"bg-white p-6 rounded-2xl shadow-sm border border-gray-100\">
    < h2 className =\"text-lg font-bold text-gray-900 mb-4\">Post Global Announcement</h2>
        < form onSubmit = { handlePostNotice } className =\"space-y-4\">
            < div >
            <label className=\"block text-xs font-medium text-gray-700 mb-1\">Title</label>
                < input
type =\"text\" 
required
className =\"w-full p-2 border border-gray-200 rounded-lg\"
value = { noticeForm.title }
onChange = {(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                            />
                        </div >
                        <div>
                            <label className=\"block text-xs font-medium text-gray-700 mb-1\">Target Audience</label>
                            <select 
                                className=\"w-full p-2 border border-gray-200 rounded-lg\"
value = { noticeForm.targetAudience }
onChange = {(e) => setNoticeForm({ ...noticeForm, targetAudience: e.target.value })}
                            >
    <option value=\"All\">All</option>
        < option value =\"Students\">Students</option>
            < option value =\"Faculty\">Faculty</option>
                            </select >
                        </div >
                        <div>
                            <label className=\"block text-xs font-medium text-gray-700 mb-1\">Content</label>
                            <textarea 
                                required
                                rows=\"4\"
className =\"w-full p-2 border border-gray-200 rounded-lg\"
value = { noticeForm.content }
onChange = {(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                            ></textarea >
                        </div >
    <button type=\"submit\" className=\"w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90\">
                            Publish Notice
                        </button >
                    </form >
                </div >

    {/* System Status / Recent Activity Mockup */ }
    < div className =\"bg-white p-6 rounded-2xl shadow-sm border border-gray-100\">
        < h2 className =\"text-lg font-bold text-gray-900 mb-4\">System Health & Logs</h2>
            < div className =\"space-y-4\">
{
    [1, 2, 3].map((i) => (
        <div key={i} className=\"flex items-center gap-3 text-sm p-3 bg-gray-50 rounded-lg\">
    < div className =\"w-2 h-2 rounded-full bg-green-500\"></div>
    < span className =\"flex-1 font-medium text-gray-700\">Database Backup Completed</span>
    < span className =\"text-gray-400\">2h ago</span>
                            </div >
                        ))
}
<div className=\"flex items-center gap-3 text-sm p-3 bg-red-50 rounded-lg\">
    < div className =\"w-2 h-2 rounded-full bg-red-500\"></div>
        < span className =\"flex-1 font-medium text-gray-700\">Multiple failed login attempts (Admin)</span>
            < span className =\"text-gray-400\">5h ago</span>
                        </div >
                    </div >
                </div >
            </div >
        </div >
    );
};

export default AdminDashboard;
