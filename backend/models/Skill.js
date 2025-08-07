const pool = require('../config/db');

class Skill {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM skills');
    return rows;
  }

  static async create(skillData) {
    const [result] = await pool.query('INSERT INTO skills SET ?', skillData);
    return result.insertId;
  }

  // Add other skill-related methods as needed
}

module.exports = Skill;