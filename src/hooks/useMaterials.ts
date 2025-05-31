
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Material } from '@/types/database';

export const useMaterials = (featured = false) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('content')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (featured) {
          query = query.eq('is_featured', true);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching materials:', error);
          setError('Failed to load materials');
        } else {
          setMaterials(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load materials');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [featured]);

  return { materials, loading, error };
};
