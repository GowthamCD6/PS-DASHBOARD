import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Slide,
  Portal,
  Box,
  IconButton
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material';

/**
 * Notification Context for managing app-wide notifications
 */
const NotificationContext = createContext();

// Custom slide transition
const SlideTransition = (props) => <Slide {...props} direction="left" />;

/**
 * Notification Provider Component
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = useCallback((notification) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification = {
      id,
      timestamp: new Date().toISOString(),
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after specified duration
    const duration = notification.duration || getDefaultDuration(notification.severity);
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Notification methods
  const success = useCallback((message, options = {}) => {
    return addNotification({
      severity: 'success',
      message,
      ...options
    });
  }, [addNotification]);

  const error = useCallback((message, options = {}) => {
    return addNotification({
      severity: 'error',
      message,
      duration: options.duration || 0, // Errors persist until manually closed
      ...options
    });
  }, [addNotification]);

  const warning = useCallback((message, options = {}) => {
    return addNotification({
      severity: 'warning',
      message,
      ...options
    });
  }, [addNotification]);

  const info = useCallback((message, options = {}) => {
    return addNotification({
      severity: 'info',
      message,
      ...options
    });
  }, [addNotification]);

  const contextValue = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

/**
 * Notification Container Component
 */
const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <Portal>
      <Box
        sx={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxWidth: 400,
          width: '100%',
          '@media (max-width: 600px)': {
            top: 16,
            right: 16,
            left: 16,
            maxWidth: 'none'
          }
        }}
      >
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={onRemove}
          />
        ))}
      </Box>
    </Portal>
  );
};

/**
 * Individual Notification Item Component
 */
const NotificationItem = ({ notification, onRemove }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    // Delay removal to allow exit animation
    setTimeout(() => onRemove(notification.id), 150);
  };

  const getSeverityIcon = (severity) => {
    const iconProps = { sx: { fontSize: 20 } };
    switch (severity) {
      case 'success': return <SuccessIcon {...iconProps} />;
      case 'error': return <ErrorIcon {...iconProps} />;
      case 'warning': return <WarningIcon {...iconProps} />;
      case 'info': return <InfoIcon {...iconProps} />;
      default: return <InfoIcon {...iconProps} />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <Snackbar
      open={open}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        position: 'static',
        transform: 'none !important',
        '& .MuiSnackbar-root': {
          position: 'static',
          transform: 'none'
        }
      }}
    >
      <Alert
        severity={notification.severity}
        onClose={notification.closable !== false ? handleClose : undefined}
        icon={getSeverityIcon(notification.severity)}
        sx={{
          width: '100%',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          border: '1px solid',
          borderColor: `${getSeverityColor(notification.severity)}20`,
          '& .MuiAlert-icon': {
            color: getSeverityColor(notification.severity),
            alignItems: 'center'
          },
          '& .MuiAlert-message': {
            padding: 0,
            flex: 1
          },
          '& .MuiAlert-action': {
            padding: 0,
            alignItems: 'flex-start',
            marginTop: '-2px'
          }
        }}
        action={
          notification.closable !== false && (
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{ 
                color: 'inherit',
                opacity: 0.7,
                '&:hover': { opacity: 1 }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )
        }
      >
        {notification.title && (
          <AlertTitle sx={{ 
            fontWeight: 600, 
            fontSize: '0.95rem',
            mb: notification.message ? 0.5 : 0 
          }}>
            {notification.title}
          </AlertTitle>
        )}
        {notification.message && (
          <Box sx={{ fontSize: '0.875rem', lineHeight: 1.4 }}>
            {notification.message}
          </Box>
        )}
        {notification.details && (
          <Box 
            sx={{ 
              fontSize: '0.8rem', 
              opacity: 0.8, 
              mt: 0.5,
              fontFamily: 'monospace' 
            }}
          >
            {notification.details}
          </Box>
        )}
      </Alert>
    </Snackbar>
  );
};

/**
 * Hook to use notifications
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

/**
 * Utility functions
 */
const getDefaultDuration = (severity) => {
  switch (severity) {
    case 'success': return 4000;
    case 'info': return 5000;
    case 'warning': return 6000;
    case 'error': return 0; // Persist until manually closed
    default: return 4000;
  }
};

/**
 * High-level notification service for common use cases
 */
export class NotificationService {
  static notify = null; // Will be set by NotificationProvider

  static success(message, options) {
    return this.notify?.success(message, options);
  }

  static error(message, error, options) {
    const errorMessage = error instanceof Error ? error.message : error;
    return this.notify?.error(message, {
      details: errorMessage,
      ...options
    });
  }

  static warning(message, options) {
    return this.notify?.warning(message, options);
  }

  static info(message, options) {
    return this.notify?.info(message, options);
  }

  // Specialized notification methods
  static authSuccess(action = 'authenticated') {
    return this.success(`Successfully ${action}`, {
      title: 'Authentication Success'
    });
  }

  static authError(error) {
    return this.error('Authentication failed', error, {
      title: 'Authentication Error'
    });
  }

  static networkError(error) {
    return this.error('Network connection failed', error, {
      title: 'Connection Error',
      closable: true
    });
  }

  static dataUpdated(itemName = 'Data') {
    return this.success(`${itemName} updated successfully`, {
      duration: 3000
    });
  }

  static dataCreated(itemName = 'Item') {
    return this.success(`${itemName} created successfully`, {
      duration: 3000
    });
  }

  static dataDeleted(itemName = 'Item') {
    return this.success(`${itemName} deleted successfully`, {
      duration: 3000
    });
  }

  static validationError(message) {
    return this.warning(message, {
      title: 'Validation Error',
      duration: 5000
    });
  }

  static operationInProgress(message) {
    return this.info(message, {
      closable: false,
      duration: 0 // Will be manually removed
    });
  }
}

export default NotificationService;