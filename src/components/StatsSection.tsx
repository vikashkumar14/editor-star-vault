
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Users, Star, Play } from "lucide-react";

const StatsSection = () => {
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalDownloads: 0,
    averageRating: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total materials count
        const { count: materialsCount } = await supabase
          .from('content')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');

        // Get total downloads and average rating
        const { data: materialsData } = await supabase
          .from('content')
          .select('downloads_count, rating')
          .eq('status', 'published');

        const totalDownloads = materialsData?.reduce((sum, item) => sum + (item.downloads_count || 0), 0) || 0;
        const averageRating = materialsData?.length 
          ? materialsData.reduce((sum, item) => sum + (item.rating || 0), 0) / materialsData.length
          : 0;

        // Get total downloads records (unique users estimation)
        const { count: downloadsCount } = await supabase
          .from('downloads')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalMaterials: materialsCount || 0,
          totalDownloads,
          averageRating: Math.round(averageRating * 10) / 10,
          totalUsers: downloadsCount || 0 // This is an approximation
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      icon: Download,
      label: "Total Downloads",
      value: loading ? "..." : stats.totalDownloads.toLocaleString(),
      description: "Materials downloaded",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Star,
      label: "Premium Materials",
      value: loading ? "..." : stats.totalMaterials.toString(),
      description: "High-quality assets",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Users,
      label: "Happy Creators",
      value: loading ? "..." : `${Math.floor(stats.totalUsers / 10)}K+`,
      description: "Content creators served",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Play,
      label: "Average Rating",
      value: loading ? "..." : `${stats.averageRating}/5`,
      description: "User satisfaction",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 mb-4">
            Our Impact
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Content Creators Worldwide
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of creators who trust The Editor Star for their editing needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-lg card-hover bg-white dark:bg-slate-800">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            "The Editor Star has completely transformed my editing workflow. The quality of materials is unmatched!"
          </p>
          <div className="mt-4">
            <p className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Professional Video Editor</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
