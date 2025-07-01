
import { useState, useEffect, useRef } from 'react';
import { Users, Download, Star, Code, Award, Globe } from 'lucide-react';

const AnimatedStats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    users: 0,
    downloads: 0,
    rating: 0,
    projects: 0,
    awards: 0,
    countries: 0
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  const targetCounts = {
    users: 50000,
    downloads: 2000000,
    rating: 4.9,
    projects: 150,
    awards: 25,
    countries: 45
  };

  const stats = [
    { key: 'users', icon: Users, label: 'Happy Users', suffix: '+', color: 'from-purple-500 to-pink-500' },
    { key: 'downloads', icon: Download, label: 'Downloads', suffix: '+', color: 'from-blue-500 to-cyan-500' },
    { key: 'rating', icon: Star, label: 'Rating', suffix: '/5', color: 'from-yellow-500 to-orange-500' },
    { key: 'projects', icon: Code, label: 'Projects', suffix: '+', color: 'from-green-500 to-teal-500' },
    { key: 'awards', icon: Award, label: 'Awards', suffix: '+', color: 'from-red-500 to-pink-500' },
    { key: 'countries', icon: Globe, label: 'Countries', suffix: '+', color: 'from-indigo-500 to-purple-500' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setCounts({
          users: Math.floor(targetCounts.users * progress),
          downloads: Math.floor(targetCounts.downloads * progress),
          rating: parseFloat((targetCounts.rating * progress).toFixed(1)),
          projects: Math.floor(targetCounts.projects * progress),
          awards: Math.floor(targetCounts.awards * progress),
          countries: Math.floor(targetCounts.countries * progress)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setCounts(targetCounts);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  const formatNumber = (num: number, key: string) => {
    if (key === 'rating') return num.toFixed(1);
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Trusted by Creators Worldwide
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of creators who trust Gyaan Repo for their content creation needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.key}
                className={`glass-effect rounded-3xl p-8 text-center transform hover:-translate-y-2 transition-all duration-300 animate-fade-in border border-white/20 dark:border-slate-700/50`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {formatNumber(counts[stat.key as keyof typeof counts], stat.key)}{stat.suffix}
                </div>
                
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AnimatedStats;
