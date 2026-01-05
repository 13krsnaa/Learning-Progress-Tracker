import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Activity, Clock } from 'lucide-react';

export default function Analytics() {
    // Mock data for detailed analytics
    const activityData = [
        { day: 'Mon', hours: 2, xp: 150 },
        { day: 'Tue', hours: 3.5, xp: 300 },
        { day: 'Wed', hours: 1, xp: 100 },
        { day: 'Thu', hours: 4, xp: 450 },
        { day: 'Fri', hours: 2.5, xp: 200 },
        { day: 'Sat', hours: 5, xp: 600 },
        { day: 'Sun', hours: 3, xp: 350 },
    ];

    return (
        <Layout>
            <div className="p-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">Detailed Analytics</h1>
                    <p className="text-slate-400">Deep dive into your learning habits.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <GlassCard>
                        <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                            <TrendingUp size={20} /> XP Growth
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={activityData}>
                                    <defs>
                                        <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" stroke="#64748b" />
                                    <YAxis stroke="#64748b" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Area type="monotone" dataKey="xp" stroke="#3b82f6" fillOpacity={1} fill="url(#colorXp)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                            <Clock size={20} /> Study Hours
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={activityData}>
                                    <XAxis dataKey="day" stroke="#64748b" />
                                    <YAxis stroke="#64748b" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Line type="monotone" dataKey="hours" stroke="#4ade80" strokeWidth={3} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>
                </div>

                <GlassCard>
                    <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                        <Activity size={20} /> Recent Activity Log
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                    <span className="text-slate-300">Completed "Learn React Hooks"</span>
                                </div>
                                <span className="text-xs text-slate-500">{i + 1} hours ago</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </Layout>
    );
}
