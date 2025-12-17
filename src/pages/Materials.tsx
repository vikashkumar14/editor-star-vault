import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import MaterialCard from "@/components/MaterialCard";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import Loader from "@/components/Loader";
import { useMaterials } from "@/hooks/useMaterials";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter, Code, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-background text-foreground animate-page-enter">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="orb orb-primary w-96 h-96 -top-48 -left-48 animate-float-slow" />
        <div className="orb orb-accent w-80 h-80 top-1/3 -right-40 animate-float-delayed" />
        <div className="bg-grid absolute inset-0 opacity-30" />
      </div>
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Code className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Developer Resources</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text-animated">Coding Materials</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover high-quality code snippets, templates, and components for your projects
            </p>
          </div>

          {/* Fresh Advanced Search System */}
          <div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-2xl border-2 border-border/50 p-4 sm:p-6 mb-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="space-y-4">
              {/* Main Search Bar with Icon */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <Search className="text-primary w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <Input
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search anything... (title, content, author, category)"
                  className="pl-12 pr-12 h-14 text-base border-2 focus:border-primary rounded-xl bg-background/80 backdrop-blur-sm shadow-inner hover:shadow-lg transition-all duration-300 font-medium"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-9 w-9 p-0 rounded-full hover:bg-destructive/20 hover:text-destructive hover:scale-110 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>

              {/* Quick Actions Row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Category Filter */}
                <div className="flex-1 min-w-[200px]">
                  <Select value={selectedCategory || 'all'} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="h-11 border-2 rounded-xl bg-background/80 backdrop-blur-sm hover:border-primary transition-all">
                      <Filter className="w-4 h-4 mr-2 text-primary" />
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear All Button */}
                {(searchQuery || selectedCategory) && (
                  <Button 
                    variant="outline" 
                    onClick={clearSearch} 
                    className="h-11 px-4 rounded-xl border-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all font-semibold"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>

              {/* Active Filters Display */}
              {(searchQuery || selectedCategory) && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/30">
                  <span className="text-sm font-semibold text-muted-foreground">Active filters:</span>
                  {searchQuery && (
                    <Badge variant="default" className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 bg-primary/10 text-primary border border-primary/30">
                      Search: "{searchQuery.substring(0, 30)}{searchQuery.length > 30 ? '...' : ''}"
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery('')}
                        className="h-4 w-4 p-0 hover:bg-primary/20 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  )}
                  {selectedCategory && (
                    <Badge variant="default" className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 bg-accent/10 text-accent-foreground border border-accent/30">
                      Category: {selectedCategory}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearCategory}
                        className="h-4 w-4 p-0 hover:bg-accent/20 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              )}

              {/* Search Hints */}
              {!searchQuery && !selectedCategory && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
                  <span className="text-xs text-muted-foreground">Quick search:</span>
                  {['HTML', 'CSS', 'JavaScript', 'React', 'Templates'].map((term) => (
                    <Badge 
                      key={term}
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary/10 hover:border-primary hover:text-primary transition-all text-xs"
                      onClick={() => setSearchQuery(term)}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results Info */}
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6 p-4 bg-muted/30 rounded-xl border border-border/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <div className="text-sm font-semibold text-foreground">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-pulse text-primary" />
                    Loading materials...
                  </span>
                ) : (
                  <>
                    <span className="text-primary text-lg">{materials.length}</span>
                    <span className="text-muted-foreground"> materials found</span>
                    {searchQuery && <span className="text-muted-foreground"> for "{searchQuery}"</span>}
                  </>
                )}
              </div>
            </div>
            {!loading && materials.length > 0 && (
              <Badge variant="secondary" className="px-3 py-1.5 text-xs font-semibold">
                Page {currentPage} of {totalPages}
              </Badge>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader size="md" text="Loading materials..." />
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
                {materials.map((material, index) => (
                  <div 
                    key={material.id} 
                    className="animate-zoom-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <MaterialCard material={material} />
                  </div>
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