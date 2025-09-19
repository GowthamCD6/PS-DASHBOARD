import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const skillsData = [
  {
    id: 1,
    name: 'Algebra',
    levels: 1,
    difficulty: 'Beginner',
    progress: 100,
    completedLevels: 1,
    color: '#8B5CF6',
    image: '🔢'
  },
  {
    id: 2,
    name: 'Aptitude',
    levels: 12,
    difficulty: 'Beginner',
    progress: 25,
    completedLevels: 3,
    color: '#3B82F6',
    image: '🧠'
  },
  {
    id: 3,
    name: 'C Programming',
    levels: 7,
    difficulty: 'Beginner',
    progress: 71,
    completedLevels: 5,
    color: '#8B5CF6',
    image: '💻'
  },
  {
    id: 4,
    name: 'Communication',
    levels: 4,
    difficulty: 'Beginner',
    progress: 25,
    completedLevels: 1,
    color: '#3B82F6',
    image: '💬'
  },
  {
    id: 5,
    name: 'Computer Networking',
    levels: 4,
    difficulty: 'Intermediate',
    progress: 25,
    completedLevels: 1,
    color: '#8B5CF6',
    image: '🌐'
  },
  {
    id: 6,
    name: 'General Engineering',
    levels: 1,
    difficulty: 'Beginner',
    progress: 0,
    completedLevels: 0,
    color: '#6B7280',
    image: '⚙️'
  },
  {
    id: 7,
    name: 'GP Challenge',
    levels: 1,
    difficulty: 'Beginner',
    progress: 0,
    completedLevels: 0,
    color: '#6B7280',
    image: '🎯'
  },
  {
    id: 8,
    name: 'IPR',
    levels: 1,
    difficulty: 'Beginner',
    progress: 0,
    completedLevels: 0,
    color: '#6B7280',
    image: '⚖️'
  },
  {
    id: 9,
    name: 'IPR - Patent Search',
    levels: 2,
    difficulty: 'Beginner',
    progress: 50,
    completedLevels: 1,
    color: '#8B5CF6',
    image: '🔍'
  },
  {
    id: 10,
    name: 'Leadership',
    levels: 4,
    difficulty: 'Beginner',
    progress: 0,
    completedLevels: 0,
    color: '#6B7280',
    image: '👥'
  },
  {
    id: 11,
    name: 'Learning Center',
    levels: 4,
    difficulty: 'Beginner',
    progress: 0,
    completedLevels: 0,
    color: '#6B7280',
    image: '📚'
  },
  {
    id: 12,
    name: 'Linux',
    levels: 4,
    difficulty: 'Advanced',
    progress: 0,
    completedLevels: 0,
    color: '#6B7280',
    image: '🐧'
  },
  {
    id: 13,
    name: 'New Product Development',
    levels: 4,
    difficulty: 'Beginner',
    progress: 0,
    completedLevels: 0,
    color: '#6B7280',
    image: '💡'
  },
  {
    id: 14,
    name: 'Physical Fitness',
    levels: 4,
    difficulty: 'Beginner',
    progress: 0,
    completedLevels: 0,
    color: '#6B7280',
    image: '🏃'
  },
  {
    id: 15,
    name: 'Problem Solving Skills',
    levels: 1,
    difficulty: 'Beginner',
    progress: 0,
    completedLevels: 0,
    color: '#6B7280',
    image: '🧩'
  },
  {
    id: 16,
    name: 'Professional Networking',
    levels: 1,
    difficulty: 'Beginner',
    progress: 0,
    completedLevels: 0,
    color: '#6B7280',
    image: '🤝'
  },
  {
    id: 17,
    name: 'Reading Classroom',
    levels: 7,
    difficulty: 'Beginner',
    progress: 0,
    completedLevels: 0,
    color: '#6B7280',
    image: '📖'
  },
  {
    id: 18,
    name: 'Special Lab',
    levels: 24,
    difficulty: 'Beginner',
    progress: 0,
    completedLevels: 0,
    color: '#6B7280',
    image: '🧪'
  },
  {
    id: 19,
    name: 'System Administration',
    levels: 4,
    difficulty: 'Beginner',
    progress: 25,
    completedLevels: 1,
    color: '#3B82F6',
    image: '🖥️'
  },
  {
    id: 20,
    name: 'TRIZ',
    levels: 1,
    difficulty: 'Beginner',
    progress: 100,
    completedLevels: 1,
    color: '#8B5CF6',
    image: '🧩'
  }
];

