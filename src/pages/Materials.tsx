import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  
  const { materials, loading: materialsLoading, totalPages, totalCount, error: materialsError, retry } = useMaterials({ 
    page: currentPage, 
    limit: 6, 
    category: selectedCategory,
    search: searchTerm
  });
  const { categories, loading: categoriesLoading } = useCategories();

  // Filter categories to show only coding-related ones
  const codingCategories = categories.filter(cat => 
    ['HTML', 'CSS', 'JavaScript', 'Python', 'React', 'Vue', 'Angular', 'Node.js', 'PHP', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin', 'TypeScript', 'Web Development', 'Frontend', 'Backend', 'Full Stack', 'Mobile Development', 'Game Development'].includes(cat.name)
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Search is now handled server-side in the useMaterials hook
  // No need for client-side filtering anymore since we're doing global search
  const displayMaterials = materials || [];

  if (materialsLoading || categoriesLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark' : ''} overflow-x-hidden`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <div className="flex items-center justify-center min-h-[60vh] pt-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading coding materials...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This may take a moment...</p>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  // Handle error state with retry option
  if (materialsError && !materialsLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark' : ''} overflow-x-hidden`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <div className="flex items-center justify-center min-h-[60vh] pt-16">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  Failed to Load Materials
                </h3>
                <p className="text-red-600 dark:text-red-300 mb-4">
                  {materialsError}
                </p>
                <Button 
                  onClick={retry}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Try Again
                </Button>
              </div>
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
        
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-16 py-4 md:py-8"> {/* Added pt-16 for fixed navbar */}
          <div className="text-center mb-6 md:mb-12">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4">
              Professional Coding Materials
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-gray-600 dark:text-gray-300">
              Download high-quality coding resources, templates, and projects for your development journey
            </p>
          </div>

          <div className="mb-4 md:mb-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={isMobile ? "Search materials..." : "Search by title, category, tags, software..."}
                  className="pl-10 pr-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {isMobile && (
                <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4" />
                </Button>
              )}

              {isMobile && (
                <Button variant="outline" size="icon" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                  <Menu className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {!isMobile && (
            <Card className="mb-6 md:mb-8">
              <CardContent className="p-4 md:p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <label htmlFor="category-select-desktop" className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</label>
                    <select
                        id="category-select-desktop"
                        className="px-4 py-2 border rounded-md bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {codingCategories.map((category) => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                        ))}
                    </select>
                </div>
                
                <div className="flex gap-2">
                    <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')} aria-label="Grid View">
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')} aria-label="List View">
                        <List className="h-4 w-4" />
                    </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isMobile && showFilters && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Filter by Category</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <select
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600"
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setShowFilters(false); }}
                >
                  <option value="">All Categories</option>
                  {codingCategories.map((category) => ( <option key={category.id} value={category.name}> {category.name} </option> ))}
                </select>
              </CardContent>
            </Card>
          )}

          {isMobile && showMobileMenu && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">View Options</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => { setViewMode('grid'); setShowMobileMenu(false); }} className="flex-1">
                    <Grid className="h-4 w-4 mr-2" /> Grid
                  </Button>
                  <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => { setViewMode('list'); setShowMobileMenu(false); }} className="flex-1">
                    <List className="h-4 w-4 mr-2" /> List
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">
              {searchTerm ? `Showing results for "${searchTerm}"` : `Showing ${totalCount} coding materials`} 
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </p>
            {(searchTerm || selectedCategory) && (
              <Button variant="outline" size="sm" onClick={() => { 
                setSearchTerm(''); 
                setSelectedCategory(''); 
                setCurrentPage(1);
              }}>
                Clear Filters
              </Button>
            )}
          </div>

          <div className={`grid gap-4 md:gap-6 ${ viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1' }`}>
            {displayMaterials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>

          {displayMaterials.length === 0 && !materialsLoading && !materialsError && (
            <div className="text-center py-12 col-span-full">
              <Search className="w-12 md:w-16 h-12 md:h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-sm md:text-lg mb-2">
                {searchTerm || selectedCategory 
                  ? "No coding materials found matching your criteria."
                  : "No coding materials available yet."
                }
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mb-4">
                {searchTerm || selectedCategory 
                  ? "Try adjusting your search terms or clearing the filters."
                  : "We're working on adding coding materials to the platform."
                }
              </p>
              {(searchTerm || selectedCategory) && (
                <Button onClick={() => { 
                  setSearchTerm(''); 
                  setSelectedCategory(''); 
                  setCurrentPage(1);
                }}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Materials;
