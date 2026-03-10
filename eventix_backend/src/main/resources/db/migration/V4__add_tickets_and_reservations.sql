-- V2__add_tickets_and_reservations.sql

-- 1. Create Ticket Categories Table (Epic 3)
CREATE TABLE ticket_categories (
                                   id BIGSERIAL PRIMARY KEY,
                                   event_id BIGINT NOT NULL REFERENCES events(id),
                                   name VARCHAR(255) NOT NULL,
                                   description TEXT,
                                   price DECIMAL(19, 2) NOT NULL DEFAULT 0.0 CHECK (price >= 0),
                                   quantity_total INTEGER NOT NULL CHECK (quantity_total > 0),
                                   quantity_available INTEGER NOT NULL,
                                   sales_start TIMESTAMP,
                                   sales_end TIMESTAMP,
                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- EM-TICKET-001: Ensure available quantity never exceeds total
                                   CONSTRAINT check_quantity_validity CHECK (quantity_available <= quantity_total AND quantity_available >= 0)
);

-- 2. Create Reservations Table (Epic 4)
CREATE TABLE reservations (
                              id UUID PRIMARY KEY, -- Secure unique identifier as defined in model
                              event_id BIGINT REFERENCES events(id),
                              expires_at TIMESTAMP NOT NULL, -- EM-RESERVE-001: Set to 15 mins hold
                              status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
                              attendee_email VARCHAR(255),
                              attendee_name VARCHAR(255),
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Reservation Items Junction Table
CREATE TABLE reservation_items (
                                   id BIGSERIAL PRIMARY KEY,
                                   reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
                                   ticket_category_id BIGINT NOT NULL REFERENCES ticket_categories(id),
                                   quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- 4. Indexes for Performance (NFR-002)
CREATE INDEX idx_ticket_categories_event_id ON ticket_categories(event_id);
CREATE INDEX idx_reservations_status_expires ON reservations(status, expires_at);
CREATE INDEX idx_reservation_items_res_id ON reservation_items(reservation_id);