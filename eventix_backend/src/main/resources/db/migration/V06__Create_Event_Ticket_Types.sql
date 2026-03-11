-- V09: Migration for EventTicketType Entity
CREATE TABLE event_ticket_types (
                                    id BIGSERIAL PRIMARY KEY,
                                    event_id BIGINT NOT NULL,
                                    name VARCHAR(255) NOT NULL,
                                    description TEXT,
                                    price DECIMAL(19, 2) NOT NULL, -- Precision for BigDecimal
                                    quantity INTEGER NOT NULL,
                                    sold INTEGER NOT NULL DEFAULT 0,
                                    sale_start TIMESTAMP,
                                    sale_end TIMESTAMP,
                                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                    CONSTRAINT fk_ticket_types_event
                                        FOREIGN KEY (event_id)
                                            REFERENCES events(id)
                                            ON DELETE CASCADE
);

-- Index for retrieving all ticket types for a specific event
CREATE INDEX idx_ticket_types_event_id ON event_ticket_types (event_id);

-- Index for checking active sales periods
CREATE INDEX idx_ticket_types_active_sales ON event_ticket_types (sale_start, sale_end);