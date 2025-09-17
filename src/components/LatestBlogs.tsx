import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  featured?: boolean;
  createdBy?: string;
}

export const LatestBlogs = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // ดึงข้อมูลเฉพาะจาก localStorage เท่านั้น
    const savedBlogs = JSON.parse(localStorage.getItem('khonKaenBlogs') || '[]');
    
    // เรียงตามวันที่ล่าสุดและเลือก 3 บทความแรก
    const latestBlogs = savedBlogs
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    setBlogPosts(latestBlogs);
  }, []);

  const handleViewAllBlogs = () => {
    navigate('/blog');
  };

  const handleReadMore = (blog: BlogPost) => {
    navigate('/blog');
  };

  // ไม่แสดงคอมโพเนนต์เมื่อไม่มีข้อมูล
  if (blogPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">บทความล่าสุด</h2>
            <p className="text-muted-foreground mt-2">เรื่องราวและข้อมูลท่องเที่ยวในขอนแก่น</p>
          </div>
          <Button onClick={handleViewAllBlogs} variant="outline">
            ดูทั้งหมด
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <article 
              key={post.id} 
              className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all"
            >
              <div className="h-48 bg-gray-200 relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </div>
                {post.featured && (
                  <div className="absolute top-4 left-4 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                    บทความเด่น
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(post.date).toLocaleDateString('th-TH')}</span>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline" onClick={() => handleReadMore(post)}>
                  อ่านเพิ่มเติม
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};