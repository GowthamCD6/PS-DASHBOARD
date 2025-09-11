-- 1. master_role
CREATE TABLE master_role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. master_user
CREATE TABLE master_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(300) NOT NULL,
    dept INT NOT NULL,
    year INT NOT NULL,
    type ENUM('student', 'teacher') NOT NULL,
    role INT NOT NULL,
    FOREIGN KEY (dept) REFERENCES master_dept(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    FOREIGN KEY (role) REFERENCES master_role(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

-- 3. master_verticals
CREATE TABLE master_verticals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    img VARCHAR(255),
    domain VARCHAR(150),
    status TINYINT NOT NULL CHECK (status IN (0, 1, 2))
);

-- 4. master_course
CREATE TABLE master_course (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    level_order INT NOT NULL CHECK (level_order > 0),
    rp VARCHAR(50),
    vertical_id INT NOT NULL,
    FOREIGN KEY (vertical_id) REFERENCES master_verticals(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- 5. s_slot
CREATE TABLE s_slot (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

-- 6. s_register
CREATE TABLE s_register (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    slot_id INT NOT NULL,
    status TINYINT NOT NULL CHECK (status IN (0, 1, 2)),
    FOREIGN KEY (user_id) REFERENCES master_user(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES master_course(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES s_slot(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- 7. master_relationship_mapping
    CREATE TABLE master_relationship_mapping (
        id INT AUTO_INCREMENT PRIMARY KEY, -- relation id
        relationship VARCHAR(50) NOT NULL,
        user INT NOT NULL, -- user in master_user table (1)
        relation_user INT NOT NULL, -- user in master_user table (2) => if (1,2) -> 1 mentors 2
        status enum('0','1') not null,
        FOREIGN KEY (user) REFERENCES master_user(id)
            ON DELETE CASCADE 
            ON UPDATE CASCADE,
        FOREIGN KEY (relation_user) REFERENCES master_user(id)
            ON DELETE CASCADE 
            ON UPDATE CASCADE
    );

CREATE TABLE master_relationships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    relationship VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE master_dept(
    id INT AUTO_INCREMENT PRIMARY KEY,
    dept varchar(50) unique
)


