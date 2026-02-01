import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    GraduationCap,
    Users,
    FileText,
    LogOut,
    Menu,
    X,
    Bell,
    Settings
} from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getNavItems = () => {
        if (!user) return [];
        switch (user.role) {
            case 'student':
                return [
                    { name: 'Dashboard', path: '/student', icon: <LayoutDashboard size={20} /> },
                    // In a real app, these might be separate pages
                    // { name: 'My Attendance', path: '/student/attendance', icon: <UserCheck size={20} /> }, 
                ];
            case 'faculty':
                return [
                    { name: 'Dashboard', path: '/faculty', icon: <LayoutDashboard size={20} /> },
                ];
            case 'admin':
                return [
                    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
                ];
            default: return [];
        }
    };

    return (
        <div className=\"min-h-screen bg-gray-50 flex flex-col md:flex-row\">
    {/* Sidebar - Mobile Overlay */ }
    {
        isSidebarOpen && (
            <div
                className=\"fixed inset-0 bg-black/50 z-20 md:hidden\"
        onClick = {() => setIsSidebarOpen(false)}
                />
            )}

{/* Sidebar */ }
<aside className={`
                fixed md:static inset-y-0 left-0 z-30
                w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}>
    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
            <img src="https://aits-tpt.edu.in/wp-content/uploads/2018/08/logo.png" alt="AITS Logo" className="h-8 w-auto object-contain" />
            <div>
                <span className="block text-sm font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
                    AITS TIRUPATI
                </span>
                <span className="block text-[10px] text-gray-400 font-medium tracking-wide">
                    SMART CAMPUS
                </span>
            </div>
        </div>
        <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
        >
            <X size={24} />
        </button>
    </div>

    <nav className="p-4 space-y-1">
        < div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menu
        </div >
        {
            getNavItems().map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                ${isActive
                            ? 'bg-primary/10 text-primary font-medium shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                            `}
                >
                    {item.icon}
                    <span>{item.name}</span>
                </NavLink>
            ))
        }
    </nav >

    <div className=\"absolute bottom-0 w-full p-4 border-t border-gray-100\">
    < button
        onClick={handleLogout}
        className=\"flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-colors\"
    >
    <LogOut size={20} />
    <span>Logout</span>
</button >
                </div >
            </aside >

    {/* Main Content */ }
    < main className =\"flex-1 flex flex-col min-h-screen overflow-hidden\">
{/* Header */ }
<header className=\"h-16 glass z-10 sticky top-0 px-6 flex items-center justify-between\">
    < button
onClick = {() => setIsSidebarOpen(true)}
className =\"md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg\"
    >
    <Menu size={24} />
                    </button >

    <div className=\"flex items-center gap-4 ml-auto\">
        < button className =\"p-2 text-gray-400 hover:text-primary transition-colors relative\">
            < Bell size = { 20} />
                <span className=\"absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white\"></span>
                        </button >
    <div className=\"h-8 w-px bg-gray-200 mx-2\"></div>
        < div className =\"flex items-center gap-3\">
            < div className =\"text-right hidden sm:block\">
                < p className =\"text-sm font-medium text-gray-900\">{user?.name}</p>
                    < p className =\"text-xs text-gray-500 capitalize\">{user?.role}</p>
                            </div >
    <div className=\"w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border-2 border-white shadow-sm\">
{ user?.name?.charAt(0) }
                            </div >
                        </div >
                    </div >
                </header >

    {/* Page Content */ }
    < div className =\"flex-1 overflow-auto p-4 md:p-8\">
        < div className =\"max-w-7xl mx-auto space-y-8 fade-in\">
            < Outlet />
                    </div >
                </div >
            </main >
        </div >
    );
};

export default Layout;
