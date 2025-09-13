import React, { createContext, useContext, useState, useEffect } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const languages: Language[] = [
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

const translations = {
  th: {
    // Navigation
    'nav.home': 'หน้าแรก',
    'nav.explore': 'สำรวจ',
    'nav.map': 'แผนที่',
    'nav.itinerary': 'วางแผนทริป',
    'nav.events': 'งานเทศกาล',
    'nav.tours': 'ทัวร์',
    'nav.blog': 'บทความ',
    'nav.booking': 'จองที่พัก',
    'nav.contact': 'ติดต่อ',
    
    // Hero Section
    'hero.title': 'สำรวจเมืองขอนแก่น',
    'hero.subtitle': 'จังหวัดแห่งความงามทางธรรมชาติและวัฒนธรรมอีสาน',
    'hero.description': 'ค้นพบสถานที่ท่องเที่ยวที่น่าตื่นตา กิจกรรมที่น่าสนใจ และประสบการณ์ที่ไม่มีวันลืมในจังหวัดขอนแก่น',
    'hero.cta.explore': 'เริ่มสำรวจเลย',
    'hero.cta.plan': 'วางแผนทริป',
    
    // Popular Destinations
    'destinations.title': 'จุดหมายยอดนิยม',
    'destinations.subtitle': 'สถานที่ท่องเที่ยวที่นักท่องเที่ยวชื่นชอบมากที่สุด',
    
    // Events
    'events.title': 'งานเทศกาลและกิจกรรม',
    'events.subtitle': 'อย่าพลาดงานเด่นและเทศกาลประจำปีของขอนแก่น',
    'events.viewAll': 'ดูทั้งหมด',
    
    // Tours
    'tours.title': 'ทัวร์แนะนำ',
    'tours.subtitle': 'ทัวร์คุณภาพจากผู้เชี่ยวชาญท้องถิ่น',
    'tours.from': 'เริ่มต้น',
    'tours.person': 'คน',
    'tours.viewAll': 'ดูทัวร์ทั้งหมด',
    
    // Weather
    'weather.title': 'สภาพอากาศ',
    'weather.today': 'วันนี้',
    'weather.aqi': 'คุณภาพอากาศ',
    
    // Newsletter
    'newsletter.title': 'รับข่าวสารล่าสุด',
    'newsletter.subtitle': 'สมัครรับจดหมายข่าวเพื่อรับข้อมูลสถานที่ท่องเที่ยวใหม่และโปรโมชั่นพิเศษ',
    'newsletter.email': 'อีเมลของคุณ',
    'newsletter.subscribe': 'สมัครสมาชิก',
    
    // Footer
    'footer.description': 'เว็บไซต์ท่องเที่ยวขอนแก่นที่รวมข้อมูลครบครันที่สุด',
    'footer.quickLinks': 'ลิงก์ด่วน',
    'footer.contact.title': 'ติดต่อเรา',
    'footer.contact.phone': 'โทรศัพท์',
    'footer.contact.email': 'อีเมล',
    'footer.contact.address': 'ที่อยู่',
    'footer.social': 'ติดตามเรา',
    'footer.rights': 'สงวนลิขสิทธิ์ © 2024 ขอนแก่นท่องเที่ยว',
    
    // Common
    'common.learnMore': 'เรียนรู้เพิ่มเติม',
    'common.readMore': 'อ่านเพิ่มเติม',
    'common.viewDetails': 'ดูรายละเอียด',
    'common.bookNow': 'จองเลย',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.explore': 'Explore',
    'nav.map': 'Map',
    'nav.itinerary': 'Itinerary',
    'nav.events': 'Events',
    'nav.tours': 'Tours',
    'nav.blog': 'Blog',
    'nav.booking': 'Booking',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.title': 'Explore Khon Kaen',
    'hero.subtitle': 'Province of Natural Beauty and Isan Culture',
    'hero.description': 'Discover amazing attractions, exciting activities, and unforgettable experiences in Khon Kaen Province',
    'hero.cta.explore': 'Start Exploring',
    'hero.cta.plan': 'Plan Your Trip',
    
    // Popular Destinations
    'destinations.title': 'Popular Destinations',
    'destinations.subtitle': 'Most loved tourist attractions by travelers',
    
    // Events
    'events.title': 'Festivals & Events',
    'events.subtitle': "Don't miss Khon Kaen's featured events and annual festivals",
    'events.viewAll': 'View All',
    
    // Tours
    'tours.title': 'Recommended Tours',
    'tours.subtitle': 'Quality tours by local experts',
    'tours.from': 'From',
    'tours.person': 'person',
    'tours.viewAll': 'View All Tours',
    
    // Weather
    'weather.title': 'Weather',
    'weather.today': 'Today',
    'weather.aqi': 'Air Quality',
    
    // Newsletter
    'newsletter.title': 'Stay Updated',
    'newsletter.subtitle': 'Subscribe to our newsletter for new destinations and special promotions',
    'newsletter.email': 'Your Email',
    'newsletter.subscribe': 'Subscribe',
    
    // Footer
    'footer.description': 'The most comprehensive Khon Kaen tourism website',
    'footer.quickLinks': 'Quick Links',
    'footer.contact.title': 'Contact Us',
    'footer.contact.phone': 'Phone',
    'footer.contact.email': 'Email',
    'footer.contact.address': 'Address',
    'footer.social': 'Follow Us',
    'footer.rights': 'Copyright © 2024 Khon Kaen Tourism',
    
    // Common
    'common.learnMore': 'Learn More',
    'common.readMore': 'Read More',
    'common.viewDetails': 'View Details',
    'common.bookNow': 'Book Now',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]); // Default to Thai

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      const language = languages.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language.code);
  };

  const t = (key: string): string => {
    const translation = translations[currentLanguage.code as keyof typeof translations];
    return translation?.[key as keyof typeof translation] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export { languages };