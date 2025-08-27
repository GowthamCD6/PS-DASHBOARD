const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.post("/faculty/assign_mentor/:faculty_id/:student_id/:status",postController.assign_mentor); // handles both perm and temp
router.delete("/faculty/remove_mentor/:facutly_id/:student_id/:status",postController.remove_mentor); // removes both permanent and temp

module.exports = router;