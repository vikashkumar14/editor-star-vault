
import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaterialCard from "@/components/MaterialCard";
import { useMaterials } from "@/hooks/useMaterials";
import { useCategories } from "@/hooks/useCategories";

const Materials = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { materials, loading: materialsLoading } = useMaterials();
  const { categories, loading: categoriesLoading } = useCategories();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Enhanced search functionality
  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch = !searchTerm || 
        material.title.toLowerCase().includes(searchLower) ||
        material.description?.toLowerCase().includes(searchLower) ||
        material.category?.toLowerCase().includes(searchLower) ||
        material.author?.toLowerCase().includes(searchLower) ||
        material.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        material.software_compatibility?.some(software => software.toLowerCase().includes(searchLower));
      
      const matchesCategory = !selectedCategory || material.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [materials, searchTerm, selectedCategory]);

  if (materialsLoading || categoriesLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading materials...</p>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Professional Editing Materials
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Download high-quality editing resources for your projects
            </p>
          </div>

          {/* Enhanced Search and Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by title, category, tags, software, author..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <select
                    className="px-4 py-2 border rounded-md bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Search suggestions */}
              {searchTerm && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500">Quick filters:</span>
                  {['LUT', 'Template', 'Effect', 'Code', 'Sound'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchTerm(tag)}
                      className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-xs rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300">
              Showing {filteredMaterials.length} of {materials.length} materials
              {searchTerm && ` for "${searchTerm}"`}
            </p>
            
            {/* Clear search */}
            {(searchTerm || selectedCategory) && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Materials Grid */}
          <div className={`grid gap-8 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredMaterials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>

          {/* No Results */}
          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <div className="mb-4">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
                  No materials found matching your search criteria.
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Try adjusting your search terms or browse all categories.
                </p>
              </div>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
              >
                Browse All Materials
              </Button>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Materials;
