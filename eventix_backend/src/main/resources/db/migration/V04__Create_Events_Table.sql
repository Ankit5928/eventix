-- V04: Migration for Event Entity
CREATE TABLE events (
                        id BIGSERIAL PRIMARY KEY,
                        organization_id BIGINT NOT NULL,
                        title VARCHAR(255) NOT NULL,
                        description TEXT,
                        location VARCHAR(255),
                        venue_details TEXT, -- T13: Specific venue info
                        start_date TIMESTAMP NOT NULL,
                        end_date TIMESTAMP NOT NULL,
                        timezone VARCHAR(50),
                        visibility VARCHAR(20) NOT NULL DEFAULT 'PUBLIC',
                        status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                        image_path VARCHAR(255), -- T12: Mapping for getImageUrl
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                        CONSTRAINT fk_events_organization
                            FOREIGN KEY (organization_id)
                                REFERENCES organizations(id)
                                ON DELETE RESTRICT
);

-- Index for searching events by title (EM-PUBLIC-002)
CREATE INDEX idx_events_title ON events (LOWER(title));

-- Index for filtering by date and visibility (EM-PUBLIC-001 & EM-PUBLIC-006)
CREATE INDEX idx_events_discovery ON events (visibility, status, start_date);

-- Index for organization-wide metrics (EM-REPORT-005)
CREATE INDEX idx_events_org_id ON events (organization_id);