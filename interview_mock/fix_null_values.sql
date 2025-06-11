-- =====================================================
-- Fix NULL values for primitive type columns
-- =====================================================
-- Chạy script này để fix null values gây lỗi Hibernate

-- Fix companies table
UPDATE companies 
SET follower_count = 0 
WHERE follower_count IS NULL;

-- Fix job_posts table  
UPDATE job_posts 
SET applied_count = 0 
WHERE applied_count IS NULL;

UPDATE job_posts 
SET hiring_quota = 1 
WHERE hiring_quota IS NULL;

-- Verify fixes
SELECT 
    'companies' as table_name,
    COUNT(*) as total_rows,
    COUNT(follower_count) as non_null_follower_count
FROM companies

UNION ALL

SELECT 
    'job_posts' as table_name,
    COUNT(*) as total_rows,
    COUNT(applied_count) as non_null_applied_count  
FROM job_posts

UNION ALL

SELECT 
    'job_posts_quota' as table_name,
    COUNT(*) as total_rows,
    COUNT(hiring_quota) as non_null_hiring_quota
FROM job_posts;

-- =====================================================
-- Script completed! Restart Spring Boot app now.
-- ===================================================== 