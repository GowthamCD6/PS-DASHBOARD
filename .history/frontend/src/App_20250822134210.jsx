import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, createContext, useContext, useEffect } from 'react';
import Dashboard from './layout/Dashboard';
import Dash from './pages/dash';
import Mentor from './pages/mentor';
import Login from './components/Login/Login';
import StudentDashboard from './pages/studentdash';
import MenteeDashboard from './pages/mentee';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './services';

// Create Authentication Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      setIsAuthenticated(authenticated);
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    setIsAuthenticated(true);
    setUser(userData);
    // Token is already stored in authService.login()
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      setIsAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <DashboardRoutes />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
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
