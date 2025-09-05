-- Make vikashkumar132280@gmail.com an admin after they sign up
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email = 'vikashkumar132280@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;