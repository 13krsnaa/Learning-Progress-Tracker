import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { BookOpen, Target, Clock, Trophy, Flame, Plus, TrendingUp } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import TaskManager from '../components/TaskManager';
import FocusTimer from '../components/FocusTimer';
import Rewards from '../components/Rewards';
import Analytics from '../components/Analytics';
import Resources from '../components/Resources';

export default function Dashboard() {
    const { state } = useAppContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tasks');

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!state.isAuthenticated) {
            navigate('/login');
        }
    }, [state.isAuthenticated, navigate]);

    const tabs = [
        { id: 'tasks', label: 'Tasks', icon: Target },
        { id: 'timer', label: 'Focus Timer', icon: Clock },
        { id: 'rewards', label: 'Rewards', icon: Trophy },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'resources', label: 'Resources', icon: BookOpen }
    ];

    const completedTasks = state.tasks.filter(task => task.completed).length;
    const totalTasks = state.tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Welcome back, {state.user?.displayName || 'Learner'}! 👋
                    </h1>
                    <p className="text-xl text-white/80">
                        Ready to make today productive?
                    </p>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <GlassCard className="p-4 text-center">
                            <Target className="mx-auto mb-2 text-blue-400" size={32} />
                            <div className="text-2xl font-bold text-white">{completedTasks}/{totalTasks}</div>
                            <div className="text-sm text-gray-400">Tasks Completed</div>
                        </GlassCard>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <GlassCard className="p-4 text-center">
                            <Flame className="mx-auto mb-2 text-orange-400" size={32} />
                            <div className="text-2xl font-bold text-white">{state.rewards.studyStreak}</div>
                            <div className="text-sm text-gray-400">Day Streak</div>
                        </GlassCard>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <GlassCard className="p-4 text-center">
                            <Trophy className="mx-auto mb-2 text-yellow-400" size={32} />
                            <div className="text-2xl font-bold text-white">{state.rewards.points}</div>
                            <div className="text-sm text-gray-400">Total Points</div>
                        </GlassCard>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <GlassCard className="p-4 text-center">
                            <Clock className="mx-auto mb-2 text-green-400" size={32} />
                            <div className="text-2xl font-bold text-white">{Math.round(state.rewards.totalStudyTime / 60)}h</div>
                            <div className="text-sm text-gray-400">Study Time</div>
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                                    }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'tasks' && <TaskManager />}
                    {activeTab === 'timer' && <FocusTimer />}
                    {activeTab === 'rewards' && <Rewards />}
                    {activeTab === 'analytics' && <Analytics />}
                    {activeTab === 'resources' && <Resources />}
                </motion.div>
            </div>

            {/* Motivational Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center mt-12"
            >
                <GlassCard className="p-6 max-w-2xl mx-auto">
                    <h3 className="text-lg font-bold text-white mb-2">
                        🎯 Today's Goal
                    </h3>
                    <p className="text-white/80">
                        {completionRate === 100
                            ? "Amazing work! You've completed all your tasks today! 🎉"
                            : completionRate > 50
                                ? `Great progress! You're ${completionRate}% of the way there! Keep going! 💪`
                                : `You've got this! Start with one small task and build momentum! 🚀`
                        }
                    </p>
                </GlassCard>
            </motion.div>
        </div>
    );
}
