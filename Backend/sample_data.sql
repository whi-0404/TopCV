-- TopCV Sample Data for Testing
-- Run this script to populate your database with test data

-- Insert Users (Admin, Employers, Job Seekers)
INSERT INTO users (id, fullname, email, password, phone, address, avt, active, email_verified, role, created_at, updated_at) VALUES
-- Admin
('admin-001', 'Admin TopCV', 'admin@topcv.vn', '$2a$10$K5F1Gv8q9L2H4N8P3R7T1uJ6V9X2Y5Z8A1B4C7D0E3F6G9H2I5J8K1', '0901234567', 'Hà Nội', 'https://via.placeholder.com/150', true, true, 'ADMIN', NOW(), NOW()),

-- Employers  
('emp-001', 'Nguyễn Văn A', 'employer1@gmail.com', '$2a$10$K5F1Gv8q9L2H4N8P3R7T1uJ6V9X2Y5Z8A1B4C7D0E3F6G9H2I5J8K1', '0901234568', 'Hà Nội', 'https://via.placeholder.com/150', true, true, 'EMPLOYER', NOW(), NOW()),
('emp-002', 'Trần Thị B', 'employer2@gmail.com', '$2a$10$K5F1Gv8q9L2H4N8P3R7T1uJ6V9X2Y5Z8A1B4C7D0E3F6G9H2I5J8K1', '0901234569', 'TP.HCM', 'https://via.placeholder.com/150', true, true, 'EMPLOYER', NOW(), NOW()),
('emp-003', 'Phạm Văn C', 'employer3@gmail.com', '$2a$10$K5F1Gv8q9L2H4N8P3R7T1uJ6V9X2Y5Z8A1B4C7D0E3F6G9H2I5J8K1', '0901234570', 'Đà Nẵng', 'https://via.placeholder.com/150', true, true, 'EMPLOYER', NOW(), NOW()),

-- Job Seekers
('user-001', 'Lê Văn D', 'user1@gmail.com', '$2a$10$K5F1Gv8q9L2H4N8P3R7T1uJ6V9X2Y5Z8A1B4C7D0E3F6G9H2I5J8K1', '0901234571', 'Hà Nội', 'https://via.placeholder.com/150', true, true, 'USER', NOW(), NOW()),
('user-002', 'Hoàng Thị E', 'user2@gmail.com', '$2a$10$K5F1Gv8q9L2H4N8P3R7T1uJ6V9X2Y5Z8A1B4C7D0E3F6G9H2I5J8K1', '0901234572', 'TP.HCM', 'https://via.placeholder.com/150', true, true, 'USER', NOW(), NOW()),
('user-003', 'Vũ Văn F', 'user3@gmail.com', '$2a$10$K5F1Gv8q9L2H4N8P3R7T1uJ6V9X2Y5Z8A1B4C7D0E3F6G9H2I5J8K1', '0901234573', 'Đà Nẵng', 'https://via.placeholder.com/150', true, true, 'USER', NOW(), NOW()),
('user-004', 'Đỗ Thị G', 'user4@gmail.com', '$2a$10$K5F1Gv8q9L2H4N8P3R7T1uJ6V9X2Y5Z8A1B4C7D0E3F6G9H2I5J8K1', '0901234574', 'Hà Nội', 'https://via.placeholder.com/150', true, true, 'USER', NOW(), NOW());

-- Insert Company Categories
INSERT INTO company_categories (id, name, created_at, updated_at) VALUES
(1, 'Công nghệ thông tin', NOW(), NOW()),
(2, 'Tài chính - Ngân hàng', NOW(), NOW()),
(3, 'Marketing - Truyền thông', NOW(), NOW()),
(4, 'Giáo dục - Đào tạo', NOW(), NOW()),
(5, 'Y tế - Sức khỏe', NOW(), NOW()),
(6, 'Bán lẻ - Thương mại', NOW(), NOW()),
(7, 'Sản xuất - Chế tạo', NOW(), NOW()),
(8, 'Du lịch - Khách sạn', NOW(), NOW());

