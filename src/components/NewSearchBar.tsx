import { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from '@/hooks/useCategories';

interface NewSearchBarProps {
  onSearch: (query: string, category?: string) => void;
  onClear: () => void;
  initialQuery?: string;
  initialCategory?: string;
  placeholder?: string;
}

const NewSearchBar = ({ 
  onSearch, 
  onClear, 
  initialQuery = '', 
  initialCategory = '',
  placeholder = 'Search for materials...' 
}: NewSearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [showFilters, setShowFilters] = useState(false);
  const { categories } = useCategories();

  const handleSearch = (searchQuery: string, selectedCategory?: string) => {
    setQuery(searchQuery);
    onSearch(searchQuery, selectedCategory || category);
  };

  const handleClear = () => {
    setQuery('');
    setCategory('');
    onClear();
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    onSearch(query, newCategory);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Main Search Bar */}
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            value={query}
            onChange={(e) => handleSearch(e.target.value, category)}
            placeholder={placeholder}
            className="pl-12 pr-12 h-14 text-lg bg-card border-2 border-border focus:border-primary transition-all duration-200"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="h-14 px-4 border-2"
        >
          <Filter className="w-5 h-5" />
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-card border-2 border-border rounded-lg p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Category
              </label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setCategory('');
                onSearch(query, '');
              }}
              className="text-sm"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Search Stats */}
      {query && (
        <div className="text-sm text-muted-foreground text-center">
          Searching for "{query}"
          {category && ` in ${category}`}
        </div>
      )}
    </div>
  );
};

export default NewSearchBar;