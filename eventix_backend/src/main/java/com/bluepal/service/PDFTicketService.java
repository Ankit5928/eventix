package com.bluepal.service;

import com.bluepal.modal.Order;
import com.bluepal.modal.Ticket;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PDFTicketService {

    private final FileStorageService fileStorageService; // Inject the storage expert

    public String generateTicketPDF(Order order, List<Ticket> tickets) {
        // Use a stream to hold the PDF in memory first
        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            for (Ticket ticket : tickets) {
                PDPage page = new PDPage();
                document.addPage(page);

                try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                    // Draw Header (T8, T9)
                    contentStream.beginText();
                    contentStream.setFont(PDType1Font.HELVETICA_BOLD, 20);
                    contentStream.newLineAtOffset(50, 750);
                    contentStream.showText(order.getReservation().getEvent().getTitle());
                    contentStream.endText();

                    // Draw Attendee Info (T11, T12)
                    contentStream.beginText();
                    contentStream.setFont(PDType1Font.HELVETICA, 12);
                    contentStream.newLineAtOffset(50, 700);
                    contentStream.showText("Attendee: " + ticket.getAttendeeName());
                    contentStream.endText();

                    // Draw QR Code (T13-T15)
                    if (ticket.getQrCodePath() != null) {
                        PDImageXObject qrImage = PDImageXObject.createFromFile(ticket.getQrCodePath(), document);
                        contentStream.drawImage(qrImage, 400, 600, 150, 150);
                    }
                }
            }

            // Save the document to our memory stream
            document.save(baos);

            // T19, T22: Hand the bytes over to FileStorageService to save to disk
            return fileStorageService.saveTicketPDF(baos.toByteArray(), order.getId());

        } catch (IOException e) {
            // T27, T28: Graceful error handling
            return null;
        }
    }
}