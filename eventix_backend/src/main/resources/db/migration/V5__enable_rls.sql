-- src/main/resources/db/migration/V5__enable_rls.sql

-- 1. Enable RLS on the primary tenant table (EM-AUTH-003-T2)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 2. Create the isolation policy for Events (EM-AUTH-003-T3, T4)
-- This ensures a user can ONLY see events matching their session's organization ID.
CREATE POLICY event_org_isolation_policy ON events
    USING (organization_id = current_setting('app.current_org')::bigint);


-- 3. Enable RLS on Ticket Categories (EM-AUTH-003-T6, T7)
ALTER TABLE ticket_categories ENABLE ROW LEVEL SECURITY;

-- Use a cascaded check: Categories are visible if their parent Event is visible.
CREATE POLICY ticket_cat_org_isolation_policy ON ticket_categories
    USING (event_id IN (SELECT id FROM events));


-- 4. Enable RLS on Reservations (EM-AUTH-003-T10, T11)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY reservations_org_isolation_policy ON reservations
    USING (event_id IN (SELECT id FROM events));


-- 5. Enable RLS on Reservation Items
ALTER TABLE reservation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY res_items_org_isolation_policy ON reservation_items
    USING (reservation_id IN (SELECT id FROM reservations));