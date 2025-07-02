
import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List, X, Menu } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaterialCard from "@/components/MaterialCard";
import { useMaterials } from "@/hooks/useMaterials";
import { useCategories } from "@/hooks/useCategories";
import { useIsMobile } from "@/hooks/use-mobile";

const Materials = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile();
  
  const { materials, loading: materialsLoading } = useMaterials();
  const { categories, loading: categoriesLoading } = useCategories();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Enhanced search functionality with better matching
  const filteredMaterials = useMemo(() => {
    if (!materials || materials.length === 0) return [];
    
    return materials.filter(material => {
      const searchLower = searchTerm.toLowerCase().trim();
      
      // If no search term, just filter by category
      if (!searchTerm) {
        return !selectedCategory || material.category === selectedCategory;
      }
      
      // Enhanced search matching
      const matchesSearch = 
        material.title?.toLowerCase().includes(searchLower) ||
        material.description?.toLowerCase().includes(searchLower) ||
        material.category?.toLowerCase().includes(searchLower) ||
        material.author?.toLowerCase().includes(searchLower) ||
        material.content_type?.toLowerCase().includes(searchLower) ||
        material.file_type?.toLowerCase().includes(searchLower) ||
        material.tags?.some(tag => tag?.toLowerCase().includes(searchLower)) ||
        material.software_compatibility?.some(software => 
          software?.toLowerCase().replace('_', ' ').includes(searchLower)
        );
      
      const matchesCategory = !selectedCategory || material.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [materials, searchTerm, selectedCategory]);

  if (materialsLoading || categoriesLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark' : ''} overflow-x-hidden`}>
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
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} overflow-x-hidden`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 md:py-8">
          {/* Mobile-optimized Header */}
          <div className="text-center mb-6 md:mb-12">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4">
              Professional Editing Materials
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-gray-600 dark:text-gray-300">
              Download high-quality editing resources for your projects
            </p>
          </div>

          {/* Mobile-first Search and Filter Bar */}
          <div className="mb-4 md:mb-6">
            <div className="flex gap-2">
              {/* Mobile Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={isMobile ? "Search materials..." : "Search by title, category, tags, software, author..."}
                  className="pl-10 pr-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Mobile Filter Toggle */}
              {isMobile && (
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              {isMobile && (
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Desktop Controls */}
          {!isMobile && (
            <Card className="mb-6 md:mb-8">
              <CardContent className="p-4 md:p-6">
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
              </CardContent>
            </Card>
          )}

          {/* Mobile Filters Dropdown */}
          {isMobile && showFilters && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600"
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
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mobile Menu Dropdown */}
          {isMobile && showMobileMenu && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">View Options</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="flex-1"
                  >
                    <Grid className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                  
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="flex-1"
                  >
                    <List className="h-4 w-4 mr-2" />
                    List
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Count */}
          <div className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">
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
                  setShowFilters(false);
                  setShowMobileMenu(false);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Materials Grid */}
          <div className={`grid gap-3 sm:gap-4 md:gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredMaterials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>

          {/* No Results */}
          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <div className="mb-4">
                <Search className="w-12 md:w-16 h-12 md:h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-lg mb-2">
                  No materials found matching your search criteria.
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                  Try adjusting your search terms or browse all categories.
                </p>
              </div>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setShowFilters(false);
                  setShowMobileMenu(false);
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
