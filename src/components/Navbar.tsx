
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X, Moon, Sun, User, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar = ({ darkMode, toggleDarkMode }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">The Editor Star</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Video Editing Materials</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors">Home</a>
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors">Materials</a>
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors">Blog</a>
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors">About</a>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search materials..." 
                className="pl-10 w-64 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="text-gray-600 dark:text-gray-400"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            <Button variant="outline" className="hidden sm:flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Login</span>
            </Button>
            
            <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white">
              <Download className="w-4 h-4 mr-2" />
              Downloads
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-slate-700">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search materials..." 
                  className="pl-10 w-full bg-gray-50 dark:bg-slate-800"
                />
              </div>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-red-500 py-2">Home</a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-red-500 py-2">Materials</a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-red-500 py-2">Blog</a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-red-500 py-2">About</a>
              <Button variant="outline" className="justify-start">
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
