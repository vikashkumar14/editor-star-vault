
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, Download, Award, Code, Palette, Zap, Globe } from "lucide-react";

const About = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section with Developer Image */}
          <div className="text-center mb-16">
            <div className="mb-8">
               <img
                 src="/lovable-uploads/911a6ff2-7f67-4420-9f8f-0ecc1441ac65.png"
                 alt="Vikash Kumar Kushwaha"
                 className="w-32 h-32 rounded-full mx-auto mb-6 shadow-2xl border-4 border-white dark:border-slate-700 object-cover"
               />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                About <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Vikash Kumar Kushwaha</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Passionate full-stack developer and content creator empowering the next generation
                of developers with high-quality resources and innovative solutions.
              </p>
            </div>
          </div>

          {/* Developer Skills Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-6">
                <Code className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Full Stack Development</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">React, Node.js, TypeScript</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-6">
                <Palette className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">UI/UX Design</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Modern, Responsive Design</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-6">
                <Globe className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Web3 & Blockchain</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">DeFi, Smart Contracts</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-6">
                <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Performance Optimization</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Fast, Scalable Apps</p>
              </CardContent>
            </Card>
          </div>

          {/* Mission Section */}
          <Card className="mb-12 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-center text-lg">
                At EditorStar, we believe that great content creation shouldn't be limited by
                access to professional resources. Our mission is to democratize video editing and
                web development by providing free, high-quality assets that help creators of all 
                levels produce stunning content.
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Whether you're a beginner learning the ropes or a professional working on your
                next masterpiece, we're here to support your creative journey with carefully
                curated editing materials and development resources.
              </p>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Active Users</div>
              </CardContent>
            </Card>
            
            <Card className="text-center transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <Download className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">1M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Downloads</div>
              </CardContent>
            </Card>
            
            <Card className="text-center transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <Star className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">4.9</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Avg Rating</div>
              </CardContent>
            </Card>
            
            <Card className="text-center transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <Award className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Resources</div>
              </CardContent>
            </Card>
          </div>

          {/* Values Section */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm px-4 py-2">Quality First</Badge>
                  <p className="text-gray-600 dark:text-gray-300">
                    Every asset is carefully reviewed and tested to ensure professional standards.
                  </p>
                </div>
                <div className="text-center">
                  <Badge className="mb-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-4 py-2">Community Driven</Badge>
                  <p className="text-gray-600 dark:text-gray-300">
                    We listen to our community and create resources based on real needs.
                  </p>
                </div>
                <div className="text-center">
                  <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm px-4 py-2">Always Free</Badge>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our core mission is to provide free access to professional editing resources.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default About;
