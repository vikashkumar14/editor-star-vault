
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

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Handle preloader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} overflow-x-hidden`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="w-full pt-16"> {/* Added padding-top for fixed navbar */}
          <EnhancedHero />
          <div id="projects">
            <ImageSlider />
          </div>
          {/* Most Downloaded Section - moved right after slider */}
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
