-- Insert user types if they don't exist
INSERT INTO User_Type (user_type_name)
SELECT 'ADMIN' WHERE NOT EXISTS (SELECT 1 FROM User_Type WHERE user_type_name = 'ADMIN');

INSERT INTO User_Type (user_type_name)
SELECT 'SEEKER' WHERE NOT EXISTS (SELECT 1 FROM User_Type WHERE user_type_name = 'SEEKER');

INSERT INTO User_Type (user_type_name)
SELECT 'EMPLOYER' WHERE NOT EXISTS (SELECT 1 FROM User_Type WHERE user_type_name = 'EMPLOYER');

-- Insert admin user if it doesn't exist
INSERT INTO User_Account (user_type_id, email, password, is_active, registration_date)
SELECT 
    (SELECT user_type_id FROM User_Type WHERE user_type_name = 'ADMIN'), 
    'admin@jobportal.com', 
    '$2a$10$XDvF7qY1UPCZGwkq0P3Vg.DP4g0y3Ak0GfJCvwmJjOa2cWL/cvPd2', -- bcrypt hash of 'admin123'
    true,
    CURRENT_TIMESTAMP
WHERE 
    NOT EXISTS (SELECT 1 FROM User_Account WHERE email = 'admin@jobportal.com'); 