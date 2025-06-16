# 🚀 Job Portal - Hệ thống Tuyển dụng Trực tuyến

Một hệ thống tuyển dụng trực tuyến hoàn chỉnh được xây dựng với **Spring Boot** (Backend) và **React TypeScript** (Frontend).

## 📋 Tính năng chính

### 👥 Hệ thống 3 roles:
- **USER (Job Seeker)**: Tìm kiếm việc làm, ứng tuyển, quản lý hồ sơ
- **EMPLOYER (Company)**: Đăng tuyển dụng, quản lý ứng viên, quản lý công ty
- **ADMIN**: Quản lý toàn bộ hệ thống

### 🏢 Tính năng Company:
- ✅ Tạo và quản lý profile công ty
- ✅ Đăng và quản lý job posts
- ✅ Xem chi tiết công ty với thông tin đầy đủ
- ✅ Follow/Unfollow công ty
- ✅ Hiển thị jobs của công ty

### 💼 Tính năng Job:
- ✅ Tìm kiếm việc làm với filters phong phú
- ✅ Xem chi tiết job với thông tin đầy đủ
- ✅ Lưu/Bỏ lưu việc làm (Favorite)
- ✅ Ứng tuyển trực tuyến
- ✅ Quản lý hồ sơ ứng tuyển

### 🔐 Authentication & Authorization:
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ OTP verification
- ✅ Password reset functionality

## 🛠️ Tech Stack

### Backend:
- **Framework**: Spring Boot 3.x
- **Database**: PostgreSQL
- **Cache**: Redis
- **Security**: Spring Security + JWT
- **Documentation**: Spring Doc OpenAPI
- **Build Tool**: Maven

### Frontend:
- **Framework**: React 18 + TypeScript
- **Styling**: TailwindCSS
- **Icons**: Heroicons
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Build Tool**: Create React App

## 📁 Cấu trúc Project

```
job-portal/
├── recommend_screening4/TopCV/Backend/     # Spring Boot Backend
│   ├── src/main/java/com/TopCV/
│   │   ├── controller/                     # REST Controllers
│   │   ├── service/                        # Business Logic
│   │   ├── repository/                     # Data Access Layer
│   │   ├── entity/                         # JPA Entities
│   │   ├── dto/                           # Data Transfer Objects
│   │   ├── mapper/                        # Entity-DTO Mappers
│   │   ├── configuration/                 # Configuration Classes
│   │   └── exception/                     # Exception Handling
│   └── src/main/resources/
│       ├── application.yaml               # Application Configuration
│       └── db/migration/                  # Database Migrations
└── frontend/                              # React Frontend
    ├── src/
    │   ├── components/                    # Reusable Components
    │   ├── pages/                         # Page Components
    │   ├── services/                      # API Services
    │   ├── types/                         # TypeScript Types
    │   ├── contexts/                      # React Contexts
    │   └── utils/                         # Utility Functions
    ├── public/                            # Static Assets
    └── package.json                       # Dependencies
```

## 🚀 Cài đặt và Chạy Project

### Prerequisites:
- Java 17+
- Node.js 16+
- PostgreSQL
- Redis
- Maven

### Backend Setup:

1. **Cấu hình Database**:
```bash
# Tạo database PostgreSQL
createdb job_portal
```

2. **Cập nhật cấu hình**:
```yaml
# recommend_screening4/TopCV/Backend/src/main/resources/application.yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/job_portal
    username: your_username
    password: your_password
```

3. **Chạy Backend**:
```bash
cd recommend_screening4/TopCV/Backend
mvn spring-boot:run
```

### Frontend Setup:

1. **Cài đặt dependencies**:
```bash
cd frontend
npm install
```

2. **Chạy Frontend**:
```bash
npm start
```

3. **Build for production**:
```bash
npm run build
```

## 📊 API Documentation

Backend API được document với OpenAPI 3.0. Truy cập sau khi chạy backend:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/api-docs

## 🔧 API Endpoints chính

### Authentication:
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/logout` - Đăng xuất

### Companies:
- `GET /api/v1/companies` - Danh sách công ty
- `GET /api/v1/companies/{id}` - Chi tiết công ty
- `POST /api/v1/companies` - Tạo công ty
- `POST /api/v1/companies/{id}/follow` - Follow công ty

### Job Posts:
- `GET /api/v1/job-posts/search` - Tìm kiếm việc làm
- `GET /api/v1/job-posts/{id}` - Chi tiết việc làm
- `POST /api/v1/job-posts` - Đăng việc làm
- `POST /api/v1/job-posts/{id}/favorite` - Lưu việc làm

## 🎨 UI/UX Features

- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Modern UI**: TailwindCSS với design system nhất quán
- ✅ **Interactive Elements**: Hover effects, transitions, loading states
- ✅ **Breadcrumb Navigation**: Clear navigation path
- ✅ **Real-time Updates**: Dynamic content loading
- ✅ **Error Handling**: User-friendly error messages

## 🔒 Security Features

- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Role-based Authorization**: Granular permission control
- ✅ **Input Validation**: Comprehensive data validation
- ✅ **CORS Configuration**: Secure cross-origin requests
- ✅ **SQL Injection Protection**: JPA/Hibernate protection

## 📈 Performance Optimizations

- ✅ **Redis Caching**: Fast data retrieval
- ✅ **Database Indexing**: Optimized queries
- ✅ **Pagination**: Efficient data loading
- ✅ **Code Splitting**: Lazy loading components
- ✅ **Image Optimization**: Compressed assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- **Backend Developer**: [Your Name]
- **Frontend Developer**: [Your Name]
- **UI/UX Designer**: [Your Name]

## 📞 Contact

- **Email**: your.email@example.com
- **GitHub**: [@Danku2894](https://github.com/Danku2894)
- **Project Link**: [https://github.com/Danku2894/Job-portal](https://github.com/Danku2894/Job-portal)

---

⭐ **Nếu project này hữu ích, hãy star để ủng hộ nhé!** ⭐ 