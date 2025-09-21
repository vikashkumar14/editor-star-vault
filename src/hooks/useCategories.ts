
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
        
        // Fetch actual categories from database and combine with coding categories
        const { data: dbCategories, error: dbError } = await supabase
          .from('content')
          .select('category')
          .not('category', 'is', null)
          .neq('category', '');

        if (dbError && dbError.code !== 'PGRST116') {
          console.error('Error fetching categories:', dbError);
        }

        // Get unique categories from database
        const uniqueDbCategories = dbCategories 
          ? [...new Set(dbCategories.map(item => item.category).filter(Boolean))]
          : [];

        // Combine database categories with coding categories
        const allCategories: Category[] = [
          // Coding categories
          { id: 'html', name: 'HTML', description: 'HTML Templates and Components', icon: null, created_at: new Date().toISOString() },
          { id: 'css', name: 'CSS', description: 'CSS Animations and Styles', icon: null, created_at: new Date().toISOString() },
          { id: 'javascript', name: 'JavaScript', description: 'JavaScript Libraries and Frameworks', icon: null, created_at: new Date().toISOString() },
          { id: 'react', name: 'React', description: 'React Components and Hooks', icon: null, created_at: new Date().toISOString() },
          { id: 'vue', name: 'Vue', description: 'Vue.js Components and Templates', icon: null, created_at: new Date().toISOString() },
          { id: 'angular', name: 'Angular', description: 'Angular Components and Services', icon: null, created_at: new Date().toISOString() },
          { id: 'nodejs', name: 'Node.js', description: 'Backend Node.js Applications', icon: null, created_at: new Date().toISOString() },
          { id: 'python', name: 'Python', description: 'Python Scripts and Applications', icon: null, created_at: new Date().toISOString() },
          { id: 'webdev', name: 'Web Development', description: 'Full Stack Web Development', icon: null, created_at: new Date().toISOString() },
          { id: 'api', name: 'API', description: 'REST APIs and GraphQL', icon: null, created_at: new Date().toISOString() },
          // Database categories  
          ...uniqueDbCategories.map((cat, index) => ({
            id: `db-${index}`,
            name: cat,
            description: `${cat} materials`,
            icon: null,
            created_at: new Date().toISOString()
          }))
        ];
        
        setCategories(allCategories);
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
