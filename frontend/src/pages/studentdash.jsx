import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Construction as ConstructionIcon, Schedule as ScheduleIcon } from '@mui/icons-material';

export default function StudentDashboard() {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
      }}
    >
      <Paper
        sx={{
          p: 6,
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          maxWidth: 500,
          width: '100%',
          mx: 2,
        }}
      >
        <ConstructionIcon
          sx={{
            fontSize: '4rem',
            mb: 2,
            opacity: 0.9,
          }}
        />
        
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 2,
            fontSize: { xs: '2rem', sm: '3rem' }
          }}
        >
          Student Dashboard
        </Typography>
        
        <Chip
          icon={<ScheduleIcon />}
          label="Coming Soon"
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            fontSize: '1rem',
            py: 2,
            px: 1,
            mb: 3,
            '& .MuiChip-icon': {
              color: 'white',
            },
          }}
        />
        
        <Typography 
          variant="body1" 
          sx={{ 
            opacity: 0.9,
            fontSize: '1.1rem',
            lineHeight: 1.6,
          }}
        >
          We're working hard to bring you an amazing student experience. 
          Stay tuned for exciting features and updates!
        </Typography>
      </Paper>
    </Box>
  );
}
