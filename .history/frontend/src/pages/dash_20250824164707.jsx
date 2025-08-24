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

// API services commented out for now
// import { studentService } from '../services';
// import { useApiCall } from '../hooks/useApiCall';

const initialStudents = [
  {
    id: 1,
    name: "Jon Snow",
    regNo: "2021CSE001",
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
    name: "Cersei Lannister",
    regNo: "2021IT002",
    department: "IT",
    year: "III",
    totalLevels: 10,
    completedLevels: 9,
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
    name: "Jaime Lannister",
    regNo: "2022ECE003",
    department: "ECE",
    year: "II",
    totalLevels: 10,
    completedLevels: 4,
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
    name: "Arya Stark",
    regNo: "2020EEE004",
    department: "EEE",
    year: "IV",
    totalLevels: 10,
    completedLevels: 10,
    cumulativeRewards: 1500,
    currentSemRewards: 220,
    skills: {
      JavaScript: { level: 10, daysAgo: 999 },
      Python: { level: 9, daysAgo: 1 },
      React: { level: 8, daysAgo: 2 },
    },
  },
  {
    id: 5,
    name: "Daenerys Targaryen",
    regNo: "2021MECH005",
    department: "MECH",
    year: "III",
    totalLevels: 10,
    completedLevels: 6,
    cumulativeRewards: 680,
    currentSemRewards: 95,
    skills: {
      JavaScript: { level: 5, daysAgo: 18 },
      Python: { level: 8, daysAgo: 6 },
      React: { level: 4, daysAgo: 20 },
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

const Dash = () => {
  // Simplified state management - no API for now
  const [students, setStudents] = useState(initialStudents);
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

  // Get days ago color
  const getDaysColor = (days) => {
    if (days <= 3) return "#10b981"; // green-500
    if (days <= 7) return "#84cc16"; // lime-500
    if (days <= 15) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    if (!students || !Array.isArray(students)) return [];

    return students.filter((student) => {
      if (!student || !student.skills) return false;

      if (filters.role !== "all" && filters.role !== "all") return false;
      if (filters.year !== "all" && student.year !== filters.year) return false;
      if (
        filters.department !== "all" &&
        student.department !== filters.department
      )
        return false;

      if (
        nameSearch &&
        !student.name.toLowerCase().includes(nameSearch.toLowerCase())
      )
        return false;
      if (
        regNoSearch &&
        !student.regNo.toLowerCase().includes(regNoSearch.toLowerCase())
      )
        return false;

      if (cumulativeFilter.type !== "all" && cumulativeFilter.value) {
        const value = parseInt(cumulativeFilter.value);
        if (
          cumulativeFilter.type === "equal" &&
          student.cumulativeRewards !== value
        )
          return false;
        if (
          cumulativeFilter.type === "greater" &&
          student.cumulativeRewards <= value
        )
          return false;
        if (
          cumulativeFilter.type === "less" &&
          student.cumulativeRewards >= value
        )
          return false;
      }

      if (currentSemFilter.type !== "all" && currentSemFilter.value) {
        const value = parseInt(currentSemFilter.value);
        if (
          currentSemFilter.type === "equal" &&
          student.currentSemRewards !== value
        )
          return false;
        if (
          currentSemFilter.type === "greater" &&
          student.currentSemRewards <= value
        )
          return false;
        if (
          currentSemFilter.type === "less" &&
          student.currentSemRewards >= value
        )
          return false;
      }

      for (const skillCol of skillColumns) {
        if (skillCol.levelFilter) {
          const skillData = student.skills && student.skills[skillCol.skill];
          const studentLevel = skillData ? skillData.level : 0;
          if (studentLevel !== parseInt(skillCol.levelFilter)) return false;
        }
      }

      return true;
    });
  }, [
    students,
    filters,
    nameSearch,
    regNoSearch,
    cumulativeFilter,
    currentSemFilter,
    skillColumns,
  ]);

  // Sort students
  const sortedStudents = useMemo(() => {
    if (!filteredStudents || !Array.isArray(filteredStudents)) return [];
    if (!sortConfig.key || !sortConfig.direction) return filteredStudents;

    return [...filteredStudents].sort((a, b) => {
      let aVal, bVal;

      if (sortConfig.key === "completedLevels") {
        aVal = a.completedLevels;
        bVal = b.completedLevels;
      } else if (sortConfig.key === "name") {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (sortConfig.key === "regNo") {
        aVal = a.regNo.toLowerCase();
        bVal = b.regNo.toLowerCase();
      } else if (sortConfig.key === "cumulativeRewards") {
        aVal = a.cumulativeRewards;
        bVal = b.cumulativeRewards;
      } else if (sortConfig.key === "currentSemRewards") {
        aVal = a.currentSemRewards;
        bVal = b.currentSemRewards;
      } else if (sortConfig.key.startsWith("skill_")) {
        const skillId = sortConfig.key.replace("skill_", "");
        const skillCol = skillColumns.find((col) => col.id === skillId);
        if (skillCol) {
          aVal = a.skills[skillCol.skill]?.level || 0;
          bVal = b.skills[skillCol.skill]?.level || 0;
        }
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredStudents, sortConfig, skillColumns]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) {
        return { key, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      if (prev.direction === "desc") {
        return { key: null, direction: null };
      }
      return { key, direction: "asc" };
    });
  };

  const addSkillColumn = () => {
    const newId = `skill${skillColumns.length + 1}`;
    setSkillColumns([
      ...skillColumns,
      { id: newId, skill: "", levelFilter: "" },
    ]);
  };

  const updateSkillColumn = async (id, field, value) => {
    setSkillColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, [field]: value } : col))
    );
  };

  const removeSkillColumn = async (id) => {
    try {
      setSkillColumns((prev) => prev.filter((col) => col.id !== id));
      setSnackbar({
        open: true,
        message: "Skill column removed successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to remove skill column",
        severity: "error",
      });
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronDown size={12} color="#9ca3af" />;
    }
    if (sortConfig.direction === "asc") {
      return <ArrowUp size={12} color="#2563eb" />;
    }
    if (sortConfig.direction === "desc") {
      return <ArrowDown size={12} color="#2563eb" />;
    }
    return <ChevronDown size={12} color="#9ca3af" />;
  };

  const styles = {
    // MODIFIED: Changed background color to match the image
    container: {
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#f6f7fb",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      display: "flex",
      flexDirection: "column",
      position: "relative",
      top: "-30px",
    },
    header: {
      padding: "20px 35px",
      borderBottom: "none",
      backgroundColor: "white",
      margin: "0",
    },
    title: {
      fontSize: "36px",
      fontWeight: "600",
      color: "#475569",
      margin: "0 0 8px 0",
      letterSpacing: "-0.025em",
      lineHeight: "1.1",
    },
    filtersContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      padding: "20px",
      margin: "24px 32px 0",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      minWidth: "1600px", // Increased filter container width
    },
    filtersRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "24px",
      maxWidth: "100%",
    },
    filtersLeft: {
      display: "flex",
      alignItems: "center",
      gap: "32px",
      flexWrap: "wrap",
    },
    tableContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      overflow: "hidden",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      margin: "24px 32px",
      flex: "1",
      minWidth: "1600px", // Increased table container width
    },
    tableWrapper: {
      overflowX: "auto",
      width: "100%",
      minWidth: "1600px", // Increased table width
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    thead: {
      backgroundColor: "#f8fafc",
      borderBottom: "1px solid #e2e8f0",
    },
    tbody: {
      backgroundColor: "white",
    },
    tr: {
      borderBottom: "1px solid #f1f5f9",
      transition: "background-color 0.2s",
    },
    td: {
      padding: "16px 32px",
      fontSize: "14px",
      color: "#334155",
      verticalAlign: "middle",
    },
    completedBadge: {
        backgroundColor: '#e0e7ff',
        color: '#4f46e5',
        padding: '8px 16px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'inline-block',
        transition: 'all 0.2s ease-in-out',
        border: '1px solid #c7d2fe'
    },
    nameMain: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#334155",
    },
    rewardPoints: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#3b82f6",
    },
    skillCell: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "4px",
    },
    skillLevelText: {
        fontSize: '14px',
        fontWeight: '600',
        lineHeight: '1.2'
    },
    daysAgo: {
      fontSize: "12px",
    },
  };

  return (
    <div style={styles.container}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <div style={{ ...styles.header, backgroundColor: '#f6f7fb', borderBottom: 'none' ,marginBottom:'-22px' }}>
        <h3 style={styles.title}>Student Skills Dashboard</h3>
      </div>
      
      <div style={styles.filtersContainer}>
        <div style={styles.filtersRow}>
          <div style={styles.filtersLeft}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="role-select-label">ROLE</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={filters.role}
                label="ROLE"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, role: e.target.value }))
                }
                size="small"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="faculty">Faculty</MenuItem>
                <MenuItem value="hod">HOD</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel id="year-select-label">YEAR</InputLabel>
              <Select
                labelId="year-select-label"
                id="year-select"
                value={filters.year}
                label="YEAR"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, year: e.target.value }))
                }
                size="small"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                <MenuItem value="all">All Years</MenuItem>
                <MenuItem value="I">I Year</MenuItem>
                <MenuItem value="II">II Year</MenuItem>
                <MenuItem value="III">III Year</MenuItem>
                <MenuItem value="IV">IV Year</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 230 }}>
              <InputLabel id="department-select-label">DEPARTMENT</InputLabel>
              <Select
                labelId="department-select-label"
                id="department-select"
                value={filters.department}
                label="DEPARTMENT"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    department: e.target.value,
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                <MenuItem value="all">All Departments</MenuItem>
                <MenuItem value="CSE">CSE</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="ECE">ECE</MenuItem>
                <MenuItem value="EEE">EEE</MenuItem>
                <MenuItem value="MECH">MECH</MenuItem>
              </Select>
            </FormControl>
          </div>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addSkillColumn}
            sx={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "12px 20px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#2563eb",
              },
            }}
          >
            Add Skill Column
          </Button>
        </div>
      </div>
      
      <div style={styles.tableContainer}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <TableCell
                  sx={{
                    fontWeight: "600",
                    backgroundColor: "#f8fafc",
                    padding: "16px 24px",
                    fontSize: "14px",
                    color: "#475569",
                    textTransform: "uppercase",
                    width: '120px'
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: 'center'
                    }}
                  >
                    <span>
                      Total
                      <br /> Levels
                    </span>
                  </Box>
                </TableCell>
                
                <TableCell
                  sx={{
                    fontWeight: "600",
                    backgroundColor: "#f8fafc",
                    padding: "16px 32px",
                    fontSize: "14px",
                    color: "#475569",
                    textTransform: "uppercase",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span>Completed</span>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleSort("completedLevels")}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: "5px",
                      transform: "translateY(-50%)",
                    }}
                  >
                    {getSortIcon("completedLevels")}
                  </IconButton>
                </TableCell>
                
                {/* MODIFIED: Changed justifyContent to 'flex-start' for left alignment */}
                <TableCell
                  sx={{
                    fontWeight: "600",
                    backgroundColor: "#f8fafc",
                    padding: "16px 32px",
                    fontSize: "14px",
                    color: "#475569",
                    textTransform: "uppercase",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start", 
                    }}
                  >
                    <span>Name</span>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={handleNameOpen}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: "50px",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <FilterListIcon sx={{ fontSize: "18px" }} />
                  </IconButton>
                  <Popover
                    open={Boolean(nameAnchorEl)}
                    anchorEl={nameAnchorEl}
                    onClose={handleNameClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  >
                    <Box sx={{ p: 2 }}>
                      <TextField
                        placeholder="Search by name..."
                        variant="standard"
                        value={nameSearch}
                        onChange={(e) => setNameSearch(e.target.value)}
                        autoFocus
                      />
                    </Box>
                  </Popover>
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: "600",
                    backgroundColor: "#f8fafc",
                    padding: "16px 32px",
                    fontSize: "14px",
                    color: "#475569",
                    textTransform: "uppercase",
                    position: "relative",
                  }}
                >
                   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <span>Reg No</span>
                   </Box>
                  <IconButton
                    size="small"
                    onClick={handleRegNoOpen}
                     sx={{ position: 'absolute', top: '50%', right: '5px', transform: 'translateY(-50%)' }}
                  >
                    <FilterListIcon sx={{ fontSize: '18px' }} />
                  </IconButton>
                  <Popover
                    open={Boolean(regNoAnchorEl)}
                    anchorEl={regNoAnchorEl}
                    onClose={handleRegNoClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  >
                    <Box sx={{ p: 2 }}>
                       <TextField
                        placeholder="Search by registration number..."
                        variant="outlined"
                        size="small"
                        value={regNoSearch}
                        onChange={(e) => setRegNoSearch(e.target.value)}
                        autoFocus
                      />
                    </Box>
                  </Popover>
                </TableCell>
                
                <TableCell
                   sx={{ fontWeight: '600', backgroundColor: '#f8fafc', padding: '16px 32px', fontSize: '14px', color: '#475569', textTransform: 'uppercase', position: 'relative' }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span>Cumulative</span>
                    <span>Rewards</span>
                  </Box>
                  <IconButton size="small" onClick={handleCumulativeOpen} sx={{ position: 'absolute', top: '50%', right: '-5px', transform: 'translateY(-50%)' }}>
                    <FilterListIcon sx={{ fontSize: '18px' }} />
                  </IconButton>
                   <Popover
                      open={Boolean(cumulativeAnchorEl)}
                      anchorEl={cumulativeAnchorEl}
                      onClose={handleCumulativeClose}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                   >
                     <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                       <Select size="small" value={cumulativePopoverFilter.type} onChange={e => setCumulativePopoverFilter(prev => ({...prev, type: e.target.value}))}>
                          <MenuItem value="all">All</MenuItem>
                          <MenuItem value="equal">Equal to</MenuItem>
                          <MenuItem value="greater">Greater than</MenuItem>
                          <MenuItem value="less">Less than</MenuItem>
                       </Select>
                       <TextField size="small" type="number" placeholder="Value" value={cumulativePopoverFilter.value} onChange={e => setCumulativePopoverFilter(prev => ({...prev, value: e.target.value}))} />
                       <Button size="small" variant="contained" onClick={handleCumulativeApply}>Apply</Button>
                       <Button size="small" variant="outlined" onClick={handleCumulativeClear}>Clear</Button>
                     </Box>
                   </Popover>
                </TableCell>
                
                <TableCell
                   sx={{ fontWeight: '600', backgroundColor: '#f8fafc', padding: '16px 32px', fontSize: '14px', color: '#475569', textTransform: 'uppercase', position: 'relative' }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span>Current Sem</span>
                    <span>Rewards</span>
                  </Box>
                   <IconButton size="small" onClick={handleCurrentSemOpen} sx={{ position: 'absolute', top: '50%', right: '-5px', transform: 'translateY(-50%)' }}>
                     <FilterListIcon sx={{ fontSize: '18px' }} />
                   </IconButton>
                   <Popover
                      open={Boolean(currentSemAnchorEl)}
                      anchorEl={currentSemAnchorEl}
                      onClose={handleCurrentSemClose}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                   >
                     <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                       <Select size="small" value={currentSemPopoverFilter.type} onChange={e => setCurrentSemPopoverFilter(prev => ({...prev, type: e.target.value}))}>
                          <MenuItem value="all">All</MenuItem>
                          <MenuItem value="equal">Equal to</MenuItem>
                          <MenuItem value="greater">Greater than</MenuItem>
                          <MenuItem value="less">Less than</MenuItem>
                       </Select>
                       <TextField size="small" type="number" placeholder="Value" value={currentSemPopoverFilter.value} onChange={e => setCurrentSemPopoverFilter(prev => ({...prev, value: e.target.value}))} />
                       <Button size="small" variant="contained" onClick={handleCurrentSemApply}>Apply</Button>
                       <Button size="small" variant="outlined" onClick={handleCurrentSemClear}>Clear</Button>
                     </Box>
                   </Popover>
                </TableCell>
                
                {skillColumns.map((skillCol) => (
                  <TableCell
                    key={skillCol.id}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f8fafc",
                      padding: "12px 16px",
                      fontSize: "12px",
                      minWidth: "220px",
                    }}
                  >
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto", gridTemplateRows: "auto auto", gap: 1.5, alignItems: "center" }}>
                      <Select value={skillCol.skill} onChange={(e) => updateSkillColumn(skillCol.id, "skill", e.target.value)} displayEmpty size="small">
                        <MenuItem value="" disabled><em>Select Skill</em></MenuItem>
                        {availableSkills.map((skill) => (<MenuItem key={skill} value={skill}>{skill}</MenuItem>))}
                      </Select>
                      <IconButton onClick={() => removeSkillColumn(skillCol.id)} size="small">
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                      <TextField type="number" placeholder="Level" value={skillCol.levelFilter} onChange={(e) => updateSkillColumn( skillCol.id, "levelFilter", e.target.value )} size="small" />
                      <IconButton onClick={() => handleSort(`skill_${skillCol.id}`)} size="small">
                        {sortConfig.key === `skill_${skillCol.id}` && sortConfig.direction === 'desc' ? <ArrowDownwardIcon fontSize="small" /> : <ArrowUpwardIcon fontSize="small" />}
                      </IconButton>
                    </Box>
                  </TableCell>
                ))}
              </tr>
            </thead>

            <tbody style={styles.tbody}>
              {sortedStudents.map((student) => (
                <tr
                  key={student.id}
                  style={styles.tr}
                  onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                      const completedBadge = e.currentTarget.querySelector('.completed-badge-hover');
                      if (completedBadge) {
                          completedBadge.style.backgroundColor = '#4f46e5';
                          completedBadge.style.color = '#ffffff';
                      }
                  }}
                  onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                      const completedBadge = e.currentTarget.querySelector('.completed-badge-hover');
                      if (completedBadge) {
                          completedBadge.style.backgroundColor = '#e0e7ff';
                          completedBadge.style.color = '#4f46e5';
                      }
                  }}
                >
                  <td style={{...styles.td, padding: '16px 24px'}}>{student.totalLevels}</td>
                  <td style={styles.td}>
                    <span style={styles.completedBadge} className="completed-badge-hover">
                      {student.completedLevels}
                    </span>
                  </td>
                  
                  <td style={{ ...styles.td, whiteSpace: 'nowrap' }}>
                    <div style={styles.nameMain}>{student.name}</div>
                  </td>
                  
                  <td style={styles.td}>{student.regNo}</td>
                  <td style={{ ...styles.td, ...styles.rewardPoints }}>
                    {student.cumulativeRewards}
                  </td>
                  <td style={{ ...styles.td, ...styles.rewardPoints, minWidth: '200px' }}>
                    {student.currentSemRewards}
                  </td>

                  {skillColumns.map((skillCol) => {
                    const skillData =
                      student.skills && student.skills[skillCol.skill];
                    if (!skillData)
                      return (
                        <td
                          key={skillCol.id}
                          style={{ ...styles.td, color: "#9ca3af" }}
                        >
                          -
                        </td>
                      );

                    return (
                      <td key={skillCol.id} style={styles.td}>
                        <div style={styles.skillCell}>
                          <span
                            style={{
                              ...styles.skillLevelText,
                              color: getLevelBadgeColor(skillData.level),
                            }}
                          >
                            {`Level ${skillData.level}`}
                          </span>
                          <span
                            style={{
                              ...styles.daysAgo,
                              color: getDaysColor(skillData.daysAgo),
                            }}
                          >
                            {skillData.daysAgo === 999
                              ? "999d ago"
                              : `${skillData.daysAgo}d ago`}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dash;