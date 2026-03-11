-- V08: Migration for Attendee Entity
CREATE TABLE attendees (
                           id BIGSERIAL PRIMARY KEY,

    -- EM-RESERVE-004-T4: Strict One-to-One mapping
                           reservation_id UUID NOT NULL,

                           first_name VARCHAR(100) NOT NULL,
                           last_name VARCHAR(100) NOT NULL,
                           email VARCHAR(255) NOT NULL,

    -- EM-RESERVE-004-T7: Supports international phone numbers
                           phone VARCHAR(20),

                           CONSTRAINT fk_attendees_reservation
                               FOREIGN KEY (reservation_id)
                                   REFERENCES reservations(id)
                                   ON DELETE CASCADE,

                           CONSTRAINT uq_attendees_reservation
                               UNIQUE (reservation_id)
);

-- Index for searching attendees by email (useful for check-in apps)
CREATE INDEX idx_attendees_email ON attendees (email);

-- Index for looking up attendee by reservation ID
CREATE INDEX idx_attendees_reservation_id ON attendees (reservation_id);