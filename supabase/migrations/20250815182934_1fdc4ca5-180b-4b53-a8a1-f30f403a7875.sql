-- Secure content modifications via role-based RLS
BEGIN;

-- 1) Create roles enum if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin','creator','user');
  END IF;
END$$;

-- 2) Create user_roles table (idempotent)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS (safe if already enabled)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- (Optional) Basic policy to allow users to view their own roles; not required for has_role()
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
  END IF;
END$$;

-- 3) Helper function to check roles (security definer, stable)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- 4) Tighten RLS on content table
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- Drop overly permissive policies if they exist
DROP POLICY IF EXISTS "Anyone can create content" ON public.content;
DROP POLICY IF EXISTS "Anyone can update content" ON public.content;
DROP POLICY IF EXISTS "Anyone can delete content" ON public.content;
DROP POLICY IF EXISTS "Anyone can view content" ON public.content;

-- Keep/ensure public read for published content
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='content' AND policyname='Public can view published content'
  ) THEN
    CREATE POLICY "Public can view published content"
    ON public.content
    FOR SELECT
    USING (status = 'published');
  END IF;
END$$;

-- Allow admins and creators to view ALL content
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='content' AND policyname='Admins and creators can view all content'
  ) THEN
    CREATE POLICY "Admins and creators can view all content"
    ON public.content
    FOR SELECT
    TO authenticated
    USING (
      public.has_role(auth.uid(), 'admin')
      OR public.has_role(auth.uid(), 'creator')
    );
  END IF;
END$$;

-- Restrict INSERT to admins/creators
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='content' AND policyname='Admins and creators can create content'
  ) THEN
    CREATE POLICY "Admins and creators can create content"
    ON public.content
    FOR INSERT
    TO authenticated
    WITH CHECK (
      public.has_role(auth.uid(), 'admin')
      OR public.has_role(auth.uid(), 'creator')
    );
  END IF;
END$$;

-- Restrict UPDATE to admins/creators
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='content' AND policyname='Admins and creators can update content'
  ) THEN
    CREATE POLICY "Admins and creators can update content"
    ON public.content
    FOR UPDATE
    TO authenticated
    USING (
      public.has_role(auth.uid(), 'admin')
      OR public.has_role(auth.uid(), 'creator')
    )
    WITH CHECK (
      public.has_role(auth.uid(), 'admin')
      OR public.has_role(auth.uid(), 'creator')
    );
  END IF;
END$$;

-- Restrict DELETE to admins/creators
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='content' AND policyname='Admins and creators can delete content'
  ) THEN
    CREATE POLICY "Admins and creators can delete content"
    ON public.content
    FOR DELETE
    TO authenticated
    USING (
      public.has_role(auth.uid(), 'admin')
      OR public.has_role(auth.uid(), 'creator')
    );
  END IF;
END$$;

COMMIT;