-- V2__create_events_table.sql

CREATE TABLE events (
                        id BIGSERIAL PRIMARY KEY,

                        organization_id BIGINT NOT NULL,

                        title VARCHAR(255) NOT NULL,
                        description TEXT,
                        location VARCHAR(255),

                        start_date TIMESTAMP NOT NULL,
                        end_date TIMESTAMP NOT NULL,

                        timezone VARCHAR(50),

                        visibility VARCHAR(50) DEFAULT 'public',
                        status VARCHAR(50) DEFAULT 'active',

                        image_path VARCHAR(500),

                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                        CONSTRAINT fk_event_organization
                            FOREIGN KEY (organization_id)
                                REFERENCES organizations(id)
                                ON DELETE CASCADE
);

-- Index for faster queries
CREATE INDEX idx_events_org ON events(organization_id);
CREATE INDEX idx_events_start_date ON events(start_date);