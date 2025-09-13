import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Clock, Users, Star, Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmailVerificationModal } from '@/components/EmailVerificationModal';

const Tours = () => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Sample data for tours
  const tours = [
    {
      id: 1,
      title: 'ทัวร์ธรรมชาติขอนแก่น 1 วัน',
      description: 'สำรวจความงามของธรรมชาติในจังหวัดขอนแก่นในทริปหนึ่งวัน',
      duration: '1 วัน',
      places: 5,
      price: 800,
      rating: 4.8,
      reviews: 120,
      image: 'https://placehold.co/400x300',
      category: 'ธรรมชาติ',
      isFeatured: true,
      createdBy: 'admin@example.com'
    },
    {
      id: 2,
      title: 'ทัวร์วัดวาอารามขอนแก่น',
      description: 'สัมผัสความสงบและความงามของวัดวาอารามในขอนแก่น',
      duration: '1 วัน',
      places: 7,
      price: 600,
      rating: 4.6,
      reviews: 85,
      image: 'https://placehold.co/400x300',
      category: 'วัฒนธรรม',
      isFeatured: false,
      createdBy: 'admin@example.com'
    },
    {
      id: 3,
      title: 'ทัวร์อาหารขอนแก่น',
      description: 'ลิ้มลองอาหารพื้นเมืองและของหวานสุดพิเศษของขอนแก่น',
      duration: '1 วัน',
      places: 6,
      price: 700,
      rating: 4.9,
      reviews: 150,
      image: 'https://placehold.co/400x300',
      category: 'อาหาร',
      isFeatured: true,
      createdBy: 'guide@example.com'
    },
    {
      id: 4,
      title: 'ทัวร์ช้อปปิ้งขอนแก่น',
      description: 'ช้อปปิ้งสินค้าท้องถิ่นและของที่ระลึกในตลาดขอนแก่น',
      duration: '1 วัน',
      places: 4,
      price: 500,
      rating: 4.5,
      reviews: 95,
      image: 'https://placehold.co/400x300',
      category: 'ช้อปปิ้ง',
      isFeatured: false,
      createdBy: 'guide@example.com'
    },
  ];

  const handleCreateTour = () => {
    setIsCreateModalOpen(true);
  };

  const handleVerify = (email: string, otp: string) => {
    // In a real app, you would verify the OTP with your backend
    console.log('Email verified:', email, 'OTP:', otp);
    setUserEmail(email);
    setIsCreateModalOpen(false);
    
    // Redirect to tour creation form or show success message
    alert(`ยืนยันตัวตนสำเร็จ! คุณสามารถสร้างทัวร์ด้วยอีเมล ${email} ได้แล้ว`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                ทัวร์และกิจกรรม
              </h1>
              <p className="text-xl text-white/90">
                เลือกทัวร์คุณภาพจากผู้เชี่ยวชาญท้องถิ่นเพื่อประสบการณ์ที่ไม่มีวันลืม
              </p>
            </div>
          </div>
        </section>

        {/* Tour Creation CTA */}
        <section className="py-8 bg-accent">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold">คุณเป็นมัคคุเทศก์หรือผู้ให้บริการทัวร์?</h2>
                <p className="text-muted-foreground">สร้างและโปรโมททัวร์ของคุณบนแพลตฟอร์มของเรา</p>
              </div>
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={handleCreateTour}>
                <Plus className="mr-2 h-5 w-5" />
                สร้างทัวร์ของคุณ
              </Button>
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="ค้นหาทัวร์..." 
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  ตัวกรอง
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                  {viewMode === 'grid' ? 'รายการ' : 'ตาราง'}
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {['ทั้งหมด', 'ธรรมชาติ', 'วัฒนธรรม', 'อาหาร', 'ช้อปปิ้ง'].map((category) => (
                <Button 
                  key={category} 
                  variant="outline" 
                  size="sm"
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Tours List */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">ทัวร์ที่แนะนำ</h2>
              <div className="flex gap-2">
                <Button variant="outline">เรียงตามความนิยม</Button>
              </div>
            </div>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tours.map((tour) => (
                  <div 
                    key={tour.id} 
                    className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all"
                  >
                    <div className="h-48 bg-gray-200 relative">
                      <img 
                        src={tour.image} 
                        alt={tour.title} 
                        className="w-full h-full object-cover"
                      />
                      {tour.isFeatured && (
                        <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full font-medium">
                          โปรโมท
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
                        ⭐ {tour.rating}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold">{tour.title}</h3>
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {tour.category}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4">{tour.description}</p>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="mr-3">{tour.duration}</span>
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{tour.places} สถานที่</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">฿{tour.price}</div>
                          <div className="text-sm text-muted-foreground">
                            {tour.reviews} รีวิว
                          </div>
                        </div>
                        <Button>
                          จองเลย
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {tours.map((tour) => (
                  <div 
                    key={tour.id} 
                    className="bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-all p-6"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/4 h-40 bg-gray-200 rounded-lg">
                        <img 
                          src={tour.image} 
                          alt={tour.title} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="md:w-3/4">
                        <div className="flex flex-wrap justify-between items-start mb-2">
                          <h3 className="text-xl font-bold">{tour.title}</h3>
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            {tour.category}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-4">{tour.description}</p>
                        
                        <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-4 gap-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{tour.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{tour.places} สถานที่</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-500" />
                            <span>{tour.rating} ({tour.reviews} รีวิว)</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap justify-between items-center">
                          <div className="text-2xl font-bold text-primary">฿{tour.price}</div>
                          <div className="flex gap-2">
                            <Button variant="outline">
                              ดูรายละเอียด
                            </Button>
                            <Button>
                              จองเลย
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Tours */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">ทัวร์โปรโมท</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {tours.filter(tour => tour.isFeatured).map((tour) => (
                <div 
                  key={tour.id} 
                  className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 h-48 bg-gray-200">
                      <img 
                        src={tour.image} 
                        alt={tour.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:w-3/5 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold">{tour.title}</h3>
                        <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                          โปรโมท
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4">{tour.description}</p>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="mr-3">{tour.duration}</span>
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{tour.places} สถานที่</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">฿{tour.price}</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Star className="h-4 w-4 mr-1 text-yellow-500" />
                            <span>{tour.rating} ({tour.reviews} รีวิว)</span>
                          </div>
                        </div>
                        <Button>
                          จองเลย
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />
      
      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onVerify={handleVerify}
        entityType="ทัวร์"
      />
    </div>
  );
};

export default Tours;