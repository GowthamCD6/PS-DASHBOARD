const express = require("express");
const router = express.Router();
const getController = require("../controllers/getController")
const userAuth = require("../middlewares/userAuth");

router.get('/student/get_all_users',userAuth,getController.get_all_users);
router.get("/student/user_data/:id",userAuth,getController.user_data); // need year and dept
router.get("/student_faculty/get_relations",userAuth,getController.get_relations);

module.exports = router;