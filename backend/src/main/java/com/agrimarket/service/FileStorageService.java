package com.agrimarket.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDir;
    private final String fileServingBaseUrl;

    public FileStorageService(@Value("${file.upload.dir:uploads}") String uploadDirPath,
                              @Value("${file.serving.base-url:/files}") String fileServingBaseUrl) {
        this.uploadDir = Paths.get(uploadDirPath).toAbsolutePath().normalize();
        this.fileServingBaseUrl = fileServingBaseUrl;
        
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory", e);
        }
    }

    public String uploadFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Validate file type (images only)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null ? 
            originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
        String uniqueFilename = UUID.randomUUID() + fileExtension;

        // Save file
        Path targetPath = uploadDir.resolve(uniqueFilename);
        Files.write(targetPath, file.getBytes());

        // Return serving URL
        return fileServingBaseUrl + "/" + uniqueFilename;
    }

    public void deleteFile(String fileUrl) throws IOException {
        if (fileUrl == null || !fileUrl.startsWith(fileServingBaseUrl)) {
            return; // Don't delete external URLs
        }

        String filename = fileUrl.substring(fileServingBaseUrl.length() + 1);
        Path filePath = uploadDir.resolve(filename).normalize();

        // Security check: ensure file is within upload directory
        if (!filePath.getParent().equals(uploadDir)) {
            throw new SecurityException("Attempted to delete file outside upload directory");
        }

        Files.deleteIfExists(filePath);
    }
}
