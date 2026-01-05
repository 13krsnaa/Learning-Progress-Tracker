
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, User, Lock, ArrowRight, Shield, Sparkles } from 'lucide-react';
import Captcha from '../components/Captcha';
import PageTransition from '../components/PageTransition';
import api from '../api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDebug, setShowDebug] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setShowDebug(false);

        if (!isCaptchaVerified) {
            setError('Please verify you are human.');
            return;
        }
        setLoading(true);
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            const isNetworkError = !err.response;
            const msg = isNetworkError
                ? 'Login failed. Please check your connection.'
                : (err.response?.data?.error || 'Login failed. Please check your credentials.');

            setError(msg);
            if (isNetworkError) setShowDebug(true);
            console.error('Login Error:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#020617] p-4">
                {/* Dynamic Background Lighting Effects */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[150px]"></div>

                {/* Floating Elements for extra depth */}
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 right-[15%] text-blue-400/20"
                >
                    <Sparkles size={120} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 w-full max-w-[450px]"
                >
                    <div className="glass rounded-[2rem] p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
                        {/* Decorative Top Glow */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                                className="inline-flex p-4 rounded-2xl bg-blue-500/10 text-blue-400 mb-4 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                            >
                                <Shield size={32} />
                            </motion.div>
                            <h2 className="text-4xl font-bold text-white tracking-tight mb-2">Welcome Back</h2>
                            <p className="text-slate-400 font-medium">Continue your elite journey</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex flex-col gap-3 backdrop-blur-sm"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">⚠️</div>
                                        <p className="flex-1">{error}</p>
                                    </div>

                                    {showDebug && (
                                        <div className="mt-1 p-3 bg-black/40 rounded-lg border border-white/10 text-[10px] font-mono leading-relaxed">
                                            <p className="text-white mb-1 font-bold">📡 Connection Diagnostic:</p>
                                            <p className="text-slate-400">Target URL: <span className="text-blue-400 underline">{api.defaults.baseURL}</span></p>
                                            <p className="text-slate-500 mt-2 italic text-[9px]">Check if the server is running on your PC and if you can reach it via IP.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2 group">
                                <label className="text-sm font-semibold text-slate-300 ml-1">Identity</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                        placeholder="Username or email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-sm font-semibold text-slate-300 ml-1">Passphrase</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="py-2">
                                <Captcha onVerify={setIsCaptchaVerified} />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)' }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Decrypting...
                                    </div>
                                ) : (
                                    <>
                                        Authorize Access <ArrowRight size={20} />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-slate-500 font-medium">
                                New operative? <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition-colors font-bold underline underline-offset-4 decoration-blue-500/30">Request Credentials</Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer Branding */}
                    <div className="mt-8 flex items-center justify-center gap-2 text-slate-600 text-xs font-bold uppercase tracking-[0.2em]">
                        <div className="w-8 h-[1px] bg-slate-800"></div>
                        Learning Progress Tracker v2.0
                        <div className="w-8 h-[1px] bg-slate-800"></div>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
