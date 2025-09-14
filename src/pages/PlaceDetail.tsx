import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  MapPin, Star, Clock, Phone, Globe, Navigation as NavigationIcon, 
  ArrowLeft, Share2, Heart, Camera, Users, Calendar, 
  ThermometerSun, Droplets, Wind, Eye, Sunrise, Sunset,
  Cloud, Sun, CloudRain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPlaceTypes, getPriceLevel, getPlaceCoordinates, type Place } from '@/hooks/usePlaces';
import { getWeatherByCoordinates } from '@/api/weatherapi';
import { getPlaceReviews, processPlacePhotos, getPlacePhotoUrl } from '@/api/mapapi';
import { PhotoViewer } from '@/components/PhotoViewer';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  description: string;
  icon: string;
  sunrise: string;
  sunset: string;
  feelsLike: number;
}

interface ReviewData {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

const PlaceDetail = () => {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [place, setPlace] = useState<Place | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [placeDetails, setPlaceDetails] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load place data (in real app, this would come from API or state)
  useEffect(() => {
    // For now, get place from localStorage or state management
    const savedPlace = localStorage.getItem(`place_${placeId}`);
    if (savedPlace) {
      try {
        const placeData = JSON.parse(savedPlace);
        setPlace(placeData);
        loadWeatherData(placeData);
        loadPlaceDetails(placeData.place_id);
        loadPlacePhotos(placeData);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลสถานที่ได้');
      }
    } else {
      setError('ไม่พบข้อมูลสถานที่');
    }
    setIsLoading(false);
  }, [placeId]);

  const loadWeatherData = async (placeData: Place) => {
    setWeatherLoading(true);
    try {
      const coords = getPlaceCoordinates(placeData);
      if (coords) {
        console.log('🌤️ Loading weather for coordinates:', coords);
        
        const weatherResponse = await getWeatherByCoordinates(coords.lat, coords.lng);
        console.log('🌤️ Weather API Response:', weatherResponse);
        
        if (weatherResponse) {
          // ตรวจสอบโครงสร้างข้อมูลที่ได้จาก API
          let weatherData = null;
          
          // รูปแบบ 1: มี current object
          if (weatherResponse.current) {
            const current = weatherResponse.current;
            // แปลงจาก Kelvin เป็น Celsius ถ้าจำเป็น
            const tempC = current.temp_c || current.temperature || (current.main?.temp ? (current.main.temp > 100 ? current.main.temp - 273.15 : current.main.temp) : 25);
            const feelsLikeC = current.feelslike_c || current.feels_like || (current.main?.feels_like ? (current.main.feels_like > 100 ? current.main.feels_like - 273.15 : current.main.feels_like) : tempC);
            
            weatherData = {
              temperature: Math.round(tempC),
              humidity: current.humidity || current.main?.humidity || 60,
              windSpeed: current.wind_kph || current.wind?.speed || 5,
              visibility: current.vis_km || current.visibility || 10,
              description: current.condition?.text || current.weather?.[0]?.description || 'ท้องฟ้าใส',
              icon: current.condition?.icon || current.weather?.[0]?.icon || '01d',
              sunrise: weatherResponse.astronomy?.sunrise || '06:00',
              sunset: weatherResponse.astronomy?.sunset || '18:00',
              feelsLike: Math.round(feelsLikeC)
            };
          }
          // รูปแบบ 2: ข้อมูลอยู่ใน list[0] (forecast format)
          else if (weatherResponse.list && weatherResponse.list[0]) {
            const current = weatherResponse.list[0];
            // แปลงจาก Kelvin เป็น Celsius ถ้าจำเป็น
            const tempC = current.main?.temp ? (current.main.temp > 100 ? current.main.temp - 273.15 : current.main.temp) : current.temp_c || 25;
            const feelsLikeC = current.main?.feels_like ? (current.main.feels_like > 100 ? current.main.feels_like - 273.15 : current.main.feels_like) : tempC;
            
            weatherData = {
              temperature: Math.round(tempC),
              humidity: current.main?.humidity || current.humidity || 60,
              windSpeed: current.wind?.speed || current.wind_kph || 5,
              visibility: current.visibility || current.vis_km || 10,
              description: current.weather?.[0]?.description || current.condition?.text || 'ท้องฟ้าใส',
              icon: current.weather?.[0]?.icon || current.condition?.icon || '01d',
              sunrise: '06:00',
              sunset: '18:00',
              feelsLike: Math.round(feelsLikeC)
            };
          }
          // รูปแบบ 3: ข้อมูลอยู่ใน root object
          else if (weatherResponse.main || weatherResponse.temp_c) {
            const tempC = weatherResponse.temp_c || (weatherResponse.main?.temp ? (weatherResponse.main.temp > 100 ? weatherResponse.main.temp - 273.15 : weatherResponse.main.temp) : 25);
            const feelsLikeC = weatherResponse.feelslike_c || (weatherResponse.main?.feels_like ? (weatherResponse.main.feels_like > 100 ? weatherResponse.main.feels_like - 273.15 : weatherResponse.main.feels_like) : tempC);
            
            weatherData = {
              temperature: Math.round(tempC),
              humidity: weatherResponse.main?.humidity || weatherResponse.humidity || 60,
              windSpeed: weatherResponse.wind?.speed || weatherResponse.wind_kph || 5,
              visibility: weatherResponse.visibility || weatherResponse.vis_km || 10,
              description: weatherResponse.weather?.[0]?.description || weatherResponse.condition?.text || 'ท้องฟ้าใส',
              icon: weatherResponse.weather?.[0]?.icon || weatherResponse.condition?.icon || '01d',
              sunrise: '06:00',
              sunset: '18:00',
              feelsLike: Math.round(feelsLikeC)
            };
          }
          // รูปแบบ 4: ใช้ข้อมูล default สำหรับขอนแก่น
          else {
            console.warn('⚠️ Using default weather data for Khon Kaen');
            weatherData = {
              temperature: 28,
              humidity: 65,
              windSpeed: 8,
              visibility: 10,
              description: 'ท้องฟ้าใส',
              icon: '01d',
              sunrise: '06:00',
              sunset: '18:30',
              feelsLike: 32
            };
          }
          
          if (weatherData) {
            console.log('✅ Weather data processed:', weatherData);
            setWeather(weatherData);
          } else {
            console.warn('❌ Could not parse weather data structure');
          }
        }
      }
    } catch (err) {
      console.error('❌ Weather loading error:', err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const loadPlaceDetails = async (placeId: string) => {
    setReviewsLoading(true);
    try {
      console.log('📝 Loading place details and reviews for:', placeId);
      
      const detailsResponse = await getPlaceReviews(placeId);
      console.log('📝 Place details response:', detailsResponse);
      
      if (detailsResponse) {
        setPlaceDetails(detailsResponse);
        if (detailsResponse.reviews && detailsResponse.reviews.length > 0) {
          setReviews(detailsResponse.reviews);
          console.log('✅ Loaded reviews:', detailsResponse.reviews.length);
        }
      }
    } catch (err) {
      console.error('❌ Place details loading error:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadPlacePhotos = async (placeData: Place) => {
    setPhotosLoading(true);
    try {
      console.log('📸 Processing photos for place:', placeData.name);
      console.log('📸 Available photos:', placeData.photos?.length || 0);
      
      if (placeData.photos && placeData.photos.length > 0) {
        // ใช้ฟังก์ชันจาก mapapi.js เพื่อ process photos
        const processedPhotos = processPlacePhotos(placeData.photos, 12);
        
        console.log('✅ Processed photos:', processedPhotos.length);
        setPhotos(processedPhotos);
      }
    } catch (err) {
      console.error('❌ Photos processing error:', err);
    } finally {
      setPhotosLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleGetDirections = () => {
    if (place) {
      const coords = getPlaceCoordinates(place);
      if (coords) {
        const destination = `${coords.lat},${coords.lng}`;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${place.place_id}`;
        window.open(url, '_blank');
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share && place) {
      try {
        await navigator.share({
          title: place.name,
          text: `ดูรายละเอียด ${place.name} - ${place.formatted_address}`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to copy URL
        navigator.clipboard.writeText(window.location.href);
        alert('คัดลอกลิงก์แล้ว!');
      }
    }
  };

  const handleTestWeather = async () => {
    if (place) {
      console.log('🧪 Testing weather API...');
      await loadWeatherData(place);
    }
  };

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('sun') || desc.includes('clear')) return <Sun className="h-6 w-6 text-yellow-500" />;
    if (desc.includes('cloud')) return <Cloud className="h-6 w-6 text-gray-500" />;
    if (desc.includes('rain')) return <CloudRain className="h-6 w-6 text-blue-500" />;
    return <Sun className="h-6 w-6 text-yellow-500" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">ไม่พบข้อมูลสถานที่</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const coords = getPlaceCoordinates(place);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Header */}
        <section className="relative bg-gradient-to-r from-primary to-primary-dark py-8 overflow-hidden">
          {/* Background Image */}
          {place.photos && place.photos.length > 0 && (
            <div className="absolute inset-0 z-0">
              <div className="w-full h-full opacity-20">
                <PhotoViewer
                  photoReference={place.photos[0].photo_reference}
                  alt={place.name}
                  className="w-full h-full"
                  maxWidth={1200}
                  showFallback={false}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-dark/80"></div>
            </div>
          )}
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <Button 
                onClick={handleBack} 
                variant="outline" 
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                กลับ
              </Button>
              <div className="flex gap-2">
                <Button 
                  onClick={handleShare} 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="max-w-4xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {place.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {formatPlaceTypes(place.types)}
                  </Badge>
                  {place.opening_hours?.open_now !== undefined && (
                    <Badge 
                      variant={place.opening_hours.open_now ? "default" : "destructive"}
                      className={place.opening_hours.open_now ? "bg-green-500 text-white" : "bg-red-500 text-white"}
                    >
                      {place.opening_hours.open_now ? 'เปิดอยู่' : 'ปิดแล้ว'}
                    </Badge>
                  )}
                </div>
                
                {place.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xl font-bold">{place.rating.toFixed(1)}</span>
                    {place.user_ratings_total && (
                      <span className="text-white/80">
                        ({place.user_ratings_total.toLocaleString()} รีวิว)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Place Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      ข้อมูลพื้นฐาน
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {place.formatted_address && (
                      <div>
                        <h4 className="font-semibold mb-1">ที่อยู่</h4>
                        <p className="text-muted-foreground">{place.formatted_address}</p>
                      </div>
                    )}
                    
                    {coords && (
                      <div>
                        <h4 className="font-semibold mb-1">พิกัด</h4>
                        <p className="text-muted-foreground">
                          {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                        </p>
                      </div>
                    )}

                    {place.price_level && (
                      <div>
                        <h4 className="font-semibold mb-1">ระดับราคา</h4>
                        <p className="text-muted-foreground">{getPriceLevel(place.price_level)}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-2">ประเภทสถานที่</h4>
                      <div className="flex flex-wrap gap-2">
                        {place.types.slice(0, 8).map((type, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {type.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      รีวิวและคะแนน
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {place.rating ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-4xl font-bold text-primary">{place.rating.toFixed(1)}</div>
                              <div className="flex items-center justify-center">
                                {Array(5).fill(0).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${
                                      i < Math.floor(place.rating!) 
                                        ? 'text-yellow-500 fill-yellow-500' 
                                        : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                            </div>
                            
                            {place.user_ratings_total && (
                              <div>
                                <div className="flex items-center gap-2 text-lg font-semibold">
                                  <Users className="h-5 w-5 text-primary" />
                                  {place.user_ratings_total.toLocaleString()}
                                </div>
                                <p className="text-sm text-muted-foreground">รีวิวทั้งหมด</p>
                              </div>
                            )}
                          </div>
                          
                          <Button onClick={() => window.open(`https://www.google.com/maps/place/?q=place_id:${place.place_id}`, '_blank')}>
                            ดูรีวิวใน Google Maps
                          </Button>
                        </div>

                        {/* Real Reviews from API */}
                        {reviewsLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                              <p className="text-sm text-muted-foreground">กำลังโหลดรีวิว...</p>
                            </div>
                          </div>
                        ) : reviews.length > 0 ? (
                          <div className="space-y-4">
                            <h4 className="font-semibold">รีวิวจาก Google Maps</h4>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                              {reviews.slice(0, 5).map((review, index) => (
                                <div key={index} className="border-b border-border pb-4 last:border-b-0">
                                  <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                      <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-1">
                                        <h5 className="font-medium">{review.author_name}</h5>
                                        <div className="flex items-center gap-1">
                                          {Array(5).fill(0).map((_, i) => (
                                            <Star 
                                              key={i} 
                                              className={`h-3 w-3 ${
                                                i < review.rating 
                                                  ? 'text-yellow-500 fill-yellow-500' 
                                                  : 'text-gray-300'
                                              }`} 
                                            />
                                          ))}
                                        </div>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-2">
                                        {review.relative_time_description}
                                      </p>
                                      <p className="text-sm line-clamp-3">{review.text}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {reviews.length > 5 && (
                              <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => window.open(`https://www.google.com/maps/place/?q=place_id:${place.place_id}`, '_blank')}
                              >
                                ดูรีวิวทั้งหมด ({reviews.length}) ใน Google Maps
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="bg-muted/30 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">ข้อมูลรีวิว</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              คะแนนและจำนวนรีวิวเป็นข้อมูลจริงจาก Google Places API
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">คะแนนเฉลี่ย</span>
                                <div className="text-2xl font-bold text-primary">{place.rating?.toFixed(1)}</div>
                              </div>
                              <div>
                                <span className="font-medium">จำนวนรีวิว</span>
                                <div className="text-2xl font-bold text-primary">
                                  {place.user_ratings_total?.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-xs text-muted-foreground">
                                💡 รายละเอียดรีวิวแต่ละรายการต้องใช้ Google Places Details API เพิ่มเติม
                              </p>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full mt-2"
                                onClick={() => loadPlaceDetails(place.place_id)}
                                disabled={reviewsLoading}
                              >
                                {reviewsLoading ? '🔄 กำลังโหลด...' : '📝 โหลดรีวิวจาก API'}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">ไม่มีข้อมูลคะแนนรีวิว</p>
                    )}
                  </CardContent>
                </Card>

                {/* Photos Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Camera className="h-5 w-5 text-primary" />
                        รูปภาพ ({photos.length > 0 ? photos.length : (place.photos?.length || 0)})
                      </div>
                      {place.photos && place.photos.length > 0 && photos.length === 0 && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => loadPlacePhotos(place)}
                          disabled={photosLoading}
                        >
                          {photosLoading ? '🔄 กำลังโหลด...' : '📸 โหลดรูปจาก Google'}
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {photosLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                          <p className="text-sm text-muted-foreground">กำลังโหลดรูปภาพ...</p>
                        </div>
                      </div>
                    ) : photos.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {photos.slice(0, 6).map((photo, index) => (
                            <div 
                              key={index}
                              className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform shadow-sm border border-border"
                              onClick={() => window.open(photo.url, '_blank')}
                            >
                              <img
                                src={photo.thumbnail_url}
                                alt={`รูปภาพ ${place.name} ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback ถ้ารูปโหลดไม่ได้
                                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuC4o+C4ueC4m+C4oOC4suC4nuC5hOC4oeC5iOC5guC4q+C4peC4lOC5hOC4lOC5iDwvdGV4dD48L3N2Zz4=';
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-end p-2">
                                <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  รูปที่ {index + 1}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {photos.length > 6 && (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                              // แสดงรูปภาพทั้งหมดใน modal หรือ gallery
                              console.log('Show all photos:', photos.length);
                            }}
                          >
                            ดูรูปภาพทั้งหมด ({photos.length})
                          </Button>
                        )}
                        
                        <p className="text-xs text-muted-foreground">
                          📸 รูปภาพจาก Google Places Photo API
                        </p>
                      </div>
                    ) : place.photos && place.photos.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {place.photos.slice(0, 6).map((photo, index) => (
                            <div 
                              key={index}
                              className="aspect-square rounded-lg overflow-hidden shadow-sm border border-border relative group"
                            >
                              <PhotoViewer
                                photoReference={photo.photo_reference}
                                alt={`รูปภาพ ${place.name} ${index + 1}`}
                                className="w-full h-full"
                                maxWidth={400}
                                showFallback={true}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end p-2 pointer-events-none">
                                <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  รูปที่ {index + 1}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {place.photos.length > 6 && (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => loadPlacePhotos(place)}
                          >
                            โหลดรูปภาพเพิ่มเติม ({place.photos.length - 6})
                          </Button>
                        )}
                        
                        <div className="bg-amber-50 border border-amber-200 rounded p-3">
                          <p className="text-xs text-amber-800 font-medium mb-1">
                            📸 รูปภาพจาก Google Places API
                          </p>
                          <p className="text-xs text-amber-600">
                            💡 ใช้ photo_reference จากข้อมูล Places API ที่มีอยู่แล้ว
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">ไม่มีรูปภาพสำหรับสถานที่นี้</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Weather & Actions */}
              <div className="space-y-6">
                {/* Weather Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ThermometerSun className="h-5 w-5 text-orange-500" />
                      สภาพอากาศปัจจุบัน
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {weatherLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : weather ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            {getWeatherIcon(weather.description)}
                          </div>
                          <div className="text-3xl font-bold text-primary">{weather.temperature}°C</div>
                          <p className="text-muted-foreground">{weather.description}</p>
                          <p className="text-sm text-muted-foreground">
                            รู้สึกเหมือน {weather.feelsLike}°C
                          </p>
                        </div>

                        <div className="text-center">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={handleTestWeather}
                            disabled={weatherLoading}
                          >
                            {weatherLoading ? '🔄 กำลังโหลด...' : '🧪 ทดสอบ Weather API'}
                          </Button>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-blue-500" />
                            <span>ความชื้น {weather.humidity}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Wind className="h-4 w-4 text-gray-500" />
                            <span>ลม {weather.windSpeed} km/h</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-purple-500" />
                            <span>ทัศนวิสัย {weather.visibility} km</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sunrise className="h-4 w-4 text-orange-500" />
                            <span>พระอาทิตย์ขึ้น {weather.sunrise}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        ไม่สามารถโหลดข้อมูลสภาพอากาศได้
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <Button onClick={handleGetDirections} className="w-full">
                      <NavigationIcon className="mr-2 h-4 w-4" />
                      นำทาง
                    </Button>
                    {placeDetails?.formatted_phone_number ? (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.open(`tel:${placeDetails.formatted_phone_number}`, '_self')}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        {placeDetails.formatted_phone_number}
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        <Phone className="mr-2 h-4 w-4" />
                        ไม่มีเบอร์โทรศัพท์
                      </Button>
                    )}
                    
                    {placeDetails?.website ? (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.open(placeDetails.website, '_blank')}
                      >
                        <Globe className="mr-2 h-4 w-4" />
                        เว็บไซต์
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        <Globe className="mr-2 h-4 w-4" />
                        ไม่มีเว็บไซต์
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">ข้อมูลสรุป</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ประเภท</span>
                      <span className="font-medium">{formatPlaceTypes(place.types)}</span>
                    </div>
                    
                    {place.business_status && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">สถานะ</span>
                        <span className="font-medium">
                          {place.business_status === 'OPERATIONAL' ? 'เปิดให้บริการ' : 
                           place.business_status === 'CLOSED_TEMPORARILY' ? 'ปิดชั่วคราว' :
                           place.business_status === 'CLOSED_PERMANENTLY' ? 'ปิดถาวร' : 
                           place.business_status}
                        </span>
                      </div>
                    )}
                    
                    {place.price_level && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ระดับราคา</span>
                        <span className="font-medium">{getPriceLevel(place.price_level)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Place ID</span>
                      <span className="font-mono text-xs">{place.place_id.slice(0, 12)}...</span>
                    </div>
                  </CardContent>
                </Card>
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

export default PlaceDetail;
