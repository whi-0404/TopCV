package com.TopCV.service.impl;

import com.TopCV.dto.response.FileUploadResponse;
import com.TopCV.dto.response.ResumeResponse;
import com.TopCV.entity.Resume;
import com.TopCV.entity.User;
import com.TopCV.enums.FileType;
import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;
import com.TopCV.mapper.ResumeMapper;
import com.TopCV.repository.ResumeRepository;
import com.TopCV.repository.UserRepository;
import com.TopCV.service.FileService;
import com.TopCV.service.ResumeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class ResumeServiceImpl implements ResumeService {
    FileService fileService;
    ResumeRepository resumeRepository;
    UserRepository userRepository;
    ResumeMapper resumeMapper;

    @Override
    @Transactional
    @PreAuthorize("hasRole('USER')")
    public FileUploadResponse uploadResume(MultipartFile file) {
        User user = getCurrentUser();

        // Validate file
        validateFile(file);

        String originalFilename = file.getOriginalFilename();
        log.info("User {} uploading resume: {}", user.getEmail(), originalFilename);

        try {
            // Upload file to uploads/resume/ directory
            String filePath = fileService.uploadFile(file, FileType.RESUME.getDirectory());

            Resume resume = Resume.builder()
                    .user(user)
                    .originalFilename(originalFilename)
                    .fileSize(file.getSize())
                    .filePath(filePath)
                    .build();

            Resume savedResume = resumeRepository.save(resume);
            log.info("Resume saved successfully with ID: {} for user: {}", savedResume.getId(), user.getEmail());

            return buildFileUploadResponse(file, savedResume, user);

        } catch (Exception e) {
            log.error("Failed to upload resume for user {}: {}", user.getEmail(), e.getMessage(), e);
            throw new AppException(ErrorCode.RESUME_UPLOAD_FAILED);
        }
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public byte[] downloadResume(Integer resumeId) {
        User user = getCurrentUser();
        Resume resume = getResumeAndValidateOwnership(resumeId, user);

        try {
            log.info("User {} downloading resume ID: {}", user.getEmail(), resumeId);
            return fileService.getFile(resume.getFilePath());
        } catch (Exception e) {
            log.error("Failed to download resume ID {} for user {}: {}", resumeId, user.getEmail(), e.getMessage(), e);
            throw new AppException(ErrorCode.RESUME_DOWNLOAD_FAILED);
        }
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('USER')")
    public void deleteResume(Integer resumeId) {
        User user = getCurrentUser();
        Resume resume = getResumeAndValidateOwnership(resumeId, user);

        try {
            // Delete physical file first
            boolean fileDeleted = fileService.deleteFile(resume.getFilePath());
            if (!fileDeleted) {
                log.warn("Physical file not found or failed to delete: {}", resume.getFilePath());
            }

            // Delete database record
            resumeRepository.deleteById(resumeId);
            log.info("Resume ID {} deleted successfully by user {}", resumeId, user.getEmail());

        } catch (Exception e) {
            log.error("Failed to delete resume ID {} for user {}: {}", resumeId, user.getEmail(), e.getMessage(), e);
            throw new AppException(ErrorCode.RESUME_DELETE_FAILED);
        }
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public List<ResumeResponse> getMyResumes() {
        User user = getCurrentUser();

        List<Resume> resumes = resumeRepository.findByUser(user);
        log.debug("Found {} resumes for user {}", resumes.size(), user.getEmail());

        return resumes.stream()
                .map(resumeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public ResumeResponse getResumeById(Integer resumeId) {
        User user = getCurrentUser();
        Resume resume = getResumeAndValidateOwnership(resumeId, user);

        return resumeMapper.toResponse(resume);
    }

    /**
     * Get current authenticated user
     */
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    /**
     * Get resume and validate ownership
     */
    private Resume getResumeAndValidateOwnership(Integer resumeId, User user) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new AppException(ErrorCode.RESUME_NOT_EXISTED));

        if (!resume.getUser().getId().equals(user.getId())) {
            log.warn("User {} attempted to access resume {} belonging to user {}",
                    user.getEmail(), resumeId, resume.getUser().getEmail());
            throw new AppException(ErrorCode.RESUME_NOT_BELONGS_TO_USER);
        }

        return resume;
    }

    /**
     * Comprehensive file validation
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new AppException(ErrorCode.RESUME_EMPTY);
        }

        if (file.getSize() > FileType.RESUME.getMaxFileSize()) {
            log.warn("File size {} exceeds maximum allowed size {}", file.getSize(), FileType.RESUME.getMaxFileSize());
            throw new AppException(ErrorCode.RESUME_TOO_LARGE);
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new AppException(ErrorCode.RESUME_INVALID_FORMAT);
        }

        if (!isValidResumeFormat(originalFilename)) {
            log.error("Invalid resume format. File: {}, Allowed formats: {}",
                    originalFilename, FileType.RESUME.getAllowedExtensions());
            throw new AppException(ErrorCode.RESUME_INVALID_FORMAT);
        }
    }

    /**
     * Build file upload response
     */
    private FileUploadResponse buildFileUploadResponse(MultipartFile file, Resume resume, User user) {
        return FileUploadResponse.builder()
                .fileName(file.getOriginalFilename())
                .originalFileName(file.getOriginalFilename())
                .downloadUrl("/api/v1/resumes/download/" + resume.getId())
                .fileType(FileType.RESUME)
                .contentType(file.getContentType())
                .fileSize(file.getSize())
                .formattedFileSize(formatFileSize(file.getSize()))
                .uploadedAt(resume.getCreatedAt())
                .uploadedBy(user.getEmail())
                .filePath(resume.getFilePath())
                .isPublic(false)
                .build();
    }

    /**
     * Format file size in human readable format
     */
    private String formatFileSize(long sizeInBytes) {
        if (sizeInBytes < 1024) {
            return sizeInBytes + " B";
        } else if (sizeInBytes < 1024 * 1024) {
            return String.format("%.2f KB", sizeInBytes / 1024.0);
        } else {
            return String.format("%.2f MB", sizeInBytes / (1024.0 * 1024.0));
        }
    }

    /**
     * Validate resume file format
     */
    private boolean isValidResumeFormat(String filename) {
        if (filename == null || filename.trim().isEmpty()) {
            return false;
        }

        if (!filename.contains(".")) {
            return false;
        }

        String extension = getFileExtension(filename).toLowerCase();
        boolean isValidExtension = FileType.RESUME.isExtensionAllowed(extension);

        if (!isValidExtension) {
            log.warn("Invalid file extension: {}. Allowed formats: {}",
                    extension, FileType.RESUME.getAllowedExtensions());
        }

        return isValidExtension;
    }

    /**
     * Extract file extension from filename
     */
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}