import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  Filter,
  ArrowUp,
  ArrowDown,
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
    { id: "skill1", skill: "Python", levelFilter: "" },
  ]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Popover states restored
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

  // All handlers restored
  const handleCumulativeOpen = (event) =>
    setCumulativeAnchorEl(event.currentTarget);
  const handleCumulativeClose = () => setCumulativeAnchorEl(null);
  const handleCumulativeApply = () => {
    setCumulativeFilter({ ...cumulativePopoverFilter });
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
    setCurrentSemFilter({ ...currentSemPopoverFilter });
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
  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // Full filter logic restored
  const filteredStudents = useMemo(() => {
    if (!students || !Array.isArray(students)) return [];
    return students.filter((student) => {
      if (!student || !student.skills) return false;
      if (filters.role !== "all" && student.role !== filters.role) return false;
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
        const val = parseInt(cumulativeFilter.value);
        if (
          cumulativeFilter.type === "equal" &&
          student.cumulativeRewards !== val
        )
          return false;
        if (
          cumulativeFilter.type === "greater" &&
          student.cumulativeRewards <= val
        )
          return false;
        if (
          cumulativeFilter.type === "less" &&
          student.cumulativeRewards >= val
        )
          return false;
      }
      if (currentSemFilter.type !== "all" && currentSemFilter.value) {
        const val = parseInt(currentSemFilter.value);
        if (
          currentSemFilter.type === "equal" &&
          student.currentSemRewards !== val
        )
          return false;
        if (
          currentSemFilter.type === "greater" &&
          student.currentSemRewards <= val
        )
          return false;
        if (
          currentSemFilter.type === "less" &&
          student.currentSemRewards >= val
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

  // Full sorting logic restored
  const sortedStudents = useMemo(() => {
    if (!filteredStudents.length) return [];
    if (!sortConfig.key) return filteredStudents;
    return [...filteredStudents].sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key.startsWith("skill_")) {
        const skillId = sortConfig.key.replace("skill_", "");
        const skillCol = skillColumns.find((c) => c.id === skillId);
        if (skillCol) {
          aVal = a.skills[skillCol.skill]?.level || 0;
          bVal = b.skills[skillCol.skill]?.level || 0;
        }
      } else {
        aVal = a[sortConfig.key];
        bVal = b[sortConfig.key];
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredStudents, sortConfig, skillColumns]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return { key: null, direction: null };
    });
  };

  const addSkillColumn = () =>
    setSkillColumns([
      ...skillColumns,
      { id: `skill${Date.now()}`, skill: "", levelFilter: "" },
    ]);
  const updateSkillColumn = (id, field, value) =>
    setSkillColumns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  const removeSkillColumn = (id) =>
    setSkillColumns((prev) => prev.filter((c) => c.id !== id));

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <FilterListIcon sx={{ fontSize: "16px", color: "#9ca3af" }} />;
    if (sortConfig.direction === "asc")
      return <ArrowUpwardIcon sx={{ fontSize: "16px", color: "#2563eb" }} />;
    return <ArrowDownwardIcon sx={{ fontSize: "16px", color: "#2563eb" }} />;
  };

  const styles = {
    container: {
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#f6f7fb",
      fontFamily: "sans-serif",
      padding: "24px 32px",
      boxSizing: "border-box",
    },
    title: {
      fontSize: "28px",
      fontWeight: "600",
      color: "#374151",
      textAlign: "center",
      marginBottom: "24px",
    },
    filtersContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "24px",
      marginBottom: "24px",
      boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.05)",
    },
    filtersRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    filtersLeft: { display: "flex", alignItems: "center", gap: "24px" },
    tableContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.05)",
    },
    tableWrapper: { overflowX: "auto" },
    table: { width: "100%", borderCollapse: "collapse" },
    thead: { backgroundColor: "#f8fafc" },
    th: {
      padding: "16px 24px",
      fontSize: "12px",
      color: "#475569",
      fontWeight: "600",
      textTransform: "uppercase",
      borderBottom: "1px solid #e2e8f0",
    },
    tr: { borderBottom: "1px solid #f1f5f9" },
    td: {
      padding: "16px 24px",
      fontSize: "14px",
      color: "#334155",
      verticalAlign: "middle",
    },
    completedBadge: {
      backgroundColor: "#e9e7fd",
      color: "#4f46e5",
      padding: "6px 14px",
      borderRadius: "6px",
      fontWeight: "600",
      display: "inline-block",
    },
    nameMain: { fontSize: "14px", fontWeight: "500", color: "#334155" },
    rewardPoints: { fontSize: "14px", fontWeight: "600", color: "#3b82f6" },
    skillCell: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "4px",
    },
    skillLevelText: { fontSize: "14px", fontWeight: "600" },
    daysAgo: { fontSize: "12px" },
  };

  return (
    <div style={styles.container}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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

      <h1 style={styles.title}>Student Skills Dashboard</h1>

      <div style={styles.filtersContainer}>
        <div style={styles.filtersRow}>
          <div style={styles.filtersLeft}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>ROLE</InputLabel>
              <Select
                value={filters.role}
                label="ROLE"
                onChange={(e) =>
                  setFilters((p) => ({ ...p, role: e.target.value }))
                }
              >
                <MenuItem value="all">All Roles</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>YEAR</InputLabel>
              <Select
                value={filters.year}
                label="YEAR"
                onChange={(e) =>
                  setFilters((p) => ({ ...p, year: e.target.value }))
                }
              >
                <MenuItem value="all">All Years</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>DEPARTMENT</InputLabel>
              <Select
                value={filters.department}
                label="DEPARTMENT"
                onChange={(e) =>
                  setFilters((p) => ({ ...p, department: e.target.value }))
                }
              >
                <MenuItem value="all">All Departments</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addSkillColumn}
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
                <TableCell align="center" style={styles.th}>
                  Total Levels
                </TableCell>
                <TableCell align="center" style={styles.th}>
                  Completed
                </TableCell>
                <TableCell align="center" style={styles.th}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <span>Name</span>
                    <IconButton size="small" onClick={handleNameOpen}>
                      <FilterListIcon sx={{ fontSize: "16px" }} />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="center" style={styles.th}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <span>Reg No</span>
                    <IconButton size="small" onClick={handleRegNoOpen}>
                      <FilterListIcon sx={{ fontSize: "16px" }} />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="center" style={styles.th}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: "600",
                        textTransform: "uppercase",
                        textAlign: "center",
                      }}
                    >
                      Cumulative
                      <br />
                      Rewards
                    </Typography>
                    <IconButton size="small" onClick={handleCumulativeOpen}>
                      <FilterListIcon sx={{ fontSize: "16px" }} />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="center" style={styles.th}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: "600",
                        textTransform: "uppercase",
                        textAlign: "center",
                      }}
                    >
                      Current Sem
                      <br />
                      Rewards
                    </Typography>
                    <IconButton size="small" onClick={handleCurrentSemOpen}>
                      <FilterListIcon sx={{ fontSize: "16px" }} />
                    </IconButton>
                  </Box>
                </TableCell>

                {skillColumns.map((skillCol) => (
                  <TableCell key={skillCol.id} style={styles.th}>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: 1.5,
                        alignItems: "center",
                      }}
                    >
                      <Select
                        value={skillCol.skill}
                        onChange={(e) =>
                          updateSkillColumn(
                            skillCol.id,
                            "skill",
                            e.target.value
                          )
                        }
                        size="small"
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          <em>Skill</em>
                        </MenuItem>
                        {availableSkills.map((s) => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </Select>
                      <IconButton
                        onClick={() => removeSkillColumn(skillCol.id)}
                        size="small"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                      <TextField
                        placeholder="Level"
                        value={skillCol.levelFilter}
                        onChange={(e) =>
                          updateSkillColumn(
                            skillCol.id,
                            "levelFilter",
                            e.target.value
                          )
                        }
                        size="small"
                        type="number"
                      />
                      <IconButton
                        onClick={() => handleSort(`skill_${skillCol.id}`)}
                        size="small"
                      >
                        {getSortIcon(`skill_${skillCol.id}`)}
                      </IconButton>
                    </Box>
                  </TableCell>
                ))}
              </tr>
            </thead>

            <tbody style={styles.tbody}>
              {sortedStudents.map((student) => (
                <tr key={student.id} style={styles.tr} hover>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    {student.totalLevels}
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <span style={styles.completedBadge}>
                      {student.completedLevels}
                    </span>
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div style={styles.nameMain}>{student.name}</div>
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    {student.regNo}
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...styles.rewardPoints,
                      textAlign: "center",
                    }}
                  >
                    {student.cumulativeRewards}
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...styles.rewardPoints,
                      textAlign: "center",
                    }}
                  >
                    {student.currentSemRewards}
                  </td>

                  {skillColumns.map((skillCol) => {
                    const skillData =
                      student.skills && student.skills[skillCol.skill];
                    return (
                      <td
                        key={skillCol.id}
                        style={{ ...styles.td, textAlign: "center" }}
                      >
                        {skillData ? (
                          <div style={styles.skillCell}>
                            <span
                              style={{
                                ...styles.skillLevelText,
                                color: getLevelBadgeColor(skillData.level),
                              }}
                            >{`Level ${skillData.level}`}</span>
                            <span
                              style={{
                                ...styles.daysAgo,
                                color: getDaysColor(skillData.daysAgo),
                              }}
                            >{`${skillData.daysAgo}d ago`}</span>
                          </div>
                        ) : (
                          "-"
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

      {/* Popovers restored with full functionality */}
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
      <Popover
        open={Boolean(regNoAnchorEl)}
        anchorEl={regNoAnchorEl}
        onClose={handleRegNoClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2 }}>
          <TextField
            placeholder="Search by Reg No..."
            variant="standard"
            value={regNoSearch}
            onChange={(e) => setRegNoSearch(e.target.value)}
            autoFocus
          />
        </Box>
      </Popover>
      <Popover
        open={Boolean(cumulativeAnchorEl)}
        anchorEl={cumulativeAnchorEl}
        onClose={handleCumulativeClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Box sx={{ p: 2, display: "grid", gap: 2, width: 280 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Select
              size="small"
              value={cumulativePopoverFilter.type}
              onChange={(e) =>
                setCumulativePopoverFilter((p) => ({
                  ...p,
                  type: e.target.value,
                }))
              }
              sx={{ flex: 1 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="equal">Equal to</MenuItem>
              <MenuItem value="greater">Greater than</MenuItem>
              <MenuItem value="less">Less than</MenuItem>
            </Select>
            <TextField
              size="small"
              type="number"
              placeholder="Value"
              value={cumulativePopoverFilter.value}
              onChange={(e) =>
                setCumulativePopoverFilter((p) => ({
                  ...p,
                  value: e.target.value,
                }))
              }
              sx={{ flex: 1 }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button size="small" onClick={handleCumulativeClear}>
              Clear
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleCumulativeApply}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
      <Popover
        open={Boolean(currentSemAnchorEl)}
        anchorEl={currentSemAnchorEl}
        onClose={handleCurrentSemClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Box sx={{ p: 2, display: "grid", gap: 2, width: 280 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Select
              size="small"
              value={currentSemPopoverFilter.type}
              onChange={(e) =>
                setCurrentSemPopoverFilter((p) => ({
                  ...p,
                  type: e.target.value,
                }))
              }
              sx={{ flex: 1 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="equal">Equal to</MenuItem>
              <MenuItem value="greater">Greater than</MenuItem>
              <MenuItem value="less">Less than</MenuItem>
            </Select>
            <TextField
              size="small"
              type="number"
              placeholder="Value"
              value={currentSemPopoverFilter.value}
              onChange={(e) =>
                setCurrentSemPopoverFilter((p) => ({
                  ...p,
                  value: e.target.value,
                }))
              }
              sx={{ flex: 1 }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button size="small" onClick={handleCurrentSemClear}>
              Clear
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleCurrentSemApply}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </div>
  );
};

export default Dash;
