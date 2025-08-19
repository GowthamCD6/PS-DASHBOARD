const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

router.post("/auth/login",auth.login);
router.post("/auth/logout",auth.logout);

module.exports = router;
