import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, FileText, Image, Tag, User } from 'lucide-react';
import React, { useState } from 'react';

const CreateBlog = () => {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [featured, setFeatured] = useState(false);
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState('');
  const [readTime, setReadTime] = useState('');


  const steps = [
    { id: 0, title: 'ข้อมูลพื้นฐาน', description: 'หัวเรื่องและรายละเอียด' },
    { id: 1, title: 'เนื้อหา/สื่อ', description: 'เนื้อหาและรูปภาพ' },
    { id: 2, title: 'ข้อมูลเมตา', description: 'ผู้เขียนและวันที่' },
    { id: 3, title: 'ตรวจสอบ', description: 'ตรวจสอบข้อมูล' }
  ];

  const categories = ['คาเฟ่', 'ร้านอาหาร', 'ท่องเที่ยว', 'วัฒนธรรม', 'ประวัติศาสตร์', 'ธรรมชาติ', 'ช้อปปิ้ง', 'บันเทิง'];

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Validate required fields only on final submission
    if (!title.trim()) {
      alert('กรุณากรอกหัวเรื่อง');
      return;
    }
    if (!excerpt.trim()) {
      alert('กรุณากรอกคำโปรย');
      return;
    }
    if (!category.trim()) {
      alert('กรุณาเลือกหมวดหมู่');
      return;
    }
    if (!author.trim()) {
      alert('กรุณากรอกชื่อผู้เขียน');
      return;
    }
    if (!date) {
      alert('กรุณาเลือกวันที่เผยแพร่');
      return;
    }
    
    if (confirm(`คุณต้องการสร้างบทความ "${title}" หรือไม่?`)) {
      alert(`บทความถูกสร้างเรียบร้อย: ${title} โดย ${author}`);
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
                  สร้างบทความใหม่
                </h1>
                <p className="text-muted-foreground text-lg">
                  แบ่งปันเรื่องราวและประสบการณ์ท่องเที่ยวในขอนแก่น
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
                          หัวเรื่อง *
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="เช่น 10 คาเฟ่น่าไปในขอนแก่นที่คุณต้องลอง"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          คำโปรย *
                        </label>
                        <textarea
                          value={excerpt}
                          onChange={(e) => setExcerpt(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          placeholder="สรุปสั้นๆ ของบทความ..."
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
                      <h2 className="text-2xl font-bold text-foreground mb-6">เนื้อหาและสื่อ</h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          เนื้อหาบทความ *
                        </label>
                        <textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          rows={8}
                          className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          placeholder="เขียนเนื้อหาบทความของคุณที่นี่..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          รูปปกบทความ
                        </label>
                        <div className="relative">
                          <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="URL รูปภาพ หรือ https://placehold.co/600x400"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={featured}
                          onChange={(e) => setFeatured(e.target.checked)}
                          className="w-4 h-4 text-primary border-border focus:ring-primary rounded"
                        />
                        <label htmlFor="featured" className="text-sm font-medium text-foreground">
                          ตั้งเป็นบทความเด่น
                        </label>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground mb-6">ข้อมูลเมตา</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            ผู้เขียน *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                              type="text"
                              value={author}
                              onChange={(e) => setAuthor(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="ชื่อผู้เขียน"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            วันที่เผยแพร่ *
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
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          เวลาอ่าน
                        </label>
                        <div className="relative max-w-md">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="text"
                            value={readTime}
                            onChange={(e) => setReadTime(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="เช่น 5 นาที"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground mb-6">ตรวจสอบข้อมูล</h2>
                      
                      <div className="bg-muted/30 rounded-xl p-6">
                        <h3 className="font-semibold text-foreground mb-4">สรุปข้อมูลบทความ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">หัวเรื่อง:</p>
                            <p className="font-medium text-foreground">{title || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">หมวดหมู่:</p>
                            <p className="font-medium text-foreground">{category || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">ผู้เขียน:</p>
                            <p className="font-medium text-foreground">{author || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">วันที่:</p>
                            <p className="font-medium text-foreground">{date ? new Date(date).toLocaleDateString('th-TH') : "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">เวลาอ่าน:</p>
                            <p className="font-medium text-foreground">{readTime || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">บทความเด่น:</p>
                            <p className="font-medium text-foreground">{featured ? "ใช่" : "ไม่"}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-muted-foreground">คำโปรย:</p>
                          <p className="font-medium text-foreground">{excerpt || "-"}</p>
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
                          ยืนยันการสร้างบทความ
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

export default CreateBlog;
