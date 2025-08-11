import React, { useState, useMemo } from "react";
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
  Avatar,
  LinearProgress,
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
  Star as StarIcon,
  Assignment as AssignmentIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";

const MenteeDashboard = () => {
  const [filters, setFilters] = useState({
    year: "",
    department: "",
  });

  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState({
    name: "",
    regNo: "",
    subject: "",
  });

  // Dynamic skill level filters
  const [skillFilters, setSkillFilters] = useState({});

  const handleSkillFilterChange = debounce((skillId, value) => {
    setSkillFilters((prev) => ({ ...prev, [skillId]: value }));
  }, 300);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [skillColumns, setSkillColumns] = useState([
    {
      id: "skill1",
      name: "Skill 1",
      selectedSkill: "JavaScript",
      color: "#1976d2",
    },
    { id: "skill2", name: "Skill 2", selectedSkill: "React", color: "#2e7d32" },
    { id: "skill3", name: "Skill 3", selectedSkill: "", color: "#d32f2f" },
  ]);

  // Limited mentee data (only 4-5 students under this mentor)
  const [mentees, setMentees] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      regNo: "7376242CSE163",
      department: "CSE",
      year: "III",
      totalLevels: 10,
      completedLevels: 7,
      skillLevels: { skill1: 85, skill2: 70, skill3: 0 },
      avatar: "RS",
      performance: 78,
    },
    {
      id: 2,
      name: "Priya Gupta",
      regNo: "7376243CSE164",
      department: "CSE", 
      year: "III",
      totalLevels: 8,
      completedLevels: 6,
      skillLevels: { skill1: 90, skill2: 85, skill3: 0 },
      avatar: "PG",
      performance: 85,
    },
    {
      id: 3,
      name: "Amit Singh",
      regNo: "7376244CSE165",
      department: "CSE",
      year: "III",
      totalLevels: 12,
      completedLevels: 9,
      skillLevels: { skill1: 75, skill2: 80, skill3: 0 },
      avatar: "AS",
      performance: 73,
    },
    {
      id: 4,
      name: "Sneha Patel",
      regNo: "7376245CSE166",
      department: "CSE",
      year: "III",
      totalLevels: 15,
      completedLevels: 12,
      skillLevels: { skill1: 95, skill2: 88, skill3: 0 },
      avatar: "SP",
      performance: 92,
    },
  ]);

  const availableSkills = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "C",
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "Django",
    "Spring",
    "Express.js",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "HTML",
    "CSS",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "TypeScript",
    "Swift",
    "Kotlin",
    "Docker",
    "AWS",
    "Git",
  ];



  // Optimized filtering with useMemo
  const filteredMentees = useMemo(() => {
    return mentees.filter((mentee) => {
      // Basic filters
      const basicFilters = (
        mentee.name.toLowerCase().includes(columnFilters.name.toLowerCase()) &&
        mentee.regNo
          .toLowerCase()
          .includes(columnFilters.regNo.toLowerCase()) &&
        mentee.department
          .toLowerCase()
          .includes(columnFilters.subject.toLowerCase()) &&
        (filters.year === "" || mentee.year === filters.year) &&
        (filters.department === "" || mentee.department === filters.department)
      );

      // Skill level filters
      const skillLevelFilters = Object.entries(skillFilters).every(([skillId, filterValue]) => {
        if (!filterValue || filterValue === '') return true;
        const menteeSkillLevel = mentee.skillLevels[skillId] || 0;
        return menteeSkillLevel >= parseInt(filterValue);
      });

      return basicFilters && skillLevelFilters;
    });
  }, [mentees, columnFilters, filters, skillFilters]);

  // Mentee statistics calculation
  const stats = useMemo(() => {
    const totalMentees = filteredMentees.length;
    const avgPerformance =
      totalMentees > 0
        ? filteredMentees.reduce((sum, mentee) => sum + mentee.performance, 0) / totalMentees
        : 0;
    
    const topPerformer = filteredMentees.reduce((top, mentee) => 
      mentee.performance > (top?.performance || 0) ? mentee : top, null);

    return {
      totalMentees,
      avgPerformance: Math.round(avgPerformance),
      topPerformer,
    };
  }, [filteredMentees]);

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
    setMentees((prev) =>
      prev.map((mentee) => {
        const newSkillLevels = { ...mentee.skillLevels };
        delete newSkillLevels[skillId];
        return { ...mentee, skillLevels: newSkillLevels };
      })
    );
  };

  const updateSkillColumn = (skillId, selectedSkill) => {
    setSkillColumns((prev) =>
      prev.map((skill) =>
        skill.id === skillId ? { ...skill, selectedSkill } : skill
      )
    );

    setMentees((prev) =>
      prev.map((mentee) => ({
        ...mentee,
        skillLevels: {
          ...mentee.skillLevels,
          [skillId]: mentee.skillLevels[skillId] || 0,
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

  const updateSkillLevel = (menteeId, skillId, level) => {
    const clampedLevel = Math.max(0, Math.min(100, level));
    setMentees((prev) =>
      prev.map((mentee) =>
        mentee.id === menteeId
          ? {
              ...mentee,
              skillLevels: {
                ...mentee.skillLevels,
                [skillId]: clampedLevel,
              },
            }
          : mentee
      )
    );
  };

  const clearAllFilters = () => {
    setColumnFilters({ name: "", regNo: "", subject: "" });
    setFilters({ year: "", department: "" });
    setSkillFilters({});
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
  const SkillDisplay = ({ value }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 80,
        height: 36,
        border: 1,
        borderRadius: 2,
        fontWeight: "bold",
        fontSize: "0.875rem",
        borderColor: " gray", // Red border color
        backgroundColor: "white",
        margin: "0 auto",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: "bold",
          color : 'primary', // Red text color
        }}
      >
        {value || 0}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2 },
        width: "100%",
        marginTop: -3,
        height: "calc(100vh - 64px)", // Adjust based on your app bar height
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          mx: "auto",
          borderRadius: 3,
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          overflow: "auto",
          maxHeight: "calc(100vh - 80px)", // Adjust this value based on your layout
        }}
      >
        {/* Enhanced Header with Mentee Stats */}
        <Box
          sx={{
            p: 3,
            background: "#667eea",
            color: "white",
            position: "sticky",
            top: 0,
            zIndex: 1100,
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
                  fontSize: { xs: "1.5rem", sm: "2rem" }
                }}
              >
                Mentees Dashboard
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  opacity: 0.9,
                  fontSize: { xs: "0.875rem", sm: "1rem" }
                }}
              >
                Track and monitor your assigned mentees' progress and skills development
              </Typography>
            </Box>

            {/* Enhanced Stats Cards for Mentees */}
            <Box 
              sx={{ 
                display: "flex", 
                gap: 2,
                flexWrap: "wrap",
                justifyContent: { xs: "center", md: "flex-end" }
              }}
            >
              <Card
                sx={{
                  minWidth: 120,
                  bgcolor: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <CardContent sx={{ p: 1.5, color: "white", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 0.5 }}>
                    <SchoolIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                    <Typography variant="caption">My Mentees</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                     {stats.totalMentees}
                  </Typography>
                </CardContent>
              </Card>

              {stats.topPerformer && (
                <Card
                  sx={{
                    minWidth: 140,
                    bgcolor: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CardContent sx={{ p: 1.5, color: "white", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 0.5 }}>
                      <StarIcon sx={{ mr: 1, fontSize: "1.2rem", color: "#FFD700" }} />
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {stats.topPerformer.name}
                      </Typography>
                    </Box>
                    <Typography variant="caption">Top Performer</Typography>
                  </CardContent>
                </Card>
              )}
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
                value={filters.department}
                label="Department"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, department: e.target.value }))
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
              Search Filters
            </Button>

            <Button
              onClick={clearAllFilters}
              startIcon={<ClearIcon />}
              variant="outlined"
              size="small"
              sx={{
                color: "text.primary",
                borderColor: "grey.300",
                "&:hover": {
                  borderColor: "error.main",
                  bgcolor: "rgba(211, 47, 47, 0.1)",
                  color: "error.main",
                },
              }}
            >
              Clear All Filters
            </Button>
            <Button
              onClick={addSkillColumn}
              startIcon={
                isLoading ? <Skeleton width={20} height={20} /> : <AddIcon />
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
              Select a skill to track for your mentees
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

        {/* Enhanced Table - THIS PART WILL BE SCROLLABLE */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", position: "relative", mt: 3 }}>
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
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          borderRight: 1,
                          borderColor: "grey.200",
                          width: 100,
                          height: 80,
                          verticalAlign: "middle",
                          textAlign: "center",
                          bgcolor: "primary.50",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}
                        >
                          TOTAL LEVELS
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          borderRight: 1,
                          borderColor: "grey.200",
                          width: 80,
                          height: 80,
                          verticalAlign: "middle",
                          textAlign: "center",
                          bgcolor: "success.50",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}
                        >
                          COMPLETED
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          borderRight: 1,
                          borderColor: "grey.200",
                          width: 180,
                          height: 80,
                          verticalAlign: "middle",
                          textAlign: "center",
                          bgcolor: "info.50",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}
                        >
                          MENTEE NAME
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          borderRight: 1,
                          borderColor: "grey.200",
                          width: 140,
                          height: 80,
                          verticalAlign: "middle",
                          textAlign: "center",
                          bgcolor: "warning.50",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}
                        >
                          REGISTRATION NO
                        </Box>
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
                            width: 80,
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
                            placeholder="Search mentee..."
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
                            placeholder="Search reg no..."
                            variant="outlined"
                            fullWidth
                            value={columnFilters.regNo}
                            onChange={(e) =>
                              setColumnFilters((prev) => ({
                                ...prev,
                                regNo: e.target.value,
                              }))
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
                    {filteredMentees.map((mentee, index) => (
                      <TableRow
                        key={mentee.id}
                        sx={{
                          "&:hover": { bgcolor: "primary.50" },
                          "&:nth-of-type(even)": { bgcolor: "grey.25" },
                          height: 70,
                        }}
                      >
                        <TableCell
                          sx={{ 
                            borderRight: 1, 
                            borderColor: "grey.200",
                            height: 70,
                            verticalAlign: "middle",
                            textAlign: "center",
                            width: 100,
                          }}
                        >
                          <LevelBox
                            value={mentee.totalLevels}
                            type="total"
                            onClick={() => {}}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ 
                            borderRight: 1, 
                            borderColor: "grey.200",
                            height: 70,
                            verticalAlign: "middle",
                            textAlign: "center",
                            width: 80,
                          }}
                        >
                          <LevelBox
                            value={mentee.completedLevels}
                            type="completed"
                            maxValue={mentee.totalLevels}
                            onClick={() => {}}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ 
                            borderRight: 1, 
                            borderColor: "grey.200",
                            height: 70,
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "medium" }}
                          >
                            {mentee.name}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{ 
                            borderRight: 1, 
                            borderColor: "grey.200",
                            height: 70,
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          <Chip
                            label={mentee.regNo}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ fontFamily: "monospace" }}
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
                                <Typography
                                  variant="caption"
                                  sx={{
                                    position: "absolute",
                                    top: skill.selectedSkill ? -8 : "50%",
                                    left: 12,
                                    transform: skill.selectedSkill ? "translateY(0)" : "translateY(-50%)",
                                    bgcolor: skill.selectedSkill ? "white" : "transparent",
                                    px: skill.selectedSkill ? 1 : 0,
                                    color: skill.selectedSkill ? "primary.main" : "text.secondary",
                                    fontWeight: skill.selectedSkill ? "bold" : "normal",
                                    fontSize: skill.selectedSkill ? "0.7rem" : "0.875rem",
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
                                    borderColor: skill.selectedSkill ? "primary.main" : "grey.300",
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
                                  <Box sx={{ textAlign: "left", width: "100%", pl: skill.selectedSkill ? 0 : 2 }}>
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
                              placeholder="Search by level..."
                              variant="outlined"
                              fullWidth
                              value={skillFilters[skill.id] || ''}
                              onChange={(e) => handleSkillFilterChange(skill.id, e.target.value)}
                              type="number"
                              inputProps={{
                                min: 0,
                                max: 100,
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
                    {filteredMentees.map((mentee) => (
                      <TableRow
                        key={mentee.id}
                        sx={{
                          "&:hover": { bgcolor: "primary.50" },
                          "&:nth-of-type(even)": { bgcolor: "grey.25" },
                          height: 70,
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
                              height: 70,
                              verticalAlign: "middle",
                            }}
                          >
                            {skill.selectedSkill ? (
                              <SkillDisplay
                                value={mentee.skillLevels[skill.id]}
                              />
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  height: 36,
                                  width: 80,
                                  margin: "0 auto",
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

export default MenteeDashboard;