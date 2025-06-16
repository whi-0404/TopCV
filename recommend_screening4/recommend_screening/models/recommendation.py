from __future__ import annotations

from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

from models.job_data import JobData
from models.cv_data import CVData, ExperienceLevel, JobType, EducationLevel

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