import React from 'react';

interface LogoIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  alt?: string;
  fallbackIcon?: string;
}

export const LogoIcon: React.FC<LogoIconProps> = ({ 
  className = '',
  size = 'md',
  alt = 'Khon Kaen Tourism Logo',
  fallbackIcon = '📍'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  return (
    <>
      <img 
        src="/logo-icon.png" 
        alt={alt}
        className={`${sizeClasses[size]} object-contain ${className}`}
        onError={(e) => {
          // Fallback to emoji if image fails to load
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
          if (fallback) {
            fallback.classList.remove('hidden');
          }
        }}
      />
      <span className={`hidden ${sizeClasses[size]} font-bold ${className}`}>
        {fallbackIcon}
      </span>
    </>
  );
};