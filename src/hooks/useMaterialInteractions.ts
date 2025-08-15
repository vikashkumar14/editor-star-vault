
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MaterialInteraction {
  id: string;
  material_id: string;
  user_ip: string | null;
  interaction_type: string;
  comment_text: string | null;
  rating_value: number | null;
  created_at: string;
}

interface PublicInteraction {
  id: string;
  material_id: string;
  interaction_type: string;
  comment_text: string | null;
  rating_value: number | null;
  created_at: string;
}

interface InteractionStats {
  likes: number;
  comments: number;
  shares: number;
  averageRating: number;
  totalRatings: number;
}

export const useMaterialInteractions = (materialId: string) => {
  const [stats, setStats] = useState<InteractionStats>({
    likes: 0,
    comments: 0,
    shares: 0,
    averageRating: 0,
    totalRatings: 0,
  });
  const [comments, setComments] = useState<PublicInteraction[]>([]);
  const [userInteractions, setUserInteractions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Get user IP for tracking interactions
  const getUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting IP:', error);
      return 'unknown';
    }
  };

  // Fetch initial stats and comments
  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const { data: interactions, error } = await supabase
          .rpc('get_material_interactions_public', { material_id_input: materialId });

        if (error) {
          console.error('Error fetching interactions:', error);
          return;
        }

        // Load user's prior interactions from localStorage (privacy-preserving)
        try {
          const stored = localStorage.getItem(`material_interactions:${materialId}`);
          const userInteractionTypes = new Set<string>(stored ? JSON.parse(stored) : []);
          setUserInteractions(userInteractionTypes);
        } catch {
          setUserInteractions(new Set());
        }

        const likes = interactions?.filter(i => i.interaction_type === 'like').length || 0;
        const commentItems = interactions?.filter(i => i.interaction_type === 'comment') || [];
        const shares = interactions?.filter(i => i.interaction_type === 'share').length || 0;
        const ratings = interactions?.filter(i => i.interaction_type === 'rating') || [];
        
        const averageRating = ratings.length > 0 
          ? ratings.reduce((sum, r) => sum + (r.rating_value || 0), 0) / ratings.length 
          : 0;

        setStats({
          likes,
          comments: commentItems.length,
          shares,
          averageRating,
          totalRatings: ratings.length,
        });

        setComments(commentItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInteractions();

    // Set up real-time subscription
    const channel = supabase
      .channel(`material-interactions-${materialId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'material_interactions',
          filter: `material_id=eq.${materialId}`
        },
        (payload) => {
          console.log('Real-time interaction update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newInteraction = payload.new as MaterialInteraction;
            
            setStats(prev => {
              const updated = { ...prev };
              if (newInteraction.interaction_type === 'like') updated.likes++;
              if (newInteraction.interaction_type === 'comment') updated.comments++;
              if (newInteraction.interaction_type === 'share') updated.shares++;
              if (newInteraction.interaction_type === 'rating') {
                updated.totalRatings++;
                // Recalculate average (simplified)
                updated.averageRating = ((prev.averageRating * prev.totalRatings) + (newInteraction.rating_value || 0)) / updated.totalRatings;
              }
              return updated;
            });

            if (newInteraction.interaction_type === 'comment') {
              setComments(prev => [
                {
                  id: newInteraction.id,
                  material_id: newInteraction.material_id,
                  interaction_type: newInteraction.interaction_type,
                  comment_text: newInteraction.comment_text,
                  rating_value: newInteraction.rating_value,
                  created_at: newInteraction.created_at,
                },
                ...prev,
              ]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [materialId]);

  const addInteraction = async (type: string, data?: { comment?: string; rating?: number }) => {
    try {
      const userIP = await getUserIP();
      
      // Check if user already performed this interaction
      if (userInteractions.has(type) && type !== 'comment') {
        toast({
          title: "Already performed",
          description: `You have already ${type}d this material`,
          variant: "destructive"
        });
        return;
      }

      const interaction = {
        material_id: materialId,
        user_ip: userIP,
        interaction_type: type,
        comment_text: data?.comment || null,
        rating_value: data?.rating || null,
      };

      const { error } = await supabase
        .from('material_interactions')
        .insert([interaction]);

      if (error) {
        console.error('Error adding interaction:', error);
        toast({
          title: "Error",
          description: "Failed to add interaction",
          variant: "destructive"
        });
        return;
      }

      setUserInteractions(prev => new Set([...prev, type]));

      // Persist locally to prevent duplicate actions for anonymous users
      try {
        const key = `material_interactions:${materialId}`;
        const existing = new Set<string>(JSON.parse(localStorage.getItem(key) || '[]'));
        existing.add(type);
        localStorage.setItem(key, JSON.stringify(Array.from(existing)));
      } catch {}
      
      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to add interaction",
        variant: "destructive"
      });
    }
  };

  return {
    stats,
    comments,
    userInteractions,
    loading,
    addInteraction,
  };
};
