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
    t1.dept,
    t1.year,
    t1.type, 
    (SELECT name FROM master_role WHERE id = t1.role) AS role,
    c.id AS course_id, 
    c.name AS course_name,
    COALESCE(c.level_order, 0) AS course_total_levels,
    COALESCE(SUM(CASE WHEN r.status = 1 THEN 1 END), 0) AS course_completed_levels,
    MAX(s.date) AS last_attempt_date,
    COALESCE(DATEDIFF(CURDATE(), MAX(s.date)), 0) AS gap_days,

    -- totals across ALL available courses
    SUM(COALESCE(c.level_order, 0)) OVER (PARTITION BY t1.user_id) AS total_levels,
    SUM(COALESCE(SUM(CASE WHEN r.status = 1 THEN 1 END), 0)) 
            OVER (PARTITION BY t1.user_id) AS total_completed_levels
    FROM master_user t1
    JOIN master_relationship_mapping t2 
        ON t2.relation_user = t1.id
    CROSS JOIN master_course c               
    LEFT JOIN s_register r
        ON r.user_id = t1.id
      AND r.skill_id = c.id
    LEFT JOIN s_slot s
        ON s.id = r.slot_id
    WHERE t2.user = ? 
      AND t2.status = '1'
    GROUP BY 
        t1.user_id, t1.name, t1.email, t1.type, role,
        c.id, c.name, c.level_order
    ORDER BY t1.user_id, c.id;
    ;`
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
    let sql = `SELECT 
    u.user_id,
    u.name,
    u.email,
    u.dept,
    u.year,
    u.type,
    r.name AS role,
    c.id AS course_id,
    c.name AS course_name,
    COALESCE(c.level_order, 0) AS course_total_levels,
    -- completed levels for this course
    COALESCE(SUM(CASE WHEN sr.status = 1 THEN 1 END), 0) AS course_completed_levels,
    MAX(s.date) AS last_attempt_date,
    COALESCE(DATEDIFF(CURDATE(), MAX(s.date)), 0) AS gap_days,

    -- totals across ALL courses (using window over all joined courses)
    SUM(COALESCE(c.level_order, 0)) OVER (PARTITION BY u.user_id) AS total_levels,
    SUM(COALESCE(SUM(CASE WHEN sr.status = 1 THEN 1 END), 0)) 
            OVER (PARTITION BY u.user_id) AS total_completed_levels
    FROM master_user u
    JOIN master_role r 
        ON r.id = u.role
    CROSS JOIN master_course c             
    LEFT JOIN s_register sr 
        ON sr.user_id = u.id 
      AND sr.skill_id = c.id
    LEFT JOIN s_slot s
        ON s.id = sr.slot_id
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

exports.get_relations = (req, res, next) => {
  try {
    let sql = `
    SELECT 
    faculty_user.name AS faculty,
    faculty_user.id AS faculty_id,
    faculty_user.user_id AS faculty_reg_num,
    faculty_user.email AS faculty_email,
    faculty_user.dept AS faculty_dept,
    mapping.relationship,
    mapping.relation_user AS student,
    student_user.user_id AS student_reg_num,
    student_user.email AS student_email,
    dept_table.dept
    FROM master_relationship_mapping mapping
    JOIN master_user faculty_user ON faculty_user.id = mapping.user
    JOIN master_user student_user ON student_user.id = mapping.relation_user
    JOIN master_dept dept_table ON faculty_user.dept = dept_table.id
    WHERE mapping.user <> mapping.relation_user;
    `;

    db.query(sql, (error, result) => {
      if (error || result.length === 0) {
        return next(error || createError.NotFound('User relations data not found!'));
      }

      // Group by faculty
      const grouped = {};
      result.forEach(row => {
        if (!grouped[row.faculty_reg_num]) {
          grouped[row.faculty_reg_num] = {
            faculty: row.faculty,
            faculty_reg_num: row.faculty_reg_num,
            faculty_email: row.faculty_email,
            faculty_dept: row.faculty_dept,
            no_of_mentees: 0,
            students: []
          };
        }

        grouped[row.faculty_reg_num].students.push({
          student: row.student,
          student_reg_num: row.student_reg_num,
          student_email: row.student_email
        });

        grouped[row.faculty_reg_num].no_of_mentees++;
      });

      res.json(Object.values(grouped));
    });
  } catch (error) {
    next(error);
  }
};
