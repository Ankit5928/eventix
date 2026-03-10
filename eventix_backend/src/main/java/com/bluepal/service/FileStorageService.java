package com.bluepal.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;
import java.util.Arrays;
import java.util.List;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private static final List<String> ALLOWED_TYPES = Arrays.asList("image/png", "image/jpeg", "image/jpg");
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    /**
     * NEW METHOD: Saves generated PDF bytes for tickets
     * Fulfills EM-TICKET-GEN-003-T19 & T22
     */
    public String saveTicketPDF(byte[] pdfBytes, UUID orderId) throws IOException {
        // Create directory structure: uploads/tickets/
        Path rootPath = Paths.get(uploadDir, "tickets");
        if (!Files.exists(rootPath)) {
            Files.createDirectories(rootPath);
        }

        // Define filename: order_UUID.pdf
        String fileName = "order_" + orderId + ".pdf";
        Path filePath = rootPath.resolve(fileName);

        // Save bytes to disk
        Files.write(filePath, pdfBytes);

        // Return relative path for DB
        return "/uploads/tickets/" + fileName;
    }

    /**
     * EXISTING METHOD: Saves uploaded event images
     */
    public String saveEventImage(Long eventId, MultipartFile file) throws IOException {
        validateFile(file);

        Path rootPath = Paths.get(uploadDir, "events", eventId.toString());
        if (!Files.exists(rootPath)) {
            Files.createDirectories(rootPath);
        }

        String extension = getFileExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID().toString() + extension;

        Path filePath = rootPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/events/" + eventId + "/" + fileName;
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) throw new RuntimeException("File is empty");
        if (file.getSize() > MAX_FILE_SIZE) throw new RuntimeException("File size exceeds 5MB limit");
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new RuntimeException("Invalid file type. Only PNG and JPEG are allowed.");
        }
    }

    private String getFileExtension(String fileName) {
        return fileName != null && fileName.contains(".")
                ? fileName.substring(fileName.lastIndexOf(".")) : ".jpg";
    }
}