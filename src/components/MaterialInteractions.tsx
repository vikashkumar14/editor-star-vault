
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageCircle, Share2, Star } from 'lucide-react';
import { useMaterialInteractions } from '@/hooks/useMaterialInteractions';

interface MaterialInteractionsProps {
  materialId: string;
}

const MaterialInteractions = ({ materialId }: MaterialInteractionsProps) => {
  const { stats, comments, userInteractions, loading, addInteraction } = useMaterialInteractions(materialId);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const handleLike = () => {
    addInteraction('like');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Check out this editing material',
        url: window.location.href,
      });
      addInteraction('share');
    } catch (error) {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      addInteraction('share');
    }
  };

  const handleComment = () => {
    if (newComment.trim()) {
      addInteraction('comment', { comment: newComment });
      setNewComment('');
    }
  };

  const handleRating = () => {
    if (selectedRating > 0) {
      addInteraction('rating', { rating: selectedRating });
      setShowRating(false);
      setSelectedRating(0);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading interactions...</div>;
  }

  return (
    <div className="space-y-3">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant={userInteractions.has('like') ? 'default' : 'outline'}
            size="sm"
            onClick={handleLike}
            className="flex items-center space-x-1"
          >
            <Heart className={`w-4 h-4 ${userInteractions.has('like') ? 'fill-current' : ''}`} />
            <span>{stats.likes}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{stats.comments}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center space-x-1"
          >
            <Share2 className="w-4 h-4" />
            <span>{stats.shares}</span>
          </Button>

          <Button
            variant={showRating ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowRating(!showRating)}
            className="flex items-center space-x-1"
          >
            <Star className="w-4 h-4" />
            <span>{stats.averageRating.toFixed(1)}</span>
          </Button>
        </div>

        {stats.totalRatings > 0 && (
          <Badge variant="secondary" className="text-xs">
            {stats.totalRatings} ratings
          </Badge>
        )}
      </div>

      {/* Rating Section */}
      {showRating && !userInteractions.has('rating') && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <p className="text-sm font-medium">Rate this material:</p>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(rating)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        rating <= selectedRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Button size="sm" onClick={handleRating} disabled={selectedRating === 0}>
                Submit Rating
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      {showComments && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                />
                <Button size="sm" onClick={handleComment}>
                  Post
                </Button>
              </div>

              {comments.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {comments.slice(0, 5).map((comment) => (
                    <div key={comment.id} className="text-sm bg-gray-50 p-2 rounded">
                      <p>{comment.comment_text}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {comments.length > 5 && (
                    <p className="text-xs text-gray-500">
                      +{comments.length - 5} more comments
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MaterialInteractions;
