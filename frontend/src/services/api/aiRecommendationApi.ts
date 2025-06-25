import apiClient from './config';
import { ApiResponse } from './authApi';

// Types dựa trên backend DTOs
export interface CVScreeningResponse {
  candidateDecision: string; // PASS, FAIL, REVIEW
  overallScore: number; // 0-5
  matchingPoints: string[];
  notMatchingPoints: string[];
  recommendation: string;
  message: string;
  candidateName?: string;
  candidateEmail?: string;
  cvFileName?: string;
  scoreLevel?: string; // EXCELLENT, GOOD, AVERAGE, POOR
  quickSummary?: string;
}

// Interface match với JobRecommendationResponse từ backend
export interface CVSummary {
  basicInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    currentPosition: string;
  };
  experience: {
    totalYears: number;
    positionsCount: number;
    latestPosition: any;
  };
  skills: {
    technicalSkills: string[];
    softSkills: string[];
    languages: string[];
    totalTechnical: number;
  };
  education: {
    highestLevel: string;
    educationLevel: string;
  };
  workExperienceCount: number;
  projectsCount: number;
}

export interface JobRecommendationItem {
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  matchScore: number;
  jobType: string;
  requiredSkills: string[];
  minExperience: number;
  jobDescription: string;
  matchingSkills: string[];
  missingSkills: string[];
  matchExplanation: string;
  additionalInfo: { [key: string]: any };
}

export interface JobRecommendationResponse {
  success: boolean;
  message: string;
  cvSummary: CVSummary;
  recommendations: JobRecommendationItem[];
  totalJobsAnalyzed: number;
  processingTimeMs: number;
}

export interface CVAnalysisRequest {
  file: File;
  top_k?: number;
  min_score?: number;
  location?: string;
  job_type?: string;
}

// AI Recommendation API service
export const aiRecommendationApi = {
  // POST /api/v1/ai/apply-job - Apply job với AI screening
  applyJobWithScreening: async (
    cvFile: File, 
    jobId: number, 
    userId?: string,
    notes?: string
  ): Promise<ApiResponse<CVScreeningResponse>> => {
    console.log('🔍 applyJobWithScreening called with:', {
      fileName: cvFile.name,
      fileSize: cvFile.size,
      jobId,
      userId,
      notes
    });
    
    const formData = new FormData();
    formData.append('cv_file', cvFile);
    formData.append('jobId', jobId.toString());
    
    // Ensure userId is provided và not empty
    if (userId && userId.trim()) {
      formData.append('userId', userId.trim());
    } else {
      console.warn('⚠️ userId not provided, backend will use default');
    }
    
    if (notes && notes.trim()) {
      formData.append('notes', notes.trim());
    }
    
    // Debug FormData content
    console.log('🔍 FormData entries:');
    formData.forEach((value, key) => {
      console.log(`  ${key}:`, value);
    });
    
    const response = await apiClient.post('/ai/apply-job', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Phân tích CV và gợi ý công việc
  analyzeCV: async (request: CVAnalysisRequest): Promise<JobRecommendationResponse> => {
    const formData = new FormData();
    formData.append('file', request.file);
    
    if (request.top_k) formData.append('top_k', request.top_k.toString());
    if (request.min_score) formData.append('min_score', request.min_score.toString());
    if (request.location) formData.append('location', request.location);
    if (request.job_type) formData.append('job_type', request.job_type);

    const response = await apiClient.post('/ai/recommend-jobs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Kiểm tra trạng thái của Python AI service
  checkHealthStatus: async (): Promise<{ healthy: boolean; message: string }> => {
    try {
      const response = await apiClient.get('/ai/health');
      return {
        healthy: true,
        message: response.data
      };
    } catch (error) {
      return {
        healthy: false,
        message: 'AI service không khả dụng'
      };
    }
  },

  // Sync jobs to Python service (cho admin/employer)
  syncJobsToPython: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post('/ai/sync-jobs');
      return {
        success: true,
        message: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể sync jobs'
      };
    }
  },

  // Clear Python jobs (cho admin)
  clearPythonJobs: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.delete('/ai/clear-jobs');
      return {
        success: true,
        message: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể clear jobs'
      };
    }
  },

  // Debug: Kiểm tra số lượng jobs trong database
  getJobsCount: async (): Promise<{ count: number; message: string }> => {
    try {
      const response = await apiClient.get('/ai/debug/jobs-count');
      // Parse count from message "Found X active jobs in PostgreSQL"
      const match = response.data.match(/Found (\d+) active jobs/);
      const count = match ? parseInt(match[1]) : 0;
      
      return {
        count,
        message: response.data
      };
    } catch (error: any) {
      return {
        count: 0,
        message: error.response?.data?.message || 'Không thể lấy thông tin jobs'
      };
    }
  }
};

// Helper functions
export const getScoreColor = (score: number): string => {
  if (score >= 4) return 'text-green-600';
  if (score >= 3) return 'text-yellow-600';
  if (score >= 2) return 'text-orange-600';
  return 'text-red-600';
};

export const getDecisionColor = (decision: string): string => {
  switch (decision?.toUpperCase()) {
    case 'PASS':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'FAIL':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'REVIEW':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getScoreLevelText = (level: string): string => {
  switch (level?.toUpperCase()) {
    case 'EXCELLENT':
      return 'Xuất sắc';
    case 'GOOD':
      return 'Tốt';
    case 'AVERAGE':
      return 'Trung bình';
    case 'POOR':
      return 'Yếu';
    default:
      return 'Chưa đánh giá';
  }
}; 