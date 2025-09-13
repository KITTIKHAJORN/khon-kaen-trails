import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Import all page components
import Explore from "./pages/Explore";
import Map from "./pages/Map";
import Itinerary from "./pages/Itinerary";
import Events from "./pages/Events";
import Tours from "./pages/Tours";
import Blog from "./pages/Blog";
import Booking from "./pages/Booking";

// Removed Contact import as requested

import { useEffect } from 'react';
import AOS from 'aos';

const queryClient = new QueryClient();

// Initialize AOS
const AppContent = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/map" element={<Map />} />
      <Route path="/itinerary" element={<Itinerary />} />
      <Route path="/events" element={<Events />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/booking" element={<Booking />} />
      {/* Removed Contact route as requested */}
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;