"""
Configuration file cho Job Recommendation System
"""
import os
from typing import Dict, Any

class Config:
    """Cấu hình hệ thống"""
    
    # API Keys
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyCcqvPhx9_FMVqkd7U6cHbO4NPDb0LPU_o")
    
    # Model Settings
    SENTENCE_TRANSFORMER_MODEL = "all-MiniLM-L6-v2"
    LLM_MODEL = "gemini-2.0-flash"
    LLM_TEMPERATURE = 0
    
    # Matching Weights
    MATCHING_WEIGHTS = {
        'skills_match': 0.35,           # 35% cho skills matching
        'experience_match': 0.25,       # 25% cho experience matching
        'project_match': 0.15,          # 15% cho project matching  
        'semantic_similarity': 0.15,    # 15% cho semantic similarity
        'education_match': 0.05,        # 5% cho education matching
        'location_match': 0.05          # 5% cho location matching
    }
    
    # Skill Category Weights
    SKILL_CATEGORY_WEIGHTS = {
        'PROGRAMMING_LANGUAGE': 0.30,
        'FRAMEWORK': 0.25,
        'DATABASE': 0.15,
        'CLOUD': 0.10,
        'TOOLS': 0.10,
        'TESTING': 0.05,
        'DESIGN': 0.05
    }
    
    # Experience Level Mapping  
    EXPERIENCE_LEVELS = {
        'Intern': {'min_years': 0, 'max_years': 0},
        'Fresher': {'min_years': 0, 'max_years': 1},
        'Junior': {'min_years': 1, 'max_years': 3},
        'Middle': {'min_years': 2, 'max_years': 5},
        'Senior': {'min_years': 5, 'max_years': 10},
        'Lead': {'min_years': 5, 'max_years': 15},
        'Manager': {'min_years': 3, 'max_years': 20}
    }
    
    # File Settings
    MAX_FILE_SIZE_MB = 10
    SUPPORTED_FILE_TYPES = ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png']
    
    # Recommendation Settings
    DEFAULT_TOP_K = 10
    MIN_SCORE_THRESHOLD = 0.3
    MAX_RECOMMENDATIONS = 50
    
    # Database (for future PostgreSQL integration)
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost:5432/topcv")
    
    @classmethod
    def get_skill_weights(cls) -> Dict[str, float]:
        """Lấy trọng số cho từng loại skill"""
        return cls.SKILL_CATEGORY_WEIGHTS
    
    @classmethod  
    def get_matching_weights(cls) -> Dict[str, float]:
        """Lấy trọng số cho matching algorithm"""
        return cls.MATCHING_WEIGHTS
    
    @classmethod
    def validate_config(cls) -> bool:
        """Validate cấu hình"""
        # Kiểm tra tổng trọng số = 1.0
        total_weight = sum(cls.MATCHING_WEIGHTS.values())
        if abs(total_weight - 1.0) > 0.01:
            raise ValueError(f"Tổng trọng số matching phải = 1.0, hiện tại = {total_weight}")
        
        # Kiểm tra API key
        if not cls.GOOGLE_API_KEY or cls.GOOGLE_API_KEY == "your-api-key-here":
            print("Warning: Google API key chưa được cấu hình")
            return False
            
        return True 