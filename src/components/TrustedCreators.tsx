
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, FileText, Download, Eye, Star } from "lucide-react";

const TrustedCreators = () => {
  const showcaseItems = [
    {
      id: 1,
      type: 'video',
      title: 'Professional Color Grading Tutorial',
      thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      views: '125K',
      rating: 4.9,
      creator: 'Raj Kumar'
    },
    {
      id: 2,
      type: 'pdf',
      title: 'Complete Video Editing Guide',
      thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=300&fit=crop',
      url: '/sample-guide.pdf',
      downloads: '45K',
      rating: 4.8,
      creator: 'Priya Sharma'
    },
    {
      id: 3,
      type: 'video',
      title: 'Motion Graphics Masterclass',
      thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      views: '89K',
      rating: 4.9,
      creator: 'Arjun Singh'
    },
    {
      id: 4,
      type: 'pdf',
      title: 'Audio Mixing & Mastering Tips',
      thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop',
      url: '/audio-guide.pdf',
      downloads: '32K',
      rating: 4.7,
      creator: 'Sneha Patel'
    }
  ];

  const handleItemClick = (item: any) => {
    if (item.type === 'video') {
      window.open(item.url, '_blank');
    } else {
      // For PDF, we'll create a download link
      const link = document.createElement('a');
      link.href = item.url;
      link.download = `${item.title}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full px-6 py-2 mb-4">
            <Star className="w-4 h-4" />
            <span className="font-medium">Featured Content</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Content Creators{" "}
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Learn from the best with our curated collection of tutorials and guides
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {showcaseItems.map((item) => (
            <Card 
              key={item.id} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-hover overflow-hidden bg-white dark:bg-slate-800 cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <div className="relative">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  {item.type === 'video' ? (
                    <Play className="w-12 h-12 text-white" />
                  ) : (
                    <FileText className="w-12 h-12 text-white" />
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                    item.type === 'video' ? 'bg-red-500' : 'bg-blue-500'
                  }`}>
                    {item.type === 'video' ? 'Video' : 'PDF'}
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  by {item.creator}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    {item.type === 'video' ? (
                      <>
                        <Eye className="w-4 h-4" />
                        <span>{item.views} views</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>{item.downloads} downloads</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 text-lg">
            View All Resources
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrustedCreators;
