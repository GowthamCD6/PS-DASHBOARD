const db = require("../config/db");
const createError = require("http-errors");

exports.assign_mentor = (req,res,next) => {
    try{
      const{faculty_id, student_id, status} = req.params;
      if(!faculty_id.trim() || !student_id.trim() || !status.trim())return next(createError.BadRequest("id is invalid!"));
      let allowedStatus = ['1','3'];
      if(!allowedStatus.contains(status))return createError.BadRequest('Invalid status!');
      // check whether the id is a teacher's id
      let isfaculty = 'select type from master_user where id = ?';
      db.query(isfaculty,[faculty_id],(error,result) => {
        if(error || result.trim() == ""){
            return next(error || createError.BadRequest('id type not foud'))
        }
        if(result.type != 'teacher')return next("Invalid id");
        // check if the faculty is already a mentor of that student
        let checksql = "select relationship from master_relationship_mapping where user = ? and relation_user = ?";
        db.query(checksql,[faculty_id, student_id],(error1, result1) => {
            if(error1 || result1.length > 0){
                return next(error1 || createError.BadRequest("The faculty is already to the specified student!"));
            }
            // assign the faculty as the temp || permanent based on the status
            let assignsql = "insert into master_relationship_mapping (relationship, user, relation_user, status) values(?, ?, ?, ?);"
            db.query(assignsql,[status, faculty_id, student_id, status], (error2,result2) => {
                if(error2)return next(error2);
                return res.send('faculty assgined successfully!');
            })
        })
      })
    }
    catch(error){
        next(error);
    }
}