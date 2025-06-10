"""
Test với CV thật từ PDF file
"""
import sys
from pathlib import Path
import time

# Add project root to path
sys.path.append(str(Path(__file__).parent))

from core.cv_extractor import CVExtractor
from core.recommendation_engine import ModernRecommendationEngine
from core.models import JobData

def create_web_focused_jobs():
    """Tạo jobs tập trung vào web development"""
    return [
        JobData(
            job_id="web_001",
            job_title="Frontend Developer",
            company="WebTech Solutions",
            location="Hà Nội",
            job_type="Full-time",
            required_skills=["HTML", "CSS", "JavaScript", "React", "Vue.js"],
            min_experience=2,
            education_requirement="Đại học",
            job_description="Develop modern web interfaces using HTML, CSS, JavaScript and frontend frameworks",
            responsibilities=["Build responsive UI", "Implement user interactions", "Optimize performance"],
            benefits=["Competitive salary", "Modern tech stack", "Training opportunities"]
        ),
        JobData(
            job_id="web_002", 
            job_title="Frontend React Developer",
            company="React Masters",
            location="TP.HCM",
            job_type="Full-time",
            required_skills=["React", "JavaScript", "TypeScript", "CSS", "HTML"],
            min_experience=3,
            education_requirement="Đại học",
            job_description="Build scalable React applications with modern JavaScript",
            responsibilities=["React development", "Component design", "State management"],
            benefits=["High salary", "React expertise", "Career growth"]
        ),
        JobData(
            job_id="web_003",
            job_title="Full Stack JavaScript Developer",
            company="JS Innovation",
            location="Đà Nẵng",
            job_type="Full-time",
            required_skills=["JavaScript", "Node.js", "React", "Express", "MongoDB"],
            min_experience=3,
            education_requirement="Đại học",
            job_description="Full stack development with JavaScript ecosystem",
            responsibilities=["Frontend & Backend", "API development", "Database design"],
            benefits=["Full stack role", "JavaScript focus", "Innovation"]
        ),
        JobData(
            job_id="web_004",
            job_title="Vue.js Developer",
            company="Vue Enterprise",
            location="Hà Nội",
            job_type="Full-time",
            required_skills=["Vue.js", "JavaScript", "CSS", "HTML", "Nuxt.js"],
            min_experience=2,
            education_requirement="Cao đẳng",
            job_description="Build modern web applications using Vue.js framework",
            responsibilities=["Vue development", "Component architecture", "Performance tuning"],
            benefits=["Vue expertise", "Modern frameworks", "Learning budget"]
        ),
        JobData(
            job_id="python_001",
            job_title="Python Backend Developer", 
            company="Backend Corp",
            location="TP.HCM",
            job_type="Full-time",
            required_skills=["Python", "Django", "PostgreSQL", "REST API", "Docker"],
            min_experience=3,
            education_requirement="Đại học",
            job_description="Develop backend services using Python and Django",
            responsibilities=["API development", "Database design", "Backend logic"],
            benefits=["Backend focus", "Python stack", "Scale"]
        ),
        JobData(
            job_id="generic_001",
            job_title="Software Developer",
            company="General Tech",
            location="Hà Nội",
            job_type="Full-time", 
            required_skills=["Programming", "Problem solving", "Git", "Agile"],
            min_experience=1,
            education_requirement="Đại học",
            job_description="General software development position for various technologies",
            responsibilities=["Software development", "Bug fixing", "Code review"],
            benefits=["Flexible tech", "Learning opportunity", "Career start"]
        )
    ]

def print_cv_analysis(cv_data):
    """In phân tích chi tiết CV"""
    print("🔍 PHÂN TÍCH CV THẬT:")
    print("=" * 50)
    
    if cv_data.full_name:
        print(f"👤 Tên: {cv_data.full_name}")
    if cv_data.job_title:
        print(f"💼 Position hiện tại: {cv_data.job_title}")
    if cv_data.desired_position:
        print(f"🎯 Vị trí mong muốn: {cv_data.desired_position}")
    
    print(f"\n🔧 TECHNICAL SKILLS ({len(cv_data.technical_skills)}):")
    for skill in cv_data.technical_skills:
        print(f"   • {skill}")
    
    if cv_data.years_experience:
        print(f"\n📈 Kinh nghiệm: {cv_data.years_experience} năm")
    
    if cv_data.work_experience:
        print(f"\n💼 WORK EXPERIENCE:")
        for exp in cv_data.work_experience[:3]:  # Show first 3
            print(f"   • {exp}")
    
    if cv_data.education_level:
        print(f"\n🎓 Học vấn: {cv_data.education_level}")
    
    if cv_data.address:
        print(f"📍 Địa chỉ: {cv_data.address}")

