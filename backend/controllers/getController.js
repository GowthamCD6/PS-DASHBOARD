const createError = require('http-errors');
const db = require('../config/db')

exports.user_data = (req, res, next) => {
  try {
    const { id } = req.params; // mentor/authority user id (master_user.id)
    if (!id) return next(createError.BadRequest("id not found!"));

    // allow caller to override semester start date via query param
    const semesterStart = req.query.semesterStart || "2025-01-01";

    const sql = `
SELECT
    u.user_id,
    u.name,
    u.email,
    d.dept AS dept_name,
    u.year,
    u.type,
    r.name AS role_name,

    -- total levels across all courses
    (SELECT COALESCE(SUM(level_order),0) FROM master_course) AS total_levels,

    -- total completed levels by this student
    (SELECT COALESCE(SUM(CASE WHEN sr.status = 1 THEN c.level_order ELSE 0 END),0)
     FROM s_register sr
     JOIN master_course c ON sr.skill_id = c.id
     WHERE sr.user_id = u.id) AS total_completed_levels,

    -- cumulative rewards
    (SELECT COALESCE(SUM(mr.points),0) 
     FROM master_rp mr
     WHERE mr.user_id = u.id AND mr.status = 1) AS cumulative_rewards,

    -- current semester rewards
    (SELECT COALESCE(SUM(mr2.points),0) 
     FROM master_rp mr2
     WHERE mr2.user_id = u.id AND mr2.status = 1 AND mr2.date >= CAST(? AS DATE)
    ) AS current_semester_rewards,

    -- per-course details as JSON
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'course_id', course_agg.course_id,
                'course_name', course_agg.course_name,
                'gap_days', course_agg.gap_days,
                'last_attempt_date', course_agg.last_attempt_date,
                'course_total_levels', course_agg.course_total_levels,
                'course_completed_levels', course_agg.course_completed_levels
            )
        )
        FROM (
            SELECT 
                c.id AS course_id,
                c.name AS course_name,
                c.level_order AS course_total_levels,
                COALESCE(MAX(s.date), NULL) AS last_attempt_date,
                COALESCE(DATEDIFF(NOW(), MAX(s.date)), 0) AS gap_days,
                (SELECT COUNT(*) 
                 FROM s_register sr2 
                 WHERE sr2.user_id = u.id AND sr2.skill_id = c.id AND sr2.status = 1
                ) AS course_completed_levels
            FROM master_course c
            LEFT JOIN s_register sr ON sr.skill_id = c.id AND sr.user_id = u.id
            LEFT JOIN s_slot s ON sr.slot_id = s.id
            GROUP BY c.id
        ) AS course_agg
    ) AS courses

      FROM master_user u
      JOIN master_relationship_mapping mrm ON mrm.relation_user = u.id
      JOIN master_dept d ON u.dept = d.id
      JOIN master_role r ON u.role = r.id
      WHERE mrm.user = ? AND mrm.status = '1';
`;

    db.query(sql, [semesterStart, id], (err, rows) => {
      if (err) return next(err);

      // Build students with nested courses
      const studentsMap = {};

      rows.forEach(r => {
        if (!studentsMap[r.user_id]) {
          studentsMap[r.user_id] = {
            user_id: r.user_id,
            name: r.name,
            email: r.email,
            dept: r.dept_name,
            year: Number(r.year),
            type: r.type,
            role: r.role_name,
            total_levels: Number(r.total_levels),
            total_completed_levels: Number(r.total_completed_levels),
            cumulative_rewards: Number(r.cumulative_rewards),
            current_semester_rewards: Number(r.current_semester_rewards),
            courses: r.courses || []
          };
        }
      });

      return res.json(Object.values(studentsMap));
    });

  } catch (error) {
    next(error);
  }
};


exports.get_all_users = (req, res, next) => {
  try {
    const semesterStart = req.query.semesterStart || "2025-01-01"; // optional query param

    let sql = `
      SELECT
        u.user_id,
        u.name,
        u.email,
        d.dept AS dept,
        u.year,
        u.type,
        r.name AS role,
        SUM(c.level_order) AS total_levels,
        SUM(IFNULL(sr.completed_count, 0)) AS total_completed_levels,

        -- cumulative rewards (all-time)
        (SELECT COALESCE(SUM(mr.points),0)
         FROM master_rp mr
         WHERE mr.user_id = u.id AND mr.status = 1) AS cumulative_rewards,

        -- current semester rewards (from semesterStart to now)
        (SELECT COALESCE(SUM(mr2.points),0)
         FROM master_rp mr2
         WHERE mr2.user_id = u.id AND mr2.status = 1 AND mr2.date >= CAST(? AS DATE)
        ) AS current_semester_rewards,

        JSON_ARRAYAGG(
          JSON_OBJECT(
            'course_id', c.id,
            'course_name', c.name,
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
      ORDER BY u.user_id;
    `;

    db.query(sql, [semesterStart], (err, results) => {
      if (err) return next(err);
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

exports.getRoles = (req,res,next) => {
  try{
    let sql = "select name from master_role"
    db.query(sql,(error,result) => {
      if(error || result.length == 0){
        return next(error || createError.NotFound());
      }
      return res.send(result);
    })
  }
  catch(error)
  {
    next(error);
  }
}

exports.getcourse = (req,res,next) => {
  try{
    let sql = "select distinct name from master_verticals"
    db.query(sql,(error,result) => {
      if(error || result.length == 0){
        return next(error || createError.NotFound());
      }
      return res.send(result);
    })
  }
  catch(error){
    next(error);
  }
}

exports.getDept = (req,res,next) => {
  try{
    let sql = "select distinct dept from master_dept";
    db.query(sql,(error,result) => {
      if(error || result.length == 0){
        return next(error || createError.NotFound());
      }
      res.send(result);
    })
  }
  catch(error){
    next(error);
  }
}

exports.getSkill = (req,res,next) => {
  try{
    let sql = "select distinct name from master_verticals";
    db.query(sql,(error,result) => {
      if(error || result.length == 0){
        return next(error || createError.NotFound());
      }
      return res.send(result);
    })
  }
  catch(error){
    next(error)
  }
}