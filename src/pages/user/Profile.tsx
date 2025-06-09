import React, { useState } from 'react';

interface UserProfile {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    avatar: string;
  };
  professional: {
    currentPosition: string;
    experience: string;
    expectedSalary: string;
    workLocation: string;
    summary: string;
  };
  education: Array<{
    id: number;
    degree: string;
    major: string;
    school: string;
    graduationYear: string;
    gpa?: string;
  }>;
  experience: Array<{
    id: number;
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
  }>;
  skills: string[];
  languages: Array<{
    id: number;
    language: string;
    level: string;
  }>;
  certifications: Array<{
    id: number;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
  }>;
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState<UserProfile>({
    personalInfo: {
      fullName: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0123456789',
      dateOfBirth: '1995-01-15',
      gender: 'male',
      address: 'Quận 1, TP. Hồ Chí Minh',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    professional: {
      currentPosition: 'Frontend Developer',
      experience: '3 năm',
      expectedSalary: '20-25 triệu',
      workLocation: 'TP. Hồ Chí Minh',
      summary: 'Frontend Developer với 3 năm kinh nghiệm phát triển ứng dụng web sử dụng React, TypeScript và các công nghệ hiện đại. Có kinh nghiệm làm việc trong môi trường Agile và đam mê tạo ra những sản phẩm chất lượng cao.'
    },
    education: [
      {
        id: 1,
        degree: 'Cử nhân',
        major: 'Công nghệ thông tin',
        school: 'Đại học Bách Khoa TP.HCM',
        graduationYear: '2017',
        gpa: '3.2/4.0'
      }
    ],
    experience: [
      {
        id: 1,
        position: 'Frontend Developer',
        company: 'TechCorp Vietnam',
        startDate: '2021-06',
        endDate: '',
        isCurrent: true,
        description: 'Phát triển và bảo trì các ứng dụng web sử dụng React, TypeScript. Tham gia xây dựng hệ thống quản lý nội bộ phục vụ 500+ nhân viên.'
      },
      {
        id: 2,
        position: 'Junior Frontend Developer',
        company: 'StartupXYZ',
        startDate: '2019-03',
        endDate: '2021-05',
        isCurrent: false,
        description: 'Xây dựng giao diện người dùng cho ứng dụng e-commerce. Làm việc với team 5 người, tăng conversion rate lên 15%.'
      }
    ],
    skills: ['ReactJS', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Node.js', 'Git', 'Figma'],
    languages: [
      { id: 1, language: 'Tiếng Việt', level: 'Bản ngữ' },
      { id: 2, language: 'Tiếng Anh', level: 'Trung cấp' }
    ],
    certifications: [
      {
        id: 1,
        name: 'React Developer Certification',
        issuer: 'Meta',
        issueDate: '2022-08',
        expiryDate: '2025-08'
      }
    ]
  });

  const [newSkill, setNewSkill] = useState('');

  const tabs = [
    { id: 'personal', name: 'Thông tin cá nhân', icon: '👤' },
    { id: 'professional', name: 'Thông tin nghề nghiệp', icon: '💼' },
    { id: 'education', name: 'Học vấn', icon: '🎓' },
    { id: 'experience', name: 'Kinh nghiệm', icon: '💻' },
    { id: 'skills', name: 'Kỹ năng', icon: '🔧' },
    { id: 'languages', name: 'Ngôn ngữ', icon: '🌐' },
    { id: 'certifications', name: 'Chứng chỉ', icon: '📜' }
  ];

  const handlePersonalInfoChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleProfessionalChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      professional: {
        ...prev.professional,
        [field]: value
      }
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSave = () => {
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6 mb-6">
        <div className="relative">
          <img
            src={profileData.personalInfo.avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
          />
          {isEditing && (
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{profileData.personalInfo.fullName}</h2>
          <p className="text-gray-600">{profileData.professional.currentPosition}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
          {isEditing ? (
            <input
              type="text"
              value={profileData.personalInfo.fullName}
              onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-900">{profileData.personalInfo.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          {isEditing ? (
            <input
              type="email"
              value={profileData.personalInfo.email}
              onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-900">{profileData.personalInfo.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
          {isEditing ? (
            <input
              type="tel"
              value={profileData.personalInfo.phone}
              onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-900">{profileData.personalInfo.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
          {isEditing ? (
            <input
              type="date"
              value={profileData.personalInfo.dateOfBirth}
              onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-900">{new Date(profileData.personalInfo.dateOfBirth).toLocaleDateString('vi-VN')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
          {isEditing ? (
            <select
              value={profileData.personalInfo.gender}
              onChange={(e) => handlePersonalInfoChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          ) : (
            <p className="text-gray-900">
              {profileData.personalInfo.gender === 'male' ? 'Nam' : 
               profileData.personalInfo.gender === 'female' ? 'Nữ' : 'Khác'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
          {isEditing ? (
            <input
              type="text"
              value={profileData.personalInfo.address}
              onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-900">{profileData.personalInfo.address}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderProfessional = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí hiện tại</label>
          {isEditing ? (
            <input
              type="text"
              value={profileData.professional.currentPosition}
              onChange={(e) => handleProfessionalChange('currentPosition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-900">{profileData.professional.currentPosition}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kinh nghiệm</label>
          {isEditing ? (
            <input
              type="text"
              value={profileData.professional.experience}
              onChange={(e) => handleProfessionalChange('experience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-900">{profileData.professional.experience}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mức lương mong muốn</label>
          {isEditing ? (
            <input
              type="text"
              value={profileData.professional.expectedSalary}
              onChange={(e) => handleProfessionalChange('expectedSalary', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-900">{profileData.professional.expectedSalary}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm làm việc</label>
          {isEditing ? (
            <input
              type="text"
              value={profileData.professional.workLocation}
              onChange={(e) => handleProfessionalChange('workLocation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-900">{profileData.professional.workLocation}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tóm tắt bản thân</label>
        {isEditing ? (
          <textarea
            value={profileData.professional.summary}
            onChange={(e) => handleProfessionalChange('summary', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        ) : (
          <p className="text-gray-900 leading-relaxed">{profileData.professional.summary}</p>
        )}
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      {isEditing && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Thêm kỹ năng mới..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          />
          <button
            onClick={addSkill}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Thêm
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {profileData.skills.map((skill) => (
          <div
            key={skill}
            className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
          >
            <span className="text-blue-900 font-medium">{skill}</span>
            {isEditing && (
              <button
                onClick={() => removeSkill(skill)}
                className="text-red-600 hover:text-red-700 ml-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'professional':
        return renderProfessional();
      case 'skills':
        return renderSkills();
      case 'education':
        return (
          <div className="space-y-4">
            {profileData.education.map((edu) => (
              <div key={edu.id} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">{edu.degree} - {edu.major}</h3>
                <p className="text-gray-600">{edu.school}</p>
                <p className="text-sm text-gray-500">Tốt nghiệp: {edu.graduationYear}</p>
                {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-4">
            {profileData.experience.map((exp) => (
              <div key={exp.id} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">
                  {exp.startDate} - {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                </p>
                <p className="text-gray-700 mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        );
      case 'languages':
        return (
          <div className="space-y-4">
            {profileData.languages.map((lang) => (
              <div key={lang.id} className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
                <span className="font-medium text-gray-900">{lang.language}</span>
                <span className="text-gray-600">{lang.level}</span>
              </div>
            ))}
          </div>
        );
      case 'certifications':
        return (
          <div className="space-y-4">
            {profileData.certifications.map((cert) => (
              <div key={cert.id} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                <p className="text-gray-600">{cert.issuer}</p>
                <p className="text-sm text-gray-500">
                  Cấp: {cert.issueDate} {cert.expiryDate && `- Hết hạn: ${cert.expiryDate}`}
                </p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Hồ sơ cá nhân</h1>
            <p className="text-gray-600">Quản lý thông tin hồ sơ và CV của bạn</p>
          </div>
          <div className="flex space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Chỉnh sửa
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Lưu thay đổi
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;