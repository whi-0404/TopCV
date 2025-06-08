package com.TopCV.service;

import com.TopCV.enums.FileType;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public interface FirebaseStorageService {
    FileUploadResponse uploadFile(MultipartFile file, FileType fileType, String userId);

    byte[] downloadFile(String fileName);

    String getDownloadUrl(String fileName);

    boolean deleteFile(String fileName);

    boolean fileExists(String fileName);

    InputStream getFileAsStream(String fileName);

    String generateFileName(String originalFilename, FileType fileType, String userId);

    void validateFile(MultipartFile file, FileType fileType);

    FileMetadata getFileMetadata(String fileName);
}
