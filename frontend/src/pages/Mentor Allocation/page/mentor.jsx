import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Chip,
  Avatar,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Tooltip,
  TablePagination,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Group as GroupIcon,
  ViewList as ViewListIcon,
  AccountTree as AccountTreeIcon,
} from "@mui/icons-material";
import AddMentor from "../Modals/AddMentor";
import AssignMentorModal from "../Modals/AssignMentorModal";
import MentorDetailsModal from "../Modals/MentorDetailsModal";
import ConfirmRemovalModal from "../Modals/ConfirmRemovalModal";

const MentorManagementSystem = () => {
  // View mode state
  const [viewMode, setViewMode] = useState("assignment"); // 'assignment' or 'mapping'

  // Enhanced students data with more realistic fields (original format)
  const [originalStudents, setOriginalStudents] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      regNo: "20CS001",
      department: "Computer Science",
      year: "III",
      email: "rahul.sharma@example.edu",
      phone: "9876543210",
      mentors: [
        {
          id: 1,
          name: "Dr. Priya Patel",
          role: "Academic Mentor",
          type: "Faculty",
        },
      ],
    },
    {
      id: 2,
      name: "Priya Gupta",
      regNo: "20CS002",
      department: "Computer Science",
      year: "III",
      email: "priya.gupta@example.edu",
      phone: "8765432109",
      mentors: [
        {
          id: 1,
          name: "Dr. Priya Patel",
          role: "Academic Mentor",
          type: "Faculty",
        },
      ],
    },
    {
      id: 3,
      name: "Amit Singh",
      regNo: "20EC001",
      department: "Electronics",
      year: "II",
      email: "amit.singh@example.edu",
      phone: "7654321098",
      mentors: [
        {
          id: 2,
          name: "Dr. Sanjay Verma",
          role: "Project Guide",
          type: "Faculty",
        },
      ],
    },
    // Sample students assigned to Intern mentors
    {
      id: 4,
      name: "Sneha Patel",
      regNo: "20CS004",
      department: "Computer Science",
      year: "II",
      email: "sneha.patel@example.edu",
      phone: "9234567890",
      mentors: [
        {
          id: 3,
          name: "Mr. Amit Kumar",
          role: "Industry Mentor",
          type: "Intern",
        },
      ],
    },
    {
      id: 5,
      name: "Rajesh Kumar",
      regNo: "20IT005",
      department: "Information Technology",
      year: "III",
      email: "rajesh.kumar@example.edu",
      phone: "9345678901",
      mentors: [
        {
          id: 3,
          name: "Mr. Amit Kumar",
          role: "Career Mentor",
          type: "Intern",
        },
      ],
    },
    {
      id: 6,
      name: "Anita Sharma",
      regNo: "20EC006",
      department: "Electronics",
      year: "I",
      email: "anita.sharma@example.edu",
      phone: "9456789012",
      mentors: [
        {
          id: 4,
          name: "Ms. Neha Joshi",
          role: "Placement Mentor",
          type: "Intern",
        },
      ],
    },
    {
      id: 7,
      name: "Vikram Singh",
      regNo: "20ME007",
      department: "Mechanical",
      year: "II",
      email: "vikram.singh@example.edu",
      phone: "9567890123",
      mentors: [
        {
          id: 4,
          name: "Ms. Neha Joshi",
          role: "Skills Mentor",
          type: "Intern",
        },
      ],
    },
  ]);

  // Enhanced mentors data with proper categorization (original format)
  const [originalMentors, setOriginalMentors] = useState([
    {
      id: 1,
      name: "Dr. Priya Patel",
      department: "Computer Science",
      type: "Faculty",
      role: "Professor",
      expertise: ["AI/ML", "Data Structures"],
      email: "priya.patel@example.edu",
      phone: "9123456780",
      maxStudents: 5,
      currentStudents: 2,
    },
    {
      id: 2,
      name: "Dr. Sanjay Verma",
      department: "Electronics",
      type: "Faculty",
      role: "Associate Professor",
      expertise: ["Embedded Systems", "IoT"],
      email: "sanjay.verma@example.edu",
      phone: "9234567801",
      maxStudents: 4,
      currentStudents: 1,
    },
    {
      id: 3,
      name: "Mr. Amit Kumar",
      department: "Computer Science",
      type: "Intern",
      role: "Intern Developer",
      expertise: ["Web Development", "Cloud Computing"],
      email: "amit.kumar@techcorp.com",
      phone: "9345678012",
      maxStudents: 3,
      currentStudents: 1,
    },
    {
      id: 4,
      name: "Ms. Neha Joshi",
      department: "Electronics",
      type: "Intern",
      role: "Intern Counselor",
      expertise: ["Resume Building", "Interview Skills"],
      email: "neha.joshi@example.edu",
      phone: "9456780123",
      maxStudents: 10,
      currentStudents: 1,
    },
  ]);
  // Generate bulk student data (7000+ students)
  const generateBulkStudents = () => {
    const departments = [
      "Computer Science",
      "Electronics",
      "Mechanical",
      "Electrical",
      "Civil",
      "Information Technology",
    ];
    const years = ["I", "II", "III", "IV"];
    const students = [];

    for (let i = 1; i <= 7000; i++) {
      const dept = departments[Math.floor(Math.random() * departments.length)];
      const year = years[Math.floor(Math.random() * years.length)];
      const deptCode = dept.substring(0, 2).toUpperCase();
      const mentorId = Math.floor(Math.random() * 50) + 1;

      students.push({
        id: i,
        name: `Student ${i.toString().padStart(4, "0")}`,
        regNo: `20${deptCode}${i.toString().padStart(4, "0")}`,
        department: dept,
        year: year,
        email: `student${i}@example.edu`,
        phone: `9${Math.floor(Math.random() * 1000000000)
          .toString()
          .padStart(9, "0")}`,
        mentorId: mentorId,
        assignedDate: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ),
        // For Faculty mentors (ids 1-25), 70% are default assigned, 30% manually assigned
        // For Intern mentors (ids 26-50), all are manually assigned
        isDefaultAssigned: mentorId <= 25 ? Math.random() < 0.7 : false,
      });
    }
    return students;
  };

  // Generate mentor data (50 mentors to handle 7000 students)
  const generateMentors = () => {
    const mentorTypes = ["Faculty", "Intern"];
    const departments = [
      "Computer Science",
      "Electronics",
      "Mechanical",
      "Electrical",
      "Civil",
      "Information Technology",
    ];
    const mentors = [];
    for (let i = 1; i <= 50; i++) {
      // First 25 Faculty, last 25 Interns for clear distribution  
      const type = i <= 25 ? "Faculty" : "Intern";
      const dept = departments[Math.floor(Math.random() * departments.length)];
      mentors.push({
        id: i,
        name:
          type === "Faculty"
            ? `Dr. Faculty ${i.toString().padStart(2, "0")}`
            : `Dr. Mentor ${i.toString().padStart(2, "0")}`,
        department: dept,
        type: type,
        role: type === "Faculty" ? "Professor" : "Intern",
        email: `mentor${i}@example.edu`,
        phone: `9${Math.floor(Math.random() * 1000000000)
          .toString()
          .padStart(9, "0")}`,
        maxStudents: 40, // 40 students per mentor
        expertise:
          type === "Faculty"
            ? ["Programming", "Research", "Academic Guidance"]
            : ["Industry Skills", "Career Guidance", "Practical Training"],
      });
    }
    return mentors;
  };

  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedMentorDetails, setSelectedMentorDetails] = useState(null);
  const [openMentorDialog, setOpenMentorDialog] = useState(false);

  // Confirmation dialog states
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [removalData, setRemovalData] = useState({
    studentId: null,
    mentorId: null,
    studentName: "",
    mentorName: "",
  });

  // Original assignment system states
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [openNewMentorDialog, setOpenNewMentorDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [mentorRole, setMentorRole] = useState("");
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMentors: 0,
    averageMentorsPerStudent: 0,
    departmentStats: {},
    mentorTypeStats: {},
  });

  // Filters for both views
  const [filters, setFilters] = useState({
    department: "",
    searchQuery: "",
    minStudents: "",
    maxStudents: "",
    year: "",
    mentorName: "",
  });

  // Mentor role options
  const mentorRoles = [
    "Project Guide",
    "Research Supervisor",
    "Career Counselor",
    "Personal Mentor",
  ];

  // Mentor types
  const mentorTypes = ["Faculty", "Intern"];

  // Initialize data based on view mode
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (viewMode === "mapping") {
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
    if (viewMode === "assignment") {
      const calculateStats = () => {
        const totalStudents = students.length;
        const totalMentors = mentors.length;
        const totalMentorAssignments = students.reduce(
          (acc, student) => acc + (student.mentors?.length || 0),
          0
        );

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
          averageMentorsPerStudent: totalStudents
            ? (totalMentorAssignments / totalStudents).toFixed(1)
            : 0,
          departmentStats: deptStats,
          mentorTypeStats,
        });
      };

      calculateStats();
    }
  }, [students, mentors, viewMode]);

  // Show notification
  const showNotification = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Memoized calculations for performance with large datasets (mapping view and assignment view)
  const mentorStudentMapping = useMemo(() => {
    const mapping = {};

    if (viewMode === "mapping") {
      // For mapping view, use generated student data
      mentors.forEach((mentor) => {
        mapping[mentor.id] = {
          mentor: mentor,
          students: students.filter(
            (student) => student.mentorId === mentor.id
          ),
        };
      });
    } else {
      // For assignment view, use original student data with mentors array
      const assignmentMapping = {};

      // Initialize all mentors with empty student arrays
      originalMentors.forEach((mentor) => {
        assignmentMapping[mentor.id] = {
          mentor: mentor,
          students: [],
        };
      });

      // Add students to their respective mentors based on mentors array
      originalStudents.forEach((student) => {
        if (student.mentors && student.mentors.length > 0) {
          student.mentors.forEach((mentorRef) => {
            if (assignmentMapping[mentorRef.id]) {
              // Convert student to mapping format with assignment info
              const studentWithAssignment = {
                ...student,
                isDefaultAssigned:
                  mentorRef.type === "Faculty" &&
                  mentorRef.role === "Academic Mentor",
                assignedDate: new Date("2024-01-15"), // Sample assignment date
              };
              assignmentMapping[mentorRef.id].students.push(
                studentWithAssignment
              );
            }
          });
        }
      });

      return assignmentMapping;
    }

    return mapping;
  }, [students, mentors, viewMode, originalStudents, originalMentors]);

  // Filtered mentors based on search criteria (mapping view)
  const filteredMentors = useMemo(() => {
    if (viewMode === "mapping") {
      const maxOriginalMentorId = 4;
      const newMentors = mentors.filter(
        (mentor) => mentor.id > maxOriginalMentorId
      );

      return newMentors.filter((mentor) => {
        const assignedStudents =
          mentorStudentMapping[mentor.id]?.students || [];
        const studentCount = assignedStudents.length;

        return (
          (!filters.department || mentor.department === filters.department) &&
          (!filters.searchQuery ||
            mentor.name
              .toLowerCase()
              .includes(filters.searchQuery.toLowerCase()) ||
            mentor.email
              .toLowerCase()
              .includes(filters.searchQuery.toLowerCase())) &&
          (!filters.minStudents ||
            studentCount >= parseInt(filters.minStudents)) &&
          (!filters.maxStudents ||
            studentCount <= parseInt(filters.maxStudents))
        );
      });
    }
    return mentors;
  }, [mentors, mentorStudentMapping, filters, viewMode]);

  // Filtered students for assignment view
  const filteredStudents = useMemo(() => {
    if (viewMode === "assignment") {
      return students.filter((student) => {
        return (
          (!filters.department ||
            student.department.includes(filters.department)) &&
          (!filters.year || student.year === filters.year) &&
          (!filters.mentorName ||
            student.mentors?.some((m) =>
              m.name.toLowerCase().includes(filters.mentorName.toLowerCase())
            )) &&
          (!filters.searchQuery ||
            student.name
              .toLowerCase()
              .includes(filters.searchQuery.toLowerCase()) ||
            student.regNo
              .toLowerCase()
              .includes(filters.searchQuery.toLowerCase()))
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
        showNotification(
          "This mentor has reached maximum student capacity",
          "error"
        );
        return;
      }

      // Check if this mentor is already assigned in the same role
      const existingAssignment = selectedStudent.mentors?.find(
        (m) => m.id === selectedMentor.id && m.role === mentorRole
      );

      if (existingAssignment) {
        showNotification(
          "This mentor is already assigned in this role",
          "error"
        );
        return;
      }

      // Update student's mentors
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === selectedStudent.id
            ? {
                ...student,
                mentors: [
                  ...(student.mentors || []),
                  {
                    id: selectedMentor.id,
                    name: selectedMentor.name,
                    role: mentorRole,
                    type: selectedMentor.type,
                  },
                ],
              }
            : student
        )
      );

      // Update mentor's current student count
      setMentors((prevMentors) =>
        prevMentors.map((mentor) =>
          mentor.id === selectedMentor.id
            ? { ...mentor, currentStudents: mentor.currentStudents + 1 }
            : mentor
        )
      );

      setOpenAssignDialog(false);
      setSelectedStudent(null);
      setSelectedMentor(null);
      setMentorRole("");
      showNotification("Mentor assigned successfully");
    }
  };

  // Handle removing mentor from student - show confirmation first
  const handleRemoveMentor = (studentId, mentorId) => {
    const student = students.find((s) => s.id === studentId);
    const mentor = student.mentors.find((m) => m.id === mentorId);

    setRemovalData({
      studentId,
      mentorId,
      studentName: student.name,
      mentorName: mentor.name,
    });
    setOpenConfirmDialog(true);
  };

  // Confirm and actually remove mentor from student
  const confirmRemoveMentor = () => {
    const { studentId, mentorId } = removalData;

    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? {
              ...student,
              mentors: (student.mentors || []).filter(
                (mentor) => mentor.id !== mentorId
              ),
            }
          : student
      )
    );

    // Decrement mentor's student count
    setMentors((prevMentors) =>
      prevMentors.map((mentor) =>
        mentor.id === mentorId
          ? { ...mentor, currentStudents: mentor.currentStudents - 1 }
          : mentor
      )
    );

    setOpenConfirmDialog(false);
    setRemovalData({
      studentId: null,
      mentorId: null,
      studentName: "",
      mentorName: "",
    });
    showNotification("Mentor removed successfully");
  };

  // Handle adding new mentor
  const handleAddNewMentor = (newMentorData) => {
    const newId = Math.max(...mentors.map((m) => m.id), 0) + 1;
    const mentorToAdd = {
      ...newMentorData,
      id: newId,
      currentStudents: 0,
      maxStudents: parseInt(newMentorData.maxStudents) || 5,
      expertise:
        typeof newMentorData.expertise === "string"
          ? newMentorData.expertise.split(",").map((item) => item.trim())
          : newMentorData.expertise,
    };

    setMentors([...mentors, mentorToAdd]);
    setOpenNewMentorDialog(false);
    showNotification("New mentor added successfully");
    setViewMode("mapping");
  };

  // Filter mentors available for assignment (not already assigned to this student)
  const getAvailableMentors = (student) => {
    if (!student) return [];
    const assignedMentorIds = (student.mentors || []).map((m) => m.id);
    return mentors.filter(
      (mentor) =>
        !assignedMentorIds.includes(mentor.id) &&
        mentor.currentStudents < mentor.maxStudents
    );
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        backgroundColor: "#f6f7fb",
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        "&::before": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#f6f7fb",
          zIndex: -1,
        },
      }}
    >
      <Card
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          background: "white",
          color: "#475569",
          borderRadius: "12px",
          boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "#475569",
                margin: "0 0 8px 0",
                letterSpacing: "-0.025em",
                lineHeight: "1.1",
                fontSize: "33px",
              }}
            >
              Mentor Management Dashboard
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                opacity: 0.9,
                fontSize: { xs: "0.95rem", sm: "1.1rem" },
                color: "#475569",
              }}
            >
              {viewMode === "assignment"
                ? ""
                : `${students.length.toLocaleString()} students across ${mentors.length} mentors`}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                "& .MuiToggleButton-root": {
                  color: "#475569",
                  border: "1px solid #e2e8f0",
                  fontWeight: 600,
                  fontSize: "15px",
                  "& .MuiSvgIcon-root": {
                    color: "#475569",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#e0e7ff",
                    color: "#2563eb",
                    "& .MuiSvgIcon-root": {
                      color: "#2563eb",
                    },
                  },
                },
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
            <Tooltip
              title={
                viewMode === "assignment"
                  ? "Admin Dashboard"
                  : "Mentor Management"
              }
            >
              <Avatar sx={{ backgroundColor: "white", color: "#1976d2" }}>
                {viewMode === "assignment" ? <AdminIcon /> : <GroupIcon />}
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
          borderRadius: "12px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {viewMode === "assignment" ? "Filters" : "Filter Mentors"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}></Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            label={
              viewMode === "assignment"
                ? "Search students..."
                : "Search mentors..."
            }
            size="small"
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
            sx={{
              backgroundColor: "white",
              minWidth: { xs: "100%", sm: 220 },
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={filters.department}
              label="Department"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, department: e.target.value }))
              }
              sx={{ backgroundColor: "white" }}
            >
              <MenuItem value="">All Departments</MenuItem>
              <MenuItem value="Computer Science">Computer Science</MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Mechanical">Mechanical</MenuItem>
              <MenuItem value="Electrical">Electrical</MenuItem>
              <MenuItem value="Civil">Civil</MenuItem>
              <MenuItem value="Information Technology">
                Information Technology
              </MenuItem>
            </Select>
          </FormControl>

          {viewMode === "assignment" && (
            <>
              <FormControl
                size="small"
                sx={{ minWidth: { xs: "100%", sm: 120 } }}
              >
                <InputLabel>Year</InputLabel>
                <Select
                  value={filters.year}
                  label="Year"
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, year: e.target.value }))
                  }
                  sx={{ backgroundColor: "white" }}
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
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    mentorName: e.target.value,
                  }))
                }
                sx={{
                  backgroundColor: "white",
                  minWidth: { xs: "100%", sm: 180 },
                }}
              />
            </>
          )}

          {viewMode === "mapping" && (
            <>
              <TextField
                label="Min Students"
                size="small"
                type="number"
                value={filters.minStudents}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minStudents: e.target.value,
                  }))
                }
                sx={{
                  backgroundColor: "white",
                  minWidth: { xs: "100%", sm: 120 },
                }}
              />
              <TextField
                label="Max Students"
                size="small"
                type="number"
                value={filters.maxStudents}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxStudents: e.target.value,
                  }))
                }
                sx={{
                  backgroundColor: "white",
                  minWidth: { xs: "100%", sm: 120 },
                }}
              />
            </>
          )}
        </Box>
      </Card>

      {/* Main Content - Conditional based on view mode */}
      {viewMode === "assignment" ? (
        /* Original Students Table for Assignment View */
        <Card sx={{ borderRadius: "12px", overflow: "hidden" }}>
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Students List
            </Typography>
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
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Reg No</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Assigned Mentors
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={100} />
                      </TableCell>
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
                        sx={{ "&:hover": { backgroundColor: "#f8f9fa" } }}
                      >
                        <TableCell sx={{ color: "text.secondary" }}>
                          {student.regNo}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            {student.name}
                          </Box>
                        </TableCell>
                        <TableCell>{student.department}</TableCell>
                        <TableCell>
                          <Box
                            sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                          >
                            {(student.mentors || []).map((mentor, index) => (
                              <Tooltip
                                key={`${mentor.id}-${mentor.role}`}
                                title={
                                  index === 0
                                    ? "Academic Mentor (Faculty)"
                                    : `${mentor.role} (${mentor.type})`
                                }
                                arrow
                              >
                                <Chip
                                  label={`${mentor.name}`}
                                  onDelete={
                                    index > 0
                                      ? () => {
                                          handleRemoveMentor(
                                            student.id,
                                            mentor.id
                                          );
                                        }
                                      : undefined
                                  }
                                  onClick={() =>
                                    handleOpenMentorDialog(
                                      mentors.find((m) => m.id === mentor.id)
                                    )
                                  }
                                  color={
                                    mentor.type === "Faculty"
                                      ? "primary"
                                      : mentor.type === "Industry"
                                        ? "secondary"
                                        : "default"
                                  }
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    "& .MuiChip-deleteIcon": {
                                      color: "inherit",
                                      opacity: 0.7,
                                      "&:hover": { opacity: 1 },
                                    },
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
                              boxShadow: "none",
                              borderRadius: "8px",
                              textTransform: "none",
                              "&:hover": { boxShadow: "none" },
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
        <Card sx={{ 
          borderRadius: "12px", 
          overflow: "hidden",
          backgroundColor: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid",
              borderColor: "divider",
              backgroundColor: "white"
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Mentor-Student Mapping
            </Typography>
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">
                No mentors found matching your criteria
              </Typography>
            </Box>
          ) : (
            <Box sx={{ 
              p: 3, 
              backgroundColor: "#f6f7fb",
              minHeight: "60vh"
            }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 3,
                  "@media (max-width: 1200px)": {
                    gridTemplateColumns: "repeat(3, 1fr)",
                  },
                  "@media (max-width: 900px)": {
                    gridTemplateColumns: "repeat(2, 1fr)",
                  },
                  "@media (max-width: 600px)": {
                    gridTemplateColumns: "1fr",
                  },
                }}
              >
                {filteredMentors
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((mentor) => {
                    const assignedStudents =
                      mentorStudentMapping[mentor.id]?.students || [];

                    return (
                      <Card
                        key={mentor.id}
                        sx={{
                          width: "100%",
                          minWidth: "280px",
                          height: "320px",
                          display: "flex",
                          flexDirection: "column",
                          background:
                            "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                          borderRadius: "16px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateY(-8px) scale(1.02)",
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                            borderColor: "#417ee1ff",
                          },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1, p: 3, pb: 2 }}>
                          <Box sx={{ textAlign: "center", mb: 3 }}>
                            <Avatar
                              sx={{
                                width: 72,
                                height: 72,
                                mx: "auto",
                                mb: 2,
                                fontSize: "2.2rem",
                                fontWeight: 600,
                                background:
                                  "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                              }}
                            >
                              <PersonIcon
                                sx={{ fontSize: "2.2rem", color: "white" }}
                              />
                            </Avatar>
                            <Typography
                              variant="h6"
                              component="div"
                              sx={{
                                fontWeight: 700,
                                color: "#1e293b",
                                mb: 0.5,
                                fontSize: "1.1rem",
                                lineHeight: 1.2,
                              }}
                            >
                              {mentor.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#64748b",
                                fontSize: "0.875rem",
                                mb: 2,
                              }}
                            >
                              {mentor.department} • {mentor.role}
                            </Typography>
                            <Chip
                              label={mentor.type}
                              size="small"
                              sx={{
                                background:
                                  mentor.type === "Faculty"
                                    ? "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)"
                                    : mentor.type === "Intern"
                                      ? "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)"
                                      : "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                                color:
                                  mentor.type === "Faculty"
                                    ? "#1e40af"
                                    : mentor.type === "Intern"
                                      ? "#7c2d12"
                                      : "#475569",
                                fontWeight: 600,
                                fontSize: "0.75rem",
                                border: "none",
                              }}
                            />
                          </Box>
                        </CardContent>

                        <Box
                          sx={{
                            background:
                              "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                            borderTop: "1px solid #e2e8f0",
                            p: 2.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: "-15px",
                          }}
                        >
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="h4"
                              sx={{
                                fontWeight: 700,
                                color: "#3b82f6",
                                mb: 0.5,
                                fontSize: "2rem",
                                marginTop: "-10px",
                                marginBottom: "-5px",
                              }}
                            >
                              {assignedStudents.length}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#64748b",
                                fontWeight: 500,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                              }}
                            >
                              Students
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleOpenMentorDialog(mentor)}
                            sx={{
                              background:
                                "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                              color: "white",
                              fontWeight: 600,
                              fontSize: "0.8rem",
                              textTransform: "none",
                              borderRadius: "8px",
                              px: 2.5,
                              py: 1,
                              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                              border: "none",
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                                boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
                                transform: "translateY(-1px)",
                              },
                            }}
                          >
                            View Details
                          </Button>
                        </Box>
                      </Card>
                    );
                  })}
              </Box>
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
      <AssignMentorModal
        open={openAssignDialog}
        onClose={() => setOpenAssignDialog(false)}
        selectedStudent={selectedStudent}
        availableMentors={getAvailableMentors(selectedStudent)}
        selectedMentor={selectedMentor}
        onMentorChange={(event, newValue) => setSelectedMentor(newValue)}
        mentorRole={mentorRole}
        onMentorRoleChange={(e) => setMentorRole(e.target.value)}
        mentorRoles={mentorRoles}
        onAssign={handleAssignMentor}
        viewMode={viewMode}
      />

      {/* Add New Mentor Dialog - Only for Assignment View */}
      {viewMode === "assignment" && (
        <AddMentor
          open={openNewMentorDialog}
          onClose={() => setOpenNewMentorDialog(false)}
          onAddMentor={handleAddNewMentor}
        />
      )}

      {/* Mentor Info Dialog */}
      <MentorDetailsModal
        open={openMentorDialog}
        onClose={() => setOpenMentorDialog(false)}
        selectedMentorDetails={selectedMentorDetails}
        mentorStudentMapping={mentorStudentMapping}
      />

      {/* Confirmation Dialog for Mentor Removal */}
      <ConfirmRemovalModal
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={confirmRemoveMentor}
        removalData={removalData}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: "8px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MentorManagementSystem;
