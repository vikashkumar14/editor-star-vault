
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
  }, [featured]);

  return { materials, loading, error };
};
