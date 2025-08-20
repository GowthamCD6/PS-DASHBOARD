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
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FilterListIcon from '@mui/icons-material/FilterList';

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
  const [students] = useState(initialStudents);
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
  const [cumulativePopoverFilter, setCumulativePopoverFilter] = useState({ type: 'all', value: '' });

  // MUI Popover handlers
  const handleCumulativeOpen = (event) => setCumulativeAnchorEl(event.currentTarget);
  const handleCumulativeClose = () => setCumulativeAnchorEl(null);
  const handleCumulativeApply = () => {
    setCumulativeFilter({
      type: cumulativePopoverFilter.type,
      value: cumulativePopoverFilter.value
    });
    handleCumulativeClose();
  };
  const handleCumulativeClear = () => {
    setCumulativePopoverFilter({ type: 'all', value: '' });
    setCumulativeFilter({ type: 'all', value: '' });
    handleCumulativeClose();
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
    return students.filter((student) => {
      // Basic filters
      if (filters.role !== "all" && filters.role !== "all") return false;
      if (filters.year !== "all" && student.year !== filters.year) return false;
      if (
        filters.department !== "all" &&
        student.department !== filters.department
      )
        return false;

      // Search filters
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

      // Reward filters
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

      // Skill filters
      for (const skillCol of skillColumns) {
        if (skillCol.levelFilter) {
          const skillData = student.skills[skillCol.skill];
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

  const updateSkillColumn = (id, field, value) => {
    setSkillColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, [field]: value } : col))
    );
  };

  const removeSkillColumn = (id) => {
    setSkillColumns((prev) => prev.filter((col) => col.id !== id));
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
    container: {
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#f8fafc",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      display: "flex",
      flexDirection: "column",
      position: "relative",
      top: "-30px",
    },
    header: {
      padding: "20px 35px",
      borderBottom: "1px solid #e2e8f0",
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
    filterGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      minWidth: "120px",
    },
    filterLabel: {
      fontSize: "11px",
      fontWeight: "600",
      color: "#64748b",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      marginBottom: "2px",
    },
    select: {
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      padding: "8px 12px",
      fontSize: "14px",
      minWidth: "140px",
      width: "100%",
      backgroundColor: "white",
      cursor: "pointer",
      color: "#334155",
      fontWeight: "500",
      transition: "border-color 0.2s, box-shadow 0.2s",
    },
    addButton: {
      backgroundColor: "#3b82f6",
      color: "white",
      padding: "12px 20px",
      borderRadius: "8px",
      border: "none",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.2s",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    },
    tableContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      overflow: "hidden",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      margin: "24px 32px",
      flex: "1",
    },
    tableWrapper: {
      overflowX: "auto",
      width: "100%",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    thead: {
      backgroundColor: "#f8fafc",
      borderBottom: "1px solid #e2e8f0",
    },
    th: {
      padding: "16px 32px",
      textAlign: "left",
      fontSize: "12px",
      fontWeight: "600",
      color: "#475569",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      borderBottom: "1px solid #e2e8f0",
    },
    thContent: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    sortButton: {
      padding: "4px",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    filterButton: {
      padding: "4px",
      border: "1px solid #d1d5db",
      backgroundColor: "white",
      cursor: "pointer",
      borderRadius: "4px",
      marginLeft: "4px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#6b7280",
      transition: "all 0.2s",
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
      backgroundColor: "#f1f5f9",
      padding: "6px 12px",
      borderRadius: "6px",
      color: "#475569",
      fontSize: "13px",
      fontWeight: "500",
    },
    nameCell: {
      display: "flex",
      flexDirection: "column",
    },
    nameMain: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#334155",
    },
    nameSubtle: {
      fontSize: "13px",
      color: "#64748b",
      marginTop: "2px",
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
    searchPopup: {
      position: "absolute",
      top: "100%",
      left: "0",
      zIndex: 1000,
      backgroundColor: "white",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      padding: "12px",
      minWidth: "200px",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
    searchInputPopup: {
      width: "100%",
      border: "1px solid #2563eb",
      borderRadius: "6px",
      padding: "8px 12px",
      fontSize: "14px",
    },
    modernFilterPopup: {
      position: "absolute",
      top: "calc(100% + 8px)",
      left: 0,
      zIndex: 1000,
      backgroundColor: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      minWidth: "280px",
    },
    modernFilterTitle: {
      fontSize: "16px",
      fontWeight: "500",
      color: "#111827",
      marginBottom: "12px",
    },
    modernFilterRow: {
      display: "flex",
      gap: "12px",
      marginBottom: "12px",
    },
    modernFilterSelect: {
      flex: "1",
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: "white",
      cursor: "pointer",
      outline: "none",
    },
    modernFilterInput: {
      flex: "1",
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px",
      outline: "none",
    },
    modernFilterButtons: {
      display: "flex",
      gap: "8px",
      justifyContent: "flex-end",
    },
    modernClearButton: {
      padding: "8px 16px",
      backgroundColor: "#f9fafb",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer",
      color: "#374151",
    },
    thWithFilter: {
      position: "relative",
    },
    levelBadge: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "600",
      color: "white",
      minWidth: "40px",
    },
    daysAgo: {
      fontSize: "12px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Student Skills Dashboard</h1>
      </div>

      {/* Filters */}
      <div style={styles.filtersContainer}>
        <div style={styles.filtersRow}>
          <div style={styles.filtersLeft}>
            {/* Role Filter */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>ROLE</label>
              <select
                style={styles.select}
                value={filters.role}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, role: e.target.value }))
                }
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              >
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="hod">HOD</option>
              </select>
            </div>

            {/* Year Filter */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>YEAR</label>
              <select
                style={styles.select}
                value={filters.year}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, year: e.target.value }))
                }
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              >
                <option value="all">All Years</option>
                <option value="I">I Year</option>
                <option value="II">II Year</option>
                <option value="III">III Year</option>
                <option value="IV">IV Year</option>
              </select>
            </div>

            {/* Department Filter */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>DEPARTMENT</label>
              <select
                style={{ ...styles.select, minWidth: "160px" }}
                value={filters.department}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              >
                <option value="all">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
              </select>
            </div>
          </div>

          {/* Add Skill Button */}
          <button
            onClick={addSkillColumn}
            style={styles.addButton}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#2563eb")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#3b82f6")
            }
          >
            <Plus size={16} />
            Add Skill Column
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                {/* Total Levels */}
                <th style={styles.th}>Total Levels</th>

                {/* Completed */}
                <th style={{ ...styles.th, ...styles.thWithFilter }}>
                  <div style={styles.thContent}>
                    Completed
                    <button
                      onClick={() => handleSort("completedLevels")}
                      style={styles.sortButton}
                    >
                      {getSortIcon("completedLevels")}
                    </button>
                  </div>
                </th>

                {/* Name */}
                <th style={{ ...styles.th, ...styles.thWithFilter }}>
                  <div style={styles.thContent}>
                    <span>Name</span>

                    {/* This button contains the filter icon */}
                    <button
                      onClick={() => setShowNameSearch(!showNameSearch)}
                      style={styles.filterButton}
                    >
                      <Filter size={12} />
                    </button>
                  </div>

                  {/* This block will appear/disappear when the button is clicked */}
                  {showNameSearch && (
                    <div style={styles.searchPopup} className="filter-popup">
                      <input
                        type="text"
                        placeholder="Search by name..."
                        style={styles.searchInputPopup}
                        value={nameSearch}
                        onChange={(e) => setNameSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                  )}
                </th>

                {/* Reg No */}
                <th style={{ ...styles.th, ...styles.thWithFilter }}>
                  <div style={styles.thContent}>
                    Reg No
                    <button
                      onClick={() => setShowRegNoSearch(!showRegNoSearch)}
                      style={styles.filterButton}
                    >
                      <Filter size={12} />
                    </button>
                  </div>
                  {showRegNoSearch && (
                    <div style={styles.searchPopup} className="filter-popup">
                      <input
                        type="text"
                        placeholder="Search by reg no..."
                        style={styles.searchInputPopup}
                        value={regNoSearch}
                        onChange={(e) => setRegNoSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                  )}
                </th>

                {/* Cumulative Rewards */}
                <th style={{ ...styles.th, ...styles.thWithFilter }}>
                  <div style={styles.thContent}>
                    Cumulative Rewards
                    <button
                      onClick={() =>
                        setShowCumulativeFilter(!showCumulativeFilter)
                      }
                      style={styles.filterButton}
                    >
                      <Filter size={12} />
                    </button>
                  </div>
                  {showCumulativeFilter && (
                    <div style={styles.modernFilterPopup} className="filter-popup">
                      <div style={styles.modernFilterTitle}>
                        Filter cumulative rewards
                      </div>
                      <div style={styles.modernFilterRow}>
                        <select
                          style={styles.modernFilterSelect}
                          value={cumulativeFilter.type}
                          onChange={(e) =>
                            setCumulativeFilter((prev) => ({
                              ...prev,
                              type: e.target.value,
                            }))
                          }
                        >
                          <option value="all">=</option>
                          <option value="equal">=</option>
                          <option value="greater">&gt;</option>
                          <option value="less">&lt;</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Value"
                          style={styles.modernFilterInput}
                          value={cumulativeFilter.value}
                          onChange={(e) =>
                            setCumulativeFilter((prev) => ({
                              ...prev,
                              value: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div style={styles.modernFilterButtons}>
                        <button
                          style={styles.modernClearButton}
                          onClick={() => {
                            setCumulativeFilter({ type: "all", value: "" });
                            setShowCumulativeFilter(false);
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                </th>

                {/* Current Sem Rewards */}
                <th style={{ ...styles.th, ...styles.thWithFilter }}>
                  <div style={styles.thContent}>
                    Current Sem Rewards
                    <button
                      onClick={() =>
                        setShowCurrentSemFilter(!showCurrentSemFilter)
                      }
                      style={styles.filterButton}
                    >
                      <Filter size={12} />
                    </button>
                  </div>
                  {showCurrentSemFilter && (
                    <div style={styles.modernFilterPopup} className="filter-popup">
                      <div style={styles.modernFilterTitle}>
                        Filter current sem rewards
                      </div>
                      <div style={styles.modernFilterRow}>
                        <select
                          style={styles.modernFilterSelect}
                          value={currentSemFilter.type}
                          onChange={(e) =>
                            setCurrentSemFilter((prev) => ({
                              ...prev,
                              type: e.target.value,
                            }))
                          }
                        >
                          <option value="all">=</option>
                          <option value="equal">=</option>
                          <option value="greater">&gt;</option>
                          <option value="less">&lt;</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Value"
                          style={styles.modernFilterInput}
                          value={currentSemFilter.value}
                          onChange={(e) =>
                            setCurrentSemFilter((prev) => ({
                              ...prev,
                              value: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div style={styles.modernFilterButtons}>
                        <button
                          style={styles.modernClearButton}
                          onClick={() => {
                            setCurrentSemFilter({ type: "all", value: "" });
                            setShowCurrentSemFilter(false);
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                </th>

                {/* Skill Columns */}
                {skillColumns.map((skillCol) => (
                  <TableCell
                    key={skillCol.id}
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#f8fafc',
                      padding: '12px 16px',
                      fontSize: '12px',
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid #e2e8f0',
                      // borderLeft: '1px solid #e2e8f0',
                      minWidth: '220px',
                      verticalAlign: 'top',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gridTemplateRows: 'auto auto',
                        gap: 1.5,
                        alignItems: 'center',
                      }}
                    >
                      {/* --- TOP LEFT: Skill Selection --- */}
                      <Select
                        value={skillCol.skill}
                        onChange={(e) => updateSkillColumn(skillCol.id, "skill", e.target.value)}
                        displayEmpty
                        size="small"
                        sx={{
                          gridColumn: '1 / 2',
                          gridRow: '1 / 2',
                          width: '100%',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            '& fieldset': { borderColor: '#d1d5db' },
                            '&:hover fieldset': { borderColor: '#3b82f6' },
                            '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                          },
                          '& .MuiSelect-select': {
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#374151',
                          }
                        }}
                      >
                        <MenuItem value="" disabled sx={{ fontSize: '12px', color: '#9ca3af' }}>
                          <em>Select Skill</em>
                        </MenuItem>
                        {availableSkills.map((skill) => (
                          <MenuItem key={skill} value={skill} sx={{ fontSize: '12px' }}>
                            {skill}
                          </MenuItem>
                        ))}
                      </Select>

                      {/* --- TOP RIGHT: Delete Button --- */}
                      <IconButton
                        onClick={() => removeSkillColumn(skillCol.id)}
                        size="small"
                        sx={{
                          gridColumn: '2 / 3',
                          gridRow: '1 / 2',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          color: '#6b7280',
                          backgroundColor: '#ffffff',
                          width: '34px',
                          height: '34px',
                          '&:hover': {
                            backgroundColor: '#fce7e7',
                            color: '#ef4444',
                            borderColor: '#ef4444',
                          },
                        }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: '16px' }} />
                      </IconButton>

                      {/* --- BOTTOM LEFT: Level Input --- */}
                      <TextField
                        type="number"
                        placeholder="Level"
                        value={skillCol.levelFilter}
                        onChange={(e) => updateSkillColumn(skillCol.id, "levelFilter", e.target.value)}
                        size="small"
                        InputProps={{
                          inputProps: { min: 0, max: 10 },
                          sx: {
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            fontSize: '12px',
                            height: '34px',
                          },
                        }}
                        sx={{
                          gridColumn: '1 / 2',
                          gridRow: '2 / 3',
                          width: '100%',
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#d1d5db' },
                            '&:hover fieldset': { borderColor: '#3b82f6' },
                            '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                          },
                        }}
                      />

                      {/* --- BOTTOM RIGHT: Sort Button --- */}
                      <IconButton
                        onClick={() => handleSort(`skill_${skillCol.id}`)}
                        size="small"
                        sx={{
                          gridColumn: '2 / 3',
                          gridRow: '2 / 3',
                          border: '1px solid',
                          borderColor: sortConfig.key === `skill_${skillCol.id}` ? '#3b82f6' : '#e2e8f0',
                          borderRadius: '8px',
                          color: sortConfig.key === `skill_${skillCol.id}` ? '#3b82f6' : '#6b7280',
                          backgroundColor: '#ffffff',
                          width: '34px',
                          height: '34px',
                          '&:hover': {
                            backgroundColor: '#f3f4f6',
                            color: '#3b82f6',
                            borderColor: '#3b82f6',
                          },
                        }}
                      >
                        {sortConfig.key === `skill_${skillCol.id}` && sortConfig.direction === 'desc' ? (
                          <ArrowDownwardIcon sx={{ fontSize: '16px' }} />
                        ) : (
                          <ArrowUpwardIcon sx={{ fontSize: '16px' }} />
                        )}
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
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f8fafc")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  <td style={styles.td}>{student.totalLevels}</td>
                  <td style={styles.td}>
                    <span style={styles.completedBadge}>
                      {student.completedLevels}/{student.totalLevels}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.nameCell}>
                      <div style={styles.nameMain}>{student.name}</div>
                      <div style={styles.nameSubtle}>
                        {student.department} • {student.year} Year
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>{student.regNo}</td>
                  <td style={{ ...styles.td, ...styles.rewardPoints }}>
                    {student.cumulativeRewards}
                  </td>
                  <td style={{ ...styles.td, ...styles.rewardPoints }}>
                    {student.currentSemRewards}
                  </td>

                  {skillColumns.map((skillCol) => {
                    const skillData = student.skills[skillCol.skill];
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
                              ...styles.levelBadge,
                              backgroundColor: getLevelBadgeColor(
                                skillData.level
                              ),
                            }}
                          >
                            {skillData.level}/10
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
