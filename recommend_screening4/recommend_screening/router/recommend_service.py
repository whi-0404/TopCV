import os
import time
import tempfile
from typing import Optional, Dict, Any
from pathlib import Path
from datetime import datetime, timedelta

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Query, BackgroundTasks, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn

from models.cv_data import CVData, ExperienceLevel, JobType, EducationLevel, WorkExperience
from models.job_data import JobData
from models.recommendation import RecommendationRequest, RecommendationResponse
from core.extract_cv import CVExtractor
from core.recommen_engine  import ModernRecommendationEngine as RecommendationEngine
from models.skills import SkillManager
from config import Config
from core.screening_cv import screen_cv


app = FastAPI(
    title="TopCV Job Recommendation System",
    description="Hệ thống gợi ý công việc thông minh dựa trên phân tích CV",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cv_extractor: Optional[CVExtractor] = None
recommendation_engine: Optional[RecommendationEngine] = None
skill_manager: Optional[SkillManager] = None

job_database: list[JobData] = []
config = Config()
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

class JavaJobData(BaseModel):
    """Job data model from Java SpringBoot"""
    job_id: str
    job_title: str = ""
    company_name: str = ""
    location: Optional[str] = ""
    description: Optional[str] = ""
    requirements: Optional[str] = ""
    benefits: Optional[str] = ""
    core_skills: Optional[str] = ""
    experience_required: Optional[str] = ""

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

def _create_cv_summary(cv_data: CVData) -> Dict[str, Any]:
    """Tạo summary cho CV data - EXACT Java DTO format"""
    return {
        "basicInfo": {
            "name": cv_data.full_name or "",
            "email": cv_data.email or "",
            "phone": cv_data.phone or "",
            "location": cv_data.address or "",
            "currentPosition": cv_data.job_title or ""
        },
        "experience": {
            "totalYears": int(cv_data.years_experience) if cv_data.years_experience else 0,
            "positionsCount": len(cv_data.work_experience) if cv_data.work_experience else 0,
            "latestPosition": cv_data.work_experience[0].__dict__ if cv_data.work_experience else None
        },
        "skills": {
            "technicalSkills": cv_data.technical_skills if cv_data.technical_skills else [],
            "softSkills": cv_data.soft_skills if cv_data.soft_skills else [],
            "languages": cv_data.languages if cv_data.languages else [],
            "totalTechnical": len(cv_data.technical_skills) if cv_data.technical_skills else 0
        },
        "education": {
            "highestLevel": str(cv_data.education_level) if cv_data.education_level else "Unknown",
            "educationLevel": str(cv_data.education_level) if cv_data.education_level else "Unknown"
        },
        "workExperienceCount": len(cv_data.work_experience) if cv_data.work_experience else 0,
        "projectsCount": len(cv_data.projects) if cv_data.projects else 0
    }

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    global cv_extractor, recommendation_engine, skill_manager
    
    try:
        # Validate configuration
        config.validate_config()
        
        # Initialize services
        cv_extractor = CVExtractor(config)
        recommendation_engine = RecommendationEngine()
        skill_manager = SkillManager()
        
        print("✅ Job Recommendation System started successfully")
        print(f"🔧 Config: {config.LLM_MODEL}, Skills: {len(SkillManager.STANDARD_SKILLS)}")
        
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


@app.post("/cv/upload")
async def upload_cv_and_recommend(
    file: UploadFile = File(...),
    top_k: int = Form(5),
    min_score: float = Form(0.3),
    location: Optional[str] = Form(None),
    job_type: Optional[str] = Form(None)
):
    """Upload CV file và nhận job recommendations - EXACT Java format"""
    if not cv_extractor or not recommendation_engine:
        raise HTTPException(status_code=503, detail="Services chưa sẵn sàng")
    
    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="Tên file không hợp lệ")
    
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in config.SUPPORTED_FILE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type không được hỗ trợ. Hỗ trợ: {config.SUPPORTED_FILE_TYPES}"
        )
    
    # Check file size
    content = await file.read()
    if len(content) > config.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail=f"File quá lớn. Tối đa: {config.MAX_FILE_SIZE_MB}MB"
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
        
        # Convert recommendations to EXACT Java format
        java_recommendations = []
        for rec in recommendations:
            try:
                java_rec = {
                    "jobId": str(rec.job_data.job_id) if rec.job_data.job_id else "",
                    "jobTitle": str(rec.job_data.job_title) if rec.job_data.job_title else "",
                    "company": str(rec.job_data.company) if rec.job_data.company else "",
                    "location": str(rec.job_data.location) if rec.job_data.location else "",
                    "matchScore": float(rec.overall_score) if rec.overall_score else 0.0,
                    "jobType": str(rec.job_data.job_type) if rec.job_data.job_type else "",
                    "requiredSkills": rec.job_data.required_skills if rec.job_data.required_skills else [],
                    "minExperience": int(rec.job_data.min_experience) if rec.job_data.min_experience else 0,
                    "jobDescription": str(rec.job_data.job_description) if rec.job_data.job_description else "",
                    "matchingSkills": rec.matching_details.matched_skills if rec.matching_details.matched_skills else [],
                    "missingSkills": rec.matching_details.missing_skills if rec.matching_details.missing_skills else [],
                    "matchExplanation": "; ".join(rec.recommendation_reasons) if rec.recommendation_reasons else "",
                    "additionalInfo": {
                        "skills_score": float(rec.matching_details.skills_score) if rec.matching_details.skills_score else 0.0,
                        "experience_score": float(rec.matching_details.experience_score) if rec.matching_details.experience_score else 0.0,
                        "project_score": float(rec.matching_details.project_score) if rec.matching_details.project_score else 0.0,
                        "education_score": float(rec.matching_details.education_score) if rec.matching_details.education_score else 0.0,
                        "location_score": float(rec.matching_details.location_score) if rec.matching_details.location_score else 0.0,
                        "semantic_score": float(rec.matching_details.semantic_score) if rec.matching_details.semantic_score else 0.0
                    }
                }
                java_recommendations.append(java_rec)
                
            except Exception as e:
                print(f"❌ Error converting recommendation: {e}")
                continue
        
        # Return EXACT Java DTO format
        response_data = {
            "success": True,  # Boolean
            "message": f"CV processed successfully. Found {len(java_recommendations)} recommendations.",  # String
            "cvSummary": cv_summary,  # CVSummary object
            "recommendations": java_recommendations,  # List<JobRecommendation>
            "totalJobsAnalyzed": len(job_database),  # Integer
            "processingTimeMs": round(processing_time, 2)  # Double
        }
        
        print(f"✅ FINAL RESPONSE: success={response_data['success']}, recommendations_count={len(java_recommendations)}")
        
        # Return as JSONResponse to avoid Pydantic validation
        from fastapi.responses import JSONResponse
        return JSONResponse(content=response_data, status_code=200)
        
    except Exception as e:
        # Clean up temp file if error
        if 'tmp_file_path' in locals():
            try:
                os.unlink(tmp_file_path)
            except:
                pass
        
        print(f"❌ ERROR in CV processing: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý CV: {str(e)}")
    

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
        print(f"🔍 DEBUG: Full screening result: {screening_result}")
        
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
        response_data = {
            "success": True,
            "candidateDecision": decision,  # camelCase for Java
            "overallScore": float(overall_score),
            "matchingPoints": screening_result.get("matching_points", []),
            "notMatchingPoints": screening_result.get("not_matching_points", []),
            "recommendation": recommendation,
            "jobId": job_info.get("job_id"),
            "jobTitle": job_info.get("job_title"),
            "companyName": job_info.get("company_name"),
            "message": f"CV đã được phân tích thành công. Quyết định: {decision}"
        }
        
        print(f"🔍 DEBUG: Python response data: {response_data}")
        
        return JSONResponse(
            status_code=200,
            content=response_data
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

@app.post("/jobs/sync-from-backend")  
async def sync_job_from_backend(request: Request):
    """
    Sync single job from Java backend to Python service
    Called internally by Java when a job is needed for screening
    """
    try:
        # Log raw request details
        print(f"🔍 DEBUG: Request method: {request.method}")
        print(f"🔍 DEBUG: Request URL: {request.url}")
        print(f"🔍 DEBUG: Request headers: {dict(request.headers)}")
        
        # Get raw body
        raw_body = await request.body()
        print(f"🔍 DEBUG: Raw body: {raw_body}")
        print(f"🔍 DEBUG: Raw body length: {len(raw_body)}")
        
        if len(raw_body) == 0:
            print("❌ EMPTY BODY RECEIVED!")
            raise HTTPException(status_code=400, detail="Empty request body")
        
        # Try to parse as JSON
        try:
            import json
            job_data_dict = json.loads(raw_body.decode('utf-8'))
            print(f"🔍 DEBUG: Parsed JSON: {job_data_dict}")
        except Exception as json_error:
            print(f"❌ JSON parsing error: {json_error}")
            raise HTTPException(status_code=400, detail=f"Invalid JSON: {json_error}")
        
        # Extract fields from dict
        job_id = str(job_data_dict.get("job_id", ""))
        job_title = str(job_data_dict.get("job_title", ""))
        company_name = str(job_data_dict.get("company_name", ""))
        location = str(job_data_dict.get("location", ""))
        description = str(job_data_dict.get("description", ""))
        requirements = str(job_data_dict.get("requirements", ""))
        benefits = str(job_data_dict.get("benefits", ""))
        core_skills = str(job_data_dict.get("core_skills", ""))
        experience_required = str(job_data_dict.get("experience_required", ""))
        
        print(f"🔍 DEBUG: Parsed job:")
        print(f"   job_id: {job_id}")
        print(f"   job_title: {job_title}")
        print(f"   company_name: {company_name}")
        
        # Convert to Python JobData format
        job = JobData(
            job_id=job_id,
            job_title=job_title,
            company=company_name,
            location=location,
            job_type="Full-time",  # Default
            required_skills=core_skills.split(", ") if core_skills else [],
            min_experience=1,  # Default
            education_requirement="",
            job_description=description,
            responsibilities=[],
            benefits=benefits.split(", ") if benefits else [],
            posted_date=datetime.now(),
            deadline=datetime.now() + timedelta(days=30)
        )
        
        # Add to database (replace if exists)
        global job_database
        job_database = [j for j in job_database if j.job_id != job.job_id]  # Remove existing
        job_database.append(job)
        print("job_database: ", job_database)
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": f"Job {job.job_id} synced successfully",
                "job_title": job.job_title
            }
        )
        
    except Exception as e:
        print(f"❌ ERROR in sync_job_from_backend: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to sync job: {str(e)}"
        )
    

if __name__ == "__main__":
    print("🚀 Starting TopCV Job Recommendation System...")
    uvicorn.run(
        "recommendation_service:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )