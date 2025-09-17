import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdvertisements } from '@/hooks/useAdvertisements';
import { ExternalLink, Star, MapPin } from 'lucide-react';

export const AdvertisementSection: React.FC = () => {
  const { advertisements, loading, error, fetchAdvertisements, clearError } = useAdvertisements();

  useEffect(() => {
    fetchAdvertisements();
  }, [fetchAdvertisements]);
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hotel':
        return 'bg-blue-500';
      case 'restaurant':
        return 'bg-green-500';
      case 'tour':
        return 'bg-purple-500';
      case 'shopping':
        return 'bg-orange-500';
      default:
        return 'bg-primary';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'hotel':
        return 'โรงแรม';
      case 'restaurant':
        return 'ร้านอาหาร';
      case 'tour':
        return 'ทัวร์';
      case 'shopping':
        return 'ช้อปปิ้ง';
      default:
        return 'สปอนเซอร์';
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">กำลังโหลดข้อมูลพาร์ทเนอร์...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-lg mb-4">
                <p className="font-medium">เกิดข้อผิดพลาดในการโหลดข้อมูลพาร์ทเนอร์</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
              <Button onClick={() => { clearError(); fetchAdvertisements(); }} variant="outline">
                ลองใหม่
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-accent/10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h3 className="text-2xl font-bold text-primary mb-2">
            พาร์ทเนอร์ของเราในขอนแก่น
          </h3>
          <p className="text-muted-foreground">
            บริการและสถานที่แนะนำจากพันธมิตรคุณภาพ
          </p>
        </div>

        {/* Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {advertisements.map((ad, index) => (
            <Card 
              key={ad.id}
              className="group overflow-hidden shadow-warm hover:shadow-elegant transition-all duration-300 border-0 bg-card-gradient cursor-pointer"
              data-aos="fade-up"
              data-aos-delay={index * 100}
              onClick={() => window.open(ad.link, '_blank')}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className={`${getTypeColor(ad.type)} text-white`}>
                    {getTypeName(ad.type)}
                  </Badge>
                </div>
                {ad.badge && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-secondary text-secondary-foreground animate-bounce-gentle">
                      {ad.badge}
                    </Badge>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <Button size="sm" variant="secondary" className="ml-auto">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    ดูเพิ่มเติม
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <h4 className="font-bold text-primary mb-1 group-hover:text-secondary transition-colors line-clamp-1">
                  {ad.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {ad.subtitle}
                </p>

                {/* Details */}
                <div className="space-y-2 text-xs">
                  {ad.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{ad.rating}</span>
                    </div>
                  )}
                  {ad.location && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{ad.location}</span>
                    </div>
                  )}
                  {ad.price && (
                    <div className="text-primary font-bold">
                      {ad.price}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sponsor Notice */}
        <div className="text-center" data-aos="fade-up" data-aos-delay="300">
          <p className="text-xs text-muted-foreground">
            📢 สนใจลงโฆษณาหรือเป็นพาร์ทเนอร์กับเรา? 
            <Button variant="link" size="sm" className="px-1 h-auto text-primary">
              ติดต่อเรา
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
};