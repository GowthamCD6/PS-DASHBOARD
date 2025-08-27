const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.post("/faculty/assign_mentor/:faculty_id/:student_id/:status",postController.assign_mentor);

module.exports = router;