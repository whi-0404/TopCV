# TopCV Job Recommendation & CV Screening System v2.1

Hệ thống gợi ý công việc và chấm điểm CV thông minh sử dụng **Modern Content-Based Filtering** với **Embeddings**, **Cosine Similarity** và **AI-powered CV Screening**.

## 🚀 Features

### CV Processing
- **Multi-format Support**: PDF, DOCX, JPG, PNG
- **LLM-powered Extraction**: Sử dụng Google Gemini để trích xuất thông tin structured
- **Smart Skills Detection**: Tự động nhận diện 300+ technical skills
- **Experience Calculation**: Tính toán tổng số năm kinh nghiệm từ work history

### Modern Recommendation Engine
- **Embedding-based Similarity**: Sử dụng Sentence Transformers (all-MiniLM-L6-v2)
- **Cosine Similarity**: Tính toán độ tương đồng semantic chính xác
- **Multi-field Weighted Scoring**: 
  - Skills Matching (40%): Exact + Semantic matching
  - Experience Matching (30%): Years + Semantic description matching  
  - Semantic Similarity (20%): Full CV vs Job description embeddings
  - Education & Location (10%): Traditional rule-based matching
- **Content-Based Filtering**: Chỉ dựa trên nội dung CV và Job, không cần user interaction data

### CV Screening for HR
- **AI-powered Evaluation**: Sử dụng Google Gemini để chấm điểm CV
- **PostgreSQL Integration**: Lấy job data trực tiếp từ database
- **Pass/Fail/Review Decision**: Tự động phân loại ứng viên
- **Detailed Analysis**: Matching points, gaps analysis, recommendations
- **Score-based Filtering**: Configurable thresholds cho decision making

### API Features
- **RESTful API**: FastAPI với auto-generated docs
- **File Upload**: Upload CV và nhận recommendations ngay
- **Job Management**: Upload và quản lý job descriptions
- **Filtering**: Lọc theo location, job type, experience level
- **Skills Analysis**: Extract và validate skills từ text
- **Screening API**: HR screening endpoints với authentication

## 🏗️ Architecture

```
interview_mock/
├── config.py                 # Cấu hình hệ thống
├── requirements.txt          # Dependencies (includes sentence-transformers + screening)
├── screening_cv.py           # CV screening logic với Gemini AI
├── screening_api.py          # FastAPI service cho CV screening  
├── run_screening_service.py  # Script để chạy screening service
├── core/                     # Core modules
│   ├── models.py            # Pydantic models
│   ├── skills.py            # Skills management
│   ├── cv_extractor.py      # CV extraction với LLM
│   └── recommendation_engine.py # Modern embedding-based engine
├── api/
│   └── recommendation_service.py # FastAPI service cho recommendations
└── TopCV/Backend/            # Java Spring Boot backend
    └── src/main/java/com/TopCV/
        ├── controller/ScreeningController.java
        ├── service/ScreeningService.java
        └── client/ScreeningServiceClient.java
```

## 🔧 Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd interview_mock/interview_mock
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
```bash
# Tạo file .env (optional)
GOOGLE_API_KEY=your_google_api_key_here
DATABASE_URL=postgresql://localhost:5432/topcv
```

### 4. Run Services

#### For Job Recommendations:
```bash
# Development mode
python api/recommendation_service.py

# Production mode
uvicorn api.recommendation_service:app --host 0.0.0.0 --port 8000
```

#### For CV Screening (HR):
```bash
# Easy startup
python run_screening_service.py

# Manual startup
uvicorn screening_api:app --host 0.0.0.0 --port 8000 --reload
```

#### Java Backend (TopCV):
```bash
cd TopCV/Backend
./mvnw spring-boot:run
# Backend available at: http://localhost:8080/TopCV
```

## 📖 API Documentation

**TopCV Unified System** bao gồm:
1. **Job Recommendation** (cho ứng viên tìm việc)
2. **CV Screening** (cho HR chấm điểm CV)

Sau khi start service, truy cập:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Job Recommendation Endpoints

#### CV Processing
```bash
# Upload CV và nhận recommendations  
POST /cv/upload
# Body: multipart/form-data với file

# Phân tích CV từ text
POST /cv/analyze-text  
# Body: {"cv_text": "CV content..."}

# Recommend jobs cho CV text
POST /recommend
# Body: {"cv_text": "...", "top_k": 5, "min_score": 0.3}
```

#### Job Management
```bash
# Upload job description
POST /jobs/upload
# Body: {"job_data": {...}}

# Lấy danh sách jobs
GET /jobs?limit=20&skip=0&location=Hà Nội

# Thêm sample jobs (for testing)
POST /test/add-sample-jobs
```

### CV Screening Endpoints (For HR)

#### CV Analysis
```bash
# Phân tích CV ứng viên cho job cụ thể (từ PostgreSQL)
POST /screening/cv-analysis
# Body: multipart/form-data
# - cv_file: PDF/DOCX file
# - job_data: JSON string với thông tin job từ database

# Response: PASS/FAIL/REVIEW decision với điểm số chi tiết
```

#### Recommendations
```bash
# Tạo recommendations với filters
POST /recommendations/generate
# Body: {
#   "cv_data": {...},
#   "location_filter": "Hà Nội",
#   "top_k": 10,
#   "min_score": 0.3
# }
```

#### Skills & Statistics
```bash
# Lấy danh sách skills hỗ trợ
GET /skills

# Extract skills từ text
POST /skills/extract

# Thống kê hệ thống
GET /stats
```

## 🧠 Modern Algorithm Details

### Skills Matching (40%) - Hybrid Approach
- **Exact Matching (60%)**: Traditional string matching với skill aliases
- **Semantic Matching (40%)**: Embeddings + cosine similarity
- **Combined Score**: Weighted combination của cả hai approaches
- **Skill Groups**: Gom nhóm skills liên quan (React ecosystem, Python stack, etc.)

