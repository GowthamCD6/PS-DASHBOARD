const createError = require('http-errors');
const db = require('../config/db')

exports.user_data = (req,res,next) => {
  try{
    const{id} = req.params; // logged in user id
    if(!id)return next(createError.BadRequest('id not found!'));
    let sql = `SELECT  
      t1.user_id, 
      t1.name, 
      t1.email, 
      t1.type, 
      (SELECT name FROM master_role WHERE id = t1.role) AS role,
      c.id AS course_id, 
      c.name AS course_name,
      COALESCE(c.level_order, 0) AS total_levels,
      COALESCE(SUM(CASE WHEN r.status = 1 THEN 1 ELSE 0 END), 0) AS completed_levels
      FROM master_user t1
      JOIN master_relationship_mapping t2 
          ON t2.relation_user = t1.id
      LEFT JOIN s_register r
          ON r.user_id = t1.id
      LEFT JOIN master_course c
          ON c.id = r.skill_id
      WHERE t2.user = ? 
        AND t2.status = '1'
      GROUP BY t1.user_id, t1.name, t1.email, t1.type, role, c.id, c.name, c.level_order;`
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

exports.get_all_users = (req, res, next) => {
  try {
    let sql = `
      SELECT 
          u.user_id,
          u.name,
          u.email,
          u.type,
          r.name AS role,
          c.id AS course_id,
          c.name AS course_name,
          COALESCE(c.level_order, 0) AS total_levels,
          COALESCE(SUM(CASE WHEN sr.status = 1 THEN 1 ELSE 0 END), 0) AS completed_levels
      FROM master_user u
      JOIN master_role r 
          ON r.id = u.role
      CROSS JOIN master_course c   -- every student × every course
      LEFT JOIN s_register sr 
          ON sr.user_id = u.id AND sr.skill_id = c.id
      WHERE r.name = 'Student'
      GROUP BY 
          u.user_id, u.name, u.email, u.type, r.name, 
          c.id, c.name, c.level_order
      ORDER BY u.user_id, c.id;
    `;

    db.query(sql, [], (err, results) => {
      if (err) {
        return next(err); // pass error to Express error handler
      }
      res.status(200).json(results); // send the query results as JSON
    });
  } catch (error) {
    next(error);
  }
};

