import re
import json
import base64
import tempfile
import os
from io import BytesIO
from typing import Dict, Optional
from pathlib import Path
from PIL import Image
from docx import Document
from pydantic import ValidationError
from pypdf import PdfReader
from langchain_core.messages import HumanMessage
# LLM imports
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from template_prompt.cv_prompt import CV_EXTRACTOR_PROMPT,CV_VISION_PROMPT
from models.cv_data import CVData
from config import Config
from models.skills import SkillManager
class CVExtractor:
    def __init__(self, config: Config):
        self.config = config
        self.llm = ChatGoogleGenerativeAI(
            model=Config.LLM_MODEL,
            api_key=Config.GOOGLE_API_KEY,
            temperature=Config.LLM_TEMPERATURE
        )
        self.parser = PydanticOutputParser(pydantic_object=CVData)
        self.vision_prompt = CV_VISION_PROMPT
        self.cv_extractor_prompt = CV_EXTRACTOR_PROMPT
        self.skill_manager = SkillManager()

    def extract_from_file(self, file_path: str) -> CVData:
        """
        Trích xuất CV từ file
        Supports: PDF, DOCX, JPG, PNG
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File không tồn tại: {file_path}")
        
        file_ext = Path(file_path).suffix.lower()
        
        if file_ext not in Config.SUPPORTED_FILE_TYPES:
            raise ValueError(f"File type không được hỗ trợ: {file_ext}. Hỗ trợ: {Config.SUPPORTED_FILE_TYPES}")
        
        try:
            if file_ext == '.pdf':
                return self._extract_from_pdf(file_path)
            elif file_ext in ['.docx', '.doc']:
                return self._extract_from_docx(file_path)
            elif file_ext in ['.jpg', '.jpeg', '.png']:
                return self._extract_from_image(file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_ext}")
                
        except Exception as e:
            print(f"Lỗi extract CV: {str(e)}")
    def _process_with_llm(self, text: str) -> CVData:
        """
        Xử lý văn bản CV bằng LLM để trích xuất thông tin
        """
        prompt = PromptTemplate(
            template=self.cv_extractor_prompt,
            input_variables=["cv_text"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()}
        )
        
        chain = prompt | self.llm | self.parser
        try:
            # Invoke chain
            result = chain.invoke({"cv_text": text})
            
            # Post-process result
            tmp = self._post_process_cv_data(result)

            # print("Post-processed CV data: ", tmp)

            return tmp
            # return result
            
        except Exception as e:
            print(f"LLM processing error: {str(e)}")

    def _extract_from_pdf(self, pdf_path: str) -> CVData:
        """Extract từ PDF file"""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                # print("CV: ", text)
                if not text.strip():
                    raise ValueError("Không thể extract text từ PDF")
                
                return self._process_with_llm(text)
                
        except Exception as e:
            raise Exception(f"Lỗi đọc PDF: {str(e)}")
    def _extract_from_docx(self, docx_path: str) -> CVData:
        """Extract từ DOCX file"""
        try:
            doc = Document(docx_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            
            if not text.strip():
                raise ValueError("DOCX file trống")
            
            return self._process_with_llm(text)
            
        except Exception as e:
            raise Exception(f"Lỗi đọc DOCX: {str(e)}")
        
    def _extract_from_image(self, image_path: str) -> CVData:
        """Extract từ image file sử dụng Gemini Vision"""
        try:
            # Process image
            img_base64 = self._process_image(image_path)

            message_local = HumanMessage(
                content=[
                    {"type": "text", "text": self.vision_prompt},
                    {"type": "image_url", "image_url": f"data:image/jpeg;base64,{img_base64}"},
                ]
            )

            # Gọi Gemini Vision
            response = self.llm.invoke([message_local])

            try:
                if isinstance(response.content, str):
                    # Clean JSON string nếu có mã markdown hoặc dấu ```json
                    cleaned = re.sub(r"^```(json)?", "", response.content.strip())
                    cleaned = re.sub(r"```$", "", cleaned.strip())
                    print("cleaned: ", cleaned)
                    # Parse bằng PydanticOutputParser (sẽ trả về CVData)
                    a = self.parser.parse(cleaned)

                    return self._post_process_cv_data(a)
                else:
                    raise ValueError("Gemini Vision trả về format không hợp lệ.")
            
            except Exception as e:
                print(f"\n❌ Lỗi parse kết quả từ Gemini Vision: {str(e)}")
                return CVData()

        except Exception as e:
            print(f"Lỗi extract từ image: {str(e)}")
            return CVData()

    
    def _process_image(self, image_path: str) -> str:
        """Process image to base64"""
        try:
            image = Image.open(image_path)
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize if too large
            max_size = 1024
            if max(image.size) > max_size:
                image.thumbnail((max_size, max_size))
            
            # Convert to base64
            buffered = BytesIO()
            image.save(buffered, format="JPEG", quality=95)
            img_str = base64.b64encode(buffered.getvalue()).decode()
            
            return img_str
            
        except Exception as e:
            raise Exception(f"Lỗi xử lý image: {str(e)}")
    def _post_process_cv_data(self, cv_data: CVData) -> CVData:
        """Post-process CV data sau khi extract"""
        
        # Chuẩn hóa skills
        if cv_data.technical_skills:
            cv_data.technical_skills = self.skill_manager.validate_skills(cv_data.technical_skills)
        
        # Extract additional skills from text fields
        additional_skills = []
        
        # Extract from work experience descriptions
        for exp in cv_data.work_experience:
            if exp.description:
                skills = self.skill_manager.extract_skills_from_text(exp.description)
                additional_skills.extend(skills)
        
        # Extract skills from projects if available
        if cv_data.projects:
            for project in cv_data.projects:
                if project.technologies:
                    for tech in project.technologies:
                        tech_skills = self.skill_manager.extract_skills_from_text(tech)
                        additional_skills.extend(tech_skills)
                if project.description:
                    desc_skills = self.skill_manager.extract_skills_from_text(project.description)
                    additional_skills.extend(desc_skills)
        
        # Merge and deduplicate skills
        all_skills = set(cv_data.technical_skills + additional_skills)
        cv_data.technical_skills = list(all_skills)
        
        # Total experience years removed - use years_experience field instead
        
        return cv_data
    
    
if __name__ == "__main__":
    config = Config()
    extractor = CVExtractor(config)
    path_pdf = "/mnt/d/Users/ASUS/Downloads/recommend_screening/cv_1726397675677.pdf"
    path_pdf2 = "/mnt/d/Users/ASUS/Downloads/recommend_screening/cv2.pdf"
    path_img = "/mnt/d/Users/ASUS/Downloads/recommend_screening/1.jpg"
    try:
        cv_data = extractor.extract_from_file(path_pdf)
        print("✅ Trích xuất CV thành công!")
        print("Thông tin CV:")
        print(cv_data)

        print("-----------------------------------------")
        # Convert sang dict
        cv_dict = cv_data.model_dump()

        # In ra màn hình
        print(json.dumps(cv_dict, indent=2, ensure_ascii=False))

        # Lưu ra file
        output_path = "/mnt/d/Users/ASUS/Downloads/recommend_screening/cv_output.json"
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(json.dumps(cv_dict, indent=2, ensure_ascii=False))
            print(f"✅ Kết quả đã lưu vào: {output_path}")

    except Exception as e:
        print(f"Error extracting CV: {str(e)}")
    
