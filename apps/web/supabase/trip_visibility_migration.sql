-- Migration to support 'visibility' column instead of 'is_public' boolean

ALTER TABLE trips ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'friends';

-- Update existing trips to the new format
UPDATE trips SET visibility = 'public' WHERE is_public = true;
UPDATE trips SET visibility = 'friends' WHERE is_public = false;

-- If you want to remove the old column after validating:
-- ALTER TABLE trips DROP COLUMN IF EXISTS is_public;
