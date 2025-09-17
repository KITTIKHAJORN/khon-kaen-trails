import React, { useEffect } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { Navigation } from '@/components/Navigation';
import { PopularDestinations } from '@/components/PopularDestinations';
import { WeatherWidget } from '@/components/WeatherWidget';
import { Footer } from '@/components/Footer';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { LatestEvents } from '@/components/LatestEvents';
import { LatestBlogs } from '@/components/LatestBlogs';

const Index = () => {
  useEffect(() => {
    // Pre-load critical data for better user experience
    console.log('🏠 Loading Khon Kaen Tourism Homepage with real API data');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <PopularDestinations />
        <LatestEvents />
        <LatestBlogs />
        <WeatherWidget />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Index;
