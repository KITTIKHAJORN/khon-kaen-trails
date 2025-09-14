import React from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { PopularDestinations } from '@/components/PopularDestinations';
import { EventsSection } from '@/components/EventsSection';
import { WeatherWidget } from '@/components/WeatherWidget';
// ToursSection removed
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { BlogPreviewSection } from '@/components/BlogPreviewSection';
import { AdvertisementSection } from '@/components/AdvertisementSection';
import { Footer } from '@/components/Footer';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <PopularDestinations />
        <WeatherWidget />
        <EventsSection />
  {/* ToursSection removed */}
        <TestimonialsSection />
        <BlogPreviewSection />
        <AdvertisementSection />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Index;
