import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  SparklesIcon,
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  StarIcon,
  EyeIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  UserIcon,
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { aiRecommendationApi, JobRecommendationItem, JobRecommendationResponse, CVSummary } from '../services/api/aiRecommendationApi';

interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  matchScore: number;
  description: string;
  requiredSkills: string[];
  matchingSkills: string[];
  missingSkills: string[];
  matchExplanation: string;
  minExperience: number;
}

const JobRecommendationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [cvSummary, setCvSummary] = useState<CVSummary | null>(null);
  const [error, setError] = useState('');
  const [aiHealthy, setAiHealthy] = useState(true);
  const [processingTime, setProcessingTime] = useState<number>(0);
  const [totalJobsAnalyzed, setTotalJobsAnalyzed] = useState<number>(0);
  const [restoredFromSession, setRestoredFromSession] = useState(false);

  // Session storage keys
  const SESSION_KEYS = {
    analysisComplete: 'ai_analysis_complete',
    recommendations: 'ai_recommendations',
    cvSummary: 'ai_cv_summary',
    processingTime: 'ai_processing_time',
    totalJobsAnalyzed: 'ai_total_jobs_analyzed',
    fileName: 'ai_file_name'
  };

  // Kiểm tra AI service health khi component mount
  useEffect(() => {
    checkAIHealth();
    restoreAnalysisFromSession();
  }, []);

  // Lưu kết quả phân tích vào sessionStorage
  const saveAnalysisToSession = (
    recommendations: JobRecommendation[],
    cvSummary: CVSummary,
    processingTime: number,
    totalJobsAnalyzed: number,
    fileName?: string
  ) => {
    try {
      sessionStorage.setItem(SESSION_KEYS.analysisComplete, 'true');
      sessionStorage.setItem(SESSION_KEYS.recommendations, JSON.stringify(recommendations));
      sessionStorage.setItem(SESSION_KEYS.cvSummary, JSON.stringify(cvSummary));
      sessionStorage.setItem(SESSION_KEYS.processingTime, processingTime.toString());
      sessionStorage.setItem(SESSION_KEYS.totalJobsAnalyzed, totalJobsAnalyzed.toString());
      if (fileName) {
        sessionStorage.setItem(SESSION_KEYS.fileName, fileName);
      }
      console.log('✅ Analysis results saved to session storage');
    } catch (error) {
      console.error('❌ Failed to save analysis to session storage:', error);
    }
  };

  // Khôi phục kết quả phân tích từ sessionStorage
  const restoreAnalysisFromSession = () => {
    try {
      const isComplete = sessionStorage.getItem(SESSION_KEYS.analysisComplete) === 'true';
      
      if (isComplete) {
        const savedRecommendations = sessionStorage.getItem(SESSION_KEYS.recommendations);
        const savedCvSummary = sessionStorage.getItem(SESSION_KEYS.cvSummary);
        const savedProcessingTime = sessionStorage.getItem(SESSION_KEYS.processingTime);
        const savedTotalJobs = sessionStorage.getItem(SESSION_KEYS.totalJobsAnalyzed);
        const savedFileName = sessionStorage.getItem(SESSION_KEYS.fileName);

        if (savedRecommendations && savedCvSummary) {
          setRecommendations(JSON.parse(savedRecommendations));
          setCvSummary(JSON.parse(savedCvSummary));
          setProcessingTime(parseFloat(savedProcessingTime || '0'));
          setTotalJobsAnalyzed(parseInt(savedTotalJobs || '0'));
          setAnalysisComplete(true);
          setRestoredFromSession(true);
          
          // Tạo mock file object để hiển thị
          if (savedFileName) {
            const mockFile = new File([''], savedFileName, { type: 'application/pdf' });
            setSelectedFile(mockFile);
          }

          console.log('✅ Analysis results restored from session storage');
        }
      }
    } catch (error) {
      console.error('❌ Failed to restore analysis from session storage:', error);
      clearAnalysisSession();
    }
  };

  // Xóa kết quả phân tích khỏi sessionStorage
  const clearAnalysisSession = () => {
    try {
      Object.values(SESSION_KEYS).forEach(key => {
        sessionStorage.removeItem(key);
      });
      console.log('✅ Analysis session cleared');
    } catch (error) {
      console.error('❌ Failed to clear analysis session:', error);
    }
  };

  const checkAIHealth = async () => {
    try {
      const health = await aiRecommendationApi.checkHealthStatus();
      setAiHealthy(health.healthy);
      if (!health.healthy) {
        setError('AI service hiện không khả dụng. Một số tính năng có thể bị hạn chế.');
      }
    } catch (error) {
      setAiHealthy(false);
      setError('Không thể kết nối tới AI service.');
    }
  };

  // Redirect if not logged in as USER
  useEffect(() => {
    if (!user || user.role !== 'USER') {
      navigate('/auth/user/login');
    }
  }, [user, navigate]);

  // Transform backend data to frontend format
  const transformRecommendations = (items: JobRecommendationItem[]): JobRecommendation[] => {
    return items.map(item => ({
      id: item.jobId,
      title: item.jobTitle,
      company: item.company,
      location: item.location,
      salary: item.additionalInfo?.salary || 'Thỏa thuận',
      type: item.jobType || 'Full-time',
      matchScore: Math.round(item.matchScore * 100), // Convert to percentage if needed
      description: item.jobDescription,
      requiredSkills: item.requiredSkills || [],
      matchingSkills: item.matchingSkills || [],
      missingSkills: item.missingSkills || [],
      matchExplanation: item.matchExplanation || '',
      minExperience: item.minExperience || 0
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 
                         'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      setError('Chỉ hỗ trợ file PDF, DOC, DOCX, JPG, PNG');
      return;
    }

    if (file.size > maxSize) {
      setError('Kích thước file không được vượt quá 10MB');
      return;
    }

    setError('');
    setSelectedFile(file);
    setAnalysisComplete(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError('');
    setAnalysisComplete(false);
    setRecommendations([]);
    setCvSummary(null);
    setProcessingTime(0);
    setTotalJobsAnalyzed(0);
    setRestoredFromSession(false);
    // Clear session storage when user explicitly removes file
    clearAnalysisSession();
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setError('');
    setAnalysisComplete(false);
    setRecommendations([]);
    setCvSummary(null);
    setProcessingTime(0);
    setTotalJobsAnalyzed(0);
    setRestoredFromSession(false);
    clearAnalysisSession();
  };

  const analyzeCV = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError('');
    setRestoredFromSession(false);

    try {
      console.log('🚀 Starting CV analysis...', {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type
      });

      // Call real API
      const response: JobRecommendationResponse = await aiRecommendationApi.analyzeCV({
        file: selectedFile,
        top_k: 5,
        min_score: 0.3
      });
      
      console.log('✅ CV Analysis response:', response);
      
      // Check if response is successful
      if (!response.success) {
        throw new Error(response.message || 'Phân tích CV không thành công');
      }
      
      // Transform and set data
      const transformedRecommendations = transformRecommendations(response.recommendations || []);
      setRecommendations(transformedRecommendations);
      setCvSummary(response.cvSummary);
      setProcessingTime(response.processingTimeMs || 0);
      setTotalJobsAnalyzed(response.totalJobsAnalyzed || 0);
      setAnalysisComplete(true);
      
      console.log('✅ CV Analysis successful:', {
        recommendations: transformedRecommendations.length,
        cvSummary: response.cvSummary,
        processingTime: response.processingTimeMs,
        totalJobsAnalyzed: response.totalJobsAnalyzed
      });

      // Save analysis results to session storage
      saveAnalysisToSession(transformedRecommendations, response.cvSummary, response.processingTimeMs || 0, response.totalJobsAnalyzed || 0, selectedFile?.name);
    } catch (error: any) {
      console.error('❌ CV Analysis failed:', error);
      
      // Handle specific error cases
      if (error.response?.status === 503) {
        setError('AI service hiện không khả dụng. Vui lòng thử lại sau.');
      } else if (error.response?.status === 400) {
        setError('File CV không hợp lệ hoặc không thể phân tích. Vui lòng kiểm tra định dạng file.');
      } else if (error.response?.status === 404) {
        setError('Không tìm thấy endpoint AI. Vui lòng kiểm tra cấu hình backend.');
      } else {
        setError(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi phân tích CV. Vui lòng thử lại.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return '📄';
    if (file.type.includes('image')) return '🖼️';
    if (file.type.includes('word')) return '📝';
    return '📁';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <SparklesIcon className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">
                AI Gợi Ý Công Việc
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload CV của bạn và để AI phân tích để gợi ý những công việc phù hợp nhất
            </p>
            
            {/* AI Health Status */}
            {!aiHealthy && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 max-w-md mx-auto">
                ⚠️ AI service hiện không khả dụng. Một số tính năng có thể bị hạn chế.
              </div>
            )}
          </div>

          {/* CV Summary Section (hiển thị sau khi phân tích) */}
          {analysisComplete && cvSummary && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <DocumentTextIcon className="h-6 w-6 text-green-600 mr-2" />
                  Tóm tắt CV của bạn
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Xử lý trong {(processingTime / 1000).toFixed(1)}s • Phân tích {totalJobsAnalyzed} việc làm
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Basic Info */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <UserIcon className="h-4 w-4 mr-1" />
                    Thông tin cơ bản
                  </h3>
                  <div className="space-y-2 text-sm">
                    {cvSummary.basicInfo?.name && (
                      <p><span className="font-medium">Tên:</span> {cvSummary.basicInfo.name}</p>
                    )}
                    {cvSummary.basicInfo?.currentPosition && (
                      <p><span className="font-medium">Vị trí hiện tại:</span> {cvSummary.basicInfo.currentPosition}</p>
                    )}
                    {cvSummary.experience?.totalYears !== undefined && (
                      <p><span className="font-medium">Kinh nghiệm:</span> {cvSummary.experience.totalYears} năm</p>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <AcademicCapIcon className="h-4 w-4 mr-1" />
                    Kỹ năng kỹ thuật ({cvSummary.skills?.totalTechnical || 0})
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {cvSummary.skills?.technicalSkills?.slice(0, 8).map((skill: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                    {(cvSummary.skills?.technicalSkills?.length || 0) > 8 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{(cvSummary.skills?.technicalSkills?.length || 0) - 8} khác
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Education & Experience */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Học vấn</h3>
                    <p className="text-sm text-gray-600">{cvSummary.education?.educationLevel || 'Chưa xác định'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Kinh nghiệm</h3>
                    <p className="text-sm text-gray-600">
                      {cvSummary.experience?.positionsCount || 0} vị trí • {cvSummary.workExperienceCount || 0} công việc
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Section */}
          {!analysisComplete && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <CloudArrowUpIcon className="h-6 w-6 text-blue-600 mr-2" />
                Upload CV của bạn
              </h2>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver 
                    ? 'border-blue-400 bg-blue-50' 
                    : selectedFile 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center bg-white rounded-lg p-4 shadow-sm border">
                        <span className="text-2xl mr-3">{getFileIcon(selectedFile)}</span>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={removeFile}
                          className="ml-4 p-1 text-gray-400 hover:text-red-500"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={analyzeCV}
                      disabled={isAnalyzing || !aiHealthy}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                          Đang phân tích CV...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="h-4 w-4 mr-2" />
                          Phân tích CV với AI
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Thả file CV vào đây hoặc click để chọn
                      </p>
                      <p className="text-sm text-gray-500">
                        Hỗ trợ PDF, DOC, DOCX, JPG, PNG (tối đa 10MB)
                      </p>
                    </div>
                    
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                      id="cv-upload"
                    />
                    <label
                      htmlFor="cv-upload"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Chọn file CV
                    </label>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Instructions */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Lưu ý khi upload CV:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-600">
                      <li>CV nên có thông tin đầy đủ về kinh nghiệm, kỹ năng</li>
                      <li>Định dạng rõ ràng, dễ đọc để AI phân tích chính xác</li>
                      <li>Thông tin liên hệ và mong muốn về công việc</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {analysisComplete && (
            <div className="space-y-6">
              {/* Results Header */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Phân tích hoàn thành!
                      </h2>
                      <p className="text-gray-600">
                        Tìm thấy {recommendations.length} công việc phù hợp với CV của bạn
                      </p>
                      {restoredFromSession && (
                        <p className="text-sm text-blue-600 mt-1 flex items-center">
                          <InformationCircleIcon className="h-4 w-4 mr-1" />
                          Kết quả được khôi phục từ phiên trước đó
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      resetAnalysis();
                    }}
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    Phân tích CV khác
                  </button>
                </div>
              </div>

              {/* Job Recommendations */}
              <div className="grid gap-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <BriefcaseIcon className="h-6 w-6 text-purple-600 mr-2" />
                  Công việc được gợi ý
                </h3>

                {recommendations.length > 0 ? recommendations.map((job, index) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {job.company.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-900 mb-1">
                            {job.title}
                          </h4>
                          <div className="flex items-center text-gray-600 mb-2">
                            <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                            <span className="font-medium">{job.company}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                              {job.salary}
                            </div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {job.type}
                            </span>
                            {job.minExperience > 0 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                {job.minExperience}+ năm KN
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-2 rounded-lg text-center border ${getScoreColor(job.matchScore)}`}>
                        <div className="font-bold text-lg">{job.matchScore}%</div>
                        <div className="text-xs">Phù hợp</div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Match Explanation */}
                    {job.matchExplanation && (
                      <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <p className="text-sm text-purple-700">
                          <strong>Lý do AI gợi ý:</strong> {job.matchExplanation}
                        </p>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      {/* Kỹ năng phù hợp */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Kỹ năng phù hợp ({job.matchingSkills.length}):</h5>
                        <div className="flex flex-wrap gap-1">
                          {job.matchingSkills.slice(0, 5).map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              ✓ {skill}
                            </span>
                          ))}
                          {job.matchingSkills.length > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              +{job.matchingSkills.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Kỹ năng cần bổ sung */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Cần bổ sung ({job.missingSkills.length}):</h5>
                        <div className="flex flex-wrap gap-1">
                          {job.missingSkills.slice(0, 5).map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                              ! {skill}
                            </span>
                          ))}
                          {job.missingSkills.length > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              +{job.missingSkills.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(job.matchScore / 20) ? 'fill-current' : ''
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          Độ phù hợp {job.matchScore >= 80 ? 'rất cao' : job.matchScore >= 60 ? 'cao' : 'trung bình'}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => {
                          // Convert jobId to number for routing
                          const jobIdNumber = parseInt(job.id);
                          if (!isNaN(jobIdNumber)) {
                            navigate(`/jobs/${jobIdNumber}`);
                          } else {
                            console.error('Invalid jobId:', job.id);
                            setError('ID công việc không hợp lệ');
                          }
                        }}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        Xem chi tiết việc làm
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Không tìm thấy công việc phù hợp
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Hệ thống đã phân tích {totalJobsAnalyzed} việc làm nhưng không tìm thấy công việc phù hợp với CV của bạn.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Hãy thử upload CV khác, cải thiện thông tin trong CV hoặc thay đổi tiêu chí tìm kiếm.
                    </p>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => {
                          resetAnalysis();
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Thử lại với CV khác
                      </button>
                      <Link
                        to="/jobs"
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Xem tất cả việc làm
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Muốn tìm thêm cơ hội khác?
                </h3>
                <p className="text-gray-600 mb-4">
                  Khám phá thêm các việc làm hoặc thử phân tích với CV được cập nhật
                </p>
                <div className="flex justify-center space-x-4">
                  <Link
                    to="/jobs"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Xem tất cả việc làm
                  </Link>
                  <button
                    onClick={() => {
                      resetAnalysis();
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Upload CV khác
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default JobRecommendationPage; 