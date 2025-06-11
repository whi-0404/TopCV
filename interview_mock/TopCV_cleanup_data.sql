-- =====================================================
-- TopCV Database Cleanup Script
-- =====================================================
-- Chạy script này TRƯỚC khi chạy TopCV_test_data.sql
-- Script này sẽ xóa hết data cũ để tránh conflict

-- Disable foreign key checks temporarily (PostgreSQL)
SET session_replication_role = replica;

-- =====================================================
-- 1. XÓA DỮ LIỆU THEO THỨ TỰ (tránh foreign key constraint)
-- =====================================================

-- Bước 1: Xóa bảng many-to-many và child tables trước
DELETE FROM job_skills;
DELETE FROM favor_job;
DELETE FROM follow_company;
DELETE FROM categories_companies;
DELETE FROM company_reviews;
DELETE FROM applications;

-- Bước 2: Xóa job_posts (sau khi đã xóa các bảng reference)
DELETE FROM job_posts;

-- Bước 3: Xóa companies
DELETE FROM companies;

-- Bước 4: Xóa company categories
DELETE FROM company_categories;

-- Bước 5: Xóa các bảng master data
DELETE FROM skills;
DELETE FROM job_types;
DELETE FROM job_level;

-- Bước 6: TRUNCATE để reset identity (sử dụng CASCADE)
TRUNCATE TABLE 
    job_skills,
    favor_job,
    follow_company, 
    categories_companies,
    company_reviews,
    applications,
    job_posts,
    companies,
    company_categories,
    skills,
    job_types,
    job_level
RESTART IDENTITY CASCADE;

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- =====================================================
-- 2. RESET AUTO INCREMENT SEQUENCES
-- =====================================================

-- Reset all sequences to start from 1
ALTER SEQUENCE skills_id_seq RESTART WITH 1;
ALTER SEQUENCE job_types_id_seq RESTART WITH 1;
ALTER SEQUENCE job_level_id_seq RESTART WITH 1;
ALTER SEQUENCE companies_id_seq RESTART WITH 1;
ALTER SEQUENCE job_posts_id_seq RESTART WITH 1;

-- =====================================================
-- 3. VERIFICATION - Kiểm tra data đã bị xóa
-- =====================================================

-- Check if tables are empty
SELECT 'skills' as table_name, COUNT(*) as record_count FROM skills
UNION ALL
SELECT 'job_types', COUNT(*) FROM job_types
UNION ALL  
SELECT 'job_level', COUNT(*) FROM job_level
UNION ALL
SELECT 'companies', COUNT(*) FROM companies
UNION ALL
SELECT 'job_posts', COUNT(*) FROM job_posts
UNION ALL
SELECT 'job_skills', COUNT(*) FROM job_skills
UNION ALL
SELECT 'company_categories', COUNT(*) FROM company_categories
UNION ALL
SELECT 'company_reviews', COUNT(*) FROM company_reviews;

-- =====================================================
-- ALTERNATIVE: QUICK CLEANUP (Use with CAUTION!)
-- =====================================================
-- Uncomment below if you want to delete ALL data quickly
-- WARNING: This will delete ALL data in these tables!

/*
-- Method 1: Delete all with CASCADE (safest)
TRUNCATE TABLE 
    applications,
    job_skills,
    favor_job,
    follow_company,
    categories_companies,
    company_reviews,
    job_posts, 
    companies,
    company_categories,
    skills,
    job_types,
    job_level
RESTART IDENTITY CASCADE;

-- Method 2: Disable constraints temporarily (risky)
-- SET FOREIGN_KEY_CHECKS = 0; -- MySQL syntax
-- For PostgreSQL:
-- ALTER TABLE applications DISABLE TRIGGER ALL;
-- ... (disable for all tables)
-- TRUNCATE all tables
-- ALTER TABLE applications ENABLE TRIGGER ALL;
-- ... (enable for all tables)
*/

-- =====================================================
-- Cleanup completed!
-- Now you can run TopCV_test_data.sql safely
-- ===================================================== 