import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Moon, Sun, Menu, X, User, Shield, Code, Globe, Sparkles } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useLanguage } from "@/hooks/useLanguage";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar = ({ darkMode, toggleDarkMode }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { language, setLanguage, t, languages } = useLanguage();
  const { speak } = useTextToSpeech();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (debouncedSearchQuery.trim()) {
      navigate(`/materials?search=${encodeURIComponent(debouncedSearchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const handleGalleryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const welcomeMessages: { [key: string]: string } = {
      en: "Welcome to Gyaan Repo Gallery! 🎨",
      hi: "ज्ञान रेपो गैलरी में आपका स्वागत है! 🎨",
    };
    const voiceMessages: { [key: string]: string } = {
      en: "Welcome to Gyaan Repo Gallery!",
      hi: "ज्ञान रेपो गैलरी में आपका स्वागत है!",
    };
    toast.success(welcomeMessages[language] || welcomeMessages.en, { duration: 3000 });
    speak(voiceMessages[language] || voiceMessages.en).catch(() => {});
    setTimeout(() => navigate('/gallery'), 300);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/materials', label: t('materials'), onClick: undefined },
    { to: '/gallery', label: t('gallery'), onClick: handleGalleryClick },
    { to: '/faq', label: 'FAQ', onClick: undefined },
    { to: '/about', label: t('about'), onClick: undefined },
    { to: '/contact', label: t('contact'), onClick: undefined },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] glass border-b border-border/30">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 gap-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <img
                src="https://i.ibb.co/XkjPcgsv/icon.jpg"
                alt="Gyaan Repo"
                className="relative h-10 w-10 rounded-xl shadow-lg group-hover:shadow-glow transition-all duration-300 group-hover:scale-105 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/lovable-uploads/8fdfe09d-657a-4222-9c71-abd89c2ef864.png';
                }}
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-lg gradient-text-animated">
                Gyaan Repo
              </span>
              <span className="text-[10px] text-muted-foreground font-medium -mt-1">
                Developer Resources
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center max-w-xl">
            {navLinks.map((link) => (
              link.onClick ? (
                <a
                  key={link.to}
                  href={link.to}
                  onClick={link.onClick}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group
                    ${isActive(link.to) 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive(link.to) && (
                    <span className="absolute inset-0 bg-primary/10 rounded-lg" />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group
                    ${isActive(link.to) 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive(link.to) && (
                    <span className="absolute inset-0 bg-primary/10 rounded-lg" />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              )
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48 lg:w-56 h-9 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-lg transition-all"
              />
            </form>
            
            {/* Login Button - Gradient Pill */}
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-sm btn-3d hover:shadow-glow transition-all duration-300"
            >
              <User className="w-4 h-4" />
              {t('login')}
            </Link>

            {/* Mobile login */}
            <Link
              to="/login"
              className="sm:hidden p-2 rounded-lg bg-secondary/50 hover:bg-primary/10 border border-border/50 text-foreground hover:text-primary transition-all"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Admin Button */}
            <Link
              to="/admin-login"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-primary/30 text-muted-foreground hover:text-foreground font-medium text-sm transition-all duration-300"
            >
              <Shield className="w-4 h-4" />
              {t('admin')}
            </Link>

            {/* Mobile admin */}
            <Link
              to="/admin-login"
              className="sm:hidden p-2 rounded-lg bg-secondary/50 hover:bg-primary/10 border border-border/50 text-muted-foreground hover:text-primary transition-all"
            >
              <Shield className="w-5 h-5" />
            </Link>
            
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-secondary/50 hover:bg-primary/10 border border-border/50 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all duration-300 hover:rotate-12"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg bg-secondary/50 hover:bg-primary/10 border border-border/50 text-foreground transition-all"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="md:hidden animate-slide-up">
            <div className="px-2 pt-2 pb-4 space-y-1 glass-card rounded-xl mt-2 mb-2">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-3 sm:hidden">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-secondary/50 border-border/50"
                />
              </form>

              {/* Language Selector */}
              <div className="px-3 py-2 mb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                  <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
                    <SelectTrigger className="w-full h-9 bg-secondary/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[9999] bg-background border-border max-h-[300px]">
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

              {/* Developer Badge */}
              <div className="px-3 py-3 border-b border-border/50 mb-2 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Code className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>by <span className="font-bold text-primary">Vikash Kumar Kushwaha</span></span>
                </div>
              </div>

              {/* Nav Links */}
              {navLinks.map((link) => (
                link.onClick ? (
                  <a
                    key={link.to}
                    href={link.to}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-all
                      ${isActive(link.to) 
                        ? 'text-primary bg-primary/10' 
                        : 'text-foreground hover:text-primary hover:bg-primary/5'
                      }`}
                    onClick={(e) => {
                      setIsOpen(false);
                      link.onClick(e);
                    }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-all
                      ${isActive(link.to) 
                        ? 'text-primary bg-primary/10' 
                        : 'text-foreground hover:text-primary hover:bg-primary/5'
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              
              <div className="pt-2 border-t border-border/50 space-y-1">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4" />
                  {t('login')}
                </Link>
                <Link
                  to="/admin-login"
                  className="flex items-center gap-2 px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <Shield className="w-4 h-4" />
                  {t('admin')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
