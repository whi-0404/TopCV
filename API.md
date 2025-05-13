# API Documentation

## Authentication

### Đăng nhập

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "example@email.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "email": "example@email.com",
  "userType": "JOB_SEEKER"
}
```

### Đăng ký

**Endpoint:** `POST /api/auth/register`

**Request Body (Job Seeker):**
```json
{
  "email": "jobseeker@email.com",
  "password": "password123",
  "userTypeId": 2,
  "dateOfBirth": "1990-01-01",
  "gender": "Male",
  "contactNumber": "1234567890",
  "userImage": "",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Request Body (Company):**
```json
{
  "email": "company@email.com",
  "password": "password123",
  "userTypeId": 1,
  "companyName": "ABC Corporation",
  "profileDescription": "A leading company in technology",
  "establishmentDate": "2000-01-01",
  "companyWebsiteUrl": "https://www.abccorp.com",
  "companyEmail": "contact@abccorp.com",
  "companyLogoUrl": "",
  "address": "123 Main Street",
  "companySize": "100-500",
  "industry": "Technology",
  "taxCode": "ABC123456"
}
```

**Response:**
```json
"Đăng ký thành công"
```

### Gửi OTP

**Endpoint:** `POST /api/auth/send-otp?email=example@email.com`

**Response:**
```json
"OTP đã được gửi đến email của bạn"
```

### Đổi mật khẩu

**Endpoint:** `POST /api/auth/change-password`

**Request Body:**
```json
{
  "email": "example@email.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
"Mật khẩu đã được thay đổi thành công"
``` 