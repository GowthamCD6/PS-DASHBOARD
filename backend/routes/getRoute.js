const express = require("express");
const router = express.Router();
const getController = require("../controllers/getController")
const userAuth = require("../middlewares/userAuth");

router.get('/student/get_all_users',getController.get_all_users);
router.get("/student/user_data/:id",getController.user_data); // need year and dept
router.get("/student_faculty/get_relations",getController.get_relations);
router.get("/getRoles",getController.getRoles);
router.get("/getcourse",getController.getcourse);
router.get("/getDept",getController.getDept);
router.get("/getMentors/:id",getController.getMentors); // also can be used for count number of mentees

module.exports = router;