# Job Search Website

## Mô tả

Dự án website tìm kiếm việc làm, kết nối nhà tuyển dụng và người tìm việc.

## Cấu trúc dự án

- `frontend`: React TypeScript + TailwindCSS
- `backend`: Spring Boot Java

## Yêu cầu hệ thống

- Node.js và npm
- Java 17+
- Maven
- PostgreSQL

## Cài đặt và chạy

### Backend

1. Cấu hình cơ sở dữ liệu PostgreSQL trong `src/main/resources/application.properties`
2. Chạy backend:
   ```
   mvn spring-boot:run
   ```

### Frontend

1. Cài đặt dependencies:
   ```
   cd frontend
   npm install
   ```
2. Chạy frontend:
   ```
   npm start
   ```

### Chạy cả hai cùng lúc

Sử dụng script `start-dev.bat` (Windows):
```
start-dev.bat
```

## API Endpoints

### Authentication

- **Đăng nhập**: `POST /api/auth/login`
- **Đăng ký**: `POST /api/auth/register`
- **Gửi OTP**: `POST /api/auth/send-otp`
- **Đổi mật khẩu**: `POST /api/auth/change-password`

## Kiểm tra API

Truy cập trang kiểm tra API tại: http://localhost:3000/api-test

## Tài liệu

- [Frontend Documentation](frontend/README.md)
- [API Documentation](API.md) 