-- Insert Companies
INSERT INTO companies (id, name, description, logo, website, employee_range, address, follower_count, active, user_id, created_at, updated_at) VALUES
(1, 'FPT Software', 'Công ty phần mềm hàng đầu Việt Nam với hơn 20 năm kinh nghiệm phát triển phần mềm cho thị trường toàn cầu.', 'https://via.placeholder.com/200x100?text=FPT', 'https://www.fpt-software.com', '1000+', 'Tầng 22, Keangnam Landmark 72, Hà Nội', 1500, true, 'emp-001', NOW(), NOW()),
(2, 'Vietcombank', 'Ngân hàng TMCP Ngoại thương Việt Nam - Ngân hàng thương mại hàng đầu Việt Nam.', 'https://via.placeholder.com/200x100?text=VCB', 'https://www.vietcombank.com.vn', '500-1000', '198 Trần Quang Khải, Hoàn Kiếm, Hà Nội', 2000, true, 'emp-002', NOW(), NOW()),
(3, 'VNG Corporation', 'Tập đoàn công nghệ hàng đầu Việt Nam, chuyên phát triển game và các ứng dụng internet.', 'https://via.placeholder.com/200x100?text=VNG', 'https://www.vng.com.vn', '500-1000', 'Lầu 8, Tòa E-Town 2, TP.HCM', 1200, true, 'emp-003', NOW(), NOW()),
(4, 'Techcombank', 'Ngân hàng TMCP Kỹ thương Việt Nam - Ngân hàng số tiên phong tại Việt Nam.', 'https://via.placeholder.com/200x100?text=TCB', 'https://www.techcombank.com.vn', '100-500', '191 Ba Tháng Hai, Quận 3, TP.HCM', 800, true, 'emp-001', NOW(), NOW()),
(5, 'Sacombank', 'Ngân hàng TMCP Sài Gòn Thương Tín - Một trong những ngân hàng TMCP lớn nhất Việt Nam.', 'https://via.placeholder.com/200x100?text=STB', 'https://www.sacombank.com.vn', '500-1000', '266-268 Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM', 600, true, 'emp-002', NOW(), NOW());

-- Insert company-category relationships
INSERT INTO company_company_categories (company_id, company_category_id) VALUES
(1, 1), -- FPT Software - IT
(2, 2), -- Vietcombank - Finance
(3, 1), -- VNG - IT  
(4, 2), -- Techcombank - Finance
(5, 2); -- Sacombank - Finance

-- Insert Job Types
INSERT INTO job_types (id, name, created_at, updated_at) VALUES
(1, 'Full-time', NOW(), NOW()),
(2, 'Part-time', NOW(), NOW()),
(3, 'Contract', NOW(), NOW()),
(4, 'Freelance', NOW(), NOW()),
(5, 'Internship', NOW(), NOW());

-- Insert Job Levels
INSERT INTO job_levels (id, name, created_at, updated_at) VALUES
(1, 'Fresher', NOW(), NOW()),
(2, 'Junior', NOW(), NOW()),
(3, 'Middle', NOW(), NOW()),
(4, 'Senior', NOW(), NOW()),
(5, 'Lead', NOW(), NOW()),
(6, 'Manager', NOW(), NOW());

-- Insert Skills
INSERT INTO skills (id, name, created_at, updated_at) VALUES
(1, 'Java', NOW(), NOW()),
(2, 'Spring Boot', NOW(), NOW()),
(3, 'React.js', NOW(), NOW()),
(4, 'Node.js', NOW(), NOW()),
(5, 'Python', NOW(), NOW()),
(6, 'SQL', NOW(), NOW()),
(7, 'JavaScript', NOW(), NOW()),
(8, 'TypeScript', NOW(), NOW()),
(9, 'Docker', NOW(), NOW()),
(10, 'AWS', NOW(), NOW()),
(11, 'Git', NOW(), NOW()),
(12, 'Agile', NOW(), NOW());

