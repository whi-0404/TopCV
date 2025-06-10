"""
Pydantic Models cho Job Recommendation System
"""
from __future__ import annotations

from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class ExperienceLevel(str, Enum):
    """Cấp độ kinh nghiệm"""
    INTERN = "Intern"
    FRESHER = "Fresher"
    JUNIOR = "Junior"
    MIDDLE = "Middle"
    SENIOR = "Senior"
    LEAD = "Lead"
    MANAGER = "Manager"

class JobType(str, Enum):
    """Loại công việc"""
    FULL_TIME = "Full-time"
    PART_TIME = "Part-time"
    CONTRACT = "Contract"
    FREELANCE = "Freelance"
    INTERNSHIP = "Internship"

class EducationLevel(str, Enum):
    """Trình độ học vấn"""
    HIGH_SCHOOL = "Trung học"
    DIPLOMA = "Trung cấp"
    COLLEGE = "Cao đẳng"
    BACHELOR = "Đại học"
    MASTER = "Thạc sĩ"
    PHD = "Tiến sĩ"

class WorkExperience(BaseModel):
    """Kinh nghiệm làm việc"""
    position: str = Field(..., description="Vị trí công việc")
    company: str = Field(..., description="Tên công ty")
    duration: str = Field(..., description="Thời gian làm việc")
    description: Optional[str] = Field(None, description="Mô tả công việc")
    start_date: Optional[str] = Field(None, description="Ngày bắt đầu")
    end_date: Optional[str] = Field(None, description="Ngày kết thúc")
    is_current: bool = Field(False, description="Có phải công việc hiện tại")

class Education(BaseModel):
    """Thông tin học vấn"""
    degree: str = Field(..., description="Bằng cấp")
    university: str = Field(..., description="Trường học")
    major: Optional[str] = Field(None, description="Chuyên ngành")
    year: Optional[int] = Field(None, description="Năm tốt nghiệp")
    gpa: Optional[float] = Field(None, description="Điểm GPA")

class Project(BaseModel):
    """Dự án"""
    name: str = Field(..., description="Tên dự án")
    description: str = Field(..., description="Mô tả dự án")
    technologies: list[str] = Field(default_factory=list, description="Công nghệ sử dụng")
    url: Optional[str] = Field(None, description="Link dự án")
    start_date: Optional[str] = Field(None, description="Ngày bắt đầu")
    end_date: Optional[str] = Field(None, description="Ngày kết thúc")

class CVData(BaseModel):
    """CV data extracted from file"""
    full_name: Optional[str] = Field(None, description="Họ tên")
    email: Optional[str] = Field(None, description="Email") 
    phone: Optional[str] = Field(None, description="Số điện thoại")
    address: Optional[str] = Field(None, description="Địa chỉ")
    
    # Career info
    job_title: Optional[str] = Field(None, description="Chức danh công việc hiện tại")
    years_experience: Optional[int] = Field(None, description="Số năm kinh nghiệm")
    current_company: Optional[str] = Field(None, description="Công ty hiện tại")
    
    # Skills
    technical_skills: list[str] = Field(default_factory=list, description="Kỹ năng kỹ thuật")
    soft_skills: list[str] = Field(default_factory=list, description="Kỹ năng mềm")
    languages: list[str] = Field(default_factory=list, description="Ngôn ngữ lập trình")
    tools: list[str] = Field(default_factory=list, description="Công cụ/Framework")
    
    # Education
    education_level: Optional[str] = Field(None, description="Trình độ học vấn")
    major: Optional[str] = Field(None, description="Chuyên ngành")
    university: Optional[str] = Field(None, description="Trường đại học")
    graduation_year: Optional[int] = Field(None, description="Năm tốt nghiệp")
    
    # Projects  
    projects: list[Project] = Field(default_factory=list, description="Các dự án đã thực hiện")
    
    # Work preference
    desired_position: Optional[str] = Field(None, description="Vị trí mong muốn")
    desired_location: Optional[str] = Field(None, description="Địa điểm làm việc mong muốn")
    work_experience: list[str] = Field(default_factory=list, description="Kinh nghiệm làm việc")

class JobData(BaseModel):
    """Job posting data from database"""
    job_id: str = Field(..., description="ID công việc")
    job_title: str = Field(..., description="Tên công việc")
    company: str = Field(..., description="Tên công ty")
    location: str = Field(..., description="Địa điểm")
    job_type: str = Field(..., description="Loại công việc (full-time, part-time, etc.)")
    
    # Job requirements
    required_skills: list[str] = Field(default_factory=list, description="Kỹ năng yêu cầu")
    min_experience: Optional[int] = Field(None, description="Kinh nghiệm tối thiểu (năm)")
    education_requirement: Optional[str] = Field(None, description="Yêu cầu học vấn")
    
    # Job description
    job_description: str = Field(..., description="Mô tả công việc")
    responsibilities: list[str] = Field(default_factory=list, description="Trách nhiệm công việc")
    benefits: list[str] = Field(default_factory=list, description="Quyền lợi")
    
    # Metadata
    posted_date: Optional[datetime] = Field(None, description="Ngày đăng")
    deadline: Optional[datetime] = Field(None, description="Hạn ứng tuyển")
    
    class Config:
        arbitrary_types_allowed = True

