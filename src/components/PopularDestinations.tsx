import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Star, Clock, Camera } from 'lucide-react';
import { useKhonKaenPlaces, formatPlaceTypes, type Place } from '@/hooks/usePlaces';

// ลบข้อมูล fallback - ใช้เฉพาะข้อมูลจาก API

export const PopularDestinations: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const isEnglish = currentLanguage.code === 'en';
  
  // Use our API hook
  const { 
    restaurants, 
    attractions, 
    hotels,
    loading,
    error,
    fetchAllCategories 
  } = useKhonKaenPlaces();

  // Load data on component mount
  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  // Get popular destinations from API data
  const getPopularDestinations = (): Place[] => {
    const allPlaces = [...restaurants, ...attractions, ...hotels];
    return allPlaces
      .filter(place => place.rating && place.rating >= 4.3)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);
  };

  const destinations = getPopularDestinations();

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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">กำลังโหลดสถานที่ยอดนิยม...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-lg mb-4">
                <p className="font-medium">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
              <Button onClick={fetchAllCategories} variant="outline">
                ลองใหม่
              </Button>
            </div>
          </div>
        ) : destinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {destinations.map((destination, index) => (
              <Card 
                key={destination.place_id} 
                className="group overflow-hidden bg-card-gradient shadow-warm hover:shadow-elegant transition-all duration-300 border-0"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Image Placeholder */}
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-500">
                    <MapPin className="h-12 w-12 text-primary/40" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary text-primary-foreground">
                      {formatPlaceTypes(destination.types)}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <Camera className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  {destination.opening_hours?.open_now !== undefined && (
                    <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                      destination.opening_hours.open_now 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {destination.opening_hours.open_now ? 'เปิดอยู่' : 'ปิดแล้ว'}
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-primary-light transition-colors line-clamp-2">
                    {destination.name}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {destination.formatted_address || 'ขอนแก่น, ประเทศไทย'}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{destination.rating?.toFixed(1)}</span>
                      {destination.user_ratings_total && (
                        <span className="text-muted-foreground">({destination.user_ratings_total.toLocaleString()})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>1-3 ชั่วโมง</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                    onClick={() => {
                      localStorage.setItem(`place_${destination.place_id}`, JSON.stringify(destination));
                      navigate(`/place/${destination.place_id}`);
                    }}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    {t('common.viewDetails')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">ไม่พบสถานที่ยอดนิยม</h3>
              <p className="text-muted-foreground mb-6">
                กรุณารอสักครู่ ระบบกำลังโหลดข้อมูล
              </p>
            </div>
          </div>
        )}

        {/* View All Button */}
        {destinations.length > 0 && (
          <div className="text-center" data-aos="fade-up" data-aos-delay="400">
            <Button size="lg" className="bg-hero-gradient text-white shadow-gold hover:opacity-90 px-8">
              {t('destinations.viewAll')} ({[...restaurants, ...attractions, ...hotels].length}+)
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};