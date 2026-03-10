package com.bluepal.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.bluepal.dto.response.RevenueReportDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportPdfService {

    private final ReportingService reportingService;

    public byte[] generateSalesReportPDF(Long orgId, LocalDateTime start, LocalDateTime end) {
        // T3: Fetch data from existing service
        List<RevenueReportDTO> data = reportingService.getRevenueByEvent(orgId, start, end);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, out);

        document.open();

        // T5-T6: Header Section
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        document.add(new Paragraph("Eventix Sales Report", titleFont));
        document.add(new Paragraph("Generated on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))));
        document.add(new Paragraph(" ")); // Spacer

        // T8: Data Table
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.addCell("Event Name");
        table.addCell("Tickets Sold");
        table.addCell("Avg Price");
        table.addCell("Total Revenue");

        for (RevenueReportDTO report : data) {
            table.addCell(report.getEventName());
            table.addCell(String.valueOf(report.getTicketsSold()));
            // T9: Currency Formatting
            table.addCell(String.format("₹%.2f", report.getAvgTicketPrice()));
            table.addCell(String.format("₹%.2f", report.getTotalRevenue()));
        }

        document.add(table);

        // T10: Page Numbers/Footer handled by PageEvent (omitted for brevity)
        document.close();
        return out.toByteArray();
    }
}