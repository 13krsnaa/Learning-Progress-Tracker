
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Trophy,
    BookOpen,
    LogOut,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Settings,
    Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
        { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
        { icon: BookOpen, label: 'Resources', path: '/resources' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <motion.div
            animate={{ width: collapsed ? 84 : 260 }}
            className="h-screen sticky top-0 glass border-r border-white/10 flex flex-col justify-between hidden md:flex z-50 transition-all duration-500 ease-in-out"
        >
            {/* Header / Logo */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <AnimatePresence mode="wait">
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-2"
                            >
                                <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                    <Sparkles size={18} className="text-blue-400" />
                                </div>
                                <h1 className="text-xl font-bold tracking-tight text-white">
                                    NEXUS<span className="text-blue-500">.</span>
                                </h1>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </motion.button>
                </div>

                {/* Nav Items */}
                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `group flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden ${isActive
                                    ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                                }`
                            }
                        >
                            <div className="relative z-10">
                                <item.icon size={22} className="transition-transform group-hover:scale-110" />
                            </div>

                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="font-semibold tracking-wide relative z-10"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Active Indicator Bar */}
                            <NavLink to={item.path} className={({ isActive }) =>
                                isActive ? "absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_#3b82f6]" : "hidden"
                            } />
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Logout Footer */}
            <div className="p-6 border-t border-white/5">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { logout(); navigate('/login'); }}
                    className="flex items-center gap-4 p-3.5 w-full rounded-2xl text-red-500 hover:bg-red-500/10 transition-colors group"
                >
                    <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
                    {!collapsed && <span className="font-bold tracking-wide">Logout</span>}
                </motion.button>
            </div>
        </motion.div>
    );
}
