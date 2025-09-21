import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Material } from '@/types/database';
import { useDebounce } from './useDebounce';

interface UseNewSearchOptions {
  category?: string;
  initialQuery?: string;
}

export const useNewSearch = (options: UseNewSearchOptions = {}) => {
  const { category, initialQuery = '' } = options;
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Debounce search query to avoid too many API calls
  const debouncedQuery = useDebounce(query, 300);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      let baseQuery = supabase
        .from('content')
        .select('*')
        .eq('status', 'published');

      // Apply category filter if specified
      if (category && category !== '') {
        baseQuery = baseQuery.eq('category', category);
      }

      const searchTerm = searchQuery.trim().toLowerCase();
      
      // Enhanced search - search across multiple text fields
      const { data, error } = await baseQuery.or(`
        title.ilike.%${searchTerm}%,
        description.ilike.%${searchTerm}%,
        category.ilike.%${searchTerm}%,
        content_type.ilike.%${searchTerm}%,
        author.ilike.%${searchTerm}%
      `.replace(/\s+/g, ''))
      .order('created_at', { ascending: false })
      .limit(20);

      if (error) {
        throw error;
      }

      setResults(data || []);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Perform search when debounced query changes
  useMemo(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearSearch,
    hasResults: results.length > 0,
    isEmpty: !query.trim()
  };
};