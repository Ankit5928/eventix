-- V15: Make password hashes nullable for invited users & Create Password Reset Tokens

-- 1) Allow inserted invited members to exist without passwords momentarily
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- 2) Create Tokens Table
CREATE TABLE password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_reset_token ON password_reset_tokens(token);
