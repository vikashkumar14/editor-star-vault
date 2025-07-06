
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Palette, 
  Zap, 
  Database, 
  Globe, 
  Smartphone, 
  GitBranch, 
  Layers,
  ArrowRight,
  Star,
  Download
} from "lucide-react";

const DeveloperFeatures = () => {
  const features = [
    {
      icon: Code,
      title: "Web Development",
      description: "Full-stack web applications with modern frameworks",
      skills: ["React", "TypeScript", "Node.js", "Next.js"],
      color: "from-blue-500 to-indigo-500",
      projects: 50
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Beautiful and intuitive user interface designs",
      skills: ["Figma", "Tailwind CSS", "Material UI", "Framer Motion"],
      color: "from-purple-500 to-pink-500",
      projects: 35
    },
    {
      icon: Database,
      title: "Backend Development",
      description: "Scalable server-side applications and APIs",
      skills: ["PostgreSQL", "Supabase", "REST APIs", "GraphQL"],
      color: "from-green-500 to-teal-500",
      projects: 25
    },
    {
      icon: Smartphone,
      title: "Mobile Development",
      description: "Cross-platform mobile applications",
      skills: ["React Native", "Flutter", "iOS", "Android"],
      color: "from-orange-500 to-red-500",
      projects: 20
    },
    {
      icon: Globe,
      title: "Web3 & Blockchain",
      description: "Decentralized applications and smart contracts",
      skills: ["Ethereum", "Solidity", "Web3.js", "DeFi"],
      color: "from-cyan-500 to-blue-500",
      projects: 15
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "High-performance applications and optimization",
      skills: ["Performance", "SEO", "PWA", "Caching"],
      color: "from-yellow-500 to-orange-500",
      projects: 30
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 text-sm">
          <Star className="w-4 h-4 mr-2" />
          Developer Expertise
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Technical <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">Expertise</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Vikash Kumar Kushwaha brings years of experience in modern web development, 
          creating scalable applications with cutting-edge technologies
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card 
              key={index} 
              className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/20 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <Badge variant="secondary" className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 text-gray-700 dark:text-gray-300">
                    {feature.projects}+ Projects
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {feature.skills.map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 rounded-lg px-3 py-2 text-center"
                    >
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    size="sm" 
                    className={`flex-1 bg-gradient-to-r ${feature.color} hover:opacity-90 text-white border-0 shadow-md group-hover:shadow-lg transition-all duration-300`}
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Opening GitHub repository...');
                      window.open('https://github.com/vikashkumar14?tab=repositories', '_blank', 'noopener,noreferrer');
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    View Work
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-950/30 dark:hover:to-blue-950/30"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Opening GitHub repository...');
                      window.open('https://github.com/vikashkumar14?tab=repositories', '_blank', 'noopener,noreferrer');
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 shadow-2xl">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Build Something Amazing?
          </h3>
          <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
            Get access to premium development resources, templates, and tools created by Vikash Kumar Kushwaha
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                console.log('Opening GitHub projects...');
                window.open('https://github.com/vikashkumar14?tab=repositories', '_blank', 'noopener,noreferrer');
              }}
            >
              <GitBranch className="w-5 h-5 mr-2" />
              Explore Projects
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold px-8 py-3 backdrop-blur-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                console.log('Navigating to materials...');
                window.location.href = '/materials';
              }}
            >
              <Layers className="w-5 h-5 mr-2" />
              Get Templates
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperFeatures;
