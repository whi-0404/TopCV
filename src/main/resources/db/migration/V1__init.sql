-- Create User Type table
CREATE TABLE User_Type (
    user_type_id SERIAL PRIMARY KEY,
    user_type_name VARCHAR(50) NOT NULL UNIQUE
);

-- Create User Account table
CREATE TABLE User_Account (
    user_id SERIAL PRIMARY KEY,
    user_type_id INT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    contact_number VARCHAR(20),
    user_image TEXT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_date TIMESTAMP,
    FOREIGN KEY (user_type_id) REFERENCES User_Type(user_type_id)
);

-- Create Seeker Profile table
CREATE TABLE seeker_profile (
    id SERIAL PRIMARY KEY,
    user_account_id INT NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email_contact VARCHAR(255),
    current_salary DECIMAL(15,2),
    currency VARCHAR(10),
    is_annually_monthly BOOLEAN,
    bio TEXT,
    file_cv TEXT,
    FOREIGN KEY (user_account_id) REFERENCES User_Account(user_id)
);

-- Create Company table
CREATE TABLE Company (
    company_id SERIAL PRIMARY KEY,
    registered_by_user_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL UNIQUE,
    profile_description TEXT,
    establishment_date DATE,
    company_website_url VARCHAR(255),
    company_email VARCHAR(255) NOT NULL,
    company_logo_url TEXT,
    address TEXT,
    company_size VARCHAR(50),
    industry VARCHAR(100),
    tax_code VARCHAR(20),
    status VARCHAR(50) DEFAULT 'Chờ duyệt' CHECK (status IN ('Chờ duyệt', 'Đã duyệt', 'Bị khóa')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registered_by_user_id) REFERENCES User_Account(user_id)
);

-- Create Company Image table
CREATE TABLE Company_Image (
    company_image_id SERIAL PRIMARY KEY,
    company_id INT NOT NULL,
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES Company(company_id) ON DELETE CASCADE
);

-- Create OTP Records table
CREATE TABLE otp_records (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expiry_time TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample user types
INSERT INTO User_Type (user_type_name) VALUES 
('admin'),
('company'),
('seeker'); 