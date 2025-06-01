
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Download, Users, Youtube, Instagram, Twitter } from "lucide-react";

const CreatorsShowcase = () => {
  const creators = [
    {
      id: 1,
      name: "Vikash Kumar",
      role: "Founder & Lead Editor",
      avatar: "/placeholder.svg",
      stats: {
        materials: 45,
        downloads: "25K+",
        rating: 4.9
      },
      specialties: ["Color Grading", "Motion Graphics", "Coding"],
      social: {
        youtube: "#",
        instagram: "#",
        twitter: "#"
      },
      isFounder: true
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Video Editor",
      avatar: "/placeholder.svg",
      stats: {
        materials: 32,
        downloads: "18K+",
        rating: 4.8
      },
      specialties: ["Transitions", "Sound Design"],
      social: {
        youtube: "#",
        instagram: "#"
      }
    },
    {
      id: 3,
      name: "Alex Chen",
      role: "Motion Designer",
      avatar: "/placeholder.svg",
      stats: {
        materials: 28,
        downloads: "22K+",
        rating: 4.9
      },
      specialties: ["Animation", "Typography"],
      social: {
        instagram: "#",
        twitter: "#"
      }
    },
    {
      id: 4,
      name: "Maya Patel",
      role: "Developer",
      avatar: "/placeholder.svg",
      stats: {
        materials: 15,
        downloads: "12K+",
        rating: 4.7
      },
      specialties: ["React", "TypeScript", "UI/UX"],
      social: {
        twitter: "#"
      }
    }
  ];

  const testimonials = [
    {
      text: "The quality of materials here is absolutely incredible. It has completely transformed my editing workflow!",
      author: "Emma Wilson",
      role: "Content Creator",
      avatar: "/placeholder.svg"
    },
    {
      text: "As a beginner, these free resources helped me learn and create professional-looking videos. Highly recommended!",
      author: "David Kim",
      role: "YouTuber",
      avatar: "/placeholder.svg"
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 mb-4">
            Community
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Creative Contributors
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Talented creators and developers who make this platform amazing
          </p>
        </div>

        {/* Creators Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {creators.map((creator) => (
            <Card key={creator.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-hover overflow-hidden bg-white dark:bg-slate-800">
              <CardHeader className="text-center pb-2">
                <div className="relative mx-auto mb-4">
                  <Avatar className="w-20 h-20 mx-auto">
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg">
                      {creator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {creator.isFounder && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg">{creator.name}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {creator.role}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{creator.stats.materials}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Materials</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{creator.stats.downloads}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Downloads</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white flex items-center justify-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{creator.stats.rating}</span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Rating</div>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1">
                  {creator.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-2">
                  {creator.social.youtube && (
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                      <Youtube className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                  {creator.social.instagram && (
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                      <Instagram className="w-4 h-4 text-pink-500" />
                    </Button>
                  )}
                  {creator.social.twitter && (
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                      <Twitter className="w-4 h-4 text-blue-500" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              What Our Community Says
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Real feedback from creators using our materials
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white dark:bg-slate-800">
                <CardContent className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorsShowcase;
