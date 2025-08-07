const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');

// Add a new skill
router.post('/', skillController.addSkill);

// Remove a skill
router.delete('/:id', skillController.removeSkill);

module.exports = router;