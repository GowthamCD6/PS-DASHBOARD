import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../services/authService";

const ProtectedRoute = ({ allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authService.getCurrentUser();
        setUser(res);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
