ALTER TABLE reservations
    ADD COLUMN stripe_payment_intent_id VARCHAR(255);


ALTER TABLE reservations
    ADD COLUMN terms_accepted BOOLEAN DEFAULT FALSE;
