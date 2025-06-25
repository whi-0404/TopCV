"""
Skills Management Module - Quản lý danh sách skills chuẩn và logic matching
"""
from __future__ import annotations

from typing import Set, Dict, Tuple
from enum import Enum
import re

class SkillCategory(Enum):
    """Phân loại kỹ năng"""
    PROGRAMMING_LANGUAGE = "Programming Languages"
    FRAMEWORK = "Frameworks & Libraries" 
    DATABASE = "Databases"
    CLOUD = "Cloud & DevOps"
    TOOLS = "Development Tools"
    DESIGN = "Design & UI/UX"
    TESTING = "Testing & QA"
    SECURITY = "Security"
    PROJECT_MANAGEMENT = "Project Management"
    SOFT_SKILLS = "Soft Skills"
    DATA = "Data & Analytics"
    MOBILE = "Mobile Development"
    LANGUAGE = "Languages"

class SkillManager:
    """Quản lý skills và logic matching"""
    
    # Danh sách skills chuẩn (đồng bộ với Java backend)
    STANDARD_SKILLS = [
        "3ds Max", "A/B testing", "Adobe", "Adobe Illustrator", "Adobe Photoshop", "Adobe XD", "Agile",
        "AI", "Android", "Android studio", "Angular", "AngularJS", "Ansible", "Apache Airflow",
        "Apache Spark", "API", "Appium", "ASPICE", "ASP.NET", "AutoCAD", "Automation Test", "AWS",
        "AWS CloudFormation", "AWS Lambda", "Azure", "Balsamiq", "Big Data", "Black box testing", "BLE",
        "Blockchain", "BRD", "Bridge Project Management", "Burp Suite", "Business Analysis",
        "Business Intelligence", "C#", "C++", "CI/CD", "Cisco", "C language", "Clean Architecture",
        "Cloud", "Cloud-native Architecture", "Cloud Security", "Cocos", "Cocos2d-x",
        "CompTIA Security+", "Computer Vision", "Container Security", "CRM", "Cryptography", "CSS",
        "CSS 3", "Cucumber", "Cybersecurity", "Cypress", "Dart", "Data Analysis", "Database",
        "Databricks", "Data cleaning", "Data-driven", "Data Engineer", "Data mining", "Data modeling",
        "Data Science", "Data Warehousing", "DBA", "DBT", "Deep Learning", "Design", "Design Systems",
        "DevOps", "DevSecOps", "Django", "Docker", "Drupal", "Ec-cube", "EDR", "Elasticsearch", "ELT",
        "Embedded", "Embedded C", "English", "Enterprise Architecture", "Entity Framework", "ERP", "ETL",
        "Express", "ExpressJS", "FastAPI", "Figma", "Firebase", "Firewall", "Firmware", "Flask",
        "Flutter", "Fullstack", "Games", "GCP", "Generative AI", "Git", "GitHub Actions", "Golang",
        "Google BigQuery", "Google Cloud", "Google Cloud SQL", "Governance, Risk & Compliance",
        "Grafana", "GraphQL", "Groovy", "Hadoop", "Hardware Design", "Hardware Troubleshooting",
        "Hibernate", "HPE LoadRunner", "HTML5", "IDS/IPS", "Illustrator", "Information Security",
        "Integration test", "iOS", "IoT", "ISO 27001", "IT Audit", "IT Communication/Translation",
        "IT Governance", "ITIL Foundation", "IT Support", "J2EE", "Japanese", "Japanese IT Communication",
        "Java", "JavaScript", "Jenkins", "Jira", "Jmeter", "JQuery", "JSON", "Juniper", "Kafka", "Kanban",
        "Katalon", "Kotlin", "Kubernetes", "Laravel", "Leadership", "LINQ", "Linux", "Live2D", "LLM",
        "Machine Learning", "Magento", "Market research", "Maya", "MFC", "Microservices",
        "Microservices Architecture", "Microsoft Azure SQL Database", "Microsoft Dynamics 365",
        "Microsoft SQL Server", "Middleware", "MLOps", "Mobile Apps", "MongoDB", "MVC", "MVVM", "MySQL",
        "Neo4j", "NestJS", ".NET", ".Net Core", "NetSuite", "Networking", "NextJS", "Nginx", "NLP",
        "NodeJS", "NoSQL", "Nuxt.js", "Objective C", "Odoo", "OOP", "OpenCV", "Oracle", "Pentest", "PHP",
        "Playwright", "PL/SQL", "PostgreSql", "Postman", "Power BI", "PQA", "Presale", "Product Design",
        "Product Management", "Product Metrics", "Product Owner", "Product roadmap", "Product strategy",
        "Project Management", "Prompt Engineering", "Prototyping", "Python", "PyTorch", "QA QC",
        "Quarkus", "R", "ReactJS", "React Native", "Realm", "Redis", "Redux", "REST Assured", "Retrofit",
        "Risk Assessment / BCP", "Risk Management", "Robot Framework", "Robotic Process Automation (RPA)",
        "ROS2", "RPA", "RSpec", "Ruby", "Ruby on Rails", "Salesforce", "SAP", "Sass", "Scala", "Scrum",
        "Security", "Security Hardening", "Selenium", "Shopify", "SIEM", "Sketch", "SLAM",
        "Smart contracts", "SOAP", "SOAR", "Software Architecture", "Solidity", "SOLID Principles",
        "Solution Architecture", "Spark", "Splunk", "Spring", "Spring Boot", "SQL", "SQLite", "SRS",
        "Stakeholder management", "Swift", "Symfony", "System Admin", "System Architecture", "Tableau",
        "Tailwind", "Team Management", "TensorFlow", "Terraform", "TestComplete", "Tester", "TestLink",
        "TestNG", "TestRail", "Trello", "TypeScript", "UI-UX", "UI / Visual Design", "Unit test",
        "Unity", "Unix", "Unreal Engine", "VMware", "VueJS", "Vuex", "Web API", "White box testing",
        "Windows", "Windows PowerShell", "Windows Server", "WinForms", "Wireframing", "WooCommerce",
        "Wordpress", "WPF", "XML"
    ]
    
    # Skill aliases (mapping variations to standard names)
    SKILL_ALIASES = {
        # Programming Languages
        'js': 'JavaScript',
        'ts': 'TypeScript', 
        'py': 'Python',
        'c++': 'C++',
        'c#': 'C#',
        'golang': 'Golang',
        'go': 'Golang',
        
        # Frameworks
        'react': 'ReactJS',
        'reactjs': 'ReactJS',
        'react.js': 'ReactJS',
        'vue': 'VueJS',
        'vuejs': 'VueJS',
        'vue.js': 'VueJS',
        'angular': 'Angular',
        'angularjs': 'AngularJS',
        'next': 'NextJS',
        'nextjs': 'NextJS',
        'next.js': 'NextJS',
        'nuxt': 'Nuxt.js',
        'nuxtjs': 'Nuxt.js',
        'nuxt.js': 'Nuxt.js',
        'express': 'Express',
        'expressjs': 'ExpressJS',
        'nest': 'NestJS',
        'nestjs': 'NestJS',
        
        # Databases
        'postgres': 'PostgreSql',
        'postgresql': 'PostgreSql',
        'psql': 'PostgreSql',
        'mongo': 'MongoDB',
        'mongodb': 'MongoDB',
        'mysql': 'MySQL',
        'mssql': 'Microsoft SQL Server',
        'sqlserver': 'Microsoft SQL Server',
        'redis': 'Redis',
        
        # Cloud & DevOps
        'aws': 'AWS',
        'amazon web services': 'AWS',
        'azure': 'Azure',
        'gcp': 'GCP',
        'google cloud': 'Google Cloud',
        'docker': 'Docker',
        'k8s': 'Kubernetes',
        'kubernetes': 'Kubernetes',
        
        # Tools
        'git': 'Git',
        'github': 'Git',
        'gitlab': 'Git',
        'jira': 'Jira',
        'postman': 'Postman',
        
        # Testing
        'selenium': 'Selenium',
        'cypress': 'Cypress',
        'jest': 'JavaScript',  # Jest is for JS testing
        'junit': 'Java',       # JUnit is for Java testing
        
        # Mobile
        'android': 'Android',
        'ios': 'iOS',
        'flutter': 'Flutter',
        'react native': 'React Native',
        'reactnative': 'React Native',
        
        # 🚀 Enhanced AI/ML aliases
        'ai': 'AI',
        'artificial intelligence': 'AI',
        'ml': 'Machine Learning',
        'machine learning': 'Machine Learning',
        'deep learning': 'Deep Learning',
        'dl': 'Deep Learning',
        'tensorflow': 'TensorFlow',
        'tf': 'TensorFlow',
        'pytorch': 'PyTorch',
        'torch': 'PyTorch',
        'opencv': 'OpenCV',
        'cv2': 'OpenCV',
        'computer vision': 'Computer Vision',
        'cv': 'Computer Vision',
        'nlp': 'NLP',
        'natural language processing': 'NLP',
        'data science': 'Data Science',
        'data scientist': 'Data Science',
        'data analysis': 'Data Analysis',
        'data analyst': 'Data Analysis',
        'pandas': 'Python',  # Pandas is Python library
        'numpy': 'Python',   # NumPy is Python library
        'scikit-learn': 'Machine Learning',
        'sklearn': 'Machine Learning',
        'keras': 'Deep Learning',
        'neural networks': 'Deep Learning',
        'neural network': 'Deep Learning',
        'cnn': 'Deep Learning',
        'rnn': 'Deep Learning',
        'lstm': 'Deep Learning',
        'transformer': 'Deep Learning',
        'bert': 'NLP',
        'gpt': 'NLP',
        'llm': 'LLM',
        'large language model': 'LLM',
        'generative ai': 'Generative AI',
        'gen ai': 'Generative AI',
        
        # Languages
        'english': 'English',
        'japanese': 'Japanese',
        'tiếng anh': 'English',
        'tiếng nhật': 'Japanese'
    }
    
    # Skills grouped by similarity for fuzzy matching
    SKILL_GROUPS = [
        ['Python', 'py'],
        ['JavaScript', 'js', 'node.js', 'nodejs', 'NodeJS'],
        ['ReactJS', 'react', 'react.js'],
        ['VueJS', 'vue', 'vue.js'],
        ['Angular', 'AngularJS'],
        ['PostgreSql', 'postgres', 'postgresql', 'psql'],
        ['MongoDB', 'mongo'],
        ['MySQL', 'mysql'],
        ['Docker', 'containerization'],
        ['Kubernetes', 'k8s'],
        ['AWS', 'amazon web services'],
        # 🚀 Enhanced AI/ML skill groups
        ['AI', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'dl'],
        ['Machine Learning', 'ml', 'ai', 'artificial intelligence', 'scikit-learn', 'sklearn'],
        ['Deep Learning', 'dl', 'neural networks', 'neural network', 'cnn', 'rnn', 'lstm'],
        ['TensorFlow', 'tensorflow', 'tf', 'keras'],
        ['PyTorch', 'pytorch', 'torch'],
        ['OpenCV', 'opencv', 'cv2', 'computer vision', 'cv'],
        ['NLP', 'natural language processing', 'bert', 'gpt', 'transformer'],
        ['Data Science', 'data scientist', 'data analysis', 'data analyst'],
        ['Python', 'py', 'pandas', 'numpy', 'scipy'],
        ['LLM', 'large language model', 'generative ai', 'gen ai'],
        ['C#', 'csharp', 'c-sharp'],
        ['C++', 'cplusplus', 'c-plus-plus'],
        ['.NET', '.Net Core', 'dotnet'],
        ['Spring', 'Spring Boot'],
        ['CSS', 'CSS 3'],
        ['HTML5', 'html'],
        ['TypeScript', 'ts'],
        ['Java', 'J2EE']
    ]
    
    @classmethod
    def normalize_skill(cls, skill: str) -> str:
        """Chuẩn hóa tên skill"""
        if not skill:
            return ""
            
        skill = skill.strip()
        skill_lower = skill.lower()
        
        # Check trong aliases trước
        if skill_lower in cls.SKILL_ALIASES:
            return cls.SKILL_ALIASES[skill_lower]
        
        # Tìm trong standard skills (case insensitive)
        for standard_skill in cls.STANDARD_SKILLS:
            if skill_lower == standard_skill.lower():
                return standard_skill
                
        # Return original nếu không tìm thấy
        return skill
    
    @classmethod
    def extract_skills_from_text(cls, text: str) -> list[str]:
        """Trích xuất skills từ text"""
        if not text:
            return []
            
        found_skills = []
        text_lower = text.lower()
        
        # Tìm exact matches trước
        for skill in cls.STANDARD_SKILLS:
            # Use word boundaries để tránh false positives
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.append(skill)
        
        # Tìm aliases
        for alias, standard_skill in cls.SKILL_ALIASES.items():
            pattern = r'\b' + re.escape(alias.lower()) + r'\b'
            if re.search(pattern, text_lower) and standard_skill not in found_skills:
                found_skills.append(standard_skill)
        
        return list(set(found_skills))  # Remove duplicates
    
    @classmethod
    def calculate_skill_match(cls, cv_skills: list[str], job_skills: list[str]) -> Tuple[float, list[str], list[str]]:
        """
        Tính độ matching giữa CV skills và Job skills
        Returns: (match_score, matched_skills, missing_skills)
        """
        if not job_skills:
            return 0.5, [], cv_skills
            
        if not cv_skills:
            return 0.0, [], job_skills
        
        # Normalize skills
        cv_skills_normalized = [cls.normalize_skill(skill) for skill in cv_skills]
        job_skills_normalized = [cls.normalize_skill(skill) for skill in job_skills]
        
        cv_skills_set = set(skill.lower() for skill in cv_skills_normalized if skill)
        job_skills_set = set(skill.lower() for skill in job_skills_normalized if skill)
        
        # Exact matches
        exact_matches = cv_skills_set.intersection(job_skills_set)
        
        # Fuzzy matches using skill groups
        fuzzy_matches = set()
        for cv_skill in cv_skills_set:
            for job_skill in job_skills_set:
                if cv_skill != job_skill and cls._are_similar_skills(cv_skill, job_skill):
                    fuzzy_matches.add(cv_skill)
                    exact_matches.add(job_skill)  # Consider as matched
        
        all_matches = exact_matches.union(fuzzy_matches)
        
        # Calculate match score
        if not job_skills_set:
            match_score = 0.5
        else:
            match_score = len(all_matches) / len(job_skills_set)
            
        # Bonus for having many skills
        if len(all_matches) >= 3:
            match_score = min(1.0, match_score * 1.1)  # 10% bonus
        
        # Find actual skill names for response
        matched_skills = []
        missing_skills = []
        
        for job_skill in job_skills_normalized:
            if job_skill.lower() in all_matches:
                matched_skills.append(job_skill)
            else:
                missing_skills.append(job_skill)
        
        return min(1.0, match_score), matched_skills, missing_skills
    
    @classmethod
    def _are_similar_skills(cls, skill1: str, skill2: str) -> bool:
        """Kiểm tra 2 skills có tương tự không"""
        # Check in predefined groups
        for group in cls.SKILL_GROUPS:
            group_lower = [s.lower() for s in group]
            if skill1 in group_lower and skill2 in group_lower:
                return True
        
        # Check substring containment for longer skills
        if len(skill1) > 3 and skill1 in skill2:
            return True
        if len(skill2) > 3 and skill2 in skill1:
            return True
            
        return False
    
    @classmethod
    def get_skill_category(cls, skill: str) -> SkillCategory:
        """Lấy category của skill (for future use)"""
        skill_lower = skill.lower()
        
        # Programming languages
        prog_langs = ['python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'golang', 'php', 'ruby', 'swift', 'kotlin']
        if any(lang in skill_lower for lang in prog_langs):
            return SkillCategory.PROGRAMMING_LANGUAGE
            
        # Frameworks
        frameworks = ['react', 'vue', 'angular', 'django', 'flask', 'spring', 'express', 'nest']
        if any(fw in skill_lower for fw in frameworks):
            return SkillCategory.FRAMEWORK
            
        # Databases
        databases = ['mysql', 'postgres', 'mongodb', 'redis', 'oracle', 'sql']
        if any(db in skill_lower for db in databases):
            return SkillCategory.DATABASE
            
        # Cloud
        cloud_terms = ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'cloud']
        if any(term in skill_lower for term in cloud_terms):
            return SkillCategory.CLOUD
            
        # Default
        return SkillCategory.TOOLS
    
    @classmethod
    def validate_skills(cls, skills: list[str]) -> list[str]:
        """Validate và clean skill list"""
        if not skills:
            return []
            
        valid_skills = []
        for skill in skills:
            normalized = cls.normalize_skill(skill)
            if normalized and normalized not in valid_skills:
                valid_skills.append(normalized)
                
        return valid_skills 