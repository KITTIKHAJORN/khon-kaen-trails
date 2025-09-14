
import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';

import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';

import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Calendar, Users, Star, Filter, Search, Bed, Car, Ticket, ExternalLink, Eye, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getBookingHotelsList, getHotelDetailsFromBooking, testPhotosAPI } from '@/api/bookingapi';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bed, Calendar, Car, Filter, MapPin, Star, Users } from 'lucide-react';
import { useState } from 'react';


const Booking = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('hotels');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Load hotels from API
  useEffect(() => {
    loadHotels();
  }, [currentPage]);

  const loadHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 กำลังโหลดโรงแรมจาก API...');
      const response = await getBookingHotelsList(currentPage);
      console.log('✅ โหลดโรงแรมสำเร็จ:', response);
      
      if (response.results && Array.isArray(response.results)) {
        // Debug: ตรวจสอบข้อมูลรูปภาพของโรงแรม
        response.results.forEach((hotel, index) => {
          console.log(`🏨 โรงแรม ${index + 1}:`, hotel.name)
          console.log(`📸 รูปภาพ:`, hotel.photos)
          if (hotel.photos && hotel.photos.length > 0) {
            console.log(`📸 รูปภาพแรก:`, hotel.photos[0])
          }
        });
        
        setHotels(prevHotels => 
          currentPage === 0 ? response.results : [...prevHotels, ...response.results]
        );
      }
    } catch (err) {
      console.error('❌ ข้อผิดพลาดในการโหลดโรงแรม:', err);
      // ไม่แสดง error message ให้ใช้ข้อมูลจำลองแทน
    } finally {
      setLoading(false);
    }
  };

  const handleHotelClick = async (hotel) => {
    console.log('🏨 ข้อมูลโรงแรมที่เลือก:', hotel);
    console.log('📸 รูปภาพโรงแรม:', hotel.photos);
    console.log('📸 รูปภาพแรก:', hotel.photos?.[0]);
    
    setSelectedHotel(hotel);
    setShowDetails(true);
    
    // ดึงรายละเอียดเพิ่มเติมของโรงแรม
    if (hotel.booking_data?.hotel_id) {
      try {
        console.log('🔄 กำลังดึงรายละเอียดโรงแรม:', hotel.booking_data.hotel_id);
        const details = await getHotelDetailsFromBooking(hotel.booking_data.hotel_id);
        setHotelDetails(details);
        console.log('✅ รายละเอียดโรงแรม:', details);
      } catch (err) {
        console.log('⚠️ ไม่สามารถดึงรายละเอียดโรงแรมได้');
        setHotelDetails(null);
      }
    }
  };


  const handleBookingRedirect = (hotel) => {
    // สร้างลิงก์ไปยัง booking.com
    const bookingUrl = hotel.booking_data?.url || `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name)}&checkin=${new Date().toISOString().split('T')[0]}&checkout=${new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]}`;
    
    // เปิดลิงก์ในแท็บใหม่
    window.open(bookingUrl, '_blank', 'noopener,noreferrer');
  };

  const filteredHotels = hotels.filter(hotel => 
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.vicinity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sample data for car rentals
  const carRentals = [
    {
      id: 1,
      name: 'รถเก๋ง Toyota Camry',
      type: 'รถเก๋ง',
      price: 1200,
      rating: 4.6,
      reviews: 150,
      image: 'https://placehold.co/400x300',
      features: ['5 ที่นั่ง', 'เครื่องปรับอากาศ', 'เกียร์อัตโนมัติ'],
    },
    {
      id: 2,
      name: 'รถตู้ Toyota Commuter',
      type: 'รถตู้',
      price: 2000,
      rating: 4.8,
      reviews: 85,
      image: 'https://placehold.co/400x300',
      features: ['12 ที่นั่ง', 'เครื่องปรับอากาศ', 'เกียร์ธรรมดา'],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                จองที่พักและบริการ
              </h1>
              <p className="text-xl text-white/90">
                ค้นหาและจองที่พัก รถเช่า และบริการอื่นๆ สำหรับการท่องเที่ยวในขอนแก่น
              </p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
              <button
                className={`px-6 py-3 font-medium flex items-center ${
                  activeTab === 'hotels'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('hotels')}
              >
                <Bed className="h-4 w-4 mr-2" />
                ที่พัก
              </button>
              <button
                className={`px-6 py-3 font-medium flex items-center ${
                  activeTab === 'cars'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('cars')}
              >
                <Car className="h-4 w-4 mr-2" />
                รถเช่า
              </button>
              {/* Tours tab removed */}
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="ค้นหาโรงแรม..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">จุดหมาย</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="เมืองขอนแก่น" 
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-lg"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">เช็คอิน</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="date" 
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">เช็คเอาท์</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="date" 
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ผู้เข้าพัก</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="number" 
                      placeholder="2 ผู้เข้าพัก" 
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-lg"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    ตัวกรอง
                  </Button>
                  <Button variant="outline" size="sm">
                    ราคา
                  </Button>
                  <Button variant="outline" size="sm">
                    คะแนนรีวิว
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button size="lg" onClick={loadHotels} disabled={loading}>
                    {loading ? 'กำลังโหลด...' : 'รีเฟรชข้อมูล'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={async () => {
                      console.log('🧪 กำลังทดสอบ API รูปภาพ...');
                      await testPhotosAPI();
                    }}
                  >
                    ทดสอบ API รูปภาพ
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">
                {activeTab === 'hotels' && 'ที่พัก'}
                {activeTab === 'cars' && 'รถเช่า'}
                {/* tours tab removed */}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline">เรียงตามความนิยม</Button>
              </div>
            </div>
            
            {activeTab === 'hotels' && (
              <>

                {/* Loading State */}
                {loading && hotels.length === 0 && (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">กำลังโหลดโรงแรม...</span>
                  </div>
                )}

                {/* Hotels Grid */}
                {!loading && filteredHotels.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredHotels.map((hotel) => (
                      <Card 
                        key={hotel.place_id} 
                        className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => handleHotelClick(hotel)}
                      >
                        <div className="h-48 bg-gray-200 relative">
                          <img 
                            src={hotel.photos?.[0] || 'https://placehold.co/400x300?text=โรงแรม'} 
                            alt={hotel.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log('❌ รูปภาพไม่สามารถโหลดได้:', hotel.photos?.[0])
                              console.log('🏨 ข้อมูลรูปภาพทั้งหมด:', hotel.photos)
                              const target = e.target as HTMLImageElement
                              target.src = 'https://placehold.co/400x300?text=โรงแรม'
                            }}
                            onLoad={() => {
                              console.log('✅ รูปภาพโหลดสำเร็จ:', hotel.photos?.[0])
                            }}
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
                            ⭐ {hotel.rating?.toFixed(1) || 'N/A'}
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold line-clamp-2">{hotel.name}</h3>
                            <Badge variant="secondary" className="ml-2">
                              โรงแรม
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="line-clamp-1">{hotel.vicinity}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {hotel.types?.slice(0, 3).map((type, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              {hotel.booking_data?.price && (
                                <div className="text-2xl font-bold text-primary">
                                  ฿{hotel.booking_data.price.toLocaleString()}
                                  <span className="text-base font-normal text-muted-foreground">/คืน</span>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleHotelClick(hotel);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                ดู
                              </Button>
                              <Button 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBookingRedirect(hotel);
                                }}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                จอง
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {!loading && filteredHotels.length === 0 && hotels.length > 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">ไม่พบโรงแรมที่ตรงกับการค้นหา</p>
                  </div>
                )}

                {/* Load More Button */}
                {!loading && filteredHotels.length > 0 && (
                  <div className="flex justify-center mt-8">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={loading}
                    >
                      {loading ? 'กำลังโหลด...' : 'โหลดเพิ่มเติม'}
                    </Button>
                  </div>
                )}
              </>
            )}
            
            {activeTab === 'cars' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {carRentals.map((car) => (
                  <div 
                    key={car.id} 
                    className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-2/5 h-48 bg-gray-200">
                        <img 
                          src={car.image} 
                          alt={car.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="md:w-3/5 p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold">{car.name}</h3>
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            {car.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {car.features.map((feature, index) => (
                            <span 
                              key={index} 
                              className="text-xs bg-muted px-2 py-1 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-2xl font-bold text-primary">฿{car.price}<span className="text-base font-normal text-muted-foreground">/วัน</span></div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Star className="h-4 w-4 mr-1 text-yellow-500" />
                              <span>{car.rating} ({car.reviews} รีวิว)</span>
                            </div>
                          </div>
                          <Button>
                            จองเลย
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* tours results removed */}
          </div>
        </section>

        {/* Hotel Details Modal */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {selectedHotel?.name}
              </DialogTitle>
            </DialogHeader>
            
            {selectedHotel && (
              <div className="space-y-6">
                {/* Debug Info */}
                <div className="bg-blue-50 p-3 rounded-lg text-sm">
                  <div className="font-semibold text-blue-800 mb-2">🔍 Debug Information:</div>
                  <div>📸 จำนวนรูปภาพ: {selectedHotel.photos?.length || 0}</div>
                  <div>📸 รูปภาพแรก: {selectedHotel.photos?.[0] ? 'มี' : 'ไม่มี'}</div>
                  {selectedHotel.photos?.[0] && (
                    <div className="mt-1 text-xs break-all text-blue-600">
                      URL: {selectedHotel.photos[0]}
                    </div>
                  )}
                </div>

                {/* Hotel Images */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="h-64 bg-gray-200 rounded-lg overflow-hidden relative">
                    {selectedHotel.photos && selectedHotel.photos.length > 0 ? (
                      <img 
                        src={selectedHotel.photos[0]} 
                        alt={selectedHotel.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log('❌ รูปภาพใน modal ไม่สามารถโหลดได้:', selectedHotel.photos?.[0])
                          console.log('🏨 ข้อมูลรูปภาพทั้งหมดใน modal:', selectedHotel.photos)
                          const target = e.target as HTMLImageElement
                          target.src = 'https://placehold.co/800x400?text=โรงแรม'
                        }}
                        onLoad={() => {
                          console.log('✅ รูปภาพใน modal โหลดสำเร็จ:', selectedHotel.photos?.[0])
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <div className="text-center text-gray-500">
                          <div className="text-4xl mb-2">🏨</div>
                          <div>ไม่มีรูปภาพ</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Additional Images */}
                  {selectedHotel.photos && selectedHotel.photos.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedHotel.photos.slice(1, 5).map((photo, index) => (
                        <div key={index} className="h-20 bg-gray-200 rounded overflow-hidden">
                          <img 
                            src={photo} 
                            alt={`${selectedHotel.name} ${index + 2}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = 'https://placehold.co/200x100?text=รูป'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hotel Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">ข้อมูลโรงแรม</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{selectedHotel.vicinity}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-2 text-yellow-500" />
                        <span>คะแนน: {selectedHotel.rating?.toFixed(1) || 'N/A'}</span>
                      </div>
                      {selectedHotel.booking_data?.distance && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>ระยะทาง: {selectedHotel.booking_data.distance} กม.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">ราคา</h3>
                    {selectedHotel.booking_data?.price ? (
                      <div className="text-3xl font-bold text-primary">
                        ฿{selectedHotel.booking_data.price.toLocaleString()}
                        <span className="text-lg font-normal text-muted-foreground">/คืน</span>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">ไม่ระบุราคา</p>
                    )}
                  </div>
                </div>

                {/* Hotel Types */}
                {selectedHotel.types && selectedHotel.types.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">ประเภท</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedHotel.types.map((type, index) => (
                        <Badge key={index} variant="outline">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}


              {/* Hotel Details from API */}
              {hotelDetails && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">รายละเอียดเพิ่มเติม</h3>
                  <div className="bg-muted/30 p-4 rounded-lg max-h-64 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(hotelDetails, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t">
                  <Button 
                    size="lg" 
                    className="flex-1"
                    onClick={() => {
                      handleBookingRedirect(selectedHotel);
                      setShowDetails(false);
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    จองผ่าน Booking.com
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setShowDetails(false)}
                  >
                    ปิด
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Special Offers */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">ข้อเสนอพิเศษ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'แพ็คเกจที่พัก 3 คืน',
                  description: 'จองที่พัก 3 คืนในโรงแรมพาร์ทเนอร์รับส่วนลด 20%',
                  discount: '20%',
                },
                {
                  title: 'เช่ารถราคาพิเศษ',
                  description: 'เช่ารถ 3 วันขึ้นไป ลดราคา 15%',
                  discount: '15%',
                },
                {
                  title: 'แพ็คเกจครอบครัว',
                  description: 'ที่พัก + ทัวร์สำหรับครอบครัว 4 ท่านขึ้นไป',
                  discount: '25%',
                },
              ].map((offer, index) => (
                <div 
                  key={index} 
                  className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-2">{offer.discount}</div>
                  <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-muted-foreground mb-4">{offer.description}</p>
                  <Button variant="outline">
                    ดูรายละเอียด
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Booking;