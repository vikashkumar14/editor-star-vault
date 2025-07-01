
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, Play, CreditCard, Code, FileText, Palette, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaterialInteractions from "@/components/MaterialInteractions";
import PaymentModal from "@/components/PaymentModal";
import CodePreview from "@/components/CodePreview";
import { supabase } from '@/integrations/supabase/client';
import { Material } from '@/types/database';
import { handleMaterialDownload } from '@/utils/download';

const MaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const fetchMaterial = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching material:', error);
          return;
        }

        setMaterial(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [id]);

  const handleDownload = () => {
    if (!material) return;
    const fileName = `${material.title.replace(/\s+/g, '-').toLowerCase()}.zip`;
    handleMaterialDownload(material.id, material.file_url, fileName);
  };

  const handlePremiumDownload = () => {
    setShowPaymentModal(true);
  };

  const handlePreview = () => {
    if (material?.youtube_url) {
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

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType?.toLowerCase()) {
      case 'html':
      case 'css':
      case 'js':
        return <Code className="w-4 h-4" />;
      case 'psd':
      case 'ai':
        return <Palette className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getContentTypeDescription = (contentType: string, fileType?: string) => {
    const descriptions: { [key: string]: string } = {
      'luts': 'Color grading lookup tables for cinematic color correction and enhancement',
      'overlays': 'Visual overlay elements to enhance your video compositions',
      'presets': 'Pre-configured settings for quick and professional video editing',
      'templates': 'Ready-to-use project templates for faster workflow',
      'transitions': 'Smooth transition effects between video clips',
      'code': 'Complete code snippets and templates for web development',
      'html': 'HTML markup code for web page structure and content',
      'css': 'CSS styling code for beautiful web page design and layout',
      'js': 'JavaScript code for interactive web functionality and features',
      'javascript': 'JavaScript code for interactive web functionality and features'
    };
    
    return descriptions[contentType.toLowerCase()] || 
           descriptions[fileType?.toLowerCase() || ''] || 
           'Professional editing material for your creative projects';
  };

  const hasCodeContent = material?.html_code || material?.css_code || material?.js_code;

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Material Not Found</h1>
              <Button onClick={() => navigate('/materials')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Materials
              </Button>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  const price = material.price || 0;
  const isPremium = material.is_premium || price > 0;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Button 
            variant="outline" 
            onClick={() => navigate('/materials')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Materials
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Section */}
              <Card className="overflow-hidden">
                <div 
                  className="h-64 bg-cover bg-center relative"
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
                      <Play className="w-16 h-16 text-white/80 hover:text-white transition-colors" />
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
                
                <CardHeader>
                  <CardTitle className="text-2xl">{material.title}</CardTitle>
                  <CardDescription className="text-base">
                    {material.description || getContentTypeDescription(material.content_type, material.file_type)}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Code Preview Section */}
              {hasCodeContent && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Code className="w-5 h-5 text-blue-600" />
                        <CardTitle className="text-lg">Code Preview</CardTitle>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCodePreview(!showCodePreview)}
                      >
                        {showCodePreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {showCodePreview ? 'Hide Preview' : 'Show Preview'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {showCodePreview ? (
                      <CodePreview
                        htmlCode={material.html_code || ''}
                        cssCode={material.css_code || ''}
                        jsCode={material.js_code || ''}
                        readonly={true}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Click "Show Preview" to view the code and live preview</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Code Introductions */}
              {hasCodeContent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Code Documentation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {material.html_code && material.html_introduction && (
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Code className="w-4 h-4 text-orange-500" />
                          <h4 className="font-semibold text-gray-900 dark:text-white">HTML Structure</h4>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {material.html_introduction}
                        </p>
                      </div>
                    )}
                    
                    {material.css_code && material.css_introduction && (
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Palette className="w-4 h-4 text-blue-500" />
                          <h4 className="font-semibold text-gray-900 dark:text-white">CSS Styling</h4>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {material.css_introduction}
                        </p>
                      </div>
                    )}
                    
                    {material.js_code && material.js_introduction && (
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Code className="w-4 h-4 text-yellow-500" />
                          <h4 className="font-semibold text-gray-900 dark:text-white">JavaScript Functionality</h4>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {material.js_introduction}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Technical Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Technical Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">File Information</h4>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-2">
                          {getFileTypeIcon(material.file_type || '')}
                          <span>Type: {material.file_type || material.content_type || 'Unknown'}</span>
                        </div>
                        <div>Size: {material.file_size ? `${(material.file_size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}</div>
                        <div>Author: {material.author || 'Anonymous'}</div>
                        <div>Category: {material.category || 'General'}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Compatibility</h4>
                      <div className="flex flex-wrap gap-2">
                        {material.software_compatibility?.map((software, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {getSoftwareDisplayName(software)}
                          </Badge>
                        )) || (
                          <Badge variant="secondary" className="text-xs">Universal</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {material.tags?.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      )) || (
                        <span className="text-sm text-gray-500">No tags available</span>
                      )}
                    </div>
                  </div>

                  {/* Content Description */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">About This Material</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {getContentTypeDescription(material.content_type, material.file_type)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Download Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Download</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isPremium ? (
                    <Button 
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                      onClick={handlePremiumDownload}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Buy for ₹{price}
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                      onClick={handleDownload}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Free Download
                    </Button>
                  )}
                  
                  {material.youtube_url && (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handlePreview}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch Preview
                    </Button>
                  )}

                  {hasCodeContent && (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => setShowCodePreview(!showCodePreview)}
                    >
                      <Code className="w-4 h-4 mr-2" />
                      {showCodePreview ? 'Hide' : 'View'} Code
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Downloads:</span>
                    <span className="font-medium">{material.downloads_count?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rating:</span>
                    <span className="font-medium">{material.rating || 0}/5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Type:</span>
                    <span className="font-medium capitalize">{material.content_type}</span>
                  </div>
                  {material.created_at && (
                    <div className="flex justify-between text-sm">
                      <span>Added:</span>
                      <span className="font-medium">
                        {new Date(material.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Interactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <MaterialInteractions materialId={material.id} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Payment Modal */}
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
    </div>
  );
};

export default MaterialDetail;
