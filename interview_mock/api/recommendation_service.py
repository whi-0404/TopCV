"""
FastAPI Service cho Job Recommendation System
"""
from __future__ import annotations

import os
import time
import tempfile
from typing import Optional, Dict, Any
from pathlib import Path
from datetime import datetime, timedelta

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Query, BackgroundTasks, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn

from core.models import (
    CVData, JobData, RecommendationRequest, RecommendationResponse,
    RecommendationResult, ErrorResponse, SkillAnalysis, ExperienceLevel, JobType
)
from core.cv_extractor import CVExtractor
from core.recommendation_engine import ModernRecommendationEngine as RecommendationEngine
from core.skills import SkillManager
from config import Config

# Import CV Screening functionality
from screening_cv import screen_cv

# Initialize FastAPI app
app = FastAPI(
    title="TopCV Job Recommendation System",
    description="Hệ thống gợi ý công việc thông minh dựa trên phân tích CV",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global services
cv_extractor: Optional[CVExtractor] = None
recommendation_engine: Optional[RecommendationEngine] = None
skill_manager: Optional[SkillManager] = None

# In-memory job storage (replace with database in production)
job_database: list[JobData] = []

# Request/Response Models
class UploadCVRequest(BaseModel):
    """Request model for CV upload"""
    include_analysis: bool = True
    top_k: int = 10
    min_score: float = 0.3

class JobUploadRequest(BaseModel):
    """Request model for job upload"""
    job_data: JobData

class CVAnalysisRequest(BaseModel):
    """Request model for CV text analysis"""
    cv_text: str

class RecommendationFilterRequest(BaseModel):
    """Request model for recommendation with filters"""
    cv_data: CVData
    location_filter: Optional[str] = None
    job_type_filter: Optional[JobType] = None
    experience_level_filter: Optional[ExperienceLevel] = None
    salary_min: Optional[int] = None
    top_k: int = 10
    min_score: float = 0.3

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    message: str
    version: str
    services: Dict[str, bool]

class RecommendationRequest(BaseModel):
    """Request để tìm kiếm job recommendation"""
    cv_text: Optional[str] = None
    top_k: Optional[int] = 5
    min_score: Optional[float] = 0.3
    location: Optional[str] = None
    job_type: Optional[str] = None

# CV Screening Models
class ScreeningJobData(BaseModel):
    """Job data model for CV screening"""
    job_id: int
    job_title: str
    company_name: str
    description: str
    requirements: str
    core_skills: str
    experience_required: str
    location: Optional[str] = None
    benefits: Optional[str] = None

class ScreeningResponse(BaseModel):
    """Response model for CV screening"""
    success: bool
    candidate_decision: str  # PASS, FAIL, REVIEW
    overall_score: float
    matching_points: list[str]
    not_matching_points: list[str]
    recommendation: str
    job_id: Optional[int] = None
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    message: Optional[str] = None

# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    global cv_extractor, recommendation_engine, skill_manager
    
    try:
        # Validate configuration
        Config.validate_config()
        
        # Initialize services
        cv_extractor = CVExtractor()
        recommendation_engine = RecommendationEngine()
        skill_manager = SkillManager()
        
        print("✅ Job Recommendation System started successfully")
        print(f"🔧 Config: {Config.LLM_MODEL}, Skills: {len(SkillManager.STANDARD_SKILLS)}")
        
    except Exception as e:
        print(f"❌ Error starting services: {e}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("🔄 Shutting down Job Recommendation System...")

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="Job Recommendation System is running",
        version="2.0.0",
        services={
            "cv_extractor": cv_extractor is not None,
            "recommendation_engine": recommendation_engine is not None,
            "skill_manager": skill_manager is not None
        }
    )

# CV processing endpoints
@app.post("/cv/upload", response_model=RecommendationResponse)
async def upload_cv_and_recommend(
    file: UploadFile = File(...),
    top_k: int = Form(5),
    min_score: float = Form(0.3),
    location: Optional[str] = Form(None),
    job_type: Optional[str] = Form(None)
):
    """Upload CV file và nhận job recommendations"""
    if not cv_extractor or not recommendation_engine:
        raise HTTPException(status_code=503, detail="Services chưa sẵn sàng")
    
    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="Tên file không hợp lệ")
    
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in Config.SUPPORTED_FILE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type không được hỗ trợ. Hỗ trợ: {Config.SUPPORTED_FILE_TYPES}"
        )
    
    # Check file size
    content = await file.read()
    if len(content) > Config.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail=f"File quá lớn. Tối đa: {Config.MAX_FILE_SIZE_MB}MB"
        )
    
    try:
        start_time = time.time()
        
        # Save temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp_file:
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        # Extract CV data
        cv_data = cv_extractor.extract_from_file(tmp_file_path)
        
        # Clean up temp file
        os.unlink(tmp_file_path)
        
        # Create CV summary
        cv_summary = _create_cv_summary(cv_data)
        
        # Get recommendations if we have jobs
        recommendations = []
        if job_database:
            filters = {}
            if location:
                filters['location'] = location
            if job_type:
                filters['job_type'] = job_type
            recommendations = recommendation_engine.generate_recommendations(
                cv_data=cv_data,
                job_list=job_database,
                top_k=top_k,
                min_score=min_score,
                filters=filters
            )
        
        processing_time = (time.time() - start_time) * 1000
        
        # Return wrapped response
        return RecommendationResponse(
            success=True,
            message=f"CV processed successfully. Found {len(recommendations)} recommendations.",
            cv_summary=cv_summary,
            recommendations=recommendations,
            total_jobs_analyzed=len(job_database),
            processing_time_ms=round(processing_time, 2)
        )
        
    except Exception as e:
        # Clean up temp file if error
        if 'tmp_file_path' in locals():
            try:
                os.unlink(tmp_file_path)
            except:
                pass
        
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý CV: {str(e)}")

