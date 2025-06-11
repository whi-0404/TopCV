package com.TopCV.service;

import com.TopCV.dto.external.ScreeningResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ScreeningService {
    
    /**
     * Chấm điểm CV của ứng viên cho job cụ thể (dành cho HR)
     * @param cvFile CV file của ứng viên
     * @param jobId ID của job cần screening
     * @return Kết quả screening với điểm số và recommendation
     */
    ScreeningResponse screenCvForJob(MultipartFile cvFile, Integer jobId);
    
    /**
     * Check health của screening service
     * @return true nếu service hoạt động tốt
     */
    Boolean isScreeningServiceHealthy();
} 