import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import MaterialCard from "@/components/MaterialCard";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { useMaterials } from "@/hooks/useMaterials";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X, Loader2, Filter } from "lucide-react";

interface MaterialsProps {
  darkMode?: boolean;
  toggleDarkMode?: () => void;
}

const Materials = ({ darkMode, toggleDarkMode }: MaterialsProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const { categories } = useCategories();
  
  const { materials, loading, error, totalPages, totalCount, retry } = useMaterials({
    page: currentPage,
    limit: 12,
    category: selectedCategory,
    search: searchQuery
  });

  // Update URL params when search/category changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  // Reset to first page when search/category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleCategoryChange = (value: string) => {
    const newCategory = value === 'all' ? '' : value;
    setSelectedCategory(newCategory);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('');
  };

  const clearCategory = () => {
    setSelectedCategory('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Coding Materials</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover high-quality code snippets, templates, and components for your projects
            </p>
          </div>

          {/* Enhanced Search & Filter Section */}
          <div className="bg-card rounded-lg border p-6 mb-8 shadow-sm">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search materials, categories, authors..."
                  className="pl-12 pr-12 h-12 text-base border-2 focus:border-primary"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Filters Toggle */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {(selectedCategory) && (
                    <Badge variant="secondary" className="ml-2">
                      1
                    </Badge>
                  )}
                </Button>

                {(searchQuery || selectedCategory) && (
                  <Button variant="outline" onClick={clearSearch} className="flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Clear All
                  </Button>
                )}
              </div>

              {/* Expandable Filters */}
              {showFilters && (
                <div className="border-t pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select value={selectedCategory || 'all'} onValueChange={handleCategoryChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Filters */}
              {(selectedCategory) && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {selectedCategory && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Category: {selectedCategory}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearCategory}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Gallery Section */}
          <GallerySection />

          {/* Results Info */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              {loading ? (
                'Loading...'
              ) : (
                `Showing ${materials.length} materials${searchQuery ? ` for "${searchQuery}"` : ''}`
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
              <span className="text-muted-foreground">Loading materials...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-destructive font-medium mb-2">Failed to load materials</p>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={retry} variant="outline" size="sm">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && materials.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No materials found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedCategory
                  ? "Try adjusting your search criteria or browse all materials"
                  : "No materials are available at the moment"
                }
              </p>
              {(searchQuery || selectedCategory) && (
                <Button onClick={clearSearch} variant="outline">
                  Clear Search
                </Button>
              )}
            </div>
          )}

          {/* Materials Grid */}
          {!loading && !error && materials.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {materials.map((material) => (
                  <MaterialCard key={material.id} material={material} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <span className="px-4 py-2 text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Materials;