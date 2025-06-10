-- TopCV Sample Data for PostgreSQL
-- Copy-paste và chạy trong Azure Data Studio hoặc Google Cloud SQL

-- Insert Users 
INSERT INTO users (id, fullname, email, password, phone, address, avt, active, email_verified, role, created_at, updated_at) VALUES
('admin-001', 'Admin TopCV', 'admin@topcv.vn', '$2a$10$K5F1Gv8q9L2H4N8P3R7T1uJ6V9X2Y5Z8A1B4C7D0E3F6G9H2I5J8K1', '0901234567', 'Hà Nội', 'https://via.placeholder.com/150', true, true, 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('emp-001', 'Nguyễn Văn A', 'employer1@gmail.com', '$2a$10$K5F1Gv8q9L2H4N8P3R7T1uJ6V9X2Y5Z8A1B4C7D0E3F6G9H2I5J8K1', '0901234568', 'Hà Nội', 'https://via.placeholder.com/150', true, true, 'EMPLOYER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('emp-002', 'Trần Thị B', 'employer2@gmail.com', '$2a$10$K5F1Gv8q9L2H4N8P3R7T1uJ6V9X2Y5Z8A1B4C7D0E3F6G9H2I5J8K1', '0901234569', 'TP.HCM', 'https://via.placeholder.com/150', true, true, 'EMPLOYER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user-001', 'Lê Văn D', 'user1@gmail.com', '$2a$10$K5F1Gv8q9L2H4N8P3R7T1uJ6V9X2Y5Z8A1B4C7D0E3F6G9H2I5J8K1', '0901234571', 'Hà Nội', 'https://via.placeholder.com/150', true, true, 'USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user-002', 'Hoàng Thị E', 'user2@gmail.com', '$2a$10$K5F1Gv8q9L2H4N8P3R7T1uJ6V9X2Y5Z8A1B4C7D0E3F6G9H2I5J8K1', '0901234572', 'TP.HCM', 'https://via.placeholder.com/150', true, true, 'USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Company Categories
INSERT INTO company_categories (id, name, created_at, updated_at) VALUES
(1, 'Công nghệ thông tin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Tài chính - Ngân hàng', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Marketing - Truyền thông', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Companies
INSERT INTO companies (id, name, description, logo, website, employee_range, address, follower_count, active, user_id, created_at, updated_at) VALUES
(1, 'FPT Software', 'Công ty phần mềm hàng đầu Việt Nam', 'https://via.placeholder.com/200x100?text=FPT', 'https://www.fpt-software.com', '1000+', 'Hà Nội', 1500, true, 'emp-001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'VNG Corporation', 'Tập đoàn công nghệ hàng đầu Việt Nam', 'https://via.placeholder.com/200x100?text=VNG', 'https://www.vng.com.vn', '500-1000', 'TP.HCM', 1200, true, 'emp-002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert company-category relationships
INSERT INTO company_company_categories (company_id, company_category_id) VALUES
(1, 1), (2, 1);

-- Insert Job Types
INSERT INTO job_types (id, name, created_at, updated_at) VALUES
(1, 'Full-time', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Part-time', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Internship', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Job Levels
INSERT INTO job_levels (id, name, created_at, updated_at) VALUES
(1, 'Fresher', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Junior', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Senior', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Skills
INSERT INTO skills (id, name, created_at, updated_at) VALUES
(1, 'Java', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Spring Boot', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'React.js', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'JavaScript', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Job Posts
INSERT INTO job_posts (id, title, description, requirements, benefits, salary, location, deadline, experience_required, status, company_id, type_id, level_id, applied_count, created_at, updated_at) VALUES
(1, 'Senior Java Developer', 'Tìm kiếm Senior Java Developer', E'- 3+ năm Java\n- Spring Boot\n- PostgreSQL', E'- Lương 20-30 triệu\n- Thưởng tháng 13', '20-30 triệu', 'Hà Nội', '2024-12-31', '3-5 năm', 'ACTIVE', 1, 1, 3, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Frontend Developer', 'Vị trí Frontend React.js', E'- 2+ năm React\n- JavaScript, HTML, CSS', E'- Lương 15-25 triệu\n- Hybrid work', '15-25 triệu', 'TP.HCM', '2024-12-31', '2-4 năm', 'ACTIVE', 2, 1, 2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert job-skill relationships
INSERT INTO job_post_skills (job_post_id, skill_id) VALUES
(1, 1), (1, 2), (2, 3), (2, 4);

-- Insert Resumes
INSERT INTO resumes (id, user_id, file_path, resume_name, created_at, updated_at) VALUES
(1, 'user-001', '/uploads/cv1.pdf', 'CV Lê Văn D', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'user-002', '/uploads/cv2.pdf', 'CV Hoàng Thị E', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Applications
INSERT INTO applications (id, user_id, job_post_id, cover_letter, status, created_at, updated_at) VALUES
(1, 'user-001', 1, 'Tôi có 3 năm kinh nghiệm Java và muốn join FPT', 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'user-002', 2, 'Tôi có 2.5 năm kinh nghiệm React.js', 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Company Reviews
INSERT INTO company_reviews (user_id, company_id, rate_star, comment, created_at, updated_at) VALUES
('user-001', 1, 5, 'Môi trường tốt, đồng nghiệp support nhiệt tình', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user-002', 2, 4, 'Công ty game tốt, sản phẩm chất lượng', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert user favorites và follows
INSERT INTO user_favorite_jobs (user_id, job_post_id) VALUES
('user-001', 1), ('user-002', 2);

INSERT INTO user_follow_companies (user_id, company_id) VALUES
('user-001', 1), ('user-002', 2);

-- LOGIN ACCOUNTS (Password: password123)
-- admin@topcv.vn - ADMIN
-- employer1@gmail.com - EMPLOYER  
-- user1@gmail.com - USER 