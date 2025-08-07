const db = require('../config/db');

exports.getAppData = (req, res) => {
  db.query('SELECT * FROM app_data', (error, results) => {
    if (error) {
      console.error('Error fetching app data:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
}