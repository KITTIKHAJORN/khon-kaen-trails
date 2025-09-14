import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Import all page components
import Blog from "./pages/Blog";
import Booking from "./pages/Booking";
import CreateBlog from "./pages/CreateBlog";
import CreateEvent from "./pages/CreateEvent";
import Events from "./pages/Events";
import Explore from "./pages/Explore";
import Itinerary from "./pages/Itinerary";
import Map from "./pages/Map";
// Tours page removed

// Removed Contact import as requested

import AOS from 'aos';
import { useEffect } from 'react';

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
  {/* Tours page removed */}
      <Route path="/blog" element={<Blog />} />
  <Route path="/create-blog" element={<CreateBlog />} />
  <Route path="/create-event" element={<CreateEvent />} />
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