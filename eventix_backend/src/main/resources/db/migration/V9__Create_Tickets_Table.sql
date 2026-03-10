-- EM-TICKET-GEN-001: T1-T7
CREATE TABLE tickets (
                         id UUID PRIMARY KEY,
                         order_id UUID NOT NULL REFERENCES orders(id),
                         ticket_category_id UUID NOT NULL REFERENCES ticket_categories(id),
                         ticket_code UUID NOT NULL UNIQUE,
                         attendee_name VARCHAR(255),
                         attendee_email VARCHAR(255),
                         qr_code_path TEXT,
                         pdf_path TEXT,
                         checked_in BOOLEAN DEFAULT FALSE,
                         checked_in_at TIMESTAMP,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ticket_code ON tickets(ticket_code);
CREATE INDEX idx_ticket_order_id ON tickets(order_id);