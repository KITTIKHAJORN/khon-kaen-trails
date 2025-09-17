import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  attendees: number;
  category: string;
}

export const LatestEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // ดึงข้อมูลเฉพาะจาก localStorage เท่านั้น
    const savedEvents = JSON.parse(localStorage.getItem('khonKaenEvents') || '[]');
    const today = new Date();
    
    // กรองเฉพาะงานที่ยังไม่ผ่านไป และเรียงตามวันที่
    const upcomingEvents = savedEvents
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);

    setEvents(upcomingEvents);
  }, []);

  const handleViewAllEvents = () => {
    navigate('/events');
  };

  // ไม่แสดงคอมโพเนนต์เมื่อไม่มีข้อมูล
  if (events.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">งานเทศกาลและกิจกรรม</h2>
            <p className="text-muted-foreground mt-2">กิจกรรมที่น่าสนใจในขอนแก่น</p>
          </div>
          <Button onClick={handleViewAllEvents} variant="outline">
            ดูทั้งหมด
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
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
                <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(event.date).toLocaleDateString('th-TH')}</span>
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
                <Button className="w-full" onClick={handleViewAllEvents}>
                  ดูรายละเอียด
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};