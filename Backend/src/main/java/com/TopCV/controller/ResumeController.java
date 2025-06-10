package com.TopCV.controller;

import com.TopCV.dto.request.ResumeRequest;
import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.FileUploadResponse;
import com.TopCV.dto.response.ResumeResponse;
import com.TopCV.service.ResumeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/resumes")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
public class ResumeController {
    ResumeService resumeService;

    @PostMapping("/upload")
    public ApiResponse<FileUploadResponse> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("resumeName") String resumeName,
            Authentication authentication) {
        ResumeRequest request = new ResumeRequest();
        request.setResumeName(resumeName);
        return ApiResponse.<FileUploadResponse>builder()
                .result(resumeService.uploadResume(file, request, authentication.getName()))
                .build();
    }

    @GetMapping("/download/{resumeId}")
    public ResponseEntity<byte[]> downloadResume(
            @PathVariable Integer resumeId,
            Authentication authentication) {
        byte[] fileData = resumeService.downloadResume(resumeId, authentication.getName());
        
        // Lấy thông tin resume để determine correct filename
        ResumeResponse resumeInfo = resumeService.getResumeById(resumeId, authentication.getName());
        String filename = "resume_" + resumeId + ".pdf"; // Default filename
        
        // Lấy extension từ filePath và sử dụng resumeName
        if (resumeInfo.getFilePath() != null && resumeInfo.getFilePath().contains(".")) {
            String extension = resumeInfo.getFilePath().substring(resumeInfo.getFilePath().lastIndexOf("."));
            // Sử dụng resumeName để tạo filename
            String baseName = (resumeInfo.getResumeName() != null && !resumeInfo.getResumeName().trim().isEmpty()) 
                    ? resumeInfo.getResumeName().replaceAll("[^a-zA-Z0-9_-]", "_")
                    : "resume_" + resumeId;
            filename = baseName + extension;
        }
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileData);
    }

    @DeleteMapping("/{resumeId}")
    public ApiResponse<String> deleteResume(
            @PathVariable Integer resumeId,
            Authentication authentication) {
        resumeService.deleteResume(resumeId, authentication.getName());
        return ApiResponse.<String>builder()
                .result("Resume has been deleted successfully")
                .build();
    }

    @GetMapping("/my")
    public ApiResponse<List<ResumeResponse>> getMyResumes(Authentication authentication) {
        return ApiResponse.<List<ResumeResponse>>builder()
                .result(resumeService.getMyResumes(authentication.getName()))
                .build();
    }

    @PutMapping("/{resumeId}")
    public ApiResponse<ResumeResponse> updateResume(
            @PathVariable Integer resumeId,
            @Valid @RequestBody ResumeRequest request,
            Authentication authentication) {
        ResumeResponse response = resumeService.updateResume(resumeId, request, authentication.getName());
        return ApiResponse.<ResumeResponse>builder()
                .result(response)
                .build();
    }
}
