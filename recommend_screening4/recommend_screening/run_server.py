#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script để chạy Job Recommendation API Server
"""

import uvicorn
from router.recommend_service import app

if __name__ == "__main__":
    print("🚀 Starting Job Recommendation API Server...")
    print("📝 API Documentation: http://localhost:8000/docs")
    print("📖 ReDoc: http://localhost:8000/redoc")
    print("❤️ Health Check: http://localhost:8000/health")
    
    uvicorn.run(
        "router.recommend_service:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 