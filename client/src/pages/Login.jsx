import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const { success, message } = await login(email, password);
        setIsLoading(false);

        if (success) {
            toast.success('Welcome back!');
            // Navigation handled by DashboardRedirect in App.jsx or direct here if needed
            // navigate('/'); 
        } else {
            toast.error(message);
        }
    };

    return (
        <div className=\"min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center relative\">
    {/* Overlay */ }
    <div className=\"absolute inset-0 bg-gradient-to-br from-primary/90 to-purple-900/90 backdrop-blur-sm\"></div>

        < div className =\"relative z-10 w-full max-w-md p-4\">
            < div className =\"bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden\">
                < div className = "p-8 pb-6 text-center" >
                        <div className="w-20 h-20 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
                            <img src="https://aits-tpt.edu.in/wp-content/uploads/2018/08/logo.png" alt="AITS Logo" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">AITS Smart Campus</h1>
                        <p className="text-indigo-200 text-sm">Dept of AI & Data Science</p>
                    </div >

    <form onSubmit={handleSubmit} className=\"p-8 pt-0 space-y-6\">
        < div className =\"space-y-4\">
            < div >
            <label className=\"block text-sm font-medium text-indigo-100 mb-1.5 ml-1\">Email Address</label>
                < input
type =\"email\"
required
value = { email }
onChange = {(e) => setEmail(e.target.value)}
className =\"w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all\"
placeholder =\"Enter your email\"
    />
                            </div >
                            <div>
                                <label className=\"block text-sm font-medium text-indigo-100 mb-1.5 ml-1\">Password</label>
                                <input
                                    type=\"password\"
required
value = { password }
onChange = {(e) => setPassword(e.target.value)}
className =\"w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all\"
placeholder =\"Enter your password\"
    />
                            </div >
                        </div >

    <button
        type=\"submit\"
disabled = { isLoading }
className =\"w-full py-4 bg-white text-primary font-bold rounded-xl hover:bg-indigo-50 transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2\"
    >
{
    isLoading?<Loader2 className =\"animate-spin\" /> : 'Sign In'}
                        </button>
                    </form >

    <div className=\"p-4 bg-black/10 text-center border-t border-white/10\">
        < p className =\"text-xs text-indigo-200\">
                            For demo access, use provided credentials in README
                        </p >
                    </div >
                </div >
            </div >
        </div >
    );
};

export default Login;
