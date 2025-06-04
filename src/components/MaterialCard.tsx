
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, Star, Play, CreditCard, Info, FileText } from "lucide-react";
import { Material } from "@/types/database";
import { useNavigate } from "react-router-dom";

interface MaterialCardProps {
  material: Material;
}

const MaterialCard = ({ material }: MaterialCardProps) => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);

  const handleViewDetails = () => {
    navigate(`/material/${material.id}`);
  };

  const handlePreview = () => {
    if (material.youtube_url) {
      window.open(material.youtube_url, '_blank');
    }
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

  // Truncate description to show very short version
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

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-hover overflow-hidden bg-white dark:bg-slate-800">
      <div 
        className="h-48 bg-cover bg-center relative group cursor-pointer"
        style={{ 
          backgroundImage: `url(${material.thumbnail_url})`,
          backgroundColor: '#f3f4f6'
        }}
        onMouseEnter={() => isPDF && setShowPreview(true)}
        onMouseLeave={() => isPDF && setShowPreview(false)}
        onClick={isPDF ? () => setShowPreview(!showPreview) : undefined}
      >
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

        {/* YouTube Preview */}
        {material.youtube_url && !isPDF && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer hover:bg-black/30 transition-colors"
            onClick={handlePreview}
          >
            <Play className="w-12 h-12 text-white/80 hover:text-white transition-colors" />
          </div>
        )}

        {/* PDF Icon for PDF files */}
        {isPDF && !showPreview && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors">
            <FileText className="w-12 h-12 text-white/80 hover:text-white transition-colors" />
            <span className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
              Click to Preview
            </span>
          </div>
        )}

        <div className="absolute top-4 right-4">
          {isPremium ? (
            <Badge className="bg-yellow-500 text-white border-0">
              Premium ₹{price}
            </Badge>
          ) : (
            <Badge className="bg-green-500 text-white border-0">
              Free
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{material.title}</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              {truncateDescription(material.description || '', 50)}
            </CardDescription>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Download className="w-4 h-4" />
            <span>{material.downloads_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{material.rating}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {material.software_compatibility?.slice(0, 2).map((software, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {getSoftwareDisplayName(software)}
            </Badge>
          ))}
          {material.software_compatibility && material.software_compatibility.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{material.software_compatibility.length - 2} more
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1">
          {material.tags?.slice(0, 2).map((tag, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {material.tags && material.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{material.tags.length - 2}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
            onClick={handleViewDetails}
          >
            <Info className="w-4 h-4 mr-2" />
            View Details
          </Button>
          {material.youtube_url && (
            <Button variant="outline" size="icon" onClick={handlePreview}>
              <Eye className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialCard;
