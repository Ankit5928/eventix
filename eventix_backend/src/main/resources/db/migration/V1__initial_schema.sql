-- V1__initial_schema.sql

-- 1. Create Organizations Table
CREATE TABLE organizations (
                               id BIGSERIAL PRIMARY KEY,
                               name VARCHAR(255) NOT NULL UNIQUE,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Users Table
CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Junction Table for Multi-tenancy (User <-> Org)
CREATE TABLE user_organization (
                                   user_id BIGINT REFERENCES users(id),
                                   organization_id BIGINT REFERENCES organizations(id),
                                   role VARCHAR(50) NOT NULL, -- e.g., 'OWNER', 'ORGANIZER'
                                   PRIMARY KEY (user_id, organization_id)
);

-- 4. Indexes for fast lookup (NFR-002)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_organizations_name ON organizations(name);