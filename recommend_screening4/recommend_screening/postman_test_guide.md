# 🧪 Hướng dẫn Test API với Postman

## 📋 Danh sách API Endpoints

### 1. Health Check
- **URL**: `GET http://localhost:8000/health`
- **Mô tả**: Kiểm tra trạng thái hệ thống

### 2. Upload Jobs (Tạo dữ liệu test)
- **URL**: `POST http://localhost:8000/jobs/upload`
- **Content-Type**: `application/json`

### 3. Upload CV và nhận gợi ý công việc
- **URL**: `POST http://localhost:8000/cv/upload`
- **Content-Type**: `multipart/form-data`

### 4. Screening CV cho công việc cụ thể  
- **URL**: `POST http://localhost:8000/screening/apply-job?job_id=JOB001`
- **Content-Type**: `multipart/form-data`

### 5. Xem danh sách công việc
- **URL**: `GET http://localhost:8000/jobs`

---

## 🚀 Cách Test từng API

### Bước 1: Khởi chạy server
```bash
python run_server.py
```
Server sẽ chạy tại: http://localhost:8000

### Bước 2: Test Health Check
**Request:**
```
GET http://localhost:8000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "message": "Job Recommendation System is running",
  "version": "2.0.0",
  "services": {
    "cv_extractor": true,
    "recommendation_engine": true,
    "skill_manager": true
  }
}
```

### Bước 3: Upload Jobs (Tạo dữ liệu test)

**Phải upload từng job một lần**

**Request 1 - Python Developer Job:**
```
POST http://localhost:8000/jobs/upload
Content-Type: application/json

{
  "job_data": {
    "job_id": "JOB001",
    "job_title": "Python Backend Developer",
    "company": "TechCorp Vietnam",
    "location": "Hà Nội",
    "job_type": "Full-time",
    "required_skills": ["Python", "Django", "PostgreSQL", "REST API", "Docker"],
    "min_experience": 2,
    "education_requirement": "Đại học",
    "job_description": "Chúng tôi đang tìm kiếm một Python Backend Developer có kinh nghiệm để tham gia vào đội ngũ phát triển các ứng dụng web quy mô lớn. Ứng viên sẽ làm việc với Django framework, thiết kế API, và tối ưu hóa performance.",
    "responsibilities": [
      "Phát triển và maintain các API backend sử dụng Python/Django",
      "Thiết kế database và optimize queries",
      "Tích hợp với các dịch vụ thứ ba",
      "Code review và mentoring junior developers",
      "Implement security best practices"
    ],
    "benefits": [
      "Lương cạnh tranh 15-25 triệu",
      "Bảo hiểm sức khỏe",
      "13th month salary",
      "Training và phát triển kỹ năng",
      "Work from home 2 ngày/tuần"
    ]
  }
}
```

**Request 2 - React Developer Job:**
```
POST http://localhost:8000/jobs/upload
Content-Type: application/json

{
  "job_data": {
    "job_id": "JOB002", 
    "job_title": "React Frontend Developer",
    "company": "StartupXYZ",
    "location": "Hồ Chí Minh",
    "job_type": "Full-time",
    "required_skills": ["React", "JavaScript", "TypeScript", "HTML/CSS", "Redux"],
    "min_experience": 1,
    "education_requirement": "Cao đẳng",
    "job_description": "Tham gia phát triển giao diện người dùng cho các ứng dụng web hiện đại. Làm việc với React, TypeScript và các công nghệ frontend tiên tiến nhất.",
    "responsibilities": [
      "Phát triển UI components sử dụng React/TypeScript",
      "Tối ưu performance và user experience",
      "Collaborate với UX/UI designers",
      "Maintain code quality và best practices",
      "Unit testing và integration testing"
    ],
    "benefits": [
      "Lương 12-20 triệu",
      "Môi trường startup năng động",
      "Flexible working hours",
      "Team building hàng tháng",
      "Learning budget"
    ]
  }
}
```

