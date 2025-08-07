// controllers/studentController.js
const pool = require('../config/db');

exports.getStudentSkills = async (req, res) => {
  try {
    // Get all students
    const [students] = await pool.query(
      'SELECT id, name, register_number, department, completed_levels, total_levels FROM users WHERE role = "student"'
    );

    // Get all skills
    const [skills] = await pool.query('SELECT * FROM skills');

    // Get student skills
    const [studentSkills] = await pool.query('SELECT * FROM student_skills');

    // Format the data
    const formattedStudents = students.map(student => {
      const skillLevels = {};
      studentSkills
        .filter(ss => ss.student_id === student.id)
        .forEach(ss => {
          skillLevels[`skill${ss.skill_id}`] = ss.level;
        });

      return {
        id: student.id,
        name: student.name,
        register_number: student.register_number,
        department: student.department,
        completed_levels: student.completed_levels,
        total_levels: student.total_levels,
        skillLevels
      };
    });

    // Format skills for columns
    const skillColumns = skills.map(skill => ({
      id: `skill${skill.id}`,
      name: skill.skill_name,
      selectedSkill: skill.skill_name,
      color: getColorForSkill(skill.id)
    }));

    res.json({
      students: formattedStudents,
      skillColumns,
      availableSkills: skills.map(s => s.skill_name)
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching student data',
      error: error.message
    });
  }
};

function getColorForSkill(id) {
  const colors = [
    '#1976d2', '#2e7d32', '#d32f2f', '#7b1fa2', '#f57c00',
    '#0288d1', '#388e3c', '#f44336', '#9c27b0', '#ff9800'
  ];
  return colors[id % colors.length];
}