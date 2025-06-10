"""
Test script cho Modern Job Recommendation System
"""
import sys
from pathlib import Path
import time

# Add project root to path
sys.path.append(str(Path(__file__).parent))

from core.models import CVData, JobData, RecommendationResult
from core.recommendation_engine import ModernRecommendationEngine

def create_sample_jobs():
    """Tạo sample jobs để test"""
    return [
        JobData(
            job_id="job_001",
            job_title="Senior Python Developer",
            company="TechCorp Vietnam",
            location="Hà Nội",
            job_type="Full-time",
            required_skills=["Python", "Django", "PostgreSQL", "Docker", "AWS"],
            min_experience=3,
            education_requirement="Đại học",
            job_description="Develop and maintain web applications using Python and Django framework",
            responsibilities=["Build APIs", "Database design", "Code review"],
            benefits=["Competitive salary", "Health insurance", "Training budget"]
        ),
        JobData(
            job_id="job_002", 
            job_title="Frontend Developer",
            company="StartupXYZ",
            location="TP.HCM",
            job_type="Full-time",
            required_skills=["JavaScript", "React", "HTML", "CSS", "TypeScript"],
            min_experience=2,
            education_requirement="Cao đẳng",
            job_description="Build modern web interfaces using React and TypeScript",
            responsibilities=["UI development", "Component design", "Testing"],
            benefits=["Flexible hours", "Remote work", "Stock options"]
        ),
        JobData(
            job_id="job_003",
            job_title="Full Stack Developer", 
            company="BigTech Solutions",
            location="Đà Nẵng",
            job_type="Full-time",
            required_skills=["JavaScript", "Node.js", "React", "MongoDB", "AWS"],
            min_experience=4,
            education_requirement="Đại học",
            job_description="Work on both frontend and backend of web applications",
            responsibilities=["Full stack development", "API design", "System architecture"],
            benefits=["High salary", "International team", "Career growth"]
        ),
        JobData(
            job_id="job_004",
            job_title="Junior Python Developer",
            company="Learning Tech",
            location="Hà Nội", 
            job_type="Full-time",
            required_skills=["Python", "Flask", "HTML", "CSS", "MySQL"],
            min_experience=1,
            education_requirement="Đại học",
            job_description="Entry level Python developer position with mentoring",
            responsibilities=["Basic web development", "Bug fixing", "Learning"],
            benefits=["Mentoring program", "Training", "Growth opportunity"]
        ),
        JobData(
            job_id="job_005",
            job_title="Senior React Developer",
            company="Frontend Masters",
            location="TP.HCM",
            job_type="Full-time", 
            required_skills=["React", "Redux", "TypeScript", "Next.js", "GraphQL"],
            min_experience=5,
            education_requirement="Đại học",
            job_description="Lead frontend development with React ecosystem",
            responsibilities=["Team leadership", "Architecture design", "Code review"],
            benefits=["Leadership role", "High compensation", "Modern tech stack"]
        )
    ]

def create_sample_cv():
    """Tạo sample CV để test"""
    return CVData(
        full_name="Nguyễn Văn A",
        email="nguyenvana@gmail.com",
        phone="0901234567",
        address="Hà Nội",
        job_title="Python Developer",
        years_experience=3,
        current_company="TechViet",
        technical_skills=["Python", "Django", "JavaScript", "HTML", "CSS", "PostgreSQL", "Git"],
        soft_skills=["Team work", "Communication", "Problem solving"],
        languages=["Vietnamese", "English"],
        tools=["VSCode", "Docker", "Postman"],
        education_level="Đại học",
        major="Công nghệ thông tin",
        university="Đại học Bách Khoa Hà Nội",
        graduation_year=2020,
        desired_position="Senior Python Developer",
        desired_location="Hà Nội",
        work_experience=[
            "3 năm kinh nghiệm Python tại TechViet",
            "Phát triển web application với Django",
            "Làm việc với PostgreSQL và API development"
        ]
    )

