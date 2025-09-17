import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, MapPin, Calendar, Compass } from 'lucide-react';
import heroImage from '@/assets/khonkaen-hero.jpg';

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto" data-aos="fade-up" data-aos-duration="1000">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/30">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">จังหวัดขอนแก่น • Khon Kaen Province</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {t('hero.title')}
          </h1>
         

          {/* Subtitle */}
          <h2 className="text-xl md:text-2xl mb-6 text-white/90 font-medium">
            {t('hero.subtitle')}
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl mb-8 text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>
        </div>
      </div>
    </section>
  );
};