
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Sparkles, TrendingUp } from 'lucide-react';

export default function Leaderboard() {
    const users = [
        { id: 1, name: 'AlexCoder', streak: 45, xp: 12500 },
        { id: 2, name: 'SarahDev', streak: 32, xp: 9800 },
        { id: 3, name: 'MikeBuilds', streak: 28, xp: 8400 },
        { id: 4, name: 'You', streak: 12, xp: 3200 },
        { id: 5, name: 'Jessica', streak: 10, xp: 2900 },
    ];

    return (
        <Layout>
            <div className="p-4 md:p-10 space-y-10 max-w-[1200px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold tracking-widest uppercase mb-3">
                        <Trophy size={12} /> Global Rankings
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                        Nexus <span className="text-yellow-500">Leaderboard</span>
                    </h1>
                </motion.div>

                <GlassCard className="overflow-hidden border-white/10 bg-black/40">
                    <div className="grid grid-cols-12 gap-4 p-6 text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] border-b border-white/5">
                        <div className="col-span-2 text-center">Rank</div>
                        <div className="col-span-6">Operative</div>
                        <div className="col-span-2 text-center">Streak</div>
                        <div className="col-span-2 text-center">XP</div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {users.map((user, index) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`grid grid-cols-12 gap-4 p-6 items-center hover:bg-white/[0.02] transition-colors group ${user.name === 'You' ? 'bg-blue-500/5 border-y border-blue-500/10' : ''}`}
                            >
                                <div className="col-span-2 flex justify-center scale-110">
                                    {index === 0 && <Crown className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" size={24} />}
                                    {index === 1 && <Medal className="text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.5)]" size={24} />}
                                    {index === 2 && <Medal className="text-amber-600 drop-shadow-[0_0_8px_rgba(180,83,9,0.5)]" size={24} />}
                                    {index > 2 && <span className="font-black text-slate-600 text-lg italic">#{index + 1}</span>}
                                </div>
                                <div className="col-span-6 flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-transform group-hover:scale-105 ${index === 0 ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' :
                                            index === 1 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/30' :
                                                index === 2 ? 'bg-amber-600/20 text-amber-600 border border-amber-600/30' :
                                                    'bg-white/5 text-slate-400 border border-white/5'
                                        }`}>
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-black text-base tracking-tight ${user.name === 'You' ? 'text-blue-400' : 'text-slate-100'}`}>
                                            {user.name} {user.name === 'You' && <Sparkles size={12} className="inline ml-1 mb-1" />}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Operative</span>
                                    </div>
                                </div>
                                <div className="col-span-2 text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-orange-400 font-black text-xl tracking-tighter shadow-orange-500/20 drop-shadow-sm">{user.streak}</span>
                                        <span className="text-[8px] text-slate-600 font-black uppercase">Streak</span>
                                    </div>
                                </div>
                                <div className="col-span-2 text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-white font-black text-xl tracking-tighter">{user.xp.toLocaleString()}</span>
                                        <span className="text-[8px] text-slate-600 font-black uppercase">XP Core</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </Layout>
    );
}
