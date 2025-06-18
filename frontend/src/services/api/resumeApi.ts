import apiClient from './config';
import { ApiResponse } from './authApi';

// Types dựa trên backend DTOs
export interface ResumeResponse {
  resumeId: number;
  userId: string;
  filePath: string;
  originalFileName: string;
  createdAt: string; // LocalDateTime format
  updatedAt: string; // LocalDateTime format
  downloadUrl?: string;
}

export interface FileUploadResponse {
  resumeId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedAt: string;
  message: string;
}

// Resume API service
export const resumeApi = {
  // POST /api/v1/resumes/upload
  uploadResume: async (file: File): Promise<ApiResponse<FileUploadResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // DELETE /api/v1/resumes/{resumeId}
  deleteResume: async (resumeId: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete(`/resumes/${resumeId}`);
    return response.data;
  },

  // GET /api/v1/resumes/my
  getMyResumes: async (): Promise<ApiResponse<ResumeResponse[]>> => {
    const response = await apiClient.get('/resumes/my');
    return response.data;
  },

  // GET /api/v1/resumes/{resumeId}
  getResumeById: async (resumeId: number): Promise<ApiResponse<ResumeResponse>> => {
    const response = await apiClient.get(`/resumes/${resumeId}`);
    return response.data;
  },

  // GET /api/v1/resumes/download/{resumeId}
  downloadResume: async (resumeId: number): Promise<Blob> => {
    console.log('🔍 downloadResume called with resumeId:', resumeId);
    console.log('🔍 Auth token (token):', localStorage.getItem('token'));
    console.log('🔍 Auth token (access_token):', localStorage.getItem('access_token'));
    
    try {
      const response = await apiClient.get(`/resumes/download/${resumeId}`, {
        responseType: 'blob'
      });
      console.log('🔍 downloadResume success:', response.status);
      return response.data;
    } catch (error) {
      console.error('❌ downloadResume error:', error);
      throw error;
    }
  },

  // Helper method để convert blob thành File cho AI screening
  downloadResumeAsFile: async (resumeId: number, fileName?: string): Promise<File> => {
    console.log('🔍 Downloading resume as file:', { resumeId, fileName });
    
    try {
      const blob = await resumeApi.downloadResume(resumeId);
      console.log('🔍 Downloaded blob:', { 
        size: blob.size, 
        type: blob.type 
      });
      
      const finalFileName = fileName || `resume_${resumeId}.pdf`;
      
      const file = new File([blob], finalFileName, {
        type: blob.type || 'application/pdf',
        lastModified: Date.now(),
      });
      
      console.log('🔍 Created file:', { 
        name: file.name, 
        size: file.size, 
        type: file.type 
      });
      
      return file;
    } catch (error: any) {
      console.error('❌ Error downloading resume as file:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
  },

  // Helper method to trigger download
  downloadResumeFile: async (resumeId: number, filename?: string): Promise<void> => {
    try {
      const blob = await resumeApi.downloadResume(resumeId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `resume_${resumeId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resume:', error);
      throw error;
    }
  },

  // Tải xuống resume của user cho AI screening
  downloadResumeForAIScreening: async (resumeId: number): Promise<File> => {
    try {
      console.log(`🤖 Downloading resume ${resumeId} for AI screening...`);
      
      const response = await apiClient.get(`/resumes/download-for-ai/${resumeId}`, {
        responseType: 'arraybuffer',
        headers: {
          'Accept': 'application/octet-stream'
        }
      });

      console.log('🤖 Response headers:', response.headers);
      
      // Lấy filename từ header
      const filename = response.headers['x-filename'] || `resume_${resumeId}.pdf`;
      const contentType = response.headers['x-content-type'] || 'application/pdf';
      
      console.log(`🤖 Creating file: ${filename}, type: ${contentType}, size: ${response.data.byteLength}`);
      
      // Tạo File object từ response data
      const file = new File([response.data], filename, { type: contentType });
      
      console.log('✅ File created for AI screening:', file.name, file.size, 'bytes');
      return file;
      
    } catch (error: any) {
      console.error('❌ Error downloading resume for AI screening:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      throw new Error('Không thể tải xuống CV để xử lý AI screening');
    }
  },
};

// Helper functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const isValidResumeFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Chỉ chấp nhận file PDF, DOC, DOCX'
    };
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File không được vượt quá 5MB'
    };
  }
  
  return { valid: true };
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const getFileIcon = (filename: string): string => {
  const ext = getFileExtension(filename);
  
  switch (ext) {
    case 'pdf':
      return '📄';
    case 'doc':
    case 'docx':
      return '📝';
    default:
      return '📄';
  }
}; 