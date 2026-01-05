import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, ArrowRight } from 'lucide-react';
import Captcha from '../components/Captcha';
import PageTransition from '../components/PageTransition';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isCaptchaVerified) {
            setError('Please verify you are human.');
            return;
        }
        setLoading(true);
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="flex h-screen bg-slate-900">
                {/* Visual Side */}
                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                    <div className="relative z-10 p-12 text-center max-w-lg">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-5xl font-bold text-white mb-6">Track Your Greatness.</h1>
                            <p className="text-xl text-blue-200">Consistency is the key to mastery. Log your progress, build streaks, and achieve your goals.</p>
                        </motion.div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                    <div className="absolute inset-0 bg-slate-900"></div> {/* Fallback background */}
                    <div className="absolute top-0 right-0 p-12 opacity-50">
                        <div className="w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 p-12 opacity-50">
                        <div className="w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 w-full max-w-md"
                    >
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                            <p className="text-slate-400">Sign in to continue your streak</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Username / Email</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                        placeholder="Enter username or email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <Captcha onVerify={setIsCaptchaVerified} />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 group"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition" />}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-slate-400">
                            Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition">Sign up now</Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
}
