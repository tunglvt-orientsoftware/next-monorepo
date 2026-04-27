-- ============================================
-- Supabase Storage: Covers Bucket Setup
-- ============================================
-- Run this in the Supabase SQL Editor to create
-- a public storage bucket for user cover photos.

-- 1. Create the covers bucket (public so images are accessible via URL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow authenticated users to upload their own cover
CREATE POLICY "Users can upload their own cover"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'covers'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Allow authenticated users to update (overwrite) their own cover
CREATE POLICY "Users can update their own cover"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'covers'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Allow authenticated users to delete their own cover
CREATE POLICY "Users can delete their own cover"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'covers'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Allow public read access to all covers
CREATE POLICY "Anyone can view covers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'covers');
