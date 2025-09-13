import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star, Quote, MapPin, Calendar } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  nameEn: string;
  location: string;
  locationEn: string;
  avatar: string;
  rating: number;
  date: string;
  review: string;
  reviewEn: string;
  visitedPlace: string;
  visitedPlaceEn: string;
  tourType: string;
  tourTypeEn: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'คุณสมใจ วงษาคม',
    nameEn: 'Somjai Wongsakhom',
    location: 'กรุงเทพฯ',
    locationEn: 'Bangkok',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b400?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    date: '2024-03-15',
    review: 'ทัวร์วัดป่าธรรมชาติสุดยอดมาก! มัคคุเทศก์มีความรู้ดี อาหารอร่อย บรรยากาศดี น้ำตกสวยงามมาก คุ้มค่าที่จะไปอีกครั้ง',
    reviewEn: 'Amazing forest temple nature tour! The guide was very knowledgeable, food was delicious, great atmosphere, and the waterfall was beautiful. Worth visiting again!',
    visitedPlace: 'วัดป่าดงพญาไผ่',
    visitedPlaceEn: 'Dong Phayayen Forest Temple',
    tourType: 'ทัวร์ธรรมชาติ',
    tourTypeEn: 'Nature Tour',
    verified: true
  },
  {
    id: 2,
    name: 'Jennifer Smith',
    nameEn: 'Jennifer Smith',
    location: 'สหรัฐอเมริกา',
    locationEn: 'USA',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    date: '2024-03-08',
    review: 'ทัวร์อาหารอีสานเยื่ยมมาก! ได้ลิ้มรสอาหารท้องถิ่นแท้ๆ ร้านส้มตำอร่อยสุดๆ และได้เรียนทำลาบด้วย ประสบการณ์ที่น่าจดจำ!',
    reviewEn: 'Excellent Isan food tour! Got to taste authentic local cuisine, the som tam shops were incredibly delicious, and learning to make larb was memorable!',
    visitedPlace: 'ตลาดเช้าเทศบาลนคร',
    visitedPlaceEn: 'Municipal Morning Market',
    tourType: 'ทัวร์อาหาร',
    tourTypeEn: 'Food Tour',
    verified: true
  },
  {
    id: 3,
    name: 'คุณพิชญา ใจดี',
    nameEn: 'Pitchaya Jaidee',
    location: 'เชียงใหม่',
    locationEn: 'Chiang Mai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 4,
    date: '2024-02-28',
    review: 'แพ็คเกจ 2 วัน 1 คืนครบครันดี โรงแรมสะอาด พิพิธภัณฑ์ไดโนเสาร์น่าสนใจ บึงแก่นนครสวยมาก แต่อยากให้เวลาเที่ยวแต่ละที่นานขึ้น',
    reviewEn: 'Good comprehensive 2D1N package. Clean hotel, interesting dinosaur museum, beautiful Kaen Nakhon Lake. Wish we had more time at each location.',
    visitedPlace: 'พิพิธภัณฑ์ไดโนเสาร์',
    visitedPlaceEn: 'Dinosaur Museum',
    tourType: 'ทัวร์แพ็คเกจ',
    tourTypeEn: 'Package Tour',
    verified: true
  },
  {
    id: 4,
    name: 'David Wilson',
    nameEn: 'David Wilson',
    location: 'ออสเตรเลีย',
    locationEn: 'Australia',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    date: '2024-03-20',
    review: 'Perfect introduction to Khon Kaen! The guide spoke excellent English, everything was well organized, and I learned so much about Isan culture. Highly recommended!',
    reviewEn: 'Perfect introduction to Khon Kaen! The guide spoke excellent English, everything was well organized, and I learned so much about Isan culture. Highly recommended!',
    visitedPlace: 'วัดเทพธิดาราม',
    visitedPlaceEn: 'Wat Thep Thidaram',
    tourType: 'ทัวร์วัฒนธรรม',
    tourTypeEn: 'Cultural Tour',
    verified: true
  }
];

export const TestimonialsSection: React.FC = () => {
  const { currentLanguage } = useLanguage();
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
            {isEnglish ? 'What Travelers Say' : 'เสียงจากนักท่องเที่ยว'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isEnglish 
              ? 'Real experiences from visitors who explored Khon Kaen with us'
              : 'ประสบการณ์จริงจากนักท่องเที่ยวที่ได้สำรวจขอนแก่นกับเรา'
            }
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className="relative overflow-hidden shadow-warm hover:shadow-elegant transition-all duration-300 border-0 bg-card-gradient"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="h-12 w-12 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {testimonial.rating}/5
                  </span>
                </div>

                {/* Review Text */}
                <blockquote className="text-foreground mb-6 leading-relaxed">
                  "{isEnglish ? testimonial.reviewEn : testimonial.review}"
                </blockquote>

                {/* Tour Info */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {isEnglish ? testimonial.tourTypeEn : testimonial.tourType}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1">
                      {isEnglish ? testimonial.visitedPlaceEn : testimonial.visitedPlace}
                    </span>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={testimonial.avatar} alt={isEnglish ? testimonial.nameEn : testimonial.name} />
                      <AvatarFallback>
                        {(isEnglish ? testimonial.nameEn : testimonial.name).split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-primary">
                          {isEnglish ? testimonial.nameEn : testimonial.name}
                        </h4>
                        {testimonial.verified && (
                          <Badge variant="secondary" className="text-xs px-2 py-0">
                            ✓ {isEnglish ? 'Verified' : 'ยืนยันแล้ว'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {isEnglish ? testimonial.locationEn : testimonial.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(testimonial.date)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center" data-aos="fade-up" data-aos-delay="400">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">4.8</div>
            <div className="text-sm text-muted-foreground">
              {isEnglish ? 'Average Rating' : 'คะแนนเฉลี่ย'}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">1,240+</div>
            <div className="text-sm text-muted-foreground">
              {isEnglish ? 'Happy Travelers' : 'นักท่องเที่ยวที่พอใจ'}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">95%</div>
            <div className="text-sm text-muted-foreground">
              {isEnglish ? 'Recommend Us' : 'แนะนำให้เพื่อน'}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-sm text-muted-foreground">
              {isEnglish ? 'Tour Options' : 'ทัวร์ให้เลือก'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};