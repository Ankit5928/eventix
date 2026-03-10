-- Drop the existing table and recreate or alter the column
ALTER TABLE reservation_items DROP CONSTRAINT IF EXISTS reservation_items_pkey;
ALTER TABLE reservation_items ALTER COLUMN id TYPE UUID USING (gen_random_uuid());
ALTER TABLE reservation_items ADD PRIMARY KEY (id);