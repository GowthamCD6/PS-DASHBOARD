const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");
const userAuth = require("../middlewares/userAuth");

router.get("/api/auth/me", userAuth, auth.me);
router.post("/auth/login", auth.login);
router.post("/auth/logout", auth.logout);

module.exports = router;

