-- First, let's check if we have any users at all
-- This query will help you assign admin role to an existing user

-- To fix admin login issue, you need to:
-- 1. First sign up a user account (use /login page and create account)
-- 2. Then run this query with your user's email to make them admin:

-- Example: Replace 'your-email@example.com' with actual admin email
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin'::app_role 
-- FROM auth.users 
-- WHERE email = 'your-email@example.com'
-- ON CONFLICT (user_id, role) DO NOTHING;

-- For now, let's just ensure the user_roles table is properly set up
-- and add a helpful comment about the next steps