# AI Integration - Job Recommendation & CV Screening

## Tổng quan
Module này tích hợp chức năng AI từ Python service vào Spring Boot backend để cung cấp:
1. **Job Recommendation** - Gợi ý công việc dựa trên CV
2. **CV Screening** - Tự động chấm điểm CV khi apply job

## Các file đã tạo

### 1. Configuration
- `PythonServiceConfig.java` - Cấu hình cho Python service
- `RestTemplateConfig.java` - Cấu hình RestTemplate 
- `application.yml` - Thêm config cho python-service

### 2. DTOs
- `CVAnalysisRequest.java` - Request cho CV analysis
- `JobRecommendationResponse.java` - Response cho job recommendation
- `CVScreeningResponse.java` - Response cho CV screening

### 3. Services
- `PythonServiceClient.java` - Interface gọi Python API
- `PythonServiceClientImpl.java` - Implementation gọi Python service

### 4. Controllers
- `AIRecommendationController.java` - Controller cho các AI features

### 5. Error Handling
- Thêm error codes trong `ErrorCode.java`

## API Endpoints

### Job Recommendation
```
POST /api/v1/ai/recommend-jobs
Content-Type: multipart/form-data
Authorization: Bearer {token}
Role: USER

Parameters:
- cv_file: MultipartFile (required)
- top_k: Integer (default: 5) 
- min_score: Double (default: 0.3)
- location: String (optional)
- job_type: String (optional)

Response: JobRecommendationResponse
```

### CV Screening
```
POST /api/v1/ai/apply-job/{jobId}
Content-Type: multipart/form-data  
Authorization: Bearer {token}
Role: USER

Parameters:
- jobId: Integer (path variable)
- cv_file: MultipartFile (required)

Response: CVScreeningResponse
```

### Admin Endpoints
```
GET /api/v1/ai/health - Check Python service health
POST /api/v1/ai/sync-jobs - Sync all jobs to Python
DELETE /api/v1/ai/clear-jobs - Clear Python jobs
```

## Cách sử dụng

### 1. Start Python Service
```bash
cd recommend_screening
python router/recommend_service.py
```

### 2. Call API từ Frontend

**Job Recommendation:**
```javascript
const formData = new FormData();
formData.append('cv_file', cvFile);
formData.append('top_k', 5);
formData.append('location', 'Ho Chi Minh');

const response = await fetch('/TopCV/api/v1/ai/recommend-jobs', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

**CV Screening:**
```javascript
const formData = new FormData();
formData.append('cv_file', cvFile);

const response = await fetch(`/TopCV/api/v1/ai/apply-job/${jobId}`, {
  method: 'POST', 
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

## Configuration

Trong `application.yml`:
```yaml
python-service:
  base-url: http://localhost:8000
  timeout-seconds: 30
  endpoints:
    cv-upload: /cv/upload
    job-screening: /screening/apply-job
    job-sync: /jobs/sync-from-backend
```

## Data Flow

### Job Recommendation Flow:
1. User upload CV qua `/api/v1/ai/recommend-jobs`
2. SpringBoot gọi Python `/cv/upload` với CV file
3. Python phân tích CV và trả về job recommendations
4. SpringBoot trả response cho frontend

### CV Screening Flow:
1. User click apply job qua `/api/v1/ai/apply-job/{jobId}`
2. SpringBoot lấy job data từ PostgreSQL
3. SpringBoot sync job data qua Python `/jobs/sync-from-backend`
4. SpringBoot gọi Python `/screening/apply-job` với CV + jobId
5. Python screening CV và trả về score + decision
6. SpringBoot trả response cho frontend

## Error Handling

Các error codes mới:
- `1030` - EXTERNAL_SERVICE_ERROR
- `1031` - PYTHON_SERVICE_UNAVAILABLE
- `1032` - CV_ANALYSIS_FAILED  
- `1033` - CV_SCREENING_FAILED

## Security

- Tất cả endpoints yêu cầu authentication
- Job recommendation và CV screening: Role USER
- Admin endpoints: Role ADMIN
- File validation: PDF, DOC, DOCX only

## Notes

- CV files không được lưu vào database, chỉ process tạm thời
- Python service cần chạy trước khi sử dụng các AI features
- Job data sẽ được sync tự động từ PostgreSQL sang Python khi cần
- Có retry logic và error handling khi Python service unavailable 