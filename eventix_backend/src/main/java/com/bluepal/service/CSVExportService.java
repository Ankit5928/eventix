package com.bluepal.service;

import com.bluepal.modal.Ticket;
import com.bluepal.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringWriter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CSVExportService {

    private final TicketRepository ticketRepository;

    /**
     * T3-T10: Generates a CSV string of all attendees matching the filters.
     */
    public String exportAttendeesToCSV(Long eventId, String search, UUID categoryId, Boolean checkedIn) {
        // T4: Fetch ALL matches without pagination for the export
        List<Ticket> tickets = ticketRepository.findAllByEventWithFilters(eventId, categoryId, checkedIn, search);

        StringWriter writer = new StringWriter();

        // T5-T6: Define CSV Headers
        CSVFormat format = CSVFormat.DEFAULT.builder()
                .setHeader("Name", "Email", "Category", "Ticket Code", "Status", "Check-In Time")
                .build();

        try (CSVPrinter printer = new CSVPrinter(writer, format)) {
            for (Ticket t : tickets) {
                // T7-T9: Write data rows with null handling
                printer.printRecord(
                        t.getAttendeeName(),
                        t.getAttendeeEmail(),
                        t.getTicketCategory().getName(),
                        t.getTicketCode(),
                        t.isCheckedIn() ? "Checked In" : "Pending",
                        t.getCheckedInAt() != null ? t.getCheckedInAt().toString() : "N/A"
                );
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate CSV file", e);
        }

        return writer.toString();
    }
}