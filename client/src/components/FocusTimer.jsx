import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock, Target } from 'lucide-react';
import GlassCard from './GlassCard';

const FocusTimer = () => {
    const { state, actions } = useAppContext();
    const [localTime, setLocalTime] = useState(0);
    const intervalRef = useRef(null);

    // Sync with global timer state
    useEffect(() => {
        setLocalTime(state.timer.timeRemaining);
    }, [state.timer.timeRemaining]);

    // Timer logic
    useEffect(() => {
        if (state.timer.isRunning && localTime > 0) {
            intervalRef.current = setInterval(() => {
                setLocalTime((prev) => {
                    const newTime = prev - 1;
                    actions.updateTimer(newTime);

                    // Timer completed
                    if (newTime === 0) {
                        actions.completeTask(state.timer.taskId);
                        actions.resetTimer();
                        actions.addPoints(10);
                        actions.updateStudyTime(state.timer.totalTime);
                    }

                    return newTime;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [state.timer.isRunning, localTime, state.timer.taskId, state.timer.totalTime, actions]);

    const activeTask = state.tasks.find(task => task.id === state.timer.taskId);

    const handleStart = () => {
        if (activeTask) {
            actions.startTimer(activeTask.id, activeTask.duration * 60);
        }
    };

    const handlePause = () => {
        actions.pauseTimer();
    };

    const handleReset = () => {
        actions.resetTimer();
        setLocalTime(state.timer.totalTime);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = state.timer.totalTime > 0
        ? ((state.timer.totalTime - localTime) / state.timer.totalTime) * 100
        : 0;

    if (!activeTask) {
        return (
            <GlassCard className="p-8 text-center">
                <Clock size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-white mb-2">Focus Timer</h3>
                <p className="text-gray-400">Select a task to start your focused study session</p>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Target size={24} />
                        Focus Timer
                    </h3>
                    <p className="text-gray-400 mt-1">{activeTask.title}</p>
                </div>

                <div className="flex gap-2">
                    {!state.timer.isRunning ? (
                        <button
                            onClick={handleStart}
                            className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all transform hover:scale-105"
                            title="Start timer"
                        >
                            <Play size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={handlePause}
                            className="p-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-all transform hover:scale-105"
                            title="Pause timer"
                        >
                            <Pause size={20} />
                        </button>
                    )}

                    <button
                        onClick={handleReset}
                        className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all transform hover:scale-105"
                        title="Reset timer"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>

            {/* Timer Display */}
            <div className="text-center mb-6">
                <motion.div
                    key={localTime}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-6xl font-bold text-white mb-4 font-mono"
                >
                    {formatTime(localTime)}
                </motion.div>

                {/* Progress Bar */}
                <div className="relative">
                    <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                        <motion.div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000 ease-linear"
                            style={{ width: `${progress}%` }}
                            initial={{ width: 0 }}
                        />
                    </div>

                    {/* Progress indicators */}
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                        <span>0%</span>
                        <span>{Math.round(progress)}%</span>
                        <span>100%</span>
                    </div>
                </div>
            </div>

            {/* Task Info */}
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-gray-400 text-sm">Duration</p>
                    <p className="text-white font-semibold">{activeTask.duration} min</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-gray-400 text-sm">Points</p>
                    <p className="text-white font-semibold">{activeTask.points}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-gray-400 text-sm">Status</p>
                    <p className="text-white font-semibold">
                        {state.timer.isRunning ? 'Active' : state.timer.isPaused ? 'Paused' : 'Ready'}
                    </p>
                </div>
            </div>

            {/* Motivational Message */}
            {state.timer.isRunning && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-center"
                >
                    <p className="text-blue-400 text-sm font-medium">
                        Stay focused! You're doing great! 🎯
                    </p>
                </motion.div>
            )}
        </GlassCard>
    );
};

export default FocusTimer;
