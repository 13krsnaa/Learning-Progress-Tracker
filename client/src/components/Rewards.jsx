import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Coins, Trophy, Flame, Star, Gift, Calendar, Share2, Target } from 'lucide-react';
import GlassCard from './GlassCard';

const Rewards = () => {
    const { state, actions } = useAppContext();
    const [showDailyBonus, setShowDailyBonus] = useState(false);
    const [lastLoginDate, setLastLoginDate] = useState(null);

    // Check daily login
    useEffect(() => {
        const today = new Date().toDateString();
        const savedLastLogin = localStorage.getItem('lastLoginDate');

        if (savedLastLogin !== today) {
            setShowDailyBonus(true);
            setLastLoginDate(today);
        } else {
            setLastLoginDate(savedLastLogin);
        }
    }, []);

    const handleClaimDailyLogin = () => {
        actions.claimDailyLogin();
        actions.updateStudyStreak(state.rewards.studyStreak + 1);
        localStorage.setItem('lastLoginDate', new Date().toDateString());
        setShowDailyBonus(false);
    };

    const handleShareApp = () => {
        // Simulate app sharing
        if (navigator.share) {
            navigator.share({
                title: 'Learning Progress Tracker',
                text: 'Check out this amazing learning app!',
                url: window.location.href
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('App link copied to clipboard!');
        }
        actions.addCoins(3);
    };

    const getLevel = () => {
        const points = state.rewards.points;
        if (points < 50) return { level: 1, name: 'Beginner', color: 'text-gray-400' };
        if (points < 150) return { level: 2, name: 'Learner', color: 'text-green-400' };
        if (points < 300) return { level: 3, name: 'Student', color: 'text-blue-400' };
        if (points < 500) return { level: 4, name: 'Scholar', color: 'text-purple-400' };
        return { level: 5, name: 'Master', color: 'text-yellow-400' };
    };

    const level = getLevel();
    const nextLevelPoints = [50, 150, 300, 500, 1000][level.level - 1] || 1000;
    const progressToNext = (state.rewards.points / nextLevelPoints) * 100;

    return (
        <div className="space-y-6">
            {/* Daily Login Bonus */}
            {showDailyBonus && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-xl text-white"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Gift size={32} />
                            <div>
                                <h3 className="text-lg font-bold">Daily Login Bonus!</h3>
                                <p className="text-sm opacity-90">Claim your daily reward</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClaimDailyLogin}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Claim 5 Coins
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Level and Progress */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Your Progress</h3>
                    <div className={`text-2xl font-bold ${level.color}`}>
                        {level.name}
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Level {level.level}</span>
                            <span className="text-gray-400">{state.rewards.points} / {nextLevelPoints} XP</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                            <motion.div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressToNext}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GlassCard className="p-4 text-center">
                    <Coins className="mx-auto mb-2 text-yellow-400" size={32} />
                    <div className="text-2xl font-bold text-white">{state.rewards.coins}</div>
                    <div className="text-sm text-gray-400">Coins</div>
                </GlassCard>

                <GlassCard className="p-4 text-center">
                    <Trophy className="mx-auto mb-2 text-purple-400" size={32} />
                    <div className="text-2xl font-bold text-white">{state.rewards.points}</div>
                    <div className="text-sm text-gray-400">Points</div>
                </GlassCard>

                <GlassCard className="p-4 text-center">
                    <Flame className="mx-auto mb-2 text-orange-400" size={32} />
                    <div className="text-2xl font-bold text-white">{state.rewards.studyStreak}</div>
                    <div className="text-sm text-gray-400">Day Streak</div>
                </GlassCard>

                <GlassCard className="p-4 text-center">
                    <Target className="mx-auto mb-2 text-green-400" size={32} />
                    <div className="text-2xl font-bold text-white">{state.tasks.filter(t => t.completed).length}</div>
                    <div className="text-sm text-gray-400">Tasks Done</div>
                </GlassCard>
            </div>

            {/* Achievements */}
            <GlassCard className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Star size={24} className="text-yellow-400" />
                    Achievements
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`flex items-center gap-3 p-3 rounded-lg ${state.rewards.points >= 10 ? 'bg-green-500/20 border border-green-500/50' : 'bg-gray-500/20 border border-gray-500/50'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${state.rewards.points >= 10 ? 'bg-green-500' : 'bg-gray-500'}`}>
                            <Target size={20} className="text-white" />
                        </div>
                        <div>
                            <div className="font-medium text-white">First Steps</div>
                            <div className="text-sm text-gray-400">Earn 10 points</div>
                        </div>
                    </div>

                    <div className={`flex items-center gap-3 p-3 rounded-lg ${state.rewards.studyStreak >= 3 ? 'bg-green-500/20 border border-green-500/50' : 'bg-gray-500/20 border border-gray-500/50'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${state.rewards.studyStreak >= 3 ? 'bg-green-500' : 'bg-gray-500'}`}>
                            <Flame size={20} className="text-white" />
                        </div>
                        <div>
                            <div className="font-medium text-white">On Fire</div>
                            <div className="text-sm text-gray-400">3 day streak</div>
                        </div>
                    </div>

                    <div className={`flex items-center gap-3 p-3 rounded-lg ${state.tasks.filter(t => t.completed).length >= 5 ? 'bg-green-500/20 border border-green-500/50' : 'bg-gray-500/20 border border-gray-500/50'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${state.tasks.filter(t => t.completed).length >= 5 ? 'bg-green-500' : 'bg-gray-500'}`}>
                            <Trophy size={20} className="text-white" />
                        </div>
                        <div>
                            <div className="font-medium text-white">Task Master</div>
                            <div className="text-sm text-gray-400">Complete 5 tasks</div>
                        </div>
                    </div>

                    <div className={`flex items-center gap-3 p-3 rounded-lg ${state.rewards.totalStudyTime >= 60 ? 'bg-green-500/20 border border-green-500/50' : 'bg-gray-500/20 border border-gray-500/50'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${state.rewards.totalStudyTime >= 60 ? 'bg-green-500' : 'bg-gray-500'}`}>
                            <Star size={20} className="text-white" />
                        </div>
                        <div>
                            <div className="font-medium text-white">Dedicated Learner</div>
                            <div className="text-sm text-gray-400">1 hour study time</div>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Bonus Actions */}
            <GlassCard className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Earn More Rewards</h3>

                <div className="space-y-3">
                    <button
                        onClick={handleShareApp}
                        className="w-full flex items-center justify-between p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Share2 size={20} className="text-blue-400" />
                            <div className="text-left">
                                <div className="font-medium text-white">Share the App</div>
                                <div className="text-sm text-gray-400">Tell friends about your progress</div>
                            </div>
                        </div>
                        <div className="text-blue-400 font-medium">+3 Coins</div>
                    </button>

                    <div className="flex items-center justify-between p-4 bg-gray-500/20 border border-gray-500/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Calendar size={20} className="text-gray-400" />
                            <div className="text-left">
                                <div className="font-medium text-white">Daily Login</div>
                                <div className="text-sm text-gray-400">
                                    {state.rewards.dailyLoginClaimed ? 'Already claimed today' : 'Claim your daily bonus'}
                                </div>
                            </div>
                        </div>
                        <div className={`font-medium ${state.rewards.dailyLoginClaimed ? 'text-gray-400' : 'text-yellow-400'}`}>
                            {state.rewards.dailyLoginClaimed ? '✓' : '+5 Coins'}
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default Rewards;
