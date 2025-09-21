import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Dashboard from './layout/Dashboard';
import Dash from './pages/Dashboard/dash';
import Mentor from './pages/Mentor Allocation/page/mentor';
import Login from './components/Login/Login';
import StudentDashboard from './pages/studentdash';
import MenteeDashboard from './pages/Mentee Dashboard/mentee';
import ErrorBoundary from './components/ErrorBoundary';
import Analytics from './pages/Analytics/Analytics';
import MappingPage from './pages/Mapping/mapping';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public login routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/view-analytics" replace />} />

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
        <Route path="/" element={<Navigate to="/view-analytics" replace />} />
        <Route path="/dashboard" element={<Dash />} />
        <Route path="/mentor" element={<Mentor />} />
        <Route path="/student_dashboard" element={<StudentDashboard />} />
        <Route path="/mentee_dashboard" element={<MenteeDashboard />} />
        <Route path="/view-analytics" element={<Analytics />} />
        <Route path="/mapping" element={<MappingPage />} />
        <Route path="*" element={<Navigate to="/view-analytics" replace />} />
      </Routes>
    </Dashboard>
  );
}

export default App;
