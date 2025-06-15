package com.TopCV.service;

import com.TopCV.dto.response.FileUploadResponse;
import com.TopCV.dto.response.ResumeResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ResumeService {
    FileUploadResponse uploadResume(MultipartFile file);
    byte[] downloadResume(Integer resumeId);
    void deleteResume(Integer resumeId);
    List<ResumeResponse> getMyResumes();
//    ResumeResponse updateResume(Integer resumeId, String userEmail);
    ResumeResponse getResumeById(Integer resumeId);
}