-- Insert Job Posts
INSERT INTO job_posts (id, title, description, requirements, benefits, salary, location, deadline, experience_required, status, company_id, type_id, level_id, applied_count, created_at, updated_at) VALUES
(1, 'Senior Java Developer', 
   'Chúng tôi đang tìm kiếm Senior Java Developer có kinh nghiệm phát triển ứng dụng web với Spring Boot và microservices.',
   '- Tối thiểu 3 năm kinh nghiệm Java\n- Thành thạo Spring Boot, Spring Security\n- Kinh nghiệm với Docker, Kubernetes\n- Có kinh nghiệm làm việc với database MySQL/PostgreSQL',
   '- Lương cạnh tranh 20-30 triệu\n- Thưởng dự án, thưởng tháng 13\n- Bảo hiểm sức khỏe cao cấp\n- Môi trường làm việc năng động',
   '20-30 triệu', 'Hà Nội', '2024-03-31', '3-5 năm', 'ACTIVE', 1, 1, 4, 25, NOW(), NOW()),

(2, 'Frontend Developer React.js',
   'Vị trí Frontend Developer làm việc với React.js, TypeScript để phát triển các ứng dụng web hiện đại.',
   '- Kinh nghiệm 2+ năm với React.js\n- Thành thạo JavaScript, TypeScript\n- Kiến thức về HTML5, CSS3, SASS\n- Có kinh nghiệm với Redux, Context API',
   '- Lương 15-25 triệu\n- Làm việc hybrid\n- Đào tạo công nghệ mới\n- Team building hàng quý',
   '15-25 triệu', 'TP.HCM', '2024-04-15', '2-4 năm', 'ACTIVE', 3, 1, 3, 18, NOW(), NOW()),

(3, 'Business Analyst',
   'Phân tích nghiệp vụ ngân hàng, tối ưu hóa quy trình và hỗ trợ phát triển sản phẩm banking.',
   '- Tốt nghiệp chuyên ngành Tài chính, Ngân hàng\n- Kinh nghiệm 2+ năm trong lĩnh vực banking\n- Kỹ năng phân tích, tư duy logic tốt\n- Thành thạo Excel, PowerBI',
   '- Lương 18-28 triệu\n- Thưởng KPI hàng quý\n- Cơ hội thăng tiến rõ ràng\n- Đào tạo chuyên sâu nghiệp vụ ngân hàng',
   '18-28 triệu', 'Hà Nội', '2024-04-30', '2-4 năm', 'ACTIVE', 2, 1, 3, 12, NOW(), NOW()),

(4, 'DevOps Engineer',
   'Quản lý hạ tầng cloud, CI/CD pipeline và đảm bảo tính ổn định của hệ thống production.',
   '- Kinh nghiệm 3+ năm DevOps\n- Thành thạo Docker, Kubernetes\n- Kinh nghiệm với AWS/Azure\n- Biết Jenkins, GitLab CI/CD',
   '- Lương 25-35 triệu\n- Remote flexible\n- Budget học tập 10 triệu/năm\n- Tham gia các dự án quốc tế',
   '25-35 triệu', 'Remote', '2024-05-15', '3-5 năm', 'ACTIVE', 1, 1, 4, 8, NOW(), NOW()),

(5, 'Marketing Executive',
   'Thực hiện các chiến dịch marketing online, quản lý social media và content marketing.',
   '- Tốt nghiệp Marketing, Truyền thông\n- Kinh nghiệm 1-2 năm digital marketing\n- Thành thạo Facebook Ads, Google Ads\n- Kỹ năng thiết kế cơ bản',
   '- Lương 12-18 triệu\n- Hoa hồng theo doanh số\n- Môi trường trẻ, sáng tạo\n- Đào tạo marketing từ các expert',
   '12-18 triệu', 'TP.HCM', '2024-03-25', '1-3 năm', 'ACTIVE', 4, 1, 2, 22, NOW(), NOW()),

(6, 'Internship Java Developer',
   'Chương trình thực tập sinh Java Developer 6 tháng với cơ hội trở thành nhân viên chính thức.',
   '- Sinh viên năm 3, 4 chuyên ngành CNTT\n- Có kiến thức cơ bản về Java, OOP\n- Học lực khá giỏi\n- Có tinh thần học hỏi, cầu tiến',
   '- Lương thực tập 5-8 triệu\n- Mentor 1-1 từ senior\n- Cơ hội full-time sau thực tập\n- Tham gia dự án thực tế',
   '5-8 triệu', 'Hà Nội', '2024-06-30', '0-1 năm', 'ACTIVE', 1, 5, 1, 45, NOW(), NOW());

