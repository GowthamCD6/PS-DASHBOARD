import React, { useState } from 'react';
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
  IconButton,
  Menu,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Add as AddIcon, FilterList as FilterListIcon, ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material';

const StudentSkillsTable = () => {
  const [filters, setFilters] = useState({
    role: '',
    year: ''
  });

  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState({
    name: '',
    regNo: '',
    department: ''
  });

  // For dropdown menus
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSkillId, setSelectedSkillId] = useState(null);

  // Dynamic skills starting with Skill1 and Skill2
  const [skillColumns, setSkillColumns] = useState([
    { id: 'skill1', name: 'Skill 1', selectedSkill: '' },
    { id: 'skill2', name: 'Skill 2', selectedSkill: '' }
  ]);

  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Ram',
      regNo: '737642',
      department: 'CSE',
      totalLevels: 10,
      completedLevels: 5,
      skillLevels: {} // Will store skill completion levels
    },
    {
      id: 2,
      name: 'John Doe',
      regNo: '737643',
      department: 'ECE',
      totalLevels: 8,
      completedLevels: 6,
      skillLevels: {}
    },
    {
      id: 3,
      name: 'Jane Smith',
      regNo: '737644',
      department: 'IT',
      totalLevels: 12,
      completedLevels: 9,
      skillLevels: {}
    }
  ]);

  const availableSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'C', 'React', 'Angular', 'Vue.js', 'Node.js',
    'Django', 'Spring', 'Express.js', 'MongoDB', 'MySQL', 'PostgreSQL', 'HTML', 'CSS',
    'PHP', 'Ruby', 'Go', 'Rust', 'TypeScript', 'Swift', 'Kotlin'
  ];

  // Add new skill column
  const addSkillColumn = () => {
    const nextSkillNumber = skillColumns.length + 1;
    const newSkill = {
      id: `skill${nextSkillNumber}`,
      name: `Skill ${nextSkillNumber}`,
      selectedSkill: ''
    };
    setSkillColumns([...skillColumns, newSkill]);
  };

  // Update skill selection for a column
  const updateSkillColumn = (skillId, selectedSkill) => {
    setSkillColumns(prev => 
      prev.map(skill => 
        skill.id === skillId ? { ...skill, selectedSkill } : skill
      )
    );
    
    // Reset all student levels for this skill
    setStudents(prev => 
      prev.map(student => ({
        ...student,
        skillLevels: {
          ...student.skillLevels,
          [skillId]: 0
        }
      }))
    );
    
    // Close the menu
    handleCloseMenu();
  };

  // Handle menu open
  const handleOpenMenu = (event, skillId) => {
    setAnchorEl(event.currentTarget);
    setSelectedSkillId(skillId);
  };

  // Handle menu close
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedSkillId(null);
  };

  // Update student skill level
  const updateSkillLevel = (studentId, skillId, level) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? {
              ...student,
              skillLevels: {
                ...student.skillLevels,
                [skillId]: level
              }
            }
          : student
      )
    );
  };

  // Level box component
  const LevelBox = ({ value, onClick, type = 'level' }) => (
    <Box 
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 32,
        border: 2,
        borderRadius: 1,
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.875rem',
        transition: 'opacity 0.2s',
        bgcolor: type === 'total' ? 'primary.50' : 
                type === 'completed' ? 'success.50' : 'grey.100',
        borderColor: type === 'total' ? 'primary.300' : 
                    type === 'completed' ? 'success.300' : 'grey.300',
        color: type === 'total' ? 'primary.800' : 
              type === 'completed' ? 'success.800' : 'grey.800',
        '&:hover': {
          opacity: 0.8
        }
      }}
      onClick={onClick}
    >
      {value}
    </Box>
  );

  const filteredStudents = students.filter(student => {
    return (
      student.name.toLowerCase().includes(columnFilters.name.toLowerCase()) &&
      student.regNo.toLowerCase().includes(columnFilters.regNo.toLowerCase()) &&
      student.department.toLowerCase().includes(columnFilters.department.toLowerCase())
    );
  });

  return (
    <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh',width:'100%' }}>
      <Paper sx={{ maxWidth: '100%', mx: 'auto', borderRadius: 2, boxShadow: 3 }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'grey.200' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'grey.800', mb: 2 }}>
            Student Skills Management
          </Typography>
          
          {/* Top Filters */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Role</InputLabel>
              <Select 
                value={filters.role}
                label="Role"
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
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
                onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
              >
                <MenuItem value="">All Years</MenuItem>
                <MenuItem value="I">I Year</MenuItem>
                <MenuItem value="II">II Year</MenuItem>
                <MenuItem value="III">III Year</MenuItem>
                <MenuItem value="IV">IV Year</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              onClick={() => setShowColumnFilters(!showColumnFilters)}
              startIcon={<FilterListIcon />}
              variant="outlined"
              size="small"
            >
              Show Column
            </Button>

            {/* Add Skill Column Button */}
            <Button
              onClick={addSkillColumn}
              startIcon={<AddIcon />}
              variant="contained"
              sx={{ ml: 'auto' }}
            >
              Add Skill Column
            </Button>
          </Box>
        </Box>

        {/* Dropdown Menu for Skills */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          PaperProps={{
            sx: {
              maxHeight: 300,
              width: '250px',
            },
          }}
        >
          {availableSkills
            .filter(skillName => 
              !skillColumns.some(col => col.id !== selectedSkillId && col.selectedSkill === skillName)
            )
            .map(skillName => (
              <MenuItem 
                key={skillName} 
                onClick={() => updateSkillColumn(selectedSkillId, skillName)}
                sx={{ 
                  '&:hover': { 
                    bgcolor: 'primary.50' 
                  } 
                }}
              >
                {skillName}
              </MenuItem>
            ))}
        </Menu>

        {/* Table with Fixed Columns and Scrollable Skills */}
        <Box sx={{ position: 'relative' }}>
          <Box sx={{ display: 'flex' }}>
            {/* Fixed Columns */}
            <Box sx={{ flexShrink: 0, bgcolor: 'white', borderRight: 1, borderColor: 'grey.200' }}>
              <TableContainer>
                <Table sx={{ borderCollapse: 'collapse' }}>
                  <TableHead sx={{ bgcolor: 'grey.100' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: 'grey.200', width: 128 }}>
                        Total Levels
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: 'grey.200', width: 144 }}>
                        Completed Levels
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: 'grey.200', width: 128 }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: 'grey.200', width: 112 }}>
                        Reg No
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', width: 112 }}>
                        Department
                      </TableCell>
                    </TableRow>
                    
                    {/* Column Filters Row for Fixed Columns */}
                    {showColumnFilters && (
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell sx={{ borderRight: 1, borderColor: 'grey.200', width: 128 }}></TableCell>
                        <TableCell sx={{ borderRight: 1, borderColor: 'grey.200', width: 144 }}></TableCell>
                        <TableCell sx={{ borderRight: 1, borderColor: 'grey.200', width: 128 }}>
                          <TextField
                            size="small"
                            placeholder="Filter name"
                            variant="outlined"
                            fullWidth
                            value={columnFilters.name}
                            onChange={(e) => setColumnFilters(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </TableCell>
                        <TableCell sx={{ borderRight: 1, borderColor: 'grey.200', width: 112 }}>
                          <TextField
                            size="small"
                            placeholder="Filter reg no"
                            variant="outlined"
                            fullWidth
                            value={columnFilters.regNo}
                            onChange={(e) => setColumnFilters(prev => ({ ...prev, regNo: e.target.value }))}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 112 }}>
                          <TextField
                            size="small"
                            placeholder="Filter department"
                            variant="outlined"
                            fullWidth
                            value={columnFilters.department}
                            onChange={(e) => setColumnFilters(prev => ({ ...prev, department: e.target.value }))}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableHead>
                  
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                        <TableCell sx={{ borderRight: 1, borderColor: 'grey.200', width: 128 }}>
                          <LevelBox 
                            value={student.totalLevels} 
                            type="total"
                            onClick={() => console.log('Total levels clicked')}
                          />
                        </TableCell>
                        <TableCell sx={{ borderRight: 1, borderColor: 'grey.200', width: 144 }}>
                          <LevelBox 
                            value={student.completedLevels} 
                            type="completed"
                            onClick={() => console.log('Completed levels clicked')}
                          />
                        </TableCell>
                        <TableCell sx={{ borderRight: 1, borderColor: 'grey.200', width: 128 }}>
                          {student.name}
                        </TableCell>
                        <TableCell sx={{ borderRight: 1, borderColor: 'grey.200', width: 112 }}>
                          {student.regNo}
                        </TableCell>
                        <TableCell sx={{ width: 112 }}>
                          {student.department}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Scrollable Skills Section */}
            <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
              <TableContainer>
                <Table sx={{ borderCollapse: 'collapse', minWidth: skillColumns.length * 200 }}>
                  <TableHead sx={{ bgcolor: 'grey.100' }}>
                    <TableRow>
                      {skillColumns.map((skill) => (
                        <TableCell 
                          key={skill.id} 
                          sx={{ 
                            fontWeight: 'bold', 
                            borderRight: 1, 
                            borderColor: 'grey.200',
                            width: 200,
                            minWidth: 200
                          }}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button
                              variant="outlined"
                              onClick={(e) => handleOpenMenu(e, skill.id)}
                              endIcon={<ArrowDropDownIcon />}
                              sx={{
                                textTransform: 'none',
                                justifyContent: 'space-between',
                                minHeight: 40,
                                bgcolor: 'white',
                                border: 2,
                                borderColor: 'primary.main',
                                '&:hover': {
                                  bgcolor: 'primary.50',
                                  borderColor: 'primary.dark'
                                }
                              }}
                            >
                              <Box sx={{ textAlign: 'center', width: '100%' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                  {skill.name}
                                </Typography>
                                {skill.selectedSkill && (
                                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                    {skill.selectedSkill}
                                  </Typography>
                                )}
                              </Box>
                            </Button>
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                    
                    {/* Column Filters Row for Skills */}
                    {showColumnFilters && (
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        {skillColumns.map((skill) => (
                          <TableCell 
                            key={skill.id} 
                            sx={{ 
                              borderRight: 1, 
                              borderColor: 'grey.200',
                              width: 200,
                              minWidth: 200
                            }}
                          ></TableCell>
                        ))}
                      </TableRow>
                    )}
                  </TableHead>
                  
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                        {skillColumns.map((skill) => (
                          <TableCell 
                            key={skill.id} 
                            sx={{ 
                              borderRight: 1, 
                              borderColor: 'grey.200', 
                              textAlign: 'center',
                              width: 200,
                              minWidth: 200
                            }}
                          >
                            {skill.selectedSkill ? (
                              <TextField
                                type="number"
                                size="small"
                                value={student.skillLevels[skill.id] || 0}
                                onChange={(e) => updateSkillLevel(student.id, skill.id, parseInt(e.target.value) || 0)}
                                inputProps={{ min: 0, max: 100, style: { textAlign: 'center' } }}
                                sx={{ width: 64 }}
                              />
                            ) : (
                              <Typography color="text.disabled">-</Typography>
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