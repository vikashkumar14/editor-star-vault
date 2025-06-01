
import { Card, CardContent } from "@/components/ui/card";
import { Star, Download, Trophy } from "lucide-react";

const CreatorsShowcase = () => {
  const creators = [
    {
      id: 1,
      name: "Rajesh Kumar",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      specialty: "Video Effects",
      downloads: "25K+",
      rating: 4.9,
      materials: 45,
      featured: true
    },
    {
      id: 2,
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b494?w=150&h=150&fit=crop&crop=face",
      specialty: "Color Grading",
      downloads: "18K+",
      rating: 4.8,
      materials: 32,
      featured: true
    },
    {
      id: 3,
      name: "Arjun Singh",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      specialty: "Motion Graphics",
      downloads: "22K+",
      rating: 4.9,
      materials: 38,
      featured: false
    },
    {
      id: 4,
      name: "Sneha Patel",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      specialty: "UI/UX Design",
      downloads: "15K+",
      rating: 4.7,
      materials: 28,
      featured: false
    },
    {
      id: 5,
      name: "Vikram Reddy",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      specialty: "Audio Effects",
      downloads: "12K+",
      rating: 4.8,
      materials: 25,
      featured: false
    },
    {
      id: 6,
      name: "Kavya Nair",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      specialty: "Typography",
      downloads: "9K+",
      rating: 4.6,
      materials: 20,
      featured: false
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-6 py-2 mb-4">
            <Trophy className="w-4 h-4" />
            <span className="font-medium">Top Contributors</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Amazing Creators
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Talented individuals who make high-quality content available for the community
          </p>
        </div>

        {/* Creators Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {creators.map((creator) => (
            <Card key={creator.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-hover overflow-hidden bg-white dark:bg-slate-800">
              <CardContent className="p-6 text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                  />
                  {creator.featured && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white fill-current" />
                    </div>
                  )}
                </div>

                {/* Creator Info */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {creator.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {creator.specialty}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-500">
                      {creator.materials}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Materials
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">
                      {creator.downloads}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Downloads
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-lg font-bold text-yellow-500">
                        {creator.rating}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Rating
                    </div>
                  </div>
                </div>

                {/* Testimonial or Achievement */}
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                    "Creating quality content for the community is my passion!"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Want to become a featured creator?
          </p>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
            Join Our Community
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreatorsShowcase;
