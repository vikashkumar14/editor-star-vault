import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const Loader = ({ size = 'md', text = 'loading' }: LoaderProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-48 h-48'
  };

  const ringSizes = {
    sm: 'w-12 h-12 border-2',
    md: 'w-24 h-24 border-4',
    lg: 'w-48 h-48 border-8'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`flex justify-center items-center relative ${sizeClasses[size]}`}>
        <div className={`absolute rounded-full border-transparent ${ringSizes[size]} animate-loader-ring-1`} 
             style={{ borderBottomColor: 'rgb(240, 42, 230)' }} />
        <div className={`absolute rounded-full border-transparent ${ringSizes[size]} animate-loader-ring-2`}
             style={{ borderBottomColor: 'rgb(240, 19, 67)' }} />
        <div className={`absolute rounded-full border-transparent ${ringSizes[size]} animate-loader-ring-3`}
             style={{ borderBottomColor: 'rgb(3, 170, 170)' }} />
        <div className={`absolute rounded-full border-transparent ${ringSizes[size]} animate-loader-ring-4`}
             style={{ borderBottomColor: 'rgb(207, 135, 1)' }} />
        <span className={`text-muted-foreground font-medium ${textSizes[size]}`}>{text}</span>
      </div>
    </div>
  );
};

export default Loader;
