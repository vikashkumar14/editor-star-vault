
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Download, Star, ArrowRight, Youtube } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/10 dark:via-orange-900/10 dark:to-yellow-900/10"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 px-4 py-2">
                <Youtube className="w-4 h-4 mr-2" />
                YouTube Creator
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Professional
                <span className="gradient-text block">Video Editing</span>
                Materials Hub
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Download premium overlays, presets, LUTs, SFX, and transitions from 
                <span className="font-semibold text-red-500"> The Editor Star</span> YouTube channel. 
                Take your video editing to the next level with our curated materials.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">50K+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">1000+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Materials</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">100K+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Downloads</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 text-lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Browse Materials
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg border-2 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Tutorials
              </Button>
            </div>
          </div>

          {/* Right Content - Featured Video */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4 animate-pulse-glow" />
                  <h3 className="text-xl font-semibold mb-2">Latest Tutorial</h3>
                  <p className="text-red-100">Professional Video Editing Tips</p>
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Advanced Color Grading</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Learn professional color grading techniques</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">4.9</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-slate-700 animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Free Download</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Premium LUTs Pack</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-slate-700 animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Premium Quality</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Professional Grade</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
