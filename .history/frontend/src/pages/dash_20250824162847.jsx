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
        
      // Reward and skill filters logic...
      return true;
    });
  }, [students, filters, nameSearch, regNoSearch, cumulativeFilter, currentSemFilter, skillColumns]);

  // Sort students
  const sortedStudents = useMemo(() => {
    if (!filteredStudents || !Array.isArray(filteredStudents)) return [];
    if (!sortConfig.key || !sortConfig.direction) return filteredStudents;

    return [...filteredStudents].sort((a, b) => {
      let aVal, bVal;
      // Sorting logic for different columns...
      if (sortConfig.key === 'name') {
          aVal = a.name;
          bVal = b.name;
      }
      // ... other sorting cases

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredStudents, sortConfig, skillColumns]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      if (prev.direction === "desc") return { key: null, direction: null };
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

  const updateSkillColumn = (id, field, value) => {
    setSkillColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, [field]: value } : col))
    );
  };

  const removeSkillColumn = (id) => {
    setSkillColumns((prev) => prev.filter((col) => col.id !== id));
    setSnackbar({ open: true, message: "Skill column removed", severity: "success" });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FilterListIcon sx={{ fontSize: "18px", color: '#9ca3af' }} />;
    if (sortConfig.direction === "asc") return <ArrowUpwardIcon sx={{ fontSize: "16px", color: "#2563eb" }} />;
    if (sortConfig.direction === "desc") return <ArrowDownwardIcon sx={{ fontSize: "16px", color: "#2563eb" }} />;
    return <FilterListIcon sx={{ fontSize: "18px", color: '#9ca3af' }} />;
  };

  const styles = {
    // MODIFIED: Page background color
    container: {
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#f6f7fb", 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: "24px 32px",
    },
    // MODIFIED: Styles for the main title
    title: {
      fontSize: "28px",
      fontWeight: "600",
      color: "#475569",
      textAlign: "center",
      marginBottom: "24px",
    },
    filtersContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "24px",
      marginBottom: '24px',
      boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.05)",
    },
    filtersRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    filtersLeft: {
      display: "flex",
      alignItems: "center",
      gap: "24px",
    },
    tableContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.05)",
    },
    tableWrapper: {
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    thead: {
      backgroundColor: "#f8fafc",
    },
    tr: {
      borderBottom: "1px solid #f1f5f9",
    },
    td: {
      padding: "16px 24px",
      fontSize: "14px",
      color: "#334155",
      verticalAlign: "middle",
    },
    completedBadge: {
        backgroundColor: '#e9e7fd',
        color: '#4f46e5',
        padding: '8px 16px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'inline-block',
        transition: 'all 0.2s ease-in-out',
    },
    nameMain: {
      fontSize: "14px",
      fontWeight: '500',
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
    },
    daysAgo: {
      fontSize: "12px",
    },
  };

  return (
    <div style={styles.container}>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      {/* MODIFIED: Title is now outside of any white container */}
      <h1 style={styles.title}>Student Skills Dashboard</h1>
      
      <div style={styles.filtersContainer}>
        <div style={styles.filtersRow}>
          <div style={styles.filtersLeft}>
            {/* Filter Controls */}
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>ROLE</InputLabel>
              <Select value={filters.role} label="ROLE" onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value }))}>
                <MenuItem value="all">All Roles</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 140 }} size="small">
              <InputLabel>YEAR</InputLabel>
              <Select value={filters.year} label="YEAR" onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value }))}>
                 <MenuItem value="all">All Years</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 230 }} size="small">
              <InputLabel>DEPARTMENT</InputLabel>
              <Select value={filters.department} label="DEPARTMENT" onChange={(e) => setFilters((prev) => ({...prev, department: e.target.value}))}>
                <MenuItem value="all">All Departments</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Button variant="contained" startIcon={<AddIcon />} onClick={addSkillColumn}>
            Add Skill Column
          </Button>
        </div>
      </div>
      
      <div style={styles.tableContainer}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                {/* Table Headers */}
                <TableCell align="center">TOTAL LEVELS</TableCell>
                <TableCell align="center">COMPLETED</TableCell>
                
                {/* MODIFIED: Header text is centered, icon is positioned next to it */}
                <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <span>NAME</span>
                        <IconButton size="small" onClick={handleNameOpen}>{getSortIcon('name')}</IconButton>
                    </Box>
                </TableCell>
                
                <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <span>REG NO</span>
                        <IconButton size="small" onClick={handleRegNoOpen}>{getSortIcon('regNo')}</IconButton>
                    </Box>
                </TableCell>

                <TableCell align="center">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                        <span>CUMULATIVE</span>
                        <span>REWARDS</span>
                    </Box>
                </TableCell>
                 <TableCell align="center">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                        <span>CURRENT SEM</span>
                        <span>REWARDS</span>
                    </Box>
                </TableCell>

                {skillColumns.map((skillCol) => (
                  <TableCell key={skillCol.id}>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 1 }}>
                      <Select value={skillCol.skill} onChange={(e) => updateSkillColumn(skillCol.id, "skill", e.target.value)} size="small">
                        {availableSkills.map((skill) => <MenuItem key={skill} value={skill}>{skill}</MenuItem>)}
                      </Select>
                      <IconButton onClick={() => removeSkillColumn(skillCol.id)} size="small"><DeleteOutlineIcon/></IconButton>
                      <TextField placeholder="Level" value={skillCol.levelFilter} onChange={(e) => updateSkillColumn(skillCol.id, "levelFilter", e.target.value)} size="small"/>
                      <IconButton onClick={() => handleSort(`skill_${skillCol.id}`)} size="small">{getSortIcon(`skill_${skillCol.id}`)}</IconButton>
                    </Box>
                  </TableCell>
                ))}
              </tr>
            </thead>

            <tbody style={styles.tbody}>
              {sortedStudents.map((student) => (
                <tr key={student.id} style={styles.tr} hover>
                  <td style={{...styles.td, textAlign: 'center'}}>{student.totalLevels}</td>
                  <td style={{...styles.td, textAlign: 'center'}}>
                    <span style={styles.completedBadge} className="completed-badge-hover">{student.completedLevels}</span>
                  </td>
                  
                  {/* MODIFIED: Text is now left-aligned */}
                  <td style={{ ...styles.td, textAlign: 'left' }}>
                    <div style={styles.nameMain}>{student.name}</div>
                  </td>
                  
                  <td style={{ ...styles.td, textAlign: 'center' }}>{student.regNo}</td>
                  <td style={{ ...styles.td, ...styles.rewardPoints, textAlign: 'center' }}>{student.cumulativeRewards}</td>
                  <td style={{ ...styles.td, ...styles.rewardPoints, textAlign: 'center' }}>{student.currentSemRewards}</td>

                  {skillColumns.map((skillCol) => {
                    const skillData = student.skills && student.skills[skillCol.skill];
                    return (
                      <td key={skillCol.id} style={styles.td}>
                        {skillData ? (
                           <div style={styles.skillCell}>
                             <span style={{ ...styles.skillLevelText, color: getLevelBadgeColor(skillData.level) }}>
                               {`Level ${skillData.level}`}
                             </span>
                             <span style={{ ...styles.daysAgo, color: getDaysColor(skillData.daysAgo) }}>
                               {`${skillData.daysAgo}d ago`}
                             </span>
                           </div>
                        ) : (
                          <span style={{color: '#9ca3af'}}>-</span>
                        )}
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