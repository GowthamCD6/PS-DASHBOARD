import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  Filter,
  ArrowUp,
  ArrowDown,
  X,
  Target,
} from "lucide-react";
import {
  TableCell,
  Box,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Popover,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";

// Initial mentee data (students under this mentor)
const initialMentees = [
  {
    id: 1,
    name: "Rahul Sharma",
    regNo: "7376242CSE163",
    department: "CSE",
    year: "III",
    totalLevels: 10,
    completedLevels: 7,
    cumulativeRewards: 850,
    currentSemRewards: 120,
    skills: {
      JavaScript: { level: 8, daysAgo: 3 },
      Python: { level: 6, daysAgo: 7 },
      React: { level: 7, daysAgo: 5 },
    },
  },
  {
    id: 2,
    name: "Priya Gupta",
    regNo: "7376243CSE164",
    department: "CSE", 
    year: "III",
    totalLevels: 8,
    completedLevels: 6,
    cumulativeRewards: 1200,
    currentSemRewards: 180,
    skills: {
      JavaScript: { level: 9, daysAgo: 1 },
      Python: { level: 8, daysAgo: 2 },
      React: { level: 6, daysAgo: 4 },
    },
  },
  {
    id: 3,
    name: "Amit Singh",
    regNo: "7376244CSE165",
    department: "CSE",
    year: "III",
    totalLevels: 12,
    completedLevels: 9,
    cumulativeRewards: 420,
    currentSemRewards: 65,
    skills: {
      JavaScript: { level: 5, daysAgo: 12 },
      Python: { level: 4, daysAgo: 15 },
      React: { level: 3, daysAgo: 18 },
    },
  },
  {
    id: 4,
    name: "Sneha Patel",
    regNo: "7376245CSE166",
    department: "CSE",
    year: "III",
    totalLevels: 15,
    completedLevels: 12,
    cumulativeRewards: 1500,
    currentSemRewards: 220,
    skills: {
      JavaScript: { level: 10, daysAgo: 999 },
      Python: { level: 9, daysAgo: 1 },
      React: { level: 8, daysAgo: 2 },
    },
  },
];

const availableSkills = [
  "JavaScript",
  "Python",
  "React",
  "Java",
  "C++",
  "Node.js",
  "Angular",
  "Vue.js",
];


const MenteeDashboard = () => {
  // State management
  const [mentees, setMentees] = useState(initialMentees);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [filters, setFilters] = useState({
    role: "all",
    year: "all",
    department: "all",
  });

  const [nameSearch, setNameSearch] = useState("");
  const [regNoSearch, setRegNoSearch] = useState("");
  const [cumulativeFilter, setCumulativeFilter] = useState({
    type: "all",
    value: "",
  });
  const [currentSemFilter, setCurrentSemFilter] = useState({
    type: "all",
    value: "",
  });

  const [skillColumns, setSkillColumns] = useState([
    { id: "skill1", skill: "JavaScript", levelFilter: "" },
    { id: "skill2", skill: "Python", levelFilter: "" },
  ]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [showNameSearch, setShowNameSearch] = useState(false);
  const [showRegNoSearch, setShowRegNoSearch] = useState(false);
  const [showCumulativeFilter, setShowCumulativeFilter] = useState(false);
  const [showCurrentSemFilter, setShowCurrentSemFilter] = useState(false);

  // MUI Popover states
  const [cumulativeAnchorEl, setCumulativeAnchorEl] = useState(null);
  const [cumulativePopoverFilter, setCumulativePopoverFilter] = useState({
    type: "all",
    value: "",
  });
  const [currentSemAnchorEl, setCurrentSemAnchorEl] = useState(null);
  const [currentSemPopoverFilter, setCurrentSemPopoverFilter] = useState({
    type: "all",
    value: "",
  });
  const [nameAnchorEl, setNameAnchorEl] = useState(null);
  const [regNoAnchorEl, setRegNoAnchorEl] = useState(null);

  // MUI Popover handlers
  const handleCumulativeOpen = (event) =>
    setCumulativeAnchorEl(event.currentTarget);
  const handleCumulativeClose = () => setCumulativeAnchorEl(null);
  const handleCumulativeApply = () => {
    setCumulativeFilter({
      type: cumulativePopoverFilter.type,
      value: cumulativePopoverFilter.value,
    });
    handleCumulativeClose();
  };
  const handleCumulativeClear = () => {
    setCumulativePopoverFilter({ type: "all", value: "" });
    setCumulativeFilter({ type: "all", value: "" });
    handleCumulativeClose();
  };

  const handleCurrentSemOpen = (event) =>
    setCurrentSemAnchorEl(event.currentTarget);
  const handleCurrentSemClose = () => setCurrentSemAnchorEl(null);
  const handleCurrentSemApply = () => {
    setCurrentSemFilter({
      type: currentSemPopoverFilter.type,
      value: currentSemPopoverFilter.value,
    });
    handleCurrentSemClose();
  };
  const handleCurrentSemClear = () => {
    setCurrentSemPopoverFilter({ type: "all", value: "" });
    setCurrentSemFilter({ type: "all", value: "" });
    handleCurrentSemClose();
  };

  const handleNameOpen = (event) => setNameAnchorEl(event.currentTarget);
  const handleNameClose = () => setNameAnchorEl(null);

  const handleRegNoOpen = (event) => setRegNoAnchorEl(event.currentTarget);
  const handleRegNoClose = () => setRegNoAnchorEl(null);

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".filter-popup")) {
        setShowNameSearch(false);
        setShowRegNoSearch(false);
        setShowCumulativeFilter(false);
        setShowCurrentSemFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get level badge color
  const getLevelBadgeColor = (level) => {
    if (level >= 9) return "#059669"; // emerald-600
    if (level >= 7) return "#16a34a"; // green-600
    if (level >= 5) return "#ca8a04"; // yellow-600
    if (level >= 3) return "#ea580c"; // orange-600
    return "#dc2626"; // red-600
  };

  // Get days ago color with mild colors
  const getDaysColor = (days) => {
    if (days <= 5) return { bg: "#dcfce7", text: "#22c55e" }; // mild green
    if (days <= 10) return { bg: "#fed7aa", text: "#ea580c" }; // mild orange
    return { bg: "#fecaca", text: "#dc2626" }; // mild red
  };

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