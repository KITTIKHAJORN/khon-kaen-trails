import { useState, useCallback } from 'react';
import { searchKhonKaenRestaurants, searchKhonKaenAttractions } from '@/api/mapapi';

export interface BlogPost {
  id: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  image: string;
  category: string;
  categoryEn: string;
  author: string;
  authorEn: string;
  publishDate: string;
  readTime: number;
  views: number;
  featured: boolean;
  place_id?: string;
}

export const useBlogs = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // ใช้ Google Places API เพื่อค้นหาสถานที่สำหรับสร้างบทความ
      const [restaurantsRes, attractionsRes, cafesRes] = await Promise.all([
        searchKhonKaenRestaurants('ร้านอาหารดัง ขอนแก่น', 10000),
        searchKhonKaenAttractions('สถานที่ท่องเที่ยว ขอนแก่น', 15000),
        searchKhonKaenRestaurants('คาเฟ่ ขอนแก่น', 8000)
      ]);

      const allPlaces = [
        ...(restaurantsRes.results || []).slice(0, 3),
        ...(attractionsRes.results || []).slice(0, 2),
        ...(cafesRes.results || []).slice(0, 2)
      ];

      // Template สำหรับบทความ
      const blogTemplates = [
        {
          titleTh: 'ร้านอาหารดังใน ขอนแก่น ที่ต้องไปให้ได้',
          titleEn: 'Must-Visit Famous Restaurants in Khon Kaen',
          excerptTh: 'รวมร้านอาหารดังและอร่อยในขอนแก่นที่มีรสชาติต้นตำรับ บรรยากาศดี และราคาเป็นมิตร',
          excerptEn: 'Discover famous and delicious restaurants in Khon Kaen with authentic flavors, great atmosphere, and friendly prices',
          category: { th: 'อาหาร', en: 'Food' },
          image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&h=600&fit=crop'
        },
        {
          titleTh: 'คาเฟ่สุดชิคใน ขอนแก่น สำหรับคนรักกาแฟ',
          titleEn: 'Chic Cafes in Khon Kaen for Coffee Lovers',
          excerptTh: 'รวมคาเฟ่สุดชิคในขอนแก่นที่มีบรรยากาศดี กาแฟอร่อย และเมนูถ่ายรูปสวย',
          excerptEn: 'Discover the chicest cafes in Khon Kaen with great atmosphere, delicious coffee, and Instagram-worthy menus',
          category: { th: 'ไลฟ์สไตล์', en: 'Lifestyle' },
          image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop'
        },
        {
          titleTh: 'เที่ยวขอนแก่น 1 วัน พร้อมแผนที่เดินทาง',
          titleEn: 'One Day in Khon Kaen: Complete Travel Itinerary',
          excerptTh: 'วางแผนเที่ยวขอนแก่นให้เต็มที่ใน 1 วัน ตั้งแต่เช้าจรดค่ำ พร้อมเส้นทางและเวลาที่เหมาะสม',
          excerptEn: 'Plan your perfect one-day Khon Kaen adventure from dawn to dusk with optimal routes and timing',
          category: { th: 'คู่มือท่องเที่ยว', en: 'Travel Guide' },
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
        },
        {
          titleTh: 'ประวัติความเป็นมาของบุญบั้งไฟ',
          titleEn: 'The History of Bun Bang Fai Rocket Festival',
          excerptTh: 'เรียนรู้ประวัติศาสตร์และความหมายของประเพณีบุญบั้งไฟ เทศกาลสำคัญของภาคอีสาน',
          excerptEn: 'Learn about the history and significance of the Bun Bang Fai Rocket Festival, an important northeastern tradition',
          category: { th: 'วัฒนธรรม', en: 'Culture' },
          image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop'
        }
      ];

      const authors = [
        { th: 'คุณกาแฟใส', en: 'Coffee Sai' },
        { th: 'ทีมงานท่องเที่ยว', en: 'Tourism Team' },
        { th: 'อาจารย์สมบูรณ์', en: 'Prof. Somboon' },
        { th: 'เชฟโต๊ะอีสาน', en: 'Chef Isan' },
        { th: 'นักเขียนท่องเที่ยว', en: 'Travel Writer' }
      ];

      // สร้างบทความจากข้อมูล Places API
      const blogs: BlogPost[] = allPlaces.slice(0, 6).map((place, index) => {
        const template = blogTemplates[index % blogTemplates.length];
        const author = authors[index % authors.length];
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() - (index * 3) - Math.floor(Math.random() * 10));

        // ปรับ title ให้เกี่ยวข้องกับสถานที่
        let title = template.titleTh;
        let titleEn = template.titleEn;
        
        if (place.name && template.category.th === 'อาหาร') {
          title = `รีวิว ${place.name} - ร้านอาหารดังในขอนแก่น`;
          titleEn = `Review: ${place.name} - Famous Restaurant in Khon Kaen`;
        } else if (place.name && template.category.th === 'คู่มือท่องเที่ยว') {
          title = `เที่ยว ${place.name} - จุดหมายยอดนิยมในขอนแก่น`;
          titleEn = `Visit ${place.name} - Popular Destination in Khon Kaen`;
        }

        return {
          id: place.place_id || `blog-${index}`,
          title,
          titleEn,
          excerpt: template.excerptTh + ` รวมถึงการแนะนำ ${place.name} ที่เป็นจุดหมายยอดนิยม`,
          excerptEn: template.excerptEn + ` including recommendations for ${place.name}, a popular destination`,
          image: template.image,
          category: template.category.th,
          categoryEn: template.category.en,
          author: author.th,
          authorEn: author.en,
          publishDate: baseDate.toISOString().split('T')[0],
          readTime: Math.floor(Math.random() * 10) + 5,
          views: Math.floor(Math.random() * 5000) + 500,
          featured: index < 2,
          place_id: place.place_id
        };
      });

      setBlogPosts(blogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูลบทความ');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    blogPosts,
    loading,
    error,
    fetchBlogs,
    clearError: () => setError(null)
  };
};