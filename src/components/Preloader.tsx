
import { useEffect, useState } from 'react';

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex items-center justify-center overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="text-center relative z-10">
        {/* Animated logo container */}
        <div className="relative mb-6">
          {/* Glowing ring effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-purple-500/30 animate-ping"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full border-4 border-blue-500/30 animate-ping" style={{ animationDelay: '0.3s' }}></div>
          </div>
          
          {/* Logo with enhanced effects */}
          <div className="relative">
            <img
              src="https://i.ibb.co/XkjPcgsv/icon.jpg"
              alt="Gyaan Repo"
              className="w-24 h-24 mx-auto rounded-full border-4 border-white/30 shadow-2xl shadow-purple-500/50 relative z-10"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-50 blur-xl animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Brand Name with gradient */}
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent animate-fade-in">
          Gyaan Repo
        </h1>
        
        {/* Animated subtitle */}
        <div className="text-lg text-blue-300/80 mb-8 font-medium">
          <span className="inline-block animate-bounce">🚀</span>
          <span className="mx-2">Loading amazing content...</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
        </div>
        
        {/* Enhanced Progress Bar */}
        <div className="w-80 max-w-full mx-auto px-4">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
            <div className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full animate-loading-bar shadow-lg shadow-blue-500/50"></div>
          </div>
        </div>
        
        {/* Loading dots */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
