const express = require("express");
const router = express.Router();
const getController = require("../controllers/getController")

router.get("/student/user_data/:id",getController.user_data); // need year and dept

module.exports = router;