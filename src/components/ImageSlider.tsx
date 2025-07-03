
import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Code, Palette, Zap, Star } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

const ImageSlider = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const slides = [
    {
      id: 1,
      image: "/lovable-uploads/8fdfe09d-657a-4222-9c71-abd89c2ef864.png",
      title: "Meet Vikash Kumar Kushwaha",
      subtitle: "Full Stack Developer & Creative Designer",
      description: "Passionate developer creating amazing web experiences with modern technologies",
      features: ["React & TypeScript", "UI/UX Design", "Full Stack Development", "Creative Solutions"],
      gradient: "from-purple-600 via-blue-600 to-indigo-600",
      profileUrl: "https://github.com/vikashkumar14",
      projectsUrl: "https://vikashkushwaha.dev/projects"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      title: "Premium Development Tools",
      subtitle: "Professional Code Templates & Components",
      description: "Access thousands of high-quality code snippets, templates, and development resources",
      features: ["HTML/CSS Templates", "JavaScript Libraries", "React Components", "API Integrations"],
      gradient: "from-green-600 via-teal-600 to-blue-600",
      profileUrl: "/materials",
      projectsUrl: "/materials"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      title: "Creative Resources Hub",
      subtitle: "Design Assets & Visual Elements",
      description: "Discover premium design resources, UI kits, and creative assets for your projects",
      features: ["UI Design Kits", "Icon Collections", "Color Palettes", "Typography Sets"],
      gradient: "from-orange-600 via-red-600 to-pink-600",
      profileUrl: "/materials",
      projectsUrl: "/materials"
    }
  ];

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleProfileClick = (profileUrl: string) => {
    if (profileUrl.startsWith('http')) {
      window.open(profileUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = profileUrl;
    }
  };

  const handleProjectsClick = (projectsUrl: string) => {
    if (projectsUrl.startsWith('http')) {
      window.open(projectsUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = projectsUrl;
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
          <Star className="w-4 h-4 mr-2" />
          Featured Developer
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Developer Showcase
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explore our featured developer's work and premium resources
        </p>
      </div>

      <Carousel 
        setApi={setApi} 
        className="w-full"
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <Card className="border-0 overflow-hidden bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-lg shadow-2xl">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-2 gap-0 min-h-[500px]">
                    {/* Image Section */}
                    <div className="relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-20`}></div>
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="mb-6">
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {slide.title}
                        </h3>
                        <p className={`text-lg font-semibold bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent mb-4`}>
                          {slide.subtitle}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {slide.description}
                        </p>
                      </div>

                      {/* Features Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-8">
                        {slide.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-lg p-3 transition-all duration-300 hover:bg-white/80 dark:hover:bg-slate-700/80"
                          >
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${slide.gradient}`}></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          className={`bg-gradient-to-r ${slide.gradient} hover:opacity-90 text-white border-0 shadow-lg transform hover:-translate-y-1 transition-all duration-300`}
                          onClick={() => handleProfileClick(slide.profileUrl)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                        <Button
                          variant="outline"
                          className="border-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-950/30 dark:hover:to-blue-950/30 transform hover:-translate-y-1 transition-all duration-300"
                          onClick={() => handleProjectsClick(slide.projectsUrl)}
                        >
                          <Code className="w-4 h-4 mr-2" />
                          View Projects
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 border-2 shadow-lg" />
        <CarouselNext className="right-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 border-2 shadow-lg" />
      </Carousel>

      {/* Carousel Indicators */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current - 1
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 scale-125'
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
