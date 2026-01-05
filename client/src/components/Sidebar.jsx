
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
    Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: TrendingUp, label: 'Analytics', path: '/analytics' }, // Future Route
        { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
        { icon: BookOpen, label: 'Resources', path: '/resources' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <motion.div
            animate={{ width: collapsed ? 80 : 250 }}
            className="h-screen sticky top-0 glass border-r border-white/10 flex flex-col justify-between hidden md:flex"
        >
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
                {!collapsed && (
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                    >
                        Tracker
                    </motion.h1>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items - center gap - 3 p - 3 rounded - lg transition - all duration - 300 ${isActive
                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                            } `
                        }
                    >
                        <item.icon size={20} />
                        {!collapsed && <span className="font-medium">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="flex items-center gap-3 p-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition"
                >
                    <LogOut size={20} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </motion.div>
    );
}
