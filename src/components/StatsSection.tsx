
import { Badge } from "@/components/ui/badge";
import { Download, Users, Star, Eye, Heart, Play } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: "52.3K",
      label: "YouTube Subscribers",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20"
    },
    {
      icon: Download,
      value: "125K+",
      label: "Total Downloads",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: Play,
      value: "2.1M",
      label: "Video Views",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      icon: Star,
      value: "4.9",
      label: "Average Rating",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
    },
    {
      icon: Heart,
      value: "15K+",
      label: "Likes Received",
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20"
    },
    {
      icon: Eye,
      value: "850+",
      label: "Premium Materials",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 mb-4">
            Platform Statistics
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Creators Worldwide
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of video editors who trust The Editor Star for premium editing materials
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 card-hover border border-gray-200 dark:border-slate-700"
              >
                <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Level Up Your Editing?</h3>
            <p className="text-red-100 mb-6 max-w-2xl mx-auto">
              Get access to our complete library of professional editing materials and take your content creation to new heights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-red-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Free Download
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-500 transition-colors">
                View All Materials
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
