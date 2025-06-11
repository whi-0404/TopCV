"""
Modern Content-Based Recommendation Engine sử dụng Embeddings và Cosine Similarity
"""
from __future__ import annotations

import re
import time
import logging
from typing import Dict, Tuple, Optional, Any
from datetime import datetime

import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

from core.models import CVData, JobData, RecommendationResult, MatchingDetails
from core.skills import SkillManager
from config import Config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModernRecommendationEngine:
    """
    Modern Content-Based Recommendation Engine sử dụng:
    - Sentence Transformers để tạo embeddings
    - Cosine Similarity để tính toán độ tương đồng
    - Multi-field weighted scoring
    """
    
    def __init__(self):
        """Initialize recommendation engine với embedding models"""
        logger.info("Initializing Modern Recommendation Engine...")
        
        self.skill_manager = SkillManager()
        self.matching_weights = Config.get_matching_weights()
        
        # Initialize Sentence Transformer model
        try:
            # Sử dụng model đã fine-tune cho text tiếng Việt/Anh
            self.sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("Loaded sentence transformer model: all-MiniLM-L6-v2")
        except Exception as e:
            logger.error(f"Error loading sentence transformer: {e}")
            # Fallback to TF-IDF if sentence transformer fails
            self.sentence_model = None
            self.tfidf = TfidfVectorizer(max_features=1000, stop_words='english')
            logger.info("Fallback to TF-IDF vectorizer")
        
        # Cache để lưu embeddings
        self.embedding_cache = {}
        
        # Validate config
        Config.validate_config()
        logger.info("Recommendation engine initialized successfully")
    
    def generate_recommendations(
        self,
        cv_data: CVData,
        job_list: list[JobData],
        top_k: int = 10,
        min_score: float = 0.3,
        filters: Optional[Dict] = None
    ) -> list[RecommendationResult]:
        """
        Tạo recommendations sử dụng content-based filtering với embeddings
        
        Args:
            cv_data: Dữ liệu CV đã được extract
            job_list: Danh sách các công việc
            top_k: Số lượng recommendations tối đa
            min_score: Điểm tối thiểu để được recommend
            filters: Các filter bổ sung
            
        Returns:
            List recommendations đã được sắp xếp theo điểm
        """
        start_time = time.time()
        logger.info(f"Generating recommendations for CV with {len(job_list)} jobs")
        
        # Apply filters nếu có
        filtered_jobs = self._apply_filters(job_list, filters)
        logger.info(f"After filtering: {len(filtered_jobs)} jobs")
        
        # Pre-compute CV embeddings để tái sử dụng
        cv_embeddings = self._compute_cv_embeddings(cv_data)
        
        # Calculate matching cho từng job
        recommendations = []
        for i, job in enumerate(filtered_jobs):
            try:
                result = self._calculate_job_match(cv_data, job, cv_embeddings)
                
                # Chỉ include nếu đạt minimum score
                if result.overall_score >= min_score:
                    recommendations.append(result)
                    
                if (i + 1) % 50 == 0:
                    logger.info(f"Processed {i + 1}/{len(filtered_jobs)} jobs")
                    
            except Exception as e:
                logger.error(f"Error matching job {job.job_id}: {str(e)}")
                continue
        
        # Sort theo overall score (descending)
        recommendations.sort(key=lambda x: x.overall_score, reverse=True)
        
        # Limit results
        recommendations = recommendations[:top_k]
        
        # Add metadata
        processing_time = (time.time() - start_time) * 1000
        for rec in recommendations:
            rec.calculated_at = datetime.now()
        
        logger.info(f"Generated {len(recommendations)} recommendations in {processing_time:.2f}ms")
        return recommendations
    
    def _compute_cv_embeddings(self, cv_data: CVData) -> Dict[str, np.ndarray]:
        """Pre-compute embeddings cho CV để tái sử dụng"""
        cv_embeddings = {}
        
        # Skills embedding
        skills_text = " ".join(cv_data.technical_skills) if cv_data.technical_skills else ""
        cv_embeddings['skills'] = self._get_text_embedding(skills_text)
        
        # Summary/Description embedding
        summary_text = self._create_cv_summary_text(cv_data)
        cv_embeddings['summary'] = self._get_text_embedding(summary_text)
        
        # Experience embedding
        experience_text = self._create_cv_experience_text(cv_data)
        cv_embeddings['experience'] = self._get_text_embedding(experience_text)
        
        return cv_embeddings
    
    def _get_text_embedding(self, text: str) -> np.ndarray:
        """
        Tạo embedding vector cho text sử dụng Sentence Transformer
        """
        if not text or not text.strip():
            # Return zero vector nếu text rỗng
            if self.sentence_model:
                return np.zeros(self.sentence_model.get_sentence_embedding_dimension())
            else:
                return np.zeros(1000)  # TF-IDF max_features
        
        # Check cache
        cache_key = hash(text.strip())
        if cache_key in self.embedding_cache:
            return self.embedding_cache[cache_key]
        
        try:
            if self.sentence_model:
                # Sử dụng Sentence Transformer
                embedding = self.sentence_model.encode(text, normalize_embeddings=True)
            else:
                # Fallback to TF-IDF
                tfidf_matrix = self.tfidf.fit_transform([text])
                embedding = tfidf_matrix.toarray()[0]
            
            # Cache result
            self.embedding_cache[cache_key] = embedding
            return embedding
            
        except Exception as e:
            logger.error(f"Error computing embedding: {e}")
            # Return zero vector on error
            if self.sentence_model:
                return np.zeros(self.sentence_model.get_sentence_embedding_dimension())
            else:
                return np.zeros(1000)
    
    def _calculate_cosine_similarity(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float:
        """Tính cosine similarity giữa 2 embeddings"""
        try:
            # Reshape để đảm bảo đúng format cho cosine_similarity
            emb1 = embedding1.reshape(1, -1)
            emb2 = embedding2.reshape(1, -1)
            
            # Tính cosine similarity
            similarity = cosine_similarity(emb1, emb2)[0][0]
            
            # Chuyển từ [-1, 1] về [0, 1]
            return (similarity + 1) / 2
            
        except Exception as e:
            logger.error(f"Error calculating cosine similarity: {e}")
            return 0.0
    
    def _apply_filters(self, job_list: list[JobData], filters: Optional[Dict]) -> list[JobData]:
        """Apply các filters lên job list"""
        if not filters:
            return job_list
        
        filtered_jobs = job_list.copy()
        
        # Location filter
        if filters.get('location'):
            location_filter = filters['location'].lower()
            filtered_jobs = [
                job for job in filtered_jobs
                if location_filter in job.location.lower()
            ]
        
        # Experience filter
        if filters.get('min_experience'):
            min_exp = filters['min_experience']
            filtered_jobs = [
                job for job in filtered_jobs
                if (job.min_experience or 0) <= min_exp
            ]
        
        # Job type filter
        if filters.get('job_type'):
            job_type_filter = filters['job_type'].lower()
            filtered_jobs = [
                job for job in filtered_jobs
                if job_type_filter in job.job_type.lower()
            ]
        
        return filtered_jobs
    
    def _calculate_job_match(
        self, 
        cv_data: CVData, 
        job_data: JobData,
        cv_embeddings: Dict[str, np.ndarray]
    ) -> RecommendationResult:
        """Tính toán matching score giữa CV và job sử dụng embeddings"""
        
        # 1. Skills Matching (40%)
        skills_score, matched_skills, missing_skills = self._calculate_skills_match_embedding(
            cv_data, job_data, cv_embeddings['skills']
        )
        
        # 2. Experience Matching (30%)
        experience_score = self._calculate_experience_match_embedding(
            cv_data, job_data, cv_embeddings['experience']
        )
        
        # 3. Project Matching (15%) - Dự án liên quan
        project_score, relevant_projects = self._calculate_project_match(cv_data, job_data)
        
        # 4. Semantic Similarity (15%) - Toàn bộ CV vs Job description
        semantic_score = self._calculate_semantic_match_embedding(
            cv_data, job_data, cv_embeddings['summary']
        )
        
        # 5. Education Matching (5%)
        education_score = self._calculate_education_match(cv_data, job_data)
        
        # 6. Location Matching (5%)
        location_score = self._calculate_location_match(cv_data, job_data)
        
        # Tính overall score với weights
        overall_score = (
            skills_score * self.matching_weights['skills_match'] +
            experience_score * self.matching_weights['experience_match'] +
            project_score * self.matching_weights['project_match'] +
            semantic_score * self.matching_weights['semantic_similarity'] +
            education_score * self.matching_weights['education_match'] +
            location_score * self.matching_weights['location_match']
        )
        
        # Create matching details
        matching_details = MatchingDetails(
            skills_score=round(skills_score, 3),
            experience_score=round(experience_score, 3),
            project_score=round(project_score, 3),
            education_score=round(education_score, 3),
            location_score=round(location_score, 3),
            semantic_score=round(semantic_score, 3),
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            bonus_skills=self._find_bonus_skills(cv_data, job_data),
            relevant_projects=relevant_projects
        )
        
        # Generate reasons và suggestions
        reasons = self._generate_recommendation_reasons(matching_details, cv_data, job_data)
        suggestions = self._generate_improvement_suggestions(matching_details, missing_skills)
        
        return RecommendationResult(
            job_data=job_data,
            overall_score=round(overall_score, 3),
            matching_details=matching_details,
            recommendation_reasons=reasons,
            improvement_suggestions=suggestions
        )
    
    def _calculate_skills_match_embedding(
        self, 
        cv_data: CVData, 
        job_data: JobData,
        cv_skills_embedding: np.ndarray
    ) -> Tuple[float, list[str], list[str]]:
        """Tính skills matching sử dụng embeddings và exact matching"""
        
        # Get job skills
        job_skills = job_data.required_skills
        if not job_skills:
            return 0.5, [], []
        
        # 1. Exact matching (traditional approach) - weight 60%
        exact_score, matched_skills, missing_skills = self.skill_manager.calculate_skill_match(
            cv_data.technical_skills,
            job_skills
        )
        
        # 2. Semantic matching sử dụng embeddings - weight 40%
        job_skills_text = " ".join(job_skills)
        job_skills_embedding = self._get_text_embedding(job_skills_text)
        
        semantic_score = self._calculate_cosine_similarity(cv_skills_embedding, job_skills_embedding)
        
        # Combine scores
        combined_score = exact_score * 0.6 + semantic_score * 0.4
        
        return combined_score, matched_skills, missing_skills
    
    def _calculate_experience_match_embedding(
        self,
        cv_data: CVData,
        job_data: JobData,
        cv_experience_embedding: np.ndarray
    ) -> float:
        """Tính experience matching với embeddings"""
        
        # 1. Traditional experience years matching - weight 70%
        traditional_score = self._calculate_experience_years_match(cv_data, job_data)
        
        # 2. Semantic matching của job descriptions - weight 30%
        job_exp_text = f"{job_data.job_description} {' '.join(job_data.responsibilities) if job_data.responsibilities else ''}"
        job_exp_embedding = self._get_text_embedding(job_exp_text)
        
        semantic_score = self._calculate_cosine_similarity(cv_experience_embedding, job_exp_embedding)
        
        # Combine scores
        combined_score = traditional_score * 0.7 + semantic_score * 0.3
        
        return combined_score
    
    def _calculate_experience_years_match(self, cv_data: CVData, job_data: JobData) -> float:
        """Tính matching dựa trên số năm kinh nghiệm"""
        
        # Get job requirement
        required_years = job_data.min_experience or 0
        
        if required_years == 0:
            return 0.8  # Neutral if no specific requirement
        
        # Get CV experience years
        candidate_years = cv_data.years_experience or 0
        
        if candidate_years >= required_years:
            return 1.0
        elif candidate_years >= required_years * 0.8:
            return 0.9
        elif candidate_years >= required_years * 0.6:
            return 0.7
        elif candidate_years >= required_years * 0.4:
            return 0.5
        else:
            return 0.3
    
    def _calculate_semantic_match_embedding(
        self,
        cv_data: CVData,
        job_data: JobData,
        cv_summary_embedding: np.ndarray
    ) -> float:
        """Tính semantic similarity sử dụng embeddings"""
        
        # Create job text
        job_text = self._create_job_text(job_data)
        job_embedding = self._get_text_embedding(job_text)
        
        # Calculate cosine similarity
        similarity = self._calculate_cosine_similarity(cv_summary_embedding, job_embedding)
        
        return similarity
    
    def _calculate_education_match(self, cv_data: CVData, job_data: JobData) -> float:
        """Traditional education matching"""
        
        if not job_data.education_requirement:
            return 0.6
        
        if not cv_data.education_level:
            return 0.3
        
        edu_required = job_data.education_requirement.lower()
        cv_education = cv_data.education_level.lower()
        
        # Education level mapping
        education_levels = {
            'phd': 5, 'doctorate': 5, 'tiến sĩ': 5,
            'master': 4, 'thạc sĩ': 4, 'mba': 4,
            'bachelor': 3, 'đại học': 3, 'cử nhân': 3,
            'college': 2, 'cao đẳng': 2,
            'diploma': 1, 'trung cấp': 1
        }
        
        cv_level = 0
        required_level = 0
        
        for edu, level in education_levels.items():
            if edu in cv_education:
                cv_level = max(cv_level, level)
            if edu in edu_required:
                required_level = max(required_level, level)
        
        if cv_level >= required_level:
            return 1.0
        elif cv_level == required_level - 1:
            return 0.7
        else:
            return 0.4
    
    def _calculate_location_match(self, cv_data: CVData, job_data: JobData) -> float:
        """Traditional location matching"""
        
        if not cv_data.address or not job_data.location:
            return 0.5
        
        cv_location = cv_data.address.lower()
        job_location = job_data.location.lower()
        
        # Exact match
        if cv_location == job_location:
            return 1.0
        
        # Major cities
        major_cities = ['hà nội', 'hồ chí minh', 'đà nẵng', 'hải phòng', 'cần thơ']
        
        for city in major_cities:
            if city in cv_location and city in job_location:
                return 1.0
        
        # Partial match
        if cv_location in job_location or job_location in cv_location:
            return 0.8
        
        # Remote work
        remote_keywords = ['remote', 'từ xa', 'online', 'work from home']
        if any(keyword in job_location for keyword in remote_keywords):
            return 0.9
        
        return 0.3
    
    def _calculate_project_match(self, cv_data: CVData, job_data: JobData) -> Tuple[float, list[str]]:
        """Tính project matching score"""
        
        # Nếu không có projects, trả về score thấp nhưng không phạt nặng
        if not cv_data.projects:
            return 0.4, ["Không có dự án được đề cập"]
        
        # Extract job requirements
        job_skills = set(skill.lower() for skill in job_data.required_skills)
        job_description = job_data.job_description.lower()
        
        relevant_projects = []
        project_scores = []
        
        for project in cv_data.projects:
            project_score = 0.0
            relevance_reasons = []
            
            # 1. Check project technologies vs job skills
            project_techs = set(tech.lower() for tech in project.technologies) if project.technologies else set()
            skill_overlap = len(project_techs.intersection(job_skills))
            if skill_overlap > 0:
                project_score += 0.6 * (skill_overlap / len(job_skills))
                relevance_reasons.append(f"{skill_overlap} công nghệ phù hợp")
            
            # 2. Semantic similarity of project description vs job description
            if project.description:
                project_emb = self._get_text_embedding(project.description)
                job_emb = self._get_text_embedding(job_description)
                semantic_sim = self._calculate_cosine_similarity(project_emb, job_emb)
                
                if semantic_sim > 0.5:
                    project_score += 0.4 * semantic_sim
                    relevance_reasons.append(f"Mô tả liên quan ({semantic_sim:.1%})")
            
            # 3. Bonus for recent projects (if have date info)
            if hasattr(project, 'end_date') and project.end_date:
                # Simplified: assume more recent projects are more valuable
                project_score *= 1.1
            
            project_scores.append(project_score)
            
            if project_score > 0.3:  # Threshold for relevance
                project_summary = f"{project.name}"
                if relevance_reasons:
                    project_summary += f" ({', '.join(relevance_reasons)})"
                relevant_projects.append(project_summary)
        
        if not project_scores:
            return 0.4, ["Không có dự án phù hợp"]
        
        # Calculate overall project score
        # Use weighted average with emphasis on best projects
        sorted_scores = sorted(project_scores, reverse=True)
        if len(sorted_scores) >= 3:
            # Weight: Best project 50%, second 30%, third 20%
            overall_score = (sorted_scores[0] * 0.5 + sorted_scores[1] * 0.3 + sorted_scores[2] * 0.2)
        elif len(sorted_scores) == 2:
            overall_score = (sorted_scores[0] * 0.7 + sorted_scores[1] * 0.3)
        else:
            overall_score = sorted_scores[0]
        
        # Cap the score at 1.0
        overall_score = min(overall_score, 1.0)
        
        if not relevant_projects:
            relevant_projects = [f"Có {len(cv_data.projects)} dự án nhưng ít liên quan"]
        
        return overall_score, relevant_projects
    
    def _create_cv_summary_text(self, cv_data: CVData) -> str:
        """Tạo summary text từ CV cho embedding"""
        parts = []
        
        if cv_data.job_title:
            parts.append(cv_data.job_title)
        
        if cv_data.desired_position:
            parts.append(cv_data.desired_position)
        
        if cv_data.technical_skills:
            parts.append(" ".join(cv_data.technical_skills))
        
        return " ".join(parts)
    
    def _create_cv_experience_text(self, cv_data: CVData) -> str:
        """Tạo experience text từ CV cho embedding"""
        parts = []
        
        # Work experience is now a list of strings
        for exp in cv_data.work_experience:
            parts.append(exp)
        
        # Add current job info
        if cv_data.current_company:
            parts.append(f"Working at {cv_data.current_company}")
        
        if cv_data.years_experience:
            parts.append(f"{cv_data.years_experience} years experience")
        
        return " ".join(parts)
    
    def _create_job_text(self, job_data: JobData) -> str:
        """Tạo comprehensive job text cho embedding"""
        parts = [
            job_data.job_title,
            job_data.job_description,
            " ".join(job_data.required_skills),
            " ".join(job_data.responsibilities) if job_data.responsibilities else ""
        ]
        
        return " ".join(filter(None, parts))
    
    def _extract_years_from_text(self, text: str) -> Optional[int]:
        """Extract số năm kinh nghiệm từ text"""
        if not text:
            return None
        
        text = text.lower()
        
        patterns = [
            r'(\d+)\s*-\s*(\d+)\s*năm',
            r'(\d+)\s*đến\s*(\d+)\s*năm',
            r'trên\s*(\d+)\s*năm',
            r'từ\s*(\d+)\s*năm',
            r'(\d+)\s*năm\s*trở\s*lên',
            r'(\d+)\s*năm',
            r'(\d+)\s*year',
            r'(\d+)\+\s*year'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                groups = match.groups()
                if len(groups) >= 2 and groups[1]:
                    return int((int(groups[0]) + int(groups[1])) / 2)
                else:
                    return int(groups[0])
        
        return None
    
    def _find_bonus_skills(self, cv_data: CVData, job_data: JobData) -> list[str]:
        """Tìm skills bonus"""
        job_skills_set = set(skill.lower() for skill in job_data.required_skills)
        
        bonus_skills = []
        for skill in cv_data.technical_skills:
            if skill.lower() not in job_skills_set:
                bonus_skills.append(skill)
        
        return bonus_skills[:5]
    
    def _generate_recommendation_reasons(
        self,
        matching_details: MatchingDetails,
        cv_data: CVData,
        job_data: JobData
    ) -> list[str]:
        """Tạo lý do recommendation"""
        reasons = []
        
        if matching_details.skills_score >= 0.7:
            reasons.append(f"Kỹ năng của bạn phù hợp {matching_details.skills_score*100:.0f}% với yêu cầu")
        elif matching_details.skills_score >= 0.4:
            reasons.append("Bạn có một số kỹ năng phù hợp, có thể phát triển thêm")
        
        if matching_details.experience_score >= 0.8:
            reasons.append("Kinh nghiệm của bạn rất phù hợp với vị trí")
        elif matching_details.experience_score >= 0.6:
            reasons.append("Kinh nghiệm của bạn tương đối phù hợp")
        
        if matching_details.semantic_score >= 0.7:
            reasons.append("Profile của bạn có độ tương đồng cao với job description")
        
        if matching_details.location_score >= 0.8:
            reasons.append("Địa điểm làm việc thuận tiện")
        
        if matching_details.bonus_skills:
            reasons.append(f"Bạn có {len(matching_details.bonus_skills)} kỹ năng bổ sung tạo lợi thế")
        
        return reasons
    
    def _generate_improvement_suggestions(
        self,
        matching_details: MatchingDetails,
        missing_skills: list[str]
    ) -> list[str]:
        """Tạo gợi ý cải thiện"""
        suggestions = []
        
        if missing_skills:
            if len(missing_skills) <= 3:
                suggestions.append(f"Học thêm: {', '.join(missing_skills[:3])}")
            else:
                suggestions.append(f"Ưu tiên học: {', '.join(missing_skills[:2])}")
        
        if matching_details.experience_score < 0.6:
            suggestions.append("Tích lũy thêm kinh nghiệm qua dự án thực tế")
        
        if matching_details.semantic_score < 0.5:
            suggestions.append("Cập nhật CV để highlight kinh nghiệm liên quan hơn")
        
        if matching_details.education_score < 0.6:
            suggestions.append("Cân nhắc nâng cao trình độ hoặc có chứng chỉ")
        
        return suggestions

# Alias cho backward compatibility
RecommendationEngine = ModernRecommendationEngine 