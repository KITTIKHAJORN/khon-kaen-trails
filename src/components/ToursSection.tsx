import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  MapPin, 
  Clock, 
  Users, 
  Star,
  Calendar,
  Camera,
  Utensils,
  Car
} from 'lucide-react';

interface Tour {
  id: number;
  name: string;
  nameEn: string;
  duration: string;
  durationEn: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  highlights: string[];
  highlightsEn: string[];
  included: string[];
  includedEn: string[];
  maxGuests: number;
  category: string;
  categoryEn: string;
  badge?: string;
  badgeEn?: string;
}

const tours: Tour[] = [
  {
    id: 1,
    name: 'ทัวร์วัดป่าธรรมชาติ 1 วัน',
    nameEn: 'Forest Temple Nature Tour 1 Day',
    duration: '1 วัน (8 ชั่วโมง)',
    durationEn: '1 Day (8 hours)',
    price: 890,
    originalPrice: 1200,
    rating: 4.8,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop',
    highlights: ['วัดป่าดงพญาไผ่', 'น้ำตกห้วยแก้ว', 'อาหารเที่ยงแบบอีสาน', 'ชมการทำผ้าไหม'],
    highlightsEn: ['Dong Phayayen Forest Temple', 'Huai Kaew Waterfall', 'Isan Lunch', 'Silk Weaving Demo'],
    included: ['รถโดยสาร', 'มัคคุเทศก์', 'อาหารเที่ยง', 'ค่าเข้าชม'],
    includedEn: ['Transportation', 'Guide', 'Lunch', 'Entrance Fees'],
    maxGuests: 15,
    category: 'ธรรมชาติ',
    categoryEn: 'Nature',
    badge: 'ลดพิเศษ 26%',
    badgeEn: '26% OFF'
  },
  {
    id: 2,
    name: 'ทัวร์อาหารอีสานแท้ 4 ชั่วโมง',
    nameEn: 'Authentic Isan Food Tour 4 Hours',
    duration: 'ครึ่งวัน (4 ชั่วโมง)',
    durationEn: 'Half Day (4 hours)',
    price: 650,
    rating: 4.9,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    highlights: ['ตลาดเช้าเทศบาลนคร', 'ร้านส้มตำชื่อดัง 3 ร้าน', 'ลิ้มรสไส้กรอกอีสาน', 'เรียนทำลาบ'],
    highlightsEn: ['Municipal Morning Market', '3 Famous Som Tam Shops', 'Isan Sausage Tasting', 'Larb Cooking Class'],
    included: ['มัคคุเทศก์', 'อาหาร 8 จาน', 'น้ำดื่ม', 'ใบประกาศนียบัตร'],
    includedEn: ['Guide', '8 Dishes', 'Drinks', 'Certificate'],
    maxGuests: 8,
    category: 'อาหาร',
    categoryEn: 'Food',
    badge: 'ยอดนิยม',
    badgeEn: 'Popular'
  },
  {
    id: 3,
    name: 'ทัวร์ขอนแก่นไฮไลต์ 2 วัน 1 คืน',
    nameEn: 'Khon Kaen Highlights 2D1N',
    duration: '2 วัน 1 คืน',
    durationEn: '2 Days 1 Night',
    price: 2850,
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    highlights: ['บึงแก่นนคร', 'พิพิธภัณฑ์ไดโนเสาร์', 'วัดเทพธิดาราม', 'โรงแรม 4 ดาว'],
    highlightsEn: ['Kaen Nakhon Lake', 'Dinosaur Museum', 'Wat Thep Thidaram', '4-Star Hotel'],
    included: ['โรงแรม', 'อาหาร 5 มื้อ', 'รถโดยสาร', 'มัคคุเทศก์'],
    includedEn: ['Hotel', '5 Meals', 'Transportation', 'Guide'],
    maxGuests: 12,
    category: 'แพ็คเกจ',
    categoryEn: 'Package',
  }
];

export const ToursSection: React.FC = () => null;