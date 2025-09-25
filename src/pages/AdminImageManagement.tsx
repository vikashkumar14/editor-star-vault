import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Download, MessageSquare, FolderOpen, Images } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import GalleryManager from '@/components/GalleryManager';
import CategoryManager from '@/components/CategoryManager';

interface Stats {
  totalImages: number;
  totalCategories: number;
  featuredImages: number;
  totalInteractions: number;
}

const AdminImageManagement = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats>({
    totalImages: 0,
    totalCategories: 0,
    featuredImages: 0,
    totalInteractions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all stats in parallel
      const [imagesResult, categoriesResult, featuredResult, interactionsResult] = await Promise.all([
        supabase.from('gallery').select('id', { count: 'exact', head: true }),
        supabase.from('image_categories').select('id', { count: 'exact', head: true }),
        supabase.from('gallery').select('id', { count: 'exact', head: true }).eq('is_featured', true),
        supabase.from('gallery_interactions').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        totalImages: imagesResult.count || 0,
        totalCategories: categoriesResult.count || 0,
        featuredImages: featuredResult.count || 0,
        totalInteractions: interactionsResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to load statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Image Management</h1>
            <p className="text-muted-foreground">
              Manage gallery images and categories
            </p>
          </div>
        </div>

        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stats">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Images
                  </CardTitle>
                  <Images className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalImages}</div>
                  <p className="text-xs text-muted-foreground">
                    Images in gallery
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Categories
                  </CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCategories}</div>
                  <p className="text-xs text-muted-foreground">
                    Image categories
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Featured Images
                  </CardTitle>
                  <Badge className="h-4 w-4 text-muted-foreground bg-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.featuredImages}</div>
                  <p className="text-xs text-muted-foreground">
                    Featured content
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Interactions
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalInteractions}</div>
                  <p className="text-xs text-muted-foreground">
                    Likes, shares, downloads
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => window.location.href = '/admin-image-management?tab=categories'}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Create New Category
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/admin-image-management?tab=gallery'}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Images className="mr-2 h-4 w-4" />
                    Manage Gallery
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/gallery'}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    View Public Gallery
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Gallery system updated
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Categories feature added
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <GalleryManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminImageManagement;