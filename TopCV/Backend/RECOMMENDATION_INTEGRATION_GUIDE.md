# 🤖 Job Recommendation System Integration Guide

## 📋 Tổng quan

Hệ thống gợi ý công việc (Job Recommendation System) tích hợp giữa Java Spring Boot backend và Python AI service để cung cấp gợi ý công việc thông minh dựa trên CV của người dùng.

## 🏗️ Kiến trúc

```
┌─────────────────┐    HTTP REST    ┌─────────────────┐
│   Java Backend  │ ←──────────────→ │ Python AI Service│
│   (Spring Boot) │                  │   (FastAPI)     │
│                 │                  │                 │
│ • JobPost CRUD  │                  │ • CV Analysis   │
│ • User Auth     │                  │ • ML Matching   │
│ • API Endpoints │                  │ • Embeddings    │
└─────────────────┘                  └─────────────────┘
          │                                   │
          ▼                                   ▼
┌─────────────────┐                  ┌─────────────────┐
│   PostgreSQL    │                  │ Vector Storage  │
│   Database      │                  │ + Models Cache  │
└─────────────────┘                  └─────────────────┘
```

## 🔧 Các thành phần đã implement

### 1. **DTOs (Data Transfer Objects)**

#### **Request DTOs:**
- `RecommendationRequest`: Yêu cầu gợi ý công việc với filters
- `PythonRecommendationRequest`: Request gửi sang Python service
- `AnalyzeCvTextRequest`: Phân tích CV từ text

#### **Response DTOs:**
- `RecommendationResponse`: Response chính với CV analysis + job recommendations
- `PythonRecommendationResponse`: Response từ Python service
- `HealthCheckResponse`: Status của Python service

#### **External DTOs:**
- `PythonJobData`: Chuyển đổi JobPost entity sang format Python
- `PythonJobData.fromJobPost()`: Converter method

### 2. **Feign Client - RecommendationServiceClient**

```java
@FeignClient(
    name = "recommendation-service",
    url = "${app.python-service.url:http://localhost:8000}"
)
public interface RecommendationServiceClient {
    
    // Upload CV file và nhận recommendations
    @PostMapping("/cv/upload")
    PythonRecommendationResponse uploadCvAndRecommend(...);
    
    // Phân tích CV từ text
    @PostMapping("/cv/analyze-text")
    PythonRecommendationResponse analyzeCvText(...);
    
    // Generate recommendations với job data có sẵn
    @PostMapping("/recommend")
    PythonRecommendationResponse recommend(...);
    
    // Health check
    @GetMapping("/health")
    HealthResponse healthCheck();
}
```

### 3. **Service Layer - RecommendationService**

```java
@Service
public class RecommendationServiceImpl implements RecommendationService {
    
    // Upload CV file → call Python → convert response
    public RecommendationResponse uploadCvAndRecommend(...);
    
    // Analyze CV text only (no job recommendations)
    public RecommendationResponse analyzeCvText(String cvText);
    
    // Custom recommendation với filters
    public RecommendationResponse generateRecommendations(...);
    
    // Health check Python service
    public Boolean isRecommendationServiceHealthy();
}
```

### 4. **Controller - RecommendationController**

#### **Endpoints:**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/recommendation/upload-cv` | Upload CV file + get recommendations | USER |
| `POST` | `/api/recommendation/analyze-cv-text` | Analyze CV text only | USER |
| `POST` | `/api/recommendation/generate` | Custom recommendations with filters | USER |
| `GET` | `/api/recommendation/health` | Health check Python service | PUBLIC |
| `POST` | `/api/recommendation/init-sample-data` | Initialize sample data | ADMIN |

### 5. **Error Handling**

```java
// New ErrorCodes added:
INVALID_CV_FILE(2301, "Invalid CV file format", HttpStatus.BAD_REQUEST),
CV_ANALYSIS_ERROR(2304, "Error analyzing CV content", HttpStatus.INTERNAL_SERVER_ERROR),
RECOMMENDATION_PROCESSING_ERROR(2305, "Error processing recommendation", HttpStatus.INTERNAL_SERVER_ERROR),
SERVICE_UNAVAILABLE(2307, "Recommendation service unavailable", HttpStatus.SERVICE_UNAVAILABLE),
// ... và các codes khác
```

## 🚀 Cách sử dụng

### 1. **Upload CV và nhận gợi ý:**

