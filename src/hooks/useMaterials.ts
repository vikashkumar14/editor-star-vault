
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Material } from '@/types/database';

interface UseMaterialsOptions {
  featured?: boolean;
  page?: number;
  limit?: number;
  category?: string;
}

export const useMaterials = (options: UseMaterialsOptions = {}) => {
  const { featured = false, page = 1, limit = 6, category } = options;
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        
        // Build base query for coding materials only
        let query = supabase
          .from('content')
          .select('*', { count: 'exact' })
          .eq('status', 'published')
          .in('category', ['HTML', 'CSS', 'JavaScript', 'Python', 'React', 'Vue', 'Angular', 'Node.js', 'PHP', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin', 'TypeScript', 'Web Development', 'Frontend', 'Backend', 'Full Stack', 'Mobile Development', 'Game Development'])
          .order('created_at', { ascending: false });

        if (featured) {
          query = query.eq('is_featured', true);
        }

        if (category && category !== '') {
          query = query.eq('category', category);
        }

        // Add pagination
        const offset = (page - 1) * limit;
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
          console.error('Error fetching materials:', error);
          setError('Failed to load coding materials');
        } else {
          setMaterials(data || []);
          setTotalCount(count || 0);
          setTotalPages(Math.ceil((count || 0) / limit));
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load coding materials');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();

    // Set up real-time subscription for content changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'content'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newMaterial = payload.new as Material;
            if (newMaterial.status === 'published' && (!featured || newMaterial.is_featured)) {
              setMaterials(prev => [newMaterial, ...prev]);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedMaterial = payload.new as Material;
            setMaterials(prev => prev.map(material => 
              material.id === updatedMaterial.id ? updatedMaterial : material
            ));
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setMaterials(prev => prev.filter(material => material.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [featured, page, limit, category]);

  return { 
    materials, 
    loading, 
    error, 
    totalCount, 
    totalPages, 
    currentPage: page 
  };
};
