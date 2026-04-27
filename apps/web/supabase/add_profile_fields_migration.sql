-- ============================================
-- Supabase DB: Add Profile Fields Migration
-- ============================================
-- Run this in the Supabase SQL Editor to add the missing 
-- `bio` and `cover_url` columns to the `profiles` table.

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS cover_url TEXT;
