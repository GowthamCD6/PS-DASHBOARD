// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Handle GET requests to /api/students
router.get('/', studentController.getStudentSkills);

module.exports = router;