const createError = require('http-errors');
const db = require('../config/db')

exports.user_data = (req,res,next) => {
  try{
    const{id} = req.params; // logged in user id
    if(!id)return next(createError.BadRequest('id not found!'));
    let sql = `select t1.user_id, t1.name, t1.email, t1.type, (select name from master_role where id = t1.role) as role from master_user t1
              join master_relationship_mapping t2 on t2.relation_user = t1.id
              where t2.user = ? and status = ?;`
    db.query(sql,[id,'1'],(err,result) => {
      if(err || !result){
        return next( err || createError.NotFound('user data not found!'));
      }
      return res.send(result)
    })
  }
  catch(error){
    next(error);
  }
}
