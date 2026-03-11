-- V13: Migration for UserOrganization Entity (Join Table)
CREATE TABLE user_organization (
                                   user_id BIGINT NOT NULL,
                                   organization_id BIGINT NOT NULL,
                                   role VARCHAR(50) NOT NULL,

    -- Composite Primary Key (Matching @EmbeddedId)
                                   PRIMARY KEY (user_id, organization_id),

                                   CONSTRAINT fk_user_org_user
                                       FOREIGN KEY (user_id)
                                           REFERENCES users(id)
                                           ON DELETE CASCADE,

                                   CONSTRAINT fk_user_org_organization
                                       FOREIGN KEY (organization_id)
                                           REFERENCES organizations(id)
                                           ON DELETE CASCADE
);

-- Index for checking all organizations a specific user belongs to
CREATE INDEX idx_user_org_user_id ON user_organization (user_id);

-- Index for listing all staff members of a specific organization
CREATE INDEX idx_user_org_organization_id ON user_organization (organization_id);