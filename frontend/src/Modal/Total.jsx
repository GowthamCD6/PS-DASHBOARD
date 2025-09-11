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
      maxWidth="xl" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
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
          All Skills & Levels
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {skillsData.map((skill) => (
            <Grid item xs={3} key={skill.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  minHeight: 280,
                  width: '100%',
                  minWidth: 280,
                  borderRadius: 2,
                  border: '1px solid #E5E7EB',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Skill Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                      sx={{ 
                        fontSize: '2rem', 
                        mr: 2,
                        width: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 2,
                        backgroundColor: '#F3F4F6',
                        flexShrink: 0
                      }}
                    >
                      {skill.image}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          fontSize: '1rem',
                          lineHeight: 1.2,
                          color: '#1F2937',
                          wordBreak: 'break-word'
                        }}
                      >
                        {skill.name}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Level and Difficulty Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
                      📊 Levels: {skill.levels}
                    </Typography>
                    <Chip 
                      label={skill.difficulty}
                      size="small"
                      sx={{ 
                        backgroundColor: getDifficultyColor(skill.difficulty),
                        color: 'white',
                        fontSize: '0.75rem',
                        height: 20,
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  </Box>

                  {/* Progress Bar */}
                  <Box sx={{ mb: 2, mt: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#6B7280', wordBreak: 'break-word' }}>
                        Progress: {skill.completedLevels}/{skill.levels} levels ({skill.progress}%)
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={skill.progress} 
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#E5E7EB',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: skill.color,
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
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
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

export default TotalLevelsModal;