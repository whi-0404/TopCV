
from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum


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
