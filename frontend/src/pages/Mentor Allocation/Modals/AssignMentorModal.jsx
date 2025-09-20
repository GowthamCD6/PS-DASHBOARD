import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Avatar,
  Autocomplete
} from '@mui/material';

const AssignMentorModal = ({
  open,
  onClose,
  selectedStudent,
  availableMentors,
  selectedMentor,
  onMentorChange,
  mentorRole,
  onMentorRoleChange,
  mentorRoles,
  onAssign,
  viewMode
}) => {
  if (viewMode !== 'assignment') return null;

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
          maxWidth: '520px',
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
        <Typography variant="h6" sx={{ 
          fontWeight: 600, 
          color: '#111827',
          fontSize: '1.25rem',
          mb: 1
        }}>
          Assign Mentor
        </Typography>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          p: 2,
          border: '1px solid #e5e7eb'
        }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: '#3b82f6',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            {selectedStudent?.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111827' }}>
              {selectedStudent?.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              {selectedStudent?.regNo} • {selectedStudent?.department}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 600, 
              mb: 1.5, 
              color: '#374151',
              fontSize: '0.875rem',
              marginTop: 1.5,
            }}>
              Select Mentor
            </Typography>
            <Autocomplete
              options={availableMentors}
              getOptionLabel={(mentor) => mentor.name}
              value={selectedMentor}
              onChange={onMentorChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search for a mentor..."
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#9ca3af',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                        borderWidth: 1
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#d1d5db'
                      }
                    }
                  }}
                />
              )}
              renderOption={(props, mentor) => (
                <Box component="li" {...props} sx={{ 
                  p: 2, 
                  borderBottom: '1px solid #f3f4f6',
                  '&:hover': {
                    backgroundColor: '#f9fafb'
                  },
                  '&:last-child': {
                    borderBottom: 'none'
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        mr: 2,
                        backgroundColor: '#3b82f6',
                        fontSize: '0.875rem',
                        fontWeight: 600
                      }}
                    >
                      {mentor.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#111827' }}>
                        {mentor.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        {mentor.department} • {mentor.type}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ 
                      color: '#6b7280',
                      backgroundColor: '#f3f4f6',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '12px',
                      fontWeight: 500
                    }}>
                      {mentor.currentStudents}/{mentor.maxStudents}
                    </Typography>
                  </Box>
                </Box>
              )}
              noOptionsText="No available mentors"
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              fullWidth
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 600, 
              mb: 1.5, 
              color: '#374151',
              fontSize: '0.875rem'
            }}>
              Mentor Role
            </Typography>
            <FormControl fullWidth>
              <Select
                value={mentorRole}
                onChange={onMentorRoleChange}
                displayEmpty
                sx={{ 
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d1d5db'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#9ca3af',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3b82f6',
                    borderWidth: 1
                  }
                }}
              >
                <MenuItem value="" disabled sx={{ color: '#9ca3af' }}>
                  Select a role for this mentor
                </MenuItem>
                {mentorRoles.map(role => (
                  <MenuItem key={role} value={role} sx={{
                    '&:hover': {
                      backgroundColor: '#f9fafb'
                    }
                  }}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {selectedMentor && (
            <Box sx={{ 
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              p: 3,
              border: '1px solid #e5e7eb'
            }}>
              <Typography variant="subtitle2" sx={{ 
                fontWeight: 600, 
                color: '#374151',
                mb: 2,
                fontSize: '0.875rem'
              }}>
                Mentor Details
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <Box>
                  <Typography variant="caption" sx={{ 
                    color: '#6b7280', 
                    fontWeight: 500, 
                    textTransform: 'uppercase', 
                    letterSpacing: 0.5,
                    fontSize: '0.75rem'
                  }}>
                    Expertise
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#111827', fontWeight: 400, mt: 0.5 }}>
                    {selectedMentor.expertise.join(', ')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ 
                    color: '#6b7280', 
                    fontWeight: 500, 
                    textTransform: 'uppercase', 
                    letterSpacing: 0.5,
                    fontSize: '0.75rem'
                  }}>
                    Availability
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#111827', fontWeight: 400, mt: 0.5 }}>
                    {selectedMentor.currentStudents}/{selectedMentor.maxStudents} students
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: '1 / 3' }}>
                  <Typography variant="caption" sx={{ 
                    color: '#6b7280', 
                    fontWeight: 500, 
                    textTransform: 'uppercase', 
                    letterSpacing: 0.5,
                    fontSize: '0.75rem'
                  }}>
                    Email
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#111827', fontWeight: 400, mt: 0.5 }}>
                    {selectedMentor.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
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
          onClick={onAssign}
          variant="contained"
          disabled={!selectedMentor || !mentorRole}
          sx={{ 
            borderRadius: '6px',
            backgroundColor: '#3b82f6',
            textTransform: 'none',
            px: 3,
            py: 1,
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': { 
              backgroundColor: '#2563eb',
              boxShadow: 'none'
            },
            '&:disabled': {
              backgroundColor: '#e5e7eb',
              color: '#9ca3af'
            }
          }}
        >
          Assign Mentor
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignMentorModal;