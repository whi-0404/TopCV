from langchain_community.document_loaders import PyPDFLoader
from langchain_core.prompts import ChatPromptTemplate
import re
from langchain_google_genai import ChatGoogleGenerativeAI
from docx import Document
from dotenv import load_dotenv
import json
import os
from typing import Dict, Any

# Load API key từ .env
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

# Khởi tạo mô hình Gemini
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)

# Prompt template cho screening CV
SCREENING_PROMPT = """
Bạn là một chuyên gia trong lĩnh vực Nhân sự và đánh giá ứng viên. Hãy phân tích CV ứng viên và đối chiếu với JD để đánh giá.

JD Summary:
- Kỹ năng : {core_skills}
- Yêu cầu công việc: {requirements}
- Mô tả công việc: {description}
- Kinh nghiệm yêu cầu: {experience_required}
CV của ứng viên:
{cv_text}

Hãy đánh giá theo các tiêu chí sau (thang điểm 0-5):
1. Kỹ năng chuyên môn & Công nghệ
2. Kinh nghiệm liên quan
3. Học vấn & Chứng chỉ
4. Độ phù hợp tổng thể

Đưa ra nhận xét:
   - matching_points: Liệt kê tối đa 5 điểm mạnh cụ thể mà CV ĐÃ CÓ phù hợp với JD.
   - not_matching_points: Liệt kê tối đa 5 điểm không phù hợp mà CV không đáp ứng được kỳ vọng của JD.
Trả về kết quả dạng JSON:
{{
    "overall_score": <0-5>,
    "matching_points": ["Tiêu chí phù hợp chính giữa JD và CV (tối đa 5 điểm)"],
    "not_matching_points": ["Những điểm thiếu chính giữa JD và CV (tối đa 5 điểm)"]
}}
"""

def read_file_content(file_path: str) -> str:
    """Đọc nội dung từ file PDF hoặc DOCX"""
    # Validate file path
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    # Convert to absolute path
    file_path = os.path.abspath(file_path)
    
    ext = os.path.splitext(file_path)[1].lower()
    try:
        if ext == ".pdf":
            loader = PyPDFLoader(file_path)
            docs = loader.load()
            return "\n".join(doc.page_content for doc in docs)
        elif ext == ".docx":
            doc = Document(file_path)
            return "\n".join([para.text for para in doc.paragraphs])
        else:
            raise ValueError(f"Unsupported file format: {ext}. Please use PDF or DOCX.")
    except Exception as e:
        raise Exception(f"Error reading file {file_path}: {str(e)}")

def screen_cv(cv_path: str, jd_data: Dict[str, Any]) -> Dict[str, Any]:
    """Đánh giá CV dựa trên JD từ PostgreSQL database"""
    try:
        # Validate input
        if not cv_path or not jd_data:
            raise ValueError("CV path and JD data are required")
            
        # Read CV content with better error handling
        try:
            cv_text = read_file_content(cv_path)
        except Exception as e:
            print(f"Failed to read CV file: {str(e)}")
            raise
        
        # Tạo prompt với context
        prompt = ChatPromptTemplate.from_template(SCREENING_PROMPT)
        
        # Chuẩn bị input data
        input_data = {
            "cv_text": cv_text,
            **jd_data  # Spread JD data từ PostgreSQL vào input
        }
        
        # Gọi model
        chain = prompt | llm
        response = chain.invoke(input_data)
        
        # Xử lý response
        content = response.content if hasattr(response, 'content') else response
        cleaned = re.sub(r"^```json|^```|```$", "", content.strip(), flags=re.MULTILINE)
        
        # Parse JSON result
        result = json.loads(cleaned)
        return result
        
    except Exception as e:
        print(f"Error in screening CV: {str(e)}")
        return {
            "error": str(e),
            "overall_score": 0,
            "matching_points": [],
            "not_matching_points": ["Error occurred during evaluation: " + str(e)]
        } 