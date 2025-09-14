import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Menu, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'nav.home', href: '/' },
    { key: 'nav.explore', href: '/explore' },
    { key: 'nav.map', href: '/map' },
    { key: 'nav.itinerary', href: '/itinerary' },
  { key: 'nav.events', href: '/events' },
    { key: 'nav.blog', href: '/blog' },
    { key: 'nav.booking', href: '/booking' },
    // Removed contact menu item as requested
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md shadow-elegant border-b' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation('/')}>
            <div className="w-10 h-10 bg-hero-gradient rounded-lg flex items-center justify-center shadow-warm">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary">
                ขอนแก่นท่องเที่ยว
              </h1>
              <p className="text-xs text-muted-foreground">
                Khon Kaen Tourism
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.key}
                variant="ghost"
                size="sm"
                className={`text-foreground hover:text-primary hover:bg-accent transition-all duration-200 ${
                  location.pathname === item.href 
                    ? 'text-primary font-medium' 
                    : ''
                }`}
                onClick={() => handleNavigation(item.href)}
              >
                {t(item.key)}
              </Button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-background/95 backdrop-blur-md">
            <nav className="py-4 space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.key}
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-left hover:bg-accent ${
                    location.pathname === item.href 
                      ? 'text-primary font-medium' 
                      : ''
                  }`}
                  onClick={() => handleNavigation(item.href)}
                >
                  {t(item.key)}
                </Button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
