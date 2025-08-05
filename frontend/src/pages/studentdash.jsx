import React from 'react';
import { Box, Typography } from '@mui/material';

export default function StudentDashboard() {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Student Dashboard
      </Typography>
    </Box>
  );
}
