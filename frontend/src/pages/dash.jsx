import React, { useState, useMemo } from "react";
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
} from "@mui/material";
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

const StudentSkillsTable = () => {
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
  ]);

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Ram Kumar",
      regNo: "737642",
      department: "CSE",
      totalLevels: 10,
      completedLevels: 7,
      skillLevels: { skill1: 10, skill2: 5 },
      avatar: "👨‍💻",
    },
    {
      id: 2,
      name: "John Doe",
      regNo: "737643",
      department: "ECE",
      totalLevels: 8,
      completedLevels: 6,
      skillLevels: { skill1: 10, skill2: 5 },
      avatar: "👨‍🎓",
    },
    {
      id: 3,
      name: "Jane Smith",
      regNo: "737644",
      department: "IT",
      totalLevels: 12,
      completedLevels: 9,
      skillLevels: { skill1: 10, skill2: 5 },
      avatar: "👩‍💻",
    },
    {
      id: 4,
      name: "Alice Johnson",
      regNo: "737645",
      department: "CSE",
      totalLevels: 15,
      completedLevels: 12,
      skillLevels: { skill1: 10, skill2: 5 },
      avatar: "👩‍🔬",
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

  // const skillColors = [
  //   '#1976d2', '#2e7d32', '#d32f2f', '#7b1fa2', '#f57c00',
  //   '#0288d1', '#388e3c', '#f44336', '#9c27b0', '#ff9800'
  // ];

  // Optimized filtering with useMemo
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      return (
        student.name.toLowerCase().includes(columnFilters.name.toLowerCase()) &&
        student.regNo
          .toLowerCase()
          .includes(columnFilters.regNo.toLowerCase()) &&
        student.department
          .toLowerCase()
          .includes(columnFilters.department.toLowerCase())
      );
    });
  }, [students, columnFilters]);

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
        // color: skillColors[nextSkillNumber % skillColors.length]
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

  const updateSkillLevel = (studentId, skillId, level) => {
    const clampedLevel = Math.max(0, Math.min(100, level));
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              skillLevels: {
                ...student.skillLevels,
                [skillId]: clampedLevel,
              },
            }
          : student
      )
    );
  };

  const clearAllFilters = () => {
    setColumnFilters({ name: "", regNo: "" }); // department removed
    setFilters({ role: "", year: "", department: "" }); // department added here
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
                ? "primary.50"
                : type === "completed"
                  ? "success.50"
                  : type === "skill"
                    ? "info.50"
                    : "grey.100",
            borderColor:
              type === "total"
                ? "primary.300"
                : type === "completed"
                  ? "success.300"
                  : type === "skill"
                    ? "info.300"
                    : "grey.300",
            color:
              type === "total"
                ? "primary.800"
                : type === "completed"
                  ? "success.800"
                  : type === "skill"
                    ? "info.800"
                    : "grey.800",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 3,
              borderColor:
                type === "total"
                  ? "primary.500"
                  : type === "completed"
                    ? "success.500"
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

  // Enhanced Skill Input Component
  const SkillInput = ({ value, onChange, skillColor }) => (
    <TextField
      type="number"
      size="small"
      value={value || 0}
      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      inputProps={{
        min: 0,
        max: 100,
        style: { textAlign: "center", fontWeight: "bold" },
      }}
      sx={{
        width: 70,
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          "& input": {
            color:
              value >= 80
                ? "success.main"
                : value >= 60
                  ? "warning.main"
                  : "error.main",
          },
          "&:hover fieldset": {
            borderColor: skillColor,
          },
          "&.Mui-focused fieldset": {
            borderColor: skillColor,
          },
        },
      }}
      InputProps={{
        endAdornment: <InputAdornment position="end"></InputAdornment>,
      }}
    />
  );

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Paper
        sx={{
          maxWidth: "100%",
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
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                Student Skills Dashboard
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Track and manage student progress across different skills
              </Typography>
            </Box>

            {/* Stats Cards */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Card
                sx={{
                  minWidth: 120,
                  bgcolor: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <CardContent sx={{ p: 2, color: "white", textAlign: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {stats.totalStudents}
                  </Typography>
                  <Typography variant="caption">Students</Typography>
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
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {stats.avgCompletion}%
                  </Typography>
                  <Typography variant="caption">Avg Completion</Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Enhanced Filters */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ color: "white" }}>Role</InputLabel>
              <Select
                value={filters.role}
                label="Role"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, role: e.target.value }))
                }
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.5)",
                  },
                }}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="HOD">HOD</MenuItem>
                <MenuItem value="faculty">Faculty</MenuItem>
                <MenuItem value="student">Student</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ color: "white" }}>Year</InputLabel>
              <Select
                value={filters.year}
                label="Year"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, year: e.target.value }))
                }
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.5)",
                  },
                }}
              >
                <MenuItem value="">All Years</MenuItem>
                <MenuItem value="I">I Year</MenuItem>
                <MenuItem value="II">II Year</MenuItem>
                <MenuItem value="III">III Year</MenuItem>
                <MenuItem value="IV">IV Year</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel sx={{ color: "white" }}>Department</InputLabel>
              <Select
                value={columnFilters.department}
                label="Department"
                onChange={(e) =>
                  setColumnFilters((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.5)",
                  },
                }}
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
                borderColor: "rgba(255,255,255,0.3)",
                color: "white",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Column Filters
            </Button>

            {/* <Button
              onClick={clearAllFilters}
              startIcon={<ClearIcon />}
              variant="text"
              size="small"
              sx={{ color: 'white', opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              Clear All
            </Button> */}

            <Button
              onClick={addSkillColumn}
              startIcon={
                isLoading ? <Skeleton width={20} height={20} /> : <AddIcon />
              }
              variant="contained"
              sx={{
                ml: "auto",
                bgcolor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
              }}
              disabled={isLoading}
            >
              Add Skill
            </Button>
          </Box>
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
                {/* <TrendingUpIcon fontSize="small" color="primary" /> */}
                {skillName}
              </MenuItem>
            ))}
        </Menu>

        {/* Enhanced Table */}
        <Box sx={{ position: "relative" }}>
          {/* Fixed Columns */}
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                flexShrink: 0,
                bgcolor: "white",
                borderRight: 1,
                borderColor: "grey.200",
                boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
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
                          width: 140,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {/* <TrendingUpIcon fontSize="small" color="primary" /> */}
                          Total Levels
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          borderRight: 1,
                          borderColor: "grey.200",
                          width: 150,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {/* <TrendingUpIcon fontSize="small" color="success" /> */}
                          Completed
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          borderRight: 1,
                          borderColor: "grey.200",
                          width: 160,
                        }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          borderRight: 1,
                          borderColor: "grey.200",
                          width: 120,
                        }}
                      >
                        Reg No
                      </TableCell>
                      {/* <TableCell sx={{ fontWeight: 'bold', width: 120 }}>
                        Department
                      </TableCell> */}
                    </TableRow>

                    {showColumnFilters && (
                      <TableRow >
                        <TableCell
                          sx={{ borderRight: 1, borderColor: "grey.200" }}
                        ></TableCell>
                        <TableCell
                          sx={{ borderRight: 1, borderColor: "grey.200" }}
                        ></TableCell>
                        <TableCell
                          sx={{ borderRight: 1, borderColor: "grey.200" }}
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
                          sx={{ borderRight: 1, borderColor: "grey.200" }}
                        >
                          <TextField
                            size="small"
                            placeholder="Search reg..."
                            variant="outlined"
                            fullWidth
                            value={columnFilters.regNo}
                            onChange={(e) =>
                              setColumnFilters((prev) => ({
                                ...prev,
                                regNo: e.target.value,
                              }))
                            }
                          />
                        </TableCell>
                        {/* <TableCell>
                          <TextField
                            size="small"
                            placeholder="Search dept..."
                            variant="outlined"
                            fullWidth
                            value={columnFilters.department}
                            onChange={(e) => setColumnFilters(prev => ({ ...prev, department: e.target.value }))}
                          />
                        </TableCell> */}
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
                        }}
                      >
                        <TableCell
                          sx={{ borderRight: 1, borderColor: "grey.200" }}
                        >
                          <LevelBox
                            value={student.totalLevels}
                            type="total"
                            onClick={() => console.log("Total levels clicked")}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ borderRight: 1, borderColor: "grey.200" }}
                        >
                          <LevelBox
                            value={student.completedLevels}
                            type="completed"
                            maxValue={student.totalLevels}
                            onClick={() =>
                              console.log("Completed levels clicked")
                            }
                          />
                        </TableCell>
                        <TableCell
                          sx={{ borderRight: 1, borderColor: "grey.200" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
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
                          sx={{ borderRight: 1, borderColor: "grey.200" }}
                        >
                          <Chip
                            label={student.regNo}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                        {/* <TableCell>
                          <Chip 
                            label={student.department} 
                            size="small"
                            color={student.department === 'CSE' ? 'primary' : 
                                   student.department === 'ECE' ? 'secondary' : 'default'}
                          />
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Scrollable Skills Section */}
            <Box sx={{ flexGrow: 1, overflowX: "auto" }}>
              <TableContainer>
                <Table
                  sx={{
                    borderCollapse: "collapse",
                    minWidth: skillColumns.length * 220,
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
                            width: 220,
                            minWidth: 220,
                            position: "relative",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
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
                                  borderColor: skill.color,
                                  borderRadius: 2,
                                  flex: 1,
                                  "&:hover": {
                                    bgcolor: `${skill.color}15`,
                                    borderColor: skill.color,
                                    transform: "translateY(-1px)",
                                  },
                                }}
                              >
                                <Box sx={{ textAlign: "left", width: "100%" }}>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      fontWeight: "bold",
                                      color: skill.color,
                                    }}
                                  >
                                    {skill.name}
                                  </Typography>
                                  {skill.selectedSkill && (
                                    <Typography
                                      variant="caption"
                                      sx={{ color: "text.secondary" }}
                                    >
                                      {skill.selectedSkill}
                                    </Typography>
                                  )}
                                </Box>
                              </Button>

                              {skillColumns.length > 2 && (
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
                              width: 220,
                              minWidth: 220,
                            }}
                          ></TableCell>
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
                        }}
                      >
                        {skillColumns.map((skill) => (
                          <TableCell
                            key={skill.id}
                            sx={{
                              borderRight: 1,
                              borderColor: "grey.200",
                              textAlign: "center",
                              width: 220,
                              minWidth: 220,
                            }}
                          >
                            {skill.selectedSkill ? (
                              <SkillInput
                                value={student.skillLevels[skill.id]}
                                onChange={(level) =>
                                  updateSkillLevel(student.id, skill.id, level)
                                }
                                skillColor={skill.color}
                              />
                            ) : (
                              <Typography
                                color="text.disabled"
                                sx={{ fontStyle: "italic" }}
                              >
                                Select a skill
                              </Typography>
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

export default StudentSkillsTable;
