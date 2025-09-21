import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  Avatar,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import AddMentor from "../Modals/AddMentor";
import AssignMentorModal from "../Modals/AssignMentorModal";
import MentorDetailsModal from "../Modals/MentorDetailsModal";
import ConfirmRemovalModal from "../Modals/ConfirmRemovalModal";

const MentorManagementSystem = () => {
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
  const [openMentorDetailsDialog, setOpenMentorDetailsDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedMentorDetails, setSelectedMentorDetails] = useState(null);
  const [mentorRole, setMentorRole] = useState("");
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMentors: 0,
    averageMentorsPerStudent: 0,
    departmentStats: {},
    mentorTypeStats: {},
  });

  // Filters for assignment view
  const [filters, setFilters] = useState({
    department: "",
    searchQuery: "",
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

  // Initialize data for assignment view
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use original data for assignment view
      setStudents(originalStudents);
      setMentors(originalMentors);

      setLoading(false);
    };

    initializeData();
  }, []);

  // Calculate statistics for assignment view
  useEffect(() => {
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
  }, [students, mentors]);

  // Show notification
  const showNotification = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Filtered students for assignment view
  const filteredStudents = useMemo(() => {
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
  }, [students, filters]);

  // Handle opening assign dialog
  const handleOpenAssignDialog = (student) => {
    setSelectedStudent(student);
    setOpenAssignDialog(true);
  };

  // Handle opening mentor details dialog
  const handleOpenMentorDetailsDialog = (mentorId) => {
    const mentor = mentors.find(m => m.id === mentorId);
    if (mentor) {
      setSelectedMentorDetails(mentor);
      setOpenMentorDetailsDialog(true);
    }
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

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
              Assignment View - Manage mentor assignments
            </Typography>
          </Box>
          <Tooltip title="Admin Dashboard">
            <Avatar sx={{ backgroundColor: "white", color: "#1976d2" }}>
              <AdminIcon />
            </Avatar>
          </Tooltip>
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
            Filters
          </Typography>
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
            label="Search students..."
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
        </Box>
      </Card>

      {/* Students Table for Assignment View */}
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
                                onClick={() => handleOpenMentorDetailsDialog(mentor.id)}
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
                                  "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                  },
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
        viewMode="assignment"
      />

      {/* Mentor Details Dialog */}
      <MentorDetailsModal
        open={openMentorDetailsDialog}
        onClose={() => setOpenMentorDetailsDialog(false)}
        selectedMentorDetails={selectedMentorDetails}
        mentorStudentMapping={{}}
      />

      {/* Add New Mentor Dialog - Only for Assignment View */}
      <AddMentor
        open={openNewMentorDialog}
        onClose={() => setOpenNewMentorDialog(false)}
        onAddMentor={handleAddNewMentor}
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