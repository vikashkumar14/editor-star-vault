-- Create gallery_interactions table for gallery-specific interactions
CREATE TABLE public.gallery_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id UUID NOT NULL REFERENCES public.gallery(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  user_ip TEXT,
  comment_text TEXT,
  rating_value INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can add gallery interactions" 
ON public.gallery_interactions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view gallery interactions" 
ON public.gallery_interactions 
FOR SELECT 
USING (true);