import React, { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Menu,
  TextField,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  ArrowDropDown as ArrowDropDownIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";

const initialRows = [
  {
    id: 1,
    lastName: "Snow",
    firstName: "Jon",
    age: 35,
    regNo: "111",
    department: "CSE",
    year: "I",
    totalLevels: 10,
    completedLevels: 5,
    skillLevels: { JavaScript: 8, Python: 6, React: 7 },
  },
  {
    id: 2,
    lastName: "Lannister",
    firstName: "Cersei",
    age: 42,
    regNo: "222",
    department: "IT",
    year: "II",
    totalLevels: 10,
    completedLevels: 8,
    skillLevels: { JavaScript: 9, Python: 8, React: 6 },
  },
  {
    id: 3,
    lastName: "Lannister",
    firstName: "Jaime",
    age: 45,
    regNo: "333",
    department: "ECE",
    year: "III",
    totalLevels: 10,
    completedLevels: 2,
    skillLevels: { JavaScript: 5, Python: 4, React: 3 },
  },
  {
    id: 4,
    lastName: "Stark",
    firstName: "Arya",
    age: 16,
    regNo: "444",
    department: "EEE",
    year: "IV",
    totalLevels: 10,
    completedLevels: 10,
    skillLevels: { JavaScript: 10, Python: 9, React: 8 },
  },
  {
    id: 5,
    lastName: "Targaryen",
    firstName: "Daenerys",
    age: null,
    regNo: "555",
    department: "MECH",
    year: "I",
    totalLevels: 10,
    completedLevels: 7,
    skillLevels: { JavaScript: 7, Python: 8, React: 6 },
  },
  {
    id: 6,
    lastName: "Melisandre",
    firstName: null,
    age: 150,
    regNo: "666",
    department: "CSE",
    year: "II",
    totalLevels: 10,
    completedLevels: 1,
    skillLevels: { JavaScript: 3, Python: 2, React: 1 },
  },
  {
    id: 7,
    lastName: "Clifford",
    firstName: "Ferrara",
    age: 44,
    regNo: "777",
    department: "IT",
    year: "III",
    totalLevels: 10,
    completedLevels: 4,
    skillLevels: { JavaScript: 6, Python: 5, React: 4 },
  },
  {
    id: 8,
    lastName: "Frances",
    firstName: "Rossini",
    age: 36,
    regNo: "888",
    department: "ECE",
    year: "IV",
    totalLevels: 10,
    completedLevels: 9,
    skillLevels: { JavaScript: 9, Python: 8, React: 9 },
  },
  {
    id: 9,
    lastName: "Roxie",
    firstName: "Harvey",
    age: 65,
    regNo: "999",
    department: "EEE",
    year: "I",
    totalLevels: 10,
    completedLevels: 6,
    skillLevels: { JavaScript: 7, Python: 6, React: 5 },
  },
];

const StudentSkillsGrid = () => {
  const [filters, setFilters] = useState({
    role: "",
    year: "",
    department: "",
  });
  const [students, setStudents] = useState(initialRows);
  const [skillColumns, setSkillColumns] = useState([
    { id: "skill_1", name: "JavaScript", selectedSkill: "JavaScript" },
    { id: "skill_2", name: "Python", selectedSkill: "Python" },
    { id: "skill_3", name: "React", selectedSkill: "React" },
  ]);
  const [skillFilters, setSkillFilters] = useState({});
  const [availableSkills, setAvailableSkills] = useState([
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "React",
    "Node.js",
  ]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSkillColId, setSelectedSkillColId] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillLevelFilter = (skillId, level) => {
    setSkillFilters((prev) => ({
      ...prev,
      [skillId]: level === "" ? undefined : parseInt(level),
    }));
  };

  const addSkillColumn = () => {
    const newSkillId = `skill_${skillColumns.length + 1}`;
    setSkillColumns([
      ...skillColumns,
      {
        id: newSkillId,
        name: `Skill ${skillColumns.length + 1}`,
        selectedSkill: "",
      },
    ]);
  };

  const handleOpenMenu = (event, colId) => {
    setAnchorEl(event.currentTarget);
    setSelectedSkillColId(colId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedSkillColId(null);
  };

  const handleSkillSelect = (skillName) => {
    setSkillColumns((prev) =>
      prev.map((col) =>
        col.id === selectedSkillColId
          ? { ...col, selectedSkill: skillName }
          : col
      )
    );
    handleCloseMenu();
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Basic filters
      const basicFilter =
        (filters.year ? student.year === filters.year : true) &&
        (filters.department ? student.department === filters.department : true);

      // Skill level filters
      const skillFilter = Object.entries(skillFilters).every(
        ([skillId, minLevel]) => {
          if (minLevel === undefined) return true;
          const skillCol = skillColumns.find((col) => col.id === skillId);
          if (!skillCol || !skillCol.selectedSkill) return true;
          const studentLevel =
            student.skillLevels?.[skillCol.selectedSkill] || 0;
          return studentLevel >= minLevel;
        }
      );

      return basicFilter && skillFilter;
    });
  }, [students, filters, skillFilters, skillColumns]);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        field: "totalLevels",
        headerName: "Total Levels",
        width: 120,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "completedLevels",
        headerName: "Completed",
        width: 120,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "name",
        headerName: "Name",
        width: 150,
        valueGetter: (value, row) =>
          `${row.firstName || ""} ${row.lastName || ""}`,
      },
      { field: "regNo", headerName: "Reg No", width: 120 },
    ];

    const dynamicSkillColumns = skillColumns.map((skillCol) => ({
      field: skillCol.id,
      headerName: skillCol.selectedSkill || skillCol.name,
      width: 180,
      sortable: true,
      type: "number",
      renderHeader: () => (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
              {skillCol.selectedSkill || skillCol.name}
            </Typography>
            <Button
              size="small"
              onClick={(e) => handleOpenMenu(e, skillCol.id)}
              endIcon={<ArrowDropDownIcon />}
            ></Button>
          </Box>
          {skillCol.selectedSkill && (
            <TextField
              size="small"
              type="number"
              placeholder="Min level"
              inputProps={{ min: 0, max: 10 }}
              value={skillFilters[skillCol.id] || ""}
              onChange={(e) =>
                handleSkillLevelFilter(skillCol.id, e.target.value)
              }
              sx={{
                width: "100%",
                "& .MuiInputBase-input": {
                  fontSize: "0.75rem",
                  padding: "4px 8px",
                },
              }}
            />
          )}
        </Box>
      ),
      valueGetter: (value, row) =>
        row.skillLevels?.[skillCol.selectedSkill] || 0,
      align: "center",
      headerAlign: "center",
    }));

    return [...baseColumns, ...dynamicSkillColumns];
  }, [skillColumns]);

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Title outside the table */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mb: 3, color: "primary.main", mt: -3 }}
      >
        Student Skills Dashboard
      </Typography>

      {/* Filters and Add Button outside the table */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          mb: 3,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          <FormControl size="small" sx={{ width: 150, height: 40 }}>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={filters.role}
              label="Role"
              onChange={handleFilterChange}
              sx={{ height: 40, display: "flex", alignItems: "center" }}
            >
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value="HOD">HOD</MenuItem>
              <MenuItem value="faculty">Faculty</MenuItem>
              <MenuItem value="student">Student</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ width: 150, height: 40 }}>
            <InputLabel>Year</InputLabel>
            <Select
              name="year"
              value={filters.year}
              label="Year"
              onChange={handleFilterChange}
              sx={{ height: 40, display: "flex", alignItems: "center" }}
            >
              <MenuItem value="">All Years</MenuItem>
              <MenuItem value="I">I Year</MenuItem>
              <MenuItem value="II">II Year</MenuItem>
              <MenuItem value="III">III Year</MenuItem>
              <MenuItem value="IV">IV Year</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ width: 150, height: 40 }}>
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={filters.department}
              label="Department"
              onChange={handleFilterChange}
              sx={{ height: 40, display: "flex", alignItems: "center" }}
            >
              <MenuItem value="">All Departments</MenuItem>
              <MenuItem value="CSE">CSE</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="ECE">ECE</MenuItem>
              <MenuItem value="EEE">EEE</MenuItem>
              <MenuItem value="MECH">MECH</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addSkillColumn}
          sx={{ height: 40, minWidth: 120 }}
        >
          Add Skill
        </Button>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {availableSkills
          .filter(
            (skill) =>
              !skillColumns.some(
                (col) =>
                  col.selectedSkill === skill && col.id !== selectedSkillColId
              )
          )
          .map((skill) => (
            <MenuItem key={skill} onClick={() => handleSkillSelect(skill)}>
              {skill}
            </MenuItem>
          ))}
      </Menu>

      {/* Table takes remaining space */}
      <Paper sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <DataGrid
            rows={filteredStudents}
            columns={columns}
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            disableRowSelectionOnClick
            sortingOrder={["asc", "desc"]}
            columnVisibilityModel={{
              id: false,
            }}
            sx={{ border: 0 }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentSkillsGrid;
