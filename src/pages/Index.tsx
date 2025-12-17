import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AnimatedStats from "@/components/AnimatedStats";
import TrendingSection from "@/components/TrendingSection";
import FeaturedMaterials from "@/components/FeaturedMaterials";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import FloatingChat from "@/components/FloatingChat";
import BackToTop from "@/components/BackToTop";
import ImageSlider from "@/components/ImageSlider";
import { Badge } from "@/components/ui/badge";
import { Code, Layers, Download, Users, Star, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
        <div className="container mx-auto max-w-7xl px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Code, value: '500+', label: 'Code Snippets', color: 'primary' },
              { icon: Layers, value: '1000+', label: 'AI Images', color: 'accent' },
              { icon: Users, value: '10K+', label: 'Developers', color: 'primary' },
              { icon: Star, value: '4.9', label: 'Rating', color: 'accent' },
            ].map((stat, index) => (
              <div 
                key={index} 
                className="glass-card rounded-2xl p-6 text-center card-3d group"
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-3 text-${stat.color} group-hover:scale-110 transition-transform`} />
                <h3 className="text-3xl md:text-4xl font-extrabold gradient-text mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              <Zap className="w-3 h-3 mr-1" />
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">
              Everything you need to{" "}
              <span className="gradient-text">build faster</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Premium resources curated for developers who want to ship quality products quickly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Code,
                title: 'Code Snippets',
                description: 'Ready-to-use HTML, CSS, and JavaScript code that you can copy and paste into your projects.',
                gradient: 'from-primary to-purple-600'
              },
              {
                icon: Layers,
                title: 'UI Components',
                description: 'Beautiful, responsive components built with modern frameworks and best practices.',
                gradient: 'from-accent to-cyan-400'
              },
              {
                icon: Download,
                title: 'Instant Downloads',
                description: 'No signup required. Download resources instantly and start building right away.',
                gradient: 'from-green-500 to-emerald-400'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="glass-card rounded-2xl p-8 card-3d glow-border group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
        <div className="orb orb-primary w-[300px] h-[300px] -top-20 left-1/4 animate-float" />
        <div className="orb orb-accent w-[250px] h-[250px] -bottom-20 right-1/4 animate-float-delayed" />
        
        <div className="container mx-auto max-w-4xl px-4 relative text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6">
            Ready to <span className="gradient-text">get started?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already using Gyaan Repo to build amazing projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/materials">
              <Button 
                size="lg" 
                className="px-8 py-6 text-base font-bold rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground btn-3d group"
              >
                Browse Resources
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/gallery">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 text-base font-bold rounded-xl border-2"
              >
                Explore Gallery
              </Button>
            </Link>
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
        <Testimonials />
        <Newsletter />
        <Footer />
      </div>
      
      <FloatingChat />
      <BackToTop />
    </div>
  );
};

export default Index;
