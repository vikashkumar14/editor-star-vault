
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Star, Users, Play, Sparkles, Zap, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ef4444' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Hero content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 mb-6 sm:mb-8 border border-red-200 dark:border-red-800">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">New materials added weekly</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          {/* Mobile-optimized headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
            Create{" "}
            <span className="relative block sm:inline">
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-pulse-glow">
                Stunning
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-lg blur opacity-20 animate-pulse"></div>
            </span>
            <span className="block sm:inline"> Content</span>
          </h1>
          
          {/* Mobile-optimized subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-2">
            Download premium video overlays, LUTs, sound effects, coding resources, and editing presets. 
            All materials are <span className="font-semibold text-red-600 dark:text-red-400">100% free</span> for personal and commercial use.
          </p>
          
          {/* Mobile-optimized CTA buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
            <Link to="/materials" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Explore Materials
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:border-gray-600 dark:hover:bg-gradient-to-r dark:hover:from-red-950/30 dark:hover:to-orange-950/30 transform hover:-translate-y-1 transition-all duration-300"
            >
              <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Watch Tutorial
            </Button>
          </div>
          
          {/* Mobile-optimized feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 px-2">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50 card-hover">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2">Instant Download</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">One-click downloads with MediaFire links</p>
            </div>
            
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50 card-hover">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2">100% Free</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">No hidden costs or premium accounts</p>
            </div>
            
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50 card-hover sm:col-span-1 col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2">High Quality</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Professional-grade materials</p>
            </div>
          </div>
          
          {/* Mobile-optimized stats */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2 sm:gap-3 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
              <span className="font-semibold text-lg sm:text-2xl">50K+</span>
              <span className="text-sm sm:text-base">Users</span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <Download className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
              <span className="font-semibold text-lg sm:text-2xl">1M+</span>
              <span className="text-sm sm:text-base">Downloads</span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
              <span className="font-semibold text-lg sm:text-2xl">4.9</span>
              <span className="text-sm sm:text-base">Rating</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 sm:h-16 text-white dark:text-slate-900"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="currentColor"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            fill="currentColor"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
