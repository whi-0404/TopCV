# 🚀 Job Recommendation System - API Testing Guide

## 📋 Tổng quan hệ thống

Hệ thống **screening CV tự động và gợi ý công việc** được xây dựng bằng **FastAPI** với các chức năng chính:

1. **Upload CV và nhận gợi ý công việc** - Phân tích CV và tìm công việc phù hợp
2. **Screening CV cho công việc cụ thể** - Đánh giá độ phù hợp của CV với một công việc
3. **Quản lý danh sách công việc** - Thêm, xem, xóa công việc

## 🔧 Cách chạy hệ thống

### 1. Cài đặt dependencies
```bash
pip install -r requirements.txt
```

### 2. Chạy server
```bash
python run_server.py
```

Server sẽ chạy tại: **http://localhost:8000**

### 3. Kiểm tra server
- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc  
- **Health Check**: http://localhost:8000/health

## 🧪 Cách test API

### Option 1: Test tự động (Khuyến nghị)
```bash
python test_api_postman.py
```

Script này sẽ tự động test tất cả API endpoints và báo cáo kết quả.

### Option 2: Test bằng Postman
Xem file `postman_test_guide.md` để có hướng dẫn chi tiết.

### Option 3: Test bằng curl
```bash
# Health check
curl http://localhost:8000/health

# Upload job
curl -X POST http://localhost:8000/jobs/upload \
  -H "Content-Type: application/json" \
  -d @sample_job_data.json

# Upload CV
curl -X POST http://localhost:8000/cv/upload \
  -F "file=@WebDeveloper_CV.pdf" \
  -F "top_k=5" \
  -F "min_score=0.3"
```

## 📊 API Endpoints

| Method | URL | Mô tả |
|--------|-----|-------|
| `GET` | `/health` | Kiểm tra trạng thái hệ thống |
| `POST` | `/jobs/upload` | Upload công việc |
| `GET` | `/jobs` | Xem danh sách công việc |
| `POST` | `/cv/upload` | Upload CV và nhận gợi ý |
| `POST` | `/screening/apply-job` | Screening CV cho công việc |

## 🗂️ Cấu trúc dữ liệu

### Job Data
```json
{
  "job_id": "JOB001",
  "job_title": "Python Backend Developer", 
  "company": "TechCorp Vietnam",
  "location": "Hà Nội",
  "job_type": "Full-time",
  "required_skills": ["Python", "Django", "PostgreSQL"],
  "min_experience": 2,
  "job_description": "Mô tả công việc...",
  "responsibilities": ["Trách nhiệm 1", "Trách nhiệm 2"],
  "benefits": ["Quyền lợi 1", "Quyền lợi 2"]
}
```

### CV Response
```json
{
  "success": true,
  "cv_summary": {
    "basic_info": {
      "name": "John Doe",
      "email": "john@example.com",
      "current_position": "Python Developer"
    },
    "skills": {
      "technical_skills": ["Python", "Django", "React"],
      "total_technical": 3
    }
  },
  "recommendations": [
    {
      "job_data": {...},
      "overall_score": 0.85,
      "matching_details": {
        "skills_score": 0.9,
        "experience_score": 0.8
      },
      "recommendation": "HIGHLY_RECOMMENDED"
    }
  ]
}
```

## 🎯 Thuật toán gợi ý

Hệ thống sử dụng trọng số để tính điểm phù hợp:

- **Skills matching**: 35%
- **Experience matching**: 25%  
- **Project matching**: 15%
- **Semantic similarity**: 15%
- **Education matching**: 5%
- **Location matching**: 5%

## 📁 Các file quan trọng

| File | Mô tả |
|------|-------|
| `run_server.py` | Script chạy server |
| `test_api_postman.py` | Test tự động tất cả API |
| `postman_test_guide.md` | Hướng dẫn test bằng Postman |
| `sample_job_data.json` | Dữ liệu công việc mẫu |
| `router/recommend_service.py` | Các API endpoints |
| `core/recommen_engine.py` | Engine gợi ý công việc |
| `core/screening_cv.py` | Engine screening CV |
| `models/` | Data models |

## 🔍 CV Files để test

Hệ thống hỗ trợ các định dạng:
- **.pdf** - `WebDeveloper_CV.pdf`, `cv2.pdf`
- **.docx** 
- **.jpg, .png** - `1.jpg`

## ⚙️ Configuration

Xem file `config.py` để:
- Thay đổi trọng số matching
- Cấu hình Google API key  
- Điều chỉnh file size limits
- Cài đặt model parameters

## 🐛 Troubleshooting

### Server không khởi động được
```bash
# Kiểm tra dependencies
pip install -r requirements.txt

# Kiểm tra port 8000 có bị chiếm không
netstat -an | grep 8000
```

### API trả về 503 Service Unavailable
- Đợi server khởi động hoàn toàn (khoảng 10-30 giây)
- Kiểm tra Google API key trong `config.py`

### Không có recommendations
- Đảm bảo đã upload jobs trước
- Giảm `min_score` xuống 0.1 hoặc 0.0
- Kiểm tra CV file có hợp lệ không

### File upload bị lỗi
- Kiểm tra file size < 10MB
- Đảm bảo định dạng được hỗ trợ (.pdf, .docx, .jpg, .png)

## 🎉 Expected Results

Khi test thành công, bạn sẽ thấy:

1. **Health Check**: Status "healthy" với tất cả services = true
2. **Upload Jobs**: Success message cho từng job
3. **Get Jobs**: Danh sách jobs đã upload  
4. **CV Upload**: CV summary + danh sách recommendations với scores
5. **CV Screening**: Decision (PASS/FAIL/REVIEW) + matching analysis

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs trong terminal
2. Xem API documentation tại `/docs`
3. Chạy `python simple_test.py` để test cơ bản
4. Kiểm tra file `config.py` cho configuration

---

**Good Luck! 🚀** 