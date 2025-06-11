#!/usr/bin/env python3
"""
Quick test script for CV Screening Service
"""

import requests
import json
from pathlib import Path

def test_screening_service():
    """Test CV Screening Service"""
    
    base_url = "http://localhost:8000"
    
    print("🧪 Testing CV Screening Service...")
    print("=" * 40)
    
    # 1. Health Check
    print("1️⃣ Health Check...")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Service is healthy")
            health_data = response.json()
            print(f"   Status: {health_data.get('status')}")
            print(f"   Version: {health_data.get('version')}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Cannot connect to service: {e}")
        print("💡 Make sure to run: python run_screening_service.py")
        return
    
    # 2. Test CV Screening
    print("\n2️⃣ Testing CV Screening...")
    
    # Sample job data (như từ PostgreSQL)
    job_data = {
        "job_id": 1,
        "job_title": "Senior Java Developer",
        "company_name": "Tech Company Ltd",
        "description": "We are looking for an experienced Java developer to join our team. You will be responsible for developing high-quality applications.",
        "requirements": "5+ years of Java development experience, Spring Boot, PostgreSQL, REST APIs, microservices architecture.",
        "core_skills": "Java, Spring Boot, PostgreSQL, REST API, Microservices, Docker",
        "experience_required": "5+ years in Java development",
        "location": "Ho Chi Minh City",
        "benefits": "Competitive salary, health insurance, flexible working hours"
    }
    
    # Check if sample CV exists
    cv_file_path = Path("WebDeveloper_CV.pdf")
    if not cv_file_path.exists():
        print(f"❌ Sample CV file not found: {cv_file_path}")
        print("💡 Please place a CV file named 'WebDeveloper_CV.pdf' in current directory")
        return
    
    # Prepare request
    files = {'cv_file': open(cv_file_path, 'rb')}
    data = {'job_data': json.dumps(job_data)}
    
    try:
        print(f"   Analyzing CV: {cv_file_path.name}")
        print(f"   Job: {job_data['job_title']} at {job_data['company_name']}")
        
        response = requests.post(
            f"{base_url}/screening/cv-analysis",
            files=files,
            data=data
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Screening completed successfully!")
            print(f"   Decision: {result.get('candidate_decision')}")
            print(f"   Score: {result.get('overall_score')}/5.0")
            print(f"   Recommendation: {result.get('recommendation')}")
            
            # Display matching points
            matching = result.get('matching_points', [])
            if matching:
                print("\n📊 Matching Points:")
                for i, point in enumerate(matching[:3], 1):
                    print(f"   {i}. {point}")
            
            # Display gaps
            gaps = result.get('not_matching_points', [])
            if gaps:
                print("\n⚠️ Areas for Improvement:")
                for i, gap in enumerate(gaps[:3], 1):
                    print(f"   {i}. {gap}")
            
        else:
            print(f"❌ Screening failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")
    finally:
        files['cv_file'].close()
    
    print("\n" + "=" * 40)
    print("🎉 Test completed!")

if __name__ == "__main__":
    test_screening_service() 