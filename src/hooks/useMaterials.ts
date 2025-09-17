
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Material } from '@/types/database';

interface UseMaterialsOptions {
  featured?: boolean;
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export const useMaterials = (options: UseMaterialsOptions = {}) => {
  const { featured = false, page = 1, limit = 6, category, search } = options;
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const fetchMaterials = useCallback(async (retryAttempt = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build base query - start with all published content, then apply filters
      let query = supabase
        .from('content')
        .select('*', { count: 'exact' })
        .eq('status', 'published');

      // Apply featured filter
      if (featured) {
        query = query.eq('is_featured', true);
      }

      // Apply category filter
      if (category && category !== '') {
        query = query.eq('category', category);
      }

      // Apply search filter (enhanced comprehensive search across all relevant fields)
      if (search && search.trim()) {
        const searchTerm = search.trim().toLowerCase();
        // Enhanced search across all searchable fields including software compatibility
        query = query.or(`
          title.ilike.%${searchTerm}%,
          description.ilike.%${searchTerm}%,
          category.ilike.%${searchTerm}%,
          content_type.ilike.%${searchTerm}%,
          file_type.ilike.%${searchTerm}%,
          author.ilike.%${searchTerm}%,
          tags.cs.{${searchTerm}},
          software_compatibility.cs.{${searchTerm}},
          html_introduction.ilike.%${searchTerm}%,
          css_introduction.ilike.%${searchTerm}%,
          js_introduction.ilike.%${searchTerm}%
        `.replace(/\s+/g, ''));
      }

      // Apply ordering and pagination
      query = query.order('created_at', { ascending: false });
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }
      
      setMaterials(data || []);
      setTotalCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / limit));
      setRetryCount(0); // Reset retry count on success
      
    } catch (err: any) {
      console.error('Error fetching materials:', err);
      
      // Implement retry logic for network failures
      if (retryAttempt < 3 && (err.message?.includes('timeout') || err.message?.includes('network') || err.code === '57014')) {
        console.log(`Retrying fetch materials (attempt ${retryAttempt + 1})`);
        setTimeout(() => {
          fetchMaterials(retryAttempt + 1);
        }, 1000 * (retryAttempt + 1)); // Exponential backoff
        return;
      }
      
      setError(err.message || 'Failed to load materials');
      setMaterials([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [featured, page, limit, category, search]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // Retry function for manual retry
  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    fetchMaterials();
  }, [fetchMaterials]);

  useEffect(() => {
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
  }, [featured, page, limit, category, search]);

  return { 
    materials, 
    loading, 
    error, 
    totalCount, 
    totalPages, 
    currentPage: page,
    retry
  };
};
