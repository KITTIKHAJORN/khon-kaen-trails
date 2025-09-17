import { useState, useCallback } from 'react';
import { searchKhonKaenAttractions } from '@/api/mapapi';

export interface Event {
  id: string;
  name: string;
  nameEn: string;
  date: string;
  time: string;
  location: string;
  locationEn: string;
  category: string;
  categoryEn: string;
  image: string;
  attendees: number;
  description: string;
  descriptionEn: string;
  price: string;
  rating?: number;
  place_id?: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // ใช้ Google Places API เพื่อค้นหาสถานที่จัดงานและเทศกาล
      const [festivalsRes, eventsRes, culturesRes] = await Promise.all([
        searchKhonKaenAttractions('เทศกาล ขอนแก่น', 15000),
        searchKhonKaenAttractions('งานประเพณี ขอนแก่น', 15000),
        searchKhonKaenAttractions('วัฒนธรรม ขอนแก่น', 15000)
      ]);

      const allPlaces = [
        ...(festivalsRes.results || []),
        ...(eventsRes.results || []),
        ...(culturesRes.results || [])
      ];

      // แปลงข้อมูลจาก Places API เป็น Event format
      const eventsData: Event[] = allPlaces
        .filter((place, index, self) => 
          index === self.findIndex(p => p.place_id === place.place_id)
        )
        .slice(0, 6)
        .map((place, index) => {
          const eventTypes = [
            { th: 'เทศกาล', en: 'Festival' },
            { th: 'วัฒนธรรม', en: 'Culture' },
            { th: 'ดนตรี', en: 'Music' },
            { th: 'ศิลปะ', en: 'Art' },
            { th: 'กีฬา', en: 'Sports' }
          ];
          
          const randomType = eventTypes[index % eventTypes.length];
          const baseDate = new Date();
          baseDate.setDate(baseDate.getDate() + (index * 7) + Math.floor(Math.random() * 30));
          
          const eventImages = [
            'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop'
          ];

          return {
            id: place.place_id,
            name: `งาน${randomType.th}ที่ ${place.name}`,
            nameEn: `${randomType.en} at ${place.name}`,
            date: baseDate.toISOString().split('T')[0],
            time: ['08:00 น.', '09:00 น.', '10:00 น.', '18:00 น.', '19:00 น.'][index % 5],
            location: place.formatted_address || place.vicinity || 'ขอนแก่น',
            locationEn: place.formatted_address || place.vicinity || 'Khon Kaen',
            category: randomType.th,
            categoryEn: randomType.en,
            image: eventImages[index % eventImages.length],
            attendees: Math.floor(Math.random() * 5000) + 500,
            description: `งาน${randomType.th}ประจำปีที่จัดขึ้นที่ ${place.name} เพื่อส่งเสริมวัฒนธรรมและประเพณีท้องถิ่น`,
            descriptionEn: `Annual ${randomType.en.toLowerCase()} event held at ${place.name} to promote local culture and traditions`,
            price: index % 3 === 0 ? 'ฟรี' : `${Math.floor(Math.random() * 500) + 50} บาท`,
            rating: place.rating,
            place_id: place.place_id
          };
        });

      setEvents(eventsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูลงานเทศกาล');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    clearError: () => setError(null)
  };
};