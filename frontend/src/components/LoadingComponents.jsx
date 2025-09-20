import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  Stack,
  Skeleton
} from '@mui/material';

/**
 * Centralized Loading Components for consistent UI across the application
 */

// Full page loading screen
export const FullPageLoader = ({ 
  message = "Loading...", 
  subMessage = "Please wait while we prepare everything for you" 
}) => (
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
        border: '1px solid #e5e7eb',
        maxWidth: 400
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
            {message}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#6b7280'
            }}
          >
            {subMessage}
          </Typography>
        </Box>
      </Stack>
    </Card>
  </Box>
);

// Inline loading spinner
export const InlineLoader = ({ 
  size = 40, 
  message = "Loading...", 
  color = '#3b82f6' 
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      gap: 2
    }}
  >
    <CircularProgress
      size={size}
      sx={{
        color,
        '& .MuiCircularProgress-circle': {
          strokeLinecap: 'round',
        }
      }}
    />
    {message && (
      <Typography
        variant="body2"
        sx={{ color: '#6b7280', textAlign: 'center' }}
      >
        {message}
      </Typography>
    )}
  </Box>
);

// Loading overlay for content
export const LoadingOverlay = ({ 
  loading, 
  children, 
  message = "Loading..." 
}) => (
  <Box sx={{ position: 'relative', minHeight: loading ? 200 : 'auto' }}>
    {loading && (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(2px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          borderRadius: 'inherit'
        }}
      >
        <InlineLoader message={message} />
      </Box>
    )}
    {children}
  </Box>
);

// Table loading skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <Box>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <Box
        key={rowIndex}
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 2,
          p: 2,
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="text"
            height={20}
            sx={{ borderRadius: '4px' }}
          />
        ))}
      </Box>
    ))}
  </Box>
);

// Card loading skeleton
export const CardSkeleton = ({ count = 3 }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 3
    }}
  >
    {Array.from({ length: count }).map((_, index) => (
      <Card key={index} sx={{ p: 3, borderRadius: '12px' }}>
        <Stack spacing={2}>
          <Skeleton variant="circular" width={60} height={60} />
          <Skeleton variant="text" height={24} width="60%" />
          <Skeleton variant="text" height={20} width="80%" />
          <Skeleton variant="text" height={20} width="40%" />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: '16px' }} />
            <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: '16px' }} />
          </Box>
        </Stack>
      </Card>
    ))}
  </Box>
);

// Progress with message
export const ProgressLoader = ({ 
  progress, 
  message, 
  subMessage,
  showPercentage = true 
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      p: 3
    }}
  >
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={progress}
        size={80}
        thickness={4}
        sx={{ color: '#3b82f6' }}
      />
      {showPercentage && (
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ color: '#3b82f6', fontWeight: 600 }}
          >
            {`${Math.round(progress)}%`}
          </Typography>
        </Box>
      )}
    </Box>
    {message && (
      <Typography variant="h6" sx={{ color: '#111827', fontWeight: 600 }}>
        {message}
      </Typography>
    )}
    {subMessage && (
      <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center' }}>
        {subMessage}
      </Typography>
    )}
  </Box>
);