const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`, req.body);
  next();
});

app.use('/api', require('./routes/auth'));


module.exports = app;