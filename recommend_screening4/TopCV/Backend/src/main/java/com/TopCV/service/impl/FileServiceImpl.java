package com.TopCV.service.impl;

import com.TopCV.service.FileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
public class FileServiceImpl implements FileService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Override
    public String uploadFile(MultipartFile file, String folder) {
        validateFile(file);
        String validatedFolder = validateAndNormalizeFolder(folder);

        try {
            // Create directory structure: uploads/{folder}/
            String dirPath = uploadDir + File.separator + validatedFolder;
            Path directoryPath = Paths.get(dirPath);
            Files.createDirectories(directoryPath);

            // Generate unique filename
            String fileName = generateUniqueFileName(file.getOriginalFilename());
            Path filePath = directoryPath.resolve(fileName);

            // Save file using NIO (more efficient than FileOutputStream)
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String relativePath = validatedFolder + "/" + fileName;
            log.info("File uploaded successfully: {} (size: {} bytes)", relativePath, file.getSize());

            return relativePath;

        } catch (IOException e) {
            log.error("Failed to upload file: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload file: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean deleteFile(String filePath) {
        if (filePath == null || filePath.trim().isEmpty()) {
            log.warn("Attempted to delete file with null or empty path");
            return false;
        }

        try {
            Path path = Paths.get(uploadDir, filePath).normalize();

            // Security check: ensure path is within upload directory
            Path uploadPath = Paths.get(uploadDir).normalize();
            if (!path.startsWith(uploadPath)) {
                log.error("Security violation: Attempted to delete file outside upload directory: {}", path);
                throw new SecurityException("File path is outside allowed directory");
            }

            boolean deleted = Files.deleteIfExists(path);
            if (deleted) {
                log.info("File deleted successfully: {}", filePath);
            } else {
                log.warn("File not found for deletion: {}", filePath);
            }
            return deleted;

        } catch (IOException e) {
            log.error("Failed to delete file: {} - {}", filePath, e.getMessage(), e);
            throw new RuntimeException("Failed to delete file: " + e.getMessage(), e);
        }
    }

    @Override
    public byte[] getFile(String filePath) {
        if (filePath == null || filePath.trim().isEmpty()) {
            throw new IllegalArgumentException("File path cannot be null or empty");
        }

        try {
            // 🔥 NORMALIZE FILE PATH để handle inconsistent data
            String normalizedPath = normalizeFilePath(filePath);
            log.debug("Original path: {}, Normalized path: {}", filePath, normalizedPath);
            
            Path path = Paths.get(uploadDir, normalizedPath).normalize();

            // Security check: ensure path is within upload directory
            Path uploadPath = Paths.get(uploadDir).normalize();
            if (!path.startsWith(uploadPath)) {
                log.error("Security violation: Attempted to access file outside upload directory: {}", path);
                throw new SecurityException("File path is outside allowed directory");
            }

            if (!Files.exists(path)) {
                log.error("File not found: {} (normalized: {}, full path: {})", filePath, normalizedPath, path);
                throw new RuntimeException("File not found: " + filePath);
            }

            byte[] fileData = Files.readAllBytes(path);
            log.debug("File read successfully: {} (size: {} bytes)", normalizedPath, fileData.length);
            return fileData;

        } catch (IOException e) {
            log.error("Failed to read file: {} - {}", filePath, e.getMessage(), e);
            throw new RuntimeException("Failed to read file: " + e.getMessage(), e);
        }
    }

    /**
     * Validate uploaded file
     */
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        if (file.getOriginalFilename() == null || file.getOriginalFilename().trim().isEmpty()) {
            throw new IllegalArgumentException("File must have a valid filename");
        }

        // Additional validation can be added here (file content validation, etc.)
    }

    /**
     * Validate and normalize folder parameter to prevent path traversal attacks
     */
    private String validateAndNormalizeFolder(String folder) {
        if (folder == null || folder.trim().isEmpty()) {
            throw new IllegalArgumentException("Folder cannot be null or empty");
        }

        String normalized = folder.trim();

        // Prevent path traversal attacks
        if (normalized.contains("..") ||
                normalized.contains("\\") ||
                normalized.startsWith("/") ||
                normalized.contains(":") ||
                normalized.matches(".*[<>:\"|?*].*")) {

            log.error("Invalid folder name detected: {}", folder);
            throw new SecurityException("Invalid folder name: " + folder);
        }

        return normalized;
    }

    /**
     * Generate unique filename with UUID prefix
     */
    private String generateUniqueFileName(String originalFilename) {
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            return UUID.randomUUID().toString();
        }

        // Clean filename - remove potentially dangerous characters
        String cleanFilename = originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_");

        return UUID.randomUUID() + "_" + cleanFilename;
    }

    /**
     * Normalize file path để handle inconsistent data từ database
     * - Nếu path bắt đầu với "uploads/" → remove "uploads/" prefix (vì uploadDir đã chứa "uploads")
     * - Nếu path bắt đầu với "resume/" → giữ nguyên
     * - Nếu path chỉ là filename → thêm "resume/"
     */
    private String normalizeFilePath(String filePath) {
        if (filePath == null || filePath.trim().isEmpty()) {
            return filePath;
        }
        
        String trimmed = filePath.trim();
        
        // Case 1: Đã có prefix "uploads/" → REMOVE vì uploadDir đã chứa "uploads"
        if (trimmed.startsWith("uploads/")) {
            return trimmed.substring("uploads/".length()); // Remove "uploads/" prefix
        }
        
        // Case 2: Chỉ có "resume/xxx" → giữ nguyên
        if (trimmed.startsWith("resume/")) {
            return trimmed;
        }
        
        // Case 3: Chỉ là filename → thêm "resume/"
        if (!trimmed.contains("/")) {
            return "resume/" + trimmed;
        }
        
        // Default: giữ nguyên và để system handle
        return trimmed;
    }
}