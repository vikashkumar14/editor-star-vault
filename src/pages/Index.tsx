
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AnimatedStats from "@/components/AnimatedStats";
import TrendingSection from "@/components/TrendingSection";
import FeaturedMaterials from "@/components/FeaturedMaterials";
import CreatorsShowcase from "@/components/CreatorsShowcase";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import FloatingChat from "@/components/FloatingChat";
import BackToTop from "@/components/BackToTop";
import { ArrowRight, Code, Palette, Zap, Download, Users, Star } from "lucide-react";

interface IndexProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Index = ({ darkMode, toggleDarkMode }: IndexProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        {/* Modern Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />
          </div>

          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-8 animate-fade-in">
              {/* Badge */}
              <Badge className="mx-auto px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                <Zap className="w-4 h-4 mr-2 inline" />
                New: AI-Powered Image Gallery
              </Badge>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Creative Resources
                </span>
                <br />
                <span className="text-foreground">For Developers</span>
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Access premium code snippets, design templates, and AI-generated images. 
                Everything you need to build stunning web projects.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button 
                  size="lg" 
                  className="px-8 py-6 text-lg group bg-primary hover:bg-primary/90"
                  onClick={() => navigate('/materials')}
                >
                  Explore Resources
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-6 text-lg"
                  onClick={() => navigate('/gallery')}
                >
                  <Palette className="mr-2 w-5 h-5" />
                  View Gallery
                </Button>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-4 justify-center pt-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                  <Code className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">HTML, CSS, JS</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                  <Palette className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">AI Images</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                  <Download className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Free Downloads</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Community</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats Bar */}
        <section className="py-12 bg-muted/30 border-y">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Code className="w-6 h-6 text-primary" />
                  <h3 className="text-3xl font-bold text-foreground">500+</h3>
                </div>
                <p className="text-sm text-muted-foreground">Code Snippets</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Palette className="w-6 h-6 text-primary" />
                  <h3 className="text-3xl font-bold text-foreground">1000+</h3>
                </div>
                <p className="text-sm text-muted-foreground">AI Images</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  <h3 className="text-3xl font-bold text-foreground">10K+</h3>
                </div>
                <p className="text-sm text-muted-foreground">Developers</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Star className="w-6 h-6 text-primary" />
                  <h3 className="text-3xl font-bold text-foreground">4.9</h3>
                </div>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <div className="w-full">
          <AnimatedStats />
          <div id="materials">
            <TrendingSection />
            <FeaturedMaterials />
          </div>
          <CreatorsShowcase />
          <Testimonials />
          <Newsletter />
          <Footer />
        </div>
        
        <FloatingChat />
        <BackToTop />
      </div>
    </div>
  );
};

export default Index;
