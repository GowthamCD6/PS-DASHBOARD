import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Avatar,
  Card,
  Grid,
  Divider
} from '@mui/material';
import {
  Mail as MailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

const MentorDetailsModal = ({
  open,
  onClose,
  selectedMentorDetails,
  mentorStudentMapping
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: '12px' }
      }}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid',
        borderColor: 'divider',
        pb: 2
      }}>
        Mentor Profile & Student Mapping
      </DialogTitle>
      {selectedMentorDetails && (
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                sx={{ 
                  width: 64, 
                  height: 64,
                  backgroundColor: 
                    selectedMentorDetails.type === 'Faculty' ? 'primary.main' : 
                    selectedMentorDetails.type === 'Intern' ? 'secondary.main' : 'grey.500'
                }}
              >
                {selectedMentorDetails.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Box>
                <Typography variant="h6">{selectedMentorDetails.name}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {selectedMentorDetails.department} • {selectedMentorDetails.role}
                </Typography>
                <Chip 
                  label={selectedMentorDetails.type}
                  size="small"
                  sx={{ 
                    mt: 0.5,
                    backgroundColor: 
                      selectedMentorDetails.type === 'Faculty' ? 'primary.light' : 
                      selectedMentorDetails.type === 'Intern' ? 'secondary.light' : 'grey.300',
                    color: 
                      selectedMentorDetails.type === 'Faculty' ? 'primary.dark' : 
                      selectedMentorDetails.type === 'Intern' ? 'secondary.dark' : 'grey.700'
                  }}
                />
              </Box>
            </Box>
            
            <Divider />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Contact Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MailIcon color="action" fontSize="small" />
                    <Typography variant="body2">{selectedMentorDetails.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon color="action" fontSize="small" />
                    <Typography variant="body2">{selectedMentorDetails.phone}</Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Areas of Expertise
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedMentorDetails.expertise.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      sx={{ borderRadius: '8px' }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Assigned Students ({mentorStudentMapping[selectedMentorDetails.id]?.students.length || 0})
              </Typography>
              {mentorStudentMapping[selectedMentorDetails.id]?.students.length > 0 ? (
                <Box sx={{ 
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  p: 2,
                  maxHeight: 400,
                  overflow: 'auto'
                }}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 2,
                    }}
                  >
                    {mentorStudentMapping[selectedMentorDetails.id].students.map((student) => (
                      <Card 
                        key={student.id}
                        sx={{ 
                          p: 2, 
                          backgroundColor: 'white',
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: '8px',
                          width: '100%',
                          minWidth: '250px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                          }
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          {student.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          {student.regNo}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          {student.department} - {student.year} Year
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {student.email}
                        </Typography>
                      </Card>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No students currently assigned to this mentor
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
      )}
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose}
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none'
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MentorDetailsModal;