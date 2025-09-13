import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Star, Clock, Camera } from 'lucide-react';

interface Destination {
  id: number;
  name: string;
  nameEn: string;
  category: string;
  categoryEn: string;
  image: string;
  rating: number;
  reviews: number;
  duration: string;
  description: string;
  descriptionEn: string;
}

const destinations: Destination[] = [
  {
    id: 1,
    name: 'บึงแก่นนคร',
    nameEn: 'Kaen Nakhon Lake',
    category: 'ธรรมชาติ',
    categoryEn: 'Nature',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    rating: 4.5,
    reviews: 1250,
    duration: '2-3 ชั่วโมง',
    description: 'ทะเลสาบใจกลางเมืองขอนแก่นที่เป็นแลนด์มาร์คสำคัญ',
    descriptionEn: 'The central lake of Khon Kaen city, serving as an important landmark'
  },
  {
    id: 2,
    name: 'วัดเทพธิดาราม',
    nameEn: 'Wat Thep Thidaram',
    category: 'วัด',
    categoryEn: 'Temple',
    image: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800&h=600&fit=crop',
    rating: 4.7,
    reviews: 890,
    duration: '1-2 ชั่วโมง',
    description: 'วัดที่สวยงามด้วยสถาปัตยกรรมไทยล้านนา',
    descriptionEn: 'Beautiful temple with traditional Thai Lanna architecture'
  },
  {
    id: 3,
    name: 'ศูนย์การค้าเซ็นทรัล พลาซ่า',
    nameEn: 'CentralPlaza Khon Kaen',
    category: 'ช้อปปิ้ง',
    categoryEn: 'Shopping',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop',
    rating: 4.3,
    reviews: 2100,
    duration: '3-5 ชั่วโมง',
    description: 'ศูนย์การค้าขนาดใหญ่ใจกลางเมืองขอนแก่น',
    descriptionEn: 'Major shopping center in the heart of Khon Kaen'
  },
  {
    id: 4,
    name: 'หาดทรายแก้ว',
    nameEn: 'Sai Kaew Beach',
    category: 'ธรรมชาติ',
    categoryEn: 'Nature',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    rating: 4.6,
    reviews: 750,
    duration: '4-6 ชั่วโมง',
    description: 'หาดทรายขาวสะอาดริมทะเลสาบ',
    descriptionEn: 'Clean white sand beach by the lake'
  },
];

export const PopularDestinations: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const isEnglish = currentLanguage.code === 'en';

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            {t('destinations.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('destinations.subtitle')}
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {destinations.map((destination, index) => (
            <Card 
              key={destination.id} 
              className="group overflow-hidden bg-card-gradient shadow-warm hover:shadow-elegant transition-all duration-300 border-0"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={destination.image}
                  alt={isEnglish ? destination.nameEn : destination.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary text-primary-foreground">
                    {isEnglish ? destination.categoryEn : destination.category}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <Camera className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-primary-light transition-colors">
                  {isEnglish ? destination.nameEn : destination.name}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {isEnglish ? destination.descriptionEn : destination.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{destination.rating}</span>
                    <span className="text-muted-foreground">({destination.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{destination.duration}</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {t('common.viewDetails')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center" data-aos="fade-up" data-aos-delay="400">
          <Button size="lg" className="bg-hero-gradient text-white shadow-gold hover:opacity-90 px-8">
            {t('destinations.viewAll')} ({destinations.length * 10}+)
          </Button>
        </div>
      </div>
    </section>
  );
};