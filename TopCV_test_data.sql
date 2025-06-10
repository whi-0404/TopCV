-- =====================================================
-- TopCV Test Data Script for PostgreSQL
-- =====================================================
-- Chạy script này trong PostgreSQL để tạo data test
-- Order: Skills -> Job Types -> Job Levels -> Companies -> Job Posts

-- 1. INSERT SKILLS
INSERT INTO skills (name) VALUES 
('Java'),
('Spring Boot'),
('Python'),
('JavaScript'),
('React'),
('MySQL'),
('PostgreSQL'),
('Docker'),
('AWS'),
('Git'),
('TypeScript'),
('Node.js'),
('FastAPI'),
('Django'),
('HTML5'),
('CSS3'),
('Redux'),
('MongoDB'),
('Redis'),
('Kubernetes');

-- 2. INSERT JOB TYPES
INSERT INTO job_types (name) VALUES 
('Full-time'),
('Part-time'),
('Contract'),
('Internship'),
('Remote');

-- 3. INSERT JOB LEVELS
INSERT INTO job_level (name) VALUES 
('Intern'),
('Junior'),
('Mid-level'),
('Senior'),
('Lead'),
('Manager'),
('Director');

-- 4. INSERT COMPANIES
INSERT INTO companies (name, description, address, employee_range, follower_count, is_active, created_at, updated_at) VALUES 
(
    'TechCorp Vietnam',
    'Leading technology company specializing in enterprise software solutions and digital transformation.',
    '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
    '100-500',
    1250,
    true,
    NOW(),
    NOW()
),
(
    'InnovateAI Solutions',
    'Cutting-edge AI and machine learning company developing intelligent automation solutions.',
    '456 Le Loi Boulevard, District 3, Ho Chi Minh City', 
    '50-200',
    890,
    true,
    NOW(),
    NOW()
),
(
    'StartupHub Vietnam',
    'Fast-growing fintech startup revolutionizing digital banking and payment solutions.',
    '789 Tran Hung Dao Street, Ba Dinh District, Ha Noi',
    '10-50',
    350,
    true,
    NOW(),
    NOW()
),
(
    'GlobalTech Partners',
    'International software consultancy providing custom development and DevOps services.',
    '321 Vo Van Tan Street, District 3, Ho Chi Minh City',
    '200-1000',
    2100,
    true,
    NOW(),
    NOW()
),
(
    'VietDev Studios',
    'Creative software development studio specializing in web and mobile applications.',
    '654 Hoang Hoa Tham Street, Tan Binh District, Ho Chi Minh City',
    '20-100',
    750,
    true,
    NOW(),
    NOW()
);

-- 5. INSERT JOB POSTS
INSERT INTO job_posts (
    title, description, requirements, benefits, location, working_time, salary, 
    experience_required, deadline, applied_count, hiring_quota, status, 
    company_id, job_type_id, job_level_id, created_at, updated_at
) VALUES 

-- Java Developer Jobs
(
    'Senior Java Backend Developer',
    'We are seeking an experienced Java developer to join our backend team. You will be responsible for developing scalable microservices, optimizing database performance, and mentoring junior developers.',
    'Bachelor degree in Computer Science or related field. 4+ years of Java development experience. Strong knowledge of Spring Boot, Spring Security, and RESTful APIs. Experience with PostgreSQL, Redis, and Docker. Understanding of microservices architecture and design patterns.',
    'Competitive salary up to $3000. Health insurance coverage. Annual performance bonus. Professional development budget $1000/year. Flexible working hours. Modern office with free coffee and snacks.',
    'Ho Chi Minh City',
    'Monday to Friday, 8:30 AM - 5:30 PM, Flexible hours',
    '$2000 - $3000',
    '4+ years',
    '2025-02-15'::date,
    0,
    3,
    'ACTIVE',
    1, -- TechCorp Vietnam
    1, -- Full-time
    4, -- Senior
    NOW(),
    NOW()
),

(
    'Java Full Stack Developer',
    'Join our development team to build end-to-end web applications using Java backend and React frontend. Work on exciting e-commerce and fintech projects.',
    '3+ years Java experience with Spring framework. Proficient in React, JavaScript ES6+, and TypeScript. Experience with MySQL/PostgreSQL databases. Knowledge of Git version control and Agile methodologies.',
    'Salary range $1800-$2800. Remote work options 2 days/week. Team building activities. Learning and certification support. MacBook Pro provided.',
    'Ho Chi Minh City',
    'Full-time, Hybrid work model',
    '$1800 - $2800',
    '3+ years',
    '2025-02-28'::date,
    0,
    2,
    'ACTIVE',
    2, -- InnovateAI Solutions  
    1, -- Full-time
    3, -- Mid-level
    NOW(),
    NOW()
),

