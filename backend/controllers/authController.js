const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");

exports.login = (req, res, next) => {
    try{
        const {email,password} = req.body;
        if(!email.trim() || !password.trim()) {
         return createError(BadRequest, "EmailId or Password is missing!");
        }
        const sql = `select t1.id, t1.user_id, t1.name, t1.type, t2.name from master_user t1 join master_role t2
                     on t1.role = t2.id where t1.email = ? and password = ?;`;       
        const values = [email,password];
        db.query(sql,values,(error,result) => {
            if(error) {
                return next(error)
            }
            if(result.length === 0){
                return createError("Invalid emailId or password");
            }
            const user = result[0];
            const token = jwt.sign({id: user.id},process.env.JWT_SECRET,{expiresIn: "1h"});
            res.cookie("token", token, {
                httpOnly: true,     // cannot be accessed from JS (more secure)
                secure: false,      // true if using HTTPS in production
                sameSite: "None",    // if backend/frontend same domain → use Lax; if different ports → set "None"
            });
                    res.json({
                message: "login successful",
                "user_id":user.user_id,
                "user_name":user.name,
                "type":user.type,
                "role":user.role,
                "id":user.id
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