
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Moon, Sun, Menu, X, User, Shield, Code, Globe } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useLanguage } from "@/hooks/useLanguage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar = ({ darkMode, toggleDarkMode }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { language, setLanguage, t, languages } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (debouncedSearchQuery.trim()) {
      navigate(`/materials?search=${encodeURIComponent(debouncedSearchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          <div className="flex items-center">
            {/* Logo + Brand Name */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img
                  src="https://i.ibb.co/XkjPcgsv/icon.jpg"
                  alt="Gyaan Repo Logo"
                  className="h-10 w-10 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent group-hover:from-accent group-hover:to-primary transition-all duration-300">
                Gyaan Repo
              </span>
            </Link>
            
            {/* Developer Name - Hidden on mobile */}
            <div className="hidden lg:flex items-center ml-8 pl-8 border-l-2 border-border/30">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                <Code className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">
                  Developed by <span className="font-bold text-primary">Vikash Kumar Kushwaha</span>
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Link to="/materials" className="relative px-4 py-2 text-sm lg:text-base font-semibold text-foreground hover:text-primary transition-all duration-300 group">
              <span className="relative z-10">{t('materials')}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link to="/gallery" className="relative px-4 py-2 text-sm lg:text-base font-semibold text-foreground hover:text-primary transition-all duration-300 group">
              <span className="relative z-10">{t('gallery')}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link to="/about" className="relative px-4 py-2 text-sm lg:text-base font-semibold text-foreground hover:text-primary transition-all duration-300 group">
              <span className="relative z-10">{t('about')}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link to="/contact" className="relative px-4 py-2 text-sm lg:text-base font-semibold text-foreground hover:text-primary transition-all duration-300 group">
              <span className="relative z-10">{t('contact')}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Search - hidden on mobile */}
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48 md:w-64 h-10 bg-muted/50 border-border/50 focus:ring-2 focus:ring-primary focus:border-primary rounded-lg shadow-sm transition-all duration-300"
              />
            </form>
            
            {/* Login button - simplified on mobile */}
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-primary/30 text-foreground hover:text-primary font-semibold transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <User className="w-4 h-4" />
              {t('login')}
            </Link>

            {/* Mobile login icon only */}
            <Link
              to="/login"
              className="sm:hidden p-2 rounded-lg bg-muted/50 hover:bg-primary/10 border border-border/50 hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300 hover:scale-110"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Admin button - simplified on mobile */}
            <Link
              to="/admin-login"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/30 text-foreground hover:text-amber-600 dark:hover:text-amber-400 font-semibold transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <Shield className="w-4 h-4" />
              {t('admin')}
            </Link>

            {/* Mobile admin icon only */}
            <Link
              to="/admin-login"
              className="sm:hidden p-2 rounded-lg bg-muted/50 hover:bg-amber-500/10 border border-border/50 hover:border-amber-500/50 text-foreground hover:text-amber-600 transition-all duration-300 hover:scale-110"
            >
              <Shield className="w-5 h-5" />
            </Link>
            
            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-muted/50 hover:bg-primary/10 border border-border/50 hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:rotate-12"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Mobile menu button - ALWAYS VISIBLE */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg bg-muted/50 hover:bg-primary/10 border border-border/50 hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300 hover:scale-110"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
              
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="relative mb-3 sm:hidden">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-primary focus:border-primary"
                />
              </form>

              {/* Language Selector - Mobile Only */}
              <div className="px-3 py-2 mb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                  <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
                    <SelectTrigger className="w-full h-9 bg-muted/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border max-h-[300px]">
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Developer info on mobile */}
              <div className="lg:hidden px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Code className="w-4 h-4 text-primary dark:text-primary mr-2" />
                  <span>{t('developerBy')} <span className="font-semibold text-primary dark:text-primary">Vikash Kumar Kushwaha</span></span>
                </div>
              </div>

              <Link
                to="/materials"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {t('materials')}
              </Link>
              <Link
                to="/gallery"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {t('gallery')}
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {t('about')}
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {t('contact')}
              </Link>
              
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4 inline mr-2" />
                {t('login')}
              </Link>

              <Link
                to="/admin-login"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <Shield className="w-4 h-4 inline mr-2" />
                {t('admin')}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Search hint */}
      {searchQuery && (
        <div className="absolute left-4 right-4 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
          <p className="px-4 py-2 text-gray-700 dark:text-gray-300">
            Press Enter to search for "{searchQuery}"
          </p>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
