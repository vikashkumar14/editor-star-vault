
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedMaterials from "@/components/FeaturedMaterials";
import StatsSection from "@/components/StatsSection";
import TrendingSection from "@/components/TrendingSection";
import CreatorsShowcase from "@/components/CreatorsShowcase";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Hero />
        <StatsSection />
        <TrendingSection />
        <FeaturedMaterials />
        <CreatorsShowcase />
        <Newsletter />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
