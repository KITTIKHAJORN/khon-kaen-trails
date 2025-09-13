import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, MapPin, Clock, Users, Star, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Itinerary = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('plan');

  // Sample data for pre-made itineraries
  const preMadeItineraries = [
    {
      id: 1,
      title: 'ทริปหนึ่งวันในขอนแก่น',
      duration: '1 วัน',
      places: 5,
      image: 'https://placehold.co/400x300',
      rating: 4.8,
      price: 'ฟรี',
    },
    {
      id: 2,
      title: 'ทริป 2 วัน 1 คืน',
      duration: '2 วัน 1 คืน',
      places: 8,
      image: 'https://placehold.co/400x300',
      rating: 4.7,
      price: '฿1,500',
    },
    {
      id: 3,
      title: 'ทริปสุดสัปดาห์',
      duration: '3 วัน 2 คืน',
      places: 12,
      image: 'https://placehold.co/400x300',
      rating: 4.9,
      price: '฿3,200',
    },
  ];

  // Sample data for places
  const places = [
    { id: 1, name: 'อุทยานแห่งชาติภูผาแดง', category: 'ธรรมชาติ' },
    { id: 2, name: 'วัดพระธาตุขามแก่น', category: 'วัดวาอาราม' },
    { id: 3, name: 'ตลาดหนองบัว', category: 'แหล่งช้อปปิ้ง' },
    { id: 4, name: 'สวนสาธารณะแก่นนคร', category: 'ธรรมชาติ' },
    { id: 5, name: 'พิพิธภัณฑ์ขอนแก่น', category: 'แหล่งช้อปปิ้ง' },
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
                วางแผนทริป
              </h1>
              <p className="text-xl text-white/90">
                สร้างทริปของคุณเองหรือเลือกจากทริปสำเร็จรูปที่เราเตรียมไว้ให้
              </p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex">
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === 'plan'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('plan')}
              >
                วางแผนทริปเอง
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === 'premade'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('premade')}
              >
                ทริปสำเร็จรูป
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {activeTab === 'plan' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Planning Form */}
                <div className="lg:col-span-2">
                  <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                    <h2 className="text-2xl font-bold mb-6">วางแผนทริปของคุณ</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">ชื่อทริป</label>
                        <input 
                          type="text" 
                          placeholder="ชื่อทริปของคุณ" 
                          className="w-full px-4 py-2 border border-input rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">จำนวนผู้เข้าร่วม</label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input 
                            type="number" 
                            placeholder="จำนวนผู้เข้าร่วม" 
                            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">วันเริ่มต้น</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input 
                            type="date" 
                            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">วันสิ้นสุด</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input 
                            type="date" 
                            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Selected Places */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">สถานที่ที่เลือก</h3>
                        <span className="text-sm text-muted-foreground">3 สถานที่</span>
                      </div>
                      
                      <div className="space-y-3">
                        {places.slice(0, 3).map((place) => (
                          <div key={place.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                <MapPin className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">{place.name}</h4>
                                <p className="text-sm text-muted-foreground">{place.category}</p>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      สร้างแผนที่เส้นทาง
                    </Button>
                  </div>
                </div>
                
                {/* Places Selection */}
                <div>
                  <div className="bg-card rounded-xl p-6 shadow-sm border border-border sticky top-24">
                    <h3 className="text-xl font-bold mb-4">เลือกสถานที่</h3>
                    
                    <div className="mb-4">
                      <input 
                        type="text" 
                        placeholder="ค้นหาสถานที่..." 
                        className="w-full px-4 py-2 border border-input rounded-lg"
                      />
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {places.map((place) => (
                        <div key={place.id} className="flex items-center justify-between p-3 hover:bg-muted rounded-lg">
                          <div>
                            <h4 className="font-medium">{place.name}</h4>
                            <p className="text-sm text-muted-foreground">{place.category}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-center">ทริปสำเร็จรูป</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {preMadeItineraries.map((itinerary) => (
                    <div 
                      key={itinerary.id} 
                      className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all"
                    >
                      <div className="h-48 bg-gray-200 relative">
                        <img 
                          src={itinerary.image} 
                          alt={itinerary.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
                          ⭐ {itinerary.rating}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold">{itinerary.title}</h3>
                          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                            {itinerary.price}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="mr-3">{itinerary.duration}</span>
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{itinerary.places} สถานที่</span>
                        </div>
                        <Button className="w-full">
                          ดูรายละเอียด
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Itinerary;