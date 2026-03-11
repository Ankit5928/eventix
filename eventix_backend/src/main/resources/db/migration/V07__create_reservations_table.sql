CREATE TABLE reservations (
                              id UUID PRIMARY KEY,
                              event_id BIGINT,

                              expires_at TIMESTAMP NOT NULL,

                              status VARCHAR(50) DEFAULT 'PENDING',

                              attendee_email VARCHAR(255),
                              attendee_name VARCHAR(255),

                              terms_accepted BOOLEAN DEFAULT FALSE,

                              session_id VARCHAR(255),

                              stripe_payment_intent_id VARCHAR(255),

                              CONSTRAINT fk_reservations_event
                                  FOREIGN KEY (event_id)
                                      REFERENCES events(id)
                                      ON DELETE CASCADE
);

CREATE INDEX idx_reservations_event_id ON reservations(event_id);
CREATE INDEX idx_reservations_status ON reservations(status);