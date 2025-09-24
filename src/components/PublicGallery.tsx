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
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{image.title}</h3>
                          {image.prompt && (
                            <p className="text-sm text-muted-foreground line-clamp-3">{image.prompt}</p>
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
                      <h3 className="font-medium text-sm mb-1 line-clamp-2">{image.title}</h3>
                      {image.prompt && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{image.prompt}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Modal for selected image */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
                  {selectedImage.prompt && (
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm">{selectedImage.prompt}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyPrompt(selectedImage.prompt!)}
                        className="w-full sm:w-auto"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Prompt
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLike(selectedImage)}
                    className="flex-1 sm:flex-none"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Like
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(selectedImage)}
                    className="flex-1 sm:flex-none"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(selectedImage)}
                    className="flex-1 sm:flex-none"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedImage(null)}
                    className="flex-1 sm:flex-none"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[60vh] object-contain rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicGallery;