import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Clock, DollarSign, FileText, Image, MapPin, Tag } from 'lucide-react';
import React, { useState } from 'react';

// use first sample tour as prefill
const sample = {
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
};

const CreateTour = () => {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState(sample.title);
  const [description, setDescription] = useState(sample.description);
  const [duration, setDuration] = useState(sample.duration);
  const [places, setPlaces] = useState(String(sample.places));
  const [price, setPrice] = useState(String(sample.price));
  const [category, setCategory] = useState(sample.category);
  const [image, setImage] = useState(sample.image);
  const [isFeatured, setIsFeatured] = useState(sample.isFeatured);


  const steps = [
    { id: 0, title: 'ข้อมูลพื้นฐาน', description: 'ชื่อและรายละเอียดทัวร์' },
    { id: 1, title: 'โลจิสติกส์', description: 'ระยะเวลาและสถานที่' },
    { id: 2, title: 'ราคา', description: 'กำหนดราคาทัวร์' },
    { id: 3, title: 'สื่อ/ตรวจสอบ', description: 'รูปภาพและตรวจสอบ' }
  ];

  const categories = ['ธรรมชาติ', 'วัฒนธรรม', 'ประวัติศาสตร์', 'อาหาร', 'ช้อปปิ้ง', 'ผจญภัย', 'คาเฟ่', 'ท่องเที่ยวทั่วไป'];
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Validate required fields only on final submission
    if (!title.trim()) {
      alert('กรุณากรอกชื่อทัวร์');
      return;
    }
    if (!description.trim()) {
      alert('กรุณากรอกคำอธิบาย');
      return;
    }
    if (!category.trim()) {
      alert('กรุณาเลือกหมวดหมู่');
      return;
    }
    if (!duration.trim()) {
      alert('กรุณากรอกระยะเวลา');
      return;
    }
    if (!places.trim()) {
      alert('กรุณากรอกจำนวนสถานที่');
      return;
    }
    if (!price.trim()) {
      alert('กรุณากรอกราคาทัวร์');
      return;
    }
    
    if (confirm(`คุณต้องการสร้างทัวร์ "${title}" ราคา ${price} บาท หรือไม่?`)) {
      alert(`ทัวร์ถูกสร้างเรียบร้อย: ${title} - ราคา ${price} บาท`);
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
                  สร้างทัวร์ใหม่
                </h1>
                <p className="text-muted-foreground text-lg">
                  สร้างแพ็กเกจทัวร์ที่น่าสนใจในขอนแก่น
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
                          ชื่อทัวร์ *
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="เช่น ทัวร์ธรรมชาติขอนแก่น 1 วัน"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          คำอธิบาย *
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          placeholder="อธิบายรายละเอียดของทัวร์..."
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
                      <h2 className="text-2xl font-bold text-foreground mb-6">โลจิสติกส์</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            ระยะเวลา *
                          </label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                              type="text"
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="เช่น 1 วัน, 2 วัน 1 คืน"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            จำนวนสถานที่ *
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                              type="number"
                              value={places}
                              onChange={(e) => setPlaces(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="5"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground mb-6">ราคา</h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          ราคาทัวร์ (บาท) *
                        </label>
                        <div className="relative max-w-md">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="800"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          ราคาต่อคน (ไม่รวมค่าขนส่งและที่พัก)
                        </p>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground mb-6">รูปภาพและตรวจสอบ</h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          รูปภาพประกอบทัวร์
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

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={isFeatured}
                          onChange={(e) => setIsFeatured(e.target.checked)}
                          className="w-4 h-4 text-primary border-border focus:ring-primary rounded"
                        />
                        <label htmlFor="featured" className="text-sm font-medium text-foreground">
                          โปรโมททัวร์ (แสดงในหน้าแรก)
                        </label>
                      </div>

                      <div className="bg-muted/30 rounded-xl p-6">
                        <h3 className="font-semibold text-foreground mb-4">สรุปข้อมูลทัวร์</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">ชื่อทัวร์:</p>
                            <p className="font-medium text-foreground">{title || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">หมวดหมู่:</p>
                            <p className="font-medium text-foreground">{category || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">ระยะเวลา:</p>
                            <p className="font-medium text-foreground">{duration || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">จำนวนสถานที่:</p>
                            <p className="font-medium text-foreground">{places ? `${places} สถานที่` : "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">ราคา:</p>
                            <p className="font-medium text-foreground">{price ? `฿${price}` : "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">ทัวร์แนะนำ:</p>
                            <p className="font-medium text-foreground">{isFeatured ? "ใช่" : "ไม่"}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-muted-foreground">คำอธิบาย:</p>
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
                          ยืนยันการสร้างทัวร์
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

export default CreateTour;
