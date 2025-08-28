const db = require("../config/db");
const createError = require("http-errors");

exports.assign_mentor = (req,res,next) => {
    try{
      const{faculty_id, student_id, status, role_id} = req.params;
      if(!faculty_id.trim() || !student_id.trim() || !role_id.trim() || !status.trim())return next(createError.BadRequest("id is invalid!"));
      let allowedRoles = ['1','3'];
      if(!allowedRoles.includes(role_id))return createError.BadRequest('Invalid status!');
      // check whether the id is a teacher's id
      let isfaculty = 'select type from master_user where id = ?';
      db.query(isfaculty,[faculty_id],(error,result) => {
        if(error || result.length == 0){
            return next(error || createError.BadRequest('id type not foud'))
        }
        if(result[0].type != 'teacher')return next("Invalid id");
        // check if the faculty is already a mentor of that student
        let checksql = "select relationship from master_relationship_mapping where user = ? and relation_user = ?";
        db.query(checksql,[faculty_id, student_id],(error1, result1) => {
            if(error1 || result1.length > 0){
                return next(error1 || createError.BadRequest("The faculty is already to the specified student!"));
            }
            if(role_id == '1'){
                // allowing only one permanent mentor
                let cntpermsql = "select * from master_relationship_mapping where relation_user = ? and relationship = '1'";
                db.query(cntpermsql,[student_id],(error2,result2) => {
                    if(error2 || result2.length > 0){
                        return next(error2 || createError.BadRequest("Permanent mentor already exist!"));
                    }
                    let assignsql = "insert into master_relationship_mapping (relationship, user, relation_user, status) values(?, ?, ?, ?)";
                    db.query(assignsql, [role_id, faculty_id, student_id, status], (error3, result3) => {
                        if (error3) return next(error3);
                        return res.send('Faculty assigned successfully!');
                    });
                })

            }
            else{
                // assign the faculty as the temp || permanent based on the status
                let assignsql = "insert into master_relationship_mapping (relationship, user, relation_user, status) values(?, ?, ?, ?);"
                db.query(assignsql,[role_id, faculty_id, student_id, status], (error3,result3) => {
                if(error3)return next(error3);
                    return res.send('faculty assgined successfully!');
                })
            }
        })
      })
    }
    catch(error){
        next(error);
    }
}

exports.remove_mentor = (req,res,next) => {
    try{
      const{faculty_id, student_id} = req.params;
      if (!faculty_id || !student_id) {
        return next(createError.BadRequest("Required parameters are missing!"));
      }

      let remove_mentor = "delete from master_relationship_mapping where user = ? and relation_user = ?";
      db.query(remove_mentor,[faculty_id, student_id],(error,result) => {
        if(error || result.affectedRows == 0)return next(error || createError.BadRequest("No mentor found to delete!"));
        return res.send("Mentor deleted successfully!");
      })
    }
    catch(error){
        next(error);
    }
}