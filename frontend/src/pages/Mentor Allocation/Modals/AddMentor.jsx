import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Avatar,
  Typography
} from '@mui/material';
import {
  Person as PersonIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon
} from '@mui/icons-material';

const mentorTypes = ['faculty', 'non teaching faculty', 'intern', 'senior'];

const AddMentor = ({ open, onClose, onAddMentor }) => {
  const [newMentor, setNewMentor] = useState({
    name: '',
    department: '',
    type: '',
    expertise: [],
    email: '',
    phone: '',
    maxStudents: '60'
  });

  useEffect(() => {
    // Reset form when dialog opens
    if (open) {
      setNewMentor({
        name: '',
        department: '',
        type: '',
        expertise: [],
        email: '',
        phone: '',
        maxStudents: '60'
      });
    }
  }, [open]);

  const handleAdd = () => {
    onAddMentor(newMentor);
    onClose(); // Close the dialog after adding
  };

  const isFormValid = () => {
    return (
      newMentor.name &&
      newMentor.department &&
      newMentor.type &&
      newMentor.email &&
      newMentor.phone &&
      newMentor.maxStudents
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: '12px' }
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        pb: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Avatar sx={{
          bgcolor: 'primary.main',
          width: 60,
          height: 60
        }}>
          <PersonIcon />
        </Avatar>
        <Box>
          <Typography variant="h6">Add New Mentor</Typography>
          <Typography variant="caption" color="text.secondary">
            Enter mentor details to add them to the system
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={newMentor.name}
              onChange={(e) => setNewMentor({ ...newMentor, name: e.target.value })}
              size="small"
              required
            />
            <FormControl fullWidth size="small" required>
              <InputLabel>Mentor Type</InputLabel>
              <Select
                value={newMentor.type}
                label="Mentor Type"
                onChange={(e) => setNewMentor({ ...newMentor, type: e.target.value })}
              >
                {mentorTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Department</InputLabel>
              <Select
                value={newMentor.department}
                label="Department"
                onChange={(e) => setNewMentor({ ...newMentor, department: e.target.value })}
              >
                <MenuItem value="Computer Science">Computer Science</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Mechanical">Mechanical</MenuItem>
                <MenuItem value="Electrical">Electrical</MenuItem>
                <MenuItem value="Industry">Industry</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            fullWidth
            label="Areas of Expertise"
            value={newMentor.expertise}
            onChange={(e) => setNewMentor({ ...newMentor, expertise: e.target.value })}
            placeholder="Comma separated: e.g., AI/ML, Web Development"
            size="small"
            required
            multiline
            rows={2}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={newMentor.email}
              onChange={(e) => setNewMentor({ ...newMentor, email: e.target.value })}
              size="small"
              required
              InputProps={{
                startAdornment: <MailIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            <TextField
              fullWidth
              label="Phone"
              value={newMentor.phone}
              onChange={(e) => setNewMentor({ ...newMentor, phone: e.target.value })}
              size="small"
              required
              InputProps={{
                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Box>

          <Box sx={{
            backgroundColor: '#f8f9fa',
            p: 2,
            borderRadius: '8px',
            borderLeft: '4px solid',
            borderColor: 'primary.main'
          }}>
            <Typography variant="subtitle2" gutterBottom>
              Student Capacity
            </Typography>
            <TextField
              fullWidth
              label="Maximum Students"
              type="number"
              value={newMentor.maxStudents}
              onChange={(e) => setNewMentor({ ...newMentor, maxStudents: e.target.value })}
              size="small"
              required
              InputProps={{
                inputProps: { min: 1 },
                startAdornment: <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              helperText="Maximum number of students this mentor can supervise"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{
        p: 3,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: '8px',
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={!isFormValid()}
          sx={{
            borderRadius: '8px',
            boxShadow: 'none',
            textTransform: 'none',
            px: 3,
            '&:hover': { boxShadow: 'none' }
          }}
        >
          Add Mentor
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMentor;
