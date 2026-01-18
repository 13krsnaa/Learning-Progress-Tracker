import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
