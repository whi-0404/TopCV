package com.TopCV.service;

import com.TopCV.dto.request.ResumeRequest;
import com.TopCV.dto.response.FileUploadResponse;
import com.TopCV.dto.response.ResumeResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ResumeService {
    FileUploadResponse uploadResume(MultipartFile file, ResumeRequest request, String userEmail);
    byte[] downloadResume(Integer resumeId, String userEmail);
    void deleteResume(Integer resumeId, String userEmail);
    List<ResumeResponse> getMyResumes(String userEmail);
    ResumeResponse updateResume(Integer resumeId, ResumeRequest request, String userEmail);
    ResumeResponse getResumeById(Integer resumeId, String userEmail);
}
