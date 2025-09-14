import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Search, Filter, Navigation2, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlacesSearch, useKhonKaenPlaces, formatPlaceTypes, getPriceLevel, type Place } from '@/hooks/usePlaces';
import { testApiResponse } from '@/api/mapapi';
import { PlaceSearch } from '@/components/PlaceSearch';
import { SimpleMap } from '@/components/SimpleMap';
import { StaticMap } from '@/components/StaticMap';
import { InteractiveOpenStreetMap } from '@/components/InteractiveOpenStreetMap';
import { PlaceDetailsModal } from '@/components/PlaceDetailsModal';

const Map = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapType, setMapType] = useState<'simple' | 'static' | 'openstreet'>('openstreet');
  
  // Use our custom hooks
  const { places, loading, error, searchPlaces, clearError } = usePlacesSearch();
  const { 
    restaurants, 
    attractions, 
    hotels, 
    universities, 
    malls,
    loading: khonKaenLoading,
    error: khonKaenError,
    fetchAllCategories 
  } = useKhonKaenPlaces();

  // Load initial data
  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  // Handle search
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchPlaces({
        query: `${searchQuery} ขอนแก่น`,
        location: '16.4419,102.8360',
        radius: 5000,
        language: 'th',
        region: 'th'
      });
    }
  };

  // Filter places based on selected criteria
  const getFilteredPlaces = () => {
    let allPlaces: Place[] = [];
    
    // Combine all categories if no specific category is selected
    if (selectedCategory.length === 0) {
      allPlaces = [...restaurants, ...attractions, ...hotels, ...universities, ...malls];
    } else {
      if (selectedCategory.includes('ร้านอาหาร')) allPlaces.push(...restaurants);
      if (selectedCategory.includes('สถานที่ท่องเที่ยว')) allPlaces.push(...attractions);
      if (selectedCategory.includes('ที่พัก')) allPlaces.push(...hotels);
      if (selectedCategory.includes('มหาวิทยาลัย')) allPlaces.push(...universities);
      if (selectedCategory.includes('แหล่งช้อปปิ้ง')) allPlaces.push(...malls);
    }

    // Filter by rating if selected
    if (selectedRating) {
      allPlaces = allPlaces.filter(place => 
        place.rating && place.rating >= selectedRating
      );
    }

    // If we have search results, use those instead
    if (places.length > 0) {
      return places;
    }

    return allPlaces.slice(0, 20); // Limit to 20 places for performance
  };

  const filteredPlaces = getFilteredPlaces();

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Get popular places for sidebar
  const getPopularPlaces = () => {
    const allPlaces = [...restaurants, ...attractions, ...hotels];
    return allPlaces
      .filter(place => place.rating && place.rating >= 4.5)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
  };

  // Handle place selection from map or other components
  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  // Test API function
  const handleTestApi = async () => {
    try {
      const response = await testApiResponse();
      console.log('API Test completed. Check console for details.');
    } catch (error) {
      console.error('API Test failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                แผนที่ขอนแก่น
              </h1>
              <p className="text-xl text-white/90">
                สำรวจสถานที่ท่องเที่ยวในจังหวัดขอนแก่นผ่านแผนที่อินเตอร์แอคทีฟ
              </p>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Map Controls */}
              <div className="lg:w-1/4">
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                  <h2 className="text-2xl font-bold mb-6">ตัวกรองการค้นหา</h2>
                  
                  {/* Search */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">ค้นหาสถานที่</label>
                    <PlaceSearch 
                      placeholder="ค้นหาสถานที่ในขอนแก่น..."
                      onPlaceSelect={handlePlaceSelect}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Categories */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">หมวดหมู่</label>
                    <div className="space-y-2">
                      {[
                        { name: 'สถานที่ท่องเที่ยว', count: attractions.length },
                        { name: 'ร้านอาหาร', count: restaurants.length },
                        { name: 'ที่พัก', count: hotels.length },
                        { name: 'แหล่งช้อปปิ้ง', count: malls.length },
                        { name: 'มหาวิทยาลัย', count: universities.length }
                      ].map((category) => (
                        <div key={category.name} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id={category.name} 
                              checked={selectedCategory.includes(category.name)}
                              onChange={() => handleCategoryChange(category.name)}
                              className="mr-2 h-4 w-4 text-primary"
                            />
                            <label htmlFor={category.name} className="text-sm">{category.name}</label>
                          </div>
                          <span className="text-xs text-muted-foreground">({category.count})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">คะแนนรีวิวขั้นต่ำ</label>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center">
                          <input 
                            type="radio" 
                            name="rating" 
                            id={`rating-${rating}`} 
                            checked={selectedRating === rating}
                            onChange={() => setSelectedRating(rating)}
                            className="mr-2 h-4 w-4 text-primary"
                          />
                          <label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                            {Array(rating).fill(0).map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            ))}
                            {rating < 5 && Array(5 - rating).fill(0).map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-gray-300" />
                            ))}
                            <span className="ml-2">ขึ้นไป</span>
                          </label>
                        </div>
                      ))}
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          name="rating" 
                          id="rating-all" 
                          checked={selectedRating === null}
                          onChange={() => setSelectedRating(null)}
                          className="mr-2 h-4 w-4 text-primary"
                        />
                        <label htmlFor="rating-all" className="text-sm">ทั้งหมด</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        onClick={() => {
                          setSelectedCategory([]);
                          setSelectedRating(null);
                        }}
                        variant="outline"
                      >
                        ล้างตัวกรอง
                      </Button>
                      <Button className="flex-1">
                        <Filter className="mr-2 h-4 w-4" />
                        กรอง ({selectedCategory.length + (selectedRating ? 1 : 0)})
                      </Button>
                    </div>
                    
                    {/* Map Type Selector */}
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium mb-2">ประเภทแผนที่</label>
                      <div className="grid grid-cols-1 gap-2">
                        <Button
                          size="sm"
                          variant={mapType === 'openstreet' ? 'default' : 'outline'}
                          onClick={() => setMapType('openstreet')}
                          className="w-full"
                        >
                          🗺️ OpenStreetMap
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            size="sm"
                            variant={mapType === 'simple' ? 'default' : 'outline'}
                            onClick={() => setMapType('simple')}
                          >
                            แผนที่ง่าย
                          </Button>
                          <Button
                            size="sm"
                            variant={mapType === 'static' ? 'default' : 'outline'}
                            onClick={() => setMapType('static')}
                          >
                            Google Maps
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Debug Section */}
                    <div className="border-t pt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleTestApi}
                        className="w-full"
                      >
                        🔍 ทดสอบ API
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1 text-center">
                        ตรวจสอบข้อมูลใน Console
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Popular Places */}
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border mt-6">
                  <h3 className="text-xl font-bold mb-4">สถานที่ยอดนิยม</h3>
                  {khonKaenLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getPopularPlaces().map((place, index) => (
                        <div 
                          key={place.place_id} 
                          className="flex items-center justify-between p-3 hover:bg-muted rounded-lg cursor-pointer"
                          onClick={() => handlePlaceSelect(place)}
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1">{place.name}</h4>
                            <div className="flex items-center mb-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                              <span className="text-sm">{place.rating?.toFixed(1)}</span>
                              {place.user_ratings_total && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({place.user_ratings_total})
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatPlaceTypes(place.types)}
                            </div>
                          </div>
                          <MapPin className="h-5 w-5 text-primary ml-2" />
                        </div>
                      ))}
                      {getPopularPlaces().length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          ไม่มีข้อมูลสถานที่ยอดนิยม
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Map Area */}
              <div className="lg:w-3/4">
                <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                  {/* Error Display */}
                  {(error || khonKaenError) && (
                    <div className="absolute top-4 left-4 right-4 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2 rounded-lg z-20">
                      <p className="text-sm">{error || khonKaenError}</p>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => {
                          clearError();
                          if (khonKaenError) fetchAllCategories();
                        }}
                        className="mt-1 h-6 px-2 text-xs"
                      >
                        ลองใหม่
                      </Button>
                    </div>
                  )}
                  
                  {/* Map Component */}
                  {mapType === 'openstreet' ? (
                    <InteractiveOpenStreetMap
                      places={filteredPlaces}
                      selectedCategories={selectedCategory}
                      onPlaceSelect={handlePlaceSelect}
                      className="w-full"
                      height="600px"
                    />
                  ) : mapType === 'simple' ? (
                    <SimpleMap
                      places={filteredPlaces}
                      selectedCategories={selectedCategory}
                      onPlaceSelect={handlePlaceSelect}
                      className="w-full"
                      height="600px"
                    />
                  ) : (
                    <StaticMap
                      places={filteredPlaces}
                      selectedCategories={selectedCategory}
                      onPlaceSelect={handlePlaceSelect}
                      className="w-full"
                      height="600px"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Directions Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">วางแผนเส้นทาง</h2>
            <div className="max-w-4xl mx-auto bg-card rounded-xl p-8 shadow-sm border border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">จุดเริ่มต้น</label>
                  <input 
                    type="text" 
                    placeholder="เลือกจุดเริ่มต้น" 
                    className="w-full px-4 py-2 border border-input rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">จุดหมาย</label>
                  <input 
                    type="text" 
                    placeholder="เลือกจุดหมาย" 
                    className="w-full px-4 py-2 border border-input rounded-lg"
                  />
                </div>
              </div>
              <Button className="w-full">
                <Navigation2 className="mr-2 h-4 w-4" />
                ค้นหาเส้นทาง
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />
      
      {/* Place Details Modal */}
      <PlaceDetailsModal
        place={selectedPlace}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlace(null);
        }}
      />
    </div>
  );
};

export default Map;
