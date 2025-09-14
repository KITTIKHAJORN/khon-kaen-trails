import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Youtube
} from 'lucide-react';
import React from 'react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { key: 'nav.explore', href: '/explore' },
    { key: 'nav.map', href: '/map' },
  { key: 'nav.events', href: '/events' },
    { key: 'nav.blog', href: '/blog' },
    { key: 'nav.booking', href: '/booking' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">


        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand & Description */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">ขอนแก่นท่องเที่ยว</h2>
                  <p className="text-sm text-primary-foreground/80">Khon Kaen Tourism</p>
                </div>
              </div>
              <p className="text-primary-foreground/80 mb-6 max-w-md">
                {t('footer.description')}
              </p>
              
              {/* Social Media */}
              <div>
                <h4 className="font-semibold mb-3">{t('footer.social')}</h4>
                <div className="flex gap-3">
                  <Button size="sm" variant="ghost" className="p-2 hover:bg-white/10">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button size="sm" variant="ghost" className="p-2 hover:bg-white/10">
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button size="sm" variant="ghost" className="p-2 hover:bg-white/10">
                    <Youtube className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">{t('footer.quickLinks')}</h4>
              <nav className="space-y-2">
                {quickLinks.map((link) => (
                  <Button
                    key={link.key}
                    variant="ghost"
                    size="sm"
                    className="justify-start p-0 h-auto text-primary-foreground/80 hover:text-white hover:bg-transparent"
                    onClick={() => {
                      // Navigation will be implemented later
                      console.log(`Navigate to ${link.href}`);
                    }}
                  >
                    {t(link.key)}
                  </Button>
                ))}
              </nav>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="font-semibold mb-4">{t('footer.contact.title')}</h4>
              <div className="space-y-3 text-primary-foreground/80">
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-0.5 text-secondary" />
                  <div>
                    <p className="font-medium text-white">{t('footer.contact.phone')}</p>
                    <p className="text-sm">043-336-789</p>
                    <p className="text-sm">043-336-790</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-0.5 text-secondary" />
                  <div>
                    <p className="font-medium text-white">{t('footer.contact.email')}</p>
                    <p className="text-sm">info@khonkaentourism.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-secondary" />
                  <div>
                    <p className="font-medium text-white">{t('footer.contact.address')}</p>
                    <p className="text-sm">
                      123 ถนนกลางเมือง อำเภอเมือง<br />
                      จังหวัดขอนแก่น 40000
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-primary-light/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/80">
            <p>{t('footer.rights')}</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-400 fill-current" /> in Khon Kaen
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
