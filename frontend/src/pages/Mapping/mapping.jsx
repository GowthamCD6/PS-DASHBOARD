import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
  Skeleton,
  Tooltip,
} from "@mui/material";
import {
  Person as PersonIcon,
  AccountTree as AccountTreeIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import MentorDetailsModal from "./Modals/MentorDetailsModal";

const MappingPage = () => {
  // State variables
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [openMentorDialog, setOpenMentorDialog] = useState(false);
  const [selectedMentorDetails, setSelectedMentorDetails] = useState(null);

  // Filters for mapping view
  const [filters, setFilters] = useState({
    department: "",
    searchQuery: "",
    minStudents: "",
    maxStudents: "",
  });

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
            : `Mr. Intern ${i.toString().padStart(2, "0")}`,
        department: dept,
        type: type,
        role: type === "Faculty" ? "Professor" : "Industry Expert",
        email: `mentor${i}@example.edu`,
        phone: `9${Math.floor(Math.random() * 1000000000)
          .toString()
          .padStart(9, "0")}`,
        maxStudents: 200, // 200 students per mentor to handle 7000 students across 50 mentors
        expertise:
          type === "Faculty"
            ? ["Programming", "Research", "Academic Guidance"]
            : ["Industry Skills", "Career Guidance", "Practical Training"],
      });
    }
    return mentors;
  };

  // Initialize data for mapping view
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate bulk data for mapping view
      const generatedStudents = generateBulkStudents();
      const generatedMentors = generateMentors();
      setStudents(generatedStudents);
      setMentors(generatedMentors);

      setLoading(false);
    };

    initializeData();
  }, []);

  // Memoized calculations for performance with large datasets
  const mentorStudentMapping = useMemo(() => {
    const mapping = {};
    
    // For mapping view, use generated student data
    mentors.forEach((mentor) => {
      mapping[mentor.id] = {
        mentor: mentor,
        students: students.filter(
          (student) => student.mentorId === mentor.id
        ).map((student) => ({
          ...student,
          assignmentType: student.isDefaultAssigned ? "default" : "manual",
          assignedDate: student.assignedDate.toISOString().split('T')[0],
        })),
      };
    });

    return mapping;
  }, [students, mentors]);

  // Filtered mentors based on search criteria (mapping view)
  const filteredMentors = useMemo(() => {
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
  }, [mentors, mentorStudentMapping, filters]);

  // Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenMentorDialog = (mentor) => {
    setSelectedMentorDetails(mentor);
    setOpenMentorDialog(true);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        backgroundColor: "#f6f7fb",
        minHeight: "100vh",
        width: "100%",
        position: "relative",
      }}
    >
      {/* Header Card */}
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
              Mentor-Student Mapping
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                opacity: 0.9,
                fontSize: { xs: "0.95rem", sm: "1.1rem" },
                color: "#475569",
              }}
            >
              {`${students.length.toLocaleString()} students across ${mentors.length} mentors`}
            </Typography>
          </Box>
          <Tooltip title="Mapping Overview">
            <Avatar sx={{ backgroundColor: "white", color: "#1976d2" }}>
              <AccountTreeIcon />
            </Avatar>
          </Tooltip>
        </Box>
      </Card>

      {/* Filters Card */}
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
            Filter Mentors
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
            label="Search mentors..."
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
        </Box>
      </Card>

      {/* Main Content - Mapping Grid */}
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

      {/* Mentor Details Modal */}
      <MentorDetailsModal
        open={openMentorDialog}
        onClose={() => setOpenMentorDialog(false)}
        selectedMentorDetails={selectedMentorDetails}
        mentorStudentMapping={mentorStudentMapping}
      />
    </Box>
  );
};

export default MappingPage;