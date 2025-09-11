const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const userAuth = require("../middlewares/userAuth")

router.post("/faculty/assign_mentor/:faculty_id/:student_id/:role_id/:status",postController.assign_mentor); // handles both perm and temp
router.delete("/faculty/remove_mentor/:faculty_id/:student_id/:status",postController.remove_mentor); // removes both permanent and temp

module.exports = router;