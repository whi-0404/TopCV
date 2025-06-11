package com.TopCV.service.impl;

import com.TopCV.dto.request.ResumeRequest;
import com.TopCV.dto.response.FileUploadResponse;
import com.TopCV.dto.response.ResumeResponse;
import com.TopCV.entity.Resumes;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
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
    public FileUploadResponse uploadResume(MultipartFile file, ResumeRequest request, String userEmail) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Validate file
        if (file.isEmpty()) {
            throw new AppException(ErrorCode.RESUME_EMPTY);
        }

        if (file.getSize() > FileType.RESUME.getMaxFileSize()) {
            throw new AppException(ErrorCode.RESUME_TOO_LARGE);
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new AppException(ErrorCode.RESUME_INVALID_FORMAT);
        }

        // Validate file format - cho phép nhiều loại file
        if (!isValidResumeFormat(originalFilename)) {
            log.error("Invalid resume format. File: {}, Allowed formats: {}", originalFilename, FileType.RESUME.getAllowedExtensions());
            throw new AppException(ErrorCode.RESUME_INVALID_FORMAT);
        }

        try {
            // Upload file và lấy filePath
            String filePath = fileService.uploadFile(file, FileType.RESUME.getDirectory());
            
            Resumes resume = Resumes.builder()
                    .user(user)
                    .filePath(filePath)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            
            resumeRepository.save(resume);

            return FileUploadResponse.builder()
                    .fileName(originalFilename)
                    .originalFileName(originalFilename)
                    .downloadUrl("/api/v1/resumes/download/" + resume.getId())
                    .fileType(FileType.RESUME)
                    .contentType(file.getContentType())
                    .fileSize(file.getSize())
                    .formattedFileSize(String.format("%.2f KB", file.getSize() / 1024.0))
                    .uploadedAt(resume.getCreatedAt())
                    .uploadedBy(user.getEmail())
                    .filePath(filePath)
                    .isPublic(false)
                    .build();
        } catch (Exception e) {
            log.error("Failed to upload resume: {}", e.getMessage());
            throw new AppException(ErrorCode.RESUME_UPLOAD_FAILED);
        }
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public byte[] downloadResume(Integer resumeId, String userEmail) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Resumes resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new AppException(ErrorCode.RESUME_NOT_EXISTED));

        if (!resume.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.RESUME_NOT_BELONGS_TO_USER);
        }

        try {
            return fileService.getFile(resume.getFilePath());
        } catch (Exception e) {
            log.error("Failed to download resume: {}", e.getMessage());
            throw new AppException(ErrorCode.RESUME_DOWNLOAD_FAILED);
        }
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('USER')")
    public void deleteResume(Integer resumeId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Resumes resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new AppException(ErrorCode.RESUME_NOT_EXISTED));

        if (!resume.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.RESUME_NOT_BELONGS_TO_USER);
        }

        try {
            fileService.deleteFile(resume.getFilePath());
            resumeRepository.deleteById(resumeId);
        } catch (Exception e) {
            log.error("Failed to delete resume: {}", e.getMessage());
            throw new AppException(ErrorCode.RESUME_DELETE_FAILED);
        }
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public List<ResumeResponse> getMyResumes(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Resumes> resumes = resumeRepository.findByUser(user);
        return resumes.stream()
                .map(resumeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('USER')")
    public ResumeResponse updateResume(Integer resumeId, ResumeRequest request, String userEmail) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Resumes resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new AppException(ErrorCode.RESUME_NOT_EXISTED));

        if (!resume.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.RESUME_NOT_BELONGS_TO_USER);
        }

        // Update fields from request using mapper
        resumeMapper.updateEntityFromRequest(request, resume);
        resume.setUpdatedAt(LocalDateTime.now());
        Resumes updatedResume = resumeRepository.save(resume);
        
        return resumeMapper.toResponse(updatedResume);
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public ResumeResponse getResumeById(Integer resumeId, String userEmail) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Resumes resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new AppException(ErrorCode.RESUME_NOT_EXISTED));

        if (!resume.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.RESUME_NOT_BELONGS_TO_USER);
        }

        return resumeMapper.toResponse(resume);
    }

    private boolean isValidResumeFormat(String filename) {
        if (filename == null || filename.trim().isEmpty()) {
            return false;
        }
        
        if (!filename.contains(".")) {
            return false;
        }
        
        String extension = getFileExtension(filename).toLowerCase();
        
        // Sử dụng FileType enum để validate
        boolean isValidExtension = FileType.RESUME.isExtensionAllowed(extension);
        
        if (!isValidExtension) {
            log.warn("Invalid file extension: {}. Allowed formats: {}", extension, FileType.RESUME.getAllowedExtensions());
        }
        
        return isValidExtension;
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}
