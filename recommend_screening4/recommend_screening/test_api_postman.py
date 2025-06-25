#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script tự động test API Job Recommendation System
Thay thế cho việc test thủ công bằng Postman
"""

import requests
import json
import time
import os
from pathlib import Path

BASE_URL = "http://localhost:8000"

def print_header(title):
    """In header đẹp cho từng test"""
    print(f"\n{'='*60}")
    print(f"🧪 {title}")
    print(f"{'='*60}")

def print_response(response, title="Response"):
    """In response một cách đẹp mắt"""
    print(f"\n📋 {title}:")
    print(f"Status Code: {response.status_code}")
    try:
        if response.headers.get('content-type', '').startswith('application/json'):
            print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        else:
            print(f"Response: {response.text}")
    except:
        print(f"Response: {response.text}")

def test_health_check():
    """Test 1: Health Check"""
    print_header("TEST 1: HEALTH CHECK")
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        print_response(response)
        
        if response.status_code == 200:
            print("✅ Health check PASSED")
            return True
        else:
            print("❌ Health check FAILED")
            return False
    except Exception as e:
        print(f"❌ Health check ERROR: {e}")
        return False

def test_upload_jobs():
    """Test 2: Upload Jobs"""
    print_header("TEST 2: UPLOAD JOBS")
    
    # Sample jobs data
    jobs = [
        {
            "job_data": {
                "job_id": "JOB001",
                "job_title": "Python Backend Developer",
                "company": "TechCorp Vietnam",
                "location": "Hà Nội",
                "job_type": "Full-time",
                "required_skills": ["Python", "Django", "PostgreSQL", "REST API", "Docker"],
                "min_experience": 2,
                "education_requirement": "Đại học",
                "job_description": "Chúng tôi đang tìm kiếm một Python Backend Developer có kinh nghiệm để tham gia vào đội ngũ phát triển các ứng dụng web quy mô lớn. Ứng viên sẽ làm việc với Django framework, thiết kế API, và tối ưu hóa performance.",
                "responsibilities": [
                    "Phát triển và maintain các API backend sử dụng Python/Django",
                    "Thiết kế database và optimize queries",
                    "Tích hợp với các dịch vụ thứ ba",
                    "Code review và mentoring junior developers",
                    "Implement security best practices"
                ],
                "benefits": [
                    "Lương cạnh tranh 15-25 triệu",
                    "Bảo hiểm sức khỏe",
                    "13th month salary",
                    "Training và phát triển kỹ năng",
                    "Work from home 2 ngày/tuần"
                ]
            }
        },
        {
            "job_data": {
                "job_id": "JOB002", 
                "job_title": "React Frontend Developer",
                "company": "StartupXYZ",
                "location": "Hồ Chí Minh",
                "job_type": "Full-time",
                "required_skills": ["React", "JavaScript", "TypeScript", "HTML/CSS", "Redux"],
                "min_experience": 1,
                "education_requirement": "Cao đẳng",
                "job_description": "Tham gia phát triển giao diện người dùng cho các ứng dụng web hiện đại. Làm việc với React, TypeScript và các công nghệ frontend tiên tiến nhất.",
                "responsibilities": [
                    "Phát triển UI components sử dụng React/TypeScript",
                    "Tối ưu performance và user experience",
                    "Collaborate với UX/UI designers",
                    "Maintain code quality và best practices",
                    "Unit testing và integration testing"
                ],
                "benefits": [
                    "Lương 12-20 triệu",
                    "Môi trường startup năng động",
                    "Flexible working hours",
                    "Team building hàng tháng",
                    "Learning budget"
                ]
            }
        },
        {
            "job_data": {
                "job_id": "JOB003",
                "job_title": "Full Stack Developer",
                "company": "Digital Agency ABC",
                "location": "Đà Nẵng", 
                "job_type": "Full-time",
                "required_skills": ["Node.js", "React", "MongoDB", "Express", "AWS"],
                "min_experience": 3,
                "education_requirement": "Đại học",
                "job_description": "Vị trí Full Stack Developer để phát triển các dự án web application từ frontend đến backend. Làm việc với MERN stack và cloud services.",
                "responsibilities": [
                    "Phát triển end-to-end web applications",
                    "Database design và API development",
                    "Deploy và manage applications trên cloud",
                    "Technical consultation cho clients",
                    "Lead technical projects"
                ],
                "benefits": [
                    "Lương 18-30 triệu",
                    "Project bonus",
                    "Du lịch company hàng năm",
                    "Laptop và thiết bị làm việc",
                    "Remote work option"
                ]
            }
        }
    ]
    
    success_count = 0
    
    for i, job in enumerate(jobs, 1):
        print(f"\n📤 Uploading Job {i}: {job['job_data']['job_title']}")
        
        try:
            response = requests.post(
                f"{BASE_URL}/jobs/upload",
                json=job,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                print(f"✅ Job {i} uploaded successfully")
                success_count += 1
            else:
                print(f"❌ Job {i} upload failed")
                print_response(response)
                
        except Exception as e:
            print(f"❌ Job {i} upload ERROR: {e}")
    
    print(f"\n📊 Jobs upload summary: {success_count}/{len(jobs)} successful")
    return success_count == len(jobs)

def test_get_jobs():
    """Test 3: Get Jobs"""
    print_header("TEST 3: GET JOBS")
    
    try:
        response = requests.get(f"{BASE_URL}/jobs")
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            job_count = len(data.get('jobs', []))
            print(f"✅ Found {job_count} jobs")
            return job_count > 0
        else:
            print("❌ Get jobs FAILED")
            return False
            
    except Exception as e:
        print(f"❌ Get jobs ERROR: {e}")
        return False

def test_cv_upload_recommendation():
    """Test 4: Upload CV và nhận gợi ý"""
    print_header("TEST 4: CV UPLOAD & RECOMMENDATION")
    
    # Tìm file CV có sẵn
    cv_files = [
        "WebDeveloper_CV.pdf",
        "cv_1726397675677.pdf", 
        "cv2.pdf",
        "1.jpg"
    ]
    
    cv_file = None
    for file_name in cv_files:
        if os.path.exists(file_name):
            cv_file = file_name
            break
    
    if not cv_file:
        print("❌ Không tìm thấy file CV để test")
        print(f"📁 Cần có một trong các file sau: {cv_files}")
        return False
    
    print(f"📄 Using CV file: {cv_file}")
    
    try:
        with open(cv_file, 'rb') as f:
            files = {'file': (cv_file, f, 'application/octet-stream')}
            data = {
                'top_k': 5,
                'min_score': 0.1,  # Giảm min_score để dễ có kết quả
                'location': 'Hà Nội'
            }
            
            response = requests.post(
                f"{BASE_URL}/cv/upload",
                files=files,
                data=data
            )
            
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            recommendations = data.get('recommendations', [])
            print(f"✅ CV analyzed successfully, got {len(recommendations)} recommendations")
            
            if recommendations:
                print(f"🎯 Top recommendation: {recommendations[0]['job_data']['job_title']}")
                print(f"📊 Score: {recommendations[0]['overall_score']:.3f}")
            
            return True
        else:
            print("❌ CV upload and recommendation FAILED")
            return False
            
    except Exception as e:
        print(f"❌ CV upload ERROR: {e}")
        return False

def test_cv_screening():
    """Test 5: CV Screening"""
    print_header("TEST 5: CV SCREENING")
    
    # Tìm file CV có sẵn
    cv_files = [
        "WebDeveloper_CV.pdf",
        "cv_1726397675677.pdf", 
        "cv2.pdf",
        "1.jpg"
    ]
    
    cv_file = None
    for file_name in cv_files:
        if os.path.exists(file_name):
            cv_file = file_name
            break
    
    if not cv_file:
        print("❌ Không tìm thấy file CV để test")
        return False
    
    job_id = "JOB001"  # Test với Python Developer job
    print(f"📄 Using CV file: {cv_file}")
    print(f"🎯 Screening for Job ID: {job_id}")
    
    try:
        with open(cv_file, 'rb') as f:
            files = {'cv_file': (cv_file, f, 'application/octet-stream')}
            
            response = requests.post(
                f"{BASE_URL}/screening/apply-job",
                files=files,
                params={'job_id': job_id}
            )
            
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            decision = data.get('candidate_decision', 'UNKNOWN')
            score = data.get('overall_score', 0)
            
            print(f"✅ CV screening completed")
            print(f"🎯 Decision: {decision}")
            print(f"📊 Score: {score:.3f}")
            
            return True
        else:
            print("❌ CV screening FAILED")
            return False
            
    except Exception as e:
        print(f"❌ CV screening ERROR: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 Starting API Test Suite")
    print("📍 Testing API at:", BASE_URL)
    
    # Wait for server to be ready
    print("\n⏳ Waiting for server to be ready...")
    time.sleep(2)
    
    # Run tests
    tests = [
        ("Health Check", test_health_check),
        ("Upload Jobs", test_upload_jobs),
        ("Get Jobs", test_get_jobs),
        ("CV Upload & Recommendation", test_cv_upload_recommendation),
        ("CV Screening", test_cv_screening)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
            time.sleep(1)  # Delay between tests
        except Exception as e:
            print(f"❌ Test {test_name} crashed: {e}")
            results.append((test_name, False))
    
    # Print summary
    print_header("TEST SUMMARY")
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{status} - {test_name}")
        if result:
            passed += 1
    
    print(f"\n📊 Overall Result: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests PASSED! Hệ thống hoạt động tốt!")
    else:
        print("⚠️ Some tests FAILED. Kiểm tra lại server và configuration.")
    
    print(f"\n💡 Để test bằng Postman, xem file: postman_test_guide.md")
    print(f"📖 API Documentation: {BASE_URL}/docs")

if __name__ == "__main__":
    main() 