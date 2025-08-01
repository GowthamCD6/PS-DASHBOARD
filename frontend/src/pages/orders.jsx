// src/pages/Orders.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Orders() {
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
        Orders Management
      </Typography>
    </Box>
  );
}
