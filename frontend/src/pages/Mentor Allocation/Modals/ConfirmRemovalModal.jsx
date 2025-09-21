import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Avatar
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const ConfirmRemovalModal = ({
  open,
  onClose,
  onConfirm,
  removalData
}) => {
  // Add null check to prevent errors
  if (!removalData) {
    return null;
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: { 
          borderRadius: '8px',
          background: '#ffffff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
          maxWidth: '480px',
          margin: 2
        }
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        p: 3,
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: '#dc2626',
              color: 'white'
            }}
          >
            <DeleteIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              color: '#111827',
              fontSize: '1.25rem',
              mb: 0.5
            }}>
              Remove Mentor Assignment
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              This action cannot be undone
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ 
          backgroundColor: '#fef2f2',
          borderRadius: '6px',
          p: 3,
          border: '1px solid #fecaca',
          mb: 3
        }}>
          <Typography variant="body1" sx={{ 
            color: '#374151',
            fontWeight: 500,
            mb: 2,
            lineHeight: 1.6
          }}>
            Are you sure you want to remove <strong>{removalData?.mentor?.name}</strong> as a mentor 
            from <strong>{removalData?.student?.name}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#6b7280',
            lineHeight: 1.5
          }}>
            The mentor will no longer be assigned to this student and their current student count 
            will be decreased. You can reassign the mentor later if needed.
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          p: 2,
          border: '1px solid #e5e7eb'
        }}>
          <InfoIcon sx={{ color: '#3b82f6', fontSize: '20px' }} />
          <Typography variant="body2" sx={{ 
            color: '#374151',
            fontSize: '0.875rem'
          }}>
            This will only remove the mentor assignment. Neither the student nor mentor profiles will be deleted.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: 3,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        gap: 2,
        justifyContent: 'flex-end'
      }}>
        <Button 
          onClick={onClose}
          sx={{ 
            borderRadius: '6px',
            textTransform: 'none',
            px: 3,
            py: 1,
            fontWeight: 500,
            color: '#6b7280',
            border: '1px solid #d1d5db',
            backgroundColor: '#ffffff',
            '&:hover': { 
              backgroundColor: '#f9fafb',
              borderColor: '#9ca3af'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm}
          variant="contained"
          sx={{ 
            borderRadius: '6px',
            backgroundColor: '#dc2626',
            textTransform: 'none',
            px: 3,
            py: 1,
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': { 
              backgroundColor: '#b91c1c',
              boxShadow: 'none'
            }
          }}
        >
          Remove Mentor
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmRemovalModal;