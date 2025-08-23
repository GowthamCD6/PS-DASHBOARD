const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.post("/faculty/assign_mentor",postController.assign_mentor);

module.exports = router;