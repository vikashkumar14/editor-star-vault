
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Star, Users, Play, Sparkles, Zap, Gift, Film, Palette, Music } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Enhanced animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23667eea' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating particles animation */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-4 h-4 bg-purple-400 rounded-full opacity-30 animate-float"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full opacity-20 animate-float-delayed"></div>
          <div className="absolute top-60 left-1/4 w-2 h-2 bg-indigo-400 rounded-full opacity-40 animate-float"></div>
          <div className="absolute bottom-40 right-1/3 w-5 h-5 bg-pink-400 rounded-full opacity-25 animate-float-delayed"></div>
        </div>
      </div>
      
      {/* Hero content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
        <div className="text-center">
          {/* Enhanced badge with animation */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 backdrop-blur-sm rounded-full px-4 sm:px-6 py-3 mb-6 sm:mb-8 border border-purple-200 dark:border-purple-700 shadow-lg">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
              <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Premium materials added weekly
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Enhanced headline with better typography */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 leading-tight">
            Create{" "}
            <span className="relative block sm:inline">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-shift">
                Amazing
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-lg blur-xl opacity-20 animate-pulse"></div>
            </span>
            <span className="block sm:inline"> Content</span>
          </h1>
          
          {/* Enhanced subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 max-w-4xl mx-auto leading-relaxed px-2">
            Access thousands of premium{" "}
            <span className="font-semibold text-purple-600 dark:text-purple-400">video overlays</span>, 
            <span className="font-semibold text-blue-600 dark:text-blue-400"> LUTs</span>, 
            <span className="font-semibold text-indigo-600 dark:text-indigo-400"> sound effects</span>, and 
            <span className="font-semibold text-pink-600 dark:text-pink-400"> editing presets</span>. 
            All materials are <span className="font-bold text-green-600 dark:text-green-400">100% free</span> for personal and commercial use.
          </p>
          
          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-12 sm:mb-16 px-4">
            <Link to="/materials" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white px-10 py-4 text-lg shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 transition-all duration-300 border-0"
              >
                <Download className="mr-3 h-5 w-5" />
                Explore Materials
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto px-10 py-4 text-lg border-2 border-purple-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:border-purple-600 dark:hover:bg-gradient-to-r dark:hover:from-purple-950/30 dark:hover:to-blue-950/30 transform hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
            >
              <Play className="mr-3 h-5 w-5" />
              Watch Tutorials
            </Button>
          </div>
          
          {/* Enhanced feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 px-2">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 card-hover shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Film className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Video Overlays</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Professional effects & transitions</p>
            </div>
            
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 card-hover shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Palette className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Color LUTs</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Cinema-grade color grading</p>
            </div>
            
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 card-hover shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Music className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Sound Effects</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">High-quality audio assets</p>
            </div>
            
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 card-hover shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Instant Access</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">One-click downloads</p>
            </div>
          </div>
          
          {/* Enhanced stats with better styling */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-white/20">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <Users className="h-5 w-5 text-purple-600" />
              <span className="font-bold text-2xl text-gray-900 dark:text-white">50K+</span>
              <span className="font-medium">Creators</span>
            </div>
            
            <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-white/20">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <Download className="h-5 w-5 text-blue-600" />
              <span className="font-bold text-2xl text-gray-900 dark:text-white">2M+</span>
              <span className="font-medium">Downloads</span>
            </div>
            
            <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-white/20">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <Star className="h-5 w-5 text-yellow-600" />
              <span className="font-bold text-2xl text-gray-900 dark:text-white">4.9</span>
              <span className="font-medium">Rating</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 sm:h-20 text-white dark:text-slate-900"
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
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-10deg); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;
