"""
Main entry point cho Job Recommendation System
"""
import uvicorn
import sys
import os
from pathlib import Path

# Add current directory to path
sys.path.append(str(Path(__file__).parent))

from config import Config

def main():
    """Chạy TopCV Unified System (Job Recommendation + CV Screening)"""
    
    print("🚀 Starting TopCV Unified System v2.1.0")
    print("=" * 60)
    print("🎯 Features:")
    print("   ✅ Job Recommendation (Content-based filtering)")
    print("   ✅ CV Screening for HR (AI-powered evaluation)")
    print("=" * 60)
    
    # Validate configuration
    try:
        Config.validate_config()
        print("✅ Configuration validated successfully")
    except Exception as e:
        print(f"❌ Configuration error: {e}")
        sys.exit(1)
    
    # Print system info
    print(f"🔧 LLM Model: {Config.LLM_MODEL}")
    print(f"📁 Supported file types: {Config.SUPPORTED_FILE_TYPES}")
    print(f"📊 Max file size: {Config.MAX_FILE_SIZE_MB}MB")
    print(f"🎯 Matching algorithm weights: {Config.MATCHING_WEIGHTS}")
    print("=" * 60)
    
    # Start FastAPI server
    print("🌐 Starting Unified API server...")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("📋 Health check: http://localhost:8000/health")
    print("🔍 CV Screening: http://localhost:8000/screening/cv-analysis")
    print("🎯 Job Recommendations: http://localhost:8000/cv/upload")
    print("=" * 60)
    
    # Run server
    uvicorn.run(
        "api.recommendation_service:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
        access_log=True
    )

if __name__ == "__main__":
    main()
