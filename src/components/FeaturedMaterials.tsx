
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, Star, Play, Layers, Palette, Music, Zap } from "lucide-react";

const FeaturedMaterials = () => {
  const categories = [
    {
      title: "Video Overlays",
      description: "Professional overlays for stunning visual effects",
      icon: Layers,
      count: "150+ Items",
      color: "from-blue-500 to-cyan-500",
      items: ["Light Leaks", "Film Grain", "Dust Particles", "Bokeh Effects"]
    },
    {
      title: "Color LUTs",
      description: "Cinematic color grading presets",
      icon: Palette,
      count: "80+ Presets",
      color: "from-purple-500 to-pink-500",
      items: ["Cinematic", "Vintage", "Modern", "Film Emulation"]
    },
    {
      title: "Sound Effects",
      description: "High-quality audio for your projects",
      icon: Music,
      count: "200+ Sounds",
      color: "from-green-500 to-teal-500",
      items: ["Whooshes", "Impacts", "Ambient", "Musical Stingers"]
    },
    {
      title: "Transitions",
      description: "Smooth transitions for seamless editing",
      icon: Zap,
      count: "120+ Effects",
      color: "from-orange-500 to-red-500",
      items: ["Wipes", "Zooms", "Slides", "Creative"]
    }
  ];

  const featuredItems = [
    {
      title: "Cinematic LUTs Pack Vol.3",
      description: "Professional color grading for films",
      downloads: "2.1K",
      rating: 4.9,
      image: "bg-gradient-to-br from-purple-600 to-blue-600",
      price: "Free",
      software: ["Premiere Pro", "DaVinci Resolve"]
    },
    {
      title: "Light Leak Overlays",
      description: "Premium light effects collection",
      downloads: "3.5K",
      rating: 4.8,
      image: "bg-gradient-to-br from-yellow-500 to-orange-600",
      price: "Free",
      software: ["After Effects", "Premiere Pro"]
    },
    {
      title: "Cinematic Transitions",
      description: "Hollywood-style transition effects",
      downloads: "1.8K",
      rating: 5.0,
      image: "bg-gradient-to-br from-red-500 to-pink-600",
      price: "Free",
      software: ["Final Cut Pro", "Premiere Pro"]
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 mb-4">
            Featured Collections
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Premium Editing Materials
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover our handpicked collection of professional-grade editing materials used in The Editor Star tutorials
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-hover bg-white dark:bg-slate-800">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {category.description}
                  </CardDescription>
                  <Badge variant="secondary" className="w-fit mx-auto">
                    {category.count}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.items.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 hover:bg-gray-50 dark:hover:bg-slate-700">
                    Browse Category
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Items */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Most Downloaded This Week
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Popular materials from our community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-hover overflow-hidden bg-white dark:bg-slate-800">
                <div className={`h-48 ${item.image} flex items-center justify-center relative`}>
                  <Play className="w-12 h-12 text-white/80 hover:text-white transition-colors cursor-pointer" />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/20 text-white border-0">
                      {item.price}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        {item.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>{item.downloads}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.software.map((soft, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {soft}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 py-4 text-lg border-2 hover:bg-gray-50 dark:hover:bg-slate-800"
          >
            View All Materials
            <span className="ml-2">→</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMaterials;
