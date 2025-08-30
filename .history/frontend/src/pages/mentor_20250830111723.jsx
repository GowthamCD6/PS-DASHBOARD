import React, { useState, useEffect, useMemo } from 'react';
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
  Skeleton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  ToggleButton,
  ToggleButtonGroup
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
  Assignment as AssignmentIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Info as InfoIcon,
  AdminPanelSettings as AdminIcon,
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Group as GroupIcon,
  ViewList as ViewListIcon,
  AccountTree as AccountTreeIcon
} from '@mui/icons-material';
import AddMentor from '../components/Modals/AddMentor';

const MentorManagementSystem = () => {
  // View mode state
  const [viewMode, setViewMode] = useState('assignment'); // 'assignment' or 'mapping'

  // Enhanced students data with more realistic fields (original format)
  const [originalStudents, setOriginalStudents] = useState([
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

  // Enhanced mentors data with proper categorization (original format)
  const [originalMentors, setOriginalMentors] = useState([
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
  // Generate bulk student data (7000+ students)
  const generateBulkStudents = () => {
    const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Electrical', 'Civil', 'Information Technology'];
    const years = ['I', 'II', 'III', 'IV'];
    const students = [];
    
    for (let i = 1; i <= 7000; i++) {
      const dept = departments[Math.floor(Math.random() * departments.length)];
      const year = years[Math.floor(Math.random() * years.length)];
      const deptCode = dept.substring(0, 2).toUpperCase();
      
      students.push({
        id: i,
        name: `Student ${i.toString().padStart(4, '0')}`,
        regNo: `20${deptCode}${i.toString().padStart(4, '0')}`,
        department: dept,
        year: year,
        email: `student${i}@example.edu`,
        phone: `9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
        mentorId: Math.floor(Math.random() * 50) + 1, // Assigned to one of 50 mentors
        assignedDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      });
    }
    return students;
  };

  // Generate mentor data (50 mentors to handle 7000 students)
  const generateMentors = () => {
    const mentorTypes = ['Faculty', 'Intern',];
    const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Electrical', 'Civil', 'Information Technology'];
    const mentors = [];
    
    for (let i = 1; i <= 50; i++) {
      const type = mentorTypes[Math.floor(Math.random() * mentorTypes.length)];
      const dept = departments[Math.floor(Math.random() * departments.length)];
      
      mentors.push({
        id: i,
        name: `Dr. Mentor ${i.toString().padStart(2, '0')}`,
        department: dept,
        type: type,
        role: type === 'Faculty' ? 'Professor' : type === 'Industry' ? 'Senior Manager' : 'Counselor',
        email: `mentor${i}@example.edu`,
        phone: `9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
  maxStudents: 50, // 50 students per mentor
        expertise: ['Programming', 'Research', 'Career Guidance']
      });
    }
    return mentors;
  };

  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedMentor, setExpandedMentor] = useState(null);
  const [selectedMentorDetails, setSelectedMentorDetails] = useState(null);
  const [openMentorDialog, setOpenMentorDialog] = useState(false);

  // Original assignment system states
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [openNewMentorDialog, setOpenNewMentorDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [mentorRole, setMentorRole] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMentors: 0,
    averageMentorsPerStudent: 0,
    departmentStats: {},
    mentorTypeStats: {}
  });

  // Filters for both views
  const [filters, setFilters] = useState({
    department: '',
    searchQuery: '',
    minStudents: '',
    maxStudents: '',
    year: '',
    mentorName: ''
  });

  // Mentor role options
  const mentorRoles = [
  'Project Guide',
  'Research Supervisor',
  'Career Counselor',
  'Personal Mentor'
  ];

  // Mentor types
  const mentorTypes = ['Faculty', 'Industry', 'Staff'];

  // Initialize data based on view mode
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (viewMode === 'mapping') {
        // Generate bulk data for mapping view
        const generatedStudents = generateBulkStudents();
        const generatedMentors = generateMentors();
        setStudents(generatedStudents);
        setMentors(generatedMentors);
      } else {
        // Use original data for assignment view
        setStudents(originalStudents);
        setMentors(originalMentors);
      }
      
      setLoading(false);
    };

    initializeData();
  }, [viewMode]);

  // Calculate statistics for assignment view
  useEffect(() => {
    if (viewMode === 'assignment') {
      const calculateStats = () => {
        const totalStudents = students.length;
        const totalMentors = mentors.length;
        const totalMentorAssignments = students.reduce((acc, student) => acc + (student.mentors?.length || 0), 0);
        
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
    }
  }, [students, mentors, viewMode]);

  // Show notification
  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Memoized calculations for performance with large datasets (mapping view)
  const mentorStudentMapping = useMemo(() => {
    if (viewMode !== 'mapping') return {};
    const mapping = {};
    mentors.forEach(mentor => {
      mapping[mentor.id] = {
        mentor: mentor,
        students: students.filter(student => student.mentorId === mentor.id)
      };
    });
    return mapping;
  }, [students, mentors, viewMode]);

  // Filtered mentors based on search criteria (mapping view)
  const filteredMentors = useMemo(() => {
    if (viewMode === 'mapping') {
      // Per user request, only show newly added mentors in the mapping view.
      // We identify new mentors as those with an ID greater than the original set.
      const maxOriginalMentorId = 4; 
      const newMentors = mentors.filter(mentor => mentor.id > maxOriginalMentorId);

      return newMentors.filter(mentor => {
        const assignedStudents = mentorStudentMapping[mentor.id]?.students || [];
        const studentCount = assignedStudents.length;
        
        return (
          (!filters.department || mentor.department === filters.department) &&
          (!filters.searchQuery || 
            mentor.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
            mentor.email.toLowerCase().includes(filters.searchQuery.toLowerCase())) &&
          (!filters.minStudents || studentCount >= parseInt(filters.minStudents)) &&
          (!filters.maxStudents || studentCount <= parseInt(filters.maxStudents))
        );
      });
    }
    return mentors;
  }, [mentors, mentorStudentMapping, filters, viewMode]);

  // Filtered students for assignment view
  const filteredStudents = useMemo(() => {
    if (viewMode === 'assignment') {
      return students.filter(student => {
        return (
          (!filters.department || student.department.includes(filters.department)) &&
          (!filters.year || student.year === filters.year) &&
          (!filters.mentorName || student.mentors?.some(m => m.name.toLowerCase().includes(filters.mentorName.toLowerCase()))) &&
          (!filters.searchQuery || 
            student.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
            student.regNo.toLowerCase().includes(filters.searchQuery.toLowerCase()))
        );
      });
    }
    return students;
  }, [students, filters, viewMode]);

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle mentor expansion
  const handleMentorExpand = (mentorId) => {
    setExpandedMentor(expandedMentor === mentorId ? null : mentorId);
  };

  // Handle mentor details dialog
  const handleOpenMentorDialog = (mentor) => {
    setSelectedMentorDetails(mentor);
    setOpenMentorDialog(true);
  };

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
      const existingAssignment = selectedStudent.mentors?.find(
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
                mentors: [...(student.mentors || []), { 
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
              mentors: (student.mentors || []).filter(mentor => mentor.id !== mentorId)
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
  const handleAddNewMentor = (newMentorData) => {
    const newId = Math.max(...mentors.map(m => m.id), 0) + 1;
    const mentorToAdd = {
      ...newMentorData,
      id: newId,
      currentStudents: 0,
      maxStudents: parseInt(newMentorData.maxStudents) || 5,
      expertise: typeof newMentorData.expertise === 'string' 
        ? newMentorData.expertise.split(',').map(item => item.trim())
        : newMentorData.expertise
    };

    setMentors([...mentors, mentorToAdd]);
    setOpenNewMentorDialog(false);
    showNotification('New mentor added successfully');
    setViewMode('mapping');
  };

  // Filter mentors available for assignment (not already assigned to this student)
  const getAvailableMentors = (student) => {
    if (!student) return [];
    const assignedMentorIds = (student.mentors || []).map(m => m.id);
    return mentors.filter(mentor => 
      !assignedMentorIds.includes(mentor.id) && 
      mentor.currentStudents < mentor.maxStudents
    );
  };

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 },
      backgroundColor: '#f6f7fb',
      minHeight: '100vh',
      width: '100%',
    }}>
      <Card 
        elevation={0}
        sx={{ 
          p: { xs: 2, sm: 3 },
          mb: 3,
          background: "white",
          color: '#475569',
          borderRadius: '12px',
          boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem' },
                color: '#475569',
                margin: '0 0 8px 0',
                letterSpacing: '-0.025em',
                lineHeight: '1.1',
                fontSize: "33px",

              }}
            >
              Mentor Management Dashboard
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                opacity: 0.9,
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                color: '#475569',
              }}
            >
              {viewMode === 'assignment' 
                ? 'Admin dashboard for managing student-mentor relationships'
                : `View students mapped under each mentor (${students.length.toLocaleString()} students across ${mentors.length} mentors)`
              }
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)',
                '& .MuiToggleButton-root': {
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  fontWeight: 600,
                  fontSize: '15px',
                  '& .MuiSvgIcon-root': {
                    color: '#475569',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#e0e7ff',
                    color: '#2563eb',
                    '& .MuiSvgIcon-root': {
                      color: '#2563eb',
                    }
                  }
                }
              }}
            >
              <ToggleButton value="assignment" size="small">
                <ViewListIcon sx={{ mr: 1 }} />
                Assignment
              </ToggleButton>
              <ToggleButton value="mapping" size="small">
                <AccountTreeIcon sx={{ mr: 1 }} />
                Mapping
              </ToggleButton>
            </ToggleButtonGroup>
            <Tooltip title={viewMode === 'assignment' ? 'Admin Dashboard' : 'Mentor Management'}>
              <Avatar sx={{ backgroundColor: 'white', color: '#1976d2' }}>
                {viewMode === 'assignment' ? <AdminIcon /> : <GroupIcon />}
              </Avatar>
            </Tooltip>
          </Box>
        </Box>
      </Card>

      {/* Filters */}
      <Card 
        sx={{ 
          mb: 3,
          p: { xs: 2, sm: 3 },
          borderRadius: '12px'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {viewMode === 'assignment' ? 'Filters' : 'Filter Mentors'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {viewMode === 'assignment' && (
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
            )}
          </Box>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <TextField
            label={viewMode === 'assignment' ? 'Search students...' : 'Search mentors...'}
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
              <MenuItem value="Civil">Civil</MenuItem>
              <MenuItem value="Information Technology">Information Technology</MenuItem>
            </Select>
          </FormControl>
          
          {viewMode === 'assignment' && (
            <>
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
              <TextField
                label="Search Mentor"
                size="small"
                value={filters.mentorName}
                onChange={(e) => setFilters(prev => ({ ...prev, mentorName: e.target.value }))}
                sx={{ 
                  backgroundColor: 'white',
                  minWidth: { xs: '100%', sm: 180 }
                }}
              />
            </>
          )}

          {viewMode === 'mapping' && (
            <>
              <TextField
                label="Min Students"
                size="small"
                type="number"
                value={filters.minStudents}
                onChange={(e) => setFilters(prev => ({ ...prev, minStudents: e.target.value }))}
                sx={{ 
                  backgroundColor: 'white',
                  minWidth: { xs: '100%', sm: 120 }
                }}
              />
              <TextField
                label="Max Students"
                size="small"
                type="number"
                value={filters.maxStudents}
                onChange={(e) => setFilters(prev => ({ ...prev, maxStudents: e.target.value }))}
                sx={{ 
                  backgroundColor: 'white',
                  minWidth: { xs: '100%', sm: 120 }
                }}
              />
            </>
          )}
        </Box>
      </Card>

      {/* Main Content - Conditional based on view mode */}
      {viewMode === 'assignment' ? (
        /* Original Students Table for Assignment View */
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
                      <TableCell><Skeleton width={100} /></TableCell>
                    </TableRow>
                  ))
                ) : filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
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
                        </Box>
                      </TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {(student.mentors || []).map((mentor, index) => (
                            <Tooltip 
                              key={`${mentor.id}-${mentor.role}`} 
                              title={index === 0 ? 'Academic Mentor (Faculty)' : `${mentor.role} (${mentor.type})`}
                              arrow
                            >
                              <Chip
                                label={`${mentor.name}`}
                                onDelete={index > 0 ? () => {
                                  handleRemoveMentor(student.id, mentor.id);
                                  showNotification('Mentor removed successfully');
                                } : undefined}
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
      ) : (
      <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>Mentor-Student Mapping</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {loading ? (
              <Skeleton width={100} />
            ) : (
              `${filteredMentors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).reduce((acc, mentor) => acc + (mentorStudentMapping[mentor.id]?.students.length || 0), 0)} students across ${filteredMentors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length} mentors`
            )}
          </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ p: 3 }}>
            {[...Array(5)].map((_, index) => (
              <Card key={index} sx={{ mb: 2, p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Skeleton variant="circular" width={48} height={48} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton width="40%" />
                    <Skeleton width="60%" />
                  </Box>
                  <Skeleton width={80} />
                </Box>
              </Card>
            ))}
          </Box>
        ) : filteredMentors.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No mentors found matching your criteria
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            {filteredMentors
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((mentor) => {
                const assignedStudents = mentorStudentMapping[mentor.id]?.students || [];
                const isExpanded = expandedMentor === mentor.id;
                
                return (
                  <Card 
                    key={mentor.id} 
                    sx={{ 
                      mb: 2, 
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: isExpanded ? 'primary.main' : 'divider',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Box 
                      sx={{ 
                        p: 2, 
                        display: 'flex', 
                        alignItems: 'center', 
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f8f9fa' }
                      }}
                      onClick={() => handleMentorExpand(mentor.id)}
                    >
                      <Avatar 
                        sx={{ 
                          width: 48, 
                          height: 48, 
                          mr: 2,
                          backgroundColor: 
                            mentor.type === 'Faculty' ? 'primary.main' : 
                            mentor.type === 'Industry' ? 'secondary.main' : 
                            mentor.type === 'Staff' ? 'success.main' : 'warning.main'
                        }}
                      >
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                          {mentor.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {mentor.department} • {mentor.role}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip 
                            label={mentor.type}
                            size="small"
                            sx={{ 
                              backgroundColor: 
                                mentor.type === 'Faculty' ? 'primary.light' : 
                                mentor.type === 'Industry' ? 'secondary.light' : 
                                mentor.type === 'Staff' ? 'success.light' : 'warning.light',
                              color: 
                                mentor.type === 'Faculty' ? 'primary.dark' : 
                                mentor.type === 'Industry' ? 'secondary.dark' : 
                                mentor.type === 'Staff' ? 'success.dark' : 'warning.dark'
                            }}
                          />
                        </Box>
                      </Box>
                      
                      <Box sx={{ textAlign: 'center', mr: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {assignedStudents.length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Students
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenMentorDialog(mentor);
                          }}
                          sx={{ textTransform: 'none' }}
                        >
                          Details
                        </Button>
                        <IconButton>
                          {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Collapse in={isExpanded}>
                      <Divider />
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                          Assigned Students ({assignedStudents.length})
                        </Typography>
                        
                        {assignedStudents.length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            No students currently assigned to this mentor
                          </Typography>
                        ) : (
                          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                            <Grid container spacing={1}>
                              {assignedStudents.map((student) => (
                                <Grid item xs={12} sm={6} md={4} key={student.id}>
                                  <Card 
                                    sx={{ 
                                      p: 1.5, 
                                      backgroundColor: 'white',
                                      border: '1px solid',
                                      borderColor: 'divider',
                                      borderRadius: '6px',
                                      '&:hover': { borderColor: 'primary.main' }
                                    }}
                                  >
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {student.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {student.regNo}
                                    </Typography>
                                    <br />
                                    <Typography variant="caption" color="text.secondary">
                                      {student.department} - {student.year} Year
                                    </Typography>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </Card>
                );
              })}
          </Box>
        )}
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredMentors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Mentors per page:"
        />
      </Card>
      )}

      {/* Assignment Mentor Dialog - Only for Assignment View */}
      {viewMode === 'assignment' && (
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
      )}

      {/* Add New Mentor Dialog - Only for Assignment View */}
      {viewMode === 'assignment' && (
        <AddMentor 
          open={openNewMentorDialog}
          onClose={() => setOpenNewMentorDialog(false)}
          onAddMentor={handleAddNewMentor}
        />
      )}

      {/* Mentor Info Dialog */}
      <Dialog 
        open={openMentorDialog} 
        onClose={() => setOpenMentorDialog(false)}
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
                      selectedMentorDetails.type === 'Industry' ? 'secondary.main' : 
                      selectedMentorDetails.type === 'Staff' ? 'success.main' : 'warning.main'
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
                        selectedMentorDetails.type === 'Industry' ? 'secondary.light' : 
                        selectedMentorDetails.type === 'Staff' ? 'success.light' : 'warning.light',
                      color: 
                        selectedMentorDetails.type === 'Faculty' ? 'primary.dark' : 
                        selectedMentorDetails.type === 'Industry' ? 'secondary.dark' : 
                        selectedMentorDetails.type === 'Staff' ? 'success.dark' : 'warning.dark'
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
                    <Grid container spacing={1}>
                      {mentorStudentMapping[selectedMentorDetails.id].students.map((student) => (
                        <Grid item xs={12} sm={6} md={4} key={student.id}>
                          <Card 
                            sx={{ 
                              p: 1.5, 
                              backgroundColor: 'white',
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: '6px'
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {student.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {student.regNo}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              {student.department} - {student.year} Year
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              {student.email}
                            </Typography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
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

export default MentorManagementSystem;