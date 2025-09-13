import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, TreePine, Church, Coffee, Utensils, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Explore = () => {
  const { t } = useLanguage();

  // Sample data for destinations
  const categories = [
    { id: 1, name: 'ธรรมชาติ', icon: TreePine, count: 15 },
    { id: 2, name: 'วัดวาอาราม', icon: Church, count: 12 },
    { id: 3, name: 'คาเฟ่', icon: Coffee, count: 20 },
    { id: 4, name: 'ร้านอาหาร', icon: Utensils, count: 18 },
    { id: 5, name: 'แหล่งช้อปปิ้ง', icon: Landmark, count: 10 },
    { id: 6, name: 'ที่พัก', icon: MapPin, count: 25 },
  ];

  const destinations = [
    {
      id: 1,
      name: 'อุทยานแห่งชาติภูผาแดง',
      description: 'ภูเขาที่สวยงามพร้อมวิวทิวทัศน์อันงดงามของจังหวัดขอนแก่น',
      category: 'ธรรมชาติ',
      image: 'https://placehold.co/400x300',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'วัดพระธาตุขามแก่น',
      description: 'วัดโบราณที่มีประวัติศาสตร์ยาวนานและสถาปัตยกรรมที่งดงาม',
      category: 'วัดวาอาราม',
      image: 'https://placehold.co/400x300',
      rating: 4.6,
    },
    {
      id: 3,
      name: 'ตลาดหนองบัว',
      description: 'ตลาดท้องถิ่นที่มีสินค้าหลากหลายและอาหารอร่อย',
      category: 'แหล่งช้อปปิ้ง',
      image: 'https://placehold.co/400x300',
      rating: 4.5,
    },
    {
      id: 4,
      name: 'สวนสาธารณะแก่นนคร',
      description: 'สวนสาธารณะที่เหมาะสำหรับพักผ่อนหย่อนใจและออกกำลังกาย',
      category: 'ธรรมชาติ',
      image: 'https://placehold.co/400x300',
      rating: 4.4,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                สำรวจขอนแก่น
              </h1>
              <p className="text-xl text-white/90">
                ค้นพบสถานที่ท่องเที่ยวที่น่าตื่นตาตื่นใจในจังหวัดขอนแก่น
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">หมวดหมู่สถานที่</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div 
                    key={category.id} 
                    className="bg-card rounded-lg p-6 text-center shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} สถานที่</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Destinations */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">สถานที่ท่องเที่ยวทั้งหมด</h2>
              <div className="flex gap-2">
                <Button variant="outline">ทั้งหมด</Button>
                <Button variant="outline">เรียงตามความนิยม</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((destination) => (
                <div 
                  key={destination.id} 
                  className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all"
                >
                  <div className="h-48 bg-gray-200 relative">
                    <img 
                      src={destination.image} 
                      alt={destination.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
                      ⭐ {destination.rating}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{destination.name}</h3>
                      <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        {destination.category}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">{destination.description}</p>
                    <Button className="w-full">
                      {t('common.viewDetails')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">อย่าพลาดข่าวสารใหม่ๆ</h2>
              <p className="text-xl mb-6 text-white/90">
                สมัครรับจดหมายข่าวเพื่อรับข้อมูลสถานที่ท่องเที่ยวใหม่และโปรโมชั่นพิเศษ
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="อีเมลของคุณ" 
                  className="flex-1 px-4 py-3 rounded-lg text-foreground"
                />
                <Button className="bg-white text-primary hover:bg-white/90">
                  สมัครสมาชิก
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Explore;