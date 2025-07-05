import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, Play, CreditCard, Code, FileText, Palette, Eye, EyeOff, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaterialInteractions from "@/components/MaterialInteractions";
import PaymentModal from "@/components/PaymentModal";
import CodePreview from "@/components/CodePreview";
import { supabase } from '@/integrations/supabase/client';
import { Material } from '@/types/database';
import { handleMaterialDownload } from '@/utils/download';
import { toast } from "sonner";

const MaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const fetchMaterial = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching material:', error);
          toast.error("Could not fetch material details.");
          return;
        }

        setMaterial(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [id]);

  // --- 💡 FIX YAHAN HAI ---
  const handleDownload = async () => {
    if (!material) return;
    
    if (!material.file_url) {
      toast.error('Download link not available for this item.');
      return;
    }

    setDownloading(true);
    try {
      // Purane code ki tarah file ka naam title se banayenge
      const fileName = `${material.title.replace(/\s+/g, '-').toLowerCase()}.zip`;
      
      // handleMaterialDownload ko sahi arguments denge
      await handleMaterialDownload(
        material.id, 
        material.file_url, 
        fileName
      );
      toast.success('Download started successfully! Check your downloads folder.');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePremiumDownload = () => {
    setShowPaymentModal(true);
  };

  const handlePreview = () => {
    if (material?.youtube_url) {
      window.open(material.youtube_url, '_blank');
    }
  };

  // --- 💡 BONUS FIX: Syntax error theek kiya gaya hai ---
  const getSoftwareDisplayName = (software: string) => {
    const names: { [key: string]: string } = {
      'premiere_pro': 'Premiere Pro', 
      'after_effects': 'After Effects',
      'davinci_resolve': 'DaVinci Resolve',
      'final_cut_pro': 'Final Cut Pro',
      'photoshop': 'Photoshop',
      'coding': 'Coding',
      'html': 'HTML'
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
          <Button 
            variant="outline" 
            onClick={() => navigate('/materials')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Materials
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="overflow-hidden shadow-xl">
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
                
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
                  <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                    {material.title}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-700 dark:text-gray-300">
                    {material.description || getContentTypeDescription(material.content_type, material.file_type)}
                  </CardDescription>
                </CardHeader>
              </Card>

              {hasCodeContent && (
                <Card className="shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Code className="w-6 h-6 text-blue-600" />
                        <CardTitle className="text-2xl font-bold">Code Documentation</CardTitle>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowCodePreview(!showCodePreview)}
                        className="shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {showCodePreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {showCodePreview ? 'Hide Preview' : 'Show Preview'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {showCodePreview && (
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                        <CodePreview
                          htmlCode={material.html_code || ''}
                          cssCode={material.css_code || ''}
                          jsCode={material.js_code || ''}
                          readonly={true}
                        />
                      </div>
                    )}

                    {material.html_code && material.html_introduction && (
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-lg border-l-4 border-orange-500">
                         <div className="flex items-center space-x-3 mb-4">
                           <Code className="w-6 h-6 text-red-600" />
                           <h3 className="text-xl font-bold text-red-600 dark:text-red-400">HTML Structure</h3>
                         </div>
                        <div className="prose prose-gray dark:prose-invert max-w-none">
                          {material.html_introduction.split('\n').map((line, idx) => (
                            <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {material.css_code && material.css_introduction && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border-l-4 border-blue-500">
                         <div className="flex items-center space-x-3 mb-4">
                           <Palette className="w-6 h-6 text-red-600" />
                           <h3 className="text-xl font-bold text-red-600 dark:text-red-400">CSS Styling</h3>
                         </div>
                        <div className="prose prose-gray dark:prose-invert max-w-none">
                          {material.css_introduction.split('\n').map((line, idx) => (
                            <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {material.js_code && material.js_introduction && (
                      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-6 rounded-lg border-l-4 border-yellow-500">
                         <div className="flex items-center space-x-3 mb-4">
                           <Code className="w-6 h-6 text-red-600" />
                           <h3 className="text-xl font-bold text-red-600 dark:text-red-400">JavaScript Functionality</h3>
                         </div>
                        <div className="prose prose-gray dark:prose-invert max-w-none">
                          {material.js_introduction.split('\n').map((line, idx) => (
                            <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Technical Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3">File Information</h4>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-2">
                          {getFileTypeIcon(material.file_type || '')}
                          <span><strong>Type:</strong> {material.file_type || material.content_type || 'Unknown'}</span>
                        </div>
                        <div><strong>Size:</strong> {material.file_size ? `${(material.file_size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}</div>
                        <div><strong>Author:</strong> {material.author || 'Anonymous'}</div>
                        <div><strong>Category:</strong> {material.category || 'General'}</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Compatibility</h4>
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

                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {material.tags?.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-sm">
                          {tag}
                        </Badge>
                      )) || (
                        <span className="text-sm text-gray-500">No tags available</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-xl border-2 border-blue-200 dark:border-blue-800">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <CardTitle className="text-xl font-bold">Download Material</CardTitle>
                  {material.file_size && (
                    <CardDescription className="text-sm">
                      File size: {(material.file_size / 1024 / 1024).toFixed(2)} MB
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      {getFileTypeIcon(material.file_type || '')}
                      <span className="font-medium">{material.file_type?.toUpperCase() || 'FILE'}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {getContentTypeDescription(material.content_type, material.file_type)}
                    </p>
                  </div>

                  {isPremium ? (
                    <Button 
                      className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-200"
                      onClick={handlePremiumDownload}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Purchase & Download ₹{price}
                    </Button>
                  ) : (
                    <Button 
                      className="w-full h-12 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-200"
                      onClick={handleDownload}
                      disabled={downloading}
                    >
                      {downloading ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Preparing...
                        </span>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          Free Download
                        </>
                      )}
                    </Button>
                  )}
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Download will start automatically. Check your downloads folder.
                      </p>
                    </div>
                  </div>
                  
                  {material.youtube_url && (
                    <Button 
                      variant="outline" 
                      className="w-full shadow-lg hover:shadow-xl transition-all duration-200" 
                      onClick={handlePreview}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch Tutorial
                    </Button>
                  )}

                  {hasCodeContent && (
                    <Button 
                      variant="outline" 
                      className="w-full shadow-lg hover:shadow-xl transition-all duration-200" 
                      onClick={() => setShowCodePreview(!showCodePreview)}
                    >
                      <Code className="w-4 h-4 mr-2" />
                      {showCodePreview ? 'Hide' : 'View'} Code Preview
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center text-sm bg-gray-50 dark:bg-slate-800 p-3 rounded">
                    <span className="font-medium">Downloads:</span>
                    <span className="font-bold text-green-600">{material.downloads_count?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-gray-50 dark:bg-slate-800 p-3 rounded">
                    <span className="font-medium">Rating:</span>
                    <span className="font-bold text-yellow-600">{material.rating || 0}/5 ⭐</span>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-gray-50 dark:bg-slate-800 p-3 rounded">
                    <span className="font-medium">Type:</span>
                    <span className="font-bold capitalize">{material.content_type}</span>
                  </div>
                  {material.created_at && (
                    <div className="flex justify-between items-center text-sm bg-gray-50 dark:bg-slate-800 p-3 rounded">
                      <span className="font-medium">Added:</span>
                      <span className="font-bold">
                        {new Date(material.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Community Feedback</CardTitle>
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
