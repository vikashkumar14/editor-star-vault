-- Create table for image categories/folders
CREATE TABLE public.image_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  color text DEFAULT '#3b82f6',
  style_config jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.image_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins and creators can manage categories" 
ON public.image_categories 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'creator'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'creator'::app_role));

CREATE POLICY "Everyone can view categories" 
ON public.image_categories 
FOR SELECT 
USING (true);

-- Add category_id to gallery table
ALTER TABLE public.gallery 
ADD COLUMN category_id uuid REFERENCES public.image_categories(id);

-- Create index for better performance
CREATE INDEX idx_gallery_category ON public.gallery(category_id);

-- Update timestamp trigger
CREATE TRIGGER update_image_categories_updated_at
BEFORE UPDATE ON public.image_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();