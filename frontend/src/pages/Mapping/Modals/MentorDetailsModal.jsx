import React, { useState } from 'react';
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
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Badge
} from '@mui/material';
import {
  Mail as MailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  PersonAdd as PersonAddIcon,
  Group as GroupIcon
} from '@mui/icons-material';

const MentorDetailsModal = ({
  open,
  onClose,
  selectedMentorDetails,
  mentorStudentMapping
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
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

            {/* Student Assignment Section */}
            <Box>
              {(() => {
                const allStudents = mentorStudentMapping[selectedMentorDetails.id]?.students || [];
                const defaultStudents = allStudents.filter(student => student.assignmentType === 'default');
                const manuallyAssigned = allStudents.filter(student => student.assignmentType === 'manual');
                const totalStudents = allStudents.length;
                
                return (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Student Assignments ({totalStudents})
                      </Typography>
                      
                      {/* Show toggle only for Faculty mentors */}
                      {selectedMentorDetails.type === 'Faculty' && totalStudents > 0 && (
                        <ToggleButtonGroup
                          value={selectedCategory}
                          exclusive
                          onChange={(e, newCategory) => newCategory && setSelectedCategory(newCategory)}
                          size="small"
                          sx={{
                            '& .MuiToggleButton-root': {
                              textTransform: 'none',
                              fontSize: '0.75rem',
                              px: 1.5,
                              py: 0.5,
                              border: '1px solid #e2e8f0',
                              '&.Mui-selected': {
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: '#2563eb'
                                }
                              }
                            }
                          }}
                        >
                          <ToggleButton value="all">
                            <Badge badgeContent={totalStudents} color="primary" sx={{ mr: 1 }}>
                              <GroupIcon fontSize="small" />
                            </Badge>
                            All
                          </ToggleButton>
                          <ToggleButton value="default">
                            <Badge badgeContent={defaultStudents.length} color="secondary" sx={{ mr: 1 }}>
                              <SchoolIcon fontSize="small" />
                            </Badge>
                            Default
                          </ToggleButton>
                          <ToggleButton value="manual">
                            <Badge badgeContent={manuallyAssigned.length} color="success" sx={{ mr: 1 }}>
                              <PersonAddIcon fontSize="small" />
                            </Badge>
                            Assigned
                          </ToggleButton>
                        </ToggleButtonGroup>
                      )}
                    </Box>

                    {totalStudents > 0 ? (
                      <Box sx={{ 
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        p: 1.5,
                        maxHeight: 450,
                        overflow: 'auto',
                        '&::-webkit-scrollbar': {
                          width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: '#f1f1f1',
                          borderRadius: '3px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: '#c1c1c1',
                          borderRadius: '3px',
                          '&:hover': {
                            backgroundColor: '#a8a8a8',
                          },
                        },
                      }}>
                        {(() => {
                          let studentsToShow = [];
                          
                          if (selectedMentorDetails.type === 'Intern') {
                            // For interns, show only manually assigned students
                            studentsToShow = manuallyAssigned;
                          } else if (selectedMentorDetails.type === 'Faculty') {
                            // For faculty, show based on selected category
                            switch (selectedCategory) {
                              case 'default':
                                studentsToShow = defaultStudents;
                                break;
                              case 'manual':
                                studentsToShow = manuallyAssigned;
                                break;
                              default:
                                studentsToShow = allStudents;
                            }
                          } else {
                            studentsToShow = allStudents;
                          }

                          if (studentsToShow.length === 0) {
                            const categoryText = selectedMentorDetails.type === 'Faculty' && selectedCategory !== 'all' 
                              ? ` in ${selectedCategory === 'default' ? 'default assignments' : 'manual assignments'}`
                              : '';
                            return (
                              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                No students found{categoryText}
                              </Typography>
                            );
                          }

                          return (
                            <Box sx={{ 
                              display: 'grid', 
                              gridTemplateColumns: '1fr 1fr', 
                              gap: 1.5,
                              maxWidth: '100%'
                            }}>
                              {studentsToShow.map((student) => (
                                <Card 
                                  key={student.id}
                                  sx={{ 
                                    p: 1.5, 
                                    backgroundColor: 'white',
                                    border: '1px solid',
                                    borderColor: student.assignmentType === 'default' ? '#e0e7ff' : '#d1fae5',
                                    borderRadius: '6px',
                                    width: '100%',
                                    maxWidth: '280px',
                                    minWidth: '220px',
                                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
                                    transition: 'all 0.2s ease-in-out',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                      transform: 'translateY(-2px)',
                                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                                    }
                                  }}
                                >
                                  {/* Assignment Type Badge */}
                                  {selectedMentorDetails.type === 'Faculty' && (
                                    <Chip
                                      label={student.assignmentType === 'default' ? 'Default' : 'Assigned'}
                                      size="small"
                                      sx={{
                                        position: 'absolute',
                                        top: 6,
                                        right: 6,
                                        fontSize: '0.6rem',
                                        height: '18px',
                                        backgroundColor: student.assignmentType === 'default' ? '#e0e7ff' : '#d1fae5',
                                        color: student.assignmentType === 'default' ? '#3730a3' : '#065f46',
                                        fontWeight: 600,
                                        '& .MuiChip-label': {
                                          px: 0.5
                                        }
                                      }}
                                    />
                                  )}
                                  
                                  <Typography variant="body2" sx={{ 
                                    fontWeight: 600, 
                                    mb: 0.5, 
                                    pr: selectedMentorDetails.type === 'Faculty' ? 4 : 1,
                                    fontSize: '0.85rem',
                                    lineHeight: 1.2,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {student.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ 
                                    display: 'block', 
                                    mb: 0.3,
                                    fontSize: '0.7rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {student.regNo}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ 
                                    display: 'block', 
                                    mb: 0.3,
                                    fontSize: '0.7rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {student.department}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ 
                                    display: 'block',
                                    fontSize: '0.65rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {student.email}
                                  </Typography>
                                  
                                  {student.assignedDate && (
                                    <Typography variant="caption" sx={{ 
                                      display: 'block', 
                                      mt: 0.5, 
                                      color: '#6b7280',
                                      fontStyle: 'italic',
                                      fontSize: '0.65rem',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}>
                                      {student.assignmentType === 'default' ? 'Default Assignment' : `Assigned: ${student.assignedDate}`}
                                    </Typography>
                                  )}
                                </Card>
                              ))}
                            </Box>
                          );
                        })()}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        No students currently assigned to this mentor
                      </Typography>
                    )}
                  </>
                );
              })()}
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