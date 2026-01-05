
import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Plus, Activity, Target, Flame, Sparkles, TrendingUp as TrendingUpIcon } from 'lucide-react';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import PageTransition from '../components/PageTransition';

export default function Dashboard() {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newGoal, setNewGoal] = useState({ title: '', description: '' });
    const [todayLog, setTodayLog] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    const fetchData = async () => {
        try {
            const [analyticsRes, goalsRes, logsRes] = await Promise.all([
                api.get('/analytics'),
                api.get('/goals'),
                api.get('/logs')
            ]);
            setAnalytics(analyticsRes.data);
            setGoals(goalsRes.data);

            const todayStr = new Date().toISOString().split('T')[0];
            const today = logsRes.data.logs.find(l => l.date === todayStr);
            setTodayLog(today);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddGoal = async (e) => {
        e.preventDefault();
        try {
            await api.post('/goals', newGoal);
            setNewGoal({ title: '', description: '' });
            setIsAdding(false);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleGoal = async (goalId, title) => {
        let currentCompleted = todayLog?.goals_completed || [];
        const isCurrentlyCompleted = currentCompleted.find(g => g.goal_id === goalId && g.completed);

        let newCompleted;
        if (isCurrentlyCompleted) {
            newCompleted = currentCompleted.map(g => g.goal_id === goalId ? { ...g, completed: false } : g);
        } else {
            const exists = currentCompleted.find(g => g.goal_id === goalId);
            if (exists) {
                newCompleted = currentCompleted.map(g => g.goal_id === goalId ? { ...g, completed: true } : g);
            } else {
                newCompleted = [...currentCompleted, { goal_id: goalId, title, completed: true }];
            }
        }

        const todayStr = new Date().toISOString().split('T')[0];
        try {
            const res = await api.post('/logs', { date: todayStr, goals_completed: newCompleted });
            setTodayLog(res.data);
            const analyticsRes = await api.get('/analytics');
            setAnalytics(analyticsRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const chartData = analytics?.logs?.map(log => ({
        date: log.date.slice(5),
        completed: log.goals_completed ? log.goals_completed.filter(g => g.completed).length : 0,
        total: log.goals_completed ? log.goals_completed.length : 0
    })) || [];

    if (loading) return (
        <div className="bg-[#020617] min-h-screen flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full" />
        </div>
    );

    return (
        <Layout>
            <PageTransition>
                <div className="p-4 md:p-10 space-y-10 max-w-[1600px] mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-3">
                                <Activity size={12} /> Live Metrics
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                                Dashboard <span className="text-blue-500 opacity-50">/</span> {user.username}
                            </h1>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md"
                        >
                            <p className="text-slate-400 text-sm font-semibold tracking-wide">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                        </motion.div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <GlassCard hover className="relative overflow-hidden group border-orange-500/20 bg-orange-500/5">
                            <div className="absolute -right-6 -top-6 p-4 opacity-5 group-hover:opacity-10 transition-all duration-500 rotate-12 group-hover:rotate-0">
                                <Flame size={120} />
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-orange-500/20 rounded-2xl text-orange-400 border border-orange-500/30">
                                    <Flame size={24} />
                                </div>
                                <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs">Current Streak</h3>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-white text-shadow-glow-orange">{analytics?.currentStreak || 0}</span>
                                <span className="text-slate-500 font-bold">DAYS</span>
                            </div>
                        </GlassCard>

                        <GlassCard hover className="relative overflow-hidden group border-green-500/20 bg-green-500/5">
                            <div className="absolute -right-6 -top-6 p-4 opacity-5 group-hover:opacity-10 transition-all duration-500 -rotate-12 group-hover:rotate-0">
                                <Target size={120} />
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-green-500/20 rounded-2xl text-green-400 border border-green-500/30">
                                    <Target size={24} />
                                </div>
                                <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs">Goals Completed</h3>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-white text-shadow-glow-green">{analytics?.completedGoals || 0}</span>
                                <span className="text-slate-500 font-bold">TOTAL</span>
                            </div>
                        </GlassCard>

                        <GlassCard hover className="relative overflow-hidden group border-blue-500/20 bg-blue-500/5">
                            <div className="absolute -right-6 -top-6 p-4 opacity-5 group-hover:opacity-10 transition-all duration-500 rotate-45 group-hover:rotate-0">
                                <Activity size={120} />
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 border border-blue-500/30">
                                    <Activity size={24} />
                                </div>
                                <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs">Activity Index</h3>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-white text-shadow-glow-blue">{analytics?.activeDaysLast7 || 0}</span>
                                <span className="text-slate-500 font-bold">/ 7 DAYS</span>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Main Content Areas */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Daily Goals List */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                    <div className="w-2 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                                    Mission Objectives
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsAdding(!isAdding)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 border border-blue-400/30 transition-all"
                                >
                                    <Plus size={18} /> New Objective
                                </motion.button>
                            </div>

                            <AnimatePresence>
                                {isAdding && (
                                    <motion.form
                                        initial={{ height: 0, opacity: 0, scale: 0.95 }}
                                        animate={{ height: 'auto', opacity: 1, scale: 1 }}
                                        exit={{ height: 0, opacity: 0, scale: 0.95 }}
                                        onSubmit={handleAddGoal}
                                        className="mb-8"
                                    >
                                        <div className="p-6 bg-white/5 rounded-[1.5rem] border border-white/10 flex gap-4">
                                            <input
                                                type="text"
                                                placeholder="Define your next target..."
                                                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold"
                                                value={newGoal.title}
                                                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                                autoFocus
                                                required
                                            />
                                            <button type="submit" className="bg-blue-600 px-6 rounded-xl font-black hover:bg-blue-500 transition shadow-lg shadow-blue-500/30">ADD</button>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>

                            <div className="grid grid-cols-1 gap-4">
                                {goals.length > 0 ? goals.map((goal, index) => {
                                    const isDone = todayLog?.goals_completed?.find(g => g.goal_id === goal.id && g.completed);
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            key={goal.id}
                                            onClick={() => handleToggleGoal(goal.id, goal.title)}
                                            className={`group p-5 rounded-2xl flex items-center justify-between cursor-pointer border transition-all duration-500 relative overflow-hidden ${isDone
                                                ? 'bg-green-500/5 border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.05)]'
                                                : 'bg-white/5 border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5'
                                                }`}
                                        >
                                            <div className="flex items-center gap-5 relative z-10">
                                                <motion.div
                                                    animate={{ scale: isDone ? [1, 1.2, 1] : 1 }}
                                                    className={`p-1 rounded-full ${isDone ? 'text-green-400 bg-green-400/10' : 'text-slate-600 bg-slate-800'}`}
                                                >
                                                    {isDone ? <CheckCircle size={28} /> : <Circle size={28} />}
                                                </motion.div>
                                                <div>
                                                    <h4 className={`font-bold text-lg transition-all duration-500 ${isDone ? 'text-slate-500 line-through opacity-70' : 'text-white'}`}>
                                                        {goal.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-black tracking-tighter text-slate-500 uppercase">{goal.frequency}</span>
                                                        {isDone && <span className="text-[10px] font-black text-green-500 tracking-tighter uppercase">Objective Secured</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            {!isDone && <div className="text-slate-500 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all font-bold text-xs tracking-widest uppercase relative z-10">Capture</div>}
                                        </motion.div>
                                    );
                                }) : (
                                    <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                                        <div className="inline-flex p-5 rounded-full bg-slate-800 text-slate-500 mb-4 opacity-50"><Target size={40} /></div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest">No active objectives found</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Weekly Analysis Sidebar Section */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                <div className="w-2 h-8 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                                Analytics
                            </h2>
                            <GlassCard className="border-white/10 bg-black/40 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <TrendingUpIcon size={16} className="text-purple-400" /> Weekly Trajectory
                                    </h3>
                                    <Sparkles size={16} className="text-purple-500/50" />
                                </div>
                                <div className="h-[280px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fill: '#475569', fontSize: 10, fontWeight: 800 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                                contentStyle={{
                                                    backgroundColor: 'rgba(2, 6, 23, 0.95)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '16px',
                                                    padding: '12px'
                                                }}
                                            />
                                            <Bar
                                                dataKey="completed"
                                                radius={[6, 6, 0, 0]}
                                                barSize={16}
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#3b82f6' : '#1e1b4b'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Peak Perf.</p>
                                        <p className="text-xl font-black text-white">88%</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Consistency</p>
                                        <p className="text-xl font-black text-white">92%</p>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </PageTransition>
        </Layout>
    );
}
