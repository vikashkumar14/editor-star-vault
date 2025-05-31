
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Users, 
  Download, 
  BarChart3,
  Settings,
  Eye
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useMaterials } from "@/hooks/useMaterials";
import { useCategories } from "@/hooks/useCategories";
import { supabase } from '@/integrations/supabase/client';
import { Material } from '@/types/database';

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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
    is_featured: false
  });

  const { materials, loading: materialsLoading } = useMaterials();
  const { categories, loading: categoriesLoading } = useCategories();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
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
      tags: material.tags?.join(', ') || '',
      software_compatibility: material.software_compatibility?.join(', ') || '',
      is_featured: material.is_featured || false
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        content_type: formData.content_type,
        category: formData.category,
        file_url: formData.file_url,
        thumbnail_url: formData.thumbnail_url,
        youtube_url: formData.youtube_url,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        software_compatibility: formData.software_compatibility.split(',').map(sw => sw.trim()).filter(sw => sw),
        is_featured: formData.is_featured,
        updated_at: new Date().toISOString()
      };

      if (selectedMaterial) {
        const { error } = await supabase
          .from('content')
          .update(updateData)
          .eq('id', selectedMaterial.id);

        if (error) throw error;
        alert('Material updated successfully!');
      } else {
        const { error } = await supabase
          .from('content')
          .insert([{ ...updateData, author: 'The Editor Star' }]);

        if (error) throw error;
        alert('Material created successfully!');
      }

      setIsEditing(false);
      setSelectedMaterial(null);
      window.location.reload();
    } catch (error) {
      console.error('Error saving material:', error);
      alert('Error saving material. Please try again.');
    }
  };

  const handleDelete = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', materialId);

      if (error) throw error;
      alert('Material deleted successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Error deleting material. Please try again.');
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
      is_featured: false
    });
    setSelectedMaterial(null);
    setIsEditing(false);
  };

  const totalDownloads = materials.reduce((sum, material) => sum + (material.downloads_count || 0), 0);
  const featuredCount = materials.filter(material => material.is_featured).length;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <Button 
              onClick={() => { resetForm(); setIsEditing(true); }}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Material
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Materials</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{materials.length}</p>
                  </div>
                  <Upload className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Downloads</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalDownloads.toLocaleString()}</p>
                  </div>
                  <Download className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Featured Materials</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{featuredCount}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Categories</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
                  </div>
                  <Settings className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="materials" className="space-y-6">
            <TabsList>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="materials">
              {isEditing ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedMaterial ? 'Edit Material' : 'Add New Material'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="Material title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Content Type</label>
                        <Input
                          value={formData.content_type}
                          onChange={(e) => setFormData({...formData, content_type: e.target.value})}
                          placeholder="e.g., luts, overlays, transitions"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-800"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">File URL</label>
                        <Input
                          value={formData.file_url}
                          onChange={(e) => setFormData({...formData, file_url: e.target.value})}
                          placeholder="Download link"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                        <Input
                          value={formData.thumbnail_url}
                          onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                          placeholder="Image URL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">YouTube URL</label>
                        <Input
                          value={formData.youtube_url}
                          onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
                          placeholder="Preview video URL"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Material description"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                        <Input
                          value={formData.tags}
                          onChange={(e) => setFormData({...formData, tags: e.target.value})}
                          placeholder="tag1, tag2, tag3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Software (comma separated)</label>
                        <Input
                          value={formData.software_compatibility}
                          onChange={(e) => setFormData({...formData, software_compatibility: e.target.value})}
                          placeholder="premiere_pro, after_effects"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                      />
                      <label htmlFor="featured" className="text-sm font-medium">Featured Material</label>
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {materials.map((material) => (
                    <Card key={material.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <h3 className="text-lg font-semibold">{material.title}</h3>
                              {material.is_featured && (
                                <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">{material.description}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="secondary">{material.category}</Badge>
                              <Badge variant="outline">{material.downloads_count} downloads</Badge>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {material.tags?.slice(0, 3).map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(material.file_url, '_blank')}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(material)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(material.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <CardTitle>Categories Management</CardTitle>
                  <CardDescription>Manage content categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {categories.map((category) => (
                      <div key={category.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{category.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Download Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {materials.slice(0, 5).map((material) => (
                        <div key={material.id} className="flex justify-between items-center">
                          <span>{material.title}</span>
                          <Badge>{material.downloads_count} downloads</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboard;
