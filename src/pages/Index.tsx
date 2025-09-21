
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import EnhancedHero from "@/components/EnhancedHero";
import ImageSlider from "@/components/ImageSlider";
import DeveloperFeatures from "@/components/DeveloperFeatures";
import FeaturedMaterials from "@/components/FeaturedMaterials";
import MostDownloadedWeek from "@/components/MostDownloadedWeek";
import AnimatedStats from "@/components/AnimatedStats";
import TrendingSection from "@/components/TrendingSection";
import CreatorsShowcase from "@/components/CreatorsShowcase";
import TrustedCreators from "@/components/TrustedCreators";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import FloatingChat from "@/components/FloatingChat";
import BackToTop from "@/components/BackToTop";

interface IndexProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Index = ({ darkMode, toggleDarkMode }: IndexProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Handle preloader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Reduced loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="w-full pt-16">
          <EnhancedHero />
          <div id="projects">
            <ImageSlider />
          </div>
          <MostDownloadedWeek />
          <DeveloperFeatures />
          <AnimatedStats />
          <TrustedCreators />
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
