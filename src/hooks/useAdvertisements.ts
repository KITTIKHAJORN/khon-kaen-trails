import { useState, useCallback } from 'react';
import { searchKhonKaenHotels, searchKhonKaenRestaurants, searchKhonKaenMalls } from '@/api/mapapi';

export interface Advertisement {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  type: 'hotel' | 'restaurant' | 'tour' | 'shopping';
  rating?: number;
  price?: string;
  location?: string;
  badge?: string;
  link: string;
  place_id?: string;
}

export const useAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvertisements = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // ใช้ Google Places API เพื่อค้นหาสถานที่สำหรับโฆษณา
      const [hotelsRes, restaurantsRes, mallsRes] = await Promise.all([
        searchKhonKaenHotels('โรงแรม ขอนแก่น', 8000),
        searchKhonKaenRestaurants('ร้านอาหารดัง ขอนแก่น', 8000),
        searchKhonKaenMalls('ห้างสรรพสินค้า ขอนแก่น', 8000)
      ]);

      const allPlaces = [
        ...(hotelsRes.results || []).slice(0, 2),
        ...(restaurantsRes.results || []).slice(0, 2),
        ...(mallsRes.results || []).slice(0, 2)
      ];

      // แปลงข้อมูลจาก Places API เป็น Advertisement format
      const adsData: Advertisement[] = allPlaces.slice(0, 3).map((place, index) => {
        const adTypes = [
          { type: 'hotel' as const, badge: 'จองเลย!', priceRange: [1500, 3500] },
          { type: 'restaurant' as const, badge: 'ยอดนิยม', priceRange: [200, 800] },
          { type: 'shopping' as const, badge: 'ลดพิเศษ 20%', priceRange: [500, 2000] }
        ];

        const adType = adTypes[index % adTypes.length];
        const basePrice = Math.floor(Math.random() * (adType.priceRange[1] - adType.priceRange[0])) + adType.priceRange[0];

        // สร้าง subtitle ตามประเภท
        let subtitle = '';
        if (adType.type === 'hotel') {
          subtitle = place.rating && place.rating >= 4.5 ? 'โรงแรม 5 ดาวใจกลางเมืองขอนแก่น' : 'โรงแรมคุณภาพดีในขอนแก่น';
        } else if (adType.type === 'restaurant') {
          subtitle = 'อาหารอีสานแท้รสชาติดั้งเดิม';
        } else {
          subtitle = 'ศูนย์การค้าครบครันในขอนแก่น';
        }

        // เลือกรูปภาพตามประเภท
        const adImages = {
          hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
          restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
          shopping: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
        };

        return {
          id: place.place_id,
          title: place.name,
          subtitle,
          image: adImages[adType.type],
          type: adType.type,
          rating: place.rating,
          price: adType.type === 'hotel' ? `${basePrice.toLocaleString()} บาท/คืน` : 
                 adType.type === 'restaurant' ? `${basePrice}-${basePrice + 200} บาท/คน` :
                 `${basePrice.toLocaleString()} บาท`,
          location: place.vicinity || place.formatted_address || 'ใจกลางเมือง',
          badge: adType.badge,
          link: `#place/${place.place_id}`,
          place_id: place.place_id
        };
      });

      setAdvertisements(adsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูลโฆษณา');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    advertisements,
    loading,
    error,
    fetchAdvertisements,
    clearError: () => setError(null)
  };
};