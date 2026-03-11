-- V10: Migration for Payment Entity
CREATE TABLE payments (
                          id UUID PRIMARY KEY,
                          reservation_id UUID NOT NULL,
                          stripe_payment_intent_id VARCHAR(255) NOT NULL,
                          amount_in_cents BIGINT NOT NULL,
                          currency VARCHAR(10) NOT NULL,
                          status VARCHAR(50) NOT NULL,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                          CONSTRAINT fk_payments_reservation
                              FOREIGN KEY (reservation_id)
                                  REFERENCES reservations(id)
                                  ON DELETE RESTRICT
);

-- Index for looking up status (EM-PAY-003)
CREATE INDEX idx_payments_status ON payments (status);

-- Index for Stripe reconciliation (EM-PAY-004)
CREATE INDEX idx_payments_stripe_intent ON payments (stripe_payment_intent_id);

-- Index for reservation lookups
CREATE INDEX idx_payments_reservation_id ON payments (reservation_id);