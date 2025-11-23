
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
import ImageSlider from "@/components/ImageSlider";
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
        
        {/* Modern Hero Section with Enhanced Design */}
        <section className="relative pt-32 pb-24 px-4 overflow-hidden">
          {/* Enhanced Animated Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-float opacity-60" />
            <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl animate-float-delayed opacity-60" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
          </div>

          <div className="container mx-auto max-w-7xl">
            <div className="text-center space-y-10 animate-fade-in">
              {/* Enhanced Badge with Animation */}
              <Badge className="mx-auto px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-2 border-primary/30 shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105">
                <Zap className="w-4 h-4 mr-2 inline animate-pulse" />
                New: AI-Powered Image Gallery
              </Badge>

              {/* Enhanced Main Heading with Better Gradients */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tight">
                <span className="block mb-3 bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Creative Resources
                </span>
                <span className="block text-foreground drop-shadow-sm">For Developers & Designers</span>
              </h1>

              {/* Enhanced Description */}
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
                Discover premium <span className="text-primary font-bold">code snippets</span>, 
                <span className="text-accent font-bold"> design templates</span>, and 
                <span className="text-purple-500 font-bold"> AI-generated images</span>. 
                Everything you need to build stunning projects.
              </p>

              {/* Enhanced CTA Buttons with Better Styling */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-6">
                <Button 
                  size="lg" 
                  className="px-10 py-7 text-lg font-bold group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/materials')}
                >
                  Explore Resources
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-10 py-7 text-lg font-bold border-2 hover:bg-primary/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/gallery')}
                >
                  <Palette className="mr-2 w-5 h-5" />
                  View Gallery
                </Button>
              </div>

              {/* Enhanced Feature Pills with Better Design */}
              <div className="flex flex-wrap gap-4 justify-center pt-10">
                <div className="flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-muted to-muted/50 rounded-full border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <Code className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold">HTML, CSS, JS</span>
                </div>
                <div className="flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-muted to-muted/50 rounded-full border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <Palette className="w-5 h-5 text-accent" />
                  <span className="text-sm font-semibold">AI Images</span>
                </div>
                <div className="flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-muted to-muted/50 rounded-full border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <Download className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-semibold">Free Downloads</span>
                </div>
                <div className="flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-muted to-muted/50 rounded-full border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold">Community</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Quick Stats Bar */}
        <section className="py-16 bg-gradient-to-r from-muted/40 via-muted/30 to-muted/40 border-y border-border/50 backdrop-blur-sm">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="space-y-3 group">
                <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 transition-all duration-300 group-hover:shadow-lg group-hover:border-primary/30 group-hover:-translate-y-1">
                  <Code className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">500+</h3>
                  <p className="text-sm font-semibold text-muted-foreground">Code Snippets</p>
                </div>
              </div>
              <div className="space-y-3 group">
                <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent border border-accent/10 transition-all duration-300 group-hover:shadow-lg group-hover:border-accent/30 group-hover:-translate-y-1">
                  <Palette className="w-8 h-8 text-accent transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">1000+</h3>
                  <p className="text-sm font-semibold text-muted-foreground">AI Images</p>
                </div>
              </div>
              <div className="space-y-3 group">
                <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/10 transition-all duration-300 group-hover:shadow-lg group-hover:border-purple-500/30 group-hover:-translate-y-1">
                  <Users className="w-8 h-8 text-purple-500 transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-500 to-primary bg-clip-text text-transparent">10K+</h3>
                  <p className="text-sm font-semibold text-muted-foreground">Developers</p>
                </div>
              </div>
              <div className="space-y-3 group">
                <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 transition-all duration-300 group-hover:shadow-lg group-hover:border-primary/30 group-hover:-translate-y-1">
                  <Star className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">4.9</h3>
                  <p className="text-sm font-semibold text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <div className="w-full">
          <ImageSlider />
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
