import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Chip,
  IconButton,
  Avatar,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
  Badge,
  Divider,
  TablePagination,
  Skeleton
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Info as InfoIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

const MentorAssignmentSystem = () => {
  // Enhanced students data with more realistic fields
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      regNo: '20CS001',
      department: 'Computer Science',
      year: 'III',
      email: 'rahul.sharma@example.edu',
      phone: '9876543210',
      mentors: [
        { id: 1, name: 'Dr. Priya Patel', role: 'Academic Mentor', type: 'Faculty' },
        { id: 3, name: 'Mr. Amit Kumar', role: 'Industry Mentor', type: 'Industry' }
      ]
    },
    {
      id: 2,
      name: 'Priya Gupta',
      regNo: '20CS002',
      department: 'Computer Science',
      year: 'III',
      email: 'priya.gupta@example.edu',
      phone: '8765432109',
      mentors: [
        { id: 1, name: 'Dr. Priya Patel', role: 'Academic Mentor', type: 'Faculty' }
      ]
    },
    {
      id: 3,
      name: 'Amit Singh',
      regNo: '20EC001',
      department: 'Electronics',
      year: 'II',
      email: 'amit.singh@example.edu',
      phone: '7654321098',
      mentors: [
        { id: 2, name: 'Dr. Sanjay Verma', role: 'Project Guide', type: 'Faculty' },
        { id: 4, name: 'Ms. Neha Joshi', role: 'Career Counselor', type: 'Staff' }
      ]
    }
  ]);

  // Enhanced mentors data with proper categorization
  const [mentors, setMentors] = useState([
    {
      id: 1,
      name: 'Dr. Priya Patel',
      department: 'Computer Science',
      type: 'Faculty',
      role: 'Professor',
      expertise: ['AI/ML', 'Data Structures'],
      email: 'priya.patel@example.edu',
      phone: '9123456780',
      maxStudents: 5,
      currentStudents: 2
    },
    {
      id: 2,
      name: 'Dr. Sanjay Verma',
      department: 'Electronics',
      type: 'Faculty',
      role: 'Associate Professor',
      expertise: ['Embedded Systems', 'IoT'],
      email: 'sanjay.verma@example.edu',
      phone: '9234567801',
      maxStudents: 4,
      currentStudents: 1
    },
    {
      id: 3,
      name: 'Mr. Amit Kumar',
      department: 'Industry',
      type: 'Industry',
      role: 'Senior Developer',
      expertise: ['Web Development', 'Cloud Computing'],
      email: 'amit.kumar@techcorp.com',
      phone: '9345678012',
      maxStudents: 3,
      currentStudents: 1
    },
    {
      id: 4,
      name: 'Ms. Neha Joshi',
      department: 'Administration',
      type: 'Staff',
      role: 'Career Counselor',
      expertise: ['Resume Building', 'Interview Skills'],
      email: 'neha.joshi@example.edu',
      phone: '9456780123',
      maxStudents: 10,
      currentStudents: 1
    }
  ]);

  // Mentor role options
  const mentorRoles = [
    'Academic Mentor',
    'Project Guide',
    'Industry Mentor',
    'Research Supervisor',
    'Career Counselor',
    'Personal Mentor'
  ];

  // Mentor types
  const mentorTypes = ['Faculty', 'Industry', 'Staff', 'Alumni'];

  // States
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [openMentorDialog, setOpenMentorDialog] = useState(false);
  const [openNewMentorDialog, setOpenNewMentorDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [newMentor, setNewMentor] = useState({
    name: '',
    department: '',
    type: '',
    role: '',
    expertise: [],
    email: '',
    phone: '',
    maxStudents: ''
  });
  const [mentorRole, setMentorRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMentors: 0,
    averageMentorsPerStudent: 0,
    departmentStats: {},
    mentorTypeStats: {}
  });

  // Calculate statistics
  useEffect(() => {
    const calculateStats = () => {
      const totalStudents = students.length;
      const totalMentors = mentors.length;
      const totalMentorAssignments = students.reduce((acc, student) => acc + student.mentors.length, 0);
      
      const deptStats = students.reduce((acc, student) => {
        acc[student.department] = (acc[student.department] || 0) + 1;
        return acc;
      }, {});
      
      const mentorTypeStats = mentors.reduce((acc, mentor) => {
        acc[mentor.type] = (acc[mentor.type] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalStudents,
        totalMentors,
        averageMentorsPerStudent: totalStudents ? (totalMentorAssignments / totalStudents).toFixed(1) : 0,
        departmentStats: deptStats,
        mentorTypeStats
      });
    };

    calculateStats();
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [students, mentors]);

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Show notification
  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle mentor info dialog
  const handleOpenMentorDialog = (mentor) => {
    setSelectedMentor(mentor);
    setOpenMentorDialog(true);
  };

  // Filters
  const [filters, setFilters] = useState({
    department: '',
    year: '',
    mentorId: '',
    mentorType: '',
    searchQuery: ''
  });

  // Handle opening assign dialog
  const handleOpenAssignDialog = (student) => {
    setSelectedStudent(student);
    setOpenAssignDialog(true);
  };

  // Handle assigning mentor to student
  const handleAssignMentor = () => {
    if (selectedStudent && selectedMentor && mentorRole) {
      // Check if mentor has capacity
      if (selectedMentor.currentStudents >= selectedMentor.maxStudents) {
        showNotification('This mentor has reached maximum student capacity', 'error');
        return;
      }
      
      // Check if this mentor is already assigned in the same role
      const existingAssignment = selectedStudent.mentors.find(
        m => m.id === selectedMentor.id && m.role === mentorRole
      );
      
      if (existingAssignment) {
        showNotification('This mentor is already assigned in this role', 'error');
        return;
      }

      // Update student's mentors
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === selectedStudent.id
            ? {
                ...student,
                mentors: [...student.mentors, { 
                  id: selectedMentor.id,
                  name: selectedMentor.name,
                  role: mentorRole,
                  type: selectedMentor.type
                }]
              }
            : student
        )
      );

      // Update mentor's current student count
      setMentors(prevMentors =>
        prevMentors.map(mentor =>
          mentor.id === selectedMentor.id
            ? { ...mentor, currentStudents: mentor.currentStudents + 1 }
            : mentor
        )
      );

      setOpenAssignDialog(false);
      setSelectedStudent(null);
      setSelectedMentor(null);
      setMentorRole('');
      showNotification('Mentor assigned successfully');
    }
  };

  // Handle removing mentor from student
  const handleRemoveMentor = (studentId, mentorId) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? {
              ...student,
              mentors: student.mentors.filter(mentor => mentor.id !== mentorId)
            }
          : student
      )
    );

    // Decrement mentor's student count
    setMentors(prevMentors =>
      prevMentors.map(mentor =>
        mentor.id === mentorId
          ? { ...mentor, currentStudents: mentor.currentStudents - 1 }
          : mentor
      )
    );

    showNotification('Mentor removed successfully');
  };

  // Handle adding new mentor
  const handleAddNewMentor = () => {
    const newId = Math.max(...mentors.map(m => m.id), 0) + 1;
    const mentorToAdd = {
      ...newMentor,
      id: newId,
      currentStudents: 0,
      maxStudents: parseInt(newMentor.maxStudents) || 5,
      expertise: newMentor.expertise.split(',').map(item => item.trim())
    };

    setMentors([...mentors, mentorToAdd]);
    setOpenNewMentorDialog(false);
    setNewMentor({
      name: '',
      department: '',
      type: '',
      role: '',
      expertise: [],
      email: '',
      phone: '',
      maxStudents: ''
    });
    showNotification('New mentor added successfully');
  };

  // Filter students based on current filters
  const filteredStudents = students.filter(student => {
    return (
      (!filters.department || student.department.includes(filters.department)) &&
      (!filters.year || student.year === filters.year) &&
      (!filters.mentorId || student.mentors.some(m => m.id === Number(filters.mentorId))) &&
      (!filters.mentorType || student.mentors.some(m => m.type === filters.mentorType)) &&
      (!filters.searchQuery || 
        student.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        student.regNo.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    );
  });

  // Filter mentors available for assignment (not already assigned to this student)
  const getAvailableMentors = (student) => {
    if (!student) return [];
    const assignedMentorIds = student.mentors.map(m => m.id);
    return mentors.filter(mentor => 
      !assignedMentorIds.includes(mentor.id) && 
      mentor.currentStudents < mentor.maxStudents
    );
  };

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 },
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      width: '100%',
    }}>
      <Card 
        elevation={0}
        sx={{ 
          p: { xs: 2, sm: 3 },
          mb: 3,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          borderRadius: '12px'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}
            >
              Mentor Allocation System
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mt: 1,
                opacity: 0.9
              }}
            >
              Admin dashboard for managing student-mentor relationships
            </Typography>
          </Box>
          <Tooltip title="Admin Dashboard">
            <Avatar sx={{ backgroundColor: 'white', color: '#1976d2' }}>
              <AdminIcon />
            </Avatar>
          </Tooltip>
        </Box>
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '12px', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ backgroundColor: 'primary.light', mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6">Students</Typography>
              </Box>
              {loading ? (
                <Skeleton variant="text" width="60%" />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 500 }}>
                  {stats.totalStudents}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '12px', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ backgroundColor: 'success.light', mr: 2 }}>
                  <SchoolIcon />
                </Avatar>
                <Typography variant="h6">Mentors</Typography>
              </Box>
              {loading ? (
                <Skeleton variant="text" width="60%" />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 500 }}>
                  {stats.totalMentors}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '12px', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ backgroundColor: 'warning.light', mr: 2 }}>
                  <AssignmentIcon />
                </Avatar>
                <Typography variant="h6">Avg. Mentors</Typography>
              </Box>
              {loading ? (
                <Skeleton variant="text" width="60%" />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 500 }}>
                  {stats.averageMentorsPerStudent}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '12px', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ backgroundColor: 'info.light', mr: 2 }}>
                  <BusinessIcon />
                </Avatar>
                <Typography variant="h6">Mentor Types</Typography>
              </Box>
              {loading ? (
                <Skeleton variant="text" width="60%" />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 500 }}>
                  {Object.keys(stats.mentorTypeStats).length}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card 
        sx={{ 
          mb: 3,
          p: { xs: 2, sm: 3 },
          borderRadius: '12px'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>Filters</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setOpenNewMentorDialog(true)}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            Add New Mentor
          </Button>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <TextField
            label="Search students..."
            size="small"
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            sx={{ 
              backgroundColor: 'white',
              minWidth: { xs: '100%', sm: 220 }
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            }}
          />
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 180 } }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={filters.department}
              label="Department"
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
              sx={{ backgroundColor: 'white' }}
            >
              <MenuItem value="">All Departments</MenuItem>
              <MenuItem value="Computer Science">Computer Science</MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Mechanical">Mechanical</MenuItem>
              <MenuItem value="Electrical">Electrical</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={filters.year}
              label="Year"
              onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
              sx={{ backgroundColor: 'white' }}
            >
              <MenuItem value="">All Years</MenuItem>
              <MenuItem value="I">I Year</MenuItem>
              <MenuItem value="II">II Year</MenuItem>
              <MenuItem value="III">III Year</MenuItem>
              <MenuItem value="IV">IV Year</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 180 } }}>
            <InputLabel>Mentor</InputLabel>
            <Select
              value={filters.mentorId}
              label="Mentor"
              onChange={(e) => setFilters(prev => ({ ...prev, mentorId: e.target.value }))}
              sx={{ backgroundColor: 'white' }}
            >
              <MenuItem value="">All Mentors</MenuItem>
              {mentors.map(mentor => (
                <MenuItem key={mentor.id} value={mentor.id}>{mentor.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
            <InputLabel>Mentor Type</InputLabel>
            <Select
              value={filters.mentorType}
              label="Mentor Type"
              onChange={(e) => setFilters(prev => ({ ...prev, mentorType: e.target.value }))}
              sx={{ backgroundColor: 'white' }}
            >
              <MenuItem value="">All Types</MenuItem>
              {mentorTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Card>

      {/* Students Table */}
      <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>Students List</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {loading ? (
              <Skeleton width={100} />
            ) : (
              `${filteredStudents.length} students found`
            )}
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Reg No</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Year</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Assigned Mentors</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton width={100} /></TableCell>
                  </TableRow>
                ))
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No students found matching your criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((student) => (
                  <TableRow 
                    key={student.id}
                    sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}
                  >
                    <TableCell sx={{ color: 'text.secondary' }}>{student.regNo}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {student.name}
                        <Typography variant="caption" color="text.secondary">
                          {student.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>{student.year}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {student.mentors.map((mentor) => (
                          <Tooltip 
                            key={`${mentor.id}-${mentor.role}`} 
                            title={`${mentor.role} (${mentor.type})`}
                          >
                            <Chip
                              label={`${mentor.name}`}
                              onDelete={() => {
                                handleRemoveMentor(student.id, mentor.id);
                                showNotification('Mentor removed successfully');
                              }}
                              onClick={() => handleOpenMentorDialog(mentors.find(m => m.id === mentor.id))}
                              color={
                                mentor.type === 'Faculty' ? 'primary' : 
                                mentor.type === 'Industry' ? 'secondary' : 'default'
                              }
                              variant="outlined"
                              size="small"
                              sx={{ 
                                borderRadius: '8px',
                                cursor: 'pointer',
                                '& .MuiChip-deleteIcon': {
                                  color: 'inherit',
                                  opacity: 0.7,
                                  '&:hover': { opacity: 1 }
                                }
                              }}
                            />
                          </Tooltip>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenAssignDialog(student)}
                        sx={{ 
                          boxShadow: 'none',
                          borderRadius: '8px',
                          textTransform: 'none',
                          '&:hover': { boxShadow: 'none' }
                        }}
                        disabled={getAvailableMentors(student).length === 0}
                      >
                        Assign Mentor
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredStudents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Assign Mentor Dialog */}
      <Dialog 
        open={openAssignDialog} 
        onClose={() => setOpenAssignDialog(false)}
        PaperProps={{
          sx: { borderRadius: '12px' }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2
        }}>
          Assign Mentor to {selectedStudent?.name}
          <Typography variant="subtitle2" color="text.secondary">
            {selectedStudent?.regNo} • {selectedStudent?.department}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Select Mentor</InputLabel>
              <Select
                value={selectedMentor ? selectedMentor.id : ''}
                label="Select Mentor"
                onChange={(e) => setSelectedMentor(mentors.find(m => m.id === e.target.value))}
                sx={{ borderRadius: '8px' }}
              >
                {getAvailableMentors(selectedStudent).length === 0 ? (
                  <MenuItem disabled>No available mentors</MenuItem>
                ) : (
                  getAvailableMentors(selectedStudent).map(mentor => (
                    <MenuItem key={mentor.id} value={mentor.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 1,
                            backgroundColor: 
                              mentor.type === 'Faculty' ? 'primary.main' : 
                              mentor.type === 'Industry' ? 'secondary.main' : 'grey.500'
                          }}
                        >
                          {mentor.name[0]}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2">{mentor.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {mentor.department} • {mentor.type}
                          </Typography>
                        </Box>
                        <Typography variant="caption">
                          {mentor.currentStudents}/{mentor.maxStudents} students
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Mentor Role</InputLabel>
              <Select
                value={mentorRole}
                label="Mentor Role"
                onChange={(e) => setMentorRole(e.target.value)}
                sx={{ borderRadius: '8px' }}
              >
                {mentorRoles.map(role => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedMentor && (
              <Box sx={{ 
                backgroundColor: '#f8f9fa', 
                p: 2, 
                borderRadius: '8px',
                borderLeft: '4px solid',
                borderColor: 
                  selectedMentor.type === 'Faculty' ? 'primary.main' : 
                  selectedMentor.type === 'Industry' ? 'secondary.main' : 'grey.500'
              }}>
                <Typography variant="subtitle2" gutterBottom>
                  Mentor Information
                </Typography>
                <Typography variant="body2">
                  <strong>Expertise:</strong> {selectedMentor.expertise.join(', ')}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {selectedMentor.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Availability:</strong> {selectedMentor.currentStudents}/{selectedMentor.maxStudents} students
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button 
            onClick={() => setOpenAssignDialog(false)}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAssignMentor}
            variant="contained"
            disabled={!selectedMentor || !mentorRole}
            sx={{ 
              borderRadius: '8px',
              boxShadow: 'none',
              textTransform: 'none',
              px: 3,
              '&:hover': { boxShadow: 'none' }
            }}
          >
            Assign Mentor
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mentor Info Dialog */}
      <Dialog 
        open={openMentorDialog} 
        onClose={() => setOpenMentorDialog(false)}
        PaperProps={{
          sx: { borderRadius: '12px' }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2
        }}>
          Mentor Profile
        </DialogTitle>
        {selectedMentor && (
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64,
                    backgroundColor: 
                      selectedMentor.type === 'Faculty' ? 'primary.main' : 
                      selectedMentor.type === 'Industry' ? 'secondary.main' : 'grey.500'
                  }}
                >
                  {selectedMentor.name[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedMentor.name}</Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {selectedMentor.department} • {selectedMentor.role}
                  </Typography>
                  <Chip 
                    label={selectedMentor.type}
                    size="small"
                    sx={{ 
                      mt: 0.5,
                      backgroundColor: 
                        selectedMentor.type === 'Faculty' ? 'primary.light' : 
                        selectedMentor.type === 'Industry' ? 'secondary.light' : 'grey.300',
                      color: 
                        selectedMentor.type === 'Faculty' ? 'primary.dark' : 
                        selectedMentor.type === 'Industry' ? 'secondary.dark' : 'grey.700'
                    }}
                  />
                </Box>
              </Box>
              
              <Divider />
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Contact Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MailIcon color="action" fontSize="small" />
                    <Typography>{selectedMentor.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon color="action" fontSize="small" />
                    <Typography>{selectedMentor.phone}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Capacity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: '100%', 
                    height: 8, 
                    backgroundColor: '#e0e0e0',
                    borderRadius: 4,
                    overflow: 'hidden'
                  }}>
                    <Box 
                      sx={{ 
                        height: '100%',
                        width: `${(selectedMentor.currentStudents / selectedMentor.maxStudents) * 100}%`,
                        backgroundColor: 
                          selectedMentor.currentStudents >= selectedMentor.maxStudents ? 'error.main' :
                          selectedMentor.currentStudents / selectedMentor.maxStudents > 0.75 ? 'warning.main' : 'success.main'
                      }}
                    />
                  </Box>
                  <Typography variant="body2">
                    {selectedMentor.currentStudents}/{selectedMentor.maxStudents} students
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Areas of Expertise
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedMentor.expertise.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      sx={{ borderRadius: '8px' }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Assigned Students ({selectedMentor.currentStudents})
                </Typography>
                {students.filter(s => s.mentors.some(m => m.id === selectedMentor.id)).length > 0 ? (
                  <Box sx={{ 
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    p: 1.5
                  }}>
                    {students
                      .filter(s => s.mentors.some(m => m.id === selectedMentor.id))
                      .map(student => (
                        <Box 
                          key={student.id} 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 1,
                            '&:last-child': { mb: 0 }
                          }}
                        >
                          <Typography variant="body2">
                            {student.name} ({student.regNo})
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {student.mentors.find(m => m.id === selectedMentor.id).role}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No students currently assigned
                  </Typography>
                )}
              </Box>
            </Box>
          </DialogContent>
        )}
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenMentorDialog(false)}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Mentor Dialog */}
      <Dialog 
        open={openNewMentorDialog} 
        onClose={() => setOpenNewMentorDialog(false)}
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
            width: 40,
            height: 40
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
              <TextField
                fullWidth
                label="Role/Position"
                value={newMentor.role}
                onChange={(e) => setNewMentor({ ...newMentor, role: e.target.value })}
                placeholder="e.g., Professor, Senior Developer"
                size="small"
                required
              />
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
            onClick={() => {
              setOpenNewMentorDialog(false);
              setNewMentor({
                name: '',
                department: '',
                type: '',
                role: '',
                expertise: '',
                email: '',
                phone: '',
                maxStudents: ''
              });
            }}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddNewMentor}
            variant="contained"
            disabled={
              !newMentor.name || 
              !newMentor.department || 
              !newMentor.type || 
              !newMentor.role ||
              !newMentor.email ||
              !newMentor.phone ||
              !newMentor.maxStudents
            }
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: '8px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MentorAssignmentSystem;