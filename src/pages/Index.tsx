import React from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { PopularDestinations } from '@/components/PopularDestinations';
import { EventsSection } from '@/components/EventsSection';
import { WeatherWidget } from '@/components/WeatherWidget';
import { AdvertisementSection } from '@/components/AdvertisementSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <PopularDestinations />
        <WeatherWidget />
        <EventsSection />
        <AdvertisementSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
