#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test file cho ModernRecommendationEngine
Hướng dẫn test từng component
"""

import sys
import os
from core.recommen_engine import ModernRecommendationEngine
from models.cv_data import CVData, Project, WorkExperience
from models.job_data import JobData
from models.recommendation import RecommendationResult
from config import Config
# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test 1: Kiểm tra các imports"""
    print("🧪 Test 1: Kiểm tra imports...")
    
    try:
        from core.recommen_engine import ModernRecommendationEngine
        from models.cv_data import CVData, Project, WorkExperience
        from models.job_data import JobData
        from models.recommendation import RecommendationResult
        from config import Config
        print("✅ All imports successful!")
        return True
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False

def test_config():
    """Test 2: Kiểm tra Config"""
    print("\n🧪 Test 2: Kiểm tra Config...")
    
    try:
        # Config is a class with class attributes, not instance
        print(f"✅ GOOGLE_API_KEY: {'***' if Config.GOOGLE_API_KEY else 'Not set'}")
        print(f"✅ LLM_MODEL: {Config.LLM_MODEL}")
        print(f"✅ MATCHING_WEIGHTS: {Config.MATCHING_WEIGHTS}")
        return True
    except Exception as e:
        print(f"❌ Config error: {e}")
        return False

def test_engine_initialization():
    """Test 3: Khởi tạo engine"""
    print("\n🧪 Test 3: Khởi tạo RecommendationEngine...")
    
    try:
        from core.recommen_engine import ModernRecommendationEngine
        engine = ModernRecommendationEngine()
        print("✅ Engine initialized successfully!")
        print(f"✅ Sentence model: {'Available' if engine.sentence_model else 'Using TF-IDF fallback'}")
        return engine
    except Exception as e:
        print(f"❌ Engine initialization error: {e}")
        return None

def create_sample_cv():
    """Tạo CV mẫu để test"""
    from models.cv_data import CVData, Project, WorkExperience
    
    return CVData(
        full_name="Nguyễn Văn Test",
        email="test@email.com",
        phone="0123456789",
        address="Hà Nội",
        job_title="Python Developer",
        desired_position="Backend Developer",
        years_experience=3,
        current_company="Tech Company",
        technical_skills=["Python", "Django", "PostgreSQL", "React", "Docker"],
        soft_skills=["Communication", "Teamwork", "Problem Solving"],
        languages=["Python", "JavaScript"],
        tools=["VS Code", "Git", "Docker"],
        education_level="Đại học",
        major="Công nghệ thông tin",
        university="Đại học ABC",
        graduation_year=2020,
        projects=[
            Project(
                name="E-commerce API",
                description="Xây dựng REST API cho hệ thống e-commerce bằng Django",
                technologies=["Python", "Django", "PostgreSQL", "Redis"],
                start_date="2022-01",
                end_date="2022-06"
            )
        ],
        work_experience=[
            WorkExperience(
                position="Python Developer",
                company="Tech Company",
                start_date="2021-01",
                end_date="Present",
                is_current=True,
                description="Phát triển và maintain các ứng dụng web bằng Python Django"
            )
        ]
    )

def create_sample_jobs():
    """Tạo jobs mẫu để test"""
    from models.job_data import JobData
    
    return [
        JobData(
            job_id="JOB001",
            job_title="Senior Python Developer",
            company="ABC Tech",
            location="Hà Nội",
            job_type="Full-time",
            job_description="Cần người có kinh nghiệm Python, Django, REST API, Database",
            required_skills=["Python", "Django", "PostgreSQL", "REST API"],
            responsibilities=["Phát triển API", "Tối ưu database", "Code review"],
            min_experience=2,
            max_experience=5,
            education_requirement="Đại học"
        ),
        JobData(
            job_id="JOB002", 
            job_title="Full Stack Developer",
            company="XYZ Corp",
            location="TP Hồ Chí Minh",
            job_type="Full-time",
            job_description="Cần người biết cả Frontend và Backend: React, Python, Node.js",
            required_skills=["React", "Node.js", "Python", "MongoDB"],
            responsibilities=["Phát triển UI", "Xây dựng API", "Deploy application"],
            min_experience=1,
            max_experience=3,
            education_requirement="Đại học"
        ),
        JobData(
            job_id="JOB003",
            job_title="DevOps Engineer", 
            company="Cloud Solutions",
            location="Remote",
            job_type="Full-time",
            job_description="Quản lý infrastructure, CI/CD, Docker, Kubernetes",
            required_skills=["Docker", "Kubernetes", "AWS", "Jenkins"],
            responsibilities=["Setup CI/CD", "Manage containers", "Monitor systems"],
            min_experience=3,
            max_experience=7,
            education_requirement="Đại học"
        )
    ]

def test_text_embedding(engine):
    """Test 4: Text embedding"""
    print("\n🧪 Test 4: Text embedding...")
    
    try:
        test_text = "Python Django REST API development"
        embedding = engine._get_text_embedding(test_text)
        print(f"✅ Embedding shape: {embedding.shape}")
        print(f"✅ Embedding type: {type(embedding)}")
        return True
    except Exception as e:
        print(f"❌ Text embedding error: {e}")
        return False

