const express = require('express');
const router = express.Router();
const studentController = require('../controlers/studentController');

router.get('/students', studentController.getAllStudentsWithSkills);

router.put('/:studentId/skills', studentController.updateSkillLevel);

module.exports = router;
