import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  MapPin, 
  Clock, 
  Users, 
  Star,
  Calendar,
  Camera,
  Utensils,
  Car
} from 'lucide-react';

interface Tour {
  id: number;
  name: string;
  nameEn: string;
  duration: string;
  durationEn: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  highlights: string[];
  highlightsEn: string[];
  included: string[];
  includedEn: string[];
  maxGuests: number;
  category: string;
  categoryEn: string;
  badge?: string;
  badgeEn?: string;
}

const tours: Tour[] = [
  {
    id: 1,
    name: 'ทัวร์วัดป่าธรรมชาติ 1 วัน',
    nameEn: 'Forest Temple Nature Tour 1 Day',
    duration: '1 วัน (8 ชั่วโมง)',
    durationEn: '1 Day (8 hours)',
    price: 890,
    originalPrice: 1200,
    rating: 4.8,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop',
    highlights: ['วัดป่าดงพญาไผ่', 'น้ำตกห้วยแก้ว', 'อาหารเที่ยงแบบอีสาน', 'ชมการทำผ้าไหม'],
    highlightsEn: ['Dong Phayayen Forest Temple', 'Huai Kaew Waterfall', 'Isan Lunch', 'Silk Weaving Demo'],
    included: ['รถโดยสาร', 'มัคคุเทศก์', 'อาหารเที่ยง', 'ค่าเข้าชม'],
    includedEn: ['Transportation', 'Guide', 'Lunch', 'Entrance Fees'],
    maxGuests: 15,
    category: 'ธรรมชาติ',
    categoryEn: 'Nature',
    badge: 'ลดพิเศษ 26%',
    badgeEn: '26% OFF'
  },
  {
    id: 2,
    name: 'ทัวร์อาหารอีสานแท้ 4 ชั่วโมง',
    nameEn: 'Authentic Isan Food Tour 4 Hours',
    duration: 'ครึ่งวัน (4 ชั่วโมง)',
    durationEn: 'Half Day (4 hours)',
    price: 650,
    rating: 4.9,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    highlights: ['ตลาดเช้าเทศบาลนคร', 'ร้านส้มตำชื่อดัง 3 ร้าน', 'ลิ้มรสไส้กรอกอีสาน', 'เรียนทำลาบ'],
    highlightsEn: ['Municipal Morning Market', '3 Famous Som Tam Shops', 'Isan Sausage Tasting', 'Larb Cooking Class'],
    included: ['มัคคุเทศก์', 'อาหาร 8 จาน', 'น้ำดื่ม', 'ใบประกาศนียบัตร'],
    includedEn: ['Guide', '8 Dishes', 'Drinks', 'Certificate'],
    maxGuests: 8,
    category: 'อาหาร',
    categoryEn: 'Food',
    badge: 'ยอดนิยม',
    badgeEn: 'Popular'
  },
  {
    id: 3,
    name: 'ทัวร์ขอนแก่นไฮไลต์ 2 วัน 1 คืน',
    nameEn: 'Khon Kaen Highlights 2D1N',
    duration: '2 วัน 1 คืน',
    durationEn: '2 Days 1 Night',
    price: 2850,
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    highlights: ['บึงแก่นนคร', 'พิพิธภัณฑ์ไดโนเสาร์', 'วัดเทพธิดาราม', 'โรงแรม 4 ดาว'],
    highlightsEn: ['Kaen Nakhon Lake', 'Dinosaur Museum', 'Wat Thep Thidaram', '4-Star Hotel'],
    included: ['โรงแรม', 'อาหาร 5 มื้อ', 'รถโดยสาร', 'มัคคุเทศก์'],
    includedEn: ['Hotel', '5 Meals', 'Transportation', 'Guide'],
    maxGuests: 12,
    category: 'แพ็คเกจ',
    categoryEn: 'Package',
  }
];

export const ToursSection: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const isEnglish = currentLanguage.code === 'en';

  const getIncludedIcon = (item: string, itemEn: string) => {
    const text = isEnglish ? itemEn.toLowerCase() : item.toLowerCase();
    if (text.includes('รถ') || text.includes('transport')) return <Car className="h-4 w-4 text-primary" />;
    if (text.includes('อาหาร') || text.includes('meal') || text.includes('lunch')) return <Utensils className="h-4 w-4 text-primary" />;
    if (text.includes('มัคคุเทศก์') || text.includes('guide')) return <Users className="h-4 w-4 text-primary" />;
    if (text.includes('ถ่ายรูป') || text.includes('photo')) return <Camera className="h-4 w-4 text-primary" />;
    return <Star className="h-4 w-4 text-primary" />;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-accent/20 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            {t('tours.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('tours.subtitle')}
          </p>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {tours.map((tour, index) => (
            <Card 
              key={tour.id} 
              className="group overflow-hidden shadow-warm hover:shadow-elegant transition-all duration-300 border-0 bg-card-gradient"
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={tour.image}
                  alt={isEnglish ? tour.nameEn : tour.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-secondary text-secondary-foreground">
                    {isEnglish ? tour.categoryEn : tour.category}
                  </Badge>
                </div>
                {tour.badge && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-destructive text-destructive-foreground animate-bounce-gentle">
                      {isEnglish ? tour.badgeEn : tour.badge}
                    </Badge>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{isEnglish ? tour.durationEn : tour.duration}</span>
                      <Users className="h-4 w-4 ml-2" />
                      <span>{tour.maxGuests} {isEnglish ? 'max' : 'คน'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors flex-1 line-clamp-2">
                    {isEnglish ? tour.nameEn : tour.name}
                  </h3>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-sm">{tour.rating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">({tour.reviews} {isEnglish ? 'reviews' : 'รีวิว'})</span>
                </div>

                {/* Highlights */}
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-primary mb-2">
                    {isEnglish ? 'Highlights:' : 'ไฮไลต์:'}
                  </h4>
                  <div className="space-y-1">
                    {(isEnglish ? tour.highlightsEn : tour.highlights).slice(0, 3).map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="line-clamp-1">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Included */}
                <div className="mb-6">
                  <h4 className="font-semibold text-sm text-primary mb-2">
                    {isEnglish ? 'Included:' : 'รวมในราคา:'}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(isEnglish ? tour.includedEn : tour.included).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        {getIncludedIcon(tour.included[idx] || '', tour.includedEn[idx] || '')}
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">
                        ฿{tour.price.toLocaleString()}
                      </span>
                      {tour.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ฿{tour.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t('tours.person')}
                    </div>
                  </div>
                  <Button 
                    className="bg-hero-gradient text-white shadow-gold hover:opacity-90 px-6"
                    size="sm"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {t('common.bookNow')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center" data-aos="fade-up" data-aos-delay="450">
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8"
          >
            {t('tours.viewAll')} ({tours.length * 15}+ {isEnglish ? 'Tours' : 'ทัวร์'})
          </Button>
        </div>
      </div>
    </section>
  );
};