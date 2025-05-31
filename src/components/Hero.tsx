
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20" />
      
      {/* Hero content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Professional{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Editing Materials
            </span>
            {" "}for Creators
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Download premium video overlays, LUTs, sound effects, and editing presets. 
            All materials are carefully curated and completely free for personal and commercial use.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link to="/materials">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-3 text-lg"
              >
                Browse Materials
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-3 text-lg border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              <Download className="mr-2 h-5 w-5" />
              Quick Download
            </Button>
          </div>
          
          {/* Stats */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-red-500" />
              <span className="font-semibold">50K+</span>
              <span>Active Users</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-red-500" />
              <span className="font-semibold">1M+</span>
              <span>Downloads</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-red-500" />
              <span className="font-semibold">4.9</span>
              <span>Average Rating</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 text-white dark:text-slate-900"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
