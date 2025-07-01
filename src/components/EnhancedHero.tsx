
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Star, Users, Play, Sparkles, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const EnhancedHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const slides = [
    {
      title: "Create Amazing Content",
      subtitle: "Premium materials for professional creators",
      description: "Access thousands of high-quality resources",
      gradient: "from-purple-600 via-blue-600 to-indigo-600",
      background: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Developer Tools & Resources",
      subtitle: "Code templates and development assets",
      description: "Everything you need for modern web development",
      gradient: "from-green-600 via-teal-600 to-blue-600",
      background: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Creative Solutions",
      subtitle: "Design assets and visual elements",
      description: "Premium UI kits and creative resources",
      gradient: "from-orange-600 via-red-600 to-pink-600",
      background: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Typing effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.background})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
          </div>
        ))}
      </div>

      {/* 3D Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/20 rounded-full blur-lg animate-float-delayed"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-pink-500/20 rounded-full blur-xl animate-float-slow"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Animated Badge */}
          <div className="inline-flex items-center space-x-2 glass-effect rounded-full px-6 py-3 mb-8 border border-white/20">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-white font-medium">Welcome to Gyaan Repo</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          </div>

          {/* Main Title with Typing Effect */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            <span className="block">
              {slides[currentSlide].title.split(' ').map((word, index) => (
                <span
                  key={index}
                  className={`inline-block mr-4 animate-slide-in-3d`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {word}
                </span>
              ))}
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r ${slides[currentSlide].gradient} bg-clip-text text-transparent font-semibold mb-6 animate-fade-in`}>
            {slides[currentSlide].subtitle}
          </p>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            {slides[currentSlide].description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <Button
              onClick={() => scrollToSection('materials')}
              size="lg"
              className={`bg-gradient-to-r ${slides[currentSlide].gradient} hover:opacity-90 text-white px-10 py-4 text-lg shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-0 animate-bounce-in-3d`}
            >
              <Download className="mr-3 h-5 w-5" />
              View Profile
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>

            <Button
              onClick={() => scrollToSection('projects')}
              variant="outline"
              size="lg"
              className="px-10 py-4 text-lg border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transform hover:-translate-y-1 transition-all duration-300 animate-scale-rotate-3d"
            >
              <Play className="mr-3 h-5 w-5" />
              View Projects
            </Button>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-3 mb-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? `bg-gradient-to-r ${slides[currentSlide].gradient} scale-125`
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 text-white/70 mx-auto" />
          </div>
        </div>
      </div>

      {/* Parallax Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>
    </div>
  );
};

export default EnhancedHero;
