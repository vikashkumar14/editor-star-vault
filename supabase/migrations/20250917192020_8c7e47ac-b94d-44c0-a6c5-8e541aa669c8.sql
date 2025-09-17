-- Create admin user and assign admin role
-- First check if user exists, if not this will need to be run after signup

-- Insert admin role for the user (this will work once user signs up)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'vikashkumar132280@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Also create a function to easily make any user admin
CREATE OR REPLACE FUNCTION make_user_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin'::app_role
  FROM auth.users
  WHERE email = user_email
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;