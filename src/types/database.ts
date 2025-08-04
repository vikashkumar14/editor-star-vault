
export interface Material {
  id: string;
  title: string;
  description: string;
  content_type: string;
  category: string;
  file_url: string;
  thumbnail_url: string;
  youtube_url?: string;
  downloads_count: number;
  rating: number;
  tags: string[];
  software_compatibility: string[];
  is_featured: boolean;
  author: string;
  created_at: string;
  updated_at: string;
  price?: number;
  is_premium?: boolean;
  status?: string;
  file_type?: string;
  file_size?: number;
  file_name?: string;
  html_code?: string;
  css_code?: string;
  js_code?: string;
  html_introduction?: string;
  css_introduction?: string;
  js_introduction?: string;
  generated_thumbnail_url?: string;
  thumbnail_auto_generated?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  created_at: string;
}

export interface Download {
  id: string;
  content_id: string;
  user_ip: string;
  user_agent: string;
  downloaded_at: string;
}
