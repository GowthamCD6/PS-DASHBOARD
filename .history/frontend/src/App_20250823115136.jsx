import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import Dashboard from './layout/Dashboard';
import Dash from './pages/dash';
import Mentor from './pages/mentor';
import Login from './components/Login/Login';
import StudentDashboard from './pages/studentdash';
import MenteeDashboard from './pages/mentee';
import { authService } from './services';

function App() {
  // Initialize authentication on app start
  useEffect(() => {
    authService.initializeAuth();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route 
          path="/*" 
          element={<DashboardRoutes />}
        />
      </Routes>
    </Router>
  );
}

function DashboardRoutes() {
  return (
    <Dashboard>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dash />} />
        <Route path="/mentor" element={<Mentor />} />
        <Route path="/student_dashboard" element={<StudentDashboard />} />
        <Route path="/mentee_dashboard" element={<MenteeDashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Dashboard>
  );
}

export default App;