def print_recommendation_analysis(recommendations, jobs):
    """Phân tích chi tiết recommendations"""
    print(f"\n📊 PHÂN TÍCH RECOMMENDATION:")
    print("=" * 50)
    
    # Categorize jobs
    web_jobs = []
    python_jobs = []
    other_jobs = []
    
    for rec in recommendations:
        job = rec.job_data
        if any(skill.lower() in ['html', 'css', 'javascript', 'react', 'vue'] 
               for skill in job.required_skills):
            web_jobs.append(rec)
        elif any(skill.lower() in ['python', 'django', 'flask'] 
                 for skill in job.required_skills):
            python_jobs.append(rec)
        else:
            other_jobs.append(rec)
    
    print(f"🌐 Web Development Jobs: {len(web_jobs)}")
    for rec in web_jobs:
        details = rec.matching_details
        print(f"   • {rec.job_data.job_title} - {rec.overall_score:.1%}")
        print(f"     Skills: {details.skills_score:.1%} | Semantic: {details.semantic_score:.1%}")
        if hasattr(details, 'matched_skills'):
            print(f"     Matched: {', '.join(details.matched_skills[:4])}")
    
    print(f"\n🐍 Python Jobs: {len(python_jobs)}")
    for rec in python_jobs:
        details = rec.matching_details
        print(f"   • {rec.job_data.job_title} - {rec.overall_score:.1%}")
        print(f"     Skills: {details.skills_score:.1%} | Semantic: {details.semantic_score:.1%}")
        if hasattr(details, 'matched_skills'):
            print(f"     Matched: {', '.join(details.matched_skills[:4])}")
    
    print(f"\n🔧 Other Jobs: {len(other_jobs)}")
    for rec in other_jobs:
        details = rec.matching_details
        print(f"   • {rec.job_data.job_title} - {rec.overall_score:.1%}")

def test_real_cv():
    """Test với CV thật"""
    print("🚀 Testing với CV thật")
    print("=" * 60)
    
    # Initialize services
    print("⚙️ Khởi tạo services...")
    try:
        cv_extractor = CVExtractor()
        recommendation_engine = ModernRecommendationEngine()
        print("✅ Services initialized")
    except Exception as e:
        print(f"❌ Error initializing: {e}")
        return
    
    # Extract CV
    cv_path = "WebDeveloper_CV.pdf"
    if not Path(cv_path).exists():
        print(f"❌ CV file not found: {cv_path}")
        return
    
    print(f"\n📄 Extracting CV từ {cv_path}...")
    try:
        cv_data = cv_extractor.extract_from_file(cv_path)
        print("✅ CV extracted successfully")
        
        # Analyze CV
        print_cv_analysis(cv_data)
        
    except Exception as e:
        print(f"❌ Error extracting CV: {e}")
        import traceback
        traceback.print_exc()
        return
    
    # Create diverse job list
    print(f"\n📋 Tạo diverse job list...")
    job_list = create_web_focused_jobs()
    print(f"✅ Created {len(job_list)} diverse jobs")
    
    # Generate recommendations
    print(f"\n🎯 Generating recommendations...")
    start_time = time.time()
    
    try:
        recommendations = recommendation_engine.generate_recommendations(
            cv_data=cv_data,
            job_list=job_list,
            top_k=6,
            min_score=0.0  # Show all để phân tích
        )
        
        end_time = time.time()
        processing_time = (end_time - start_time) * 1000
        
        print(f"✅ Generated {len(recommendations)} recommendations in {processing_time:.0f}ms")
        
        # Analyze recommendations
        print_recommendation_analysis(recommendations, job_list)
        
        # Show top results
        print(f"\n🏆 TOP {len(recommendations)} RESULTS:")
        print("=" * 60)
        
        for i, rec in enumerate(recommendations, 1):
            job = rec.job_data
            details = rec.matching_details
            
            print(f"\n#{i} 🎯 {job.job_title} tại {job.company}")
            print(f"   📊 Overall Score: {rec.overall_score:.1%}")
            print(f"   🔧 Skills: {details.skills_score:.1%} | 🧠 Semantic: {details.semantic_score:.1%}")
            print(f"   📈 Experience: {details.experience_score:.1%} | 🎓 Education: {details.education_score:.1%}")
            
            if hasattr(details, 'matched_skills') and details.matched_skills:
                matched = details.matched_skills[:5]
                print(f"   ✅ Matched Skills: {', '.join(matched)}")
            
            if hasattr(details, 'missing_skills') and details.missing_skills:
                missing = details.missing_skills[:3]
                print(f"   ❌ Missing Skills: {', '.join(missing)}")
            
            print(f"   📝 {job.job_description[:80]}...")
        
    except Exception as e:
        print(f"❌ Error generating recommendations: {e}")
        import traceback
        traceback.print_exc()
        return
    
    print(f"\n🎉 Test completed successfully!")
    return True

if __name__ == "__main__":
    try:
        success = test_real_cv()
        if success:
            print("\n✅ Real CV test passed!")
        else:
            print("\n❌ Real CV test failed!")
    except Exception as e:
        print(f"\n💥 Test failed: {e}")
        import traceback
        traceback.print_exc() 