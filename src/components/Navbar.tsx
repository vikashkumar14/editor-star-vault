
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Moon, Sun, Menu, X, User, Shield, Code } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar = ({ darkMode, toggleDarkMode }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (debouncedSearchQuery.trim()) {
      navigate(`/materials?search=${encodeURIComponent(debouncedSearchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg dark:shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Logo + Brand Name */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="https://i.ibb.co/XkjPcgsv/icon.jpg"
                alt="Gyaan Repo Logo"
                className="h-8 w-8 rounded-md"
              />
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Gyaan Repo
              </span>
            </Link>
            
            {/* Developer Name - Hidden on mobile */}
            <div className="hidden lg:flex items-center ml-8 pl-8 border-l border-gray-300 dark:border-gray-700">
              <Code className="w-4 h-4 text-primary dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Developed by <span className="font-semibold text-primary dark:text-blue-400">Vikash Kumar Kushwaha</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/materials" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 font-medium">
              Materials
            </Link>
            <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 font-medium">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 font-medium">
              Contact
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search - hidden on mobile */}
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-48 md:w-64 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-primary focus:border-primary"
              />
            </form>
            
            {/* Login button - simplified on mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 hidden sm:flex"
            >
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>

            {/* Mobile login icon only */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 sm:hidden"
            >
              <User className="w-5 h-5" />
            </Button>

            {/* Admin button - simplified on mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin-login')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 hidden sm:flex"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Button>

            {/* Mobile admin icon only */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin-login')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 sm:hidden"
            >
              <Shield className="w-5 h-5" />
            </Button>
            
            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Mobile menu button - ALWAYS VISIBLE */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 p-2"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-primary focus:border-primary"
                />
              </form>

              {/* Developer info on mobile */}
              <div className="lg:hidden px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Code className="w-4 h-4 text-primary dark:text-primary mr-2" />
                  <span>Developed by <span className="font-semibold text-primary dark:text-primary">Vikash Kumar Kushwaha</span></span>
                </div>
              </div>

              <Link
                to="/materials"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Materials
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4 inline mr-2" />
                Login
              </Link>

              <Link
                to="/admin-login"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <Shield className="w-4 h-4 inline mr-2" />
                Admin Login
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
