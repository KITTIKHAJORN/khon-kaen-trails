import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Clock, Plus, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Sample data for blog posts
  const blogPosts = [
    {
      id: 1,
      title: '10 คาเฟ่น่าไปในขอนแก่นที่คุณต้องลอง',
      excerpt: 'ค้นพบคาเฟ่ที่มีบรรยากาศดีและกาแฟรสเลิศในเมืองขอนแก่น',
      author: 'นักท่องเที่ยวขอนแก่น',
      date: '2024-03-15',
      readTime: '5 นาที',
      category: 'คาเฟ่',
      image: 'https://placehold.co/600x400',
      featured: true,
      createdBy: 'admin@example.com'
    },
    {
      id: 2,
      title: 'ทริปหนึ่งวันในขอนแก่น: แนะนำเส้นทางท่องเที่ยว',
      excerpt: 'แผนการท่องเที่ยวแบบครบวันในเมืองขอนแก่นสำหรับนักท่องเที่ยว',
      author: 'มัคคุเทศก์ท้องถิ่น',
      date: '2024-03-10',
      readTime: '7 นาที',
      category: 'ทริป',
      image: 'https://placehold.co/600x400',
      featured: false,
      createdBy: 'guide@example.com'
    },
    {
      id: 3,
      title: 'ประวัติศาสตร์และวัฒนธรรมวัดในขอนแก่น',
      excerpt: 'สำรวจวัดสำคัญในขอนแก่นและเรียนรู้ประวัติศาสตร์ที่น่าสนใจ',
      author: 'นักประวัติศาสตร์',
      date: '2024-03-05',
      readTime: '10 นาที',
      category: 'วัฒนธรรม',
      image: 'https://placehold.co/600x400',
      featured: false,
      createdBy: 'historian@example.com'
    },
    {
      id: 4,
      title: 'อาหารพื้นเมืองขอนแก่นที่ห้ามพลาด',
      excerpt: 'ลิสต์อาหารพื้นเมืองของขอนแก่นที่คุณควรลองชิม',
      author: 'เชฟอาหารท้องถิ่น',
      date: '2024-02-28',
      readTime: '6 นาที',
      category: 'อาหาร',
      image: 'https://placehold.co/600x400',
      featured: true,
      createdBy: 'chef@example.com'
    },
  ];

  const categories = ['ทั้งหมด', 'คาเฟ่', 'ทริป', 'วัฒนธรรม', 'อาหาร', 'ธรรมชาติ'];

  const handleCreateBlog = () => {
    // Navigate to the create blog page where users can fill the form
    navigate('/create-blog');
  };

  // verification now happens on the create page if needed

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                บทความและคู่มือท่องเที่ยว
              </h1>
              <p className="text-xl text-white/90">
                ค้นพบข้อมูลเชิงลึกและคำแนะนำสำหรับการท่องเที่ยวในจังหวัดขอนแก่น
              </p>
            </div>
          </div>
        </section>

        {/* Blog Creation CTA */}
        <section className="py-8 bg-accent">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold">คุณเป็นนักเขียนหรือมีประสบการณ์ท่องเที่ยว?</h2>
                <p className="text-muted-foreground">แบ่งปันความรู้และประสบการณ์ของคุณกับนักท่องเที่ยวคนอื่นๆ</p>
              </div>
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={handleCreateBlog}>
                <Plus className="mr-2 h-5 w-5" />
                เขียนบทความใหม่
              </Button>
            </div>
          </div>
        </section>

        {/* Search and Categories */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="ค้นหาบทความ..." 
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg"
                  />
                </div>
              </div>
              
              <Button variant="outline">
                บทความล่าสุด
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button 
                  key={category} 
                  variant="outline" 
                  size="sm"
                  className={category === 'ทั้งหมด' ? 'bg-primary text-primary-foreground' : ''}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold mb-8">บทความล่าสุด</h2>
                
                <div className="space-y-8">
                  {blogPosts.map((post) => (
                    <article 
                      key={post.id} 
                      className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all"
                    >
                        {post.featured && (
                        <div className="h-64 bg-gray-200">
                          <img 
                            src={post.image} 
                            alt={post.title} 
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className={post.featured ? 'p-6' : 'p-6 flex flex-col md:flex-row gap-6'}>
                          {!post.featured && (
                          <div className="md:w-1/3 h-32 bg-gray-200 rounded-lg">
                            <img 
                              src={post.image} 
                              alt={post.title} 
                              loading="lazy"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className={post.featured ? '' : 'md:w-2/3'}>
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                              {post.category}
                            </span>
                            {post.featured && (
                              <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                                บทความเด่น
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                          <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{new Date(post.date).toLocaleDateString('th-TH')}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                          
                          <Button className="mt-4" variant="outline">
                            อ่านเพิ่มเติม
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="flex justify-center mt-12">
                  <div className="flex gap-2">
                    <Button variant="outline" disabled>
                      ก่อนหน้า
                    </Button>
                    <Button variant="outline" className="bg-primary text-primary-foreground">
                      1
                    </Button>
                    <Button variant="outline">
                      2
                    </Button>
                    <Button variant="outline">
                      3
                    </Button>
                    <Button variant="outline">
                      ถัดไป
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Featured Posts */}
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border mb-8">
                  <h3 className="text-xl font-bold mb-4">บทความเด่น</h3>
                  <div className="space-y-4">
                    {blogPosts.filter(post => post.featured).map((post) => (
                      <div key={post.id} className="flex gap-4 hover:bg-muted p-3 rounded-lg cursor-pointer">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                          <img 
                            src={post.image} 
                            alt={post.title} 
                            loading="lazy"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium line-clamp-2">{post.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{new Date(post.date).toLocaleDateString('th-TH')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Categories */}
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border mb-8">
                  <h3 className="text-xl font-bold mb-4">หมวดหมู่บทความ</h3>
                  <div className="space-y-2">
                    {categories.slice(1).map((category) => (
                      <div 
                        key={category} 
                        className="flex justify-between items-center p-2 hover:bg-muted rounded-lg cursor-pointer"
                      >
                        <span>{category}</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.floor(Math.random() * 10) + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Newsletter */}
                <div className="bg-gradient-to-r from-primary to-primary-light rounded-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">รับบทความใหม่ๆ</h3>
                  <p className="text-white/90 mb-4">
                    สมัครรับจดหมายข่าวเพื่อรับบทความและคำแนะนำล่าสุด
                  </p>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="อีเมลของคุณ" 
                      className="w-full px-4 py-2 rounded-lg text-foreground"
                    />
                    <Button className="w-full bg-white text-primary hover:bg-white/90">
                      สมัครสมาชิก
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />
      
      {/* Creation is handled on a dedicated page */}
    </div>
  );
};

export default Blog;