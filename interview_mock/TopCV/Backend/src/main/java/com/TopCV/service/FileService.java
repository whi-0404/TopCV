package com.TopCV.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    String uploadFile(MultipartFile file, String folder);
    boolean deleteFile(String filePath);
    byte[] getFile(String filePath);
}
