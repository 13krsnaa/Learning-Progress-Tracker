
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import { TrendingUp, Activity, Clock, Zap, Target, Sparkles } from 'lucide-react';

export default function Analytics() {
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
            <div className="p-4 md:p-10 space-y-10 max-w-[1600px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-widest uppercase mb-3">
                        <TrendingUp size={12} /> Performance Depth
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                        Neural <span className="text-purple-500">Analytics</span>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <GlassCard hover className="border-blue-500/20 bg-blue-500/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white flex items-center gap-3">
                                <Zap className="text-blue-400" size={20} /> Cognitive XP
                            </h3>
                            <Sparkles size={16} className="text-blue-500/30" />
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={activityData}>
                                    <defs>
                                        <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }} />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="xp" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorXp)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>

                    <GlassCard hover className="border-green-500/20 bg-green-500/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white flex items-center gap-3">
                                <Clock className="text-green-400" size={20} /> Temporal Flux
                            </h3>
                            <Activity size={16} className="text-green-500/30" />
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={activityData}>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }} />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    />
                                    <Line type="monotone" dataKey="hours" stroke="#4ade80" strokeWidth={4} dot={{ r: 6, fill: '#4ade80', strokeWidth: 0 }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>
                </div>

                <GlassCard className="border-purple-500/20 bg-purple-500/5">
                    <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                        <Target className="text-purple-400" size={20} /> System Event log
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((_, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                                className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_#a855f7] bg-purple-500`}></div>
                                    <span className="text-slate-300 font-bold tracking-wide group-hover:text-white transition-colors">Neural Sync: Module {100 + i} Completed</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{i + 1} Cycles Ago</span>
                            </motion.div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </Layout>
    );
}
