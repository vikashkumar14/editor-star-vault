import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Download, Copy, Folder, ChevronDown, ChevronUp, Facebook, Twitter, MessageCircle, Send } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useThumbnailGeneration } from "@/hooks/useThumbnailGeneration";

interface GalleryImage {
  id: string;
  title: string;
  prompt: string | null;
  image_url: string;
  created_at: string;
  is_featured: boolean;
  category_id: string | null;
}

interface ImageCategory {
  id: string;
  name: string;
  description: string | null;
  color: string;
}

const CategorizedGallery = () => {
  const { toast } = useToast();
  const { shareOnWhatsApp, shareOnTelegram, shareOnTwitter, shareOnFacebook, copyToClipboard } = useThumbnailGeneration();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<ImageCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories and images in parallel
      const [categoriesResult, imagesResult] = await Promise.all([
        supabase
          .from('image_categories')
          .select('*')
          .order('name'),
        supabase
          .from('gallery')
          .select('*')
          .eq('status', 'published')
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false })
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (imagesResult.error) throw imagesResult.error;

      const cats = categoriesResult.data || [];
      setCategories(cats);
      setImages(imagesResult.data || []);
      
      // Open all folders by default
      const initialOpenState: Record<string, boolean> = {};
      cats.forEach(cat => {
        initialOpenState[cat.id] = true;
      });
      initialOpenState['uncategorized'] = true;
      setOpenFolders(initialOpenState);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load gallery data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (categoryId: string) => {
    setOpenFolders(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const getImagesByCategory = (categoryId: string | null) => {
    return images.filter(img => img.category_id === categoryId);
  };

  const uncategorizedImages = images.filter(img => !img.category_id);

  const getCategoryColor = (categoryId: string | null) => {
    if (!categoryId) return '#6b7280';
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#6b7280';
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  const handleLike = async (image: GalleryImage) => {
    try {
      const { error } = await supabase
        .from('gallery_interactions')
        .insert([
          {
            gallery_id: image.id,
            interaction_type: 'like',
            user_ip: await fetch('https://api.ipify.org?format=json')
              .then(res => res.json())
              .then(data => data.ip)
              .catch(() => 'unknown')
          }
        ]);

      if (error) throw error;
      
      toast({
        title: "Liked!",
        description: "Image added to your likes"
      });
    } catch (error) {
      console.error('Error liking image:', error);
      toast({
        title: "Error",
        description: "Failed to like image",
        variant: "destructive"
      });
    }
  };

  const handleShare = (image: GalleryImage) => {
    setSelectedImage(image);
    setShowShareMenu(true);
  };

  const handleSocialShare = (platform: string) => {
    if (!selectedImage) return;
    
    const shareUrl = `${window.location.origin}/gallery`;
    const title = selectedImage.title;
    
    switch(platform) {
      case 'whatsapp':
        shareOnWhatsApp(shareUrl, title);
        break;
      case 'telegram':
        shareOnTelegram(shareUrl, title);
        break;
      case 'twitter':
        shareOnTwitter(shareUrl, title);
        break;
      case 'facebook':
        shareOnFacebook(shareUrl);
        break;
      case 'copy':
        copyToClipboard(shareUrl);
        break;
    }
    
    setShowShareMenu(false);
  };

  const handleDownload = (image: GalleryImage) => {
    const link = document.createElement('a');
    link.href = image.image_url;
    link.download = `${image.title.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard"
      });
    } catch (error) {
      console.error('Failed to copy prompt:', error);
      toast({
        title: "Error",
        description: "Failed to copy prompt",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Image Gallery
        </h1>
        <p className="text-lg text-muted-foreground">
          Browse images organized in categories
        </p>
      </div>

      {/* Category Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <Card className="text-center p-4 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <h3 className="font-semibold text-2xl text-primary">{images.length}</h3>
          <p className="text-sm text-muted-foreground">Total Images</p>
        </Card>
        {categories.map((category) => {
          const categoryImageCount = getImagesByCategory(category.id).length;
          return (
            <Card key={category.id} className="text-center p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                <h3 className="font-semibold text-lg">{categoryImageCount}</h3>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{category.name}</p>
            </Card>
          );
        })}
      </div>

      {/* Category Folders */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryImages = getImagesByCategory(category.id);
          if (categoryImages.length === 0) return null;
          
          return (
            <Collapsible
              key={category.id}
              open={openFolders[category.id]}
              onOpenChange={() => toggleFolder(category.id)}
              className="border rounded-lg overflow-hidden bg-card"
            >
              <CollapsibleTrigger asChild>
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  style={{ borderLeft: `4px solid ${category.color}` }}
                >
                  <div className="flex items-center gap-3">
                    <Folder className="w-6 h-6" style={{ color: category.color }} />
                    <div>
                      <h2 className="text-xl font-bold">{category.name}</h2>
                      {category.description && (
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{categoryImages.length} images</Badge>
                    {openFolders[category.id] ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 bg-muted/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryImages.map((image) => (
                      <ImageCard 
                        key={image.id} 
                        image={image} 
                        categoryColor={category.color}
                        categoryName={category.name}
                        onImageClick={setSelectedImage}
                        onLike={handleLike}
                        onShare={() => {
                          setSelectedImage(image);
                          setShowShareMenu(true);
                        }}
                        onDownload={handleDownload}
                      />
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}

        {/* Uncategorized Images */}
        {uncategorizedImages.length > 0 && (
          <Collapsible
            open={openFolders['uncategorized']}
            onOpenChange={() => toggleFolder('uncategorized')}
            className="border rounded-lg overflow-hidden bg-card"
          >
            <CollapsibleTrigger asChild>
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                style={{ borderLeft: '4px solid #6b7280' }}
              >
                <div className="flex items-center gap-3">
                  <Folder className="w-6 h-6 text-muted-foreground" />
                  <div>
                    <h2 className="text-xl font-bold">Uncategorized</h2>
                    <p className="text-sm text-muted-foreground">Images without a category</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{uncategorizedImages.length} images</Badge>
                  {openFolders['uncategorized'] ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 bg-muted/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {uncategorizedImages.map((image) => (
                    <ImageCard 
                      key={image.id} 
                      image={image} 
                      categoryColor="#6b7280"
                      categoryName="Uncategorized"
                      onImageClick={setSelectedImage}
                      onLike={handleLike}
                      onShare={() => {
                        setSelectedImage(image);
                        setShowShareMenu(true);
                      }}
                      onDownload={handleDownload}
                    />
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No images yet</h3>
          <p className="text-muted-foreground">Check back later for new content!</p>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && !showShareMenu && (
        <ImageModal 
          image={selectedImage}
          categoryColor={getCategoryColor(selectedImage.category_id)}
          categoryName={getCategoryName(selectedImage.category_id)}
          onClose={() => setSelectedImage(null)}
          onLike={handleLike}
          onShare={() => setShowShareMenu(true)}
          onDownload={handleDownload}
          onCopyPrompt={handleCopyPrompt}
        />
      )}

      {/* Share Menu Modal */}
      {showShareMenu && selectedImage && (
        <ShareMenuModal
          image={selectedImage}
          onClose={() => {
            setShowShareMenu(false);
            setSelectedImage(null);
          }}
          onShare={handleSocialShare}
        />
      )}
    </div>
  );
};

// Separate ImageCard component
interface ImageCardProps {
  image: GalleryImage;
  categoryColor: string;
  categoryName: string;
  onImageClick: (image: GalleryImage) => void;
  onLike: (image: GalleryImage) => void;
  onShare: () => void;
  onDownload: (image: GalleryImage) => void;
}

const ImageCard = ({ image, categoryColor, categoryName, onImageClick, onLike, onShare, onDownload }: ImageCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={image.image_url}
            alt={image.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onClick={() => onImageClick(image)}
          />
          
          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <Badge 
              className="text-xs"
              style={{ 
                backgroundColor: categoryColor,
                color: 'white'
              }}
            >
              {categoryName}
            </Badge>
          </div>

          {/* Featured Badge */}
          {image.is_featured && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-yellow-500 text-xs">Featured</Badge>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              className="backdrop-blur-sm bg-white/90 hover:bg-white text-black h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onLike(image);
              }}
            >
              <Heart className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="backdrop-blur-sm bg-white/90 hover:bg-white text-black h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
            >
              <Share2 className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="backdrop-blur-sm bg-white/90 hover:bg-white text-black h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(image);
              }}
            >
              <Download className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-medium text-sm mb-2 line-clamp-2">{image.title}</h3>
          {image.prompt && (
            <div 
              className="cursor-pointer hover:bg-muted/30 p-1.5 rounded transition-colors"
              onClick={() => onImageClick(image)}
            >
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs font-medium text-primary">Prompt</span>
                <div className="w-0.5 h-0.5 bg-primary rounded-full"></div>
                <span className="text-xs text-muted-foreground">Tap to read</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {image.prompt}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Separate ImageModal component
interface ImageModalProps {
  image: GalleryImage;
  categoryColor: string;
  categoryName: string;
  onClose: () => void;
  onLike: (image: GalleryImage) => void;
  onShare: () => void;
  onDownload: (image: GalleryImage) => void;
  onCopyPrompt: (prompt: string) => void;
}

const ImageModal = ({ image, categoryColor, categoryName, onClose, onLike, onShare, onDownload, onCopyPrompt }: ImageModalProps) => {
  return (
    <div 
      className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-background rounded-xl w-full max-w-sm sm:max-w-2xl lg:max-w-5xl h-full max-h-[98vh] sm:max-h-[95vh] overflow-hidden flex flex-col shadow-2xl border border-border/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with category info */}
        <div className="flex justify-between items-center p-3 sm:p-6 border-b bg-gradient-to-r from-background to-muted/10">
          <div className="flex-1 pr-2 sm:pr-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                style={{ 
                  backgroundColor: categoryColor,
                  color: 'white'
                }}
                className="text-xs"
              >
                {categoryName}
              </Badge>
              {image.is_featured && (
                <Badge className="bg-yellow-500 text-xs">Featured</Badge>
              )}
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-1 line-clamp-2">{image.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">AI Generated Image</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Image */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-6 bg-gradient-to-b from-muted/5 to-background">
            <div className="relative rounded-xl overflow-hidden shadow-lg bg-muted/20">
              <img
                src={image.image_url}
                alt={image.title}
                className="w-full h-auto max-h-[40vh] sm:max-h-[55vh] object-contain mx-auto block"
              />
            </div>
          </div>

          {/* Prompt Section */}
          {image.prompt && (
            <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-muted/20 to-muted/5 rounded-xl p-3 sm:p-6 border border-border/40">
                <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold text-foreground">AI Prompt</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">The prompt used to generate this image</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => onCopyPrompt(image.prompt!)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 group w-full sm:w-auto"
                    size="sm"
                  >
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 group-hover:scale-110 transition-transform" />
                    Copy Prompt
                  </Button>
                </div>
                
                <div className="bg-background/60 backdrop-blur-sm p-3 sm:p-6 rounded-lg border border-border/20 shadow-inner">
                  <p className="text-sm sm:text-base leading-relaxed text-foreground whitespace-pre-wrap break-words font-medium">
                    "{image.prompt}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-3 sm:p-6 border-t bg-gradient-to-r from-background to-muted/5">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
              <Button
                variant="outline"
                onClick={() => {
                  onLike(image);
                  onClose();
                }}
                className="w-full hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950 dark:hover:border-red-800 dark:hover:text-red-400 transition-colors group"
              >
                <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Like
              </Button>
              <Button
                variant="outline"
                onClick={onShare}
                className="w-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:border-blue-800 dark:hover:text-blue-400 transition-colors group"
              >
                <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onDownload(image);
                  onClose();
                }}
                className="w-full hover:bg-green-50 hover:border-green-200 hover:text-green-600 dark:hover:bg-green-950 dark:hover:border-green-800 dark:hover:text-green-400 transition-colors group"
              >
                <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Share Menu Modal Component
interface ShareMenuModalProps {
  image: GalleryImage;
  onClose: () => void;
  onShare: (platform: string) => void;
}

const ShareMenuModal = ({ image, onClose, onShare }: ShareMenuModalProps) => {
  const shareOptions = [
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500 hover:bg-green-600' },
    { id: 'telegram', name: 'Telegram', icon: Send, color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-sky-500 hover:bg-sky-600' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'copy', name: 'Copy Link', icon: Copy, color: 'bg-gray-500 hover:bg-gray-600' },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-background rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-border/20 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-background to-muted/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-foreground">Share Image</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{image.title}</p>
        </div>

        {/* Share Options Grid */}
        <div className="p-6 space-y-3">
          {shareOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.id}
                onClick={() => onShare(option.id)}
                className={`w-full ${option.color} text-white justify-start gap-3 h-14 text-base shadow-md hover:shadow-lg transition-all duration-200 group`}
              >
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>{option.name}</span>
              </Button>
            );
          })}
        </div>

        {/* Image Preview */}
        <div className="px-6 pb-6">
          <div className="relative rounded-lg overflow-hidden bg-muted/20 border border-border/40">
            <img
              src={image.image_url}
              alt={image.title}
              className="w-full h-32 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorizedGallery;
