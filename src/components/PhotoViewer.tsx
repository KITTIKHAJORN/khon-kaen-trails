import React, { useState, useEffect } from 'react';
import { Camera, ExternalLink } from 'lucide-react';
import { fetchPlacePhoto, getPlacePhotoUrl } from '@/api/mapapi';

interface PhotoViewerProps {
  photoReference: string;
  alt: string;
  className?: string;
  maxWidth?: number;
  showFallback?: boolean;
}

export const PhotoViewer: React.FC<PhotoViewerProps> = ({
  photoReference,
  alt,
  className = '',
  maxWidth = 400,
  showFallback = true
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actualImageUrl, setActualImageUrl] = useState<string>('');

  // ดึง URL รูปภาพจริงจาก API ใน mapapi.js
  useEffect(() => {
    const loadPhoto = async () => {
      try {
        console.log('📸 PhotoViewer: Loading photo for reference:', photoReference.slice(0, 20) + '...');
        
        // ใช้ฟังก์ชันจาก mapapi.js
        const photoUrl = await fetchPlacePhoto(photoReference, maxWidth);
        
        if (photoUrl) {
          console.log('✅ PhotoViewer: Got photo URL:', photoUrl.slice(0, 50) + '...');
          setActualImageUrl(photoUrl);
        } else {
          console.warn('❌ PhotoViewer: No photo URL returned');
          setImageError(true);
        }
      } catch (error) {
        console.error('❌ PhotoViewer: Error loading photo:', error);
        setImageError(true);
      }
    };

    if (photoReference) {
      loadPhoto();
    }
  }, [photoReference, maxWidth]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  const handleClick = () => {
    // เปิดรูปในแท็บใหม่
    if (actualImageUrl) {
      window.open(actualImageUrl, '_blank');
    }
  };

  if (imageError && !showFallback) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {!imageError && actualImageUrl ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}
          <img
            src={actualImageUrl}
            alt={alt}
            className="w-full h-full object-cover cursor-pointer"
            onLoad={handleImageLoad}
            onError={handleImageError}
            onClick={handleClick}
          />
        </>
      ) : showFallback ? (
        <div 
          className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center cursor-pointer hover:from-primary/20 hover:to-primary/10 transition-all"
          onClick={handleClick}
        >
          <div className="text-center">
            <Camera className="h-8 w-8 text-primary/50 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">รูปภาพ</p>
            <ExternalLink className="h-3 w-3 text-muted-foreground mx-auto mt-1" />
          </div>
        </div>
      ) : null}
    </div>
  );
};
