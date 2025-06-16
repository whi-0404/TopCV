#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Simple test cho recommendation engine
Chạy từng bước để kiểm tra lỗi
"""

print("🚀 Starting Simple Test...")

# Step 1: Test imports
print("\n📦 Step 1: Testing imports...")
try:
    import sys
    import os
    print("✅ Basic imports OK")
    
    # Test core imports
    from models.cv_data import CVData
    print("✅ CVData import OK")
    
    from models.job_data import JobData  
    print("✅ JobData import OK")
    
    from config import Config
    print("✅ Config import OK")
    
    print("✅ All basic imports successful!")
    
except Exception as e:
    print(f"❌ Import failed: {e}")
    exit(1)

# Step 2: Test config
print("\n⚙️ Step 2: Testing config...")
try:
    config = Config()
    print(f"✅ LLM Model: {config.LLM_MODEL}")
    print(f"✅ Matching weights: {list(config.MATCHING_WEIGHTS.keys())}")
    print("✅ Config OK")
except Exception as e:
    print(f"❌ Config failed: {e}")
    exit(1)

# Step 3: Test recommendation engine import
print("\n🧠 Step 3: Testing engine import...")
try:
    from core.recommen_engine import ModernRecommendationEngine
    print("✅ Engine import OK")
except Exception as e:
    print(f"❌ Engine import failed: {e}")
    print("Possible issues:")
    print("- Missing sentence-transformers: pip install sentence-transformers")
    print("- Missing scikit-learn: pip install scikit-learn") 
    print("- Missing numpy: pip install numpy")
    exit(1)

# Step 4: Test engine initialization
print("\n🔧 Step 4: Testing engine initialization...")
try:
    engine = ModernRecommendationEngine()
    print("✅ Engine initialized!")
    print(f"✅ Sentence model available: {engine.sentence_model is not None}")
    
    if engine.sentence_model is None:
        print("⚠️ Using TF-IDF fallback (this is OK for testing)")
    
except Exception as e:
    print(f"❌ Engine initialization failed: {e}")
    print("Possible issues:")
    print("- Internet connection needed for downloading models")
    print("- Not enough disk space")
    print("- Try installing torch first: pip install torch")
    exit(1)

# Step 5: Test sample data creation
print("\n📝 Step 5: Testing sample data...")
try:
    # Simple CV
    cv_data = CVData(
        full_name="Test User",
        email="test@test.com",
        phone="0123456789",
        technical_skills=["Python", "Django", "React"],
        years_experience=2
    )
    print("✅ CV data created")
    
    # Simple Job
    job_data = JobData(
        job_id="TEST001",
        job_title="Python Developer",
        company="Test Company",
        location="Hà Nội",
        job_type="Full-time",
        job_description="Python development job",
        required_skills=["Python", "Django"],
        responsibilities=["Develop applications"]
    )
    print("✅ Job data created")
    
except Exception as e:
    print(f"❌ Sample data failed: {e}")
    exit(1)

# Step 6: Test basic embedding
print("\n🔤 Step 6: Testing text embedding...")
try:
    test_text = "Python Django development"
    embedding = engine._get_text_embedding(test_text)
    print(f"✅ Embedding shape: {embedding.shape}")
    print(f"✅ Embedding type: {type(embedding)}")
    
    # Test empty text
    empty_embedding = engine._get_text_embedding("")
    print(f"✅ Empty text embedding shape: {empty_embedding.shape}")
    
except Exception as e:
    print(f"❌ Text embedding failed: {e}")
    exit(1)

# Step 7: Test recommendation
print("\n🎯 Step 7: Testing basic recommendation...")
try:
    recommendations = engine.generate_recommendations(
        cv_data=cv_data,
        job_list=[job_data],
        top_k=1,
        min_score=0.0  # Accept any score
    )
    
    print(f"✅ Generated {len(recommendations)} recommendations")
    
    if recommendations:
        rec = recommendations[0]
        print(f"✅ Job: {rec.job_data.job_title}")
        print(f"✅ Score: {rec.overall_score:.3f}")
        print(f"✅ Skills score: {rec.matching_details.skills_score:.3f}")
        print(f"✅ Experience score: {rec.matching_details.experience_score:.3f}")
        
except Exception as e:
    print(f"❌ Recommendation failed: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

print("\n🎉 All tests passed! Your recommendation engine is working!")
print("\n💡 Next steps:")
print("1. Try with real CV data")
print("2. Add more jobs to test")
print("3. Experiment with different filters")
print("4. Test with actual CV files using extract_cv.py")

print(f"\n📊 Final test summary:")
print(f"✅ Engine ready: {engine is not None}")
print(f"✅ ML Model: {'Sentence Transformer' if engine.sentence_model else 'TF-IDF'}")
print(f"✅ Recommendation working: {len(recommendations) > 0}") 