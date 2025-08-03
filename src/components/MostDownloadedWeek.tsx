import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, Star, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useMaterials } from "@/hooks/useMaterials";
import MaterialCard from "./MaterialCard";

const MostDownloadedWeek = () => {
  const { materials, loading } = useMaterials({ limit: 6 });

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Most Downloaded This Week
            </Badge>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              🔥 Popular This Week
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover the most downloaded coding materials from the past week. These trending resources are what developers are using right now.
          </p>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {materials.slice(0, 6).map((material, index) => (
            <div key={material.id} className="animate-fade-in hover-scale">
              <MaterialCard material={material} />
              {index < 3 && (
                <div className="mt-2 flex justify-center">
                  <Badge variant="outline" className="text-xs bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                    #{index + 1} This Week
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/materials">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground border-0 px-8 py-3 hover-scale"
            >
              <Eye className="w-5 h-5 mr-2" />
              View All Materials
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <div className="text-2xl font-bold text-primary mb-2">2.5K+</div>
            <div className="text-sm text-muted-foreground">Downloads Today</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <div className="text-2xl font-bold text-accent mb-2">150+</div>
            <div className="text-sm text-muted-foreground">New This Week</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <div className="text-2xl font-bold text-primary mb-2">45K+</div>
            <div className="text-sm text-muted-foreground">Active Developers</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <div className="text-2xl font-bold text-accent mb-2">99%</div>
            <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MostDownloadedWeek;