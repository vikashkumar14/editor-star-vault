import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Download, Copy } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface GalleryImage {
  id: string;
  title: string;
  prompt: string | null;
  image_url: string;
  created_at: string;
  is_featured: boolean;
}

const PublicGallery = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('status', 'published')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast({
        title: "Error",
        description: "Failed to load gallery",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

  const handleShare = async (image: GalleryImage) => {
    try {
      const shareUrl = `${window.location.origin}/gallery`;
      
      if (navigator.share) {
        await navigator.share({
          title: image.title,
          text: image.prompt || image.title,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied",
          description: "Gallery link copied to clipboard"
        });
      }

      // Track share interaction
      await supabase
        .from('gallery_interactions')
        .insert([
          {
            gallery_id: image.id,
            interaction_type: 'share',
            user_ip: await fetch('https://api.ipify.org?format=json')
              .then(res => res.json())
              .then(data => data.ip)
              .catch(() => 'unknown')
          }
        ]);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share error:', error);
      }
    }
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
        <h1 className="text-4xl font-bold mb-4">Gallery</h1>
        <p className="text-lg text-muted-foreground">
          Explore our collection of amazing images
        </p>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No images available</h3>
          <p className="text-muted-foreground">Check back later for new content!</p>
        </div>
      ) : (
        <>
          {/* Featured Images */}
          {images.some(img => img.is_featured) && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Featured</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images
                  .filter(image => image.is_featured)
                  .map((image) => (
                    <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardContent className="p-0">
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={image.image_url}
                            alt={image.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onClick={() => setSelectedImage(image)}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-yellow-500">Featured</Badge>
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="backdrop-blur-sm bg-white/90 hover:bg-white text-black"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(image);
                              }}
                            >
                              <Heart className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="backdrop-blur-sm bg-white/90 hover:bg-white text-black"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare(image);
                              }}
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="backdrop-blur-sm bg-white/90 hover:bg-white text-black"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(image);
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-3 line-clamp-2">{image.title}</h3>
                          {image.prompt && (
                            <div 
                              className="cursor-pointer hover:bg-muted/30 p-2 rounded-md transition-colors"
                              onClick={() => setSelectedImage(image)}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-primary">Prompt</span>
                                <div className="w-1 h-1 bg-primary rounded-full"></div>
                                <span className="text-xs text-muted-foreground">Click to read full</span>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {image.prompt}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* All Images */}
          <div>
            <h2 className="text-2xl font-bold mb-4">All Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-0">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={image.image_url}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onClick={() => setSelectedImage(image)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      {image.is_featured && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-yellow-500 text-xs">Featured</Badge>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="backdrop-blur-sm bg-white/90 hover:bg-white text-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(image);
                          }}
                        >
                          <Heart className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="backdrop-blur-sm bg-white/90 hover:bg-white text-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(image);
                          }}
                        >
                          <Share2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="backdrop-blur-sm bg-white/90 hover:bg-white text-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image);
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
                          onClick={() => setSelectedImage(image)}
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
              ))}
            </div>
          </div>
        </>
      )}

      {/* Enhanced Modal for selected image */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="bg-background rounded-xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col shadow-2xl border border-border/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with title and close button */}
            <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-background to-muted/10">
              <div className="flex-1 pr-4">
                <h3 className="text-2xl font-bold text-foreground mb-1">{selectedImage.title}</h3>
                <p className="text-sm text-muted-foreground">AI Generated Image</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImage(null)}
                className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
              {/* Image Container */}
              <div className="p-6 bg-gradient-to-b from-muted/5 to-background">
                <div className="relative rounded-xl overflow-hidden shadow-lg bg-muted/20">
                  <img
                    src={selectedImage.image_url}
                    alt={selectedImage.title}
                    className="w-full h-auto max-h-[55vh] object-contain mx-auto block"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
              </div>

              {/* Enhanced Prompt Section */}
              {selectedImage.prompt && (
                <div className="p-6 space-y-6">
                  <div className="bg-gradient-to-br from-muted/20 to-muted/5 rounded-xl p-6 border border-border/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-foreground">AI Prompt</h4>
                          <p className="text-sm text-muted-foreground">The prompt used to generate this image</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleCopyPrompt(selectedImage.prompt!)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 group"
                      >
                        <Copy className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Copy Prompt
                      </Button>
                    </div>
                    
                    <div className="bg-background/60 backdrop-blur-sm p-6 rounded-lg border border-border/20 shadow-inner">
                      <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap break-words font-medium">
                        "{selectedImage.prompt}"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Action buttons */}
              <div className="p-6 border-t bg-gradient-to-r from-background to-muted/5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md mx-auto">
                  <Button
                    variant="outline"
                    onClick={() => handleLike(selectedImage)}
                    className="w-full hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950 dark:hover:border-red-800 dark:hover:text-red-400 transition-colors group"
                  >
                    <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Like
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare(selectedImage)}
                    className="w-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:border-blue-800 dark:hover:text-blue-400 transition-colors group"
                  >
                    <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDownload(selectedImage)}
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
      )}
    </div>
  );
};

export default PublicGallery;