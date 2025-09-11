const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");
const userAuth = require("../middlewares/userAuth")

router.post("/auth/login",auth.login);
router.post("/auth/logout",auth.logout);

module.exports = router;
