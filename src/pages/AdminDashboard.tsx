import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Trash2, Edit, Plus, Eye, Code, Image } from "lucide-react";
import GalleryManager from '@/components/GalleryManager';
import { supabase } from '@/integrations/supabase/client';
import { Material, Category } from '@/types/database';
import CodePreview from '@/components/CodePreview';
import { useToast } from "@/hooks/use-toast";

type SoftwareType = "premiere_pro" | "after_effects" | "davinci_resolve" | "final_cut_pro" | "photoshop" | "other";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  // Pagination state for better performance
  const [currentPage, setCurrentPage] = useState(1);
  const [materialsPerPage] = useState(10);
  const [totalMaterials, setTotalMaterials] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: '',
    category: '',
    file_url: '',
    thumbnail_url: '',
    youtube_url: '',
    tags: '',
    software_compatibility: '',
    author: '',
    price: 0,
    is_premium: false,
    is_featured: false,
    html_code: '',
    css_code: '',
    js_code: '',
    html_introduction: '',
    css_introduction: '',
    js_introduction: ''
  });

  useEffect(() => {
    // Load data with pagination
    fetchMaterials(currentPage);
    fetchCategories();
  }, [currentPage]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalMaterials / materialsPerPage);
  const startIndex = (currentPage - 1) * materialsPerPage;
  const endIndex = Math.min(startIndex + materialsPerPage, totalMaterials);

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }
    setUploadingThumbnail(true);
    try {
      // Convert image to base64 for temporary preview
      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result as string;
        setFormData({
          ...formData,
          thumbnail_url: result
        });
      };
      reader.readAsDataURL(file);
      toast({
        title: "Success",
        description: "Thumbnail uploaded successfully"
      });
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast({
        title: "Error",
        description: "Failed to upload thumbnail",
        variant: "destructive"
      });
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const fetchMaterials = async (page: number) => {
    try {
      setLoading(true);

      // Get total count first
      const { count, error: countError } = await supabase
        .from('content')
        .select('*', { count: 'exact', head: true })
        .order('created_at', { ascending: false });

      if (countError) {
        console.error('Error fetching materials count:', countError);
        toast({
          title: "Error",
          description: `Failed to fetch materials count: ${countError.message}`,
          variant: "destructive"
        });
        return;
      }

      setTotalMaterials(count || 0);

      // Get paginated data
      const from = (page - 1) * materialsPerPage;
      const to = from + materialsPerPage - 1;

      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching materials:', error);
        toast({
          title: "Error",
          description: `Failed to fetch materials: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      setMaterials(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: `Failed to fetch categories: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      setCategories(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.content_type) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Title and Content Type)",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Parse and validate software compatibility
      const softwareCompatibilityArray = formData.software_compatibility 
        ? formData.software_compatibility.split(',').map(s => s.trim()).filter(s => {
          const validSoftware: SoftwareType[] = ["premiere_pro", "after_effects", "davinci_resolve", "final_cut_pro", "photoshop", "other"];
          return validSoftware.includes(s as SoftwareType);
        }) as SoftwareType[] 
        : [];

      const materialData = {
        title: formData.title,
        description: formData.description,
        content_type: formData.content_type,
        category: formData.category,
        file_url: formData.file_url,
        thumbnail_url: formData.thumbnail_url,
        youtube_url: formData.youtube_url,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
        software_compatibility: softwareCompatibilityArray,
        author: formData.author,
        price: formData.is_premium ? formData.price : 0,
        is_premium: formData.is_premium,
        is_featured: formData.is_featured,
        html_code: formData.html_code,
        css_code: formData.css_code,
        js_code: formData.js_code,
        html_introduction: formData.html_introduction,
        css_introduction: formData.css_introduction,
        js_introduction: formData.js_introduction,
        status: 'published'
      };

      console.log('Submitting material data:', materialData);
      let result;
      if (editingMaterial) {
        result = await supabase
          .from('content')
          .update(materialData)
          .eq('id', editingMaterial.id)
          .select();
      } else {
        result = await supabase
          .from('content')
          .insert([materialData])
          .select();
      }

      if (result.error) {
        console.error('Error saving material:', result.error);
        toast({
          title: "Error",
          description: `Failed to save material: ${result.error.message}`,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: editingMaterial ? "Material updated successfully" : "Material created successfully"
      });

      resetForm();
      fetchMaterials(currentPage);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
      tags: '',
      software_compatibility: '',
      author: '',
      price: 0,
      is_premium: false,
      is_featured: false,
      html_code: '',
      css_code: '',
      js_code: '',
      html_introduction: '',
      css_introduction: '',
      js_introduction: ''
    });
    setEditingMaterial(null);
    setShowForm(false);
  };

  const handleEdit = (material: Material) => {
    setFormData({
      title: material.title,
      description: material.description || '',
      content_type: material.content_type,
      category: material.category || '',
      file_url: material.file_url || '',
      thumbnail_url: material.thumbnail_url || '',
      youtube_url: material.youtube_url || '',
      tags: material.tags ? material.tags.join(', ') : '',
      software_compatibility: material.software_compatibility ? material.software_compatibility.join(', ') : '',
      author: material.author || '',
      price: material.price || 0,
      is_premium: material.is_premium || false,
      is_featured: material.is_featured || false,
      html_code: material.html_code || '',
      css_code: material.css_code || '',
      js_code: material.js_code || '',
      html_introduction: material.html_introduction || '',
      css_introduction: material.css_introduction || '',
      js_introduction: material.js_introduction || ''
    });
    setEditingMaterial(material);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting material:', error);
        toast({
          title: "Error",
          description: `Failed to delete material: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Material deleted successfully"
      });

      fetchMaterials(currentPage);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  if (loading && materials.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 lg:p-6">
      <div className="max-w-full sm:max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Materials
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold">Materials Management</h2>
                <p className="text-sm text-muted-foreground">Create and manage your content materials</p>
              </div>
              <Button 
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }} 
                className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Material
              </Button>
            </div>

            {showForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-base">{editingMaterial ? 'Edit Material' : 'Add New Material'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto mx-0 bg-slate-700 rounded-md">
                        <TabsTrigger value="basic" className="text-xs sm:text-sm py-2">Basic</TabsTrigger>
                        <TabsTrigger value="code" className="text-xs sm:text-sm py-2">Code</TabsTrigger>
                        <TabsTrigger value="introductions" className="text-xs sm:text-sm py-2">Info</TabsTrigger>
                        <TabsTrigger value="preview" className="text-xs sm:text-sm py-2">Preview</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="basic" className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                            <Input 
                              id="title" 
                              value={formData.title} 
                              onChange={e => setFormData({ ...formData, title: e.target.value })} 
                              required 
                              className="mt-1" 
                            />
                          </div>

                          <div>
                            <Label htmlFor="content_type" className="text-sm font-medium">Content Type *</Label>
                            <Input 
                              id="content_type" 
                              value={formData.content_type} 
                              onChange={e => setFormData({ ...formData, content_type: e.target.value })} 
                              required 
                              className="mt-1" 
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                          <Textarea 
                            id="description" 
                            value={formData.description} 
                            onChange={e => setFormData({ ...formData, description: e.target.value })} 
                            className="mt-1" 
                            rows={3} 
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                            <Select 
                              value={formData.category} 
                              onValueChange={value => setFormData({ ...formData, category: value })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(category => (
                                  <SelectItem key={category.id} value={category.name}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="author" className="text-sm font-medium">Author</Label>
                            <Input 
                              id="author" 
                              value={formData.author} 
                              onChange={e => setFormData({ ...formData, author: e.target.value })} 
                              className="mt-1" 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="file_url" className="text-sm font-medium">File URL</Label>
                            <Input 
                              id="file_url" 
                              value={formData.file_url} 
                              onChange={e => setFormData({ ...formData, file_url: e.target.value })} 
                              className="mt-1" 
                            />
                          </div>

                          <div>
                            <Label htmlFor="youtube_url" className="text-sm font-medium">YouTube URL</Label>
                            <Input 
                              id="youtube_url" 
                              value={formData.youtube_url} 
                              onChange={e => setFormData({ ...formData, youtube_url: e.target.value })} 
                              className="mt-1" 
                            />
                          </div>
                        </div>

                        {/* Thumbnail Upload Section */}
                        <div>
                          <Label htmlFor="thumbnail">Thumbnail Image</Label>
                          <div className="mt-2 space-y-4">
                            <div className="flex items-center gap-4">
                              <Button 
                                type="button" 
                                variant="outline" 
                                disabled={uploadingThumbnail} 
                                onClick={() => document.getElementById('thumbnail-upload')?.click()} 
                                className="flex items-center gap-2"
                              >
                                {uploadingThumbnail ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                ) : (
                                  <Image className="w-4 h-4" />
                                )}
                                {uploadingThumbnail ? 'Uploading...' : 'Upload Thumbnail'}
                              </Button>
                              <input 
                                id="thumbnail-upload" 
                                type="file" 
                                accept="image/*" 
                                onChange={handleThumbnailUpload} 
                                className="hidden" 
                              />
                            </div>
                            
                            {formData.thumbnail_url && (
                              <div className="flex items-center gap-4">
                                <img 
                                  src={formData.thumbnail_url} 
                                  alt="Thumbnail preview" 
                                  className="w-20 h-20 object-cover rounded-lg border" 
                                />
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setFormData({ ...formData, thumbnail_url: '' })}
                                >
                                  Remove
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="tags" className="text-sm font-medium">Tags (comma separated)</Label>
                            <Input 
                              id="tags" 
                              value={formData.tags} 
                              onChange={e => setFormData({ ...formData, tags: e.target.value })} 
                              placeholder="e.g., cinematic, moody, vintage" 
                              className="mt-1" 
                            />
                          </div>

                          <div>
                            <Label htmlFor="software_compatibility" className="text-sm font-medium">Software Compatibility</Label>
                            <Input 
                              id="software_compatibility" 
                              value={formData.software_compatibility} 
                              onChange={e => setFormData({ ...formData, software_compatibility: e.target.value })} 
                              placeholder="e.g., premiere_pro, after_effects" 
                              className="mt-1" 
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Valid: premiere_pro, after_effects, davinci_resolve, final_cut_pro, photoshop, other
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="is_premium" 
                              checked={formData.is_premium} 
                              onCheckedChange={checked => setFormData({ ...formData, is_premium: checked })} 
                            />
                            <Label htmlFor="is_premium" className="text-sm">Premium</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="is_featured" 
                              checked={formData.is_featured} 
                              onCheckedChange={checked => setFormData({ ...formData, is_featured: checked })} 
                            />
                            <Label htmlFor="is_featured" className="text-sm">Featured</Label>
                          </div>

                          {formData.is_premium && (
                            <div className="flex items-center space-x-2">
                              <Label htmlFor="price" className="text-sm">Price:</Label>
                              <Input 
                                id="price" 
                                type="number" 
                                value={formData.price} 
                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} 
                                className="w-20" 
                                min="0" 
                                step="0.01" 
                              />
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="code" className="space-y-4">
                        <div>
                          <Label htmlFor="html_code" className="text-sm font-medium">HTML Code</Label>
                          <Textarea 
                            id="html_code" 
                            value={formData.html_code} 
                            onChange={e => setFormData({ ...formData, html_code: e.target.value })} 
                            className="mt-1 font-mono text-sm" 
                            rows={8} 
                            placeholder="Enter HTML code here..." 
                          />
                        </div>

                        <div>
                          <Label htmlFor="css_code" className="text-sm font-medium">CSS Code</Label>
                          <Textarea 
                            id="css_code" 
                            value={formData.css_code} 
                            onChange={e => setFormData({ ...formData, css_code: e.target.value })} 
                            className="mt-1 font-mono text-sm" 
                            rows={8} 
                            placeholder="Enter CSS code here..." 
                          />
                        </div>

                        <div>
                          <Label htmlFor="js_code" className="text-sm font-medium">JavaScript Code</Label>
                          <Textarea 
                            id="js_code" 
                            value={formData.js_code} 
                            onChange={e => setFormData({ ...formData, js_code: e.target.value })} 
                            className="mt-1 font-mono text-sm" 
                            rows={8} 
                            placeholder="Enter JavaScript code here..." 
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="introductions" className="space-y-4">
                        <div>
                          <Label htmlFor="html_introduction" className="text-sm font-medium">HTML Introduction</Label>
                          <Textarea 
                            id="html_introduction" 
                            value={formData.html_introduction} 
                            onChange={e => setFormData({ ...formData, html_introduction: e.target.value })} 
                            className="mt-1" 
                            rows={4} 
                            placeholder="Describe the HTML structure and key elements..." 
                          />
                        </div>

                        <div>
                          <Label htmlFor="css_introduction" className="text-sm font-medium">CSS Introduction</Label>
                          <Textarea 
                            id="css_introduction" 
                            value={formData.css_introduction} 
                            onChange={e => setFormData({ ...formData, css_introduction: e.target.value })} 
                            className="mt-1" 
                            rows={4} 
                            placeholder="Explain the styling approach and key CSS features..." 
                          />
                        </div>

                        <div>
                          <Label htmlFor="js_introduction" className="text-sm font-medium">JavaScript Introduction</Label>
                          <Textarea 
                            id="js_introduction" 
                            value={formData.js_introduction} 
                            onChange={e => setFormData({ ...formData, js_introduction: e.target.value })} 
                            className="mt-1" 
                            rows={4} 
                            placeholder="Describe the JavaScript functionality and interactions..." 
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="preview">
                        {(formData.html_code || formData.css_code || formData.js_code) ? (
                          <div className="border rounded-lg p-4">
                            <h4 className="text-lg font-semibold mb-4">Code Preview</h4>
                            <CodePreview 
                              htmlCode={formData.html_code} 
                              cssCode={formData.css_code} 
                              jsCode={formData.js_code} 
                            />
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Add some code in the Code tab to see the preview here</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>

                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
                      <Button type="button" variant="outline" onClick={resetForm} className="w-full sm:w-auto">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                        {loading ? 'Saving...' : editingMaterial ? 'Update' : 'Create'} Material
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Materials List */}
            <div className="grid gap-4">
              {materials.map(material => (
                <Card key={material.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex flex-col sm:flex-row gap-4 flex-1 min-w-0">
                        {/* Thumbnail Display */}
                        {material.thumbnail_url && (
                          <div className="w-full sm:w-20 h-20 flex-shrink-0">
                            <img 
                              src={material.thumbnail_url} 
                              alt={material.title} 
                              className="w-full h-full object-cover rounded-lg border" 
                              onError={e => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }} 
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-base sm:text-lg">
                            <span className="truncate">{material.title}</span>
                            <div className="flex gap-1 flex-wrap">
                              {material.is_featured && <Badge className="bg-yellow-500 text-xs">Featured</Badge>}
                              {material.is_premium && <Badge className="bg-purple-500 text-xs">Premium</Badge>}
                            </div>
                          </CardTitle>
                          <CardDescription className="mt-1 text-sm line-clamp-2">{material.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2 self-start">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(material)} className="flex-shrink-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(material.id)} className="flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                      <div className="truncate">
                        <strong>Category:</strong> {material.category || 'N/A'}
                      </div>
                      <div className="truncate">
                        <strong>Type:</strong> {material.content_type}
                      </div>
                      <div>
                        <strong>Downloads:</strong> {material.downloads_count?.toLocaleString() || 0}
                      </div>
                      <div>
                        <strong>Rating:</strong> {material.rating || 0}/5
                      </div>
                    </div>
                    {material.tags && material.tags.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {material.tags.slice(0, 6).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {material.tags.length > 6 && (
                            <Badge variant="secondary" className="text-xs">
                              +{material.tags.length - 6} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-muted-foreground text-center sm:text-left">
                  Showing {startIndex + 1} to {endIndex} of {totalMaterials} materials
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                    disabled={currentPage === 1} 
                    className="text-xs px-3"
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage <= 2) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - 2 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }
                    return (
                      <Button 
                        key={pageNum} 
                        variant={currentPage === pageNum ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setCurrentPage(pageNum)} 
                        className="text-xs px-3 min-w-[36px]"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                    disabled={currentPage === totalPages} 
                    className="text-xs px-3"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;