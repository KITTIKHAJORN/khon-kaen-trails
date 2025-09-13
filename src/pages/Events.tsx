import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, MapPin, Clock, Users, Star, Ticket, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmailVerificationModal } from '@/components/EmailVerificationModal';

const Events = () => {
  const { t } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Sample data for events
  const events = [
    {
      id: 1,
      title: 'งานบุญบั้งไฟขอนแก่น',
      date: '2024-04-15',
      time: '18:00 - 22:00',
      location: 'สนามกีฬากลางขอนแก่น',
      image: 'https://placehold.co/400x300',
      attendees: 5000,
      category: 'เทศกาล',
      isRegistered: false,
      createdBy: 'admin@example.com'
    },
    {
      id: 2,
      title: 'งานเทศกาลผลไม้ขอนแก่น',
      date: '2024-05-10',
      time: '09:00 - 17:00',
      location: 'ศูนย์แสดงสินค้าขอนแก่น',
      image: 'https://placehold.co/400x300',
      attendees: 3000,
      category: 'เทศกาล',
      isRegistered: true,
      createdBy: 'admin@example.com'
    },
    {
      id: 3,
      title: 'คอนเสิร์ตกลางเมือง',
      date: '2024-06-20',
      time: '19:00 - 22:00',
      location: 'สวนสาธารณะแก่นนคร',
      image: 'https://placehold.co/400x300',
      attendees: 2000,
      category: 'คอนเสิร์ต',
      isRegistered: false,
      createdBy: 'user@example.com'
    },
  ];

  // Generate calendar data
  const generateCalendarDays = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const handleCreateEvent = () => {
    setIsCreateModalOpen(true);
  };

  const handleVerify = (email: string, otp: string) => {
    // In a real app, you would verify the OTP with your backend
    console.log('Email verified:', email, 'OTP:', otp);
    setUserEmail(email);
    setIsCreateModalOpen(false);
    
    // Redirect to event creation form or show success message
    alert(`ยืนยันตัวตนสำเร็จ! คุณสามารถสร้างงานเทศกาลด้วยอีเมล ${email} ได้แล้ว`);
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
                งานเทศกาลและกิจกรรม
              </h1>
              <p className="text-xl text-white/90">
                ติดตามกิจกรรมและความบันเทิงที่น่าสนใจในจังหวัดขอนแก่น
              </p>
            </div>
          </div>
        </section>

        {/* Tour Creation CTA */}
        <section className="py-8 bg-accent">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold">คุณต้องการจัดงานเทศกาลหรือกิจกรรม?</h2>
                <p className="text-muted-foreground">สร้างและโปรโมทงานของคุณบนแพลตฟอร์มของเรา</p>
              </div>
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={handleCreateEvent}>
                <Plus className="mr-2 h-5 w-5" />
                สร้างงานเทศกาลของคุณ
              </Button>
            </div>
          </div>
        </section>

        {/* Calendar and Events */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border sticky top-24">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">ปฏิทินกิจกรรม</h2>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (selectedMonth === 0) {
                            setSelectedMonth(11);
                            setSelectedYear(selectedYear - 1);
                          } else {
                            setSelectedMonth(selectedMonth - 1);
                          }
                        }}
                      >
                        &lt;
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (selectedMonth === 11) {
                            setSelectedMonth(0);
                            setSelectedYear(selectedYear + 1);
                          } else {
                            setSelectedMonth(selectedMonth + 1);
                          }
                        }}
                      >
                        &gt;
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold">
                      {monthNames[selectedMonth]} {selectedYear + 543}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => (
                      <div 
                        key={index} 
                        className={`h-10 flex items-center justify-center rounded-lg text-sm ${
                          day 
                            ? 'hover:bg-muted cursor-pointer' 
                            : ''
                        } ${
                          day === new Date().getDate() && 
                          selectedMonth === new Date().getMonth() && 
                          selectedYear === new Date().getFullYear()
                            ? 'bg-primary text-white'
                            : ''
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Event Categories */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">หมวดหมู่กิจกรรม</h3>
                    <div className="space-y-2">
                      {['เทศกาล', 'คอนเสิร์ต', 'กีฬา', 'นิทรรศการ', 'อาหาร'].map((category) => (
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
                </div>
              </div>
              
              {/* Events List */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold">กิจกรรมที่กำลังจะมาถึง</h2>
                  <div className="flex gap-2">
                    <Button variant="outline">ทั้งหมด</Button>
                    <Button variant="outline">เรียงตามวันที่</Button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {events.map((event) => (
                    <div 
                      key={event.id} 
                      className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 h-48 bg-gray-200">
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex flex-wrap justify-between items-start mb-2">
                            <h3 className="text-xl font-bold">{event.title}</h3>
                            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                              {event.category}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{new Date(event.date).toLocaleDateString('th-TH')}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Users className="h-4 w-4 mr-2" />
                              <span>{event.attendees.toLocaleString()} คนเข้าร่วม</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-3">
                            {event.isRegistered ? (
                              <Button variant="outline" disabled>
                                ลงทะเบียนแล้ว
                              </Button>
                            ) : (
                              <Button>
                                <Ticket className="mr-2 h-4 w-4" />
                                ลงทะเบียน
                              </Button>
                            )}
                            <Button variant="outline">
                              ดูรายละเอียด
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">กิจกรรมเด่น</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.slice(0, 3).map((event) => (
                <div 
                  key={event.id} 
                  className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all"
                >
                  <div className="h-48 bg-gray-200 relative">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
                      {event.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(event.date).toLocaleDateString('th-TH')}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <Button className="w-full">
                      ดูรายละเอียด
                    </Button>
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
        entityType="งานเทศกาล"
      />
    </div>
  );
};

export default Events;