package com.bluepal.service;

import com.bluepal.modal.Event;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class CalendarService {

    private static final String DATE_FORMAT = "yyyyMMdd'T'HHmmss'Z'";

    public String generateEventIcs(Event event) {
        // T7: Constructing the ICS file content
        return "BEGIN:VCALENDAR\n" +
                "VERSION:2.0\n" +
                "PRODID:-//BluePal//Eventix//EN\n" +
                "BEGIN:VEVENT\n" +
                "UID:" + event.getId() + "@eventix.bluepal.in\n" +
                "DTSTAMP:" + LocalDateTime.now().format(DateTimeFormatter.ofPattern(DATE_FORMAT)) + "\n" +
                "DTSTART:" + event.getStartDate().format(DateTimeFormatter.ofPattern(DATE_FORMAT)) + "\n" +
                "DTEND:" + event.getEndDate().format(DateTimeFormatter.ofPattern(DATE_FORMAT)) + "\n" +
                "SUMMARY:" + event.getTitle() + "\n" +
                "DESCRIPTION:" + event.getDescription().replaceAll("\n", " ") + "\n" +
                "LOCATION:" + event.getLocation() + "\n" +
                "END:VEVENT\n" +
                "END:VCALENDAR";
    }
}