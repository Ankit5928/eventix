package com.bluepal.service;

import com.bluepal.modal.Ticket;
import com.bluepal.repository.TicketRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor // Added to inject the repository
public class QRCodeService {

    private final TicketRepository ticketRepository;
    private final String QR_PATH = "uploads/qrcodes/";

    public String generateQRCode(UUID ticketId, String ticketCode) {
        try {
            int width = 300;
            int height = 300;
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);

            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(ticketCode, BarcodeFormat.QR_CODE, width, height, hints);

            Path path = Paths.get(QR_PATH);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }

            Path filePath = path.resolve(ticketId.toString() + ".png");
            MatrixToImageWriter.writeToPath(bitMatrix, "PNG", filePath);

            return filePath.toString();
        } catch (Exception e) {
            log.error("Failed to generate QR code for ticket {}", ticketId, e);
            return null;
        }
    }

    /**
     * Logic to retrieve the QR code as a file resource.
     * This keeps the Repository out of the Controller.
     */
    public Resource getQRCodeResource(UUID ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        try {
            Path path = Paths.get(ticket.getQrCodePath());
            Resource resource = new UrlResource(path.toUri());

            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("QR Code file is missing on server.");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Invalid file path for QR code: " + e.getMessage());
        }
    }
}