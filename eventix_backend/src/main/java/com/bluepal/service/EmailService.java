package com.bluepal.service;

import com.bluepal.modal.Order;
import com.bluepal.repository.OrderRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

// Thymeleaf Context (for template variables)
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

// Core Spring & I/O for Attachments
import org.springframework.core.io.ByteArrayResource;

import java.io.File;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final OrderRepository orderRepository;
    private final JavaMailSender mailSender;
    private final CalendarService calendarService;
    private final SpringTemplateEngine templateEngine;

    @Async // T20: Asynchronous processing
    public void sendTicketEmail(String toEmail, String attendeeName, String eventTitle,
            String eventDate, String location, String pdfPath, UUID orderId,
            String ticketCode, String qrPath) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Your Tickets for " + eventTitle);

            // T31, T32: Using your HTML Template with Dynamic Data
            String htmlContent = getHtmlTemplate()
                    .replace("[Event Name]", eventTitle)
                    .replace("[Attendee Name]", attendeeName)
                    .replace("[Order ID]", orderId.toString())
                    .replace("[Event Date]", eventDate)
                    .replace("[Location]", location)
                    .replace("[Ticket Code]", ticketCode != null ? ticketCode : "N/A");

            helper.setText(htmlContent, true);

            // Inline QR code (preview) if it exists
            if (qrPath != null && !qrPath.isBlank()) {
                File qrFile = new File(qrPath);
                if (qrFile.exists()) {
                    helper.addInline("ticketQrCode", new FileSystemResource(qrFile));
                }
            }

            // T17: Attach the PDF from the path saved by FileStorageService
            File file = new File(pdfPath);
            if (file.exists()) {
                FileSystemResource res = new FileSystemResource(file);
                helper.addAttachment("Tickets_" + eventTitle.replaceAll(" ", "_") + ".pdf", res);
            }

            mailSender.send(message);
            log.info("Professional HTML ticket email sent to: {}", toEmail);

        } catch (MessagingException e) {
            log.error("Failed to send HTML email: {}", e.getMessage());
        }
    }

    public void resendTicketEmail(UUID orderId) {
        // T2: Fetch order with attendee and PDF path
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        String attendeeEmail = order.getReservation().getAttendeeEmail();
        String attendeeName = order.getReservation().getAttendeeName();
        String eventTitle = order.getReservation().getEvent().getTitle();
        String pdfPath = order.getPdfPath(); // Path stored during initial generation

        // T3-T4: Reuse logic with a "Resend" note
        sendEmailWithAttachment(
                attendeeEmail,
                "Resent: Your Tickets for " + eventTitle,
                "Hello " + attendeeName + ",\n\nThis is a resend of your ticket email as requested.",
                pdfPath);

        // T5: Log for audit
        log.info("Ticket email resent for Order ID: {} to {}", orderId, attendeeEmail);
    }

    // Inside EmailService.java
    public void sendPublicConfirmationEmail(Order order) {
        // T9: Use the enhanced template
        Context context = new Context();
        context.setVariable("attendeeName", order.getReservation().getAttendeeName());
        context.setVariable("eventTitle", order.getReservation().getEvent().getTitle());
        // ... set other variables (T5)

        String htmlContent = templateEngine.process("public-ticket-email", context);

        // T8: Generate and attach ICS
        String icsContent = calendarService.generateEventIcs(order.getReservation().getEvent());

        mailSender.send(mimeMessage -> {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setTo(order.getReservation().getAttendeeEmail());
            helper.setSubject("Your Tickets for " + order.getReservation().getEvent().getTitle());
            helper.setText(htmlContent, true);

            // Attach the calendar file
            helper.addAttachment("event.ics", new ByteArrayResource(icsContent.getBytes()));
        });
    }

    private void sendEmailWithAttachment(String to, String subject, String body, String attachmentPath) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            // true = multipart message (required for attachments)
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);

            // T2: Attach the existing PDF from the file system
            if (attachmentPath != null) {
                File file = new File(attachmentPath);
                if (file.exists()) {
                    FileSystemResource res = new FileSystemResource(file);
                    helper.addAttachment("Your_Tickets.pdf", res);
                } else {
                    log.error("Attachment file not found at path: {}", attachmentPath);
                }
            }

            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Email delivery failed", e);
        }
    }

    /**
     * Your provided HTML Template (EM-TICKET-GEN-004-T31)
     */
    private String getHtmlTemplate() {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">" +
                "<div style=\"max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;\">" +
                "    <h2 style=\"color: #2c3e50;\">Your Tickets for [Event Name]</h2>" +
                "    <p>Hi [Attendee Name],</p>" +
                "    <p>Thank you for your purchase! Your tickets are attached to this email as a PDF.</p>" +
                "    <div style=\"background: #f9f9f9; padding: 15px; border-radius: 5px;\">" +
                "        <strong>Order ID:</strong> [Order ID]<br>" +
                "        <strong>Date:</strong> [Event Date]<br>" +
                "        <strong>Venue:</strong> [Location]" +
                "    </div>" +
                "    <div style=\"margin-top: 20px; padding: 15px; border-radius: 5px; background: #fff; border: 1px solid #e0e0e0;\">"
                +
                "        <p style=\"margin: 0 0 8px 0; font-weight: 700;\">Ticket Code</p>" +
                "        <p style=\"margin: 0 0 10px 0; font-size: 18px; letter-spacing: 1px;\"><strong>[Ticket Code]</strong></p>"
                +
                "        <p style=\"margin: 0 0 10px 0;\">Scan this QR on arrival:</p>" +
                "        <img src=\"cid:ticketQrCode\" alt=\"Ticket QR Code\" style=\"width: 240px; height: 240px;\" />"
                +
                "    </div>" +
                "    <p>Please present the QR code on the PDF at the entrance.</p>" +
                "    <p>See you there!<br>The Eventix Team</p>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    @Async
    public void sendInviteEmail(String toEmail, String token, String orgName, String inviterEmail) {
        log.info("Sending invite email to {} for organization {}", toEmail, orgName);

        try {
            Context context = new Context();
            context.setVariable("orgName", orgName);
            context.setVariable("inviterEmail", inviterEmail);

            // Build the frontend Set-Password URL
            String setPasswordUrl = "http://localhost:5173/set-password?token=" + token;
            context.setVariable("inviteLink", setPasswordUrl);

            String process = templateEngine.process("invite-email", context);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("You've been invited to join " + orgName + " on Eventix!");
            helper.setText(process, true); // true = HTML

            // For now, only log if mail fails since they might not have real credentials
            // yet
            try {
                mailSender.send(mimeMessage);
                log.info("Email sent successfully to {}", toEmail);
            } catch (Exception e) {
                log.warn(
                        "Failed to actually send email via SMTP. If testing locally without real credentials, here is the link: {}",
                        setPasswordUrl);
                log.error("Mail Error:", e);
            }

        } catch (MessagingException e) {
            log.error("Failed to generate HTML email for {}", toEmail, e);
        }
    }
}