@app.post("/cv/analyze-text", response_model=RecommendationResponse)
async def analyze_cv_text(request: CVAnalysisRequest):
    """Phân tích CV từ text content"""
    if not cv_extractor:
        raise HTTPException(status_code=503, detail="CV Extractor chưa sẵn sàng")
    
    try:
        start_time = time.time()
        
        # Extract CV data from text
        cv_data = cv_extractor.extract_from_text(request.cv_text)
        
        # Create summary
        cv_summary = _create_cv_summary(cv_data)
        
        processing_time = (time.time() - start_time) * 1000
        
        return RecommendationResponse(
            success=True,
            message="CV text đã được phân tích thành công",
            cv_summary=cv_summary,
            recommendations=[],
            total_jobs_analyzed=0,
            processing_time_ms=round(processing_time, 2)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi phân tích text: {str(e)}")

# Recommendation endpoints
@app.post("/recommend", response_model=list[RecommendationResult])
async def recommend_jobs(request: RecommendationRequest):
    """Tìm kiếm job recommendations dựa trên CV text"""
    if not recommendation_engine:
        raise HTTPException(status_code=503, detail="Recommendation Engine chưa sẵn sàng")
    
    if not job_database:
        return []
    
    try:
        start_time = time.time()
        
        # Tạo filters
        filters = {}
        if request.location:
            filters['location'] = request.location
        if request.job_type:
            filters['job_type'] = request.job_type
        
        # Generate recommendations
        recommendations = recommendation_engine.generate_recommendations(
            cv_data=request.cv_data,
            job_list=job_database,
            top_k=request.top_k,
            min_score=request.min_score,
            filters=filters
        )
        
        processing_time = (time.time() - start_time) * 1000
        
        return recommendations
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi tạo recommendations: {str(e)}")

# Job management endpoints
@app.post("/jobs/upload")
async def upload_job(request: JobUploadRequest):
    """Upload job data vào hệ thống"""
    try:
        # Validate and clean job data
        job_data = request.job_data
        
        # Add to database
        job_database.append(job_data)
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": f"Đã thêm công việc: {job_data.job_title} tại {job_data.company}",
                "total_jobs": len(job_database),
                "job_id": job_data.job_id
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi upload job: {str(e)}")

@app.get("/jobs")
async def get_jobs(
    limit: int = Query(20, ge=1, le=100, description="Số lượng jobs"),
    skip: int = Query(0, ge=0, description="Bỏ qua bao nhiêu jobs"),
    location: Optional[str] = Query(None, description="Lọc theo địa điểm"),
    job_type: Optional[JobType] = Query(None, description="Lọc theo loại công việc")
):
    """Lấy danh sách jobs với pagination và filters"""
    try:
        filtered_jobs = job_database.copy()
        
        # Apply filters
        if location:
            filtered_jobs = [
                job for job in filtered_jobs
                if location.lower() in job.location.lower()
            ]
        
        if job_type:
            filtered_jobs = [
                job for job in filtered_jobs
                if job.job_type == job_type
            ]
        
        # Apply pagination
        total = len(filtered_jobs)
        jobs = filtered_jobs[skip:skip + limit]
        
        # Convert jobs to serializable format
        serialized_jobs = []
        for job in jobs:
            job_dict = job.model_dump()
            # Convert datetime to ISO string
            if job_dict.get('posted_date'):
                job_dict['posted_date'] = job.posted_date.isoformat() if job.posted_date else None
            if job_dict.get('deadline'):
                job_dict['deadline'] = job.deadline.isoformat() if job.deadline else None
            serialized_jobs.append(job_dict)
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "total_jobs": total,
                "returned_jobs": len(jobs),
                "skip": skip,
                "limit": limit,
                "jobs": serialized_jobs
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy jobs: {str(e)}")

@app.delete("/jobs/clear")
async def clear_all_jobs():
    """Xóa tất cả jobs (for testing)"""
    global job_database
    job_count = len(job_database)
    job_database.clear()
    
    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "message": f"Đã xóa {job_count} jobs khỏi database"
        }
    )

