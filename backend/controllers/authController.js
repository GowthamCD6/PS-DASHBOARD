const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");

exports.login = (req, res, next) => {
    try{
        const {emailId, password} = req.body;
        if(!emailId.trim() || !password.trim()) {
         return createError(BadRequest, "EmailId or Password is missing!");
        }
        const sql = `select * from users where emailId = ? and password = ?`;       
        const values = [emailId, password];
        db.query(sql,values,(error,result) => {
            if(error) {
                return next(error)
            }
            if(result.length === 0){
                return createError(Unauthorized, "Invalid emailId or password");
            }
            const user = result[0];
            const token = jwt.sign({id: user.id},process.env.JWT_SECRET,{expiresIn: "1h"});
            res.cookie("token", token); 
            res.json({
                message: "login successful",
                "user_id":result.id,
                "user_name":result.name,
                "email_id":result.emailId,
            });
        })
    
    }
    catch(error){
        return res.send(error);
    }
    
}

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