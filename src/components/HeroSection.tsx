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

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" data-aos="fade-up" data-aos-delay="200">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-warm px-8 py-6 text-lg font-medium min-w-[200px] group"
            >
              <Compass className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              {t('hero.cta.explore')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/50 text-white hover:bg-white/10 hover:border-white px-8 py-6 text-lg font-medium min-w-[200px] backdrop-blur-sm group"
            >
              <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              {t('hero.cta.plan')}
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16" data-aos="fade-up" data-aos-delay="400">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-white/70 text-sm">สถานที่ท่องเที่ยว</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">20+</div>
              <div className="text-white/70 text-sm">งานเทศกาล</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">100+</div>
              <div className="text-white/70 text-sm">ทัวร์ท้องถิ่น</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-white/70 text-sm">รีวิวจริง</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-float"></div>
        </div>
      </div>
    </section>
  );
};