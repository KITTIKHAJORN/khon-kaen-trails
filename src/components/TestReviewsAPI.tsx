import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star, User, Calendar, MessageSquare, Loader2, TestTube } from 'lucide-react';
import { getHotelReviews, formatBookingReviews } from '@/api/bookingapi';

/**
 * Component สำหรับทดสอบ Reviews API
 * ใช้ hotel_id = 5955189 ที่คุณให้มา
 */
const TestReviewsAPI = () => {
  const [hotelId, setHotelId] = useState('5955189');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);

  const testReviewsAPI = async () => {
    if (!hotelId.trim()) {
      setError('กรุณาใส่ Hotel ID');
      return;
    }

    setLoading(true);
    setError(null);
    setReviews([]);
    setRawData(null);

    try {
      console.log('🧪 ทดสอบ Reviews API ด้วย Hotel ID:', hotelId);
      
      // เรียก API ดึงรีวิว
      const response = await getHotelReviews(hotelId, 10, 1);
      console.log('📊 Raw Response:', response);
      setRawData(response);

      // แปลงข้อมูลรีวิว
      const formattedReviews = formatBookingReviews(response);
      console.log('✅ Formatted Reviews:', formattedReviews);
      setReviews(formattedReviews);

    } catch (err) {
      console.error('❌ ข้อผิดพลาด:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการดึงรีวิว');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (time) => {
    if (!time) return 'ไม่ระบุวันที่';
    
    try {
      const date = new Date(time);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'ไม่ระบุวันที่';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <TestTube className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-3xl font-bold">ทดสอบ Reviews API</h1>
        </div>
        <p className="text-muted-foreground mb-4">
          ทดสอบการดึงรีวิวจาก Booking.com API ด้วย Hotel ID
        </p>

        {/* Test Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>การทดสอบ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Hotel ID
                </label>
                <Input
                  value={hotelId}
                  onChange={(e) => setHotelId(e.target.value)}
                  placeholder="ใส่ Hotel ID"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  ตัวอย่าง: 5955189 (โรงแรมในขอนแก่น)
                </p>
              </div>
              <Button 
                onClick={testReviewsAPI} 
                disabled={loading}
                className="whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ทดสอบ...
                  </>
                ) : (
                  'ทดสอบ API'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {reviews.length > 0 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  รีวิวที่ได้รับ ({reviews.length} รีวิว)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="border-l-4 border-l-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              {review.author_photo ? (
                                <img
                                  src={review.author_photo}
                                  alt={review.author_name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <User className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{review.author_name}</p>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                  {renderStars(review.rating)}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {review.rating}/5
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <Badge variant="secondary">Booking.com</Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(review.time)}
                            </div>
                          </div>
                        </div>

                        {review.text && (
                          <div className="mb-3">
                            <p className="text-sm leading-relaxed text-gray-700">
                              {review.text}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            {review.helpful_votes > 0 && (
                              <div className="flex items-center">
                                <span>{review.helpful_votes} คนเห็นด้วย</span>
                              </div>
                            )}
                            {review.country && (
                              <Badge variant="outline" className="text-xs">
                                {review.country}
                              </Badge>
                            )}
                            {review.language && (
                              <Badge variant="outline" className="text-xs">
                                {review.language.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Additional Info */}
                        {(review.stay_date || review.room_type) && (
                          <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                            {review.stay_date && (
                              <p>เข้าพัก: {formatDate(review.stay_date)}</p>
                            )}
                            {review.room_type && (
                              <p>ประเภทห้อง: {review.room_type}</p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Raw Data */}
            {rawData && (
              <Card>
                <CardHeader>
                  <CardTitle>Raw API Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(rawData, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* API Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>ข้อมูล API</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Endpoint:</strong> 
                <code className="ml-2 bg-muted px-2 py-1 rounded">
                  https://booking-com15.p.rapidapi.com/api/v1/hotels/getHotelReviews
                </code>
              </div>
              <div>
                <strong>Parameters:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• hotel_id: {hotelId}</li>
                  <li>• sort_option_id: sort_most_relevant</li>
                  <li>• page_number: 1</li>
                  <li>• languagecode: en-us</li>
                </ul>
              </div>
              <div>
                <strong>Headers:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• x-rapidapi-host: booking-com15.p.rapidapi.com</li>
                  <li>• x-rapidapi-key: [API_KEY]</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestReviewsAPI;
