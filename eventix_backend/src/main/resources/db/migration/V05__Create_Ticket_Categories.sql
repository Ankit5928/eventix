-- V03: Migration for TicketCategory Entity
CREATE TABLE ticket_categories (
                                   id UUID PRIMARY KEY,
                                   event_id BIGINT NOT NULL,
                                   name VARCHAR(255) NOT NULL,
                                   description TEXT,
                                   price DOUBLE PRECISION NOT NULL,
                                   quantity_total INTEGER NOT NULL,
                                   quantity_available INTEGER NOT NULL,
                                   sales_start TIMESTAMP,
                                   sales_end TIMESTAMP,
                                   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                   CONSTRAINT fk_ticket_categories_event
                                       FOREIGN KEY (event_id)
                                           REFERENCES events(id)
                                           ON DELETE CASCADE
);

-- Index for faster lookups when fetching categories for a specific event
CREATE INDEX idx_ticket_categories_event_id ON ticket_categories(event_id);

-- Index to help with real-time availability checks and sales period filtering
CREATE INDEX idx_ticket_categories_sales_period ON ticket_categories(sales_start, sales_end);