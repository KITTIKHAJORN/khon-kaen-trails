import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Clock, User, Eye, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: number;
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
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: '10 คาเฟ่ใน ขอนแก่น ที่ต้องไปให้ได้',
    titleEn: '10 Must-Visit Cafes in Khon Kaen',
    excerpt: 'รวมคาเฟ่สุดชิคในขอนแก่นที่มีบรรยากาศดี กแฟอร่อย และเมนูถ่ายรูปสวย เหมาะสำหรับคนรักกาแฟและชาวโซเชียล',
    excerptEn: 'Discover the chicest cafes in Khon Kaen with great atmosphere, delicious coffee, and Instagram-worthy menus perfect for coffee lovers and social media enthusiasts',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
    category: 'ไลฟ์สไตล์',
    categoryEn: 'Lifestyle',
    author: 'คุณกาแฟใส',
    authorEn: 'Coffee Sai',
    publishDate: '2024-03-20',
    readTime: 8,
    views: 2350,
    featured: true
  },
  {
    id: 2,
    title: 'เที่ยวขอนแก่น 1 วัน พร้อมแผนที่เดินทาง',
    titleEn: 'One Day in Khon Kaen: Complete Travel Itinerary',
    excerpt: 'วางแผนเที่ยวขอนแก่นให้เต็มที่ใน 1 วัน ตั้งแต่เช้าจรดค่ำ พร้อมเส้นทางและเวลาที่เหมาะสม ไม่พลาดจุดสำคัญ',
    excerptEn: 'Plan your perfect one-day Khon Kaen adventure from dawn to dusk with optimal routes and timing to not miss any important attractions',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    category: 'คู่มือท่องเที่ยว',
    categoryEn: 'Travel Guide',
    author: 'ทีมงานท่องเที่ยว',
    authorEn: 'Tourism Team',
    publishDate: '2024-03-18',
    readTime: 12,
    views: 4200,
    featured: true
  },
  {
    id: 3,
    title: 'ประวัติความเป็นมาของบุญบั้งไฟ',
    titleEn: 'The History of Bun Bang Fai Rocket Festival',
    excerpt: 'เรียนรู้ประวัติศาสตร์และความหมายของประเพณีบุญบั้งไฟ เทศกาลสำคัญของภาคอีสานที่สืบทอดมาหลายชั่วอายุคน',
    excerptEn: 'Learn about the history and significance of the Bun Bang Fai Rocket Festival, an important northeastern tradition passed down through generations',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop',
    category: 'วัฒนธรรม',
    categoryEn: 'Culture',
    author: 'อาจารย์สมบูรณ์',
    authorEn: 'Prof. Somboon',
    publishDate: '2024-03-15',
    readTime: 15,
    views: 1890,
    featured: false
  },
  {
    id: 4,
    title: 'อาหารอีสานต้องลองใน ขอนแก่น',
    titleEn: 'Must-Try Isan Dishes in Khon Kaen',
    excerpt: 'รีวิวอาหารอีสานแท้รสจัดจ้านที่ขอนแก่น พร้อมร้านแนะนำและเมนูเด็ดที่ห้ามพลาด สำหรับคนรักอาหารรสแซ่บ',
    excerptEn: 'Review of authentic spicy Isan cuisine in Khon Kaen with recommended restaurants and must-try dishes for lovers of bold flavors',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&h=600&fit=crop',
    category: 'อาหาร',
    categoryEn: 'Food',
    author: 'เชฟโต๊ะอีสาน',
    authorEn: 'Chef Isan',
    publishDate: '2024-03-12',
    readTime: 10,
    views: 3150,
    featured: false
  }
];

export const BlogPreviewSection: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const isEnglish = currentLanguage.code === 'en';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isEnglish) {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    }
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const featuredPost = blogPosts.find(post => post.featured) || blogPosts[0];
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            {isEnglish ? 'Travel Stories & Tips' : 'เรื่องเล่าและเทิปการเดินทาง'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isEnglish 
              ? 'Discover insider tips, local stories, and travel guides to make the most of your Khon Kaen experience'
              : 'ค้นพบเคล็ดลับภายใน เรื่องราวท้องถิ่น และคู่มือการเดินทางเพื่อประสบการณ์ที่ดีที่สุดในขอนแก่น'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Featured Post */}
          <div className="lg:col-span-2" data-aos="fade-right">
            <Card className="group overflow-hidden shadow-warm hover:shadow-elegant transition-all duration-300 border-0 bg-card-gradient h-full">
              <div className="relative">
                <img
                  src={featuredPost.image}
                  alt={isEnglish ? featuredPost.titleEn : featuredPost.title}
                  className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-secondary text-secondary-foreground">
                    {isEnglish ? 'Featured' : 'เรื่องเด่น'}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {isEnglish ? featuredPost.categoryEn : featuredPost.category}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                  {isEnglish ? featuredPost.titleEn : featuredPost.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                  {isEnglish ? featuredPost.excerptEn : featuredPost.excerpt}
                </p>
                
                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{isEnglish ? featuredPost.authorEn : featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(featuredPost.publishDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{featuredPost.readTime} {isEnglish ? 'min read' : 'นาที'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{featuredPost.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <Button className="bg-hero-gradient text-white shadow-gold hover:opacity-90 group">
                  {t('common.readMore')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Regular Posts */}
          <div className="space-y-6">
            {regularPosts.slice(0, 3).map((post, index) => (
              <Card 
                key={post.id}
                className="group overflow-hidden shadow-warm hover:shadow-elegant transition-all duration-300 border-0 bg-card-gradient"
                data-aos="fade-left"
                data-aos-delay={index * 100}
              >
                <div className="flex">
                  <img
                    src={post.image}
                    alt={isEnglish ? post.titleEn : post.title}
                    className="w-24 h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <CardContent className="flex-1 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {isEnglish ? post.categoryEn : post.category}
                      </Badge>
                    </div>
                    
                    <h4 className="font-bold text-sm text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                      {isEnglish ? post.titleEn : post.title}
                    </h4>
                    
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {isEnglish ? post.excerptEn : post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.publishDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime} {isEnglish ? 'min' : 'นาที'}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center" data-aos="fade-up" data-aos-delay="300">
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8"
          >
            {isEnglish ? 'View All Articles' : 'ดูบทความทั้งหมด'} (50+ {isEnglish ? 'Posts' : 'บทความ'})
          </Button>
        </div>
      </div>
    </section>
  );
};