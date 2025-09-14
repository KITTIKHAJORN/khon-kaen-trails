import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, ExternalLink, Eye, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getBookingHotelsList, getHotelDetailsFromBooking, getCombinedReviews } from '@/api/bookingapi';
import HotelReviews from '@/components/HotelReviews';

/**
 * ตัวอย่างการใช้งาน BookingAPI
 * แสดงวิธีการดึงข้อมูลโรงแรมและแสดงรายละเอียด
 */
const HotelBookingExample = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // โหลดข้อมูลโรงแรมเมื่อ component mount
  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 กำลังโหลดโรงแรมจาก BookingAPI...');
      const response = await getBookingHotelsList(0);
      console.log('✅ โหลดโรงแรมสำเร็จ:', response);
      
      if (response.results && Array.isArray(response.results)) {
        setHotels(response.results);
      }
    } catch (err) {
      console.error('❌ ข้อผิดพลาดในการโหลดโรงแรม:', err);
      setError('ไม่สามารถโหลดข้อมูลโรงแรมได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleHotelClick = async (hotel) => {
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
        console.error('❌ ข้อผิดพลาดในการดึงรายละเอียด:', err);
      }
    }
  };

  const handleBookingRedirect = (hotel) => {
    // สร้างลิงก์ไปยัง booking.com
    const bookingUrl = hotel.booking_data?.url || 
      `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name)}&checkin=${new Date().toISOString().split('T')[0]}&checkout=${new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]}`;
    
    // เปิดลิงก์ในแท็บใหม่
    window.open(bookingUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">ตัวอย่างการใช้งาน BookingAPI</h1>
        <p className="text-muted-foreground mb-4">
          ตัวอย่างการดึงข้อมูลโรงแรมจาก BookingAPI และแสดงรายละเอียดพร้อมลิงก์ไปจอง
        </p>
        
        <div className="flex gap-4 mb-6">
          <Button onClick={loadHotels} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                กำลังโหลด...
              </>
            ) : (
              'รีเฟรชข้อมูล'
            )}
          </Button>
          
          <Button variant="outline" onClick={() => {
            console.log('🏨 ข้อมูลโรงแรมทั้งหมด:', hotels);
            console.log('📊 สถิติ:', {
              จำนวนโรงแรม: hotels.length,
              โรงแรมที่มีราคา: hotels.filter(h => h.booking_data?.price).length,
              โรงแรมที่มีคะแนน: hotels.filter(h => h.rating).length
            });
          }}>
            ดูข้อมูลใน Console
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && hotels.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">กำลังโหลดโรงแรม...</span>
        </div>
      )}

      {/* Hotels Grid */}
      {!loading && hotels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.slice(0, 6).map((hotel) => (
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
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
                  ⭐ {hotel.rating?.toFixed(1) || 'N/A'}
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold line-clamp-2 flex-1">{hotel.name}</h3>
                  <Badge variant="secondary" className="ml-2">
                    โรงแรม
                  </Badge>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="line-clamp-1">{hotel.vicinity}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {hotel.types?.slice(0, 2).map((type, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    {hotel.booking_data?.price ? (
                      <div className="text-xl font-bold text-primary">
                        ฿{hotel.booking_data.price.toLocaleString()}
                        <span className="text-sm font-normal text-muted-foreground">/คืน</span>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">ไม่ระบุราคา</div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {hotel.booking_data?.review_count || 0} รีวิว
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHotelClick(hotel);
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookingRedirect(hotel);
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && hotels.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">ไม่พบข้อมูลโรงแรม</p>
          <Button onClick={loadHotels} className="mt-4">
            ลองใหม่
          </Button>
        </div>
      )}

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
              {/* Hotel Image */}
              <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={selectedHotel.photos?.[0] || 'https://placehold.co/800x400?text=โรงแรม'} 
                  alt={selectedHotel.name} 
                  className="w-full h-full object-cover"
                />
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
                      <span>คะแนน: {selectedHotel.rating?.toFixed(1) || 'N/A'} ({selectedHotel.booking_data?.review_count || 0} รีวิว)</span>
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

              {/* Hotel Reviews */}
              <div>
                <HotelReviews
                  hotelId={selectedHotel.booking_data?.hotel_id}
                  placeId={selectedHotel.place_id}
                  hotelName={selectedHotel.name}
                />
              </div>

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

      {/* API Documentation */}
      <div className="mt-12 p-6 bg-muted/30 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">API Documentation</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold">getBookingHotelsList(page)</h3>
            <p className="text-muted-foreground">ดึงรายการโรงแรมจาก Booking.com API</p>
          </div>
          <div>
            <h3 className="font-semibold">getHotelDetailsFromBooking(hotelId)</h3>
            <p className="text-muted-foreground">ดึงรายละเอียดโรงแรมเฉพาะจาก hotel ID</p>
          </div>
          <div>
            <h3 className="font-semibold">getHotelReviews(hotelId, limit)</h3>
            <p className="text-muted-foreground">ดึงรีวิวโรงแรมจาก Booking.com API</p>
          </div>
          <div>
            <h3 className="font-semibold">getCombinedReviews(hotelId, placeId)</h3>
            <p className="text-muted-foreground">ดึงรีวิวจากทั้ง Booking.com และ Google Places</p>
          </div>
          <div>
            <h3 className="font-semibold">searchHotelsFromBooking(query, placeData)</h3>
            <p className="text-muted-foreground">ค้นหาโรงแรมตามชื่อหรือข้อมูลสถานที่</p>
          </div>
          <div>
            <h3 className="font-semibold">findKhonKaenDestId()</h3>
            <p className="text-muted-foreground">ค้นหา destination ID ของขอนแก่น</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingExample;
