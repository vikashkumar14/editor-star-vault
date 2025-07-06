
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
    <div className="space-y-4 p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-2xl border border-purple-100 dark:border-purple-800/30">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4">
          <Button
            variant={userInteractions.has('like') ? 'default' : 'outline'}
            size="sm"
            onClick={handleLike}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Heart className={`w-4 h-4 ${userInteractions.has('like') ? 'fill-current' : ''}`} />
            <span className="hidden xs:inline">{stats.likes}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center justify-center gap-2 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden xs:inline">{stats.comments}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center justify-center gap-2 border-green-200 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all duration-300"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden xs:inline">{stats.shares}</span>
          </Button>

          <Button
            variant={showRating ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowRating(!showRating)}
            className="flex items-center justify-center gap-2 border-yellow-200 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 transition-all duration-300"
          >
            <Star className="w-4 h-4" />
            <span className="hidden xs:inline">{stats.averageRating.toFixed(1)}</span>
          </Button>
        </div>

        {stats.totalRatings > 0 && (
          <Badge variant="secondary" className="text-xs bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-800/50 dark:to-blue-800/50 text-purple-700 dark:text-purple-300 border-0 px-3 py-1">
            {stats.totalRatings} ratings
          </Badge>
        )}
      </div>

      {/* Rating Section */}
      {showRating && !userInteractions.has('rating') && (
        <Card className="border-2 border-yellow-200 dark:border-yellow-700/50 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">Rate this material:</p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(rating)}
                    className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-all duration-200 hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                        rating <= selectedRating
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Button 
                size="sm" 
                onClick={handleRating} 
                disabled={selectedRating === 0}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                Submit Rating ({selectedRating} star{selectedRating !== 1 ? 's' : ''})
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      {showComments && (
        <Card className="border-2 border-blue-200 dark:border-blue-700/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                  className="flex-1 bg-white/70 dark:bg-slate-800/70 border-blue-200 dark:border-blue-700/50 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button 
                  size="sm" 
                  onClick={handleComment}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold px-6 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Post
                </Button>
              </div>

              {comments.length > 0 && (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {comments.slice(0, 5).map((comment) => (
                    <div key={comment.id} className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 shadow-sm">
                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{comment.comment_text}</p>
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-2 block">
                        {new Date(comment.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  ))}
                  {comments.length > 5 && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium text-center py-2">
                      +{comments.length - 5} more comments
                    </p>
                  )}
                </div>
              )}
              
              {comments.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-blue-300" />
                  <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
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
