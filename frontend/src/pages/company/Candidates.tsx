import React, { useState } from 'react';

interface Candidate {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  position: string;
  jobTitle: string;
  appliedDate: string;
  status: 'pending' | 'reviewing' | 'interviewed' | 'hired' | 'rejected';
  experience: string;
  location: string;
  skills: string[];
  resumeUrl?: string;
}

const Candidates: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const statusLabels = {
    pending: 'Chờ xử lý',
    reviewing: 'Đang xem xét',
    interviewed: 'Đã phỏng vấn',
    hired: 'Đã tuyển',
    rejected: 'Từ chối'
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewing: 'bg-blue-100 text-blue-800',
    interviewed: 'bg-purple-100 text-purple-800',
    hired: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const candidates: Candidate[] = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      email: 'nguyenvana@email.com',
      phone: '0123456789',
      position: 'Frontend Developer',
      jobTitle: 'Senior Frontend Developer',
      appliedDate: '2025-01-15',
      status: 'reviewing',
      experience: '3 năm',
      location: 'TP. Hồ Chí Minh',
      skills: ['ReactJS', 'TypeScript', 'Tailwind CSS'],
      resumeUrl: '/resumes/nguyenvana.pdf'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      email: 'tranthib@email.com',
      phone: '0987654321',
      position: 'Backend Developer',
      jobTitle: 'Node.js Developer',
      appliedDate: '2025-01-14',
      status: 'interviewed',
      experience: '2 năm',
      location: 'Hà Nội',
      skills: ['Node.js', 'MongoDB', 'Express'],
      resumeUrl: '/resumes/tranthib.pdf'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      email: 'levanc@email.com',
      phone: '0369852741',
      position: 'UI/UX Designer',
      jobTitle: 'Product Designer',
      appliedDate: '2025-01-13',
      status: 'pending',
      experience: '1 năm',
      location: 'Đà Nẵng',
      skills: ['Figma', 'Adobe XD', 'Photoshop'],
      resumeUrl: '/resumes/levanc.pdf'
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      email: 'phamthid@email.com',
      phone: '0741852963',
      position: 'Full Stack Developer',
      jobTitle: 'Full Stack Developer',
      appliedDate: '2025-01-12',
      status: 'hired',
      experience: '4 năm',
      location: 'TP. Hồ Chí Minh',
      skills: ['React', 'Node.js', 'PostgreSQL'],
      resumeUrl: '/resumes/phamthid.pdf'
    }
  ];

  const filteredCandidates = candidates.filter(candidate => {
    const matchesStatus = selectedStatus === 'all' || candidate.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const updateCandidateStatus = (candidateId: number, newStatus: Candidate['status']) => {
    // Cập nhật trạng thái ứng viên
    console.log(`Updating candidate ${candidateId} status to ${newStatus}`);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý ứng viên</h1>
        <p className="text-gray-600">Xem và quản lý các ứng viên đã ứng tuyển</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-gray-900">
            {candidates.length}
          </div>
          <div className="text-sm text-gray-600">Tổng ứng viên</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {candidates.filter(c => c.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Chờ xử lý</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-blue-600">
            {candidates.filter(c => c.status === 'reviewing').length}
          </div>
          <div className="text-sm text-gray-600">Đang xem xét</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-purple-600">
            {candidates.filter(c => c.status === 'interviewed').length}
          </div>
          <div className="text-sm text-gray-600">Đã phỏng vấn</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-green-600">
            {candidates.filter(c => c.status === 'hired').length}
          </div>
          <div className="text-sm text-gray-600">Đã tuyển</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm ứng viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="reviewing">Đang xem xét</option>
              <option value="interviewed">Đã phỏng vấn</option>
              <option value="hired">Đã tuyển</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Danh sách ứng viên ({filteredCandidates.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredCandidates.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có ứng viên</h3>
              <p className="text-gray-600">Không tìm thấy ứng viên phù hợp với tiêu chí tìm kiếm</p>
            </div>
          ) : (
            filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-12 h-12 rounded-full"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {candidate.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[candidate.status]}`}>
                          {statusLabels[candidate.status]}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2">Ứng tuyển: {candidate.jobTitle}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {candidate.email}
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {candidate.phone}
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {candidate.location}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span>Kinh nghiệm: {candidate.experience}</span>
                        <span>Ứng tuyển: {new Date(candidate.appliedDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {candidate.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {candidate.resumeUrl && (
                      <button className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors">
                        Xem CV
                      </button>
                    )}
                    
                    <div className="relative">
                      <select
                        value={candidate.status}
                        onChange={(e) => updateCandidateStatus(candidate.id, e.target.value as Candidate['status'])}
                        className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="reviewing">Đang xem xét</option>
                        <option value="interviewed">Đã phỏng vấn</option>
                        <option value="hired">Đã tuyển</option>
                        <option value="rejected">Từ chối</option>
                      </select>
                    </div>
                    
                    <button
                      onClick={() => setSelectedCandidate(candidate)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Chi tiết ứng viên
                </h3>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedCandidate.avatar}
                    alt={selectedCandidate.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {selectedCandidate.name}
                    </h4>
                    <p className="text-gray-600">{selectedCandidate.position}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-600">{selectedCandidate.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Điện thoại:</span>
                    <p className="text-gray-600">{selectedCandidate.phone}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Địa điểm:</span>
                    <p className="text-gray-600">{selectedCandidate.location}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Kinh nghiệm:</span>
                    <p className="text-gray-600">{selectedCandidate.experience}</p>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Kỹ năng:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedCandidate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    Đóng
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Liên hệ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates; 