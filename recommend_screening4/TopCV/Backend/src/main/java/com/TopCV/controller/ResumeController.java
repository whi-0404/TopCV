package com.TopCV.controller;

import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.FileUploadResponse;
import com.TopCV.dto.response.ResumeResponse;
import com.TopCV.enums.FileType;
import com.TopCV.service.ResumeService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/v1/resumes")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
public class ResumeController {
    ResumeService resumeService;

    @PostMapping("/upload")
    public ApiResponse<FileUploadResponse> uploadResume(@RequestParam("file") MultipartFile file) {

        FileUploadResponse response = resumeService.uploadResume(file);

        return ApiResponse.<FileUploadResponse>builder()
                .result(response)
                .build();
    }

    @DeleteMapping("/{resumeId}")
    public ApiResponse<String> deleteResume(@PathVariable Integer resumeId) {

        resumeService.deleteResume(resumeId);

        return ApiResponse.<String>builder()
                .result("Resume has been deleted successfully")
                .build();
    }

    @GetMapping("/my")
    public ApiResponse<List<ResumeResponse>> getMyResumes() {
        List<ResumeResponse> resumes = resumeService.getMyResumes();

        return ApiResponse.<List<ResumeResponse>>builder()
                .result(resumes)
                .build();
    }

    @GetMapping("/download/{resumeId}")
    public ResponseEntity<byte[]> downloadResume(@PathVariable Integer resumeId) {

        // Get resume info first
        ResumeResponse resumeInfo = resumeService.getResumeById(resumeId);

        // Download file data
        byte[] fileData = resumeService.downloadResume(resumeId);

        // Determine filename and content type
        String filename = buildDownloadFilename(resumeInfo);
        String contentType = determineContentType(resumeInfo.getOriginalFileName());


        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + encodeFilename(filename) + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .contentLength(fileData.length)
                .body(fileData);
    }

    @GetMapping("/{resumeId}")
    public ApiResponse<ResumeResponse> getResumeById(@PathVariable Integer resumeId) {
        ResumeResponse resume = resumeService.getResumeById(resumeId);

        return ApiResponse.<ResumeResponse>builder()
                .result(resume)
                .build();
    }

    /**
     * Build appropriate filename for download
     */
    private String buildDownloadFilename(ResumeResponse resumeInfo) {
        String originalFilename = resumeInfo.getOriginalFileName();

        if (originalFilename != null && !originalFilename.trim().isEmpty()) {
            // Use original filename if available
            return sanitizeFilename(originalFilename);
        }

        // Fallback: create filename from file path
        if (resumeInfo.getFilePath() != null && resumeInfo.getFilePath().contains(".")) {
            String extension = resumeInfo.getFilePath().substring(
                    resumeInfo.getFilePath().lastIndexOf("."));
            return "resume_" + resumeInfo.getResumeId() + extension;
        }

        // Default fallback
        return "resume_" + resumeInfo.getResumeId() + ".pdf";
    }

    /**
     * Determine content type based on file extension
     */
    private String determineContentType(String filename) {
        if (filename == null || !filename.contains(".")) {
            return MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
        return FileType.RESUME.getContentType(extension);
    }

    /**
     * Sanitize filename for safe download
     */
    private String sanitizeFilename(String filename) {
        if (filename == null) {
            return "resume.pdf";
        }

        // Remove potentially dangerous characters but keep basic ones
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    /**
     * Encode filename for Content-Disposition header to handle Unicode characters
     */
    private String encodeFilename(String filename) {
        try {
            return URLEncoder.encode(filename, StandardCharsets.UTF_8.toString())
                    .replaceAll("\\+", "%20");
        } catch (Exception e) {
            return sanitizeFilename(filename);
        }
    }
}
