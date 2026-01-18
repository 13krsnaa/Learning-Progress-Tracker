import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, CheckCircle, Circle, Play, Pause, RotateCcw, Trash2, Edit2 } from 'lucide-react';
import GlassCard from './GlassCard';

const TaskManager = () => {
    const { state, actions } = useAppContext();
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: 25, // Default 25 minutes
        points: 10
    });

    // Timer effect
    useEffect(() => {
        let interval;

        if (state.timer.isRunning && state.timer.timeRemaining > 0) {
            interval = setInterval(() => {
                actions.updateTimer(state.timer.timeRemaining - 1);
            }, 1000);
        } else if (state.timer.timeRemaining === 0 && state.timer.taskId) {
            // Timer completed - mark task as complete
            actions.completeTask(state.timer.taskId);
            actions.resetTimer();
            actions.addPoints(10);
            actions.updateStudyTime(state.timer.totalTime);
        }

        return () => clearInterval(interval);
    }, [state.timer.isRunning, state.timer.timeRemaining, state.timer.taskId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingTask) {
            actions.updateTask({
                ...editingTask,
                ...formData
            });
            setEditingTask(null);
        } else {
            actions.addTask(formData);
        }

        setFormData({ title: '', description: '', duration: 25, points: 10 });
        setShowAddForm(false);
    };

    const handleStartTask = (task) => {
        actions.setCurrentTask(task);
        actions.startTimer(task.id, task.duration * 60); // Convert minutes to seconds
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description,
            duration: task.duration,
            points: task.points
        });
        setShowAddForm(true);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const activeTask = state.tasks.find(task => task.id === state.timer.taskId);

    return (
        <div className="space-y-6">
            {/* Add/Edit Task Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <GlassCard className="p-6">
                            <h3 className="text-xl font-bold text-white mb-4">
                                {editingTask ? 'Edit Task' : 'Add New Task'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Task Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="What do you want to accomplish?"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Add some details about your task..."
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Duration (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="1"
                                            max="180"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Points
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.points}
                                            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="1"
                                            max="100"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                    >
                                        {editingTask ? 'Update Task' : 'Add Task'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setEditingTask(null);
                                            setFormData({ title: '', description: '', duration: 25, points: 10 });
                                        }}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active Timer */}
            {activeTask && (
                <GlassCard className="p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Focus Timer</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => state.timer.isRunning ? actions.pauseTimer() : actions.startTimer(activeTask.id, state.timer.totalTime)}
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                {state.timer.isRunning ? <Pause size={20} /> : <Play size={20} />}
                            </button>
                            <button
                                onClick={actions.resetTimer}
                                className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                <RotateCcw size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="text-center">
                        <h4 className="text-lg font-medium text-gray-300 mb-2">{activeTask.title}</h4>
                        <div className="text-4xl font-bold text-white mb-2">
                            {formatTime(state.timer.timeRemaining)}
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${((state.timer.totalTime - state.timer.timeRemaining) / state.timer.totalTime) * 100}%` }}
                            />
                        </div>
                    </div>
                </GlassCard>
            )}

            {/* Tasks List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Your Tasks</h3>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        <Plus size={20} />
                        Add Task
                    </button>
                </div>

                {state.tasks.length === 0 ? (
                    <GlassCard className="p-8 text-center">
                        <div className="text-gray-400">
                            <Circle size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No tasks yet!</p>
                            <p className="text-sm mt-2">Add your first task to get started with your learning journey.</p>
                        </div>
                    </GlassCard>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {state.tasks.map((task) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <GlassCard className={`p-4 ${task.completed ? 'opacity-60' : ''} ${activeTask?.id === task.id ? 'border-l-4 border-blue-500' : ''}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    {task.completed ? (
                                                        <CheckCircle className="text-green-500" size={20} />
                                                    ) : (
                                                        <Circle className="text-gray-400" size={20} />
                                                    )}
                                                    <div>
                                                        <h4 className={`font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                                                            {task.title}
                                                        </h4>
                                                        {task.description && (
                                                            <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                                                        )}
                                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                                            <span className="flex items-center gap-1">
                                                                <Clock size={14} />
                                                                {task.duration}min
                                                            </span>
                                                            <span>{task.points} points</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {!task.completed && activeTask?.id !== task.id && (
                                                    <button
                                                        onClick={() => handleStartTask(task)}
                                                        className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                                        title="Start task"
                                                    >
                                                        <Play size={16} />
                                                    </button>
                                                )}

                                                {!task.completed && (
                                                    <button
                                                        onClick={() => handleEditTask(task)}
                                                        className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                                        title="Edit task"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => actions.deleteTask(task.id)}
                                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                                    title="Delete task"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskManager;
