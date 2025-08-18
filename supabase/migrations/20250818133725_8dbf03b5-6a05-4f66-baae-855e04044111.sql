-- Ensure RLS is enabled on feedback table
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Restrict read access to admins only
DROP POLICY IF EXISTS "Admins can view feedback" ON public.feedback;
CREATE POLICY "Admins can view feedback"
ON public.feedback
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Keep existing INSERT policy (anyone can submit feedback)
-- No changes needed for INSERT policy; leaving as-is