def print_job_details(job: JobData, score: float, details: dict):
    """In chi tiết job recommendation"""
    print(f"\n🎯 {job.job_title} tại {job.company}")
    print(f"   📍 Địa điểm: {job.location}")
    print(f"   📊 Điểm tổng: {score:.1%}")
    print(f"   💼 Kinh nghiệm yêu cầu: {job.min_experience or 0} năm")
    print(f"   🎓 Học vấn: {job.education_requirement or 'Không yêu cầu'}")
    
    # Skills breakdown
    if 'skills_score' in details:
        print(f"   🔧 Điểm skills: {details['skills_score']:.1%}")
        if 'matched_skills' in details:
            print(f"      ✅ Skills phù hợp: {', '.join(details['matched_skills'][:5])}")
        if 'missing_skills' in details:
            missing = details['missing_skills'][:3]
            if missing:
                print(f"      ❌ Skills còn thiếu: {', '.join(missing)}")
    
    # Experience and other scores
    if 'experience_score' in details:
        print(f"   📈 Điểm kinh nghiệm: {details['experience_score']:.1%}")
    if 'project_score' in details:
        print(f"   🚀 Điểm dự án: {details['project_score']:.1%}")
    if 'semantic_score' in details:
        print(f"   🧠 Điểm semantic: {details['semantic_score']:.1%}")
    
    # Show relevant projects
    if 'relevant_projects' in details and details['relevant_projects']:
        print(f"   📁 Dự án liên quan: {', '.join(details['relevant_projects'][:2])}")
    
    print(f"   📝 Mô tả: {job.job_description[:100]}...")

def test_modern_recommendation_engine():
    """Test modern recommendation engine"""
    print("🚀 Testing Modern Job Recommendation System")
    print("=" * 60)
    
    # Initialize engine
    print("⚙️ Khởi tạo Modern Recommendation Engine...")
    engine = ModernRecommendationEngine()
    
    # Test embeddings
    print("🧠 Testing embeddings...")
    text1 = "Python Django developer"
    text2 = "Senior Python Django developer"
    
    emb1 = engine._get_text_embedding(text1)
    emb2 = engine._get_text_embedding(text2)
    similarity = engine._calculate_cosine_similarity(emb1, emb2)
    
    print(f"✅ Embedding test: '{text1}' vs '{text2}' = {similarity:.3f}")
    
    # Create test data
    print("\n📋 Tạo test data...")
    cv_data = create_sample_cv()
    job_list = create_sample_jobs()
    
    print(f"✅ CV: {cv_data.full_name} - {cv_data.job_title}")
    print(f"✅ CV Skills: {', '.join(cv_data.technical_skills)}")
    print(f"✅ Jobs: {len(job_list)} positions")
    
    # Generate recommendations
    print(f"\n🎯 Generating recommendations...")
    start_time = time.time()
    
    recommendations = engine.generate_recommendations(
        cv_data=cv_data,
        job_list=job_list,
        top_k=5,
        min_score=0.0  # Show all to see scores
    )
    
    end_time = time.time()
    processing_time = (end_time - start_time) * 1000
    
    print(f"✅ Generated {len(recommendations)} recommendations in {processing_time:.0f}ms")
    
    # Display results
    print(f"\n📊 TOP {len(recommendations)} CÔNG VIỆC PHÙ HỢP:")
    print("=" * 60)
    
    for i, rec in enumerate(recommendations, 1):
        print(f"\n🏆 #{i}")
        print_job_details(rec.job_data, rec.overall_score, rec.matching_details)
    
    # Test với filters
    print(f"\n🔍 Testing với filters (chỉ Hà Nội)...")
    filtered_recs = engine.generate_recommendations(
        cv_data=cv_data,
        job_list=job_list, 
        top_k=10,
        min_score=0.0,
        filters={'location': 'Hà Nội'}
    )
    
    print(f"✅ Filtered results: {len(filtered_recs)} jobs tại Hà Nội")
    for rec in filtered_recs:
        print(f"   • {rec.job_data.job_title} - Score: {rec.overall_score:.1%}")
    
    print(f"\n🎉 Test completed successfully!")
    return True

if __name__ == "__main__":
    try:
        success = test_modern_recommendation_engine()
        if success:
            print("\n✅ All tests passed!")
            sys.exit(0)
        else:
            print("\n❌ Some tests failed!")
            sys.exit(1)
    except Exception as e:
        print(f"\n💥 Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
