-- Step 1: Drop foreign key constraints pointing to ticket_categories
ALTER TABLE reservation_items DROP CONSTRAINT IF EXISTS fk_reservation_items_category;
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS fk_order_items_category;
ALTER TABLE tickets DROP CONSTRAINT IF EXISTS fk_tickets_category;

-- Step 2: Change the ID type in ticket_categories
ALTER TABLE ticket_categories ALTER COLUMN id TYPE UUID USING (gen_random_uuid());

-- Step 3: Update and Re-link foreign keys in other tables
ALTER TABLE reservation_items ALTER COLUMN ticket_category_id TYPE UUID;
ALTER TABLE order_items ALTER COLUMN ticket_category_id TYPE UUID;
ALTER TABLE tickets ALTER COLUMN ticket_category_id TYPE UUID;

-- Step 4: Re-add constraints
ALTER TABLE reservation_items ADD CONSTRAINT fk_reservation_items_category FOREIGN KEY (ticket_category_id) REFERENCES ticket_categories(id);