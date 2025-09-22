import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Upload, Trash2, Edit, Plus, Image as ImageIcon } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import FileUpload from './FileUpload';

interface GalleryImage {
  id: string;
  title: string;
  prompt: string | null;
  image_url: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  status: string;
}

const GalleryManager = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    prompt: '',
    image_url: '',
    is_featured: false,
    status: 'published'
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast({
        title: "Error",
        description: "Failed to fetch gallery images",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image_url.trim()) {
      toast({
        title: "Error",
        description: "Title and image are required",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingImage) {
        const { error } = await supabase
          .from('gallery')
          .update({
            title: formData.title,
            prompt: formData.prompt || null,
            image_url: formData.image_url,
            is_featured: formData.is_featured,
            status: formData.status
          })
          .eq('id', editingImage.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Gallery image updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('gallery')
          .insert({
            title: formData.title,
            prompt: formData.prompt || null,
            image_url: formData.image_url,
            is_featured: formData.is_featured,
            status: formData.status
          });

        if (error) throw error;
        toast({
          title: "Success",
          description: "Gallery image added successfully"
        });
      }

      resetForm();
      fetchImages();
    } catch (error) {
      console.error('Error saving gallery image:', error);
      toast({
        title: "Error",
        description: "Failed to save gallery image",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      prompt: image.prompt || '',
      image_url: image.image_url,
      is_featured: image.is_featured,
      status: image.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Gallery image deleted successfully"
      });
      fetchImages();
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      toast({
        title: "Error",
        description: "Failed to delete gallery image",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      prompt: '',
      image_url: '',
      is_featured: false,
      status: 'published'
    });
    setEditingImage(null);
    setShowForm(false);
  };

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gallery Management</h2>
          <p className="text-muted-foreground">Manage your image gallery</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Image
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingImage ? 'Edit Image' : 'Add New Image'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter image title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="prompt">Prompt/Description</Label>
                <Textarea
                  id="prompt"
                  value={formData.prompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Enter description or AI prompt used"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <FileUpload
                onFileUploaded={handleImageUploaded}
                accept="image/*"
                bucket="material-thumbnails"
                maxSize={10 * 1024 * 1024}
                label="Gallery Image"
                currentFile={formData.image_url}
              />

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                />
                <Label htmlFor="is_featured">Featured Image</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingImage ? 'Update Image' : 'Add Image'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={image.image_url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {image.is_featured && (
                    <Badge className="bg-yellow-500">Featured</Badge>
                  )}
                  <Badge variant={image.status === 'published' ? 'default' : 'secondary'}>
                    {image.status}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{image.title}</h3>
                {image.prompt && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{image.prompt}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {new Date(image.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(image)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(image.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No images yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Upload your first image to get started with the gallery
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Image
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GalleryManager;