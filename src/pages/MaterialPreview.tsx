import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Material } from '@/types/database';

const MaterialPreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchMaterial = async () => {
      try {
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .eq('id', id)
          .eq('status', 'published')
          .single();

        if (error) {
          console.error('Error fetching material:', error);
          return;
        }

        setMaterial(data);

        // Update document meta tags for social sharing
        if (data) {
          const thumbnailUrl = data.generated_thumbnail_url || data.thumbnail_url || '/placeholder.svg';
          const description = data.description || `Download ${data.title} - High quality ${data.category} material`;
          const url = window.location.origin + `/material/${data.id}`;

          // Update page title
          document.title = `${data.title} | Gyaan Repo`;

          // Update or create meta tags
          updateMetaTag('og:title', data.title);
          updateMetaTag('og:description', description);
          updateMetaTag('og:image', thumbnailUrl.startsWith('http') ? thumbnailUrl : window.location.origin + thumbnailUrl);
          updateMetaTag('og:url', url);
          updateMetaTag('og:type', 'website');
          updateMetaTag('og:site_name', 'Gyaan Repo');

          // Twitter Card tags
          updateMetaTag('twitter:card', 'summary_large_image');
          updateMetaTag('twitter:title', data.title);
          updateMetaTag('twitter:description', description);
          updateMetaTag('twitter:image', thumbnailUrl.startsWith('http') ? thumbnailUrl : window.location.origin + thumbnailUrl);

          // Additional meta tags
          updateMetaTag('description', description);
          updateMetaTag('keywords', `${data.category}, ${data.content_type}, download, free, ${data.title}`);
        }

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [id]);

  const updateMetaTag = (property: string, content: string) => {
    // Check if it's an Open Graph property
    const isOgProperty = property.startsWith('og:');
    const isTwitterProperty = property.startsWith('twitter:');
    
    let selector = '';
    if (isOgProperty) {
      selector = `meta[property="${property}"]`;
    } else if (isTwitterProperty) {
      selector = `meta[name="${property}"]`;
    } else {
      selector = `meta[name="${property}"]`;
    }

    let metaTag = document.querySelector(selector) as HTMLMetaElement;
    
    if (!metaTag) {
      metaTag = document.createElement('meta');
      if (isOgProperty) {
        metaTag.setAttribute('property', property);
      } else {
        metaTag.setAttribute('name', property);
      }
      document.head.appendChild(metaTag);
    }
    
    metaTag.setAttribute('content', content);
  };

  useEffect(() => {
    // Auto-redirect to material detail page after 2 seconds
    // This allows social media crawlers to read the meta tags first
    const timer = setTimeout(() => {
      if (material) {
        navigate(`/material/${material.id}`);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [material, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Material Not Found</h1>
          <p className="text-muted-foreground">The material you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const thumbnailUrl = material.generated_thumbnail_url || material.thumbnail_url || '/placeholder.svg';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <img 
            src={thumbnailUrl} 
            alt={material.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <h1 className="text-xl font-bold text-foreground mb-2">{material.title}</h1>
          <p className="text-muted-foreground mb-4">
            {material.description || `High quality ${material.category} material`}
          </p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {material.category}
            </span>
            {material.content_type && (
              <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                {material.content_type}
              </span>
            )}
          </div>
        </div>
        
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Redirecting to full page...</p>
        </div>
      </div>
    </div>
  );
};

export default MaterialPreview;