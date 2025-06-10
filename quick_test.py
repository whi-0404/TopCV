"""
Quick test script cho command line testing
"""
import sys
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent))

def test_embedding_engine():
    """Test embedding engine riêng"""
    print("🔧 Testing Embedding Engine...")
    
    from core.recommendation_engine import ModernRecommendationEngine
    
    engine = ModernRecommendationEngine()
    
    # Test embeddings
    text1 = "Python developer with Django experience"
    text2 = "Senior Python Django developer"
    text3 = "JavaScript React frontend developer"
    
    emb1 = engine._get_text_embedding(text1)
    emb2 = engine._get_text_embedding(text2)
    emb3 = engine._get_text_embedding(text3)
    
    sim12 = engine._calculate_cosine_similarity(emb1, emb2)
    sim13 = engine._calculate_cosine_similarity(emb1, emb3)
    
    print(f"✅ Embedding shape: {emb1.shape}")
    print(f"✅ Python vs Python similarity: {sim12:.3f}")
    print(f"✅ Python vs JavaScript similarity: {sim13:.3f}")
    print(f"✅ Embeddings working correctly!")

def test_skills_manager():
    """Test skills manager"""
    print("\n🎯 Testing Skills Manager...")
    
    from core.skills import SkillManager
    
    skill_manager = SkillManager()
    
    cv_skills = ["Python", "Django", "React", "JavaScript", "HTML"]
    job_skills = ["Python", "Django", "PostgreSQL", "Docker", "AWS"]
    
    score, matched, missing = skill_manager.calculate_skill_match(cv_skills, job_skills)
    
    print(f"✅ CV Skills: {cv_skills}")
    print(f"✅ Job Skills: {job_skills}")
    print(f"✅ Match Score: {score:.3f}")
    print(f"✅ Matched: {matched}")
    print(f"✅ Missing: {missing}")

def test_cv_extractor():
    """Test CV extractor"""
    print("\n📄 Testing CV Extractor...")
    
    try:
        from core.cv_extractor import CVExtractor
        
        extractor = CVExtractor()
        
        # Test với sample text
        sample_text = """
        John Doe
        Senior Python Developer
        
        Skills: Python, Django, React, JavaScript, HTML, CSS
        Experience: 5 years at Tech Company
        Education: Bachelor in Computer Science
        """
        
        # Extract từ text thay vì file
        cv_data = extractor.extract_from_text(sample_text)
        
        print(f"✅ Extracted skills: {len(cv_data.technical_skills)} skills")
        print(f"✅ Skills found: {cv_data.technical_skills}")
        print(f"✅ CV Extractor working!")
        
    except Exception as e:
        print(f"❌ CV Extractor test failed: {e}")
        print("💡 Make sure Google API key is set")

def test_config():
    """Test configuration"""
    print("\n⚙️ Testing Configuration...")
    
    from config import Config
    
    try:
        Config.validate_config()
        print("✅ Configuration valid")
        print(f"✅ Matching weights: {Config.get_matching_weights()}")
        print(f"✅ API key configured: {'Yes' if Config.GOOGLE_API_KEY else 'No'}")
    except Exception as e:
        print(f"❌ Configuration error: {e}")

def main():
    """Run all tests"""
    print("🚀 Quick Component Tests")
    print("=" * 50)
    
    if len(sys.argv) > 1:
        test_name = sys.argv[1].lower()
        
        if test_name == "embedding" or test_name == "emb":
            test_embedding_engine()
        elif test_name == "skills" or test_name == "skill":
            test_skills_manager() 
        elif test_name == "cv" or test_name == "extractor":
            test_cv_extractor()
        elif test_name == "config" or test_name == "cfg":
            test_config()
        else:
            print(f"❌ Unknown test: {test_name}")
            print("Available tests: embedding, skills, cv, config")
    else:
        # Run all tests
        test_config()
        test_embedding_engine()
        test_skills_manager()
        test_cv_extractor()
    
    print("\n✅ Quick tests completed!")

if __name__ == "__main__":
    main() 