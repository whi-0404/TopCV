-- Debug script để kiểm tra application và resume
SELECT 
    a.id as application_id,
    a.resume_id,
    a.cv_file_name,
    r.id as resume_id_from_table,
    r.file_path,
    r.original_filename,
    r.file_size,
    u.fullname as candidate_name,
    j.title as job_title
FROM applications a
LEFT JOIN resumes r ON a.resume_id = r.id  
LEFT JOIN users u ON a.user_id = u.id
LEFT JOIN job_posts j ON a.job_id = j.id
WHERE a.id IN (15, 16, 17, 18, 19, 20)
ORDER BY a.id;

-- Kiểm tra có file nào trong thư mục uploads/resume/
-- ls -la ../uploads/resume/ 