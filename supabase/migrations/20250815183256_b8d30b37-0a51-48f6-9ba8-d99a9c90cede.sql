-- Restrict public read of sensitive material_interactions and provide safe public access
BEGIN;

-- Ensure RLS is enabled
ALTER TABLE public.material_interactions ENABLE ROW LEVEL SECURITY;

-- Remove permissive public read policy
DROP POLICY IF EXISTS "Anyone can view interactions" ON public.material_interactions;

-- Keep existing INSERT policy as-is to avoid breaking current UX
-- (Optionally, we can tighten later to require auth.)

-- Create a SECURITY DEFINER function that exposes only non-sensitive fields
CREATE OR REPLACE FUNCTION public.get_material_interactions_public(material_id_input uuid)
RETURNS TABLE (
  id uuid,
  material_id uuid,
  interaction_type text,
  comment_text text,
  rating_value integer,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, material_id, interaction_type, comment_text, rating_value, created_at
  FROM public.material_interactions
  WHERE material_id = material_id_input;
$$;

-- Allow both anon and authenticated clients to call this function
GRANT EXECUTE ON FUNCTION public.get_material_interactions_public(uuid) TO anon, authenticated;

COMMIT;