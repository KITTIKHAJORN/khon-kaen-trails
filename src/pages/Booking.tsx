import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bed, Calendar, Car, Filter, MapPin, Star, Users } from 'lucide-react';
import { useState } from 'react';

const Booking = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('hotels');

  // Sample data for accommodations
  const accommodations = [
    {
      id: 1,
      name: 'โรงแรมขอนแก่นพลาซ่า',
      type: 'โรงแรม',
      location: 'เมืองขอนแก่น',
      price: 1200,
      rating: 4.5,
      reviews: 240,
      image: 'https://placehold.co/400x300',
      amenities: ['Wifi', 'สระว่ายน้ำ', 'อาหารเช้า'],
    },
    {
      id: 2,
      name: 'รีสอร์ทแก่นนคร',
      type: 'รีสอร์ท',
      location: 'เมืองขอนแก่น',
      price: 1800,
      rating: 4.7,
      reviews: 180,
      image: 'https://placehold.co/400x300',
      amenities: ['Wifi', 'สระว่ายน้ำ', 'สปา', 'อาหารเช้า'],
    },
    {
      id: 3,
      name: 'โฮมสเตย์บ้านอีสาน',
      type: 'โฮมสเตย์',
      location: 'อำเภอเมือง',
      price: 800,
      rating: 4.3,
      reviews: 95,
      image: 'https://placehold.co/400x300',
      amenities: ['Wifi', 'อาหารเช้า'],
    },
  ];

  // Sample data for car rentals
  const carRentals = [
    {
      id: 1,
      name: 'รถเก๋ง Toyota Camry',
      type: 'รถเก๋ง',
      price: 1200,
      rating: 4.6,
      reviews: 150,
      image: 'https://placehold.co/400x300',
      features: ['5 ที่นั่ง', 'เครื่องปรับอากาศ', 'เกียร์อัตโนมัติ'],
    },
    {
      id: 2,
      name: 'รถตู้ Toyota Commuter',
      type: 'รถตู้',
      price: 2000,
      rating: 4.8,
      reviews: 85,
      image: 'https://placehold.co/400x300',
      features: ['12 ที่นั่ง', 'เครื่องปรับอากาศ', 'เกียร์ธรรมดา'],
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
                จองที่พักและบริการ
              </h1>
              <p className="text-xl text-white/90">
                ค้นหาและจองที่พัก รถเช่า และบริการอื่นๆ สำหรับการท่องเที่ยวในขอนแก่น
              </p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
              <button
                className={`px-6 py-3 font-medium flex items-center ${
                  activeTab === 'hotels'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('hotels')}
              >
                <Bed className="h-4 w-4 mr-2" />
                ที่พัก
              </button>
              <button
                className={`px-6 py-3 font-medium flex items-center ${
                  activeTab === 'cars'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('cars')}
              >
                <Car className="h-4 w-4 mr-2" />
                รถเช่า
              </button>
              {/* Tours tab removed */}
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">จุดหมาย</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="เมืองขอนแก่น" 
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">เช็คอิน</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="date" 
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">เช็คเอาท์</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="date" 
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ผู้เข้าพัก</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="number" 
                      placeholder="2 ผู้เข้าพัก" 
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-lg"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    ตัวกรอง
                  </Button>
                  <Button variant="outline" size="sm">
                    ราคา
                  </Button>
                  <Button variant="outline" size="sm">
                    คะแนนรีวิว
                  </Button>
                </div>
                <Button size="lg">
                  ค้นหา
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">
                {activeTab === 'hotels' && 'ที่พัก'}
                {activeTab === 'cars' && 'รถเช่า'}
                {/* tours tab removed */}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline">เรียงตามความนิยม</Button>
              </div>
            </div>
            
            {activeTab === 'hotels' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {accommodations.map((hotel) => (
                  <div 
                    key={hotel.id} 
                    className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all"
                  >
                    <div className="h-48 bg-gray-200 relative">
                      <img 
                        src={hotel.image} 
                        alt={hotel.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
                        ⭐ {hotel.rating}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold">{hotel.name}</h3>
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {hotel.type}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{hotel.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities.map((amenity, index) => (
                          <span 
                            key={index} 
                            className="text-xs bg-muted px-2 py-1 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">฿{hotel.price}<span className="text-base font-normal text-muted-foreground">/คืน</span></div>
                          <div className="text-sm text-muted-foreground">
                            {hotel.reviews} รีวิว
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
            )}
            
            {activeTab === 'cars' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {carRentals.map((car) => (
                  <div 
                    key={car.id} 
                    className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-2/5 h-48 bg-gray-200">
                        <img 
                          src={car.image} 
                          alt={car.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="md:w-3/5 p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold">{car.name}</h3>
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            {car.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {car.features.map((feature, index) => (
                            <span 
                              key={index} 
                              className="text-xs bg-muted px-2 py-1 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-2xl font-bold text-primary">฿{car.price}<span className="text-base font-normal text-muted-foreground">/วัน</span></div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Star className="h-4 w-4 mr-1 text-yellow-500" />
                              <span>{car.rating} ({car.reviews} รีวิว)</span>
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
            )}
            
            {/* tours results removed */}
          </div>
        </section>

        {/* Special Offers */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">ข้อเสนอพิเศษ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'แพ็คเกจที่พัก 3 คืน',
                  description: 'จองที่พัก 3 คืนในโรงแรมพาร์ทเนอร์รับส่วนลด 20%',
                  discount: '20%',
                },
                {
                  title: 'เช่ารถราคาพิเศษ',
                  description: 'เช่ารถ 3 วันขึ้นไป ลดราคา 15%',
                  discount: '15%',
                },
                {
                  title: 'แพ็คเกจครอบครัว',
                  description: 'ที่พัก + ทัวร์สำหรับครอบครัว 4 ท่านขึ้นไป',
                  discount: '25%',
                },
              ].map((offer, index) => (
                <div 
                  key={index} 
                  className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-2">{offer.discount}</div>
                  <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-muted-foreground mb-4">{offer.description}</p>
                  <Button variant="outline">
                    ดูรายละเอียด
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Booking;