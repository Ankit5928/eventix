-- V07: Migration for Organization Entity
CREATE TABLE organizations (
                               id BIGSERIAL PRIMARY KEY,
                               name VARCHAR(255) NOT NULL UNIQUE,

    -- EM-PAY-001-T2: Stripe Configuration
                               stripe_publishable_key VARCHAR(255),
                               stripe_secret_key VARCHAR(512), -- Encrypted secret key storage

                               created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for unique name lookups (EM-ORG-001)
CREATE INDEX idx_organizations_name ON organizations (name);

-- Index for payment audits (EM-PAY-001)
CREATE INDEX idx_organizations_stripe_config ON organizations (stripe_publishable_key)
    WHERE stripe_publishable_key IS NOT NULL;