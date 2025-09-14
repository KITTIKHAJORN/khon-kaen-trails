import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, TreePine, Church, Coffee, Utensils, Landmark, Star, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useKhonKaenPlaces, formatPlaceTypes, type Place } from '@/hooks/usePlaces';

const Explore = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'reviews'>('rating');

  // Use our custom hook
  const { 
    restaurants, 
    attractions, 
    hotels, 
    universities, 
    malls,
    loading,
    error,
    fetchAllCategories 
  } = useKhonKaenPlaces();

  // Load data on component mount
  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  // Categories with real data counts
  const categories = [
    { id: 1, name: 'สถานที่ท่องเที่ยว', icon: TreePine, count: attractions.length, key: 'attractions' },
    { id: 2, name: 'วัดวาอาราม', icon: Church, count: 0, key: 'temples' }, // Can be filtered from attractions
    { id: 3, name: 'คาเฟ่', icon: Coffee, count: 0, key: 'cafes' }, // Can be filtered from restaurants
    { id: 4, name: 'ร้านอาหาร', icon: Utensils, count: restaurants.length, key: 'restaurants' },
    { id: 5, name: 'แหล่งช้อปปิ้ง', icon: Landmark, count: malls.length, key: 'malls' },
    { id: 6, name: 'ที่พัก', icon: MapPin, count: hotels.length, key: 'hotels' },
  ];

  // Get all places based on selected category
  const getAllPlaces = (): Place[] => {
    let allPlaces: Place[] = [];
    
    switch (selectedCategory) {
      case 'attractions':
        allPlaces = attractions;
        break;
      case 'restaurants':
        allPlaces = restaurants;
        break;
      case 'hotels':
        allPlaces = hotels;
        break;
      case 'malls':
        allPlaces = malls;
        break;
      case 'universities':
        allPlaces = universities;
        break;
      case 'temples':
        // Filter temples from attractions based on types
        allPlaces = attractions.filter(place => 
          place.types.some(type => type.includes('place_of_worship') || type.includes('hindu_temple'))
        );
        break;
      case 'cafes':
        // Filter cafes from restaurants based on types
        allPlaces = restaurants.filter(place => 
          place.types.some(type => type.includes('cafe') || type.includes('bakery'))
        );
        break;
      default:
        allPlaces = [...restaurants, ...attractions, ...hotels, ...universities, ...malls];
    }

    // Sort places
    return allPlaces.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'reviews':
          return (b.user_ratings_total || 0) - (a.user_ratings_total || 0);
        case 'name':
          return a.name.localeCompare(b.name, 'th');
        default:
          return 0;
      }
    });
  };

  const destinations = getAllPlaces();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                สำรวจขอนแก่น
              </h1>
              <p className="text-xl text-white/90">
                ค้นพบสถานที่ท่องเที่ยวที่น่าตื่นตาตื่นใจในจังหวัดขอนแก่น
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">หมวดหมู่สถานที่</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => {
                const IconComponent = category.icon;
                const isSelected = selectedCategory === category.key;
                return (
                  <div 
                    key={category.id} 
                    onClick={() => setSelectedCategory(isSelected ? '' : category.key)}
                    className={`bg-card rounded-lg p-6 text-center shadow-sm border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-border hover:shadow-md hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                    }`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {loading ? '...' : `${category.count} สถานที่`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Destinations */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">
                {selectedCategory ? 
                  `${categories.find(c => c.key === selectedCategory)?.name || 'สถานที่'} (${destinations.length})` :
                  `สถานที่ท่องเที่ยวทั้งหมด (${destinations.length})`
                }
              </h2>
              <div className="flex gap-2">
                <Button 
                  variant={selectedCategory === '' ? "default" : "outline"}
                  onClick={() => setSelectedCategory('')}
                >
                  ทั้งหมด
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSortBy(sortBy === 'rating' ? 'reviews' : sortBy === 'reviews' ? 'name' : 'rating')}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {sortBy === 'rating' ? 'เรียงตามคะแนน' : 
                   sortBy === 'reviews' ? 'เรียงตามรีวิว' : 'เรียงตามชื่อ'}
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">กำลังโหลดข้อมูลสถานที่...</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {destinations.slice(0, 12).map((destination) => (
                  <div 
                    key={destination.place_id} 
                    className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 relative flex items-center justify-center">
                      <MapPin className="h-16 w-16 text-primary/30" />
                      {destination.rating && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          {destination.rating.toFixed(1)}
                        </div>
                      )}
                      {destination.opening_hours?.open_now !== undefined && (
                        <div className={`absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-medium ${
                          destination.opening_hours.open_now 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {destination.opening_hours.open_now ? 'เปิดอยู่' : 'ปิดแล้ว'}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold line-clamp-2 flex-1 mr-2">{destination.name}</h3>
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full whitespace-nowrap">
                          {formatPlaceTypes(destination.types)}
                        </span>
                      </div>
                      
                      {destination.formatted_address && (
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {destination.formatted_address}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mb-4">
                        {destination.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{destination.rating.toFixed(1)}</span>
                            {destination.user_ratings_total && (
                              <span className="text-sm text-muted-foreground">
                                ({destination.user_ratings_total.toLocaleString()})
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Clock className="h-4 w-4" />
                          <span>1-3 ชั่วโมง</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => {
                          localStorage.setItem(`place_${destination.place_id}`, JSON.stringify(destination));
                          navigate(`/place/${destination.place_id}`);
                        }}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        ดูรายละเอียด
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <TreePine className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">ไม่พบสถานที่</h3>
                  <p className="text-muted-foreground mb-6">
                    ลองเลือกหมวดหมู่อื่นหรือรอสักครู่แล้วลองใหม่
                  </p>
                  <Button onClick={fetchAllCategories} variant="outline">
                    โหลดข้อมูลใหม่
                  </Button>
                </div>
              </div>
            )}
            
            {destinations.length > 12 && (
              <div className="text-center mt-12">
                <Button size="lg" variant="outline">
                  ดูสถานที่เพิ่มเติม ({destinations.length - 12}+)
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">อย่าพลาดข่าวสารใหม่ๆ</h2>
              <p className="text-xl mb-6 text-white/90">
                สมัครรับจดหมายข่าวเพื่อรับข้อมูลสถานที่ท่องเที่ยวใหม่และโปรโมชั่นพิเศษ
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="อีเมลของคุณ" 
                  className="flex-1 px-4 py-3 rounded-lg text-foreground"
                />
                <Button className="bg-white text-primary hover:bg-white/90">
                  สมัครสมาชิก
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Explore;