def test_cosine_similarity(engine):
    """Test 5: Cosine similarity"""
    print("\n🧪 Test 5: Cosine similarity...")
    
    try:
        text1 = "Python Django web development"
        text2 = "Django Python web application"
        text3 = "Java Spring Boot development"
        
        emb1 = engine._get_text_embedding(text1)
        emb2 = engine._get_text_embedding(text2)
        emb3 = engine._get_text_embedding(text3)
        
        sim_same = engine._calculate_cosine_similarity(emb1, emb2)
        sim_diff = engine._calculate_cosine_similarity(emb1, emb3)
        
        print(f"✅ Similarity (same): {sim_same:.3f}")
        print(f"✅ Similarity (different): {sim_diff:.3f}")
        
        assert sim_same > sim_diff, "Same texts should be more similar"
        print("✅ Cosine similarity test passed!")
        return True
    except Exception as e:
        print(f"❌ Cosine similarity error: {e}")
        return False

def test_recommendation_basic(engine):
    """Test 6: Basic recommendation"""
    print("\n🧪 Test 6: Basic recommendation...")
    
    try:
        cv_data = create_sample_cv()
        job_list = create_sample_jobs()
        
        print(f"✅ CV: {cv_data.full_name} - {cv_data.job_title}")
        print(f"✅ Skills: {', '.join(cv_data.technical_skills)}")
        print(f"✅ Testing with {len(job_list)} jobs")
        
        recommendations = engine.generate_recommendations(
            cv_data=cv_data,
            job_list=job_list,
            top_k=5,
            min_score=0.1  # Giảm threshold để dễ test
        )
        
        print(f"✅ Generated {len(recommendations)} recommendations")
        
        for i, rec in enumerate(recommendations, 1):
            print(f"\n📋 Recommendation {i}:")
            print(f"   Job: {rec.job_data.job_title} at {rec.job_data.company}")
            print(f"   Score: {rec.overall_score:.3f}")
            print(f"   Skills: {rec.matching_details.skills_score:.3f}")
            print(f"   Experience: {rec.matching_details.experience_score:.3f}")
            print(f"   Location: {rec.matching_details.location_score:.3f}")
            print(f"   Matched skills: {', '.join(rec.matching_details.matched_skills)}")
            if rec.matching_details.missing_skills:
                print(f"   Missing skills: {', '.join(rec.matching_details.missing_skills)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Basic recommendation error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_filters(engine):
    """Test 7: Recommendation với filters"""
    print("\n🧪 Test 7: Recommendation với filters...")
    
    try:
        cv_data = create_sample_cv()
        job_list = create_sample_jobs()
        
        # Test location filter
        filters = {"location": "Hà Nội"}
        recommendations = engine.generate_recommendations(
            cv_data=cv_data,
            job_list=job_list,
            top_k=5,
            min_score=0.1,
            filters=filters
        )
        
        print(f"✅ With location filter 'Hà Nội': {len(recommendations)} results")
        for rec in recommendations:
            print(f"   - {rec.job_data.job_title} in {rec.job_data.location}")
        
        return True
        
    except Exception as e:
        print(f"❌ Filters test error: {e}")
        return False

def test_edge_cases(engine):
    """Test 8: Edge cases"""
    print("\n🧪 Test 8: Edge cases...")
    
    try:
        from models.cv_data import CVData
        from models.job_data import JobData
        
        # Empty CV
        empty_cv = CVData(
            full_name="Empty CV",
            email="empty@test.com",
            technical_skills=[]
        )
        
        # Job với empty skills
        empty_job = JobData(
            job_id="EMPTY001",
            job_title="Test Job",
            company="Test Company",
            location="Test Location",
            job_type="Full-time",
            job_description="Test description",
            required_skills=[],
            responsibilities=[]
        )
        
        recommendations = engine.generate_recommendations(
            cv_data=empty_cv,
            job_list=[empty_job],
            top_k=1,
            min_score=0.0
        )
        
        print(f"✅ Empty CV test: {len(recommendations)} recommendations")
        if recommendations:
            print(f"   Score: {recommendations[0].overall_score:.3f}")
        
        return True
        
    except Exception as e:
        print(f"❌ Edge cases error: {e}")
        return False

def run_all_tests():
    """Chạy tất cả tests"""
    print("🚀 Starting ModernRecommendationEngine Tests...\n")
    
    tests_passed = 0
    total_tests = 8
    
    # Test 1: Imports
    if test_imports():
        tests_passed += 1
    
    # Test 2: Config  
    if test_config():
        tests_passed += 1
    
    # Test 3: Engine initialization
    engine = test_engine_initialization()
    if engine:
        tests_passed += 1
        
        # Test 4: Text embedding
        if test_text_embedding(engine):
            tests_passed += 1
        
        # Test 5: Cosine similarity
        if test_cosine_similarity(engine):
            tests_passed += 1
        
        # Test 6: Basic recommendation
        if test_recommendation_basic(engine):
            tests_passed += 1
        
        # Test 7: Filters
        if test_filters(engine):
            tests_passed += 1
        
        # Test 8: Edge cases
        if test_edge_cases(engine):
            tests_passed += 1
    
    # Summary
    print(f"\n{'='*50}")
    print(f"📊 TEST RESULTS: {tests_passed}/{total_tests} passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! Engine is working correctly.")
    else:
        print(f"⚠️  {total_tests - tests_passed} tests failed. Check logs above.")
    
    return tests_passed == total_tests

if __name__ == "__main__":
    run_all_tests() 