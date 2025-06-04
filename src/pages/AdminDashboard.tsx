import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Download, LogOut, Upload, MessageSquare, Eye, DollarSign, CreditCard, Code } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Material } from "@/types/database";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import FileUpload from "@/components/FileUpload";
import MediaFireUpload from "@/components/MediaFireUpload";
import CodePreview from "@/components/CodePreview";

type SoftwareType = "premiere_pro" | "after_effects" | "davinci_resolve" | "final_cut_pro" | "photoshop" | "other";

const AdminDashboard = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('materials');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: '',
    category: '',
    file_url: '',
    thumbnail_url: '',
    youtube_url: '',
    tags: [] as string[],
    software_compatibility: [] as SoftwareType[],
    is_featured: false,
    price: 0,
    is_premium: false,
    html_code: '',
    css_code: '',
    js_code: ''
  });

  useEffect(() => {
    fetchMaterials();
    fetchCategories();
    fetchFeedback();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('Failed to fetch materials');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedback(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!formData.content_type.trim()) {
      toast.error('Content type is required');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const dataToSubmit = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content_type: formData.content_type.trim(),
        category: formData.category.trim(),
        file_url: formData.file_url.trim(),
        thumbnail_url: formData.thumbnail_url.trim(),
        youtube_url: formData.youtube_url.trim(),
        tags: formData.tags.filter(tag => tag.trim().length > 0),
        software_compatibility: formData.software_compatibility,
        is_featured: formData.is_featured,
        author: 'The Editor Star',
        updated_at: new Date().toISOString(),
        price: formData.price,
        is_premium: formData.is_premium,
        html_code: formData.html_code,
        css_code: formData.css_code,
        js_code: formData.js_code
      };

      console.log('Submitting data:', dataToSubmit);

      if (isEditing && selectedMaterial) {
        const { error } = await supabase
          .from('content')
          .update(dataToSubmit)
          .eq('id', selectedMaterial.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        toast.success('Material updated successfully');
      } else {
        const { data, error } = await supabase
          .from('content')
          .insert([dataToSubmit])
          .select();

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        console.log('Insert successful:', data);
        toast.success('Material added successfully');
      }

      resetForm();
      await fetchMaterials();
      setActiveTab('materials');
    } catch (error: any) {
      console.error('Error saving material:', error);
      
      // More specific error messages
      if (error.message?.includes('duplicate key')) {
        toast.error('A material with this title already exists');
      } else if (error.message?.includes('violates check constraint')) {
        toast.error('Please check all required fields are filled correctly');
      } else if (error.message?.includes('violates foreign key constraint')) {
        toast.error('Invalid category selected');
      } else {
        toast.error(`Failed to save material: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setFormData({
      title: material.title,
      description: material.description || '',
      content_type: material.content_type,
      category: material.category || '',
      file_url: material.file_url || '',
      thumbnail_url: material.thumbnail_url || '',
      youtube_url: material.youtube_url || '',
      tags: material.tags || [],
      software_compatibility: (material.software_compatibility || []) as SoftwareType[],
      is_featured: material.is_featured || false,
      price: material.price || 0,
      is_premium: material.is_premium || false,
      html_code: material.html_code || '',
      css_code: material.css_code || '',
      js_code: material.js_code || ''
    });
    setIsEditing(true);
    setActiveTab('add-material');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Material deleted successfully');
      fetchMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error('Failed to delete material');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content_type: '',
      category: '',
      file_url: '',
      thumbnail_url: '',
      youtube_url: '',
      tags: [],
      software_compatibility: [],
      is_featured: false,
      price: 0,
      is_premium: false,
      html_code: '',
      css_code: '',
      js_code: ''
    });
    setSelectedMaterial(null);
    setIsEditing(false);
  };

  const handleAddNew = () => {
    resetForm();
    setActiveTab('add-material');
  };

  const softwareOptions: SoftwareType[] = [
    'premiere_pro',
    'after_effects', 
    'davinci_resolve',
    'final_cut_pro',
    'photoshop',
    'other'
  ];

  const getSoftwareDisplayName = (software: SoftwareType) => {
    const names: Record<SoftwareType, string> = {
      'premiere_pro': 'Premiere Pro',
      'after_effects': 'After Effects',
      'davinci_resolve': 'DaVinci Resolve',
      'final_cut_pro': 'Final Cut Pro',
      'photoshop': 'Photoshop',
      'other': 'Other'
    };
    return names[software];
  };

  const handleTagsChange = (value: string) => {
    const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData({ ...formData, tags: tagsArray });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your editing materials, uploads, and feedback
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="hover:bg-red-50 hover:border-red-200">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-800 shadow-sm">
            <TabsTrigger value="materials" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              Materials
            </TabsTrigger>
            <TabsTrigger value="add-material" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              {isEditing ? 'Edit Material' : 'Add Material'}
            </TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              Feedback
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="materials">
            <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <div>
                  <CardTitle className="text-2xl text-gray-900 dark:text-white">
                    All Materials ({materials.length})
                  </CardTitle>
                  <CardDescription>Manage your editing materials and content</CardDescription>
                </div>
                <Button 
                  onClick={handleAddNew}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Material
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  {materials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center space-x-4 flex-1">
                        {material.thumbnail_url && (
                          <img 
                            src={material.thumbnail_url} 
                            alt={material.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{material.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {material.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{material.category}</Badge>
                            <Badge variant="secondary">
                              <Download className="w-3 h-3 mr-1" />
                              {material.downloads_count}
                            </Badge>
                            {material.is_featured && (
                              <Badge className="bg-yellow-500">Featured</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(material)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(material.id)}
                          className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-material">
            <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Material' : 'Add New Material'}
                </CardTitle>
                <CardDescription>
                  {isEditing ? 'Update the material details' : 'Upload new editing materials, coding files, or other content'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title *</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="focus:ring-red-500 focus:border-red-500"
                        placeholder="Enter material title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Content Type *</label>
                      <Input
                        value={formData.content_type}
                        onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                        placeholder="e.g., luts, overlays, presets, code, template"
                        required
                        className="focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <Input
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Select or enter category"
                        className="focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">YouTube Preview URL</label>
                      <Input
                        value={formData.youtube_url}
                        onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                        placeholder="YouTube video URL"
                        className="focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>

                  {/* Code Preview Section */}
                  <div className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Code className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Code Content & Preview</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Add HTML, CSS, and JavaScript code for materials that need live preview functionality.
                      </p>
                      
                      <CodePreview
                        htmlCode={formData.html_code}
                        cssCode={formData.css_code}
                        jsCode={formData.js_code}
                        onHtmlChange={(code) => setFormData({ ...formData, html_code: code })}
                        onCssChange={(code) => setFormData({ ...formData, css_code: code })}
                        onJsChange={(code) => setFormData({ ...formData, js_code: code })}
                      />
                    </div>
                  </div>

                  {/* Payment Settings Section */}
                  <div className="border rounded-lg p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Settings</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_premium"
                          checked={formData.is_premium}
                          onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                          className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                        />
                        <label htmlFor="is_premium" className="text-sm font-medium">Premium Material</label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Price (₹)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <Input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                            min="0"
                            className="pl-9 focus:ring-green-500 focus:border-green-500"
                            disabled={!formData.is_premium}
                          />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Badge className={formData.is_premium ? "bg-yellow-500" : "bg-green-500"}>
                          {formData.is_premium ? `Premium ₹${formData.price}` : "Free"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="focus:ring-red-500 focus:border-red-500"
                      placeholder="Describe your material..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FileUpload
                      onFileUploaded={(url) => setFormData({...formData, thumbnail_url: url})}
                      accept="image/*"
                      bucket="material-thumbnails"
                      label="Thumbnail Image"
                      currentFile={formData.thumbnail_url}
                    />
                    
                    <MediaFireUpload
                      onLinkAdded={(url) => setFormData({...formData, file_url: url})}
                      label="Download File"
                      description="Add MediaFire link for users to download the material"
                      currentUrl={formData.file_url}
                    />
                  </div>

                  {/* Alternative File Upload */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Alternative: Direct File Upload</h3>
                    <FileUpload
                      onFileUploaded={(url) => setFormData({...formData, file_url: url})}
                      accept="*/*"
                      bucket="material-files"
                      maxSize={100 * 1024 * 1024} // 100MB
                      label="Upload File Directly"
                      currentFile={formData.file_url?.includes('supabase') ? formData.file_url : ''}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Note: MediaFire links are recommended for larger files and better user experience
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                    <Input
                      value={formData.tags.join(', ')}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      placeholder="cinematic, vintage, coding, javascript"
                      className="focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Software Compatibility</label>
                    <div className="flex flex-wrap gap-2">
                      {softwareOptions.map((software) => (
                        <Button
                          key={software}
                          type="button"
                          variant={formData.software_compatibility.includes(software) ? "default" : "outline"}
                          size="sm"
                          className={formData.software_compatibility.includes(software) 
                            ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600" 
                            : ""
                          }
                          onClick={() => {
                            const currentSoftware = formData.software_compatibility;
                            if (currentSoftware.includes(software)) {
                              setFormData({
                                ...formData,
                                software_compatibility: currentSoftware.filter(s => s !== software)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                software_compatibility: [...currentSoftware, software]
                              });
                            }
                          }}
                        >
                          {getSoftwareDisplayName(software)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                    />
                    <label htmlFor="is_featured" className="text-sm font-medium">Featured Material</label>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isSubmitting ? 'Saving...' : (isEditing ? 'Update Material' : 'Add Material')}
                    </Button>
                    {isEditing && (
                      <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2" />
                  User Feedback ({feedback.length})
                </CardTitle>
                <CardDescription>Messages and feedback from users</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {feedback.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{item.email}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-medium mb-2">{item.subject}</h4>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{item.message}</p>
                    </div>
                  ))}
                  {feedback.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No feedback received yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-500">{materials.length}</div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Downloads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-500">
                    {materials.reduce((sum, material) => sum + (material.downloads_count || 0), 0).toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Featured Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-500">
                    {materials.filter(material => material.is_featured).length}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">User Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-500">{feedback.length}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