-- Python Developer Jobs
(
    'Python AI Engineer',
    'Develop machine learning models and AI solutions for our enterprise clients. Work with cutting-edge technologies including TensorFlow, PyTorch, and cloud platforms.',
    'Master/Bachelor in Computer Science, AI, or related field. 3+ years Python development experience. Strong knowledge of machine learning frameworks (TensorFlow, PyTorch, scikit-learn). Experience with FastAPI, Django, or Flask. Cloud experience (AWS, GCP) preferred.',
    'High compensation $2500-$4000. Stock options. International conference attendance. Research publication opportunities. State-of-the-art GPU workstations.',
    'Ho Chi Minh City',
    'Full-time, Research-oriented environment',
    '$2500 - $4000',
    '3+ years',
    '2025-03-10'::date,
    0,
    2,
    'ACTIVE',
    2, -- InnovateAI Solutions
    1, -- Full-time
    4, -- Senior
    NOW(),
    NOW()
),

(
    'Junior Python Developer',
    'Perfect opportunity for fresh graduates or developers with 1-2 years of experience. You will work on web applications, APIs, and automation scripts while receiving mentorship from senior developers.',
    'Bachelor degree in IT/Computer Science. 1-2 years Python experience or strong internship background. Basic knowledge of Django/FastAPI. Understanding of SQL databases. Eagerness to learn and grow.',
    'Competitive starting salary $800-$1200. Comprehensive training program. Mentorship from senior developers. Career growth opportunities. Friendly work environment.',
    'Ha Noi',
    'Full-time, Monday to Friday',
    '$800 - $1200',
    '1-2 years',
    '2025-02-20'::date,
    0,
    4,
    'ACTIVE',
    3, -- StartupHub Vietnam
    1, -- Full-time
    2, -- Junior
    NOW(),
    NOW()
),

-- Frontend Developer Jobs
(
    'React Frontend Developer',
    'Build beautiful and responsive user interfaces for our web applications. Collaborate with UX/UI designers and backend developers to create seamless user experiences.',
    '2+ years React development experience. Proficient in JavaScript ES6+, HTML5, CSS3. Experience with Redux, React Router, and modern build tools (Webpack, Vite). Understanding of responsive design and cross-browser compatibility.',
    'Salary $1500-$2200. Creative and collaborative work environment. Latest design tools and software licenses. Flexible working arrangements. Annual team retreat.',
    'Ho Chi Minh City',
    'Full-time with flexible hours',
    '$1500 - $2200',
    '2+ years',
    '2025-02-25'::date,
    0,
    3,
    'ACTIVE',
    5, -- VietDev Studios
    1, -- Full-time
    3, -- Mid-level
    NOW(),
    NOW()
),

-- DevOps Engineer Jobs
(
    'DevOps Engineer',
    'Design and maintain CI/CD pipelines, manage cloud infrastructure, and ensure high availability of our applications. Work with Docker, Kubernetes, and cloud platforms.',
    '3+ years DevOps/Infrastructure experience. Strong knowledge of Docker and Kubernetes. Experience with AWS/GCP/Azure. Proficient in scripting (Python, Bash). Understanding of monitoring tools (Prometheus, Grafana).',
    'Excellent compensation $2200-$3200. Remote work options. Cloud certification reimbursement. On-call compensation. Latest DevOps tools and platforms access.',
    'Remote',
    'Full-time, Remote with occasional office visits',
    '$2200 - $3200',
    '3+ years',
    '2025-03-05'::date,
    0,
    2,
    'ACTIVE',
    4, -- GlobalTech Partners
    1, -- Full-time
    4, -- Senior
    NOW(),
    NOW()
),

-- Technical Lead Jobs
(
    'Technical Lead - Java',
    'Lead a team of 5-8 developers in building enterprise-grade applications. Drive technical decisions, mentor team members, and ensure delivery of high-quality software solutions.',
    '6+ years Java development experience with 2+ years in leadership roles. Expert knowledge of Spring ecosystem, microservices architecture. Experience with system design and team management. Strong communication and mentoring skills.',
    'Leadership compensation $3500-$5000. Equity participation. Technical conference speaker opportunities. Team management training. Executive coaching program.',
    'Ho Chi Minh City',
    'Full-time, Leadership role',
    '$3500 - $5000',
    '6+ years',
    '2025-03-15'::date,
    0,
    1,
    'ACTIVE',
    1, -- TechCorp Vietnam
    1, -- Full-time
    5, -- Lead
    NOW(),
    NOW()
),

