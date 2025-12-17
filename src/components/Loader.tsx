import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  showText?: boolean;
}

const Loader = ({ size = 'md', text = 'loading', showText = true }: LoaderProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-52 h-52'
  };

  const ringSizes = {
    sm: 'w-16 h-16 border-2',
    md: 'w-28 h-28 border-4',
    lg: 'w-52 h-52 border-[6px]'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const glowSizes = {
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 animate-fade-in">
      <div className={`flex justify-center items-center relative ${sizeClasses[size]}`}>
        {/* Center glow effect */}
        <div 
          className={`absolute ${glowSizes[size]} rounded-full blur-xl opacity-60`}
          style={{ 
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.5), transparent 70%)'
          }} 
        />
        
        {/* Inner glow orb */}
        <div 
          className={`absolute ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-10 h-10'} rounded-full animate-pulse-glow`}
          style={{ 
            background: 'radial-gradient(circle, hsl(var(--primary)), hsl(var(--accent)))'
          }} 
        />

        {/* Rotating rings with gradient colors */}
        <div 
          className={`absolute rounded-full border-transparent ${ringSizes[size]} animate-loader-ring-1`} 
          style={{ 
            borderBottomColor: 'hsl(var(--primary))',
            filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.6))'
          }} 
        />
        <div 
          className={`absolute rounded-full border-transparent ${ringSizes[size]} animate-loader-ring-2`}
          style={{ 
            borderBottomColor: 'hsl(262 83% 50%)',
            filter: 'drop-shadow(0 0 8px hsl(262 83% 50% / 0.6))'
          }} 
        />
        <div 
          className={`absolute rounded-full border-transparent ${ringSizes[size]} animate-loader-ring-3`}
          style={{ 
            borderBottomColor: 'hsl(var(--accent))',
            filter: 'drop-shadow(0 0 8px hsl(var(--accent) / 0.6))'
          }} 
        />
        <div 
          className={`absolute rounded-full border-transparent ${ringSizes[size]} animate-loader-ring-4`}
          style={{ 
            borderBottomColor: 'hsl(280 85% 55%)',
            filter: 'drop-shadow(0 0 8px hsl(280 85% 55% / 0.6))'
          }} 
        />
      </div>
      
      {/* Loading text with gradient */}
      {showText && (
        <span className={`gradient-text font-medium ${textSizes[size]} animate-pulse`}>
          {text}
        </span>
      )}
    </div>
  );
};

export default Loader;
