import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, Target, Award, Calendar } from 'lucide-react';
import GlassCard from './GlassCard';

const Analytics = () => {
    const { state } = useAppContext();
    const [timeRange, setTimeRange] = useState('week');

    // Generate mock data for demonstration
    const generateStudyTimeData = () => {
        const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
        const data = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            data.push({
                date: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
                studyTime: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
                tasksCompleted: Math.floor(Math.random() * 5) + 1,
                points: Math.floor(Math.random() * 50) + 10
            });
        }

        return data;
    };

    const [studyData, setStudyData] = useState(generateStudyTimeData());

    useEffect(() => {
        setStudyData(generateStudyTimeData());
    }, [timeRange]);

    // Calculate statistics
    const totalStudyTime = studyData.reduce((sum, day) => sum + day.studyTime, 0);
    const totalTasksCompleted = studyData.reduce((sum, day) => sum + day.tasksCompleted, 0);
    const totalPointsEarned = studyData.reduce((sum, day) => sum + day.points, 0);
    const averageStudyTime = Math.round(totalStudyTime / studyData.length);

    // Task completion data for pie chart
    const taskCompletionData = [
        { name: 'Completed', value: state.tasks.filter(t => t.completed).length, color: '#10b981' },
        { name: 'In Progress', value: state.tasks.filter(t => !t.completed && state.timer.taskId === t.id).length, color: '#3b82f6' },
        { name: 'Not Started', value: state.tasks.filter(t => !t.completed && state.timer.taskId !== t.id).length, color: '#6b7280' }
    ];

    // Subject distribution (mock data)
    const subjectData = [
        { subject: 'Mathematics', time: 180, color: '#8b5cf6' },
        { subject: 'Science', time: 150, color: '#3b82f6' },
        { subject: 'Programming', time: 200, color: '#10b981' },
        { subject: 'Languages', time: 120, color: '#f59e0b' },
        { subject: 'Other', time: 80, color: '#6b7280' }
    ];

    const formatMinutes = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    return (
        <div className="space-y-6">
            {/* Time Range Selector */}
            <div className="flex gap-2">
                {['week', 'month', 'year'].map((range) => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === range
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassCard className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Clock className="text-blue-400" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{formatMinutes(totalStudyTime)}</div>
                            <div className="text-sm text-gray-400">Total Study Time</div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <Target className="text-green-400" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{totalTasksCompleted}</div>
                            <div className="text-sm text-gray-400">Tasks Completed</div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Award className="text-purple-400" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{totalPointsEarned}</div>
                            <div className="text-sm text-gray-400">Points Earned</div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <TrendingUp className="text-yellow-400" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{formatMinutes(averageStudyTime)}</div>
                            <div className="text-sm text-gray-400">Daily Average</div>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Study Time Chart */}
            <GlassCard className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Study Time Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={studyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="date"
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af' }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: '1px solid #374151',
                                borderRadius: '8px'
                            }}
                            labelStyle={{ color: '#f3f4f6' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="studyTime"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ fill: '#3b82f6' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Task Completion Pie Chart */}
                <GlassCard className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Task Status</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={taskCompletionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {taskCompletionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-3 mt-4 justify-center">
                        {taskCompletionData.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm text-gray-300">
                                    {item.name} ({item.value})
                                </span>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Subject Distribution */}
                <GlassCard className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Study Time by Subject</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={subjectData} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                type="number"
                                stroke="#9ca3af"
                                tick={{ fill: '#9ca3af' }}
                            />
                            <YAxis
                                type="category"
                                dataKey="subject"
                                stroke="#9ca3af"
                                tick={{ fill: '#9ca3af' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="time" fill="#8b5cf6" />
                        </BarChart>
                    </ResponsiveContainer>
                </GlassCard>
            </div>

            {/* Recent Activity */}
            <GlassCard className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar size={24} />
                    Recent Activity
                </h3>
                <div className="space-y-3">
                    {studyData.slice(-5).reverse().map((day, index) => (
                        <motion.div
                            key={day.date}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                <div>
                                    <div className="font-medium text-white">{day.date}</div>
                                    <div className="text-sm text-gray-400">
                                        {day.tasksCompleted} tasks completed
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium text-white">{formatMinutes(day.studyTime)}</div>
                                <div className="text-sm text-gray-400">{day.points} points</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};

export default Analytics;
