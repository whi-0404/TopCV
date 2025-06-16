CV_EXTRACTOR_PROMPT = """
Bạn là một chuyên gia phân tích CV. Hãy trích xuất thông tin từ nội dung CV sau thành định dạng JSON có cấu trúc.

YÊU CẦU NGHIÊM NGẶT:
- Các thông tin mô tả, vị trí, tiêu đề, mục tiêu... nếu viết bằng tiếng Anh phải được dịch sang tiếng Việt để thống nhất (ví dụ: "Software Engineer" → "Kỹ sư phần mềm")
- Các thuật ngữ kỹ thuật, tên công nghệ, kỹ năng chuyên môn vẫn giữ nguyên bằng tiếng Anh (ví dụ: JavaScript, ReactJS, MySQL, Scrum, Git,...)
- Không được tự ý thêm thông tin không có trong CV

1. THÔNG TIN CÁ NHÂN:
- full_name: Tên đầy đủ
- email: Địa chỉ email
- phone: Số điện thoại
- location: Địa chỉ/Thành phố
- date_of_birth: Ngày sinh (nếu có)

2. THÔNG TIN NGHỀ NGHIỆP:
- current_position: Vị trí hiện tại hoặc mong muốn (dịch sang tiếng Việt nếu cần)
- career_objective: Mục tiêu nghề nghiệp (dịch sang tiếng Việt nếu là tiếng Anh)
- summary: Tóm tắt về bản thân (dịch sang tiếng Việt nếu là tiếng Anh)

3. KỸ NĂNG:
- technical_skills: Các kỹ năng kỹ thuật (programming languages, frameworks, tools...)
- soft_skills: Kỹ năng mềm (teamwork, communication, leadership...) → dịch sang tiếng Việt (ví dụ: giao tiếp, làm việc nhóm)
- languages: Ngôn ngữ (English, Vietnamese... kèm level nếu có)

4. KINH NGHIỆM LÀM VIỆC:
- work_experience: Danh sách công việc với định dạng:
  {{
    "position": "Vị trí công việc" (dịch sang tiếng Việt nếu là tiếng Anh),
    "company": "Tên công ty", 
    "duration": "Thời gian",
    "description": "Mô tả công việc" (dịch nếu cần),
    "start_date": "Ngày bắt đầu",
    "end_date": "Ngày kết thúc",
    "is_current": true/false
  }}
- total_experience_years: Tổng số năm kinh nghiệm (dạng số thực)

5. HỌC VẤN:
- education: Danh sách bằng cấp với định dạng:
  {{
    "degree": "Bằng cấp" (dịch nếu là tiếng Anh, ví dụ: Bachelor → Cử nhân),
    "university": "Trường học",
    "major": "Chuyên ngành",
    "year": năm_tốt_nghiệp,
    "gpa": điểm_GPA
  }}
- highest_education: Trình độ học vấn cao nhất (Trung học/Cao đẳng/Đại học/Thạc sĩ/Tiến sĩ)

6. DỰ ÁN & CHỨNG CHỈ:
- projects: Danh sách dự án với định dạng:
  {{
    "name": "Tên dự án",
    "description": "Mô tả dự án" (dịch sang tiếng Việt nếu là tiếng Anh), 
    "technologies": ["tech1", "tech2"],
    "url": "Link dự án",
    "start_date": "Ngày bắt đầu",
    "end_date": "Ngày kết thúc"
  }}
- certifications: Danh sách chứng chỉ

LƯU Ý:
- Chuẩn hóa tên skills (ví dụ: js → JavaScript, react → ReactJS)
- Tính `total_experience_years` từ `work_experience`
- Nếu không có thông tin, để `null` hoặc mảng rỗng []
- Trả về kết quả JSON hợp lệ 100% và KHÔNG có mô tả thêm

CV TEXT:
{cv_text}

{format_instructions}

Hãy trả về JSON đúng schema sau:
"""
CV_VISION_PROMPT = """
Bạn là một chuyên gia phân tích CV. Hãy đọc nội dung từ hình ảnh CV và trích xuất dữ liệu dưới đây thành định dạng JSON chuẩn, tương thích với schema.

YÊU CẦU NGHIÊM NGẶT:
- Các tiêu đề, mô tả, vị trí công việc, mục tiêu,... nếu viết bằng tiếng Anh, bạn cần dịch sang tiếng Việt để thống nhất.
- Các **thuật ngữ kỹ thuật**, tên công nghệ (ví dụ: JavaScript, ReactJS, MySQL, Docker, Git, Scrum...) giữ nguyên tiếng Anh.
- **Chuẩn hóa kỹ năng**: ví dụ:
  - `js` → `JavaScript`, `react` → `ReactJS`, `node` → `Node.js`
  - `team work` → `Làm việc nhóm`, `communication` → `Giao tiếp`
  - Tránh trùng lặp kỹ năng viết khác nhau (ví dụ: `git`, `Git`, `GIT` → chỉ để `Git`)
- Không được thêm bất kỳ thông tin nào không có trong hình ảnh.

Trả về JSON hợp lệ theo định dạng:

{
  "full_name": string hoặc null,
  "email": string hoặc null,
  "phone": string hoặc null,
  "address": string hoặc null,
  "job_title": string hoặc null (dịch sang tiếng Việt nếu cần),
  "years_experience": int hoặc null,
  "current_company": string hoặc null,
  "technical_skills": [string] (giữ nguyên tiếng Anh, chuẩn hóa tên),
  "soft_skills": [string] (dịch sang tiếng Việt, chuẩn hóa tên),
  "languages": [string],
  "tools": [string] (giữ nguyên tiếng Anh, chuẩn hóa tên),
  "education_level": string hoặc null (dịch sang tiếng Việt nếu cần),
  "major": string hoặc null,
  "university": string hoặc null,
  "graduation_year": int hoặc null,
  "projects": [
    {
      "name": string,
      "description": string (dịch sang tiếng Việt nếu cần),
      "technologies": [string],
      "url": string hoặc null,
      "start_date": string hoặc null,
      "end_date": string hoặc null
    }
  ],
  "desired_position": string hoặc null (dịch sang tiếng Việt nếu có),
  "desired_location": string hoặc null,
  "work_experience": [
    {
      "position": string,
      "company": string,
      "start_date": string hoặc null,
      "end_date": string hoặc null,
      "description": string (dịch sang tiếng Việt nếu cần)
      "is_current": boolean (true nếu là công việc hiện tại)
    }
  ]
}

CHỈ trả về JSON thuần. KHÔNG kèm lời giải thích.
"""
