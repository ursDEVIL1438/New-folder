
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart,
    Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
    Bell, ChevronLeft, ChevronRight, LayoutDashboard, User, BookOpen,
    FileText, LogOut, Search, Menu, X, Check, Eye, EyeOff, Lock, Mail,
    UploadCloud, Calendar, Clock, AlertTriangle, CheckCircle, XCircle, Info,
    MoreVertical, Filter, Download, Plus, Trash2, Edit, ChevronDown, Award,
    GraduationCap, Home, Settings, Briefcase, Users, FileBarChart, Layers
} from 'lucide-react';
import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

/* -------------------------------------------------------------------------- */
/*                                FIREBASE CONFIG                             */
/* -------------------------------------------------------------------------- */

const firebaseConfig = {
    apiKey: "AIzaSyDQRYluV_fvYl6AYm99hRlqCrg9sN2pwiU",
    authDomain: "travel-app-d53ed.firebaseapp.com",
    projectId: "travel-app-d53ed",
    storageBucket: "travel-app-d53ed.firebasestorage.app",
    messagingSenderId: "977567743493",
    appId: "1:977567743493:web:1223dbacd2f7997b40666c",
    measurementId: "G-CE9ZFF3CGJ"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

/* -------------------------------------------------------------------------- */
/*                                CONSTANTS & DATA                            */
/* -------------------------------------------------------------------------- */

// --- Design Tokens ---
const COLORS = {
    cyan: '#22d3ee', // cyan-400
    emerald: '#34d399', // emerald-400
    purple: '#c084fc', // purple-400
    pink: '#f472b6', // pink-400
    orange: '#fb923c', // orange-400
    slate800: '#1e293b',
    slate900: '#0f172a',
    slate950: '#020814',
};

// --- Mock Data: Users ---
const INITIAL_STUDENTS = [
    { id: 'S001', name: 'Rahul Sharma', email: 'rahul@campus.edu', password: 'password', roll: '22CS001', dept: 'Computer Science', year: 3, attendance: 87, gpa: 3.82 },
    { id: 'S002', name: 'Priya Reddy', email: 'priya@campus.edu', password: 'password', roll: '22CS002', dept: 'Computer Science', year: 3, attendance: 92, gpa: 3.95 },
];

const INITIAL_FACULTY = [
    { id: 'F001', name: 'Dr. C. Nadhamuni Reddy', email: 'nadhamuni@campus.edu', password: 'password', dept: 'Computer Science', active: true },
];

const INITIAL_ADMINS = [
    { id: 'A001', name: 'Admin User', email: 'admin@campus.edu', password: 'password', role: 'Administrator' },
];

// --- Mock Data: Notifications ---
const NOTIFICATIONS = [
    { id: 1, text: "New assignment uploaded for CS101", time: "2m ago", type: 'academic', read: false },
    { id: 2, text: "Campus maintainence scheduled tomorrow", time: "1h ago", type: 'info', read: false },
    { id: 3, text: "Your leave request was approved", time: "3h ago", type: 'success', read: false },
];

// --- Mock Data: Student Grades ---
const GRADES_DATA = [
    { subject: 'Data Structures', credits: 4, internal: 22, external: 68, total: 90, grade: 'A', status: 'Pass' },
    { subject: 'Linear Algebra', credits: 3, internal: 18, external: 55, total: 73, grade: 'B', status: 'Pass' },
    { subject: 'Digital Logic', credits: 3, internal: 20, external: 60, total: 80, grade: 'A', status: 'Pass' },
    { subject: 'Python Lab', credits: 2, internal: 24, external: 70, total: 94, grade: 'A+', status: 'Pass' },
    { subject: 'Soft Skills', credits: 1, internal: 23, external: 65, total: 88, grade: 'A', status: 'Pass' },
];

// --- Mock Data: Charts ---
const GPA_TREND_DATA = [
    { sem: 'Sem 1', gpa: 3.6 },
    { sem: 'Sem 2', gpa: 3.72 },
    { sem: 'Sem 3', gpa: 3.8 },
    { sem: 'Sem 4', gpa: 3.75 },
    { sem: 'Sem 5', gpa: 3.82 },
];

const ATTENDANCE_MONTHLY = [
    { month: 'Aug', present: 22, absent: 2 },
    { month: 'Sep', present: 20, absent: 4 },
    { month: 'Oct', present: 23, absent: 1 },
    { month: 'Nov', present: 19, absent: 3 },
    { month: 'Dec', present: 15, absent: 0 }, // Semester break
    { month: 'Jan', present: 18, absent: 2 },
];

/* -------------------------------------------------------------------------- */
/*                                UTILITY COMPONENTS                          */
/* -------------------------------------------------------------------------- */

const ParticleBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const particles = [];
        const colors = ['#00b4d8', '#06d6a0', '#a855f7', '#ec4899'];
        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                size: Math.random() * 2 + 1,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(148, 163, 184, ${0.15 * (1 - distance / 120)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

const Modal = ({ isOpen, title, content, onConfirm, onClose, type = 'default' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
                <div className="flex justify-between items-center p-5 border-b border-slate-700/50">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition"><X size={24} /></button>
                </div>
                <div className="p-6 text-slate-300">
                    {content}
                </div>
                {(onConfirm || type === 'confirm') && (
                    <div className="p-5 border-t border-slate-700/50 flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-700 transition">Cancel</button>
                        <button onClick={onConfirm} className={`px-4 py-2 rounded-xl font-semibold text-white shadow-lg transition transform hover:scale-105 ${type === 'alert' ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'}`}>
                            Confirm
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*                            MAIN APPLICATION COMPONENT                      */
/* -------------------------------------------------------------------------- */

export default function CampusSync() {
    const [currentPage, setCurrentPage] = useState('home');
    const [currentUser, setCurrentUser] = useState(null); // { name, email, role, ... }

    // Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in, fetch profile
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setCurrentUser({ ...userData, id: user.uid, email: user.email });
                    }
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            } else {
                setCurrentUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Dashboard internal state
    const [dashboardTab, setDashboardTab] = useState('home');

    // Toasts
    const [toasts, setToasts] = useState([]);
    const addToast = (type, title, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, title, message }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    // Search Modal
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Global Key Listener for Search
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(prev => !prev);
            }
            if (e.key === 'Escape') setSearchOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // --- Handlers ---
    const handleLogin = async (role, email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // 1. Fetch User Data
            const docRef = doc(db, "users", userCredential.user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                // Role validation (optional but good for UX)
                if (data.role !== role && role !== 'admin') {
                    addToast('warning', 'Role Mismatch', `Note: You are registered as a ${data.role}.`);
                }

                setCurrentPage(`${data.role}-dashboard`);
                setDashboardTab('home');
                addToast('success', 'Welcome back!', `Logged in as ${data.name}`);
            } else {
                // Fallback: Auth successful but no profile? Should not happen if signup works.
                console.error("No user profile found in Firestore");
                setCurrentPage(`${role}-dashboard`);
            }
        } catch (error) {
            console.error("Login Result:", error);
            let msg = "Invalid email or password.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                msg = "Invalid email or password.";
            }
            addToast('error', 'Login Failed', msg);
        }
    };

    const handleSignup = async (role, formData) => {
        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // 2. Prepare User Data
            const userData = {
                name: formData.name,
                role: role,
                dept: formData.dept,
                email: formData.email,
                active: true,
                createdAt: new Date().toISOString()
            };
            // Add student specific fields
            if (role === 'student') {
                userData.roll = formData.roll;
                userData.year = 1;
                userData.attendance = 0;
                userData.gpa = 0.0;
            }

            // 3. Save to Firestore
            await setDoc(doc(db, "users", user.uid), userData);

            // 4. Update Profile Display Name
            await updateProfile(user, { displayName: formData.name });

            addToast('success', 'Account Created', 'You have been signed in.');

            // 5. Redirect
            setCurrentUser({ ...userData, id: user.uid });
            setCurrentPage(`${role}-dashboard`);
            setDashboardTab('home');

        } catch (error) {
            console.error(error);
            let msg = "Could not create account.";
            if (error.code === 'auth/email-already-in-use') msg = "Email already registered.";
            if (error.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
            addToast('error', 'Signup Failed', msg);
        }
    };

    const handleUpdateProfile = (updatedUser) => {
        // Update local session
        setCurrentUser(updatedUser);

        // Update global state
        if (updatedUser.role === 'student') {
            setUsers(prev => ({
                ...prev,
                students: prev.students.map(u => u.id === updatedUser.id ? updatedUser : u)
            }));
        } else if (updatedUser.role === 'faculty') {
            setUsers(prev => ({
                ...prev,
                faculty: prev.faculty.map(u => u.id === updatedUser.id ? updatedUser : u)
            }));
        }
        addToast('success', 'Profile Updated', 'Your changes have been saved.');
    };

    const handleLogout = async () => {
        await signOut(auth);
        setCurrentUser(null);
        setCurrentPage('home');
        addToast('info', 'Logged Out', 'You have been successfully logged out.');
    };

    const handleForgotPassword = async (email) => {
        if (!email) {
            addToast('error', 'Error', 'Please enter your email address first in the login field.');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            addToast('success', 'Email Sent', 'Check your inbox for password reset instructions.');
        } catch (error) {
            console.error("Reset Password Error:", error);
            let msg = "Could not send reset email.";
            if (error.code === 'auth/user-not-found') msg = "No user found with this email.";
            addToast('error', 'Failed', msg);
        }
    };

    // --- Global Styles for keyframes handled via style tag mostly, except Tailwind ones ---
    // Tailwind handles animate-pulse, animate-spin, animate-ping.
    // We need custom keyframes for some transitions if not in Tailwind standard configuration.

    return (
        <div className="min-h-screen text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden relative bg-[#020814]">
            {/* Background */}
            <ParticleBackground />

            {/* Toast Container */}
            <div className="fixed top-24 right-6 z-[100] flex flex-col gap-4 w-80 pointer-events-none">
                {toasts.map(toast => (
                    <div key={toast.id} className={`pointer-events-auto bg-slate-800/90 backdrop-blur-md rounded-xl p-4 shadow-2xl border-l-[6px] flex gap-3 animate-slide-in relative overflow-hidden ${toast.type === 'success' ? 'border-emerald-500' :
                        toast.type === 'error' ? 'border-red-500' :
                            toast.type === 'warning' ? 'border-yellow-500' : 'border-cyan-500'
                        }`}>
                        <div className={`${toast.type === 'success' ? 'text-emerald-400' :
                            toast.type === 'error' ? 'text-red-400' :
                                toast.type === 'warning' ? 'text-yellow-400' : 'text-cyan-400'
                            }`}>
                            {toast.type === 'success' ? <CheckCircle size={20} /> :
                                toast.type === 'error' ? <XCircle size={20} /> :
                                    toast.type === 'warning' ? <AlertTriangle size={20} /> : <Info size={20} />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm text-white">{toast.title}</h4>
                            <p className="text-xs text-slate-300 mt-1">{toast.message}</p>
                        </div>
                        <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="absolute top-2 right-2 text-slate-500 hover:text-white">
                            <X size={14} />
                        </button>
                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 h-[3px] bg-slate-600/30 w-full">
                            <div className="h-full bg-white/30 animate-shrink-width" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Global Search Modal */}
            {searchOpen && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-32 animate-fade-in p-4">
                    <div className="w-full max-w-xl bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="flex items-center gap-3 p-4 border-b border-slate-700">
                            <Search className="text-cyan-400" size={24} />
                            <input
                                type="text"
                                autoFocus
                                placeholder="Search students, faculty, notices..."
                                className="bg-transparent border-none outline-none text-lg text-white w-full placeholder-slate-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button onClick={() => setSearchOpen(false)} className="text-xs px-2 py-1 rounded border border-slate-600 text-slate-400">ESC</button>
                        </div>
                        <div className="p-2 max-h-96 overflow-y-auto">
                            {(searchQuery ? ['Dr. Reddy', 'Rahul Sharma', 'Sem Exam Schedule'] : ['Type to search...']).map((res, i) => (
                                <div key={i} className="p-3 hover:bg-slate-700/50 rounded-xl cursor-pointer flex items-center gap-3 transition-colors group" onClick={() => { setSearchOpen(false); addToast('info', 'Navigated', `Jumped to ${res}`); }}>
                                    <div className="p-2 rounded-lg bg-slate-700 group-hover:bg-cyan-500/20 text-slate-400 group-hover:text-cyan-400 transition-colors">
                                        <ChevronRight size={16} />
                                    </div>
                                    <span className="text-slate-300 group-hover:text-white">{res}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 h-16 z-50 px-4 md:px-8 flex items-center justify-between border-b border-white/5 bg-[#020814]/80 backdrop-blur-[20px]">
                {/* Brand */}
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentPage('home')}>
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20 group-hover:bg-cyan-500/20 group-hover:rotate-12 transition-all duration-500">
                        <div className="w-6 h-6 border-2 border-cyan-400 transform rotate-45"></div>
                    </div>
                    <div className="font-bold text-xl tracking-tight">
                        <span className="text-cyan-400">Campus</span>
                        <span className="text-white">Sync</span>
                    </div>
                </div>

                {/* Center Nav (Landing Only) */}
                {!currentUser && (
                    <div className="hidden md:flex items-center gap-8">
                        {['Home', 'Features', 'About'].map(item => (
                            <button key={item} onClick={() => setCurrentPage(item.toLowerCase())} className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors relative group">
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {!currentUser ? (
                        <button onClick={() => setCurrentPage('login')} className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-full text-sm font-medium border border-slate-700 transition-transform active:scale-95">
                            Sign In
                        </button>
                    ) : (
                        <>
                            <button className="relative p-2 text-slate-400 hover:text-white transition group">
                                <Bell size={20} />
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 group-hover:animate-ping"></span>
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>
                            </button>
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
                                <div className={`w-2 h-2 rounded-full ${currentUser.role === 'student' ? 'bg-cyan-400' : currentUser.role === 'faculty' ? 'bg-purple-400' : 'bg-orange-400'}`}></div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">{currentUser.role}</span>
                            </div>
                            <div className="relative group">
                                <button className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-bold flex items-center justify-center hover:bg-cyan-500/30 transition">
                                    {currentUser.name.charAt(0)}
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100 flex flex-col p-1">
                                    <button onClick={() => setDashboardTab('profile')} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 rounded-lg text-sm text-slate-300 hover:text-white transition text-left"><User size={16} /> Profile</button>
                                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 rounded-lg text-sm text-slate-300 hover:text-white transition text-left"><Settings size={16} /> Settings</button>
                                    <div className="h-px bg-slate-700 my-1"></div>
                                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 rounded-lg text-sm text-red-400 hover:text-red-300 transition text-left"><LogOut size={16} /> Logout</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </nav>

            {/* Main Content Area */}
            <div className={`pt-16 min-h-screen transition-all duration-300 ${currentUser && sidebarOpen ? 'md:pl-64' : ''} ${currentUser ? 'pb-20 md:pb-0' : ''}`}>

                {/* Sidebar (Only when logged in) */}
                {currentUser && (
                    <>
                        <aside className={`fixed left-0 top-16 bottom-0 z-40 bg-slate-900/90 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-300 overflow-y-auto hidden md:block ${sidebarOpen ? 'w-64' : 'w-20'}`}>
                            <div className="p-4 flex flex-col h-full">
                                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="self-end p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition mb-6">
                                    {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                                </button>

                                <div className="space-y-6 flex-1">
                                    <div className="space-y-1">
                                        {sidebarOpen && <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Main</p>}
                                        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={dashboardTab === 'home'} onClick={() => setDashboardTab('home')} collapsed={!sidebarOpen} />
                                        <NavItem icon={<Bell size={20} />} label="Notices" active={dashboardTab === 'notices'} onClick={() => setDashboardTab('notices')} collapsed={!sidebarOpen} />
                                    </div>

                                    <div className="space-y-1">
                                        {sidebarOpen && <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Academics</p>}
                                        {currentUser.role === 'student' && (
                                            <>
                                                <NavItem icon={<Calendar size={20} />} label="Attendance" active={dashboardTab === 'attendance'} onClick={() => setDashboardTab('attendance')} collapsed={!sidebarOpen} />
                                                <NavItem icon={<BookOpen size={20} />} label="Academics" active={dashboardTab === 'academics'} onClick={() => setDashboardTab('academics')} collapsed={!sidebarOpen} />
                                                <NavItem icon={<FileText size={20} />} label="Requests" active={dashboardTab === 'requests'} onClick={() => setDashboardTab('requests')} collapsed={!sidebarOpen} />
                                            </>
                                        )}
                                        {currentUser.role === 'faculty' && (
                                            <>
                                                <NavItem icon={<Users size={20} />} label="Attendance" active={dashboardTab === 'attendance'} onClick={() => setDashboardTab('attendance')} collapsed={!sidebarOpen} />
                                                <NavItem icon={<Award size={20} />} label="Marks Entry" active={dashboardTab === 'marks'} onClick={() => setDashboardTab('marks')} collapsed={!sidebarOpen} />
                                                <NavItem icon={<CheckCircle size={20} />} label="Approvals" active={dashboardTab === 'approvals'} onClick={() => setDashboardTab('approvals')} collapsed={!sidebarOpen} />
                                            </>
                                        )}
                                        {currentUser.role === 'admin' && (
                                            <>
                                                <NavItem icon={<FileBarChart size={20} />} label="Analytics" active={dashboardTab === 'analytics'} onClick={() => setDashboardTab('analytics')} collapsed={!sidebarOpen} />
                                                <NavItem icon={<Users size={20} />} label="Users" active={dashboardTab === 'users'} onClick={() => setDashboardTab('users')} collapsed={!sidebarOpen} />
                                                <NavItem icon={<Layers size={20} />} label="Reports" active={dashboardTab === 'reports'} onClick={() => setDashboardTab('reports')} collapsed={!sidebarOpen} />
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-slate-800">
                                    <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 ${!sidebarOpen && 'justify-center'}`}>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 p-0.5">
                                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold">
                                                {currentUser.name.substring(0, 2).toUpperCase()}
                                            </div>
                                        </div>
                                        {sidebarOpen && (
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                                                <p className="text-xs text-slate-400 truncate capitalize">{currentUser.role}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </aside>
                        {/* Mobile Bottom Nav */}
                        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/50 flex justify-around items-center z-50">
                            <button onClick={() => setDashboardTab('home')} className={`p-2 rounded-xl transition ${dashboardTab === 'home' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'}`}><LayoutDashboard size={24} /></button>
                            <button onClick={() => setDashboardTab('attendance')} className={`p-2 rounded-xl transition ${dashboardTab === 'attendance' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'}`}><Calendar size={24} /></button>
                            {currentUser.role === 'student' && <button onClick={() => setDashboardTab('academics')} className={`p-2 rounded-xl transition ${dashboardTab === 'academics' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'}`}><BookOpen size={24} /></button>}
                            {currentUser.role === 'faculty' && <button onClick={() => setDashboardTab('marks')} className={`p-2 rounded-xl transition ${dashboardTab === 'marks' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'}`}><Award size={24} /></button>}
                            <button onClick={() => setDashboardTab('profile')} className={`p-2 rounded-xl transition ${dashboardTab === 'profile' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'}`}><User size={24} /></button>
                        </div>
                    </>
                )}

                {/* PAGE ROUTING */}
                <main className="p-6 max-w-7xl mx-auto">
                    {currentPage === 'home' && <LandingPage onNavigate={setCurrentPage} onLoginRequest={() => setCurrentPage('login')} />}
                    {currentPage === 'home' && <LandingPage onNavigate={setCurrentPage} onLoginRequest={() => setCurrentPage('login')} />}
                    {currentPage === 'login' && <LoginPage onLogin={handleLogin} onSignupClick={() => setCurrentPage('signup')} onBack={() => setCurrentPage('home')} onForgotPassword={handleForgotPassword} />}
                    {currentPage === 'signup' && <SignupPage onSignup={handleSignup} onBack={() => setCurrentPage('login')} />}
                    {currentPage === 'signup' && <SignupPage onSignup={handleSignup} onBack={() => setCurrentPage('login')} />}
                    {currentPage === 'features' && <FeaturesPage />}
                    {currentPage === 'about' && <AboutPage />}

                    {currentPage === 'student-dashboard' && <StudentDashboard tab={dashboardTab} user={currentUser} onUpdateProfile={handleUpdateProfile} />}
                    {currentPage === 'faculty-dashboard' && <FacultyDashboard tab={dashboardTab} user={currentUser} onUpdateProfile={handleUpdateProfile} />}
                    {currentPage === 'admin-dashboard' && <AdminDashboard tab={dashboardTab} />}
                </main>
            </div>
        </div>
    );
}

const NavItem = ({ icon, label, active, onClick, collapsed }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
        ${active ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
    >
        <div className="relative z-10">{icon}</div>
        {!collapsed && <span className="font-medium text-sm whitespace-nowrap opacity-100 transition-opacity">{label}</span>}
        {collapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
                {label}
            </div>
        )}
    </button>
);

/* -------------------------------------------------------------------------- */
/*                                SUB-PAGES & DASHBOARDS                      */
/* -------------------------------------------------------------------------- */

// --- Landing Page ---
const LandingPage = ({ onNavigate, onLoginRequest }) => {
    const [wordIndex, setWordIndex] = useState(0);
    const words = ["Attendance", "Grading", "Notices", "Requests", "Analytics"];

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex(prev => (prev + 1) % words.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center pt-10 pb-20 animate-fade-in text-center">
            {/* Hero */}
            <div className="min-h-[80vh] flex flex-col justify-center items-center max-w-4xl mx-auto relative z-10 px-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8 backdrop-blur-md animate-bounce-slow">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span className="text-sm font-medium text-cyan-200">Powered by AI & ML · Next Gen Campus Tech</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1]">
                    The Future of Campus <br />
                    Management is <br />
                    <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent inline-block min-w-[300px] transition-all duration-500 transform translate-y-0">
                        {words[wordIndex]}
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
                    Streamline your institution's workflow with CampusSync. An all-in-one platform for students, faculty, and administrators.
                </p>

                <div className="flex items-center gap-4">
                    <button onClick={() => onNavigate('login')} className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300">
                        Get Started Free
                    </button>
                    <button onClick={() => onLoginRequest('admin')} className="px-8 py-4 rounded-full border border-slate-600 text-white font-semibold hover:border-cyan-400 hover:text-cyan-400 flex items-center gap-2 transition-all duration-300">
                        Live Demo <span>▶</span>
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl mb-32 px-4">
                {[
                    { label: "Students", value: "15,000+", icon: <Users size={24} />, color: "from-cyan-500 to-blue-500" },
                    { label: "Faculty", value: "800+", icon: <GraduationCap size={24} />, color: "from-purple-500 to-pink-500" },
                    { label: "Uptime", value: "99.9%", icon: <Layers size={24} />, color: "from-emerald-500 to-green-500" },
                    { label: "Rating", value: "4.9★", icon: <Award size={24} />, color: "from-orange-500 to-yellow-500" }
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/30 transition-all hover:-translate-y-1">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                            {stat.icon}
                        </div>
                        <h3 className="text-3xl font-mono font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-slate-400 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Features Preview */}
            <div className="max-w-6xl w-full px-4 mb-20 text-left">
                <h2 className="text-4xl font-bold mb-12 text-center">Everything You Need</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: "Smart Attendance", desc: "Automated tracking using biometric & location data.", icon: <Clock /> },
                        { title: "Grade Management", desc: "Seamless grading system with analytics.", icon: <FileBarChart /> },
                        { title: "Real-Time Notices", desc: "Instant communication across campus.", icon: <Bell /> },
                        { title: "Leave Requests", desc: "Digital workflow for OD and leave approvals.", icon: <FileText /> },
                    ].map((feat, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700 hover:bg-slate-800/60 transition group cursor-pointer">
                            <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                                {feat.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                            <p className="text-slate-400 text-sm">{feat.desc}</p>
                            <div className="mt-4 text-cyan-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">Learn more →</div>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="w-full border-t border-slate-800 mt-20 p-8 text-center text-slate-500 text-sm">
                <p>© 2026 CampusSync. Built for Code Drift Hackathon.</p>
            </footer>
        </div>
    );
};

// --- Login Page ---
const LoginPage = ({ onLogin, onSignupClick, onBack, onForgotPassword }) => {
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // hardcoded demo check for ease of access
            if (email === '' || password === '') {
                // Demo bypass if empty (optional, but better to enforce)
                // Keeping existing demo behavior for "demo/demo123" if you want
            }
            // Logic handled in parent
            onLogin(role, email || (role === 'admin' ? 'admin@campus.edu' : role === 'faculty' ? 'nadhamuni@campus.edu' : 'rahul@campus.edu'), password || 'password');
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4 animate-fade-in">
            <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={onBack}>
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                        <div className="w-4 h-4 border-2 border-cyan-400 rotate-45"></div>
                    </div>
                    <span className="font-bold text-xl text-white">CampusSync</span>
                </div>

                <div className="flex p-1 bg-slate-900/50 rounded-xl mb-8 relative">
                    <div className={`absolute top-1 bottom-1 w-[32%] bg-slate-700 rounded-lg shadow transition-all duration-300 ${role === 'student' ? 'left-1' : role === 'faculty' ? 'left-[34%]' : 'left-[67%]'}`}></div>
                    {['student', 'faculty', 'admin'].map(r => (
                        <button key={r} onClick={() => setRole(r)} className={`flex-1 relative z-10 py-2 text-sm font-medium capitalize transition-colors ${role === r ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                            {r}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-slate-400">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3 text-slate-500 group-focus-within:text-cyan-400 transition" size={18} />
                            <input
                                type="email"
                                required // Made required
                                placeholder={role === 'admin' ? 'admin@campus.edu' : 'name@campus.edu'}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500 transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-slate-400">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 text-slate-500 group-focus-within:text-cyan-400 transition" size={18} />
                            <input
                                type="password"
                                required // Made required
                                placeholder="••••••••"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500 transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm py-2">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white">
                            <input type="checkbox" className="w-4 h-4 rounded bg-slate-700 border-none text-cyan-500 focus:ring-offset-0" />
                            Remember me
                        </label>
                        <button type="button" onClick={() => onForgotPassword(email)} className="text-cyan-400 hover:underline">Forgot password?</button>
                    </div>

                    <button disabled={loading} className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all ${role === 'student' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-cyan-500/25' :
                        role === 'faculty' ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-purple-500/25' :
                            'bg-gradient-to-r from-orange-500 to-red-500 shadow-orange-500/25'
                        } hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2`}>
                        {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-700/50 text-center">
                    <p className="text-slate-400 text-sm">
                        Don't have an account?{' '}
                        <button onClick={onSignupClick} className="text-cyan-400 font-bold hover:underline">
                            Create Account
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- Signup Page ---
const SignupPage = ({ onSignup, onBack }) => {
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        dept: '',
        roll: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onSignup(role, formData);
        }, 1500);
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4 animate-fade-in my-10">
            <div className="w-full max-w-lg bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 relative">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-2xl font-bold text-white">Create Account</h2>
                </div>

                <div className="flex p-1 bg-slate-900/50 rounded-xl mb-6">
                    {['student', 'faculty'].map(r => (
                        <button key={r} onClick={() => setRole(r)} className={`flex-1 py-2 text-sm font-medium capitalize rounded-lg transition-colors ${role === r ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
                            {r}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-400">Full Name</label>
                            <input name="name" required onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-cyan-400 transition" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-400">Department</label>
                            <select name="dept" required onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-cyan-400 transition text-slate-300">
                                <option value="">Select Dept</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Mechanical">Mechanical</option>
                            </select>
                        </div>
                    </div>

                    {role === 'student' && (
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-400">Roll Number</label>
                            <input name="roll" required onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-cyan-400 transition" placeholder="22CSXXXX" />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-slate-400">Email Address</label>
                        <input type="email" name="email" required onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-cyan-400 transition" placeholder="name@campus.edu" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-400">Password</label>
                            <input type="password" name="password" required onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-cyan-400 transition" placeholder="••••••••" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-400">Confirm Password</label>
                            <input type="password" name="confirmPassword" required onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-cyan-400 transition" placeholder="••••••••" />
                        </div>
                    </div>

                    <button disabled={loading} className="w-full mt-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-emerald-500 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2">
                        {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <p className="text-xs text-center text-slate-500 mt-4">
                        By signing up, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </form>
            </div>
        </div>
    );
};

// --- Components for Dashboards ---

const KPI = ({ title, value, sub, icon, color }) => (
    <div className="bg-slate-800/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-700 hover:border-slate-600 transition animate-scale-in">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-slate-400 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className={`p-2 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')} ${color}`}>
                {icon}
            </div>
        </div>
        {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
);

// --- Student Dashboard ---
const StudentDashboard = ({ tab, user, onUpdateProfile }) => {
    if (tab === 'profile') return <ProfilePage user={user} onSave={onUpdateProfile} />;

    if (tab === 'home') {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Good Morning, Rahul ☀️</h1>
                        <p className="text-slate-400">Here's your schedule for today.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm hover:border-cyan-400 transition shadow-sm">Mark Attendance</button>
                        <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm hover:border-cyan-400 transition shadow-sm">View Grades</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPI title="Attendance" value="87%" sub="Above requirement" icon={<Calendar size={20} />} color="text-emerald-400" />
                    <KPI title="CGPA" value="3.82" sub="Dean's List" icon={<Award size={20} />} color="text-purple-400" />
                    <KPI title="Requests" value="2" sub="Pending Approval" icon={<FileText size={20} />} color="text-orange-400" />
                    <KPI title="Notices" value="5" sub="3 Unread" icon={<Bell size={20} />} color="text-cyan-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                        <h3 className="font-bold mb-4 flex items-center gap-2"><Clock size={18} className="text-cyan-400" /> Today's Classes</h3>
                        <div className="space-y-3">
                            {[
                                { time: "09:00 - 10:00", subject: "Data Structures", room: "LH-101", status: "Present" },
                                { time: "10:00 - 11:00", subject: "Artificial Intelligence", room: "CS-Lab 2", status: "Upcoming" },
                                { time: "11:15 - 12:15", subject: "Linear Algebra", room: "LH-103", status: "Upcoming" },
                            ].map((cls, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 hover:bg-slate-900/80 transition border-l-4 border-l-cyan-500">
                                    <span className="text-sm font-mono text-slate-400 whitespace-nowrap">{cls.time}</span>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-200">{cls.subject}</h4>
                                        <p className="text-xs text-slate-500">{cls.room}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${cls.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                        {cls.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                        <h3 className="font-bold mb-4">Recent Activity</h3>
                        <div className="relative pl-4 space-y-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                            {[
                                { text: "Attendance marked for DS", time: "2 hrs ago", color: "bg-emerald-500" },
                                { text: "Submitted Assignment 3", time: "Yesterday", color: "bg-cyan-500" },
                                { text: "Leave request approved", time: "2 days ago", color: "bg-purple-500" },
                                { text: "Library book returned", time: "3 days ago", color: "bg-slate-500" },
                            ].map((act, i) => (
                                <div key={i} className="relative">
                                    <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full ${act.color} ring-4 ring-slate-800`}></div>
                                    <p className="text-sm text-slate-300">{act.text}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{act.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (tab === 'attendance') {
        return (
            <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold">Attendance Overview</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col items-center justify-center">
                        <div className="w-48 h-48 relative flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="96" cy="96" r="88" stroke="#334155" strokeWidth="12" fill="none" />
                                <circle cx="96" cy="96" r="88" stroke="#34d399" strokeWidth="12" fill="none" strokeDasharray="552" strokeDashoffset={552 - (552 * 0.87)} className="transition-all duration-1000 ease-out" />
                            </svg>
                            <div className="absolute text-center">
                                <span className="text-4xl font-bold text-white">87%</span>
                                <p className="text-slate-400 text-sm">Overall</p>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                        <h3 className="font-bold mb-4">Detailed Breakdown</h3>
                        <div className="space-y-4">
                            {[
                                { sub: "Data Structures", p: 24, t: 28, val: 85 },
                                { sub: "Artificial Intelligence", p: 22, t: 25, val: 88 },
                                { sub: "Linear Algebra", p: 18, t: 25, val: 72 }, // alert
                                { sub: "Python Lab", p: 15, t: 15, val: 100 },
                            ].map((s, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-200">{s.sub}</span>
                                        <span className={`${s.val < 75 ? 'text-red-400' : 'text-emerald-400'} font-bold`}>{s.val}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${s.val < 75 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${s.val}%` }}></div>
                                    </div>
                                    <div className="text-xs text-slate-500 text-right">{s.p}/{s.t} Classes</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (tab === 'academics') {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Academic Performance</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm hover:text-white"><Download size={16} /> Download Transcript</button>
                </div>

                {/* Grades Table */}
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="p-4">Subject</th>
                                <th className="p-4">Credits</th>
                                <th className="p-4">Internal</th>
                                <th className="p-4">External</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {GRADES_DATA.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-800/50 transition">
                                    <td className="p-4 font-medium text-white">{row.subject}</td>
                                    <td className="p-4 text-slate-400">{row.credits}</td>
                                    <td className="p-4 text-slate-400">{row.internal}</td>
                                    <td className="p-4 text-slate-400">{row.external}</td>
                                    <td className="p-4 font-bold text-white">{row.total}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${row.grade.startsWith('A') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                            {row.grade}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-80">
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                        <h3 className="font-bold mb-4">GPA Trend</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={GPA_TREND_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="sem" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                <Line type="monotone" dataKey="gpa" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4, fill: '#22d3ee' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                        <h3 className="font-bold mb-4">Credit Dist.</h3>
                        <div className="flex flex-col items-center justify-center h-full pb-8">
                            <div className="text-5xl font-bold text-white mb-2">3.82</div>
                            <p className="text-slate-400 uppercase tracking-widest text-sm">CGPA</p>
                            <div className="mt-4 flex gap-4">
                                <div className="text-center px-4 py-2 bg-slate-800 rounded-lg">
                                    <span className="block text-2xl font-bold text-emerald-400">124</span>
                                    <span className="text-xs text-slate-500">Credits Earned</span>
                                </div>
                                <div className="text-center px-4 py-2 bg-slate-800 rounded-lg">
                                    <span className="block text-2xl font-bold text-slate-400">180</span>
                                    <span className="text-xs text-slate-500">Total Req.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <div className="p-10 text-center text-slate-500">Section Under Construction</div>;
};

const FacultyDashboard = ({ tab, user, onUpdateProfile }) => {
    if (tab === 'profile') return <ProfilePage user={user} onSave={onUpdateProfile} />;

    return (
        <div className="animate-fade-in text-center p-20">
            <h1 className="text-3xl font-bold text-white mb-4">Faculty Portal</h1>
            <p className="text-slate-400">Welcome, Dr. Reddy. Access your classes and student data from the sidebar.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <KPI title="Students" value="142" icon={<Users size={24} />} color="text-cyan-400" />
                <KPI title="Today's Classes" value="3" icon={<Clock size={24} />} color="text-purple-400" />
                <KPI title="Pending Approvals" value="7" icon={<FileText size={24} />} color="text-orange-400" />
            </div>
        </div>
    );
};

const AdminDashboard = ({ tab }) => {
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
                <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
                    {['7D', '30D', '3M', '1Y'].map(r => (
                        <button key={r} className={`px-3 py-1 rounded text-xs font-semibold ${r === '30D' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}>{r}</button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <KPI title="Total Students" value="15,247" sub="↑ 12% vs last month" icon={<Users size={20} />} color="text-cyan-400" />
                <KPI title="Total Faculty" value="843" sub="↑ 3% new hires" icon={<GraduationCap size={20} />} color="text-purple-400" />
                <KPI title="Attendance" value="91.4%" sub="↑ 2.1% improvement" icon={<CheckCircle size={20} />} color="text-emerald-400" />
                <KPI title="System Health" value="99.9%" sub="All systems operational" icon={<Layers size={20} />} color="text-green-400" />
            </div>

            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 h-96 mb-8">
                <h3 className="font-bold mb-6">Attendance Trends (Last 6 Months)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ATTENDANCE_MONTHLY}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="month" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip cursor={{ fill: '#334155', opacity: 0.2 }} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                        <Legend />
                        <Bar dataKey="present" name="Avg Present" fill="#34d399" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="absent" name="Avg Absent" fill="#f87171" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// --- Features & About Placeholders ---
const FeaturesPage = () => <div className="p-20 text-center"><h1 className="text-4xl font-bold text-white">Feature Showcase</h1><p className="mt-4 text-slate-400">Explore the powerful tools CampusSync offers.</p></div>;
const AboutPage = () => <div className="p-20 text-center"><h1 className="text-4xl font-bold text-white">About CampusSync</h1><p className="mt-4 text-slate-400">Building the future of educational technology.</p></div>;

// --- Profile Page ---
const ProfilePage = ({ user, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave(formData);
        setIsEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden">
                {/* Header Banner */}
                <div className="h-48 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 relative">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] opacity-20 bg-cover bg-center"></div>
                    <button className="absolute top-4 right-4 p-2 bg-slate-900/50 backdrop-blur rounded-xl text-white hover:bg-slate-900 transition"><Edit size={18} /></button>
                </div>

                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6 flex justify-between items-end">
                        <div className="flex items-end gap-6">
                            <div className="w-32 h-32 rounded-2xl bg-slate-900 p-1">
                                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center text-5xl font-bold text-white shadow-inner">
                                    {user.name.charAt(0)}
                                </div>
                            </div>
                            <div className="mb-2">
                                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                                <p className="text-slate-400 font-medium flex items-center gap-2">
                                    {user.role === 'student' ? 'Student' : 'Faculty Member'} • {user.dept}
                                    {user.active && <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className={`px-6 py-2.5 rounded-xl font-bold transition shadow-lg flex items-center gap-2 ${isEditing ? 'bg-emerald-500 text-white shadow-emerald-500/20 hover:scale-105' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                        >
                            {isEditing ? <><Check size={18} /> Save Changes</> : <><Edit size={18} /> Edit Profile</>}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><User size={18} className="text-cyan-400" /> Personal Details</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <span className="text-sm text-slate-500">Full Name</span>
                                        {isEditing ?
                                            <input name="name" value={formData.name} onChange={handleChange} className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm outline-none focus:border-cyan-400" />
                                            : <span className="text-slate-200">{user.name}</span>
                                        }
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <span className="text-sm text-slate-500">Email</span>
                                        {isEditing ?
                                            <input name="email" value={formData.email} onChange={handleChange} className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm outline-none focus:border-cyan-400" />
                                            : <span className="text-slate-200">{user.email}</span>
                                        }
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <span className="text-sm text-slate-500">Password</span>
                                        {isEditing ?
                                            <input name="password" type="text" value={formData.password} onChange={handleChange} className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm outline-none focus:border-cyan-400" />
                                            : <span className="text-slate-200 font-mono">••••••••</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><GraduationCap size={18} className="text-purple-400" /> Academic Info</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <span className="text-sm text-slate-500">Department</span>
                                        {isEditing ?
                                            <select name="dept" value={formData.dept} onChange={handleChange} className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm outline-none focus:border-cyan-400">
                                                <option>Computer Science</option>
                                                <option>Electronics</option>
                                                <option>Mechanical</option>
                                            </select>
                                            : <span className="text-slate-200">{user.dept}</span>
                                        }
                                    </div>
                                    {user.roll && (
                                        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                            <span className="text-sm text-slate-500">Roll No</span>
                                            <span className="text-slate-200">{user.roll}</span>
                                        </div>
                                    )}
                                    {user.role === 'student' && (
                                        <>
                                            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                                <span className="text-sm text-slate-500">Year</span>
                                                <span className="text-slate-200">{user.year || 1}</span>
                                            </div>
                                            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                                <span className="text-sm text-slate-500">GPA</span>
                                                <span className="text-emerald-400 font-bold">{user.gpa || 'N/A'}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

