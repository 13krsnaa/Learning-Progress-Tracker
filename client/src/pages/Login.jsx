
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, User, Lock, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { actions } = useAppContext();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Mock authentication - in production, this would call an API
            if (username && password) {
                const mockUser = {
                    id: Date.now().toString(),
                    username: username,
                    email: `${username}@example.com`,
                    displayName: username.charAt(0).toUpperCase() + username.slice(1),
                    avatar: null,
                    joinDate: new Date().toISOString()
                };

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                actions.setUser(mockUser);
                actions.claimDailyLogin(); // Claim daily login bonus on first login
                navigate('/');
            } else {
                setError('Please enter both username and password');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                    style={{ top: '10%', left: '10%' }}
                />
                <motion.div
                    className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 100, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                    style={{ bottom: '10%', right: '10%' }}
                />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Welcome Message */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center mb-4">
                        <BookOpen className="text-white mr-3" size={40} />
                        <h1 className="text-4xl font-bold text-white">Welcome Back!</h1>
                    </div>
                    <p className="text-xl text-white/80">
                        Ready to continue your learning journey?
                    </p>
                    <p className="text-sm text-white/60 mt-2">
                        Track your progress and achieve your goals
                    </p>
                </motion.div>

                {/* Login Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <GlassCard className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username Field */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter your username"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Sparkles size={20} />
                                    </motion.div>
                                ) : (
                                    <>
                                        <LogIn size={20} />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Demo Account Info */}
                        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-sm text-white/60 text-center">
                                <span className="font-medium text-white/80">Demo Account:</span> Use any username and password to try the app
                            </p>
                        </div>

                        {/* Motivational Message */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-6 text-center"
                        >
                            <p className="text-sm text-white/60 flex items-center justify-center gap-2">
                                <Sparkles size={16} className="text-yellow-400" />
                                Every learning session brings you closer to your goals!
                            </p>
                        </motion.div>
                    </GlassCard>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-center"
                >
                    <p className="text-sm text-white/40">
                        Start your journey to better learning today
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
