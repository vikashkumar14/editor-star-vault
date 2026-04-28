-- 1. Harden make_user_admin
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: only admins can promote users';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin'::app_role
  FROM auth.users
  WHERE email = user_email
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.make_user_admin(text) FROM PUBLIC, anon;

-- 2. Fix mutable search_path on remaining functions
CREATE OR REPLACE FUNCTION public.update_material_stats()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.interaction_type = 'like' THEN
      UPDATE public.content
      SET rating = COALESCE(rating, 0) + 0.1
      WHERE id = NEW.material_id;
    ELSIF NEW.interaction_type = 'rating' THEN
      UPDATE public.content
      SET rating = (
        SELECT COALESCE(AVG(rating_value), 0)
        FROM public.material_interactions
        WHERE material_id = NEW.material_id AND interaction_type = 'rating'
      )
      WHERE id = NEW.material_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.update_content_stats()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.content_stats (content_id, views_count, likes_count, comments_count, shares_count)
  VALUES (
    NEW.content_id,
    CASE WHEN NEW.interaction_type = 'view' THEN 1 ELSE 0 END,
    CASE WHEN NEW.interaction_type = 'like' THEN 1 ELSE 0 END,
    CASE WHEN NEW.interaction_type = 'comment' THEN 1 ELSE 0 END,
    CASE WHEN NEW.interaction_type = 'share' THEN 1 ELSE 0 END
  )
  ON CONFLICT (content_id)
  DO UPDATE SET
    views_count = content_stats.views_count + CASE WHEN NEW.interaction_type = 'view' THEN 1 ELSE 0 END,
    likes_count = content_stats.likes_count + CASE WHEN NEW.interaction_type = 'like' THEN 1 ELSE 0 END,
    comments_count = content_stats.comments_count + CASE WHEN NEW.interaction_type = 'comment' THEN 1 ELSE 0 END,
    shares_count = content_stats.shares_count + CASE WHEN NEW.interaction_type = 'share' THEN 1 ELSE 0 END,
    updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_download_count(content_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.content
  SET downloads_count = downloads_count + 1
  WHERE id = content_uuid;
END;
$$;

-- 3. content_interactions: require authenticated insert and matching user_id
DROP POLICY IF EXISTS "Users can create interactions" ON public.content_interactions;

CREATE POLICY "Authenticated users can create their own interactions"
ON public.content_interactions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 4. downloads: admin-only SELECT
CREATE POLICY "Admins can view downloads"
ON public.downloads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 5. Lock down thumbnails bucket writes
DROP POLICY IF EXISTS "Anyone can upload thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete thumbnails" ON storage.objects;

CREATE POLICY "Admins and creators can upload thumbnails"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'thumbnails'
  AND (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'creator'::app_role))
);

CREATE POLICY "Admins and creators can update thumbnails"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'thumbnails'
  AND (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'creator'::app_role))
)
WITH CHECK (
  bucket_id = 'thumbnails'
  AND (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'creator'::app_role))
);

CREATE POLICY "Admins and creators can delete thumbnails"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'thumbnails'
  AND (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'creator'::app_role))
);
