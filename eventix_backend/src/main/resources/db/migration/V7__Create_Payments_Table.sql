CREATE TABLE payments (
                          id UUID PRIMARY KEY,
                          reservation_id UUID NOT NULL REFERENCES reservations(id),
                          stripe_payment_intent_id VARCHAR(255) NOT NULL,
                          amount_in_cents BIGINT NOT NULL,
                          currency VARCHAR(10) NOT NULL,
                          status VARCHAR(50) NOT NULL,
                          created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_payment_stripe_id ON payments(stripe_payment_intent_id);