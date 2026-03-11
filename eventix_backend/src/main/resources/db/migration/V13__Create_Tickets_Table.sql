-- V12: Migration for Ticket Entity
CREATE TABLE tickets (
                         id UUID PRIMARY KEY,
                         order_id UUID NOT NULL,
                         ticket_category_id UUID NOT NULL,

    -- Unique code for QR scanning (EM-TICKET-GEN-001)
                         ticket_code UUID NOT NULL UNIQUE,

                         attendee_name VARCHAR(255),
                         attendee_email VARCHAR(255),

                         qr_code_path VARCHAR(255),
                         pdf_path VARCHAR(255),

    -- Check-in tracking (EM-CHECKIN-001)
                         checked_in BOOLEAN DEFAULT FALSE,
                         checked_in_at TIMESTAMP,

                         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                         CONSTRAINT fk_tickets_order
                             FOREIGN KEY (order_id)
                                 REFERENCES orders(id)
                                 ON DELETE CASCADE,

                         CONSTRAINT fk_tickets_category
                             FOREIGN KEY (ticket_category_id)
                                 REFERENCES ticket_categories(id)
                                 ON DELETE RESTRICT
);

-- Index for unique ticket code lookups (Critical for scanning apps)
CREATE INDEX idx_tickets_code ON tickets (ticket_code);

-- Index for retrieving all tickets for an order
CREATE INDEX idx_tickets_order_id ON tickets (order_id);

-- Index for attendee search/check-in filtering
CREATE INDEX idx_tickets_attendee_email ON tickets (attendee_email);