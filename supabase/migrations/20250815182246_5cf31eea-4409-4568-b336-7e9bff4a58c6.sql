-- Secure feedback table PII by removing public read access
BEGIN;

-- Ensure RLS is enabled (safe if already enabled)
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Remove public SELECT policy that exposed emails and names
DROP POLICY IF EXISTS "Allow public read access on feedback" ON public.feedback;

-- Keep existing INSERT policy so anyone can submit feedback via the contact form
-- No SELECT policies remain, so only service role (e.g., edge functions) can read feedback

COMMIT;