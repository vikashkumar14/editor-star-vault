import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Download, Eye } from "lucide-react";
import { Material } from '@/types/database';

interface RelatedMaterialsProps {
  materials: Material[];
  currentMaterialId: string;
}

const RelatedMaterials: React.FC<RelatedMaterialsProps> = ({ materials, currentMaterialId }) => {
  // Filter out current material and only show coding-related materials
  const relatedMaterials = materials
    .filter(material => 
      material.id !== currentMaterialId && 
      (material.content_type === 'code' || 
       material.content_type === 'html' || 
       material.content_type === 'css' || 
       material.content_type === 'js' ||
       material.content_type === 'javascript' ||
       material.file_type === 'html' ||
       material.file_type === 'css' ||
       material.file_type === 'js' ||
       material.category?.toLowerCase().includes('coding') ||
       material.title.toLowerCase().includes('code') ||
       material.title.toLowerCase().includes('html') ||
       material.title.toLowerCase().includes('css') ||
       material.title.toLowerCase().includes('javascript'))
    )
    .slice(0, 6); // Show max 6 suggestions

  if (relatedMaterials.length === 0) {
    return null;
  }

  const getFileTypeIcon = (fileType: string) => {
    return <Code className="w-4 h-4" />;
  };

  return (
    <div className="mt-8 sm:mt-12">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Code className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          Related Coding Materials
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Discover more coding resources and templates
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {relatedMaterials.map((material) => {
          const price = material.price || 0;
          const isPremium = material.is_premium || price > 0;

          return (
            <Card key={material.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div 
                className="h-32 sm:h-40 bg-cover bg-center relative"
                style={{ 
                  backgroundImage: `url(${material.thumbnail_url})`,
                  backgroundColor: '#f3f4f6'
                }}
              >
                <div className="absolute top-2 right-2">
                  {isPremium ? (
                    <Badge className="bg-yellow-500 text-white border-0 text-xs">
                      ₹{price}
                    </Badge>
                  ) : (
                    <Badge className="bg-green-500 text-white border-0 text-xs">
                      Free
                    </Badge>
                  )}
                </div>
              </div>
              
              <CardHeader className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getFileTypeIcon(material.file_type || '')}
                  <span className="text-xs font-medium text-blue-600 uppercase">
                    {material.file_type || material.content_type}
                  </span>
                </div>
                <CardTitle className="text-sm sm:text-base font-bold line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {material.title}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm line-clamp-2">
                  {material.description?.substring(0, 80)}...
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Download className="w-3 h-3" />
                    <span>{material.downloads_count || 0}</span>
                  </div>
                  <Link to={`/material/${material.id}`}>
                    <Button size="sm" className="text-xs px-3 py-1 h-7">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedMaterials;