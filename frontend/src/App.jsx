import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, createContext, useContext } from 'react';
import Dashboard from './layout/Dashboard';
import Dash from './pages/dash';
import Orders from './pages/orders';
import Login from './components/Login/Login';

// Create Authentication Context
const AuthContext = createContext();

export const useAuth = () => {
  // const context = useContext(AuthContext);
  // if (!context) {
  //   throw new Error('useAuth must be used within an AuthProvider');
  // }
  return { isAuthenticated: true, user: null, login: () => {}, logout: () => {}, setIsAuthenticated: () => {} };
};
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ element, isAuthenticated }) => {
  // Idha set pannadhukku aprm delete panniru
  return element;
  
  // Original authentication logic (commented out)
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // } 
  // return element;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/*" 
        element={
          <PrivateRoute 
            element={<DashboardRoutes />} 
            isAuthenticated={isAuthenticated} 
          />
        } 
      />
    </Routes>
  );
}

function DashboardRoutes() {
  return (
    <Dashboard>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dash />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Dashboard>
  );
}

export default App;