# Skills endpoints
@app.get("/skills")
async def get_supported_skills():
    """Lấy danh sách skills được hỗ trợ"""
    try:
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "total_skills": len(SkillManager.STANDARD_SKILLS),
                "skills": SkillManager.STANDARD_SKILLS
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy skills: {str(e)}")

@app.post("/skills/extract")
async def extract_skills_from_text(text: str):
    """Extract skills từ text"""
    if not skill_manager:
        raise HTTPException(status_code=503, detail="Skill Manager chưa sẵn sàng")
    
    try:
        skills = skill_manager.extract_skills_from_text(text)
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "text": text[:100] + "..." if len(text) > 100 else text,
                "extracted_skills": skills,
                "total_skills": len(skills)
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi extract skills: {str(e)}")

# Statistics endpoints
@app.get("/stats")
async def get_system_stats():
    """Lấy thống kê hệ thống"""
    try:
        # Calculate job statistics
        job_types = {}
        locations = {}
        for job in job_database:
            # Safe access to job_type 
            job_type_val = job.job_type if isinstance(job.job_type, str) else job.job_type.value
            job_types[job_type_val] = job_types.get(job_type_val, 0) + 1
            locations[job.location] = locations.get(job.location, 0) + 1
        
        return JSONResponse(
            status_code=200,
            content={
                "system_status": "running",
                "total_jobs": len(job_database),
                "total_skills": len(SkillManager.STANDARD_SKILLS),
                "job_types": job_types,
                "top_locations": dict(sorted(locations.items(), key=lambda x: x[1], reverse=True)[:10]),
                "services": {
                    "cv_extractor": cv_extractor is not None,
                    "recommendation_engine": recommendation_engine is not None,
                    "skill_manager": skill_manager is not None
                },
                "config": {
                    "model": Config.LLM_MODEL,
                    "max_file_size_mb": Config.MAX_FILE_SIZE_MB,
                    "supported_types": Config.SUPPORTED_FILE_TYPES
                }
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy stats: {str(e)}")

# Utility functions
def _create_cv_summary(cv_data: CVData) -> Dict[str, Any]:
    """Tạo summary cho CV data"""
    return {
        "basic_info": {
            "name": cv_data.full_name,
            "email": cv_data.email,
            "phone": cv_data.phone,
            "location": cv_data.address,
            "current_position": cv_data.job_title
        },
        "experience": {
            "total_years": cv_data.years_experience,
            "positions_count": len(cv_data.work_experience),
            "latest_position": cv_data.work_experience[0] if cv_data.work_experience else None
        },
        "skills": {
            "technical_skills": cv_data.technical_skills,
            "soft_skills": cv_data.soft_skills,
            "languages": cv_data.languages,
            "total_technical": len(cv_data.technical_skills)
        },
        "education": {
            "highest_level": cv_data.education_level,
            "education_level": cv_data.education_level
        },
                    "work_experience_count": len(cv_data.work_experience),
            "projects_count": len(cv_data.projects) if cv_data.projects else 0
    }

# Sample data endpoints (for testing)
@app.post("/test/add-sample-jobs")
async def add_sample_jobs():
    """Thêm sample jobs cho testing"""
    from datetime import datetime
    
    sample_jobs = [
        JobData(
            job_id="job_001",
            job_title="Python Developer",
            company="TechCorp Vietnam",
            location="Ha Noi",
            job_type="Full-time",
            required_skills=["Python", "Django", "REST API", "PostgreSQL"],
            min_experience=2,
            education_requirement="Bachelor in Computer Science",
            job_description="Phát triển ứng dụng web với Python và Django framework",
            responsibilities=["Develop web applications", "Design APIs", "Write clean code"],
            benefits=["Health insurance", "13th month bonus", "Learning budget"],
            posted_date=datetime(2025, 1, 15, 9, 0, 0),
            deadline=datetime(2025, 2, 15, 23, 59, 59)
        ),
        JobData(
            job_id="job_002",
            job_title="ReactJS Developer",
            company="Frontend Solutions",
            location="Ho Chi Minh City",
            job_type="Full-time",
            required_skills=["ReactJS", "TypeScript", "HTML5", "CSS3"],
            min_experience=1,
            education_requirement="College degree or equivalent",
            job_description="Xây dựng giao diện người dùng với ReactJS và TypeScript",
            responsibilities=["Build UI components", "Collaborate with designers", "Optimize performance"],
            benefits=["Remote work options", "Modern tech stack", "Career development"],
            posted_date=datetime(2025, 1, 12, 10, 0, 0),
            deadline=datetime(2025, 2, 12, 18, 0, 0)
        ),
        JobData(
            job_id="job_003",
            job_title="Full Stack Developer",
            company="Innovation Lab",
            location="Da Nang",
            job_type="Full-time",
            required_skills=["JavaScript", "Node.js", "React", "MongoDB"],
            min_experience=3,
            education_requirement="Bachelor degree in IT",
            job_description="Phát triển full stack với Node.js và React",
            responsibilities=["Full-stack development", "Database design", "API development"],
            benefits=["Competitive salary", "Flexible hours", "Team building"],
            posted_date=datetime(2025, 1, 10, 8, 30, 0),
            deadline=datetime(2025, 2, 10, 17, 0, 0)
        ),
        JobData(
            job_id="job_004",
            job_title="DevOps Engineer",
            company="CloudTech Solutions",
            location="Ho Chi Minh City",
            job_type="Contract",
            required_skills=["Docker", "Kubernetes", "AWS", "Jenkins"],
            min_experience=4,
            education_requirement="Bachelor in Computer Science or equivalent",
            job_description="Manage infrastructure and CI/CD pipelines",
            responsibilities=["Manage CI/CD", "Deploy applications", "Monitor systems"],
            benefits=["Contract rate $50/hour", "Remote work", "Latest tech"],
            posted_date=datetime(2025, 1, 8, 14, 0, 0),
            deadline=datetime(2025, 2, 8, 17, 0, 0)
        ),
        JobData(
            job_id="job_005",
            job_title="Junior Mobile Developer",
            company="Mobile Innovation Hub",
            location="Ha Noi",
            job_type="Internship",
            required_skills=["Flutter", "Dart", "React Native", "JavaScript"],
            min_experience=0,
            education_requirement="Currently studying Computer Science",
            job_description="Learn mobile app development with Flutter and React Native",
            responsibilities=["Assist in mobile development", "Learn best practices", "Write clean code"],
            benefits=["Internship allowance", "Mentorship", "Real project experience"],
            posted_date=datetime(2025, 1, 5, 9, 0, 0),
            deadline=datetime(2025, 3, 1, 18, 0, 0)
        )
    ]
    
    global job_database
    job_database.extend(sample_jobs)
    
    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "message": f"Đã thêm {len(sample_jobs)} sample jobs",
            "total_jobs": len(job_database),
            "added_jobs": [job.job_title for job in sample_jobs]
        }
    )

