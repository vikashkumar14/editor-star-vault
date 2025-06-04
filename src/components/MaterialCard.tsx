
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, Star, Play, CreditCard } from "lucide-react";
import { Material } from "@/types/database";
import { handleMaterialDownload } from "@/utils/download";
import PaymentModal from "./PaymentModal";
import MaterialInteractions from "./MaterialInteractions";

interface MaterialCardProps {
  material: Material;
}

const MaterialCard = ({ material }: MaterialCardProps) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleDownload = () => {
    const fileName = `${material.title.replace(/\s+/g, '-').toLowerCase()}.zip`;
    handleMaterialDownload(material.id, material.file_url, fileName);
  };

  const handlePremiumDownload = () => {
    setShowPaymentModal(true);
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

  // Truncate description to show shorter version
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const price = material.price || 0;
  const isPremium = material.is_premium || price > 0;

  return (
    <>
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-hover overflow-hidden bg-white dark:bg-slate-800">
        <div 
          className="h-48 bg-cover bg-center relative"
          style={{ 
            backgroundImage: `url(${material.thumbnail_url})`,
            backgroundColor: '#f3f4f6'
          }}
        >
          {material.youtube_url && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer hover:bg-black/30 transition-colors"
              onClick={handlePreview}
            >
              <Play className="w-12 h-12 text-white/80 hover:text-white transition-colors" />
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
                {truncateDescription(material.description || '', 80)}
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
            {material.software_compatibility?.map((software, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {getSoftwareDisplayName(software)}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-1">
            {material.tags?.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Download/Purchase Buttons */}
          <div className="flex space-x-2">
            {isPremium ? (
              <Button 
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                onClick={handlePremiumDownload}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Buy ₹{price}
              </Button>
            ) : (
              <Button 
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
            {material.youtube_url && (
              <Button variant="outline" size="icon" onClick={handlePreview}>
                <Eye className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Material Interactions */}
          <MaterialInteractions materialId={material.id} />
        </CardContent>
      </Card>

      {isPremium && (
        <PaymentModal 
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          material={{
            id: material.id,
            title: material.title,
            price: price,
            file_url: material.file_url
          }}
        />
      )}
    </>
  );
};

export default MaterialCard;