class MatchingDetails(BaseModel):
    """Chi tiết kết quả matching"""
    skills_score: float = Field(..., ge=0, le=1, description="Điểm kỹ năng (0-1)")
    experience_score: float = Field(..., ge=0, le=1, description="Điểm kinh nghiệm (0-1)")
    project_score: float = Field(..., ge=0, le=1, description="Điểm dự án (0-1)")
    education_score: float = Field(..., ge=0, le=1, description="Điểm học vấn (0-1)")
    location_score: float = Field(..., ge=0, le=1, description="Điểm địa điểm (0-1)")
    semantic_score: float = Field(..., ge=0, le=1, description="Điểm semantic (0-1)")
    
    matched_skills: list[str] = Field(default_factory=list, description="Kỹ năng khớp")
    missing_skills: list[str] = Field(default_factory=list, description="Kỹ năng thiếu")
    bonus_skills: list[str] = Field(default_factory=list, description="Kỹ năng bonus")
    relevant_projects: list[str] = Field(default_factory=list, description="Dự án liên quan")

class RecommendationResult(BaseModel):
    """Kết quả gợi ý công việc"""
    
    job_data: JobData = Field(..., description="Thông tin công việc")
    overall_score: float = Field(..., ge=0, le=1, description="Điểm tổng thể (0-1)")
    matching_details: MatchingDetails = Field(..., description="Chi tiết matching")
    
    # Lý do gợi ý
    recommendation_reasons: list[str] = Field(default_factory=list, description="Lý do gợi ý")
    improvement_suggestions: list[str] = Field(default_factory=list, description="Gợi ý cải thiện")
    
    # Metadata
    calculated_at: datetime = Field(default_factory=datetime.now, description="Thời gian tính toán")
    
    @validator('overall_score')
    def validate_overall_score(cls, v):
        return round(v, 3)  # Round to 3 decimal places

class RecommendationRequest(BaseModel):
    """Request để tạo recommendation"""
    
    cv_data: CVData = Field(..., description="Dữ liệu CV")
    
    # Filters
    location_filter: Optional[str] = Field(None, description="Lọc theo địa điểm")
    job_type_filter: Optional[JobType] = Field(None, description="Lọc theo loại công việc")
    experience_level_filter: Optional[ExperienceLevel] = Field(None, description="Lọc theo cấp độ")
    salary_min: Optional[int] = Field(None, description="Lương tối thiểu")
    
    # Options
    top_k: int = Field(10, ge=1, le=50, description="Số lượng kết quả")
    min_score: float = Field(0.3, ge=0, le=1, description="Điểm tối thiểu")
    include_details: bool = Field(True, description="Bao gồm chi tiết matching")

class RecommendationResponse(BaseModel):
    """Response cho recommendation"""
    
    success: bool = Field(..., description="Thành công hay không")
    message: str = Field("", description="Thông báo")
    
    cv_summary: Optional[Dict[str, Any]] = Field(None, description="Tóm tắt CV")
    recommendations: list[RecommendationResult] = Field(default_factory=list, description="Danh sách gợi ý")
    
    # Statistics
    total_jobs_analyzed: int = Field(0, description="Tổng số job đã phân tích")
    processing_time_ms: Optional[float] = Field(None, description="Thời gian xử lý (ms)")
    
    # Metadata
    generated_at: datetime = Field(default_factory=datetime.now, description="Thời gian tạo")

class SkillAnalysis(BaseModel):
    """Phân tích kỹ năng"""
    
    total_skills: int = Field(..., description="Tổng số kỹ năng")
    programming_languages: list[str] = Field(default_factory=list)
    frameworks: list[str] = Field(default_factory=list)
    databases: list[str] = Field(default_factory=list)
    cloud_tools: list[str] = Field(default_factory=list)
    other_skills: list[str] = Field(default_factory=list)
    
    skill_strength_score: float = Field(..., ge=0, le=1, description="Điểm mạnh về kỹ năng")

class ErrorResponse(BaseModel):
    """Error response model"""
    
    success: bool = Field(False)
    error_code: str = Field(..., description="Mã lỗi")
    message: str = Field(..., description="Thông báo lỗi")
    details: Optional[Dict[str, Any]] = Field(None, description="Chi tiết lỗi")
    timestamp: datetime = Field(default_factory=datetime.now) 