-- Create table to track premium purchases and access
CREATE TABLE IF NOT EXISTS public.premium_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, material_id)
);

-- Enable RLS
ALTER TABLE public.premium_purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchases
CREATE POLICY "Users can view their own purchases"
ON public.premium_purchases
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create purchases (will be created by edge function)
CREATE POLICY "Authenticated users can create purchases"
ON public.premium_purchases
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Function to check if user has premium access to a material
CREATE OR REPLACE FUNCTION public.has_premium_access(
  _user_id UUID,
  _material_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.premium_purchases
    WHERE user_id = _user_id
      AND material_id = _material_id
      AND status = 'success'
  );
$$;

-- Trigger to update updated_at
CREATE TRIGGER update_premium_purchases_updated_at
BEFORE UPDATE ON public.premium_purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();