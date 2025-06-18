import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  DocumentTextIcon,
  PaperClipIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { resumeApi, type ResumeResponse, isValidResumeFile, formatFileSize, getFileIcon } from '../../services/api';
import { applicationApi } from '../../services/api/applicationApi';
import { aiRecommendationApi } from '../../services/api/aiRecommendationApi';
import { useAuth } from '../../contexts/AuthContext';

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: number;
  jobTitle: string;
  companyName: string;
  onSuccess?: () => void;
}

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  companyName,
  onSuccess
}) => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<ResumeResponse[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMyResumes();
      // Reset form
      setSelectedResumeId(null);
      setCoverLetter('');
      setError('');
      setUploadError('');
      setUploadedFile(null);
    }
  }, [isOpen]);

  const fetchMyResumes = async () => {
    setLoading(true);
    try {
      const response = await resumeApi.getMyResumes();
      setResumes(response.result);
      
      // Auto-select first resume if available
      if (response.result.length > 0) {
        setSelectedResumeId(response.result[0].resumeId);
      }
    } catch (error: any) {
      console.error('Error fetching resumes:', error);
      setError('Không thể tải danh sách CV. Vui lòng thử lại.');
    }
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = isValidResumeFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'File không hợp lệ');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      // Lưu file để dùng cho AI screening
      setUploadedFile(file);
      
      const response = await resumeApi.uploadResume(file);
      
      // Refresh resumes list
      await fetchMyResumes();
      
      // Auto-select newly uploaded resume
      setSelectedResumeId(response.result.resumeId);
      
      // Clear file input
      event.target.value = '';
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      setUploadError(error.response?.data?.message || 'Không thể tải lên CV. Vui lòng thử lại.');
      setUploadedFile(null);
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedResumeId && !uploadedFile) {
      setError('Vui lòng chọn CV có sẵn hoặc upload CV mới để ứng tuyển');
      return;
    }

    if (!user?.id) {
      setError('Vui lòng đăng nhập để ứng tuyển');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let cvFile: File;
      
      // BƯỚC 1: Lấy file CV
      if (uploadedFile) {
        // User vừa upload file mới
        cvFile = uploadedFile;
      } else if (selectedResumeId) {
        // User chọn CV có sẵn → Download để có AI screening
        console.log('🔄 Downloading selected resume for AI screening:', selectedResumeId);
        const selectedResume = resumes.find(r => r.resumeId === selectedResumeId);
        const fileName = selectedResume?.originalFileName || `resume_${selectedResumeId}.pdf`;
        
        try {
          // Download CV để gửi qua AI screening API - dùng API cũ
          cvFile = await resumeApi.downloadResumeAsFile(selectedResumeId, fileName);
          console.log('✅ Downloaded CV for AI screening:', fileName);
        } catch (error) {
          console.error('❌ Download failed:', error);
          throw new Error('Không thể tải CV để xử lý AI screening. Vui lòng thử lại.');
        }
      } else {
        setError('Vui lòng chọn CV để ứng tuyển');
        return;
      }
      
      console.log('🔍 Applying job for:', {
        jobId,
        userId: user.id,
        fileName: cvFile.name,
        fileSize: cvFile.size,
        fileType: cvFile.type,
        coverLetterLength: coverLetter.length
      });
      
      // Debug authentication
      console.log('🔍 Current user:', user);
      console.log('🔍 User role:', user.role);
      console.log('🔍 Auth token (token):', !!localStorage.getItem('token'));
      console.log('🔍 Auth token (access_token):', !!localStorage.getItem('access_token'));
      
      // Validate jobId
      if (!jobId || jobId <= 0) {
        throw new Error('Invalid jobId: ' + jobId);
      }
      
      // Validate user
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      // Validate file
      if (!cvFile || cvFile.size === 0) {
        throw new Error('Invalid file: ' + cvFile.name);
      }
      
      // BƯỚC 2: Gửi hồ sơ ứng tuyển
      await aiRecommendationApi.applyJobWithScreening(
        cvFile,
        jobId, 
        user.id,
        coverLetter.trim() || undefined
      );
      
      // BƯỚC 3: Thông báo thành công
      onSuccess?.();
      onClose();
      alert('✅ Ứng tuyển thành công! Nhà tuyển dụng sẽ xem xét hồ sơ của bạn.');
      
    } catch (error: any) {
      console.error('Error applying for job:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi ứng tuyển. Vui lòng thử lại.';
      setError(errorMessage);
    }
    
    setIsSubmitting(false);
  };

  const handleDeleteResume = async (resumeId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa CV này?')) return;

    try {
      await resumeApi.deleteResume(resumeId);
      
      // Refresh resumes list
      await fetchMyResumes();
      
      // Clear selection if deleted resume was selected
      if (selectedResumeId === resumeId) {
        setSelectedResumeId(null);
        setUploadedFile(null);
      }
    } catch (error: any) {
      console.error('Error deleting resume:', error);
      alert('Không thể xóa CV. Vui lòng thử lại.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Ứng tuyển việc làm</h2>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">{jobTitle}</span> tại <span className="font-medium">{companyName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* CV Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Chọn CV để ứng tuyển *
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="resume-upload"
                  className={`flex items-center space-x-2 px-3 py-2 border border-emerald-300 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isUploading 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <ArrowUpTrayIcon className="h-4 w-4" />
                  <span>{isUploading ? 'Đang tải lên...' : 'Tải CV mới'}</span>
                </label>
              </div>
            </div>

            {uploadError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{uploadError}</p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <p className="text-sm text-gray-600 mt-2">Đang tải danh sách CV...</p>
              </div>
            ) : (
                                            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                 <div className="flex items-start space-x-2">
                   <svg className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                   </svg>
                   <div>
                     <p className="text-sm font-medium text-blue-900">Hướng dẫn ứng tuyển</p>
                     <p className="text-xs text-blue-700 mt-1">
                       Bạn có thể chọn CV có sẵn hoặc upload CV mới từ máy tính. Nhà tuyển dụng sẽ xem xét hồ sơ của bạn và phản hồi trong thời gian sớm nhất.
                     </p>
                   </div>
                 </div>
               </div>
             )}
             
             {/* Show uploaded file nếu có */}
             {uploadedFile && (
               <div className="mb-4 border border-emerald-500 bg-emerald-50 rounded-lg p-4">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                     <span className="text-2xl">📄</span>
                     <div>
                       <p className="font-medium text-gray-900 text-sm">
                         {uploadedFile.name}
                         <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                           File mới - Sẵn sàng ứng tuyển
                         </span>
                       </p>
                       <p className="text-xs text-gray-500">File CV vừa được upload</p>
                     </div>
                   </div>
                 </div>
               </div>
             )}
             
             {resumes.length === 0 ? (
               <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                 <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                 <p className="text-sm text-gray-600 mb-2">Bạn chưa có CV nào</p>
                 <p className="text-xs text-gray-500">Tải lên CV đầu tiên để bắt đầu ứng tuyển</p>
               </div>
             ) : (
              <div className="space-y-3">
                {resumes.map((resume) => (
                  <div
                    key={resume.resumeId}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedResumeId === resume.resumeId
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                    onClick={() => {
                      setSelectedResumeId(resume.resumeId);
                      // Clear uploaded file khi chọn CV có sẵn
                      if (uploadedFile) {
                        setUploadedFile(null);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getFileIcon(resume.originalFileName)}</span>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {resume.originalFileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Tải lên: {new Date(resume.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {selectedResumeId === resume.resumeId && (
                          <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResume(resume.resumeId);
                          }}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thư xin việc (tùy chọn)
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              placeholder="Giới thiệu bản thân và lý do bạn phù hợp với vị trí này..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Thư xin việc giúp nhà tuyển dụng hiểu rõ hơn về bạn và động cơ ứng tuyển
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={(!selectedResumeId && !uploadedFile) || isSubmitting}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Đang xử lý ứng tuyển...' : 'Ứng tuyển ngay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyJobModal; 