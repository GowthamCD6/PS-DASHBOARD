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

const CompletedLevelsModal = ({ open, onClose, studentData }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10B981';
      case 'Intermediate': return '#F59E0B';
      case 'Advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // Filter skills to show only those with progress > 0
  const completedSkills = skillsData.filter(skill => skill.progress > 0);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
          width: '800px',
          maxWidth: '800px'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 2,
        borderBottom: '1px solid #E5E7EB'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1F2937' }}>
          Completed Skills & Progress
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2 }}>
        {completedSkills.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ color: '#6B7280', mb: 2 }}>
              No completed skills yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
              Start working on skills to see your progress here!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {completedSkills.map((skill) => (
              <Grid item xs={6} key={skill.id}>
                <Card 
                  sx={{ 
                    height: '180px',
                    width: '100%',
                    borderRadius: 2,
                    border: '1px solid #E5E7EB',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Skill Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box 
                        sx={{ 
                          fontSize: '2.5rem', 
                          mr: 2,
                          width: 50,
                          height: 50,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 2,
                          backgroundColor: '#F8F9FA'
                        }}
                      >
                        {skill.image}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600, 
                            fontSize: '0.9rem',
                            lineHeight: 1.2,
                            color: '#1F2937',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {skill.name}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Level and Difficulty Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.8rem' }}>
                        📊 {skill.completedLevels}/{skill.levels} Levels
                      </Typography>
                      <Chip 
                        label={skill.difficulty}
                        size="small"
                        sx={{ 
                          backgroundColor: getDifficultyColor(skill.difficulty),
                          color: 'white',
                          fontSize: '0.7rem',
                          height: 18,
                          '& .MuiChip-label': { px: 0.5 }
                        }}
                      />
                    </Box>

                    {/* Progress Bar */}
                    <Box sx={{ mt: 'auto' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.75rem' }}>
                          Progress: {skill.progress}%
                        </Typography>
                        {skill.progress === 100 && (
                          <Chip 
                            label="✓ Completed"
                            size="small"
                            sx={{ 
                              backgroundColor: '#10B981',
                              color: 'white',
                              fontSize: '0.65rem',
                              height: 16,
                              '& .MuiChip-label': { px: 0.5 }
                            }}
                          />
                        )}
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={skill.progress} 
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#E5E7EB',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: skill.progress === 100 ? '#10B981' : skill.color,
                            borderRadius: 4,
                          }
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompletedLevelsModal;
