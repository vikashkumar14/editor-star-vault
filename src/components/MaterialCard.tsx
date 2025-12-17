import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Star, Play, Info, FileText, Code, Heart, Download } from "lucide-react";
import { Material } from "@/types/database";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SocialShare from "./SocialShare";

interface MaterialCardProps {
  material: Material;
}

const MaterialCard = ({ material }: MaterialCardProps) => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [isFavorited, setIsFavorited] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(material.id);
  });

  const handleViewDetails = () => {
    navigate(`/material/${material.id}`);
  };

  const handlePreview = () => {
    if (material.youtube_url) {
      window.open(material.youtube_url, '_blank');
    }
  };

  const handleLivePreview = () => {
    if (hasCodeContent) {
      const previewWindow = window.open('', '_blank', 'width=800,height=600');
      if (previewWindow) {
        previewWindow.document.write(generateCodePreview());
      }
    } else if (isPDF && material.file_url) {
      window.open(material.file_url, '_blank');
    } else if (material.youtube_url) {
      window.open(material.youtube_url, '_blank');
    } else {
      toast.info('Live preview not available for this material type');
    }
  };

  const handleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let updatedFavorites;
    
    if (isFavorited) {
      updatedFavorites = favorites.filter((id: string) => id !== material.id);
      toast.success('Removed from favorites');
    } else {
      updatedFavorites = [...favorites, material.id];
      toast.success('Added to favorites');
    }
    
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsFavorited(!isFavorited);
  };

  const truncateDescription = (text: string, maxLength: number = 80) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const price = material.price || 0;
  const isPremium = material.is_premium || price > 0;
  const isPDF = material.file_type?.toLowerCase() === 'pdf' || 
               material.file_url?.toLowerCase().includes('.pdf') ||
               material.content_type?.toLowerCase().includes('pdf');
  const hasCodeContent = material.html_code || material.css_code || material.js_code;

  const generateCodePreview = () => {
    if (!hasCodeContent) return '';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Preview</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: auto; font-family: Arial, sans-serif; }
    ${material.css_code || ''}
  </style>
</head>
<body>
  ${(material.html_code || '').trim()}
  <script>
    window.addEventListener('load', function() {
      try {
        (function() { ${material.js_code || ''} })();
      } catch (error) {
        console.error('Preview error:', error);
      }
    });
  </script>
</body>
</html>`;
  };

  const hasLivePreview = hasCodeContent || isPDF || material.youtube_url;

  return (
    <Card className="group relative glass-card border-border/50 hover:border-primary/30 rounded-2xl overflow-hidden card-3d glow-border transition-all duration-500">
      {/* Image/Preview Section */}
      <div 
        className="relative h-48 bg-gradient-to-br from-muted to-muted/50 overflow-hidden cursor-pointer"
        onMouseEnter={() => (isPDF || hasCodeContent) && setShowPreview(true)}
        onMouseLeave={() => (isPDF || hasCodeContent) && setShowPreview(false)}
        onClick={(isPDF || hasCodeContent) ? () => setShowPreview(!showPreview) : undefined}
      >
        {/* Background Image */}
        {material.thumbnail_url && (
          <img 
            src={material.thumbnail_url} 
            alt={material.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-3 left-3 z-20 p-2 rounded-full glass transition-all duration-300
            ${isFavorited 
              ? 'bg-red-500/90 hover:bg-red-600/90 text-white' 
              : 'bg-background/50 hover:bg-background/70 text-foreground'
            }`}
          onClick={(e) => {
            e.stopPropagation();
            handleFavorite();
          }}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </Button>

        {/* Preview Overlays */}
        {isPDF && showPreview && material.file_url && (
          <div className="absolute inset-0 bg-background z-10 overflow-hidden">
            <iframe
              src={`${material.file_url}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-0"
              title="PDF Preview"
            />
          </div>
        )}

        {hasCodeContent && showPreview && (
          <div className="absolute inset-0 bg-background z-10 overflow-hidden">
            <iframe
              srcDoc={generateCodePreview()}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              title="Code Preview"
            />
          </div>
        )}

        {/* Type Indicators */}
        {material.youtube_url && !isPDF && !hasCodeContent && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-background/30 cursor-pointer hover:bg-background/40 transition-colors z-10"
            onClick={handlePreview}
          >
            <Play className="w-14 h-14 text-primary-foreground drop-shadow-lg" />
          </div>
        )}

        {(isPDF || hasCodeContent) && !showPreview && (
          <div className="absolute inset-0 flex items-center justify-center">
            {isPDF ? (
              <FileText className="w-12 h-12 text-primary/80" />
            ) : (
              <Code className="w-12 h-12 text-accent/80" />
            )}
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-3 right-3 z-20">
          {isPremium ? (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg font-bold">
              ₹{price}
            </Badge>
          ) : (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg font-bold">
              Free
            </Badge>
          )}
        </div>

        {/* Type badge */}
        {(isPDF || hasCodeContent) && (
          <Badge 
            className={`absolute bottom-3 left-3 z-20 ${
              isPDF ? 'bg-red-500/90' : 'bg-accent/90'
            } text-white border-0 text-xs font-medium`}
          >
            {isPDF ? 'PDF' : 'Code'} • Hover to preview
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {material.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {truncateDescription(material.description || 'No description available', 80)}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Meta Info */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
            {material.category || material.content_type}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {material.file_type?.toUpperCase() || 'Code'}
          </Badge>
        </div>
        
        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{material.downloads_count?.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{material.rating || '4.5'}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {material.tags && material.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {material.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold rounded-xl btn-3d"
            onClick={handleViewDetails}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          
          <SocialShare 
            materialId={material.id}
            title={material.title}
            fileUrl={material.file_url}
            fileName={material.file_name}
            fileType={material.file_type}
          />
          
          {hasLivePreview && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleLivePreview}
              className="rounded-xl border-border/50 hover:border-primary/50 hover:bg-primary/5"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialCard;
