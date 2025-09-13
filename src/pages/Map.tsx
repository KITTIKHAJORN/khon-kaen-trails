import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Search, Filter, Navigation2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Map = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                แผนที่ขอนแก่น
              </h1>
              <p className="text-xl text-white/90">
                สำรวจสถานที่ท่องเที่ยวในจังหวัดขอนแก่นผ่านแผนที่อินเตอร์แอคทีฟ
              </p>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Map Controls */}
              <div className="lg:w-1/4">
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                  <h2 className="text-2xl font-bold mb-6">ตัวกรองการค้นหา</h2>
                  
                  {/* Search */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">ค้นหาสถานที่</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="ค้นหา..." 
                        className="w-full pl-10 pr-4 py-2 border border-input rounded-lg"
                      />
                    </div>
                  </div>
                  
                  {/* Categories */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">หมวดหมู่</label>
                    <div className="space-y-2">
                      {['ธรรมชาติ', 'วัดวาอาราม', 'คาเฟ่', 'ร้านอาหาร', 'แหล่งช้อปปิ้ง', 'ที่พัก'].map((category) => (
                        <div key={category} className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={category} 
                            className="mr-2 h-4 w-4 text-primary"
                          />
                          <label htmlFor={category} className="text-sm">{category}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">คะแนนรีวิว</label>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center">
                          <input 
                            type="radio" 
                            name="rating" 
                            id={`rating-${rating}`} 
                            className="mr-2 h-4 w-4 text-primary"
                          />
                          <label htmlFor={`rating-${rating}`} className="text-sm">
                            {Array(rating).fill(0).map((_, i) => (
                              <span key={i} className="text-yellow-500">★</span>
                            ))}
                            {rating < 5 && Array(5 - rating).fill(0).map((_, i) => (
                              <span key={i} className="text-gray-300">★</span>
                            ))}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    ใช้ตัวกรอง
                  </Button>
                </div>
                
                {/* Popular Places */}
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border mt-6">
                  <h3 className="text-xl font-bold mb-4">สถานที่ยอดนิยม</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'อุทยานแห่งชาติภูผาแดง', rating: 4.8 },
                      { name: 'วัดพระธาตุขามแก่น', rating: 4.6 },
                      { name: 'ตลาดหนองบัว', rating: 4.5 },
                    ].map((place, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-muted rounded-lg cursor-pointer">
                        <div>
                          <h4 className="font-medium">{place.name}</h4>
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span className="text-sm">{place.rating}</span>
                          </div>
                        </div>
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Map Area */}
              <div className="lg:w-3/4">
                <div className="bg-card rounded-xl shadow-sm border border-border h-full min-h-[600px] relative">
                  {/* Map Placeholder */}
                  <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Navigation2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">แผนที่ขอนแก่น</h3>
                      <p className="text-muted-foreground mb-6">
                        แผนที่อินเตอร์แอคทีฟจะแสดงที่นี่
                      </p>
                      <Button>
                        <MapPin className="mr-2 h-4 w-4" />
                        ปักหมุดสถานที่ของคุณ
                      </Button>
                    </div>
                  </div>
                  
                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="bg-white">
                      +
                    </Button>
                    <Button size="sm" variant="outline" className="bg-white">
                      -
                    </Button>
                    <Button size="sm" variant="outline" className="bg-white">
                      <Navigation2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Directions Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">วางแผนเส้นทาง</h2>
            <div className="max-w-4xl mx-auto bg-card rounded-xl p-8 shadow-sm border border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">จุดเริ่มต้น</label>
                  <input 
                    type="text" 
                    placeholder="เลือกจุดเริ่มต้น" 
                    className="w-full px-4 py-2 border border-input rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">จุดหมาย</label>
                  <input 
                    type="text" 
                    placeholder="เลือกจุดหมาย" 
                    className="w-full px-4 py-2 border border-input rounded-lg"
                  />
                </div>
              </div>
              <Button className="w-full">
                <Navigation2 className="mr-2 h-4 w-4" />
                ค้นหาเส้นทาง
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Map;