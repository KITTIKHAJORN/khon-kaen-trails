import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Tag, Users, Image } from 'lucide-react';
import React, { useState } from 'react';

// Prefill with first sample event
const sample = {
  title: 'งานบุญบั้งไฟขอนแก่น',
  date: '2024-04-15',
  time: '18:00 - 22:00',
  location: 'สนามกีฬากลางขอนแก่น',
  image: 'https://placehold.co/400x300',
  attendees: 5000,
  category: 'เทศกาล',
};

const CreateEvent = () => {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState(sample.title);
  const [date, setDate] = useState(sample.date);
  const [time, setTime] = useState(sample.time);
  const [location, setLocation] = useState(sample.location);
  const [image, setImage] = useState(sample.image);
  const [category, setCategory] = useState(sample.category);
  const [attendees, setAttendees] = useState(String(sample.attendees));
  const [description, setDescription] = useState(`รายละเอียดของ ${sample.title}`);


  const steps = [
    { id: 0, title: 'ข้อมูลพื้นฐาน', description: 'ชื่อและรายละเอียดเทศกาล' },
    { id: 1, title: 'วันเวลาและสถานที่', description: 'กำหนดการและพิกัด' },
    { id: 2, title: 'รายละเอียด', description: 'ข้อมูลเพิ่มเติม' },
    { id: 3, title: 'ตรวจสอบ', description: 'ตรวจสอบข้อมูล' }
  ];

  const categories = ['เทศกาล', 'คอนเสิร์ต', 'นิทรรศการ', 'กีฬา', 'การกุศล', 'ธุรกิจ', 'การประชุม', 'อบรม'];
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Validate required fields only on final submission
    if (!title.trim()) {
      alert('กรุณากรอกชื่องานเทศกาล/กิจกรรม');
      return;
    }
    if (!description.trim()) {
      alert('กรุณากรอกรายละเอียด');
      return;
    }
    if (!category.trim()) {
      alert('กรุณาเลือกหมวดหมู่');
      return;
    }
    if (!date) {
      alert('กรุณาเลือกวันที่จัดงาน');
      return;
    }
    if (!time.trim()) {
      alert('กรุณากรอกเวลา');
      return;
    }
    if (!location.trim()) {
      alert('กรุณากรอกสถานที่');
      return;
    }
    if (!attendees.trim()) {
      alert('กรุณากรอกจำนวนผู้เข้าร่วม');
      return;
    }
    
    if (confirm(`คุณต้องการสร้างงานเทศกาล "${title}" วันที่ ${date} หรือไม่?`)) {
      alert(`งานเทศกาลถูกสร้างเรียบร้อย: ${title} วันที่ ${date}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  สร้างงานเทศกาล/กิจกรรมใหม่
                </h1>
                <p className="text-muted-foreground text-lg">
                  สร้างงานเทศกาลและกิจกรรมที่น่าสนใจในขอนแก่น
                </p>
              </div>

              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${(step / 3) * 100}%` }}
                    />
                  </div>
                  {steps.map((s) => (
                    <div key={s.id} className="flex flex-col items-center relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        step >= s.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {s.id + 1}
                      </div>
                      <div className="text-center mt-2 max-w-24">
                        <p className="text-xs font-medium text-foreground">{s.title}</p>
                        <p className="text-xs text-muted-foreground hidden md:block">{s.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="bg-card rounded-2xl p-8 shadow-card">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 0 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground mb-6">ข้อมูลพื้นฐาน</h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          ชื่องานเทศกาล/กิจกรรม *
                        </label>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="เช่น งานบุญบั้งไฟขอนแก่น"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          รายละเอียด *
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          placeholder="อธิบายรายละเอียดของงานเทศกาล/กิจกรรม..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          หมวดหมู่ *
                        </label>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">เลือกหมวดหมู่</option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground mb-6">วันเวลาและสถานที่</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            วันที่จัดงาน *
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                              type="date"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            เวลา *
                          </label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                              type="text"
                              value={time}
                              onChange={(e) => setTime(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="เช่น 18:00 - 22:00"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          สถานที่ *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="เช่น สนามกีฬากลางขอนแก่น"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          รูปภาพประกอบ
                        </label>
                        <div className="relative">
                          <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="URL รูปภาพ หรือ https://placehold.co/400x300"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground mb-6">รายละเอียดเพิ่มเติม</h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          จำนวนผู้เข้าร่วมโดยประมาณ *
                        </label>
                        <div className="relative max-w-md">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="number"
                            value={attendees}
                            onChange={(e) => setAttendees(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="5000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          รายละเอียดเพิ่มเติม
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={6}
                          className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับงานเทศกาล/กิจกรรม..."
                        />
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground mb-6">ตรวจสอบข้อมูล</h2>
                      
                      <div className="bg-muted/30 rounded-xl p-6">
                        <h3 className="font-semibold text-foreground mb-4">สรุปข้อมูลงานเทศกาล/กิจกรรม</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">ชื่องาน:</p>
                            <p className="font-medium text-foreground">{title || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">หมวดหมู่:</p>
                            <p className="font-medium text-foreground">{category || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">วันที่:</p>
                            <p className="font-medium text-foreground">{date ? new Date(date).toLocaleDateString('th-TH') : "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">เวลา:</p>
                            <p className="font-medium text-foreground">{time || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">สถานที่:</p>
                            <p className="font-medium text-foreground">{location || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">จำนวนผู้เข้าร่วม:</p>
                            <p className="font-medium text-foreground">{attendees ? `${attendees} คน` : "-"}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-muted-foreground">รายละเอียด:</p>
                          <p className="font-medium text-foreground">{description || "-"}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    <Button 
                      onClick={step > 0 ? back : () => window.history.back()}
                      variant="outline"
                    >
                      {step > 0 ? 'ก่อนหน้า' : 'ยกเลิก'}
                    </Button>
                    
                    <div className="flex gap-3">
                      {step < steps.length - 1 ? (
                        <Button onClick={next}>
                          ถัดไป
                        </Button>
                      ) : (
                        <Button type="submit" size="lg">
                          ยืนยันการสร้างงานเทศกาล
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
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

export default CreateEvent;
