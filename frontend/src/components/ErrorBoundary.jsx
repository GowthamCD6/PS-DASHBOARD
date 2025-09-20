import React from 'react';
import { 
  Alert, 
  Box, 
  Button, 
  Typography, 
  Card, 
  CardContent,
  Chip,
  Collapse,
  IconButton,
  Stack,
  Avatar
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  RestartAlt as RestartIcon,
  ExpandMore as ExpandMoreIcon,
  BugReport as BugReportIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import errorReportingService from '../services/errorReportingService';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Report error using the error reporting service
    const errorId = errorReportingService.reportJSError(error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorId: errorId
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null, 
      showDetails: false,
      errorId: null 
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  toggleDetails = () => {
    this.setState(prevState => ({ 
      showDetails: !prevState.showDetails 
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
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
              maxWidth: 600,
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              background: 'white'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3} alignItems="center" textAlign="center">
                {/* Error Icon */}
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#fee2e2',
                    color: '#dc2626'
                  }}
                >
                  <ErrorIcon sx={{ fontSize: 40 }} />
                </Avatar>

                {/* Main Error Message */}
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
                    Oops! Something went wrong
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
                    We encountered an unexpected error. Don't worry, our team has been notified and is working on a fix.
                  </Typography>
                  
                  {/* Error ID Chip */}
                  {this.state.errorId && (
                    <Chip
                      label={`Error ID: ${this.state.errorId}`}
                      size="small"
                      sx={{
                        backgroundColor: '#f3f4f6',
                        color: '#6b7280',
                        fontFamily: 'monospace',
                        fontSize: '0.75rem'
                      }}
                    />
                  )}
                </Box>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={this.handleReload}
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
                    Reload Page
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<RestartIcon />}
                    onClick={this.handleReset}
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
                    Try Again
                  </Button>
                  <Button
                    variant="text"
                    startIcon={<HomeIcon />}
                    onClick={this.handleGoHome}
                    sx={{
                      color: '#6b7280',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 2,
                      '&:hover': {
                        backgroundColor: '#f9fafb'
                      }
                    }}
                  >
                    Home
                  </Button>
                </Stack>

                {/* Error Details Toggle (Development Only) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <Button
                      startIcon={<BugReportIcon />}
                      endIcon={
                        <ExpandMoreIcon
                          sx={{
                            transform: this.state.showDetails ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                          }}
                        />
                      }
                      onClick={this.toggleDetails}
                      sx={{
                        color: '#6b7280',
                        textTransform: 'none',
                        fontSize: '0.875rem'
                      }}
                    >
                      {this.state.showDetails ? 'Hide' : 'Show'} Error Details
                    </Button>
                    
                    <Collapse in={this.state.showDetails}>
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          backgroundColor: '#fef2f2',
                          borderRadius: '8px',
                          border: '1px solid #fecaca',
                          textAlign: 'left',
                          maxHeight: 300,
                          overflow: 'auto'
                        }}
                      >
                        <Typography
                          variant="caption"
                          component="pre"
                          sx={{
                            color: '#dc2626',
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            lineHeight: 1.4,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                          }}
                        >
                          {this.state.error.toString()}
                          {'\n\n'}
                          {this.state.errorInfo.componentStack}
                        </Typography>
                      </Box>
                    </Collapse>
                  </Box>
                )}

                {/* Help Text */}
                <Typography
                  variant="caption"
                  sx={{
                    color: '#9ca3af',
                    fontSize: '0.875rem',
                    mt: 2
                  }}
                >
                  If this problem persists, please contact our support team with the error ID above.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