-- Insert job-skill relationships
INSERT INTO job_post_skills (job_post_id, skill_id) VALUES
(1, 1), (1, 2), (1, 6), (1, 9), (1, 10), -- Java job skills
(2, 3), (2, 7), (2, 8), (2, 11), -- React job skills  
(4, 9), (4, 10), (4, 11), (4, 12), -- DevOps job skills
(6, 1), (6, 2), (6, 6), (6, 11); -- Intern Java job skills

-- Insert Resumes (sample)
INSERT INTO resumes (id, user_id, file_path, resume_name, created_at, updated_at) VALUES
(1, 'user-001', '/uploads/resumes/user-001/cv_le_van_d.pdf', 'CV Lê Văn D - Java Developer', NOW(), NOW()),
(2, 'user-002', '/uploads/resumes/user-002/cv_hoang_thi_e.pdf', 'CV Hoàng Thị E - Frontend Developer', NOW(), NOW()),
(3, 'user-003', '/uploads/resumes/user-003/cv_vu_van_f.pdf', 'CV Vũ Văn F - DevOps Engineer', NOW(), NOW()),
(4, 'user-004', '/uploads/resumes/user-004/cv_do_thi_g.pdf', 'CV Đỗ Thị G - Business Analyst', NOW(), NOW());

-- Insert Applications
INSERT INTO applications (id, user_id, job_post_id, cover_letter, status, created_at, updated_at) VALUES
(1, 'user-001', 1, 'Tôi có 3 năm kinh nghiệm phát triển ứng dụng Java và rất mong muốn được đóng góp cho FPT Software.', 'PENDING', NOW(), NOW()),
(2, 'user-001', 6, 'Tôi là sinh viên năm 4 chuyên ngành CNTT, rất hứng thú với cơ hội thực tập tại FPT.', 'ACCEPTED', NOW(), NOW()),
(3, 'user-002', 2, 'Tôi có kinh nghiệm 2.5 năm với React.js và đã tham gia nhiều dự án frontend scale lớn.', 'PENDING', NOW(), NOW()),
(4, 'user-003', 4, 'Với 4 năm kinh nghiệm DevOps, tôi tin mình có thể đóng góp tích cực cho team FPT.', 'PENDING', NOW(), NOW()),
(5, 'user-004', 3, 'Tôi có background tài chính mạnh và 3 năm kinh nghiệm phân tích nghiệp vụ ngân hàng.', 'ACCEPTED', NOW(), NOW()),
(6, 'user-002', 5, 'Tôi có passion với digital marketing và muốn phát triển sự nghiệp tại Techcombank.', 'REJECTED', NOW(), NOW());

-- Insert Company Reviews
INSERT INTO company_reviews (user_id, company_id, rate_star, comment, created_at, updated_at) VALUES
('user-001', 1, 5, 'Môi trường làm việc tuyệt vời, đồng nghiệp support nhiệt tình, có cơ hội học hỏi công nghệ mới.', NOW(), NOW()),
('user-002', 1, 4, 'Lương thưởng OK, dự án đa dạng nhưng áp lực deadline cao.', NOW(), NOW()),
('user-003', 2, 5, 'Ngân hàng uy tín, quy trình chuyên nghiệp, phúc lợi tốt cho nhân viên.', NOW(), NOW()),
('user-004', 3, 4, 'Công ty game hàng đầu VN, sản phẩm chất lượng, team work tốt.', NOW(), NOW()),
('user-001', 4, 4, 'Techcombank phát triển nhanh, cơ hội thăng tiến nhiều cho người trẻ.', NOW(), NOW());

-- Insert user favorite jobs (many-to-many)
INSERT INTO user_favorite_jobs (user_id, job_post_id) VALUES
('user-001', 1),
('user-001', 4),
('user-002', 2),
('user-002', 5),
('user-003', 4),
('user-004', 3);

-- Insert user follow companies (many-to-many) 
INSERT INTO user_follow_companies (user_id, company_id) VALUES
('user-001', 1),
('user-001', 3),
('user-002', 1),
('user-002', 4),
('user-003', 1),
('user-003', 2),
('user-004', 2),
('user-004', 4);

-- Password cho tất cả user: "password123"
-- JWT test tokens sẽ được generate sau khi login 