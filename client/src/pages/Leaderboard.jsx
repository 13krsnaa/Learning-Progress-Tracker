import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown } from 'lucide-react';

export default function Leaderboard() {
    // Mock data for UI demonstration
    const users = [
        { id: 1, name: 'AlexCoder', streak: 45, xp: 12500 },
        { id: 2, name: 'SarahDev', streak: 32, xp: 9800 },
        { id: 3, name: 'MikeBuilds', streak: 28, xp: 8400 },
        { id: 4, name: 'You', streak: 12, xp: 3200 }, // Dynamic user data could go here
        { id: 5, name: 'Jessica', streak: 10, xp: 2900 },
    ];

    return (
        <Layout>
            <div className="p-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">Community Leaderboard</h1>
                    <p className="text-slate-400">See where you stand against other learners.</p>
                </motion.div>

                <GlassCard className="max-w-4xl mx-auto overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 text-slate-400 font-medium border-b border-white/10 uppercase text-xs tracking-wider">
                        <div className="col-span-2 text-center">Rank</div>
                        <div className="col-span-6">User</div>
                        <div className="col-span-2 text-center">Streak</div>
                        <div className="col-span-2 text-center">XP</div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {users.map((user, index) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition duration-300 ${user.name === 'You' ? 'bg-blue-600/10 border-l-4 border-blue-500' : ''}`}
                            >
                                <div className="col-span-2 flex justify-center">
                                    {index === 0 && <Crown className="text-yellow-400" />}
                                    {index === 1 && <Medal className="text-slate-300" />}
                                    {index === 2 && <Medal className="text-amber-600" />}
                                    {index > 2 && <span className="font-bold text-slate-500">#{index + 1}</span>}
                                </div>
                                <div className="col-span-6 flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-400/20 text-yellow-400' :
                                            index === 1 ? 'bg-slate-300/20 text-slate-300' :
                                                index === 2 ? 'bg-amber-600/20 text-amber-600' : 'bg-slate-700 text-slate-300'
                                        }`}>
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className={`font-medium ${user.name === 'You' ? 'text-blue-400' : 'text-white'}`}>{user.name}</span>
                                </div>
                                <div className="col-span-2 text-center flex items-center justify-center gap-1 text-orange-400 font-bold">
                                    {user.streak} <span className="text-xs">🔥</span>
                                </div>
                                <div className="col-span-2 text-center text-slate-300 font-mono">
                                    {user.xp.toLocaleString()}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </Layout>
    );
}
