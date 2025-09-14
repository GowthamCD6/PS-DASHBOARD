const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const userAuth = require("../middlewares/userAuth");


// Login
exports.login = (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email.trim() || !password.trim()) {
      return next(createError.BadRequest("Email or password is missing"));
    }

    const sql = `
      SELECT t1.id, t1.user_id, t1.name, t1.role
      FROM master_user t1
      WHERE t1.email = ? AND t1.password = ?`;
    const values = [email, password];

    db.query(sql, values, (error, result) => {
      if (error) return next(error);
      if (result.length === 0) return next(createError.Unauthorized("Invalid email or password"));

      const user = result[0];

      // Create JWT with id, name, role
      const token = jwt.sign(
        { id: user.id, name: user.name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // change to true in production with HTTPS
        sameSite: "lax", // for localhost testing
      });

      res.json({
        message: "login successful",
        user_id: user.user_id,
        user_name: user.name,
        role: user.role,
        id: user.id,
      });
    });
  } catch (error) {
    next(error);
  }
};

// Current user
exports.me = (req, res) => {
  res.json({
    id: req.user.id,
    user_name: req.user.user_name,
    role: req.user.role,
  });
};

exports.logout = (req,res,next) => {
    try{
      res.clearCookie('token',{httpOnly: true, secure: true, sameSite: 'Strict'})
      res.send('User logged out successfully!');
    }
    catch(error)
    {
      next(error);
    }
}