### Experience Matching (30%) - Dual Analysis
- **Years Analysis (70%)**: Extract và so sánh số năm kinh nghiệm
- **Semantic Analysis (30%)**: Embeddings của work experience vs job requirements
- **Graduated Scoring**: 
  - ≥ requirement: 100%
  - ≥ 80% requirement: 90%
  - ≥ 60% requirement: 70%
  - < 60% requirement: 30-50%

### Semantic Similarity (20%) - Pure Embeddings
- **Sentence Transformers**: all-MiniLM-L6-v2 model
- **CV Embeddings**: Summary, objective, experience descriptions
- **Job Embeddings**: Title, description, requirements
- **Cosine Similarity**: Normalized similarity score [0,1]
- **Embedding Cache**: Tối ưu performance với caching

### Education & Location (10%) - Rule-based
- **Education Hierarchy**: PhD > Master > Bachelor > College > Diploma
- **Location Matching**: Exact, major cities, remote work detection
- **Fallback Logic**: Robust handling cho missing data

## 🔬 Technical Implementation

### Embedding Pipeline
```python
# 1. Text Preprocessing
cv_text = extract_relevant_sections(cv_data)
job_text = create_comprehensive_job_text(job_data)

# 2. Embedding Generation
cv_embedding = sentence_model.encode(cv_text, normalize_embeddings=True)
job_embedding = sentence_model.encode(job_text, normalize_embeddings=True)

# 3. Similarity Calculation
similarity = cosine_similarity(cv_embedding.reshape(1, -1), 
                              job_embedding.reshape(1, -1))[0][0]

# 4. Normalization: [-1,1] → [0,1]
normalized_score = (similarity + 1) / 2
```

### Performance Optimizations
- **Embedding Caching**: Cache computed embeddings để tránh re-computation
- **Batch Processing**: Process multiple jobs simultaneously
- **Pre-computed CV Embeddings**: Compute CV embeddings một lần, reuse cho tất cả jobs
- **Fallback Mechanism**: TF-IDF fallback nếu Sentence Transformer fails

## 🔍 Example Usage

### 1. Upload CV và Nhận Recommendations
```python
import requests

# Upload CV file
files = {'file': open('cv.pdf', 'rb')}
params = {'top_k': 5, 'min_score': 0.4}

response = requests.post(
    'http://localhost:8000/cv/upload',
    files=files,
    params=params
)

result = response.json()
print(f"Tìm thấy {len(result['recommendations'])} công việc phù hợp")
```

### 2. Upload Job Description
```python
job_data = {
        "job_title": "Python Developer",
    "company": "TechCorp",
    "location": "Hà Nội",
    "job_type": "Full-time",
    "description": "Phát triển ứng dụng web với Python",
    "required_skills": ["Python", "Django", "PostgreSQL"],
    "experience_required": "2-3 năm kinh nghiệm"
}

response = requests.post(
    'http://localhost:8000/jobs/upload',
    json={"job_data": job_data}
)
```

### 3. Generate Recommendations với Filters
```python
request_data = {
    "cv_data": cv_data,  # CV data object
    "location_filter": "Hà Nội",
    "job_type_filter": "Full-time",
    "top_k": 10,
    "min_score": 0.3
}

response = requests.post(
    'http://localhost:8000/recommendations/generate',
    json=request_data
)
```

## 🔧 Configuration

### config.py Settings
```python
# Model settings
LLM_MODEL = "gemini-2.0-flash"
SENTENCE_TRANSFORMER_MODEL = "all-MiniLM-L6-v2"

# Matching weights
MATCHING_WEIGHTS = {
    'skills_match': 0.40,
    'experience_match': 0.30,
    'semantic_similarity': 0.20,
    'education_match': 0.05,
    'location_match': 0.05
}

# File settings
MAX_FILE_SIZE_MB = 10
SUPPORTED_FILE_TYPES = ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png']
```

## 🧪 Testing

### 1. Add Sample Jobs
```bash
curl -X POST http://localhost:8000/test/add-sample-jobs
```

### 2. Test CV Upload
```bash
curl -X POST \
  -F "file=@sample_cv.pdf" \
  -F "top_k=5" \
  http://localhost:8000/cv/upload
```

### 3. Health Check
```bash
curl http://localhost:8000/health
```

## 🔄 Integration với TopCV Backend

### Database Integration
Thay thế `job_database` in-memory bằng PostgreSQL:

```python
# Trong production, thay thế bằng:
from sqlalchemy import create_engine
from core.database import JobRepository

job_repository = JobRepository(database_url)
jobs = job_repository.get_active_jobs()
```

### API Integration
Tích hợp vào TopCV system:

```java
// Java backend call Python service
@Service
public class RecommendationService {
    public List<JobRecommendation> getRecommendations(Long userId) {
        // Call Python API
        String url = "http://recommendation-service:8000/recommendations/generate";
        // Process response
    }
}
```

## 🚧 Future Enhancements

1. **Vector Search**: Sử dụng embeddings cho semantic search
2. **ML Model**: Train custom model cho Vietnamese job market
3. **Real-time Processing**: Kafka streaming cho real-time recommendations
4. **A/B Testing**: Framework để test các algorithms khác nhau
5. **Explainable AI**: Chi tiết lý do recommend từng job

## 📊 Performance

- **CV Processing**: ~2-5 seconds/file
- **Recommendations**: ~100-500ms cho 1000 jobs
- **Throughput**: ~100 requests/second
- **Memory Usage**: ~500MB baseline

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Implement changes với tests
4. Submit pull request

## 📝 License

Copyright TopCV Vietnam. All rights reserved. 