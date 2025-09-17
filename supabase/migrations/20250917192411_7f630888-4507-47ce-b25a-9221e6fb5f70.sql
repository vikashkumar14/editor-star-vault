-- Assign admin role to the correct email address
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'vikashkumar13228@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Also make sure the function can handle this user
SELECT make_user_admin('vikashkumar13228@gmail.com');