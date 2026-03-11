-- V06: Migration for OrderItem Entity
CREATE TABLE order_items (
                             id UUID PRIMARY KEY,
                             order_id UUID NOT NULL,
                             ticket_category_id UUID NOT NULL,
                             quantity INTEGER NOT NULL,
                             price_paid DOUBLE PRECISION NOT NULL,
                             subtotal DOUBLE PRECISION NOT NULL,

                             CONSTRAINT fk_order_items_order
                                 FOREIGN KEY (order_id)
                                     REFERENCES orders(id)
                                     ON DELETE CASCADE,

                             CONSTRAINT fk_order_items_category
                                 FOREIGN KEY (ticket_category_id)
                                     REFERENCES ticket_categories(id)
                                     ON DELETE RESTRICT
);

-- Index for retrieving all items in a single order
CREATE INDEX idx_order_items_order_id ON order_items (order_id);

-- Index for reporting sales by ticket category (EM-REPORT-003)
CREATE INDEX idx_order_items_category_id ON order_items (ticket_category_id);