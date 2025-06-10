#!/usr/bin/env python3
"""
Simple test cho CV Screening function (không cần FastAPI server)
"""

from screening_cv import screen_cv
from pathlib import Path
import json

def test_screening_direct():
    """Test screening CV trực tiếp với function"""
    
    print("🧪 Testing CV Screening (Direct Function Call)")
    print("=" * 50)
    
    # Sample job data (giống như từ PostgreSQL database)
    job_data = {
        "job_title": "Senior Python Developer",
        "core_skills": "Python, Django, PostgreSQL, REST API, Docker, AWS",
        "requirements": "5+ years Python experience, Django framework, database design, API development, cloud deployment",
        "description": "We are seeking a Senior Python Developer to join our team. You will work on web applications using Django, design APIs, and deploy to cloud infrastructure.",
        "experience_required": "5+ years in Python web development"
    }
    
    # Check CV file
    cv_file = Path("WebDeveloper_CV.pdf")
    if not cv_file.exists():
        print(f"❌ CV file not found: {cv_file}")
        print("💡 Please ensure WebDeveloper_CV.pdf exists in current directory")
        return
    
    try:
        print(f"📄 Analyzing CV: {cv_file.name}")
        print(f"🎯 Job: {job_data['job_title']}")
        print(f"🔧 Required skills: {job_data['core_skills']}")
        print()
        
        # Call screening function directly
        result = screen_cv(str(cv_file), job_data)
        
        # Display results
        print("✅ Analysis Complete!")
        print("-" * 30)
        
        overall_score = result.get("overall_score", 0)
        print(f"📊 Overall Score: {overall_score}/5.0")
        
        # Determine decision
        if overall_score >= 4.0:
            decision = "PASS 🟢"
            recommendation = "Ứng viên có năng lực tốt, phù hợp với vị trí này."
        elif overall_score >= 2.5:
            decision = "REVIEW 🟡"
            recommendation = "Ứng viên cần được xem xét kỹ thêm trong vòng phỏng vấn."
        else:
            decision = "FAIL 🔴"
            recommendation = "Ứng viên chưa đáp ứng đủ yêu cầu cho vị trí này."
        
        print(f"🎯 Decision: {decision}")
        print(f"💡 Recommendation: {recommendation}")
        print()
        
        # Matching points
        matching = result.get("matching_points", [])
        if matching:
            print("✅ Matching Points:")
            for i, point in enumerate(matching, 1):
                print(f"   {i}. {point}")
            print()
        
        # Not matching points
        gaps = result.get("not_matching_point", [])  # Note: typo in original code
        if gaps:
            print("⚠️ Areas for Improvement:")
            for i, gap in enumerate(gaps, 1):
                print(f"   {i}. {gap}")
            print()
        
        # Detailed analysis
        detailed = result.get("detailed_analysis", {})
        if detailed:
            print("🔍 Detailed Analysis:")
            for category, analysis in detailed.items():
                if analysis:
                    print(f"   {category}: {analysis}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    print("=" * 50)

if __name__ == "__main__":
    test_screening_direct() 