// src/pages/Dash.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Dash() {
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
        Welcome to Your Dashboard
      </Typography>
      <Typography variant="body1">
        This is the content area. You can edit this `Dash.jsx` file to change what's shown here.
      </Typography>
    </Box>
  );
}
