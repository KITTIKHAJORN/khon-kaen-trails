import { EventsSection } from '@/components/EventsSection';
import { HeroSection } from '@/components/HeroSection';
import { Navigation } from '@/components/Navigation';
import { PopularDestinations } from '@/components/PopularDestinations';
import { WeatherWidget } from '@/components/WeatherWidget';
// ToursSection removed
import { AdvertisementSection } from '@/components/AdvertisementSection';
import { BlogPreviewSection } from '@/components/BlogPreviewSection';
import { Footer } from '@/components/Footer';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { TestimonialsSection } from '@/components/TestimonialsSection';

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