const TotalLevelsModal = ({ open, onClose, studentData }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10B981';
      case 'Intermediate': return '#F59E0B';
      case 'Advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
          width: '1050px',
          maxWidth: '1050px'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 3,
        pb: 2,
        background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
        borderBottom: '2px solid #e2e8f0'
      }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, 
            color: '#0f172a',
            letterSpacing: '-0.025em',
            mb: 0.5
          }}>
            All Skills & Levels
          </Typography>
          <Typography variant="subtitle1" sx={{ 
            color: '#64748b', 
            fontWeight: 500
          }}>
            Track your learning journey and achievements
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose} 
          size="large"
          sx={{
            backgroundColor: '#f1f5f9',
            border: '2px solid #e2e8f0',
            '&:hover': {
              backgroundColor: '#e2e8f0',
              transform: 'scale(1.05)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, pt: 2, pb: 3, backgroundColor: '#fafbfc' }}>
        <Grid container spacing={3} sx={{ justifyContent: 'flex-start', alignItems: 'stretch', mt: 0 }}>
          {skillsData.map((skill) => (
            <Grid item xs={4} key={skill.id} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card 
                sx={{ 
                  width: 260,
                  height: 240,
                  borderRadius: 4,
                  border: '2px solid #f1f5f9',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    borderColor: '#e2e8f0',
                    '& .skill-icon': {
                      transform: 'scale(1.1)',
                    }
                  },
                  '&:focus-visible': {
                    outline: '2px solid #3b82f6',
                    outlineOffset: '2px'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: skill.progress === 100 
                      ? 'linear-gradient(90deg, #10B981, #059669)' 
                      : `linear-gradient(90deg, ${skill.color}, ${skill.color}CC)`,
                  }
                }}
              >
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  {/* Skill Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                      className="skill-icon"
                      sx={{ 
                        fontSize: '2.5rem', 
                        mr: 2.5,
                        width: 64,
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '16px',
                        background: skill.progress === 100 
                          ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
                          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                        border: `2px solid ${skill.progress === 100 ? '#a7f3d0' : '#e2e8f0'}`,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        '&::after': skill.progress === 100 ? {
                          content: '"✓"',
                          position: 'absolute',
                          bottom: -2,
                          right: -2,
                          width: 18,
                          height: 18,
                          background: '#10B981',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          color: 'white',
                          fontWeight: 'bold'
                        } : {}
                      }}
                    >
                      {skill.image}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: '1.1rem',
                          lineHeight: 1.2,
                          color: '#1e293b',
                          mb: 0.5,
                          letterSpacing: '-0.025em'
                        }}
                      >
                        {skill.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#64748b',
                          fontSize: '0.8rem',
                          fontWeight: 500
                        }}
                      >
                        {skill.completedLevels} of {skill.levels} levels completed
                      </Typography>
                    </Box>
                  </Box>

                  {/* Stats and Difficulty */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box 
                        sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          backgroundColor: skill.progress === 100 ? '#10B981' : skill.color 
                        }} 
                      />
                      <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                        {skill.progress}% Complete
                      </Typography>
                    </Box>
                    <Chip 
                      label={skill.difficulty}
                      size="small"
                      sx={{ 
                        backgroundColor: getDifficultyColor(skill.difficulty),
                        color: 'white',
                        fontSize: '0.75rem',
                        height: 24,
                        fontWeight: 600,
                        borderRadius: '12px',
                        '& .MuiChip-label': { px: 1.5 }
                      }}
                    />
                  </Box>

                  {/* Progress Section */}
                  <Box sx={{ mt: 'auto' }}>
                    {skill.progress === 100 && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mb: 2,
                        p: 1.5,
                        backgroundColor: '#ecfdf5',
                        borderRadius: 2,
                        border: '1px solid #a7f3d0'
                      }}>
                        <Typography variant="body2" sx={{ 
                          color: '#047857', 
                          fontSize: '0.85rem', 
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}>
                          🎉 Skill Mastered!
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600 }}>
                          Progress
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1e293b', fontSize: '0.8rem', fontWeight: 700 }}>
                          {skill.progress}%
                        </Typography>
                      </Box>
                      <Box sx={{ position: 'relative' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={skill.progress} 
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#f1f5f9',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              background: skill.progress === 100 
                                ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                                : `linear-gradient(90deg, ${skill.color} 0%, ${skill.color}DD 100%)`,
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 4, 
        pt: 2, 
        backgroundColor: '#f8fafc',
        borderTop: '2px solid #e2e8f0',
        justifyContent: 'center'
      }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          size="large"
          sx={{ 
            borderRadius: 3,
            textTransform: 'none',
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
              boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TotalLevelsModal;