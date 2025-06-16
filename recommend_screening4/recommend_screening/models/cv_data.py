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
    position: Optional[str] = Field(None, description="Vị trí công việc")
    company: Optional[str] = Field(None, description="Tên công ty")
    duration: Optional[str] = Field(None, description="Thời gian làm việc")
    description: Optional[str] = Field(None, description="Mô tả công việc")
    start_date: Optional[str] = Field(None, description="Ngày bắt đầu")
    end_date: Optional[str] = Field(None, description="Ngày kết thúc")
    is_current: bool = Field(False, description="Có phải công việc hiện tại")
    
    def __str__(self) -> str:
        """Convert to string for text processing"""
        parts = []
        if self.position:
            parts.append(self.position)
        if self.company:
            parts.append(f"at {self.company}")
        if self.description:
            parts.append(self.description)
        return " ".join(parts)
    
    def to_text(self) -> str:
        """Convert to text for embedding"""
        parts = []
        if self.position:
            parts.append(self.position)
        if self.company:
            parts.append(self.company)
        if self.description:
            parts.append(self.description)
        return " ".join(parts)

class Education(BaseModel):
    """Thông tin học vấn"""
    degree: Optional[str] = Field(None, description="Bằng cấp")
    university: Optional[str] = Field(None, description="Trường học")
    major: Optional[str] = Field(None, description="Chuyên ngành")
    year: Optional[int] = Field(None, description="Năm tốt nghiệp")
    gpa: Optional[float] = Field(None, description="Điểm GPA")

class Project(BaseModel):
    """Dự án"""
    name: Optional[str] = Field(None, description="Tên dự án")
    description: Optional[str] = Field(None, description="Mô tả dự án")
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
    work_experience: list[WorkExperience] = Field(default_factory=list, description="Kinh nghiệm làm việc")