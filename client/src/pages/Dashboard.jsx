import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Plus, Activity, Target, Flame } from 'lucide-react';
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
        const isCompleted = currentCompleted.find(g => g.goal_id === goalId && g.completed);

        let newCompleted;
        if (isCompleted) {
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

    if (loading) return <div className="text-white flex items-center justify-center min-h-screen">Loading...</div>;

    return (
        <Layout>
            <PageTransition>
                <div className="p-8 space-y-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-between items-end"
                    >
                        <div>
                            <h2 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Overview</h2>
                            <h1 className="text-4xl font-bold text-white text-neon-blue">Welcome back, {user.username}</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <GlassCard hover className="relative overflow-hidden group border-white/5 bg-slate-900/40">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                <Flame size={100} />
                            </div>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-orange-500/20 rounded-lg text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]"><Flame /></div>
                                <h3 className="text-slate-300 font-medium">Current Streak</h3>
                            </div>
                            <p className="text-4xl font-bold text-white mt-2 text-shadow-sm">{analytics?.currentStreak || 0} <span className="text-lg text-slate-500 font-normal">Days</span></p>
                        </GlassCard>

                        <GlassCard hover className="relative overflow-hidden group border-white/5 bg-slate-900/40">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                <Target size={100} />
                            </div>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-green-500/20 rounded-lg text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]"><Target /></div>
                                <h3 className="text-slate-300 font-medium">Goals Completed</h3>
                            </div>
                            <p className="text-4xl font-bold text-white mt-2 text-shadow-sm">{analytics?.completedGoals || 0} <span className="text-lg text-slate-500 font-normal">Goals</span></p>
                        </GlassCard>

                        <GlassCard hover className="relative overflow-hidden group border-white/5 bg-slate-900/40">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                <Activity size={100} />
                            </div>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]"><Activity /></div>
                                <h3 className="text-slate-300 font-medium">Active Days</h3>
                            </div>
                            <p className="text-4xl font-bold text-white mt-2 text-shadow-sm">{analytics?.activeDaysLast7 || 0} <span className="text-lg text-slate-500 font-normal">/ 7 Days</span></p>
                        </GlassCard>
                    </div>

                    {/* Content Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Goals Section */}
                        <GlassCard className="lg:col-span-2 border-white/5 bg-slate-900/40">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                                    <Target className="text-blue-400" size={20} /> Daily Goals
                                </h2>
                                <button
                                    onClick={() => setIsAdding(!isAdding)}
                                    className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition shadow-[0_0_10px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            {isAdding && (
                                <motion.form
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    onSubmit={handleAddGoal}
                                    className="mb-6 flex gap-3 overflow-hidden"
                                >
                                    <input
                                        type="text"
                                        placeholder="What's your goal today?"
                                        className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition"
                                        value={newGoal.title}
                                        onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                        autoFocus
                                        required
                                    />
                                    <button type="submit" className="bg-blue-600 px-6 rounded-lg font-medium hover:bg-blue-500 transition shadow-[0_0_10px_rgba(59,130,246,0.4)]">Add</button>
                                </motion.form>
                            )}

                            <div className="space-y-3">
                                {goals.map((goal, index) => {
                                    const isDone = todayLog?.goals_completed?.find(g => g.goal_id === goal.id && g.completed);
                                    return (
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            key={goal.id}
                                            onClick={() => handleToggleGoal(goal.id, goal.title)}
                                            className={`group p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-300 border ${isDone
                                                ? 'bg-green-500/10 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
                                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-full transition-colors ${isDone ? 'text-green-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                                    {isDone ? <CheckCircle size={24} /> : <Circle size={24} />}
                                                </div>
                                                <div>
                                                    <h4 className={`font-medium text-lg transition-colors ${isDone ? 'text-slate-400 line-through' : 'text-white'}`}>{goal.title}</h4>
                                                    <p className="text-xs text-slate-500">{goal.frequency}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                {goals.length === 0 && (
                                    <div className="text-center py-10 text-slate-500">
                                        <Target size={40} className="mx-auto mb-3 opacity-20" />
                                        <p>No goals set yet. Start by adding one!</p>
                                    </div>
                                )}
                            </div>
                        </GlassCard>

                        {/* Chart Section */}
                        <GlassCard className="border-white/5 bg-slate-900/40">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                                <TrendingUp className="text-purple-400" size={20} /> Week Progress
                            </h2>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <XAxis
                                            dataKey="date"
                                            stroke="#64748b"
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{
                                                backgroundColor: 'rgba(2, 6, 23, 0.9)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                                            }}
                                            itemStyle={{ color: '#f8fafc' }}
                                        />
                                        <Bar
                                            dataKey="completed"
                                            fill="#3b82f6"
                                            radius={[4, 4, 0, 0]}
                                            barSize={20}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                                {chartData.length === 0 && <p className="text-slate-500 text-center mt-10">Data will appear here as you complete goals.</p>}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </PageTransition>
        </Layout>
    );
}

function TrendingUp(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
    )
}