# CV Screening Endpoints
@app.post("/screening/apply-job", response_model=ScreeningResponse)
async def apply_job_with_cv_screening(
    cv_file: UploadFile = File(...),
    job_id: int = Query(...)
) -> ScreeningResponse:
    """
    API cho ứng viên apply job - tự động screening CV
    Input: CV file + job_id
    Process: Tự động lấy job data từ database + chấm điểm CV
    Output: Điểm số + PASS/FAIL/REVIEW decision
    """
    temp_path = None
    try:
        print(f"🔍 DEBUG: Received CV file: {cv_file.filename}, Job ID: {job_id}")
        print(f"🔍 DEBUG: CV file size: {cv_file.size} bytes")
        
        # Validate CV file
        file_ext = Path(cv_file.filename).suffix.lower() if cv_file.filename else ""
        if file_ext not in [".pdf", ".docx"]:
            raise HTTPException(
                status_code=400,
                detail="Only PDF and DOCX files are supported"
            )

        # Save CV file temporarily
        content = await cv_file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp_file:
            tmp_file.write(content)
            temp_path = tmp_file.name

        print(f"🔍 DEBUG: Searching for job ID {job_id} in database with {len(job_database)} jobs")
        
        # Find job data from database by job_id
        job_info = None
        for job in job_database:
            print(f"🔍 DEBUG: Checking job {job.job_id} against {job_id}")
            # Handle both string and int job_id formats
            if (job.job_id == str(job_id) or 
                job.job_id == f"job_{job_id:03d}" or 
                job.job_id == f"job_00{job_id}"):
                job_info = {
                    "job_id": job_id,
                    "job_title": job.job_title,
                    "company_name": job.company,
                    "description": job.job_description,
                    "requirements": ", ".join(job.required_skills) if job.required_skills else "",
                    "core_skills": ", ".join(job.required_skills) if job.required_skills else "",
                    "experience_required": f"{job.min_experience}+ years experience required",
                    "location": job.location,
                    "benefits": ", ".join(job.benefits) if job.benefits else ""
                }
                print(f"✅ DEBUG: Found matching job: {job.job_title}")
                break
        
        if not job_info:
            print(f"❌ DEBUG: Job with ID {job_id} not found. Available jobs: {[j.job_id for j in job_database]}")
            raise HTTPException(
                status_code=404,
                detail=f"Job with ID {job_id} not found in database"
            )

        # Prepare JD data for screening từ PostgreSQL database
        jd_for_screening = {
            "job_title": job_info.get("job_title", ""),
            "core_skills": job_info.get("core_skills", ""),
            "requirements": job_info.get("requirements", ""),
            "description": job_info.get("description", ""),
            "experience_required": job_info.get("experience_required", ""),
        }

        print(f"🔍 DEBUG: Starting CV screening with AI...")
        # Process CV screening với AI
        screening_result = screen_cv(temp_path, jd_for_screening)
        print(f"✅ DEBUG: AI screening completed with score: {screening_result.get('overall_score', 0)}")
        
        # Determine candidate decision based on score
        overall_score = screening_result.get("overall_score", 0)
        if overall_score >= 4.0:
            decision = "PASS"
            recommendation = "Ứng viên có năng lực tốt, phù hợp với vị trí này."
        elif overall_score >= 2.5:
            decision = "REVIEW"
            recommendation = "Ứng viên cần được xem xét kỹ thêm trong vòng phỏng vấn."
        else:
            decision = "FAIL"
            recommendation = "Ứng viên chưa đáp ứng đủ yêu cầu cho vị trí này."

        # Format response
        return ScreeningResponse(
            success=True,
            candidate_decision=decision,
            overall_score=float(overall_score),
            matching_points=screening_result.get("matching_points", []),
            not_matching_points=screening_result.get("not_matching_points", []),
            recommendation=recommendation,
            job_id=job_info.get("job_id"),
            job_title=job_info.get("job_title"),
            company_name=job_info.get("company_name"),
            message=f"CV đã được phân tích thành công. Quyết định: {decision}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ DEBUG: Error in CV screening: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"CV analysis failed: {str(e)}"
        )
    finally:
        # Clean up temp file
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)

