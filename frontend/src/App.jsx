import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Dashboard from './layout/Dashboard';
import Dash from './pages/dash';
import Mentor from './pages/mentor';
import Login from './components/Login/Login';
import StudentDashboard from './pages/studentdash';
import MenteeDashboard from './pages/mentee';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public login routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />

          {/* Dashboard routes */}
          <Route path="/*" element={<DashboardRoutes />} />
        </Routes>
      </Router>
    </ErrorBoundary>
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
