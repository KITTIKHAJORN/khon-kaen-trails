import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

import { Calendar, Clock, MapPin, Plus, Users, X, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const { t } = useLanguage();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth()); // ใช้เดือนปัจจุบัน
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear()); // ใช้ปีปัจจุบัน
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [customEvents, setCustomEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDateEvents, setShowDateEvents] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all' หรือ 'sorted'
  const [selectedCategories, setSelectedCategories] = useState([]); // เก็บหมวดหมู่ที่เลือก
  const [showPastEvents, setShowPastEvents] = useState(false); // ตัวเลือกแสดงงานที่ผ่านไปแล้ว

  // โหลดข้อมูลเฉพาะจาก localStorage เท่านั้น
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem('khonKaenEvents') || '[]');
    setCustomEvents(savedEvents);
  }, []);

  // ใช้เฉพาะข้อมูลจาก localStorage
  const allEvents = customEvents;

  // ฟังก์ชันตรวจสอบว่างานผ่านไปแล้วหรือไม่
  const isEventPast = (eventDate) => {
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    
    // เปรียบเทียบเฉพาะวันที่ (ไม่รวมเวลา)
    today.setHours(0, 0, 0, 0);
    eventDateObj.setHours(0, 0, 0, 0);
    
    return eventDateObj < today;
  };

  // ฟังก์ชันกรองและเรียงลำดับ events
  const getFilteredAndSortedEvents = () => {
    let filteredEvents = allEvents;
    
    // กรองงานที่ผ่านไปแล้วถ้าไม่เลือกแสดง
    if (!showPastEvents) {
      filteredEvents = filteredEvents.filter(event => !isEventPast(event.date));
    }
    
    // กรองตามหมวดหมู่ที่เลือก
    if (selectedCategories.length > 0) {
      filteredEvents = filteredEvents.filter(event => 
        selectedCategories.includes(event.category)
      );
    }
    
    // เรียงลำดับตามวันที่ถ้าเลือก
    if (filterType === 'sorted') {
      filteredEvents = [...filteredEvents].sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
    }
    
    return filteredEvents;
  };

  const events = getFilteredAndSortedEvents();

  // ฟังก์ชันจัดการการเปลี่ยนหมวดหมู่
  const handleCategoryChange = (category, checked) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    }
  };

  // ฟังก์ชันจัดการปุ่มกรอง
  const handleFilterAll = () => {
    setFilterType('all');
    setSelectedCategories([]);
  };

  const handleFilterByDate = () => {
    setFilterType('sorted');
  };

  const handleTogglePastEvents = () => {
    setShowPastEvents(!showPastEvents);
  };

  // นับจำนวนงานที่ผ่านไปแล้ว
  const getPastEventsCount = () => {
    return allEvents.filter(event => isEventPast(event.date)).length;
  };

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
    navigate('/create-event');
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };

  const closeEventDetail = () => {
    setShowEventDetail(false);
    setSelectedEvent(null);
  };

  const formatPrice = (price) => {
    if (!price || price === '0' || price === 0) {
      return 'Free';
    }
    return `${price} บาท`;
  };

  // ฟังก์ชันใหม่สำหรับการ highlight ปฏิทิน
  const hasEventsOnDate = (day) => {
    if (!day) return false;
    
    // สร้าง string วันที่ในรูปแบบ YYYY-MM-DD โดยไม่ใช้ timezone
    const yearStr = selectedYear.toString();
    const monthStr = (selectedMonth + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const dateString = `${yearStr}-${monthStr}-${dayStr}`;
    
    // ตรวจสอบว่ามี event ในวันนั้นหรือไม่ (ใช้ allEvents แต่กรองตามการตั้งค่าแสดงงานผ่านไป)
    const eventsOnDate = allEvents.filter(event => event.date === dateString);
    
    if (showPastEvents) {
      return eventsOnDate.length > 0;
    } else {
      return eventsOnDate.filter(event => !isEventPast(event.date)).length > 0;
    }
  };

  // ดึงข้อมูล event ที่จัดขึ้นในวันที่ระบุ
  const getEventsForDate = (day) => {
    if (!day) return [];
    
    const yearStr = selectedYear.toString();
    const monthStr = (selectedMonth + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const dateString = `${yearStr}-${monthStr}-${dayStr}`;
    
    // กรองตามการตั้งค่าแสดงงานผ่านไป
    const eventsOnDate = allEvents.filter(event => event.date === dateString);
    
    if (showPastEvents) {
      return eventsOnDate;
    } else {
      return eventsOnDate.filter(event => !isEventPast(event.date));
    }
  };

  // ฟังก์ชันจัดการเมื่อคลิกที่วันที่ในปฏิทิน
  const handleDateClick = (day) => {
    if (!day) return;
    
    const eventsOnDate = getEventsForDate(day);
    if (eventsOnDate.length > 0) {
      const yearStr = selectedYear.toString();
      const monthStr = (selectedMonth + 1).toString().padStart(2, '0');
      const dayStr = day.toString().padStart(2, '0');
      const dateString = `${yearStr}-${monthStr}-${dayStr}`;
      
      setSelectedDate({
        date: dateString,
        day: day,
        events: eventsOnDate,
        formattedDate: new Date(selectedYear, selectedMonth, day).toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          calendar: 'gregory'
        })
      });
      setShowDateEvents(true);
    }
  };

  // ฟังก์ชันปิด modal แสดงกิจกรรมในวันที่เลือก
  const closeDateEvents = () => {
    setShowDateEvents(false);
    setSelectedDate(null);
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
                      {monthNames[selectedMonth]} {selectedYear}
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
                    {calendarDays.map((day, index) => {
                      const hasEvents = hasEventsOnDate(day);
                      const eventsOnThisDate = getEventsForDate(day);
                      
                      return (
                        <div 
                          key={index} 
                          className={`h-10 flex items-center justify-center rounded-lg text-sm relative cursor-pointer transition-all ${
                            day 
                              ? 'hover:bg-muted' 
                              : ''
                          } ${
                            day === new Date().getDate() && 
                            selectedMonth === new Date().getMonth() && 
                            selectedYear === new Date().getFullYear()
                              ? 'bg-primary text-white'
                              : ''
                          } ${
                            hasEvents
                              ? 'bg-yellow-100 border-2 border-yellow-400 text-yellow-800 font-semibold hover:bg-yellow-200'
                              : ''
                          }`}
                          title={hasEvents ? `${eventsOnThisDate.length} กิจกรรมในวันนี้: ${eventsOnThisDate.map(e => e.title).join(', ')} (คลิกเพื่อดูรายละเอียด)` : ''}
                          onClick={() => handleDateClick(day)}
                        >
                          {day}
                          {hasEvents && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      );
                    })}
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
                            checked={selectedCategories.includes(category)}
                            onChange={(e) => handleCategoryChange(category, e.target.checked)}
                            className="mr-2 h-4 w-4 text-primary"
                          />
                          <label htmlFor={category} className="text-sm cursor-pointer">{category}</label>
                        </div>
                      ))}
                    </div>
                    
                    {/* ปุ่มล้างการเลือก */}
                    {selectedCategories.length > 0 && (
                      <div className="mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedCategories([])}
                          className="text-xs"
                        >
                          ล้างการเลือก
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Events List */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-3xl font-bold">กิจกรรมที่กำลังจะมาถึง</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {filterType === 'sorted' && 'เรียงตามวันที่'}
                      {selectedCategories.length > 0 && ` • กรองตาม: ${selectedCategories.join(', ')}`}
                      {filterType === 'all' && selectedCategories.length === 0 && !showPastEvents && 'แสดงเฉพาะงานที่ยังไม่ผ่านไป'}
                      {showPastEvents && 'รวมงานที่ผ่านไปแล้ว'}
                      {!showPastEvents && getPastEventsCount() > 0 && ` (ซ่อนงานที่ผ่านไป ${getPastEventsCount()} รายการ)`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={filterType === 'all' && selectedCategories.length === 0 ? 'default' : 'outline'}
                      onClick={handleFilterAll}
                    >
                      ทั้งหมด
                    </Button>
                    <Button 
                      variant={filterType === 'sorted' ? 'default' : 'outline'}
                      onClick={handleFilterByDate}
                    >
                      เรียงตามวันที่
                    </Button>
                    {getPastEventsCount() > 0 && (
                      <Button 
                        variant={showPastEvents ? 'default' : 'outline'}
                        onClick={handleTogglePastEvents}
                        size="sm"
                      >
                        {showPastEvents ? 'ซ่อนงานผ่านไป' : `แสดงงานผ่านไป (${getPastEventsCount()})`}
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  {events.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-muted-foreground">
                        ไม่มีกิจกรรมในขณะนี้
                      </div>
                    </div>
                  ) : (
                    events.map((event) => (
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
                              <span>{new Date(event.date).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                calendar: 'gregory'
                              })}</span>
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
                            <Button variant="outline" onClick={() => handleViewDetails(event)}>
                              ดูรายละเอียด
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">กิจกรรมล่าสุด</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getFilteredAndSortedEvents().slice(0, 3).map((event) => (
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
                        <span>{new Date(event.date).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: '2-digit', 
                          day: '2-digit',
                          calendar: 'gregory'
                        })}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => handleViewDetails(event)}>
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
      
      {/* Event Detail Modal */}
      {showEventDetail && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{selectedEvent.title}</h2>
                  <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                    {selectedEvent.category}
                  </span>
                </div>
                <button
                  onClick={closeEventDetail}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Image */}
              <div className="mb-6">
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title}
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
              
              {/* Event Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">ข้อมูลงาน</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{new Date(selectedEvent.date).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit', 
                        calendar: 'gregory'
                      })}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{selectedEvent.attendees?.toLocaleString() || 0} คนเข้าร่วม</span>
                    </div>
                  </div>
                </div>
                
                {/* Pricing */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">ค่าเข้าร่วม</h3>
                  {selectedEvent.isFreeEvent ? (
                    <div className="text-green-600 font-semibold text-lg">เข้าร่วมฟรี</div>
                  ) : selectedEvent.packages && selectedEvent.packages.length > 0 ? (
                    <div className="space-y-2">
                      {selectedEvent.packages.map((pkg, index) => (
                        <div key={pkg.id || index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                          <div>
                            <div className="font-medium">{pkg.name || `แพ็คเกจที่ ${index + 1}`}</div>
                            {pkg.description && (
                              <div className="text-sm text-muted-foreground">{pkg.description}</div>
                            )}
                          </div>
                          <div className={`font-semibold ${pkg.price === '0' || !pkg.price ? 'text-green-600' : 'text-primary'}`}>
                            {formatPrice(pkg.price)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">ไม่ระบุข้อมูลราคา</div>
                  )}
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">รายละเอียด</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedEvent.description || 'ไม่มีรายละเอียด'}
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={closeEventDetail}>
                  ปิด
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Date Events Modal */}
      {showDateEvents && selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    กิจกรรมวันที่ {selectedDate.formattedDate}
                  </h2>
                  <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                    {selectedDate.events.length} กิจกรรม
                  </span>
                </div>
                <button
                  onClick={closeDateEvents}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Events List */}
              <div className="space-y-4">
                {selectedDate.events.map((event, index) => (
                  <div 
                    key={event.id || index}
                    className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-all cursor-pointer"
                    onClick={() => {
                      closeDateEvents();
                      handleViewDetails(event);
                    }}
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/4">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      </div>
                      <div className="md:w-3/4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            {event.category}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            <span>{event.attendees?.toLocaleString() || 0} คนเข้าร่วม</span>
                          </div>
                          {(event.packages && event.packages.length > 0) || event.isFreeEvent ? (
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2" />
                              <span>
                                {event.isFreeEvent ? 'ฟรี' : 
                                 event.packages && event.packages.length > 0 ? 
                                   `เริ่มต้น ${formatPrice(event.packages[0].price)}` : 
                                   'ไม่ระบุราคา'
                                }
                              </span>
                            </div>
                          ) : null}
                        </div>
                        
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        
                        <div className="mt-3">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              closeDateEvents();
                              handleViewDetails(event);
                            }}
                          >
                            ดูรายละเอียด
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end mt-6">
                <Button variant="outline" onClick={closeDateEvents}>
                  ปิด
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Creation is handled on a dedicated page */}
    </div>
  );
};

export default Events;