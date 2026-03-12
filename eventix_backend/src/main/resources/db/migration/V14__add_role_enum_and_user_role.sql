-- V14: Add Role Enum column to Users Table for global RBAC

ALTER TABLE users ADD COLUMN role VARCHAR(50);

-- Backfill existing users and org-owners with a base role
UPDATE users SET role = 'USER' WHERE role IS NULL;
