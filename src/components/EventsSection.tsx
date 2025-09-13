import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

interface Event {
  id: number;
  name: string;
  nameEn: string;
  date: string;
  time: string;
  location: string;
  locationEn: string;
  category: string;
  categoryEn: string;
  image: string;
  attendees: number;
  description: string;
  descriptionEn: string;
  price: string;
}

const events: Event[] = [
  {
    id: 1,
    name: 'งานประเพณีบุญบั้งไฟ',
    nameEn: 'Bun Bang Fai Rocket Festival',
    date: '2024-05-15',
    time: '08:00 น.',
    location: 'สนามกีฬาจังหวัดขอนแก่น',
    locationEn: 'Khon Kaen Provincial Stadium',
    category: 'เทศกาล',
    categoryEn: 'Festival',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop',
    attendees: 5000,
    description: 'เทศกาลประจำปีที่รื่นเริงด้วยการยิงบั้งไฟสู่ฟ้า',
    descriptionEn: 'Annual festival with joyful rocket shooting to the sky',
    price: 'ฟรี'
  },
  {
    id: 2,
    name: 'งานไหมขอนแก่น',
    nameEn: 'Khon Kaen Silk Festival',
    date: '2024-04-20',
    time: '09:00 น.',
    location: 'ศูนย์ประชุมและแสดงสินค้าขอนแก่น',
    locationEn: 'Khon Kaen International Convention Centre',
    category: 'วัฒนธรรม',
    categoryEn: 'Culture',
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&h=600&fit=crop',
    attendees: 3000,
    description: 'งานแสดงและจำหน่ายผ้าไหมคุณภาพสูง',
    descriptionEn: 'Exhibition and sale of high-quality silk products',
    price: '50 บาท'
  },
  {
    id: 3,
    name: 'คอนเสิร์ตดนตรีริมบึง',
    nameEn: 'Lakeside Music Concert',
    date: '2024-04-25',
    time: '18:00 น.',
    location: 'บึงแก่นนคร',
    locationEn: 'Kaen Nakhon Lake',
    category: 'ดนตรี',
    categoryEn: 'Music',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop',
    attendees: 2000,
    description: 'คอนเสิร์ตกลางแจ้งริมทะเลสาบที่โรแมนติก',
    descriptionEn: 'Romantic outdoor concert by the lake',
    price: '200 บาท'
  }
];

export const EventsSection: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const isEnglish = currentLanguage.code === 'en';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isEnglish) {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    }
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            {t('events.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('events.subtitle')}
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {events.map((event, index) => (
            <Card 
              key={event.id} 
              className="group overflow-hidden shadow-warm hover:shadow-elegant transition-all duration-300 border-0 bg-card-gradient"
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={event.image}
                  alt={isEnglish ? event.nameEn : event.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-secondary text-secondary-foreground shadow-sm">
                    {isEnglish ? event.categoryEn : event.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <div className="text-primary font-bold text-sm">
                    {event.price === 'ฟรี' ? (isEnglish ? 'FREE' : 'ฟรี') : event.price}
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                  {isEnglish ? event.nameEn : event.name}
                </h3>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {isEnglish ? event.descriptionEn : event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{formatDate(event.date)} • {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="line-clamp-1">
                      {isEnglish ? event.locationEn : event.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{event.attendees.toLocaleString()} {isEnglish ? 'attendees' : 'คน'}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-hero-gradient text-white hover:opacity-90 shadow-gold"
                  size="sm"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {t('common.bookNow')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center" data-aos="fade-up" data-aos-delay="450">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8"
          >
            {t('events.viewAll')} ({events.length * 10}+ {isEnglish ? 'Events' : 'งาน'})
          </Button>
        </div>
      </div>
    </section>
  );
};