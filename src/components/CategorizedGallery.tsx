import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Share2, Download, Copy, Folder, ChevronDown, ChevronUp, Facebook, Twitter, MessageCircle, Send, Search, Grid3x3, LayoutList, SortAsc, Palette } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useThumbnailGeneration } from "@/hooks/useThumbnailGeneration";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";
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
  const {
    toast
  } = useToast();
  const {
    shareOnWhatsApp,
    shareOnTelegram,
    shareOnTwitter,
    shareOnFacebook,
    copyToClipboard
  } = useThumbnailGeneration();
  const {
    t
  } = useLanguage();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<ImageCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'featured'>('newest');
  const [currentTheme, setCurrentTheme] = useState<'default' | 'ocean' | 'sunset' | 'forest'>('default');
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch categories and images in parallel
      const [categoriesResult, imagesResult] = await Promise.all([supabase.from('image_categories').select('*').order('name'), supabase.from('gallery').select('*').eq('status', 'published').order('is_featured', {
        ascending: false
      }).order('created_at', {
        ascending: false
      })]);
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
    let filtered = images.filter(img => img.category_id === categoryId);

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(img => img.title.toLowerCase().includes(searchQuery.toLowerCase()) || img.prompt?.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
      }
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return 0;
    });
    return filtered;
  };
  const uncategorizedImages = getImagesByCategory(null);
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
      const {
        error
      } = await supabase.from('gallery_interactions').insert([{
        gallery_id: image.id,
        interaction_type: 'like',
        user_ip: await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => data.ip).catch(() => 'unknown')
      }]);
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
    switch (platform) {
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
      
      // Trigger mobile vibration
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      
      // Create flower shower effect
      createFlowerShower();
      
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

  const createFlowerShower = () => {
    const flowers = ['🌸', '🌺', '🌼', '🌻', '🌷', '💐', '🏵️', '🌹'];
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
    document.body.appendChild(container);

    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const flower = document.createElement('div');
        flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
        flower.style.cssText = `
          position:absolute;
          top:-50px;
          left:${Math.random() * 100}%;
          font-size:${Math.random() * 20 + 20}px;
          animation:flowerFall ${Math.random() * 2 + 3}s linear forwards;
          opacity:1;
        `;
        container.appendChild(flower);

        setTimeout(() => flower.remove(), 5000);
      }, i * 50);
    }

    setTimeout(() => container.remove(), 6000);

    // Add keyframes if not already added
    if (!document.getElementById('flower-animation')) {
      const style = document.createElement('style');
      style.id = 'flower-animation';
      style.textContent = `
        @keyframes flowerFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  };
  const changeTheme = (theme: 'default' | 'ocean' | 'sunset' | 'forest') => {
    setCurrentTheme(theme);
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('theme-ocean', 'theme-sunset', 'theme-forest');
    if (theme !== 'default') {
      htmlElement.classList.add(`theme-${theme}`);
    }
    localStorage.setItem('gallery-theme', theme);
  };
  useEffect(() => {
    const savedTheme = localStorage.getItem('gallery-theme') as 'default' | 'ocean' | 'sunset' | 'forest';
    if (savedTheme) {
      changeTheme(savedTheme);
    }
  }, []);
  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>;
  }
  return <div className="min-h-screen w-full bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 max-w-[1920px] mx-auto">
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent animate-fade-in">
            {t('imageGallery')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            {t('browseCollection')}
          </p>
        </div>

        {/* Enhanced Controls Bar - Mobile Friendly */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          {/* Search Bar - Full Width on Mobile */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('searchImages')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary transition-all h-11" />
          </div>

          {/* Compact Controls Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Sort Options */}
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[110px] h-9 bg-card/50 backdrop-blur-sm border-border/50">
                <SortAsc className="h-3.5 w-3.5 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="newest">{t('newest')}</SelectItem>
                <SelectItem value="oldest">{t('oldest')}</SelectItem>
                <SelectItem value="featured">{t('featured')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Theme Selector */}
            <Select value={currentTheme} onValueChange={(value: any) => changeTheme(value)}>
              <SelectTrigger className="w-[110px] h-9 bg-card/50 backdrop-blur-sm border-border/50">
                <Palette className="h-3.5 w-3.5 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="ocean">Ocean</SelectItem>
                <SelectItem value="sunset">Sunset</SelectItem>
                <SelectItem value="forest">Forest</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-0.5">
              
              <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="h-8 w-8 p-0">
                <LayoutList className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Results Count */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 rounded-lg border border-primary/20 ml-auto">
              <span className="text-xs font-medium text-primary whitespace-nowrap">{images.filter(img => {
                if (!searchQuery) return true;
                return img.title.toLowerCase().includes(searchQuery.toLowerCase()) || img.prompt?.toLowerCase().includes(searchQuery.toLowerCase());
              }).length} {t('images')}</span>
            </div>
          </div>
        </div>

        {/* Category Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10 animate-fade-in">
          <Card className="text-center p-3 sm:p-4 md:p-6 bg-gradient-to-br from-primary/10 via-accent/5 to-accent/10 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            <h3 className="font-bold text-xl sm:text-2xl md:text-3xl text-primary mb-1">{images.length}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">{t('total')}</p>
          </Card>
          {categories.map(category => {
          const categoryImageCount = getImagesByCategory(category.id).length;
          return <Card key={category.id} className="text-center p-3 sm:p-4 md:p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-br from-background to-muted/30 border-border/50 hover:border-primary/30">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full shadow-md" style={{
                backgroundColor: category.color
              }} />
                  <h3 className="font-bold text-base sm:text-lg md:text-xl">{categoryImageCount}</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 font-medium">{category.name}</p>
              </Card>;
        })}
        </div>

        {/* Category Folders */}
        <div className="space-y-4 sm:space-y-6">
          {categories.map(category => {
          const categoryImages = getImagesByCategory(category.id);
          if (categoryImages.length === 0) return null;
          return <Collapsible key={category.id} open={openFolders[category.id]} onOpenChange={() => toggleFolder(category.id)} className="border-2 border-border/40 hover:border-primary/30 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-card/90 to-muted/20 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-2 sm:p-3 cursor-pointer hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent transition-all duration-300 group" style={{
                borderLeft: `4px solid ${category.color}`
              }}>
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
                      <div className="p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-background to-muted/50 border border-border/30 shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        <Folder className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{
                      color: category.color
                    }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 truncate">{category.name}</h2>
                        {category.description && <p className="text-xs sm:text-sm md:text-base text-muted-foreground truncate hidden sm:block">{category.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
                      <Badge variant="secondary" className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-semibold shadow-md" style={{
                    backgroundColor: `${category.color}20`,
                    color: category.color
                  }}>
                        {categoryImages.length}
                      </Badge>
                      {openFolders[category.id] ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />}
                    </div>
                </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-b from-muted/10 to-transparent">
                    <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4" : "flex flex-col gap-3 sm:gap-4"}>
                      {categoryImages.map(image => <ImageCard key={image.id} image={image} categoryColor={category.color} categoryName={category.name} onImageClick={setSelectedImage} onLike={handleLike} onShare={() => {
                    setSelectedImage(image);
                    setShowShareMenu(true);
                  }} onDownload={handleDownload} viewMode={viewMode} />)}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>;
        })}

          {/* Uncategorized Images */}
          {uncategorizedImages.length > 0 && <Collapsible open={openFolders['uncategorized']} onOpenChange={() => toggleFolder('uncategorized')} className="border-2 border-border/40 hover:border-primary/30 rounded-2xl overflow-hidden bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-2 sm:p-3 cursor-pointer hover:bg-gradient-to-r hover:from-muted/50 hover:to-transparent transition-all duration-300 group" style={{
              borderLeft: '4px solid #6b7280'
            }}>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-background to-muted/50 border border-border/30 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Folder className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{t('uncategorized')}</h2>
                      <p className="text-sm sm:text-base text-muted-foreground">{t('imagesWithoutCategory')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm font-semibold shadow-md">
                      {uncategorizedImages.length} images
                    </Badge>
                    {openFolders['uncategorized'] ? <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" /> : <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />}
                  </div>
              </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-3 sm:p-4 bg-gradient-to-b from-muted/10 to-transparent">
                  <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4" : "flex flex-col gap-3 sm:gap-4"}>
                    {uncategorizedImages.map(image => <ImageCard key={image.id} image={image} categoryColor="#6b7280" categoryName="Uncategorized" onImageClick={setSelectedImage} onLike={handleLike} onShare={() => {
                  setSelectedImage(image);
                  setShowShareMenu(true);
                }} onDownload={handleDownload} viewMode={viewMode} />)}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>}
        </div>

        {images.length === 0 && <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <Folder className="w-20 h-20 mx-auto mb-6 text-muted-foreground opacity-50" />
              <h3 className="text-2xl font-bold mb-3 text-foreground">No images yet</h3>
              <p className="text-lg text-muted-foreground">Check back later for new content!</p>
            </div>
          </div>}

        {/* Image Modal */}
        {selectedImage && !showShareMenu && <ImageModal image={selectedImage} categoryColor={getCategoryColor(selectedImage.category_id)} categoryName={getCategoryName(selectedImage.category_id)} onClose={() => setSelectedImage(null)} onLike={handleLike} onShare={() => setShowShareMenu(true)} onDownload={handleDownload} onCopyPrompt={handleCopyPrompt} />}

        {/* Share Menu Modal */}
        {showShareMenu && selectedImage && <ShareMenuModal image={selectedImage} onClose={() => {
        setShowShareMenu(false);
        setSelectedImage(null);
      }} onShare={handleSocialShare} />}
      </div>
    </div>;
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
  viewMode: 'grid' | 'list';
}
const ImageCard = ({
  image,
  categoryColor,
  categoryName,
  onImageClick,
  onLike,
  onShare,
  onDownload,
  viewMode
}: ImageCardProps) => {
  if (viewMode === 'list') {
    return <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border border-border/40 hover:border-primary/50 bg-card/90 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
            <div className="w-full sm:w-48 h-48 sm:h-32 flex-shrink-0 relative overflow-hidden rounded-lg bg-gradient-to-br from-muted/30 to-muted/10">
              <img src={image.image_url} alt={image.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onClick={() => onImageClick(image)} loading="lazy" />
              <Badge className="absolute top-2 left-2 text-xs px-2 py-1" style={{
              backgroundColor: categoryColor,
              color: 'white'
            }}>
                {categoryName}
              </Badge>
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-1 text-foreground">{image.title}</h3>
                {image.prompt && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{image.prompt}</p>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={e => {
                e.stopPropagation();
                onLike(image);
              }}>
                  <Heart className="w-4 h-4 mr-1" /> Like
                </Button>
                <Button size="sm" variant="outline" onClick={e => {
                e.stopPropagation();
                onShare();
              }}>
                  <Share2 className="w-4 h-4 mr-1" /> Share
                </Button>
                <Button size="sm" variant="outline" onClick={e => {
                e.stopPropagation();
                onDownload(image);
              }}>
                  <Download className="w-4 h-4 mr-1" /> Download
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>;
  }
  return <Card className="overflow-hidden hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer group border border-border/40 hover:border-primary/50 bg-card/90 backdrop-blur-sm rounded-lg sm:rounded-xl">
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
          <img src={image.image_url} alt={image.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onClick={() => onImageClick(image)} loading="lazy" />
          
          {/* Category Badge */}
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
            <Badge className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1" style={{
            backgroundColor: categoryColor,
            color: 'white'
          }}>
              {categoryName}
            </Badge>
          </div>

          {/* Featured Badge */}
          {image.is_featured && <div className="absolute top-2 right-2">
              <Badge className="bg-yellow-500 text-xs">Featured</Badge>
            </div>}

          {/* Action Buttons */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex gap-2">
            <Button size="sm" variant="secondary" className="backdrop-blur-md bg-white/95 hover:bg-white hover:scale-110 text-black h-9 w-9 p-0 shadow-lg hover:shadow-xl transition-all duration-200" onClick={e => {
            e.stopPropagation();
            onLike(image);
          }}>
              <Heart className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" className="backdrop-blur-md bg-white/95 hover:bg-white hover:scale-110 text-black h-9 w-9 p-0 shadow-lg hover:shadow-xl transition-all duration-200" onClick={e => {
            e.stopPropagation();
            onShare();
          }}>
              <Share2 className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" className="backdrop-blur-md bg-white/95 hover:bg-white hover:scale-110 text-black h-9 w-9 p-0 shadow-lg hover:shadow-xl transition-all duration-200" onClick={e => {
            e.stopPropagation();
            onDownload(image);
          }}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-3 sm:p-4 bg-gradient-to-b from-background to-muted/10">
          <h3 className="font-bold text-sm sm:text-base mb-2 line-clamp-2 text-foreground leading-tight">{image.title}</h3>
          {image.prompt && <div className="cursor-pointer hover:bg-muted/30 p-1.5 rounded transition-colors" onClick={() => onImageClick(image)}>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs font-medium text-primary">Prompt</span>
                <div className="w-0.5 h-0.5 bg-primary rounded-full"></div>
                <span className="text-xs text-muted-foreground">Tap to read</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {image.prompt}
              </p>
            </div>}
        </div>
      </CardContent>
    </Card>;
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
const ImageModal = ({
  image,
  categoryColor,
  categoryName,
  onClose,
  onLike,
  onShare,
  onDownload,
  onCopyPrompt
}: ImageModalProps) => {
  return <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4" onClick={onClose}>
      <div className="bg-background rounded-xl w-full max-w-sm sm:max-w-2xl lg:max-w-5xl h-full max-h-[98vh] sm:max-h-[95vh] overflow-hidden flex flex-col shadow-2xl border border-border/20" onClick={e => e.stopPropagation()}>
        {/* Header with category info */}
        <div className="flex justify-between items-center p-3 sm:p-6 border-b bg-gradient-to-r from-background to-muted/10">
          <div className="flex-1 pr-2 sm:pr-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge style={{
              backgroundColor: categoryColor,
              color: 'white'
            }} className="text-xs">
                {categoryName}
              </Badge>
              {image.is_featured && <Badge className="bg-yellow-500 text-xs">Featured</Badge>}
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-1 line-clamp-2">{image.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">AI Generated Image</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0 hover:bg-destructive/10 hover:text-destructive">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Image */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-6 bg-gradient-to-b from-muted/5 to-background">
            <div className="relative rounded-xl overflow-hidden shadow-lg bg-muted/20">
              <img src={image.image_url} alt={image.title} className="w-full h-auto max-h-[40vh] sm:max-h-[55vh] object-contain mx-auto block" />
            </div>
          </div>

          {/* Prompt Section */}
          {image.prompt && <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
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
                  <Button onClick={() => onCopyPrompt(image.prompt!)} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 group w-full sm:w-auto" size="sm">
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
            </div>}

          {/* Action Buttons */}
          <div className="p-3 sm:p-6 border-t bg-gradient-to-r from-background to-muted/5">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
              <Button variant="outline" onClick={() => {
              onLike(image);
              onClose();
            }} className="w-full hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950 dark:hover:border-red-800 dark:hover:text-red-400 transition-colors group">
                <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Like
              </Button>
              <Button variant="outline" onClick={onShare} className="w-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:border-blue-800 dark:hover:text-blue-400 transition-colors group">
                <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Share
              </Button>
              <Button variant="outline" onClick={() => {
              onDownload(image);
              onClose();
            }} className="w-full hover:bg-green-50 hover:border-green-200 hover:text-green-600 dark:hover:bg-green-950 dark:hover:border-green-800 dark:hover:text-green-400 transition-colors group">
                <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};

// Share Menu Modal Component
interface ShareMenuModalProps {
  image: GalleryImage;
  onClose: () => void;
  onShare: (platform: string) => void;
}
const ShareMenuModal = ({
  image,
  onClose,
  onShare
}: ShareMenuModalProps) => {
  const shareOptions = [{
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'bg-green-500 hover:bg-green-600'
  }, {
    id: 'telegram',
    name: 'Telegram',
    icon: Send,
    color: 'bg-blue-500 hover:bg-blue-600'
  }, {
    id: 'twitter',
    name: 'Twitter',
    icon: Twitter,
    color: 'bg-sky-500 hover:bg-sky-600'
  }, {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600 hover:bg-blue-700'
  }, {
    id: 'copy',
    name: 'Copy Link',
    icon: Copy,
    color: 'bg-gray-500 hover:bg-gray-600'
  }];
  return <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-border/20 animate-scale-in" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-background to-muted/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-foreground">Share Image</h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-destructive/10 hover:text-destructive">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{image.title}</p>
        </div>

        {/* Share Options Grid */}
        <div className="p-6 space-y-3">
          {shareOptions.map(option => {
          const Icon = option.icon;
          return <Button key={option.id} onClick={() => onShare(option.id)} className={`w-full ${option.color} text-white justify-start gap-3 h-14 text-base shadow-md hover:shadow-lg transition-all duration-200 group`}>
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>{option.name}</span>
              </Button>;
        })}
        </div>

        {/* Image Preview */}
        <div className="px-6 pb-6">
          <div className="relative rounded-lg overflow-hidden bg-muted/20 border border-border/40">
            <img src={image.image_url} alt={image.title} className="w-full h-32 object-cover" />
          </div>
        </div>
      </div>
    </div>;
};
export default CategorizedGallery;