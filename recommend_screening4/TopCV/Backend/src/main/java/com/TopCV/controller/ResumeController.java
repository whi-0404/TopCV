package com.TopCV.controller;

import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.FileUploadResponse;
import com.TopCV.dto.response.ResumeResponse;
import com.TopCV.entity.Application;
import com.TopCV.entity.Resume;
import com.TopCV.entity.User;
import com.TopCV.enums.FileType;
import com.TopCV.repository.ApplicationRepository;
import com.TopCV.repository.ResumeRepository;
import com.TopCV.repository.UserRepository;
import com.TopCV.service.ResumeService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/resumes")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
@Slf4j
public class ResumeController {
    ResumeService resumeService;
    ApplicationRepository applicationRepository;
    ResumeRepository resumeRepository;
    UserRepository userRepository;

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
    
    /**
     * User download their own resume for AI screening
     * Endpoint: GET /api/v1/resumes/download-for-ai/{resumeId}
     */
    @GetMapping("/download-for-ai/{resumeId}")
    public ResponseEntity<byte[]> downloadResumeForAI(@PathVariable Integer resumeId) {
        
        log.info("🤖 User downloading resume {} for AI screening", resumeId);
        
        try {
            // Get resume info first  
            ResumeResponse resumeInfo = resumeService.getResumeById(resumeId);
            log.info("🤖 Found resume: {}", resumeInfo.getOriginalFileName());

            // Download file data using AI screening method
            byte[] fileData = resumeService.downloadResumeForAIScreening(resumeId);
            log.info("🤖 File data size: {} bytes", fileData.length);

            // Return file data với headers
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header("X-Filename", resumeInfo.getOriginalFileName())
                    .header("X-Content-Type", determineContentType(resumeInfo.getOriginalFileName()))
                    .body(fileData);
                    
        } catch (Exception e) {
            log.error("❌ ERROR in downloadResumeForAI: {}", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{resumeId}")
    public ApiResponse<ResumeResponse> getResumeById(@PathVariable Integer resumeId) {
        ResumeResponse resume = resumeService.getResumeById(resumeId);

        return ApiResponse.<ResumeResponse>builder()
                .result(resume)
                .build();
    }

    /**
     * Employer download candidate CV through application ID
     * Endpoint: GET /api/v1/resumes/download-candidate/{applicationId}
     */
    @GetMapping("/download-candidate/{applicationId}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<byte[]> downloadCandidateResume(@PathVariable Integer applicationId) {
        
        System.out.println("🔥 DEBUG: downloadCandidateResume called with applicationId: " + applicationId);
        
        try {
            // Get resume info và file data through application ID
            ResumeResponse resumeInfo = resumeService.getCandidateResumeByApplicationId(applicationId);
            System.out.println("🔥 DEBUG: Found resume: " + resumeInfo.getOriginalFileName());
            
            byte[] fileData = resumeService.downloadCandidateResume(applicationId);
            System.out.println("🔥 DEBUG: File data size: " + fileData.length + " bytes");

            // Determine filename and content type
            String filename = buildDownloadFilename(resumeInfo);
            String contentType = determineContentType(resumeInfo.getOriginalFileName());

            System.out.println("🔥 DEBUG: Returning file: " + filename + ", content-type: " + contentType);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + encodeFilename(filename) + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .contentLength(fileData.length)
                    .body(fileData);
        } catch (Exception e) {
            System.err.println("❌ DEBUG ERROR in downloadCandidateResume: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(("Error: " + e.getMessage()).getBytes());
        }
    }

    /**
     * Employer view candidate CV in browser (không download)
     * Endpoint: GET /api/v1/resumes/view-candidate/{applicationId}
     */
    @GetMapping("/view-candidate/{applicationId}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<byte[]> viewCandidateResume(@PathVariable Integer applicationId) {
        
        System.out.println("🔥 DEBUG: viewCandidateResume called with applicationId: " + applicationId);
        
        try {
            // Get resume info và file data through application ID
            ResumeResponse resumeInfo = resumeService.getCandidateResumeByApplicationId(applicationId);
            System.out.println("🔥 DEBUG: Found resume for view: " + resumeInfo.getOriginalFileName());
            
            byte[] fileData = resumeService.downloadCandidateResume(applicationId);
            System.out.println("🔥 DEBUG: File data size for view: " + fileData.length + " bytes");

            // Determine content type for viewing
            String contentType = determineContentType(resumeInfo.getOriginalFileName());

            System.out.println("🔥 DEBUG: Returning view file, content-type: " + contentType);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline") // View trong browser, không download
                    .contentType(MediaType.parseMediaType(contentType))
                    .contentLength(fileData.length)
                    .body(fileData);
        } catch (Exception e) {
            System.err.println("❌ DEBUG ERROR in viewCandidateResume: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(("Error: " + e.getMessage()).getBytes());
        }
    }

    /**
     * Test endpoint - Không cần authentication
     */
    @GetMapping("/test-debug/{applicationId}")
    public ResponseEntity<String> testDebug(@PathVariable Integer applicationId) {
        System.out.println("🟢 TEST DEBUG: Endpoint được gọi với applicationId: " + applicationId);
        return ResponseEntity.ok("✅ Endpoint hoạt động! ApplicationId: " + applicationId);
    }

    /**
     * Debug endpoint - Kiểm tra application có resume không
     */
    @GetMapping("/debug-application/{applicationId}")
    public ResponseEntity<String> debugApplication(@PathVariable Integer applicationId) {
        System.out.println("🟢 DEBUG: Checking application: " + applicationId);
        
        try {
            // Check nếu application tồn tại
            Optional<Application> appOpt = applicationRepository.findById(applicationId);
            if (appOpt.isEmpty()) {
                return ResponseEntity.ok("❌ Application not found: " + applicationId);
            }
            
            Application application = appOpt.get();
            System.out.println("✅ Found application: " + application.getId());
            System.out.println("📄 Resume ID: " + (application.getResumes() != null ? application.getResumes().getId() : "NULL"));
            
            if (application.getResumes() != null) {
                Resume resume = application.getResumes();
                System.out.println("📄 Resume filename: " + resume.getOriginalFilename());
                System.out.println("📄 Resume filepath: " + resume.getFilePath());
                
                return ResponseEntity.ok("✅ Application " + applicationId + " has resume: " + resume.getOriginalFilename());
            } else {
                return ResponseEntity.ok("❌ Application " + applicationId + " has NO resume");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok("❌ Error: " + e.getMessage());
        }
    }

    /**
     * Debug endpoint - List tất cả applications và resume status
     */
    @GetMapping("/debug-all-applications")
    public ResponseEntity<String> debugAllApplications() {
        System.out.println("🟢 DEBUG: Checking all applications...");
        
        try {
            List<Application> applications = applicationRepository.findAll();
            StringBuilder result = new StringBuilder();
            result.append("📋 Total applications: ").append(applications.size()).append("\n\n");
            
            for (Application app : applications) {
                result.append("Application ID: ").append(app.getId())
                      .append(", User: ").append(app.getUser() != null ? app.getUser().getEmail() : "NULL")
                      .append(", Resume: ").append(app.getResumes() != null ? "✅ " + app.getResumes().getOriginalFilename() : "❌ NO RESUME")
                      .append("\n");
            }
            
            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok("❌ Error: " + e.getMessage());
        }
    }

    /**
     * Debug endpoint with authentication - Test employer access
     */
    @GetMapping("/debug-employer-access/{applicationId}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<String> debugEmployerAccess(@PathVariable Integer applicationId) {
        System.out.println("🟢 DEBUG EMPLOYER ACCESS: applicationId: " + applicationId);
        
        try {
            // Get current user
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            System.out.println("🔐 Current user: " + email);
            
            User employer = userRepository.findByEmail(email).orElse(null);
            if (employer == null) {
                return ResponseEntity.ok("❌ Employer not found: " + email);
            }
            System.out.println("👤 Found employer: " + employer.getEmail() + ", ID: " + employer.getId());
            
            // Check application
            Optional<Application> appOpt = applicationRepository.findById(applicationId);
            if (appOpt.isEmpty()) {
                return ResponseEntity.ok("❌ Application not found: " + applicationId);
            }
            
            Application application = appOpt.get();
            System.out.println("📋 Found application: " + application.getId());
            System.out.println("🏢 Job company user ID: " + application.getJobPost().getCompany().getUser().getId());
            System.out.println("👤 Current employer ID: " + employer.getId());
            
            // Check ownership
            boolean hasAccess = application.getJobPost().getCompany().getUser().getId().equals(employer.getId());
            System.out.println("🔑 Has access: " + hasAccess);
            
            if (!hasAccess) {
                return ResponseEntity.ok("❌ UNAUTHORIZED: Employer " + employer.getId() + " does not own company " + application.getJobPost().getCompany().getUser().getId());
            }
            
            // Check resume
            if (application.getResumes() == null) {
                return ResponseEntity.ok("❌ No resume for application: " + applicationId);
            }
            
            return ResponseEntity.ok("✅ SUCCESS: Employer can access application " + applicationId + " with resume: " + application.getResumes().getOriginalFilename());
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok("❌ Error: " + e.getMessage());
        }
    }

    /**
     * Test authentication - Xem current user
     */
    @GetMapping("/test-auth")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<String> testAuth() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByEmail(email).orElse(null);
            
            if (user == null) {
                return ResponseEntity.ok("❌ User not found: " + email);
            }
            
            return ResponseEntity.ok("✅ Authenticated as: " + user.getEmail() + ", Role: " + user.getRole() + ", ID: " + user.getId());
        } catch (Exception e) {
            return ResponseEntity.ok("❌ Error: " + e.getMessage());
        }
    }
    
    /**
     * Debug user download resume - Check ownership và permissions
     */
    @GetMapping("/debug-user-download/{resumeId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> debugUserDownload(@PathVariable Integer resumeId) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByEmail(email).orElse(null);
            
            if (user == null) {
                return ResponseEntity.ok("❌ User not found: " + email);
            }
            
            log.info("🔍 DEBUG: User {} trying to download resume {}", user.getEmail(), resumeId);
            
            // Check resume exists
            Resume resume = resumeRepository.findById(resumeId).orElse(null);
            if (resume == null) {
                return ResponseEntity.ok("❌ Resume not found: " + resumeId);
            }
            
            log.info("🔍 Resume found: ID={}, owner={}, filename={}", 
                resume.getId(), resume.getUser().getEmail(), resume.getOriginalFilename());
            
            // Check ownership
            boolean owns = resume.getUser().getId().equals(user.getId());
            log.info("🔍 Ownership check: currentUser={}, resumeOwner={}, owns={}", 
                user.getId(), resume.getUser().getId(), owns);
            
            if (!owns) {
                return ResponseEntity.ok("❌ User " + user.getId() + " does not own resume " + resumeId + " (owned by " + resume.getUser().getId() + ")");
            }
            
            return ResponseEntity.ok("✅ User can download resume " + resumeId + ": " + resume.getOriginalFilename());
            
        } catch (Exception e) {
            log.error("❌ Debug error:", e);
            return ResponseEntity.ok("❌ Error: " + e.getMessage());
        }
    }

    /**
     * Debug file mapping - Kiểm tra file database vs actual files
     */
    @GetMapping("/debug-file-mapping/{applicationId}")
    public ResponseEntity<String> debugFileMapping(@PathVariable Integer applicationId) {
        try {
            Optional<Application> appOpt = applicationRepository.findById(applicationId);
            if (appOpt.isEmpty()) {
                return ResponseEntity.ok("❌ Application not found: " + applicationId);
            }

            Application application = appOpt.get();
            if (application.getResumes() == null) {
                return ResponseEntity.ok("❌ No resume found for application " + applicationId);
            }

            Resume resume = application.getResumes();
            String dbFileName = resume.getOriginalFilename();
            String dbFilePath = resume.getFilePath();

            // Check what files exist in uploads/resume/
            java.nio.file.Path uploadsDir = java.nio.file.Paths.get("uploads/resume");
            java.util.List<String> actualFiles = new java.util.ArrayList<>();
            
            try {
                if (java.nio.file.Files.exists(uploadsDir)) {
                    java.nio.file.Files.list(uploadsDir)
                            .filter(java.nio.file.Files::isRegularFile)
                            .forEach(file -> actualFiles.add(file.getFileName().toString()));
                }
            } catch (Exception e) {
                actualFiles.add("Error reading directory: " + e.getMessage());
            }

            // Find potential matches
            String potentialMatch = null;
            for (String file : actualFiles) {
                if (file.contains(dbFileName) || file.endsWith(dbFileName)) {
                    potentialMatch = file;
                    break;
                }
            }

            StringBuilder result = new StringBuilder();
            result.append("🔍 File Mapping Debug for Application ").append(applicationId).append("\n\n");
            result.append("📊 Database Info:\n");
            result.append("- Resume ID: ").append(resume.getId()).append("\n");
            result.append("- Original File Name: ").append(dbFileName).append("\n");
            result.append("- File Path: ").append(dbFilePath).append("\n\n");
            result.append("📁 Actual Files in uploads/resume/:\n");
            for (String file : actualFiles) {
                result.append("- ").append(file).append("\n");
            }
            result.append("\n🎯 Potential Match: ").append(potentialMatch != null ? potentialMatch : "NONE FOUND").append("\n");
            
            if (potentialMatch != null) {
                result.append("\n💡 SOLUTION: Update database filePath from '").append(dbFilePath)
                      .append("' to 'resume/").append(potentialMatch).append("'");
            }

            return ResponseEntity.ok(result.toString());

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
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