**Request 3 - Full Stack Developer Job:**
```
POST http://localhost:8000/jobs/upload
Content-Type: application/json

{
  "job_data": {
    "job_id": "JOB003",
    "job_title": "Full Stack Developer",
    "company": "Digital Agency ABC",
    "location": "Đà Nẵng", 
    "job_type": "Full-time",
    "required_skills": ["Node.js", "React", "MongoDB", "Express", "AWS"],
    "min_experience": 3,
    "education_requirement": "Đại học",
    "job_description": "Vị trí Full Stack Developer để phát triển các dự án web application từ frontend đến backend. Làm việc với MERN stack và cloud services.",
    "responsibilities": [
      "Phát triển end-to-end web applications",
      "Database design và API development",
      "Deploy và manage applications trên cloud",
      "Technical consultation cho clients",
      "Lead technical projects"
    ],
    "benefits": [
      "Lương 18-30 triệu",
      "Project bonus",
      "Du lịch company hàng năm",
      "Laptop và thiết bị làm việc",
      "Remote work option"
    ]
  }
}
```

### Bước 4: Kiểm tra Jobs đã upload
**Request:**
```
GET http://localhost:8000/jobs
```

**Expected Response:**
```json
{
  "jobs": [
    {
      "job_id": "JOB001",
      "job_title": "Python Backend Developer",
      "company": "TechCorp Vietnam",
      ...
    },
    ...
  ],
  "total": 3,
  "page": 1,
  "limit": 20
}
```

### Bước 5: Test Upload CV và nhận gợi ý công việc

**Request:**
```
POST http://localhost:8000/cv/upload
Content-Type: multipart/form-data

Form data:
- file: [Upload một file CV - PDF, DOCX, hoặc ảnh]
- top_k: 5
- min_score: 0.3
- location: (optional) "Hà Nội"
- job_type: (optional) "Full-time"
```

**Các file CV có sẵn để test:**
- `WebDeveloper_CV.pdf`
- `cv_1726397675677.pdf` 
- `cv2.pdf`
- `1.jpg`

**Expected Response:**
```json
{
  "success": true,
  "cv_summary": {
    "basic_info": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0123456789",
      "location": "Hà Nội",
      "current_position": "Python Developer"
    },
    "skills": {
      "technical_skills": ["Python", "Django", "React", "JavaScript"],
      "total_technical": 4
    },
    "experience": {
      "total_years": 3,
      "positions_count": 2
    }
  },
  "recommendations": [
    {
      "job_data": {
        "job_id": "JOB001",
        "job_title": "Python Backend Developer",
        "company": "TechCorp Vietnam"
      },
      "overall_score": 0.85,
      "matching_details": {
        "skills_score": 0.9,
        "experience_score": 0.8,
        "semantic_similarity": 0.75
      },
      "reasoning": "Ứng viên có kỹ năng Python và Django phù hợp...",
      "recommendation": "HIGHLY_RECOMMENDED"
    }
  ],
  "processing_time_ms": 1234,
  "message": "Phân tích CV và tìm gợi ý thành công"
}
```

### Bước 6: Test CV Screening cho công việc cụ thể

**Request:**
```
POST http://localhost:8000/screening/apply-job?job_id=JOB001
Content-Type: multipart/form-data

Form data:
- cv_file: [Upload một file CV]
```

**Expected Response:**
```json
{
  "success": true,
  "candidate_decision": "PASS",
  "overall_score": 0.82,
  "matching_points": [
    "Có kinh nghiệm Python/Django phù hợp với yêu cầu",
    "Kinh nghiệm làm việc với REST API",
    "Hiểu biết về database PostgreSQL"
  ],
  "not_matching_points": [
    "Chưa có kinh nghiệm với Docker containers",
    "Cần cải thiện kỹ năng về performance optimization"
  ],
  "recommendation": "Ứng viên có potential tốt, recommend phỏng vấn technical để đánh giá sâu hơn về khả năng problem solving.",
  "job_id": "JOB001", 
  "job_title": "Python Backend Developer",
  "company_name": "TechCorp Vietnam"
}
```

---

## 📝 Tips khi test

1. **Thứ tự test**: Health Check → Upload Jobs → Upload CV → Screening
2. **File CV**: Sử dụng các file CV có sẵn trong folder hoặc upload CV thật
3. **Parameters**: Thử nghiệm với các giá trị `top_k`, `min_score` khác nhau
4. **Filters**: Test với location filter, job_type filter
5. **Error Handling**: Test với file không hợp lệ, job_id không tồn tại

## 🐛 Troubleshooting

- **503 Service Unavailable**: Đảm bảo server đã khởi động hoàn toàn
- **400 Bad Request**: Kiểm tra format JSON và required fields
- **File upload errors**: Đảm bảo file size < 10MB và đúng định dạng
- **Empty recommendations**: Kiểm tra đã upload jobs chưa, hoặc giảm `min_score`

---

## 🔗 API Documentation

Sau khi khởi chạy server, truy cập:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc 