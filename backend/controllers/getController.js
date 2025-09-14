const createError = require('http-errors');
const db = require('../config/db')

exports.user_data = (req, res, next) => {
  try {
    const { id } = req.params; // logged in user id
    if (!id) return next(createError.BadRequest("id not found!"));

    let sql = `SELECT 
    u.user_id,
    u.name,
    u.email,
    u.dept AS dept_id,
    dept_table.dept AS dept_name,
    u.year,
    u.type,
    (SELECT name FROM master_role WHERE id = u.role) AS role,

    -- totals across all courses
    SUM(c.course_total_levels) AS total_levels,
    SUM(c.course_completed_levels) AS total_completed_levels,

    -- courses as JSON array
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'course_id', c.course_id,
            'course_name', c.course_name,
            'course_total_levels', c.course_total_levels,
            'course_completed_levels', c.course_completed_levels,
            'last_attempt_date', c.last_attempt_date,
            'gap_days', c.gap_days
        )
    ) AS courses
FROM master_user u
JOIN master_relationship_mapping t2 
    ON t2.relation_user = u.id
JOIN master_dept dept_table
    ON u.dept = dept_table.id
LEFT JOIN (
    -- pre-aggregate per user per course, include courses even if no registration
    SELECT 
        c.id AS course_id,
        c.name AS course_name,
        c.level_order AS course_total_levels,
        sr.user_id,
        COALESCE(SUM(CASE WHEN sr.status = 1 THEN 1 END), 0) AS course_completed_levels,
        MAX(s.date) AS last_attempt_date,
        COALESCE(DATEDIFF(CURDATE(), MAX(s.date)), 0) AS gap_days
    FROM master_course c
    CROSS JOIN (SELECT DISTINCT user_id FROM s_register) users
    LEFT JOIN s_register sr
        ON sr.skill_id = c.id
       AND sr.user_id = users.user_id
    LEFT JOIN s_slot s
        ON s.id = sr.slot_id
    GROUP BY users.user_id, c.id
) c ON c.user_id = u.user_id
WHERE t2.user = ? AND t2.status = '1'
GROUP BY u.user_id, u.name, u.email, u.dept, dept_table.dept, u.year, u.type, u.role;
`;

    db.query(sql, [id], (err, result) => {
      if (err || !result) {
        return next(err || createError.NotFound("user data not found!"));
      }
      return res.send(result);
    });
  } catch (error) {
    next(error);
  }
};

exports.get_all_users = (req, res, next) => {
  try {
    let sql = `SELECT
      u.user_id,
      u.name,
      u.email,
      d.dept AS dept,
      u.year,
      u.type,
      r.name AS role,
      SUM(c.level_order) AS total_levels,
      SUM(IFNULL(sr.completed_count, 0)) AS total_completed_levels,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'course_id', c.id,
          'course_nam e', c.name,
          'course_total_levels', c.level_order,
          'course_completed_levels', IFNULL(sr.completed_count,0),
          'last_attempt_date', sr.last_attempt_date,
          'gap_days', IFNULL(DATEDIFF(CURDATE(), sr.last_attempt_date),0)
        )
      ) AS courses
    FROM master_user u
    JOIN master_role r ON r.id = u.role
    JOIN master_dept d ON d.id = u.dept
    CROSS JOIN master_course c
    LEFT JOIN (
      SELECT
        sr.user_id,
        sr.skill_id,
        SUM(CASE WHEN sr.status = 1 THEN 1 ELSE 0 END) AS completed_count,
        MAX(s.date) AS last_attempt_date
      FROM s_register sr
      LEFT JOIN s_slot s ON s.id = sr.slot_id
      GROUP BY sr.user_id, sr.skill_id
    ) sr ON sr.user_id = u.id AND sr.skill_id = c.id
    WHERE u.type = 'student'
    GROUP BY u.id, u.user_id, u.name, u.email, d.dept, u.year, u.type, r.name
    ORDER BY u.user_id;`;

    db.query(sql, [], (err, results) => {
      if (err) {
        return next(err);
      }
      res.status(200).json(results);
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
    faculty_dept_table.dept AS faculty_dept,
    
    mapping.relationship,
    
    student_user.name AS student_name,
    student_user.id AS student_id,
    student_user.user_id AS student_reg_num,
    student_user.email AS student_email,
    student_dept_table.dept AS student_dept

FROM master_relationship_mapping mapping
JOIN master_user faculty_user 
    ON faculty_user.id = mapping.user
JOIN master_user student_user 
    ON student_user.id = mapping.relation_user
JOIN master_dept faculty_dept_table 
    ON faculty_user.dept = faculty_dept_table.id
JOIN master_dept student_dept_table 
    ON student_user.dept = student_dept_table.id
WHERE mapping.user <> mapping.relation_user;

    `;

    db.query(sql, (error, result) => {
      if (error || result.length === 0) {
        return next(error || createError.NotFound("User relations data not found!"));
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
          student_email: row.student_email,
          student_dept: row.student_dept   // ✅ now included
        });

        grouped[row.faculty_reg_num].no_of_mentees++;
      });

      res.json(Object.values(grouped));
    });
  } catch (error) {
    next(error);
  }
};
