const pool = require('../config/db');

class User {
  static async findByRegisterNumber(registerNumber) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE register_number = ?',
      [registerNumber]
    );
    return rows[0];
  }

  static async getAllStudents() {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE role = "student"'
    );
    return rows;
  }

  // Add other user-related methods as needed
}

module.exports = User;