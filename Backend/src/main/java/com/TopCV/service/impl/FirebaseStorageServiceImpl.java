package com.TopCV.service.impl;

import com.TopCV.enums.FileType;
import com.TopCV.service.FirebaseStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class FirebaseStorageServiceImpl implements FirebaseStorageService {
    @Value("${firebase.config.storage-bucket}")
    private String bucketName;

    @Value("${firebase.storage.public-folder:public}")
    private String publicFolder;

    @Value("${firebase.storage.private-folder:private}")
    private String privateFolder;

    @Override
    public FileUploadResponse uploadFile(MultipartFile file, FileType fileType, String userId) {
        validateFile(file, fileType);

        try {
            // Generate unique filename
            String fileName = generateFileName(file.getOriginalFilename(), fileType, userId);

            // Determine if file should be public or private
            boolean isPublic = isFileTypePublic(fileType);
            String folderPath = isPublic ? publicFolder : privateFolder;
            String fullPath = isPublic ?
                    String.format("%s/%s/%s", folderPath, fileType.getDirectory(), fileName) :
                    String.format("%s/%s/%s/%s", folderPath, userId, fileType.getDirectory(), fileName);

            // Prepare metadata
            Map<String, String> metadata = new HashMap<>();
            metadata.put("originalFileName", file.getOriginalFilename());
            metadata.put("uploadedBy", userId);
            metadata.put("fileType", fileType.name());
            metadata.put("uploadedAt", LocalDateTime.now().toString());

            // Upload to Firebase Storage
            Bucket bucket = StorageClient.getInstance().bucket();
            BlobId blobId = BlobId.of(bucketName, fullPath);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                    .setContentType(fileType.getContentType(getFileExtension(file.getOriginalFilename())))
                    .setMetadata(metadata)
                    .build();

            // Upload file
            Blob blob = bucket.getStorage().create(blobInfo, file.getBytes());

            // Generate URLs
            String downloadUrl = generateSignedUrl(fullPath, 365); // 1 year expiry
            String publicUrl = isPublic ? generatePublicUrl(fullPath) : null;

            log.info("File uploaded successfully: {} to {}", file.getOriginalFilename(), fullPath);

            return FileUploadResponse.builder()
                    .fileName(fileName)
                    .originalFileName(file.getOriginalFilename())
                    .downloadUrl(downloadUrl)
                    .publicUrl(publicUrl)
                    .fileType(fileType)
                    .contentType(blob.getContentType())
                    .fileSize(blob.getSize())
                    .formattedFileSize(formatFileSize(blob.getSize()))
                    .uploadedAt(LocalDateTime.now())
                    .uploadedBy(userId)
                    .filePath(fullPath)
                    .isPublic(isPublic)
                    .build();

        } catch (IOException e) {
            log.error("Failed to upload file {} for user {}: {}",
                    file.getOriginalFilename(), userId, e.getMessage());
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }
}
