
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, Star, Play, Layers, Palette, Music, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useMaterials } from "@/hooks/useMaterials";
import { useCategories } from "@/hooks/useCategories";
import MaterialCard from "./MaterialCard";

const FeaturedMaterials = () => {
  const { materials: featuredMaterials, loading: materialsLoading } = useMaterials({ featured: true });
  const { categories, loading: categoriesLoading } = useCategories();

  const iconMap: { [key: string]: any } = {
    'layers': Layers,
    'palette': Palette,
    'music': Music,
    'zap': Zap,
    'settings': Zap,
    'file-text': Layers
  };

  const colorMap: { [key: string]: string } = {
    'Video Overlays': 'from-blue-500 to-cyan-500',
    'Color LUTs': 'from-purple-500 to-pink-500',
    'Sound Effects': 'from-green-500 to-teal-500',
    'Transitions': 'from-orange-500 to-red-500',
    'Presets': 'from-yellow-500 to-orange-500',
    'Templates': 'from-indigo-500 to-purple-500'
  };

  if (materialsLoading || categoriesLoading) {
    return (
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 mb-4">
            Featured Collections
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Premium Coding Materials
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our handpicked collection of professional-grade coding resources, templates, and projects
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categories.slice(0, 4).map((category, index) => {
            const IconComponent = iconMap[category.icon] || Layers;
            const colorClass = colorMap[category.name] || 'from-gray-500 to-gray-600';
            const materialCount = featuredMaterials.filter(m => m.category === category.name).length;
            
            return (
              <Card key={category.id} className="material-card bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${colorClass} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{category.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {category.description}
                  </CardDescription>
                  <Badge variant="secondary" className="w-fit mx-auto">
                    {materialCount} Items
                  </Badge>
                </CardHeader>
                <CardContent>
                  <Link to="/materials">
                    <Button variant="outline" className="w-full bg-primary/5 hover:bg-primary hover:text-primary-foreground border-primary/30 hover:border-primary transition-all duration-300">
                      Browse Category
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Items */}
        <div className="space-y-8">
          <div className="text-center animate-slide-up">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Most Downloaded This Week
            </h3>
            <p className="text-muted-foreground">
              Popular materials from our community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMaterials.slice(0, 3).map((material, index) => (
              <div key={material.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.15}s` }}>
                <MaterialCard material={material} />
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 animate-bounce-in">
          <Link to="/materials">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-0"
            >
              View All Materials
              <span className="ml-2">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMaterials;
