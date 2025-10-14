
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Star, Play, Info, FileText, Code, Heart } from "lucide-react";
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
    // For code materials, show live preview
    if (hasCodeContent) {
      const previewWindow = window.open('', '_blank', 'width=800,height=600');
      if (previewWindow) {
        previewWindow.document.write(generateCodePreview());
      }
    } 
    // For PDF materials, open PDF in new tab
    else if (isPDF && material.file_url) {
      window.open(material.file_url, '_blank');
    }
    // For video materials, show YouTube preview
    else if (material.youtube_url) {
      window.open(material.youtube_url, '_blank');
    }
    // Default fallback
    else {
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

  const getSoftwareDisplayName = (software: string) => {
    const names: { [key: string]: string } = {
      'premiere_pro': 'Premiere Pro',
      'after_effects': 'After Effects',
      'davinci_resolve': 'DaVinci Resolve',
      'final_cut_pro': 'Final Cut Pro',
      'photoshop': 'Photoshop'
    };
    return names[software] || software;
  };

  const truncateDescription = (text: string, maxLength: number = 60) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const price = material.price || 0;
  const isPremium = material.is_premium || price > 0;

  // Check if material is PDF
  const isPDF = material.file_type?.toLowerCase() === 'pdf' || 
               material.file_url?.toLowerCase().includes('.pdf') ||
               material.content_type?.toLowerCase().includes('pdf');

  // Check if material has code content
  const hasCodeContent = material.html_code || material.css_code || material.js_code;

  // Generate code preview with enhanced support for all HTML structures
  const generateCodePreview = () => {
    if (!hasCodeContent) return '';
    
    // Clean and normalize the HTML code
    const cleanHTML = (material.html_code || '')
      .replace(/class=/g, 'class=') // Ensure proper class attribute
      .trim();
    
    const combinedCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Preview</title>
  
  <!-- Common Libraries CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/anime.js/3.2.1/anime.min.js"></script>
  
  <style>
    /* Reset and base styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html, body {
      width: 100%;
      height: 100%;
      overflow: auto;
      font-family: Arial, Helvetica, sans-serif;
    }
    
    body {
      margin: 0;
      padding: 0;
    }
    
    /* User custom CSS */
    ${material.css_code || ''}
  </style>
</head>
<body>
  ${cleanHTML}
  
  <script>
    // Wait for libraries to load
    window.addEventListener('load', function() {
      try {
        // Wrap user code in IIFE to avoid global scope pollution
        (function() {
          ${material.js_code || ''}
        })();
      } catch (error) {
        console.error('Preview JavaScript error:', error);
        document.body.innerHTML += '<div style="position:fixed;top:10px;right:10px;background:red;color:white;padding:10px;border-radius:5px;z-index:9999;">JS Error: ' + error.message + '</div>';
      }
    });
  </script>
</body>
</html>`;
    
    return combinedCode;
  };

  // Check if live preview is available
  const hasLivePreview = hasCodeContent || isPDF || material.youtube_url;

  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden bg-gray-50 dark:bg-slate-800 group hover:-translate-y-1 rounded-lg">
      <div 
        className="h-48 bg-cover bg-center relative group cursor-pointer"
        style={{ 
          backgroundImage: `url(${material.thumbnail_url})`,
          backgroundColor: '#f3f4f6'
        }}
        onMouseEnter={() => (isPDF || hasCodeContent) && setShowPreview(true)}
        onMouseLeave={() => (isPDF || hasCodeContent) && setShowPreview(false)}
        onClick={(isPDF || hasCodeContent) ? () => setShowPreview(!showPreview) : undefined}
      >
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 left-2 z-10 p-2 rounded-full ${
            isFavorited 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-white/80 hover:bg-white text-gray-600'
          } transition-all duration-200`}
          onClick={(e) => {
            e.stopPropagation();
            handleFavorite();
          }}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </Button>

        {/* PDF Preview Overlay */}
        {isPDF && showPreview && material.file_url && (
          <div className="absolute inset-0 bg-white z-10 overflow-hidden">
            <iframe
              src={`${material.file_url}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-0"
              title="PDF Preview"
            />
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              PDF Preview
            </div>
          </div>
        )}

        {hasCodeContent && showPreview && (
          <div className="absolute inset-0 bg-white z-10 overflow-hidden">
            <iframe
              srcDoc={generateCodePreview()}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              title="Code Preview"
            />
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
              Code Preview
            </div>
          </div>
        )}

        {material.youtube_url && !isPDF && !hasCodeContent && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer hover:bg-black/30 transition-colors"
            onClick={handlePreview}
          >
            <Play className="w-12 h-12 text-white/80 hover:text-white transition-colors" />
          </div>
        )}

        {isPDF && !showPreview && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors">
            <FileText className="w-12 h-12 text-white/80 hover:text-white transition-colors" />
            <span className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
              Hover to Preview
            </span>
          </div>
        )}

        {hasCodeContent && !showPreview && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors">
            <Code className="w-12 h-12 text-white/80 hover:text-white transition-colors" />
            <span className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
              Hover to Preview
            </span>
          </div>
        )}

        <div className="absolute top-4 right-4">
          {isPremium ? (
            <Badge className="bg-yellow-500 text-white border-0 shadow-lg">
              Premium ₹{price}
            </Badge>
          ) : (
            <Badge className="bg-green-500 text-white border-0 shadow-lg">
              Free
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors duration-200">
              {material.title}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
              {material.description ? 
                (material.description.length > 100 ? 
                  material.description.substring(0, 100) + '...' : 
                  material.description) : 
                'No description available'}
            </CardDescription>
          </div>
        </div>
        
        {/* Meta Information */}
        <div className="space-y-3 mt-3">
          {/* Language/Category */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Language:</span>
            <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              {material.category || material.content_type}
            </Badge>
          </div>
          
          {/* Level */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Level:</span>
            <Badge variant="outline" className="text-xs">
              {material.tags?.find(tag => ['beginner', 'intermediate', 'advanced'].includes(tag.toLowerCase())) || 'Intermediate'}
            </Badge>
          </div>
          
          {/* Format */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Format:</span>
            <Badge variant="outline" className="text-xs">
              {material.file_type?.toUpperCase() || 'Code'}
            </Badge>
          </div>
          
          {/* Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{material.downloads_count?.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{material.rating || 0}</span>
            </div>
          </div>
          
          {/* Tags */}
          {material.tags && material.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {material.tags.slice(0, 3).map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {material.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{material.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button 
            className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={handleViewDetails}
          >
            <Info className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">Download</span>
          </Button>
          
          <div className="flex-shrink-0">
            <SocialShare 
              materialId={material.id}
              title={material.title}
              fileUrl={material.file_url}
              fileName={material.file_name}
              fileType={material.file_type}
            />
          </div>
          
          {hasLivePreview && (
            <Button 
              variant="outline" 
              onClick={handleLivePreview}
              className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
            >
              <Eye className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Preview</span>
              <span className="sm:hidden">View</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialCard;
