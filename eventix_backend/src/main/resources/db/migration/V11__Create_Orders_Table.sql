-- V05: Migration for Order Entity
CREATE TABLE orders (
                        id UUID PRIMARY KEY,
                        reservation_id UUID UNIQUE, -- One-to-One: A reservation results in one order
                        payment_id UUID UNIQUE,     -- One-to-One: A payment belongs to one order
                        total_amount DOUBLE PRECISION NOT NULL,
                        status VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
                        pdf_path VARCHAR(255),      -- Path to the generated ticket PDF
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                        CONSTRAINT fk_orders_reservation
                            FOREIGN KEY (reservation_id)
                                REFERENCES reservations(id)
                                ON DELETE SET NULL,

                        CONSTRAINT fk_orders_payment
                            FOREIGN KEY (payment_id)
                                REFERENCES payments(id)
                                ON DELETE SET NULL
);

-- Index for fast lookup of orders by status (EM-REPORT-001)
CREATE INDEX idx_orders_status ON orders (status);

-- Index for temporal reporting (EM-REPORT-002)
CREATE INDEX idx_orders_created_at ON orders (created_at);