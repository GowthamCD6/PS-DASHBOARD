const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// log requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`, req.body);
  next();
});

// Routes
app.use('/api/students', require('./routes/student'));

// DB connection
require('./config/db');

module.exports = app;
