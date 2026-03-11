-- V11: Migration for ReservationItem Entity
CREATE TABLE reservation_items (
                                   id UUID PRIMARY KEY,
                                   reservation_id UUID NOT NULL,
                                   ticket_category_id UUID NOT NULL,
                                   quantity INTEGER NOT NULL,
                                   price_at_reservation DOUBLE PRECISION NOT NULL,

                                   CONSTRAINT fk_res_items_reservation
                                       FOREIGN KEY (reservation_id)
                                           REFERENCES reservations(id)
                                           ON DELETE CASCADE,

                                   CONSTRAINT fk_res_items_category
                                       FOREIGN KEY (ticket_category_id)
                                           REFERENCES ticket_categories(id)
                                           ON DELETE RESTRICT
);

-- Index for retrieving all items for a specific reservation (EM-PUBLIC-004)
CREATE INDEX idx_reservation_items_res_id ON reservation_items (reservation_id);

-- Index for checking category demand during active reservations
CREATE INDEX idx_reservation_items_category_id ON reservation_items (ticket_category_id);