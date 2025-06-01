
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Fire, Download, Eye, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";

const TrendingSection = () => {
  const trendingItems = [
    {
      id: 1,
      title: "Cinematic Color LUTs Pack",
      category: "Color Grading",
      downloads: "15.2K",
      trend: "+125%",
      type: "LUT",
      isHot: true
    },
    {
      id: 2,
      title: "Modern Typography Animations",
      category: "Motion Graphics",
      downloads: "12.8K",
      trend: "+89%",
      type: "Template",
      isHot: true
    },
    {
      id: 3,
      title: "React Component Library",
      category: "Coding",
      downloads: "9.5K",
      trend: "+67%",
      type: "Code",
      isHot: false
    },
    {
      id: 4,
      title: "Glitch Transition Pack",
      category: "Transitions",
      downloads: "8.2K",
      trend: "+54%",
      type: "Effect",
      isHot: false
    }
  ];

  const stats = [
    { icon: Users, label: "Active Creators", value: "2.5K+", color: "text-blue-500" },
    { icon: Download, label: "This Week", value: "45K", color: "text-green-500" },
    { icon: Star, label: "Top Rated", value: "4.9★", color: "text-yellow-500" },
    { icon: Eye, label: "Views Today", value: "125K", color: "text-purple-500" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full px-6 py-2 mb-4">
            <Fire className="w-4 h-4" />
            <span className="font-medium">Trending Now</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What's Popular This Week
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the most downloaded materials and trending content in our community
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="text-center border-0 shadow-lg card-hover bg-white dark:bg-slate-800">
                <CardContent className="p-6">
                  <IconComponent className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trending Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trendingItems.map((item, index) => (
            <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-hover overflow-hidden bg-white dark:bg-slate-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant={item.type === 'Code' ? 'default' : 'secondary'}
                    className={item.type === 'Code' ? 'bg-blue-500 text-white' : ''}
                  >
                    {item.type}
                  </Badge>
                  {item.isHot && (
                    <div className="flex items-center space-x-1 text-red-500">
                      <Fire className="w-3 h-3" />
                      <span className="text-xs font-medium">HOT</span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {item.category}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                    <Download className="w-4 h-4" />
                    <span>{item.downloads}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400">
                    <TrendingUp className="w-3 h-3" />
                    <span className="font-medium">{item.trend}</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full hover:bg-gray-50 dark:hover:bg-slate-700">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/materials">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Explore All Trending Materials
              <TrendingUp className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
