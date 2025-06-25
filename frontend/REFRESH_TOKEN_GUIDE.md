# Hướng dẫn Refresh Token

## Tổng quan

Hệ thống đã được cập nhật để tự động xử lý refresh token khi access token hết hạn (error code 1103 - EXPIRED_TOKEN).

## Cách hoạt động

### 1. Cấu trúc Token
- **Access Token**: Lưu trong localStorage, có thời hạn 15 phút
- **Refresh Token**: Lưu trong HTTP-only cookie, có thời hạn 7 ngày

### 2. Flow xử lý

#### Khi gọi API:
1. Request được gửi với access token trong header
2. Nếu nhận được error code 1103 (EXPIRED_TOKEN) hoặc 401 (UNAUTHORIZED):
   - Tự động gọi API `/api/v1/auth/refresh`
   - Refresh token được gửi tự động qua HTTP-only cookie
   - Nhận access token mới
   - Retry request gốc với token mới

#### Khi khởi động app:
1. Kiểm tra access token trong localStorage
2. Nếu token tồn tại, thử gọi API để validate
3. Nếu nhận được error code 1103, tự động refresh token
4. Cập nhật user state nếu refresh thành công

### 3. Files đã cập nhật

#### `src/services/api/config.ts`
- Axios interceptor để tự động xử lý refresh token
- Sử dụng utility functions từ `authUtils.ts`

#### `src/services/api/authUtils.ts` (Mới)
- `refreshAccessToken()`: Function chính để refresh token
- `isTokenExpiredError()`: Kiểm tra error có phải token expired
- `handleLogout()`: Xử lý logout và clear data

#### `src/contexts/AuthContext.tsx`
- Cập nhật logic khởi động app để xử lý refresh token
- Sử dụng utility functions cho logout

#### `src/services/api/authApi.ts`
- API `refreshToken()` đã có sẵn để gọi backend

## API Backend

### Refresh Token API
```
POST /api/v1/auth/refresh
```

**Request:**
- Không cần body
- Refresh token được gửi tự động qua HTTP-only cookie

**Response:**
```json
{
  "code": 1000,
  "result": {
    "token": "new_access_token_here"
  }
}
```

### Error Codes
- `1103`: EXPIRED_TOKEN - Token đã hết hạn
- `1101`: UNAUTHENTICATED - Không xác thực được

## Tính năng

### ✅ Đã hoàn thành
- [x] Tự động refresh token khi gọi API
- [x] Tự động refresh token khi khởi động app
- [x] Xử lý error code 1103 (EXPIRED_TOKEN)
- [x] Retry request gốc sau khi refresh thành công
- [x] Tự động logout khi refresh thất bại
- [x] Sử dụng HTTP-only cookie cho refresh token (bảo mật)
- [x] Utility functions tập trung để dễ maintain

### 🔒 Bảo mật
- Refresh token được lưu trong HTTP-only cookie (không thể truy cập từ JavaScript)
- Access token được lưu trong localStorage (chỉ có thể truy cập từ cùng domain)
- Tự động invalidate token cũ khi refresh
- Clear tất cả data khi refresh thất bại

## Cách test

### 1. Test tự động refresh khi gọi API
1. Đăng nhập vào hệ thống
2. Đợi 15 phút để access token hết hạn
3. Thực hiện một action (ví dụ: load trang, gọi API)
4. Hệ thống sẽ tự động refresh token và tiếp tục

### 2. Test refresh khi khởi động app
1. Đăng nhập và lưu token
2. Đợi access token hết hạn
3. Refresh trang hoặc mở lại app
4. Hệ thống sẽ tự động refresh token và load user info

### 3. Test logout
1. Đăng nhập vào hệ thống
2. Click logout
3. Refresh token sẽ được invalidate ở backend
4. Local storage sẽ được clear

## Lưu ý

- Refresh token có thời hạn 7 ngày
- Nếu refresh token hết hạn, user sẽ phải đăng nhập lại
- Tất cả API calls sẽ tự động được xử lý refresh token
- Không cần thay đổi code ở các component khác 