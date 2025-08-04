-- Create thumbnail storage bucket if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('thumbnails', 'thumbnails', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Create policy for thumbnail uploads
CREATE POLICY "Anyone can upload thumbnails" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'thumbnails');

CREATE POLICY "Anyone can view thumbnails" ON storage.objects
FOR SELECT USING (bucket_id = 'thumbnails');

CREATE POLICY "Anyone can update thumbnails" ON storage.objects
FOR UPDATE USING (bucket_id = 'thumbnails');

-- Update content table to ensure thumbnail_url column exists and is properly set up
ALTER TABLE content 
ADD COLUMN IF NOT EXISTS generated_thumbnail_url TEXT;

-- Add a column to track if thumbnail was auto-generated
ALTER TABLE content 
ADD COLUMN IF NOT EXISTS thumbnail_auto_generated BOOLEAN DEFAULT false;