package com.TopCV.enums;

import lombok.Getter;

import java.util.Arrays;
import java.util.List;

@Getter
public enum FileType {
    RESUME("resume", List.of("pdf", "doc", "docx"), 10 * 1024 * 1024, true), // 10MB, Multiple formats

    AVATAR("avt", Arrays.asList("jpg", "jpeg", "png", "gif"), 5 * 1024 * 1024, true), // 5MB

    COMPANY_LOGO("company-logos", Arrays.asList("jpg", "jpeg", "png", "svg"), 2 * 1024 * 1024, true), // 2MB

    IMAGE("images", Arrays.asList("jpg", "jpeg", "png", "gif"), 10 * 1024 * 1024, false); // 10MB

    private final String directory;
    private final List<String> allowedExtensions;
    private final long maxFileSize;
    private final boolean requiresAuth; // Requires authentication to access

    FileType(String directory, List<String> allowedExtensions, long maxFileSize, boolean requiresAuth) {
        this.directory = directory;
        this.allowedExtensions = allowedExtensions;
        this.maxFileSize = maxFileSize;
        this.requiresAuth = requiresAuth;
    }

    public boolean isExtensionAllowed(String extension) {
        return allowedExtensions.contains(extension.toLowerCase());
    }

    public String getContentType(String extension) {
        return switch (extension.toLowerCase()) {
            case "pdf" -> "application/pdf";
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "gif" -> "image/gif";
            case "svg" -> "image/svg+xml";
            case "doc" -> "application/msword";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            default -> "application/octet-stream";
        };
    }
}