-- Part-time/Contract Jobs
(
    'Part-time JavaScript Developer',
    'Flexible part-time opportunity for students or freelancers. Work on web development projects with modern JavaScript frameworks and contribute to our open-source initiatives.',
    'Strong JavaScript fundamentals and ES6+ features. Experience with React or Vue.js. Basic understanding of Node.js. Git version control knowledge. Available 20+ hours per week.',
    'Flexible hourly rate $15-$25/hour. Work from anywhere. Open-source contribution opportunities. Potential for full-time conversion. Flexible schedule.',
    'Remote',
    'Part-time, 20-30 hours per week',
    '$15 - $25 per hour',
    '1+ years',
    '2025-02-10'::date,
    0,
    2,
    'ACTIVE',
    3, -- StartupHub Vietnam
    2, -- Part-time
    2, -- Junior
    NOW(),
    NOW()
);

-- 6. INSERT JOB SKILLS RELATIONSHIPS
-- Get the skill IDs and job IDs to create relationships

-- Senior Java Backend Developer (Job ID 1) - Java, Spring Boot, PostgreSQL, Redis, Docker
INSERT INTO job_skills (job_id, skill_id) VALUES 
(1, 1), -- Java
(1, 2), -- Spring Boot  
(1, 7), -- PostgreSQL
(1, 19), -- Redis
(1, 8); -- Docker

-- Java Full Stack Developer (Job ID 2) - Java, Spring Boot, React, JavaScript, MySQL
INSERT INTO job_skills (job_id, skill_id) VALUES
(2, 1), -- Java
(2, 2), -- Spring Boot
(2, 5), -- React
(2, 4), -- JavaScript
(2, 6); -- MySQL

-- Python AI Engineer (Job ID 3) - Python, FastAPI, AWS
INSERT INTO job_skills (job_id, skill_id) VALUES
(3, 3), -- Python
(3, 13), -- FastAPI
(3, 9); -- AWS

-- Junior Python Developer (Job ID 4) - Python, Django, MySQL
INSERT INTO job_skills (job_id, skill_id) VALUES
(4, 3), -- Python
(4, 14), -- Django
(4, 6); -- MySQL

-- React Frontend Developer (Job ID 5) - React, JavaScript, TypeScript, HTML5, CSS3
INSERT INTO job_skills (job_id, skill_id) VALUES
(5, 5), -- React
(5, 4), -- JavaScript
(5, 11), -- TypeScript
(5, 15), -- HTML5
(5, 16); -- CSS3

-- DevOps Engineer (Job ID 6) - Docker, AWS, Python, Kubernetes
INSERT INTO job_skills (job_id, skill_id) VALUES
(6, 8), -- Docker
(6, 9), -- AWS
(6, 3), -- Python
(6, 20); -- Kubernetes

-- Technical Lead Java (Job ID 7) - Java, Spring Boot, AWS, PostgreSQL
INSERT INTO job_skills (job_id, skill_id) VALUES
(7, 1), -- Java
(7, 2), -- Spring Boot
(7, 9), -- AWS
(7, 7); -- PostgreSQL

-- Part-time JavaScript Developer (Job ID 8) - JavaScript, React, Node.js, Git
INSERT INTO job_skills (job_id, skill_id) VALUES
(8, 4), -- JavaScript
(8, 5), -- React
(8, 12), -- Node.js
(8, 10); -- Git

-- =====================================================
-- VERIFICATION QUERIES (Optional - for checking data)
-- =====================================================

-- Check counts
-- SELECT COUNT(*) as skills_count FROM skills;
-- SELECT COUNT(*) as job_types_count FROM job_types;
-- SELECT COUNT(*) as job_levels_count FROM job_level;
-- SELECT COUNT(*) as companies_count FROM companies;
-- SELECT COUNT(*) as job_posts_count FROM job_posts;
-- SELECT COUNT(*) as job_skills_count FROM job_skills;

-- Check job posts with related data
-- SELECT 
--     jp.title,
--     c.name as company_name,
--     jt.name as job_type,
--     jl.name as job_level,
--     jp.location,
--     jp.salary
-- FROM job_posts jp
-- JOIN companies c ON jp.company_id = c.id
-- JOIN job_types jt ON jp.job_type_id = jt.id  
-- JOIN job_level jl ON jp.job_level_id = jl.id;

-- Check job skills
-- SELECT 
--     jp.title,
--     STRING_AGG(s.name, ', ') as required_skills
-- FROM job_posts jp
-- JOIN job_skills js ON jp.id = js.job_id
-- JOIN skills s ON js.skill_id = s.id
-- GROUP BY jp.id, jp.title;

-- =====================================================
-- Script completed! 
-- Total records: 20 Skills, 5 Job Types, 7 Job Levels, 
--                5 Companies, 8 Job Posts, 32 Job-Skill relationships
-- ===================================================== 