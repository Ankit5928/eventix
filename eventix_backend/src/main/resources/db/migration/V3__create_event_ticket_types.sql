CREATE TABLE event_ticket_types (

                                    id BIGSERIAL PRIMARY KEY,

                                    event_id BIGINT NOT NULL,

                                    name VARCHAR(255) NOT NULL,

                                    description TEXT,

                                    price NUMERIC(10,2) NOT NULL,

                                    quantity INT NOT NULL,

                                    sold INT DEFAULT 0,

                                    sale_start TIMESTAMP,

                                    sale_end TIMESTAMP,

                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                    CONSTRAINT fk_ticket_event
                                        FOREIGN KEY (event_id)
                                            REFERENCES events(id)
                                            ON DELETE CASCADE
);

CREATE INDEX idx_ticket_event ON event_ticket_types(event_id);