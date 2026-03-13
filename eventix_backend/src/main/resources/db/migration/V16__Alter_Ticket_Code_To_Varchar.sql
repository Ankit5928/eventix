-- Change ticket_code from UUID to VARCHAR to support numeric ticket codes
ALTER TABLE tickets 
ALTER COLUMN ticket_code TYPE VARCHAR(255) USING ticket_code::VARCHAR;
