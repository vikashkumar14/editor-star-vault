
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
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* 3D Cube Spinner */}
          <div className="w-20 h-20 mx-auto mb-8 perspective-1000">
            <div className="w-full h-full relative preserve-3d animate-spin-3d">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg opacity-80 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg opacity-60 transform rotate-45 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-40 transform rotate-90 animate-pulse"></div>
            </div>
          </div>
          
          {/* Logo */}
          <img
            src="https://i.ibb.co/XkjPcgsv/icon.jpg"
            alt="Gyaan Repo"
            className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-white/20 animate-pulse-glow"
          />
          
          {/* Brand Name */}
          <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">
            Gyaan Repo
          </h1>
          
          {/* Typing Effect */}
          <div className="text-xl text-blue-300 mb-8 animate-typing">
            Loading amazing content...
          </div>
          
          {/* Progress Bar */}
          <div className="w-64 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-loading-bar"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
