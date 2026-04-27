-- Migration to support Draft mode for trips

-- 1. Add the is_draft column
ALTER TABLE trips ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false;

-- 2. Update all existing trips to be published (not drafts)
UPDATE trips SET is_draft = false WHERE is_draft IS NULL;
