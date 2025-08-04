const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 20,
  port: 3306, // Default MySQL port
});

connection.getConnection((err, conn) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to MySQL database");
    conn.release();
  }
});

module.exports = connection;