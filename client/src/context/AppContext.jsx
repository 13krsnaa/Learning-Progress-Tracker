import { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  // Auth state
  user: null,
  isAuthenticated: false,
  
  // Tasks state
  tasks: [],
  currentTask: null,
  
  // Timer state
  timer: {
    isRunning: false,
    isPaused: false,
    timeRemaining: 0,
    totalTime: 0,
    taskId: null
  },
  
  // Rewards state
  rewards: {
    points: 0,
    coins: 0,
    dailyLoginClaimed: false,
    studyStreak: 0,
    totalStudyTime: 0
  },
  
  // Analytics state
  analytics: {
    dailyStudyTime: [],
    completedTasks: [],
    pointsHistory: []
  },
  
  // UI state
  loading: false,
  error: null
};

// Action types
const ACTION_TYPES = {
  // Auth actions
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  
  // Task actions
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  SET_CURRENT_TASK: 'SET_CURRENT_TASK',
  COMPLETE_TASK: 'COMPLETE_TASK',
  
  // Timer actions
  START_TIMER: 'START_TIMER',
  PAUSE_TIMER: 'PAUSE_TIMER',
  RESET_TIMER: 'RESET_TIMER',
  UPDATE_TIMER: 'UPDATE_TIMER',
  
  // Rewards actions
  ADD_POINTS: 'ADD_POINTS',
  ADD_COINS: 'ADD_COINS',
  CLAIM_DAILY_LOGIN: 'CLAIM_DAILY_LOGIN',
  UPDATE_STUDY_STREAK: 'UPDATE_STUDY_STREAK',
  UPDATE_STUDY_TIME: 'UPDATE_STUDY_TIME',
  
  // Analytics actions
  UPDATE_DAILY_STUDY_TIME: 'UPDATE_DAILY_STUDY_TIME',
  UPDATE_COMPLETED_TASKS: 'UPDATE_COMPLETED_TASKS',
  UPDATE_POINTS_HISTORY: 'UPDATE_POINTS_HISTORY',
  
  // UI actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload
      };
    
    case ACTION_TYPES.LOGOUT:
      return {
        ...initialState,
        user: null,
        isAuthenticated: false
      };
    
    case ACTION_TYPES.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
    
    case ACTION_TYPES.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        )
      };
    
    case ACTION_TYPES.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        currentTask: state.currentTask?.id === action.payload ? null : state.currentTask
      };
    
    case ACTION_TYPES.SET_CURRENT_TASK:
      return {
        ...state,
        currentTask: action.payload
      };
    
    case ACTION_TYPES.COMPLETE_TASK:
      const completedTask = state.tasks.find(task => task.id === action.payload);
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload ? { ...task, completed: true, completedAt: new Date() } : task
        ),
        currentTask: state.currentTask?.id === action.payload ? null : state.currentTask,
        rewards: {
          ...state.rewards,
          points: state.rewards.points + (completedTask?.points || 10)
        }
      };
    
    case ACTION_TYPES.START_TIMER:
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: true,
          isPaused: false,
          taskId: action.payload.taskId,
          totalTime: action.payload.duration,
          timeRemaining: action.payload.duration
        }
      };
    
    case ACTION_TYPES.PAUSE_TIMER:
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: false,
          isPaused: true
        }
      };
    
    case ACTION_TYPES.RESET_TIMER:
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: false,
          isPaused: false,
          timeRemaining: state.timer.totalTime
        }
      };
    
    case ACTION_TYPES.UPDATE_TIMER:
      return {
        ...state,
        timer: {
          ...state.timer,
          timeRemaining: action.payload
        }
      };
    
    case ACTION_TYPES.ADD_POINTS:
      return {
        ...state,
        rewards: {
          ...state.rewards,
          points: state.rewards.points + action.payload
        }
      };
    
    case ACTION_TYPES.ADD_COINS:
      return {
        ...state,
        rewards: {
          ...state.rewards,
          coins: state.rewards.coins + action.payload
        }
      };
    
    case ACTION_TYPES.CLAIM_DAILY_LOGIN:
      return {
        ...state,
        rewards: {
          ...state.rewards,
          dailyLoginClaimed: true,
          coins: state.rewards.coins + 5
        }
      };
    
    case ACTION_TYPES.UPDATE_STUDY_STREAK:
      return {
        ...state,
        rewards: {
          ...state.rewards,
          studyStreak: action.payload
        }
      };
    
    case ACTION_TYPES.UPDATE_STUDY_TIME:
      return {
        ...state,
        rewards: {
          ...state.rewards,
          totalStudyTime: state.rewards.totalStudyTime + action.payload
        }
      };
    
    case ACTION_TYPES.UPDATE_DAILY_STUDY_TIME:
      return {
        ...state,
        analytics: {
          ...state.analytics,
          dailyStudyTime: [...state.analytics.dailyStudyTime, action.payload]
        }
      };
    
    case ACTION_TYPES.UPDATE_COMPLETED_TASKS:
      return {
        ...state,
        analytics: {
          ...state.analytics,
          completedTasks: [...state.analytics.completedTasks, action.payload]
        }
      };
    
    case ACTION_TYPES.UPDATE_POINTS_HISTORY:
      return {
        ...state,
        analytics: {
          ...state.analytics,
          pointsHistory: [...state.analytics.pointsHistory, action.payload]
        }
      };
    
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    
    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load persisted data on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedTasks = localStorage.getItem('tasks');
    const savedRewards = localStorage.getItem('rewards');
    
    if (savedUser) {
      dispatch({ type: ACTION_TYPES.SET_USER, payload: JSON.parse(savedUser) });
    }
    
    if (savedTasks) {
      dispatch({ type: 'LOAD_TASKS', payload: JSON.parse(savedTasks) });
    }
    
    if (savedRewards) {
      dispatch({ type: 'LOAD_REWARDS', payload: JSON.parse(savedRewards) });
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    }
    
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    localStorage.setItem('rewards', JSON.stringify(state.rewards));
  }, [state.user, state.tasks, state.rewards]);

  // Action creators
  const actions = {
    // Auth actions
    setUser: (user) => dispatch({ type: ACTION_TYPES.SET_USER, payload: user }),
    logout: () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      dispatch({ type: ACTION_TYPES.LOGOUT });
    },
    
    // Task actions
    addTask: (task) => dispatch({ type: ACTION_TYPES.ADD_TASK, payload: { ...task, id: Date.now().toString() } }),
    updateTask: (task) => dispatch({ type: ACTION_TYPES.UPDATE_TASK, payload: task }),
    deleteTask: (taskId) => dispatch({ type: ACTION_TYPES.DELETE_TASK, payload: taskId }),
    setCurrentTask: (task) => dispatch({ type: ACTION_TYPES.SET_CURRENT_TASK, payload: task }),
    completeTask: (taskId) => dispatch({ type: ACTION_TYPES.COMPLETE_TASK, payload: taskId }),
    
    // Timer actions
    startTimer: (taskId, duration) => dispatch({ type: ACTION_TYPES.START_TIMER, payload: { taskId, duration } }),
    pauseTimer: () => dispatch({ type: ACTION_TYPES.PAUSE_TIMER }),
    resetTimer: () => dispatch({ type: ACTION_TYPES.RESET_TIMER }),
    updateTimer: (timeRemaining) => dispatch({ type: ACTION_TYPES.UPDATE_TIMER, payload: timeRemaining }),
    
    // Rewards actions
    addPoints: (points) => dispatch({ type: ACTION_TYPES.ADD_POINTS, payload: points }),
    addCoins: (coins) => dispatch({ type: ACTION_TYPES.ADD_COINS, payload: coins }),
    claimDailyLogin: () => dispatch({ type: ACTION_TYPES.CLAIM_DAILY_LOGIN }),
    updateStudyStreak: (streak) => dispatch({ type: ACTION_TYPES.UPDATE_STUDY_STREAK, payload: streak }),
    updateStudyTime: (time) => dispatch({ type: ACTION_TYPES.UPDATE_STUDY_TIME, payload: time }),
    
    // Analytics actions
    updateDailyStudyTime: (data) => dispatch({ type: ACTION_TYPES.UPDATE_DAILY_STUDY_TIME, payload: data }),
    updateCompletedTasks: (data) => dispatch({ type: ACTION_TYPES.UPDATE_COMPLETED_TASKS, payload: data }),
    updatePointsHistory: (data) => dispatch({ type: ACTION_TYPES.UPDATE_POINTS_HISTORY, payload: data }),
    
    // UI actions
    setLoading: (loading) => dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ACTION_TYPES.CLEAR_ERROR })
  };

  const value = {
    state,
    actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export { ACTION_TYPES };