```bash
curl -X POST "http://localhost:8080/TopCV/api/recommendation/upload-cv" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "cv_file=@/path/to/cv.pdf" \
  -F "top_k=10" \
  -F "min_score=0.3" \
  -F "location=Ho Chi Minh City"
```

### 2. **Phân tích CV từ text:**

```bash
curl -X POST "http://localhost:8080/TopCV/api/recommendation/analyze-cv-text" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cvText": "Nguyễn Văn A\nSoftware Engineer\nSkills: Java, Python, React..."
  }'
```

### 3. **Tạo gợi ý tùy chỉnh:**

```bash
curl -X POST "http://localhost:8080/TopCV/api/recommendation/generate" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cvContent": "base64_encoded_cv_content",
    "topK": 10,
    "minScore": 0.3,
    "location": "Ho Chi Minh City",
    "jobType": "Full-time",
    "experienceLevel": "Mid-level",
    "salaryMin": 1000,
    "salaryMax": 2000
  }'
```

## 🔧 Configuration

### **application.yml:**

```yaml
app:
  python-service:
    url: ${PYTHON_SERVICE_URL:http://localhost:8000}
    timeout:
      connect: 10000
      read: 30000
    retry:
      max-attempts: 3
      backoff-period: 1000
```

### **Environment Variables:**

```bash
# Python service URL
PYTHON_SERVICE_URL=http://localhost:8000

# Optional: For production
PYTHON_SERVICE_URL=http://recommendation-service:8000
```

## 📊 Response Format

### **Successful Response:**

```json
{
  "code": 1000,
  "message": "Upload CV và phân tích thành công",
  "result": {
    "success": true,
    "message": "CV analyzed successfully",
    "cvAnalysis": {
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@email.com",
      "currentPosition": "Software Engineer",
      "yearsExperience": 3,
      "technicalSkills": ["Java", "Python", "React"],
      "softSkills": ["Team work", "Communication"],
      "projects": [...]
    },
    "recommendations": [
      {
        "jobId": 123,
        "jobTitle": "Senior Java Developer",
        "companyName": "Tech Company ABC",
        "location": "Ho Chi Minh City",
        "overallScore": 0.85,
        "matchingDetails": {
          "skillsScore": 0.9,
          "experienceScore": 0.8,
          "locationScore": 1.0,
          "matchedSkills": ["Java", "Spring Boot"],
          "missingSkills": ["Docker", "Kubernetes"]
        },
        "recommendationReasons": [
          "Highly matched technical skills",
          "Experience level fits requirements"
        ]
      }
    ],
    "totalJobsAnalyzed": 50,
    "processingTimeMs": 1250.5,
    "generatedAt": "2024-01-15T10:30:00Z"
  }
}
```

## 🔍 Data Flow

1. **User uploads CV** → Java Controller
2. **Validate file** → RecommendationService
3. **Get active JobPosts** → PostgreSQL
4. **Convert to Python format** → PythonJobData.fromJobPost()
5. **Call Python service** → Feign Client
6. **Python processes CV** → AI/ML algorithms
7. **Return recommendations** → Python Response
8. **Convert back to Java format** → RecommendationResponse
9. **Return to user** → API Response

## 🏃‍♂️ Next Steps

1. **Start Python service**: `python main.py` (port 8000)
2. **Start Java backend**: `mvn spring-boot:run` (port 8080)
3. **Test health check**: `GET /api/recommendation/health`
4. **Initialize sample data**: `POST /api/recommendation/init-sample-data`
5. **Test CV upload**: Upload a test CV file

## 🐛 Troubleshooting

### **Python service không phản hồi:**
- Check service health: `GET /api/recommendation/health`
- Verify `PYTHON_SERVICE_URL` environment variable
- Check Python service logs

### **File upload errors:**
- Supported formats: PDF, DOCX, DOC
- Max file size: 10MB
- Check file permissions

### **Authentication errors:**
- Ensure valid JWT token in Authorization header
- Check user roles (USER for most endpoints, ADMIN for init data)

## 🎯 Performance Tips

- **Caching**: Python service có thể cache embeddings
- **Async processing**: Có thể implement cho large CV files
- **Connection pooling**: Feign client tự động handle
- **Timeout settings**: Đã config trong application.yml

---

*Guide này cung cấp tất cả thông tin cần thiết để tích hợp và sử dụng Job Recommendation System.* 