@app.post("/screening/hr-review", response_model=ScreeningResponse)
async def hr_cv_analysis(
    cv_file: UploadFile = File(...),
    job_id: int = Form(...)
) -> ScreeningResponse:
    """
    API cho HR review CV ứng viên đã apply
    Input: CV file + job_id  
    Output: Detailed screening analysis cho HR
    """
    temp_path = None
    try:
        # Validate CV file
        file_ext = Path(cv_file.filename).suffix.lower() if cv_file.filename else ""
        if file_ext not in [".pdf", ".docx"]:
            raise HTTPException(
                status_code=400,
                detail="Only PDF and DOCX files are supported"
            )

        # Save CV file temporarily
        content = await cv_file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp_file:
            tmp_file.write(content)
            temp_path = tmp_file.name

        # Find job data from database by job_id
        job_info = None
        for job in job_database:
            # Handle both string and int job_id formats
            if (job.job_id == str(job_id) or 
                job.job_id == f"job_{job_id:03d}" or 
                job.job_id == f"job_00{job_id}"):
                job_info = {
                    "job_id": job_id,
                    "job_title": job.job_title,
                    "company_name": job.company,
                    "description": job.job_description,
                    "requirements": ", ".join(job.required_skills) if job.required_skills else "",
                    "core_skills": ", ".join(job.required_skills) if job.required_skills else "",
                    "experience_required": f"{job.min_experience}+ years experience required",
                    "location": job.location,
                    "benefits": ", ".join(job.benefits) if job.benefits else ""
                }
                break
        
        if not job_info:
            raise HTTPException(
                status_code=404,
                detail=f"Job with ID {job_id} not found in database"
            )

        # Prepare JD data for screening
        jd_for_screening = {
            "job_title": job_info.get("job_title", ""),
            "core_skills": job_info.get("core_skills", ""),
            "requirements": job_info.get("requirements", ""),
            "description": job_info.get("description", ""),
            "experience_required": job_info.get("experience_required", ""),
        }

        # Process CV screening với AI
        screening_result = screen_cv(temp_path, jd_for_screening)
        
        # Determine candidate decision based on score
        overall_score = screening_result.get("overall_score", 0)
        if overall_score >= 4.0:
            decision = "PASS"
            recommendation = "✅ Recommended: Ứng viên có năng lực tốt, nên mời phỏng vấn."
        elif overall_score >= 2.5:
            decision = "REVIEW"
            recommendation = "⚠️ Need Review: Ứng viên có tiềm năng, cần đánh giá kỹ hơn."
        else:
            decision = "FAIL"
            recommendation = "❌ Not Recommended: Ứng viên chưa đáp ứng yêu cầu cơ bản."

        # Format response cho HR
        return ScreeningResponse(
            success=True,
            candidate_decision=decision,
            overall_score=float(overall_score),
            matching_points=screening_result.get("matching_points", []),
            not_matching_points=screening_result.get("not_matching_points", []),
            recommendation=recommendation,
            job_id=job_info.get("job_id"),
            job_title=job_info.get("job_title"),
            company_name=job_info.get("company_name"),
            message=f"CV analysis completed for HR review. Decision: {decision}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"HR CV analysis failed: {str(e)}"
        )
    finally:
        # Clean up temp file
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)

