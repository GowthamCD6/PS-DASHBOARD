import React, { useState, useMemo, useEffect } from "react"; // Added useEffect import
import axios from "axios";
import { debounce } from "lodash";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  Chip,
  IconButton,
  Tooltip,
  InputAdornment,
  Card,
  CardContent,
  Fade,
  Skeleton,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
} from "@mui/icons-material";

const StudentSkillsTable = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const [filters, setFilters] = useState({
    role: "",
    year: "",
  });

  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState({
    name: "",
    regNo: "",
    department: "",
  });

  // Dynamic skill level filters
  const [skillFilters, setSkillFilters] = useState({});

  const handleSearchChange = debounce((name, value) => {
    setColumnFilters((prev) => ({ ...prev, [name]: value }));
  }, 300);

  const handleSkillFilterChange = debounce((skillId, value) => {
    setSkillFilters((prev) => ({ ...prev, [skillId]: value }));
  }, 300);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Only declare once
  const [skillColumns, setSkillColumns] = useState([]);
  const [students, setStudents] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:7000/api/students");
        const { students, skillColumns, availableSkills } = response.data;

        // Map to match frontend expectations
        const formattedStudents = students.map((student) => ({
          id: student.id,
          name: student.name,
          regNo: student.register_number,
          department: student.department,
          completedLevels: student.completed_levels,
          totalLevels: student.total_levels,
          skillLevels: student.skillLevels || {},
        }));

        setStudents(formattedStudents);
        setSkillColumns(skillColumns);
        setAvailableSkills(availableSkills);
      } catch (error) {
        console.error("Fetch error:", error);
        // Initialize empty states
        setStudents([]);
        setSkillColumns([]);
        setAvailableSkills([]);

        // Show user-friendly error
        alert("Failed to load student data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Optimized filtering with useMemo
  const filteredStudents = useMemo(() => {
    return Array.isArray(students)
      ? students.filter((student) => {
          // Basic filters
          const basicFilter = (
            student.name
              .toLowerCase()
              .includes(columnFilters.name.toLowerCase()) &&
            student.regNo
              .toLowerCase()
              .includes(columnFilters.regNo.toLowerCase()) &&
            student.department
              .toLowerCase()
              .includes(columnFilters.department.toLowerCase())
          );

          // Skill level filters
          const skillFilter = Object.entries(skillFilters).every(([skillId, filterValue]) => {
            if (!filterValue) return true; // No filter applied
            
            const studentSkillLevel = student.skillLevels?.[skillId] || 0;
            const filterLevel = parseInt(filterValue);
            
            // Filter logic: show students with skill level >= filter value
            return !isNaN(filterLevel) ? studentSkillLevel >= filterLevel : true;
          });

          return basicFilter && skillFilter;
        })
      : [];
  }, [students, columnFilters, skillFilters]);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalStudents = filteredStudents.length;
    const avgCompletion =
      totalStudents > 0
        ? filteredStudents.reduce(
            (sum, student) =>
              sum + student.completedLevels / student.totalLevels,
            0
          ) / totalStudents
        : 0;

    return {
      totalStudents,
      avgCompletion: Math.round(avgCompletion * 100),
    };
  }, [filteredStudents]);

  const addSkillColumn = () => {
    setIsLoading(true);
    setTimeout(() => {
      const nextSkillNumber = skillColumns.length + 1;
      const newSkill = {
        id: `skill${nextSkillNumber}`,
        name: `Skill ${nextSkillNumber}`,
        selectedSkill: "",
      };
      setSkillColumns([...skillColumns, newSkill]);
      setIsLoading(false);
    }, 300);
  };

  const removeSkillColumn = (skillId) => {
    setSkillColumns((prev) => prev.filter((skill) => skill.id !== skillId));
    setStudents((prev) =>
      prev.map((student) => {
        const newSkillLevels = { ...student.skillLevels };
        delete newSkillLevels[skillId];
        return { ...student, skillLevels: newSkillLevels };
      })
    );
  };

  const updateSkillColumn = (skillId, selectedSkill) => {
    setSkillColumns((prev) =>
      prev.map((skill) =>
        skill.id === skillId ? { ...skill, selectedSkill } : skill
      )
    );

    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        skillLevels: {
          ...student.skillLevels,
          [skillId]: student.skillLevels[skillId] || 0,
        },
      }))
    );

    handleCloseMenu();
  };

  const handleOpenMenu = (event, skillId) => {
    setAnchorEl(event.currentTarget);
    setSelectedSkillId(skillId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedSkillId(null);
  };

  const clearAllFilters = () => {
    setColumnFilters({ name: "", regNo: "", department: "" });
    setSkillFilters({});
    setFilters({ role: "", year: "" });
  };

  // Enhanced Level Box with progress indicator
  const LevelBox = ({ value, onClick, type = "level", maxValue = 100 }) => {
    const percentage = type === "skill" ? value : (value / maxValue) * 100;

    return (
      <Tooltip
        title={`${value}${type === "skill" ? "%" : ""} ${type === "total" ? "Total" : type === "completed" ? "Completed" : "Skill Level"}`}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: type === "skill" ? 80 : 48,
            height: 36,
            border: 2,
            borderRadius: 2,
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.875rem",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
            bgcolor:
              type === "total"
                ? "grey.100"
                : type === "completed"
                  ? "grey.100"
                  : type === "skill"
                    ? "info.50"
                    : "grey.100",
            borderColor:
              type === "total"
                ? "grey.400"
                : type === "completed"
                  ? "grey.400"
                  : type === "skill"
                    ? "info.300"
                    : "grey.300",
            color:
              type === "total"
                ? "grey.700"
                : type === "completed"
                  ? "grey.700"
                  : type === "skill"
                    ? "info.800"
                    : "grey.800",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 3,
              borderColor:
                type === "total"
                  ? "grey.600"
                  : type === "completed"
                    ? "grey.600"
                    : type === "skill"
                      ? "info.500"
                      : "grey.500",
            },
          }}
          onClick={onClick}
        >
          {type === "skill" && (
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: `${percentage}%`,
                width: "100%",
                bgcolor:
                  value >= 80
                    ? "success.200"
                    : value >= 60
                      ? "warning.200"
                      : "error.200",
                opacity: 0.3,
                transition: "height 0.3s ease",
              }}
            />
          )}
          <Typography variant="body2" sx={{ position: "relative", zIndex: 1 }}>
            {value}
            {type === "skill" ? "%" : ""}
          </Typography>
        </Box>
      </Tooltip>
    );
  };

  // Enhanced Skill Display Component (Read-only)
  const SkillDisplay = ({ value }) => {
    const displayValue = value || 0;

    return (
      <Box
        sx={{
          width: 80,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: 1,
          borderColor: "grey.300",
          borderRadius: 3,
          backgroundColor: "background.paper",
          color: "text.primary",
          fontWeight: "bold",
          fontSize: "14px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            borderColor: "grey.400",
          },
        }}
      >
        {displayValue}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2 },
        width: "100%",
        marginTop: -3,
      }}
    >
      <Paper
        sx={{
          width: "100%",
          mx: "auto",
          borderRadius: 3,
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Enhanced Header with Stats */}
        <Box
          sx={{
            p: 3,
            background: "#667eea",
            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
              flexWrap: { xs: "wrap", md: "nowrap" },
              gap: { xs: 2, md: 0 },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  mb: 1,
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                }}
              >
                Student Skills Dashboard
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  opacity: 0.9,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                Track and manage student progress across different skills
              </Typography>
            </Box>

            {/* Stats Cards */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: { xs: "center", md: "flex-end" },
              }}
            >
              <Card
                sx={{
                  minWidth: 120,
                  bgcolor: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <CardContent sx={{ p: 2, color: "white", textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                    }}
                  >
                    <SchoolIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                    <Typography variant="caption">Students</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {stats.totalStudents}
                  </Typography>
                </CardContent>
              </Card>
              <Card
                sx={{
                  minWidth: 120,
                  bgcolor: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <CardContent sx={{ p: 2, color: "white", textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                    }}
                  >
                    <AssignmentTurnedInIcon
                      sx={{ mr: 1, fontSize: "1.2rem" }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {stats.avgCompletion}%
                    </Typography>
                  </Box>
                  <Typography variant="caption">Avg Completion</Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Enhanced Filters */}
          <Card
            sx={{
              bgcolor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              p: 2,
              mt: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={filters.role}
                  label="Role"
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, role: e.target.value }))
                  }
                  size="small"
                >
                  <MenuItem value="">All Roles</MenuItem>
                  <MenuItem value="HOD">HOD</MenuItem>
                  <MenuItem value="faculty">Faculty</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Year</InputLabel>
                <Select
                  value={filters.year}
                  label="Year"
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, year: e.target.value }))
                  }
                  size="small"
                >
                  <MenuItem value="">All Years</MenuItem>
                  <MenuItem value="I">I Year</MenuItem>
                  <MenuItem value="II">II Year</MenuItem>
                  <MenuItem value="III">III Year</MenuItem>
                  <MenuItem value="IV">IV Year</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Department</InputLabel>
                <Select
                  value={columnFilters.department}
                  label="Department"
                  onChange={(e) =>
                    setColumnFilters((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  size="small"
                >
                  <MenuItem value="">All Departments</MenuItem>
                  <MenuItem value="CSE">CSE</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="ECE">ECE</MenuItem>
                  <MenuItem value="EEE">EEE</MenuItem>
                  <MenuItem value="MECH">MECH</MenuItem>
                </Select>
              </FormControl>

              <Button
                onClick={() => setShowColumnFilters(!showColumnFilters)}
                startIcon={<FilterListIcon />}
                variant="outlined"
                size="small"
                sx={{
                  color: "text.primary",
                  borderColor: "grey.300",
                  "&:hover": {
                    borderColor: "#667eea",
                    bgcolor: "rgba(102, 126, 234, 0.1)",
                  },
                }}
              >
                Column Filters
              </Button>
              <Button
                aria-label="Add skill"
                onClick={addSkillColumn}
                startIcon={
                  isLoading ? (
                    <Skeleton variant="rectangular" height={400} />
                  ) : (
                    <AddIcon />
                  )
                }
                variant="contained"
                sx={{
                  ml: "auto",
                  bgcolor: "#4CAF50",
                  color: "white",
                  "&:hover": { bgcolor: "#45a049" },
                  boxShadow: "0 2px 8px rgba(76, 175, 80, 0.3)",
                }}
                disabled={isLoading}
              >
                Add Skill
              </Button>
            </Box>
          </Card>
        </Box>

        {/* Enhanced Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          PaperProps={{
            sx: {
              maxHeight: 300,
              width: "280px",
              borderRadius: 2,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            },
          }}
          TransitionComponent={Fade}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "grey.200" }}>
            <Typography variant="subtitle2" color="text.secondary">
              Select a skill to track
            </Typography>
          </Box>
          {availableSkills
            .filter(
              (skillName) =>
                !skillColumns.some(
                  (col) =>
                    col.id !== selectedSkillId &&
                    col.selectedSkill === skillName
                )
            )
            .map((skillName) => (
              <MenuItem
                key={skillName}
                onClick={() => updateSkillColumn(selectedSkillId, skillName)}
                sx={{
                  "&:hover": {
                    bgcolor: "primary.50",
                  },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {skillName}
              </MenuItem>
            ))}
        </Menu>

        {/* Enhanced Table */}
        <Box sx={{ position: "relative", mt: 3 }}>
          {/* Fixed Columns */}
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                flexShrink: 0,
                borderRight: 1,
                borderColor: "grey.200",
              }}
            >
              <TableContainer>
                <Table sx={{ borderCollapse: "collapse" }}>
                  <TableHead sx={{ bgcolor: "grey.50" }}>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          borderRight: 1,
                          borderColor: "grey.200",
                          width: 100,
                          height: 80,
                          verticalAlign: "middle",
                          textAlign: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          TOTAL LEVEL
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          borderRight: 1,
                          borderColor: "grey.200",
                          width: 100,
                          height: 80,
                          verticalAlign: "middle",
                          textAlign: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          COMPLETEDthe 
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          borderRight: 1,
                          borderColor: "grey.200",
                          width: 160,
                          height: 80,
                          verticalAlign: "middle",
                          textAlign: "center",
                        }}
                      >
                        NAME
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          borderRight: 1,
                          borderColor: "grey.200",
                          width: 120,
                          height: 80,
                          verticalAlign: "middle",
                          textAlign: "center",
                        }}
                      >
                        REG NO
                      </TableCell>
                    </TableRow>

                    {showColumnFilters && (
                      <TableRow>
                        <TableCell
                          sx={{
                            borderRight: 1,
                            borderColor: "grey.200",
                            height: 60,
                            verticalAlign: "middle",
                            width: 100,
                          }}
                        ></TableCell>
                        <TableCell
                          sx={{
                            borderRight: 1,
                            borderColor: "grey.200",
                            height: 60,
                            verticalAlign: "middle",
                            width: 100,
                          }}
                        ></TableCell>
                        <TableCell
                          sx={{
                            borderRight: 1,
                            borderColor: "grey.200",
                            height: 60,
                            verticalAlign: "middle",
                          }}
                        >
                          <TextField
                            size="small"
                            placeholder="Search name..."
                            variant="outlined"
                            fullWidth
                            value={columnFilters.name}
                            onChange={(e) =>
                              setColumnFilters((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            InputProps={{
                              startAdornment: (
                                <SearchIcon fontSize="small" color="action" />
                              ),
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: 1,
                            borderColor: "grey.200",
                            height: 60,
                            verticalAlign: "middle",
                          }}
                        >
                          <TextField
                            size="small"
                            placeholder="Search reg..."
                            variant="outlined"
                            fullWidth
                            value={columnFilters.regNo}
                            onChange={(e) =>
                              handleSearchChange("regNo", e.target.value)
                            }
                            InputProps={{
                              startAdornment: (
                                <SearchIcon fontSize="small" color="action" />
                              ),
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableHead>

                  <TableBody>
                    {filteredStudents.map((student, index) => (
                      <TableRow
                        key={student.id}
                        sx={{
                          "&:hover": { bgcolor: "primary.50" },
                          "&:nth-of-type(even)": { bgcolor: "grey.25" },
                          height: 60,
                        }}
                      >
                        <TableCell
                          sx={{
                            borderRight: 1,
                            borderColor: "grey.200",
                            height: 60,
                            verticalAlign: "middle",
                            textAlign: "center",
                            width: 100,
                          }}
                        >
                          <LevelBox
                            value={student.totalLevels}
                            type="total"
                            onClick={() => {}}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: 1,
                            borderColor: "grey.200",
                            height: 60,
                            verticalAlign: "middle",
                            textAlign: "center",
                            width: 100,
                          }}
                        >
                          <LevelBox
                            value={student.completedLevels}
                            type="completed"
                            maxValue={student.totalLevels}
                            onClick={() => {}}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: 1,
                            borderColor: "grey.200",
                            height: 60,
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "medium" }}
                            >
                              {student.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: 1,
                            borderColor: "grey.200",
                            height: 60,
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          <Chip
                            label={student.regNo}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Scrollable Skills Section */}
            <Box
              sx={{
                flexGrow: 1,
                overflowX: "auto",
                // Professional custom scrollbar
                "&::-webkit-scrollbar": {
                  height: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f3f4",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#c1c8cd",
                  borderRadius: "10px",
                  border: "2px solid #f1f3f4",
                  "&:hover": {
                    backgroundColor: "#a8b1ba",
                  },
                },
                "&::-webkit-scrollbar-corner": {
                  backgroundColor: "#f1f3f4",
                },
                // Firefox scrollbar
                scrollbarWidth: "thin",
                scrollbarColor: "#c1c8cd #f1f3f4",
              }}
            >
              <TableContainer>
                <Table
                  sx={{
                    borderCollapse: "collapse",
                    minWidth: skillColumns.length * 200,
                    tableLayout: "fixed",
                    width: "100%",
                  }}
                >
                  <TableHead sx={{ bgcolor: "grey.50" }}>
                    <TableRow>
                      {skillColumns.map((skill) => (
                        <TableCell
                          key={skill.id}
                          sx={{
                            fontWeight: "bold",
                            borderRight: 1,
                            borderColor: "grey.200",
                            minWidth: 200,
                            height: 80,
                            verticalAlign: "middle",
                            position: "relative",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                              height: "100%",
                              justifyContent: "center",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  position: "relative",
                                  flex: 1,
                                }}
                              >
                                {/* Floating Label with MUI-style animation */}
                                <Typography
                                  variant="caption"
                                  sx={{
                                    position: "absolute",
                                    top: skill.selectedSkill ? -8 : "50%",
                                    left: 12,
                                    transform: skill.selectedSkill
                                      ? "translateY(0)"
                                      : "translateY(-50%)",
                                    bgcolor: skill.selectedSkill
                                      ? "white"
                                      : "transparent",
                                    px: skill.selectedSkill ? 1 : 0,
                                    color: skill.selectedSkill
                                      ? "primary.main"
                                      : "text.secondary",
                                    fontWeight: skill.selectedSkill
                                      ? "bold"
                                      : "normal",
                                    fontSize: skill.selectedSkill
                                      ? "0.7rem"
                                      : "0.875rem",
                                    zIndex: 1,
                                    transition: "all 0.2s ease-in-out",
                                    pointerEvents: "none",
                                  }}
                                >
                                  {skill.name}
                                </Typography>

                                <Button
                                  variant="outlined"
                                  onClick={(e) => handleOpenMenu(e, skill.id)}
                                  endIcon={<ArrowDropDownIcon />}
                                  sx={{
                                    textTransform: "none",
                                    justifyContent: "space-between",
                                    minHeight: 44,
                                    bgcolor: "white",
                                    border: 2,
                                    borderColor: skill.selectedSkill
                                      ? "primary.main"
                                      : "grey.300",
                                    borderRadius: 2,
                                    width: "100%",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                      bgcolor: "primary.main",
                                      borderColor: "primary.main",
                                      transform: "translateY(-1px)",
                                      "& .MuiTypography-root": {
                                        color: "white !important",
                                      },
                                      "& .MuiSvgIcon-root": {
                                        color: "white !important",
                                      },
                                    },
                                    "&:focus": {
                                      borderColor: "primary.main",
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      textAlign: "left",
                                      width: "100%",
                                      pl: skill.selectedSkill ? 0 : 2,
                                    }}
                                  >
                                    {skill.selectedSkill && (
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: "medium",
                                          color: "text.primary",
                                          transition: "color 0.3s ease",
                                        }}
                                      >
                                        {skill.selectedSkill}
                                      </Typography>
                                    )}
                                  </Box>
                                </Button>
                              </Box>

                              {skillColumns.length > 3 && (
                                <Tooltip title="Remove skill column">
                                  <IconButton
                                    size="small"
                                    onClick={() => removeSkillColumn(skill.id)}
                                    sx={{
                                      color: "error.main",
                                      "&:hover": { bgcolor: "error.50" },
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>

                    {showColumnFilters && (
                      <TableRow sx={{ bgcolor: "grey.25" }}>
                        {skillColumns.map((skill) => (
                          <TableCell
                            key={skill.id}
                            sx={{
                              borderRight: 1,
                              borderColor: "grey.200",
                              minWidth: 200,
                              height: 60,
                              verticalAlign: "middle",
                            }}
                          >
                            <TextField
                              size="small"
                              placeholder="Search by level"
                              variant="outlined"
                              fullWidth
                              value={skillFilters[skill.id] || ''}
                              onChange={(e) => handleSkillFilterChange(skill.id, e.target.value)}
                              type="number"
                              inputProps={{
                                min: 0,
                                max: 10,
                                step: 1
                              }}
                              InputProps={{
                                startAdornment: (
                                  <SearchIcon fontSize="small" color="action" />
                                ),
                              }}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    )}
                  </TableHead>

                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow
                        key={student.id}
                        sx={{
                          "&:hover": { bgcolor: "primary.50" },
                          "&:nth-of-type(even)": { bgcolor: "grey.25" },
                          height: 60,
                        }}
                      >
                        {skillColumns.map((skill) => (
                          <TableCell
                            key={skill.id}
                            sx={{
                              borderRight: 1,
                              borderColor: "grey.200",
                              textAlign: "center",
                              minWidth: 200,
                              height: 60,
                              verticalAlign: "middle",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                height: "100%",
                              }}
                            >
                              {skill.selectedSkill ? (
                                <SkillDisplay
                                  value={student.skillLevels[skill.id]}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: 36,
                                    width: 80,
                                    border: 2,
                                    borderColor: "grey.300",
                                    borderRadius: 2,
                                    backgroundColor: "grey.50",
                                  }}
                                >
                                  <Typography
                                    color="text.disabled"
                                    sx={{
                                      fontStyle: "italic",
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    -
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentSkillsTable;