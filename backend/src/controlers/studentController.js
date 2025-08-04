const db = require('../config/db'); // Adjust path if needed

// Get all students with their skill levels
exports.getAllStudentsWithSkills = (req, res) => {
  const studentQuery = `SELECT * FROM students`;
  
  db.query(studentQuery, (err, students) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const skillQuery = `
      SELECT s.id as student_id, sk.id as skill_id, sk.name as skill_name, ss.level
      FROM student_skills ss
      JOIN skills sk ON ss.skill_id = sk.id
      JOIN students s ON ss.student_id = s.id
    `;
    
    db.query(skillQuery, (err, skills) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Merge skills by student and skill id
      const skillMap = {}; // { studentId: { skillId: level, ... }, ... }
      skills.forEach(skill => {
        if (!skillMap[skill.student_id]) skillMap[skill.student_id] = {};
        skillMap[skill.student_id][`skill${skill.skill_id}`] = skill.level;
      });
      
      const result = students.map(student => ({
        ...student,
        skillLevels: skillMap[student.id] || {}
      }));
      
      res.json(result);
    });
  });
};

// Update skill level for a student
exports.updateSkillLevel = (req, res) => {
  const studentId = req.params.studentId;
  const { skillId, level } = req.body;
  
  if (!skillId || level == null) {
    return res.status(400).json({ error: "skillId and level are required" });
  }
  
  const levelNum = Math.min(100, Math.max(0, Number(level)));
  
  // Check if record exists
  const checkQuery = `SELECT * FROM student_skills WHERE student_id = ? AND skill_id = ?`;
  db.query(checkQuery, [studentId, skillId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (rows.length > 0) {
      // Update existing
      const updateQuery = `UPDATE student_skills SET level = ? WHERE student_id = ? AND skill_id = ?`;
      db.query(updateQuery, [levelNum, studentId, skillId], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: "Skill level updated" });
      });
    } else {
      // Insert new
      const insertQuery = `INSERT INTO student_skills (student_id, skill_id, level) VALUES (?, ?, ?)`;
      db.query(insertQuery, [studentId, skillId, levelNum], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: "Skill level added" });
      });
    }
  });
};
