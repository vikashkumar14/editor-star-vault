
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types/database';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // Define coding-only categories
        const codingCategories: Category[] = [
          { id: '1', name: 'HTML', description: 'HTML Templates and Components', icon: null, created_at: new Date().toISOString() },
          { id: '2', name: 'CSS', description: 'CSS Animations and Styles', icon: null, created_at: new Date().toISOString() },
          { id: '3', name: 'JavaScript', description: 'JavaScript Libraries and Frameworks', icon: null, created_at: new Date().toISOString() },
          { id: '4', name: 'React', description: 'React Components and Hooks', icon: null, created_at: new Date().toISOString() },
          { id: '5', name: 'Vue', description: 'Vue.js Components and Templates', icon: null, created_at: new Date().toISOString() },
          { id: '6', name: 'Angular', description: 'Angular Components and Services', icon: null, created_at: new Date().toISOString() },
          { id: '7', name: 'Node.js', description: 'Backend Node.js Applications', icon: null, created_at: new Date().toISOString() },
          { id: '8', name: 'Python', description: 'Python Scripts and Applications', icon: null, created_at: new Date().toISOString() },
          { id: '9', name: 'Web Development', description: 'Full Stack Web Development', icon: null, created_at: new Date().toISOString() },
          { id: '10', name: 'API', description: 'REST APIs and GraphQL', icon: null, created_at: new Date().toISOString() }
        ];
        
        setCategories(codingCategories);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
