
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Download, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Material } from "@/types/database";
import { toast } from "sonner";

type SoftwareType = "premiere_pro" | "after_effects" | "davinci_resolve" | "final_cut_pro" | "photoshop" | "other";

const AdminDashboard = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
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
    is_featured: false
  });

  useEffect(() => {
    fetchMaterials();
    fetchCategories();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dataToSubmit = {
        ...formData,
        author: 'The Editor Star',
        updated_at: new Date().toISOString()
      };

      if (isEditing && selectedMaterial) {
        const { error } = await supabase
          .from('content')
          .update(dataToSubmit)
          .eq('id', selectedMaterial.id);

        if (error) throw error;
        toast.success('Material updated successfully');
      } else {
        const { error } = await supabase
          .from('content')
          .insert([dataToSubmit]);

        if (error) throw error;
        toast.success('Material added successfully');
      }

      resetForm();
      fetchMaterials();
    } catch (error) {
      console.error('Error saving material:', error);
      toast.error('Failed to save material');
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
      is_featured: material.is_featured || false
    });
    setIsEditing(true);
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
      is_featured: false
    });
    setSelectedMaterial(null);
    setIsEditing(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your editing materials and content</p>
        </div>

        <Tabs defaultValue="materials" className="space-y-6">
          <TabsList>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="add-material">Add Material</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle>All Materials ({materials.length})</CardTitle>
                <CardDescription>Manage your editing materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {materials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{material.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{material.description}</p>
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
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(material)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(material.id)}>
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
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? 'Edit Material' : 'Add New Material'}</CardTitle>
                <CardDescription>
                  {isEditing ? 'Update the material details' : 'Add a new editing material to your collection'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Content Type</label>
                      <Input
                        value={formData.content_type}
                        onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                        placeholder="e.g., luts, overlays, presets"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <Input
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Select or enter category"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">File URL</label>
                      <Input
                        value={formData.file_url}
                        onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                        placeholder="Download link"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                      <Input
                        value={formData.thumbnail_url}
                        onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                        placeholder="Image URL"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">YouTube Preview URL</label>
                      <Input
                        value={formData.youtube_url}
                        onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                        placeholder="YouTube video URL"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
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
                    />
                    <label htmlFor="is_featured" className="text-sm font-medium">Featured Material</label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      {isEditing ? 'Update Material' : 'Add Material'}
                    </Button>
                    {isEditing && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{materials.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Downloads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {materials.reduce((sum, material) => sum + (material.downloads_count || 0), 0).toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Featured Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {materials.filter(material => material.is_featured).length}
                  </div>
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
