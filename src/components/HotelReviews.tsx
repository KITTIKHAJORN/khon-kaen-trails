import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, User, Calendar, MessageSquare, ThumbsUp, ExternalLink, Loader2 } from 'lucide-react';
import { getCombinedReviews } from '@/api/bookingapi';

interface Review {
  id: string;
  author_name: string;
  author_photo?: string;
  rating: number;
  text: string;
  time?: string;
  language: string;
  helpful_votes: number;
  source: 'booking.com' | 'google_places';
  // Additional properties from Booking.com API
  country?: string;
  stay_date?: string;
  room_type?: string;
}

interface HotelReviewsProps {
  hotelId?: string;
  placeId?: string;
  hotelName?: string;
}

const HotelReviews: React.FC<HotelReviewsProps> = ({ hotelId, placeId, hotelName }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (hotelId || placeId) {
      loadReviews();
    }
  }, [hotelId, placeId]);

  const loadReviews = async () => {
    if (!hotelId && !placeId) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 กำลังโหลดรีวิวโรงแรม...');
      const reviewsData = await getCombinedReviews(hotelId || '', placeId || '');
      setReviews(reviewsData);
      console.log('✅ โหลดรีวิวสำเร็จ:', reviewsData);
    } catch (err) {
      console.error('❌ ข้อผิดพลาดในการโหลดรีวิว:', err);
      setError('ไม่สามารถโหลดรีวิวได้');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (time: string | null) => {
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'booking.com':
        return <Badge variant="secondary" className="text-xs">Booking.com</Badge>;
      case 'google_places':
        return <Badge variant="outline" className="text-xs">Google</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">รีวิว</Badge>;
    }
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">รีวิวผู้ใช้</h3>
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">กำลังโหลดรีวิว...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">รีวิวผู้ใช้</h3>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
        <Button variant="outline" onClick={loadReviews}>
          ลองใหม่
        </Button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">รีวิวผู้ใช้</h3>
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>ยังไม่มีรีวิวสำหรับโรงแรมนี้</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          รีวิวผู้ใช้ ({reviews.length} รีวิว)
        </h3>
        {reviews.length > 3 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'แสดงน้อยลง' : `ดูทั้งหมด (${reviews.length})`}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {displayedReviews.map((review) => (
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
                  {getSourceBadge(review.source)}
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(review.time)}
                  </div>
                </div>
              </div>

              {review.text && (
                <div className="mb-3">
                  <p className="text-sm leading-relaxed text-gray-700">
                    {review.text.length > 200 && !showAll ? (
                      <>
                        {review.text.substring(0, 200)}...
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-primary ml-1"
                          onClick={() => setShowAll(true)}
                        >
                          อ่านต่อ
                        </Button>
                      </>
                    ) : (
                      review.text
                    )}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                  {review.helpful_votes > 0 && (
                    <div className="flex items-center">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span>{review.helpful_votes} คนเห็นด้วย</span>
                    </div>
                  )}
                  {review.language && review.language !== 'th' && (
                    <Badge variant="outline" className="text-xs">
                      {review.language.toUpperCase()}
                    </Badge>
                  )}
                  {review.country && (
                    <Badge variant="outline" className="text-xs">
                      {review.country}
                    </Badge>
                  )}
                </div>
                {review.source === 'booking.com' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto text-primary"
                    onClick={() => {
                      const bookingUrl = `https://www.booking.com/reviews/${hotelId}.th.html`;
                      window.open(bookingUrl, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    ดูรีวิวเต็ม
                  </Button>
                )}
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

      {reviews.length > 3 && !showAll && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(true)}
            className="w-full"
          >
            แสดงรีวิวเพิ่มเติม ({reviews.length - 3} รีวิว)
          </Button>
        </div>
      )}
    </div>
  );
};

export default HotelReviews;
