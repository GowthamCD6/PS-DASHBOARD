const pool = require('../config/db');

exports.addSkill = async (req, res) => {
  try {
    const { skill_name, department } = req.body;
    const [result] = await pool.query(
      'INSERT INTO skills (skill_name, department) VALUES (?, ?)',
      [skill_name, department]
    );
    res.json({
      id: result.insertId,
      name: `Skill ${result.insertId}`,
      selectedSkill: skill_name,
      color: getColorForSkill(result.insertId)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding skill' });
  }
};

exports.removeSkill = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM skills WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing skill' });
  }
};

function getColorForSkill(id) {
  const colors = [
    '#1976d2', '#2e7d32', '#d32f2f', '#7b1fa2', '#f57c00',
    '#0288d1', '#388e3c', '#f44336', '#9c27b0', '#ff9800'
  ];
  return colors[id % colors.length];
}