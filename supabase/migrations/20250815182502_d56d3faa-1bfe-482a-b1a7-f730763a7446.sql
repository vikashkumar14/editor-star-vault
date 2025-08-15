-- Tighten privacy on content_interactions: restrict read access
BEGIN;

ALTER TABLE public.content_interactions ENABLE ROW LEVEL SECURITY;

-- Remove public read access
DROP POLICY IF EXISTS "Anyone can view interactions" ON public.content_interactions;

-- Allow authenticated users to read ONLY their own interactions
CREATE POLICY "Users can view their own interactions"
ON public.content_interactions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

COMMIT;