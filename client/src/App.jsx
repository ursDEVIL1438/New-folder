import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Protected Route Component
const PrivateRoute = ({ children, roles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" />; // Redirect to home/dashboard if role doesn't match
    }

    return children;
};

// Redirect based on role
const DashboardRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (user.role === 'student') return <Navigate to="/student" />;
    if (user.role === 'faculty') return <Navigate to="/faculty" />;
    if (user.role === 'admin') return <Navigate to="/admin" />;
    return <Navigate to="/login" />;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes wrapped in Layout */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<DashboardRedirect />} />

                        <Route path="student" element={
                            <PrivateRoute roles={['student']}>
                                <StudentDashboard />
                            </PrivateRoute>
                        } />

                        <Route path="faculty" element={
                            <PrivateRoute roles={['faculty']}>
                                <FacultyDashboard />
                            </PrivateRoute>
                        } />

                        <Route path="admin" element={
                            <PrivateRoute roles={['admin']}>
                                <AdminDashboard />
                            </PrivateRoute>
                        } />
                    </Route>
                </Routes>
                <ToastContainer position="top-right" autoClose={3000} />
            </Router>
        </AuthProvider>
    );
}

export default App;