@app.post("/jobs/sync-from-backend")
async def sync_job_from_backend(job_data: dict):
    """
    Sync single job from Java backend to Python service
    Called internally by Java when a job is needed for screening
    """
    try:
        # Convert Java job format to Python JobData format
        job = JobData(
            job_id=str(job_data.get("job_id", "")),
            job_title=job_data.get("job_title", ""),
            company=job_data.get("company_name", ""),
            location=job_data.get("location", ""),
            job_type="Full-time",  # Default
            required_skills=job_data.get("core_skills", "").split(", ") if job_data.get("core_skills") else [],
            min_experience=1,  # Default
            education_requirement="",
            job_description=job_data.get("description", ""),
            responsibilities=[],
            benefits=job_data.get("benefits", "").split(", ") if job_data.get("benefits") else [],
            posted_date=datetime.now(),
            deadline=datetime.now() + timedelta(days=30)
        )
        
        # Add to database (replace if exists)
        global job_database
        job_database = [j for j in job_database if j.job_id != job.job_id]  # Remove existing
        job_database.append(job)
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": f"Job {job.job_id} synced successfully",
                "job_title": job.job_title
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to sync job: {str(e)}"
        )

# Run server
if __name__ == "__main__":
    print("🚀 Starting TopCV Job Recommendation System...")
    uvicorn.run(
        "recommendation_service:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
