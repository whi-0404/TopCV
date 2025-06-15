package com.TopCV.dto.response;

import com.TopCV.enums.FileType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FileUploadResponse {
    String fileName;
    String originalFileName;
    String downloadUrl;
    String publicUrl;
    FileType fileType;
    String contentType;
    long fileSize;
    String formattedFileSize;
    LocalDateTime uploadedAt;
    String uploadedBy;
    String filePath;
    boolean isPublic;
}