import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Card,
  CardContent,
  Button,
  Avatar,
  Stack
} from "@mui/material";
import {
  Lock as LockIcon,
  Home as HomeIcon,
  Login as LoginIcon,
  Security as SecurityIcon
} from "@mui/icons-material";
import { authService } from "../services/authService";

// Loading Component
const LoadingScreen = () => (
  <Box
    sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f6f7fb 0%, #eef2ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3
    }}
  >
    <Card
      sx={{
        p: 4,
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        background: 'white',
        border: '1px solid #e5e7eb'
      }}
    >
      <Stack spacing={3} alignItems="center">
        <CircularProgress
          size={60}
          sx={{
            color: '#3b82f6',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }}
        />
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#111827',
              mb: 1
            }}
          >
            Authenticating...
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#6b7280'
            }}
          >
            Please wait while we verify your access
          </Typography>
        </Box>
      </Stack>
    </Card>
  </Box>
);

// Unauthorized Access Component
const UnauthorizedAccess = ({ userRole, requiredRoles }) => (
  <Box
    sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f6f7fb 0%, #eef2ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3
    }}
  >
    <Card
      sx={{
        maxWidth: 500,
        width: '100%',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        background: 'white'
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3} alignItems="center" textAlign="center">
          {/* Lock Icon */}
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: '#fef3c7',
              color: '#d97706'
            }}
          >
            <LockIcon sx={{ fontSize: 40 }} />
          </Avatar>

          {/* Main Message */}
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#111827',
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}
            >
              Access Restricted
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#6b7280',
                fontSize: '1.1rem',
                lineHeight: 1.6,
                mb: 2
              }}
            >
              You don't have permission to access this page. This area is restricted to authorized personnel only.
            </Typography>
          </Box>

          {/* Role Information */}
          <Box
            sx={{
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              p: 3,
              border: '1px solid #e2e8f0',
              width: '100%'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
              <SecurityIcon sx={{ color: '#64748b', fontSize: 20 }} />
              <Box>
                <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                  Your Role: <strong>{userRole || 'Guest'}</strong>
                </Typography>
                {requiredRoles && (
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Required: {requiredRoles.join(', ')}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => window.location.href = '/'}
              sx={{
                backgroundColor: '#3b82f6',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                '&:hover': {
                  backgroundColor: '#2563eb',
                  boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)'
                }
              }}
            >
              Go Home
            </Button>
            <Button
              variant="outlined"
              startIcon={<LoginIcon />}
              onClick={() => window.location.href = '/login'}
              sx={{
                borderColor: '#d1d5db',
                color: '#6b7280',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                '&:hover': {
                  borderColor: '#9ca3af',
                  backgroundColor: '#f9fafb'
                }
              }}
            >
              Login Again
            </Button>
          </Stack>

          {/* Help Text */}
          <Typography
            variant="caption"
            sx={{
              color: '#9ca3af',
              fontSize: '0.875rem',
              mt: 2
            }}
          >
            If you believe this is an error, please contact your administrator.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  </Box>
);

const ProtectedRoute = ({ allowedRoles, requireAuth = true }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        setAuthError(null);
        
        const res = await authService.getCurrentUser();
        setUser(res);
        
        // Log successful authentication for audit
        console.log('User authenticated:', { 
          userId: res?.id, 
          role: res?.role, 
          path: location.pathname 
        });
        
      } catch (err) {
        console.error('Authentication failed:', err);
        setAuthError(err.message || 'Authentication failed');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (requireAuth) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [requireAuth, location.pathname]);

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !user) {
    return <Navigate 
      to="/login" 
      state={{ from: location.pathname }} 
      replace 
    />;
  }

  // Check role-based access control
  if (user && allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.includes(user.role);
    
    if (!hasRequiredRole) {
      // Log unauthorized access attempt
      console.warn('Unauthorized access attempt:', {
        userId: user.id,
        userRole: user.role,
        requiredRoles: allowedRoles,
        path: location.pathname
      });
      
      return <UnauthorizedAccess 
        userRole={user.role} 
        requiredRoles={allowedRoles} 
      />;
    }
  }

  // Render the protected content
  return <Outlet context={{ user }} />;
};

export default ProtectedRoute;
