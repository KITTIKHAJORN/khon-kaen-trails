import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, FileText, Image, Tag, User, Upload, X } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Prefill using the first sample from Blog.tsx
const sample = {
  title: '10 คาเฟ่น่าไปในขอนแก่นที่คุณต้องลอง',
  excerpt: 'ค้นพบคาเฟ่ที่มีบรรยากาศดีและกาแฟรสเลิศในเมืองขอนแก่น',
  author: 'นักท่องเที่ยวขอนแก่น',
  date: getCurrentDate(),
  category: 'คาเฟ่',
  image: 'https://placehold.co/600x400',
  featured: true,
};

const CreateBlog = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState(sample.title);
  const [excerpt, setExcerpt] = useState(sample.excerpt);
  const [content, setContent] = useState('เริ่มเขียนเนื้อหาของบทความที่นี่...');
  const [category, setCategory] = useState(sample.category);
  const [image, setImage] = useState(sample.image);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const [featured, setFeatured] = useState(sample.featured);
  const [author, setAuthor] = useState(sample.author);
  const [date, setDate] = useState(getCurrentDate());


  const steps = [
    { id: 0, title: 'ข้อมูลพื้นฐาน', description: 'หัวเรื่องและรายละเอียด' },
    { id: 1, title: 'เนื้อหา/สื่อ', description: 'เนื้อหาและรูปภาพ' },
    { id: 2, title: 'ข้อมูลส่วนตัว', description: 'ผู้เขียนและวันที่' },
    { id: 3, title: 'ตรวจสอบ', description: 'ตรวจสอบข้อมูล' }
  ];

  const categories = ['คาเฟ่', 'ร้านอาหาร', 'ท่องเที่ยว', 'วัฒนธรรม', 'ประวัติศาสตร์', 'ธรรมชาติ', 'ช้อปปิ้ง', 'บันเทิง'];

  const next = () => {
    console.log('Moving to next step, current step:', step);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  
  const back = () => {
    console.log('Moving to previous step, current step:', step);
    setStep((s) => Math.max(s - 1, 0));
  };

  const goToStep = (stepIndex: number) => {
    console.log('Jumping to step:', stepIndex);
    setStep(stepIndex);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setImage(base64String);
        setImagePreview(base64String);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage('');
    setImagePreview('');
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    console.log('Starting form submission...');
    
    // Validate required fields only on final submission
    if (!title.trim()) {
      console.log('Validation failed: title missing');
      return;
    }
    if (!excerpt.trim()) {
      console.log('Validation failed: excerpt missing');
      return;
    }
    if (!category.trim()) {
      console.log('Validation failed: category missing');
      return;
    }
    if (!author.trim()) {
      console.log('Validation failed: author missing');
      return;
    }
    if (!date) {
      console.log('Validation failed: date missing');
      return;
    }
    
    console.log('All validations passed, saving blog post...');
    
    // Create blog post object
    const newBlogPost = {
      id: Date.now(), // Simple ID generation
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      author: author.trim(),
      date,
      category: category.trim(),
      image: image.trim() || 'https://placehold.co/600x400',
      featured,
      createdBy: 'user', // Mark as user-created
      createdAt: new Date().toISOString()
    };
    
    try {
      // Get existing blog posts from localStorage
      const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      
      // Add new post to the beginning of the array
      const updatedPosts = [newBlogPost, ...existingPosts];
      
      // Save back to localStorage
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      
      console.log('Blog post saved successfully:', newBlogPost);
      console.log('Navigating to blog page...');
      
      // Navigate to blog page
      navigate('/blog');
    } catch (error) {
      console.error('Error saving blog post:', error);
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
                      <button
                        onClick={() => goToStep(s.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors hover:scale-105 ${
                          step >= s.id 
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {s.id + 1}
                      </button>
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
                        
                        {/* Image Preview */}
                        {(imagePreview || image) && (
                          <div className="mb-4 relative inline-block">
                            <img 
                              src={imagePreview || image} 
                              alt="Preview" 
                              className="w-32 h-32 object-cover rounded-xl border border-border"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        
                        {/* Upload Section */}
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="flex items-center gap-2 px-4 py-3 border border-border rounded-xl bg-background text-foreground hover:bg-muted transition-colors"
                            >
                              <Upload className="w-5 h-5" />
                              อัปโหลดรูปภาพ
                            </button>
                            
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            ประเภทไฟล์ที่รองรับ: JPG, PNG, GIF (ขนาดไม่เกิน 5MB)
                          </div>
                          
                          <div className="relative">
                            <span className="text-sm text-muted-foreground">หรือใส่ URL รูปภาพ:</span>
                            <div className="relative mt-1">
                              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                              <input
                                type="text"
                                value={!imagePreview ? image : ''}
                                onChange={(e) => {
                                  setImage(e.target.value);
                                  setImagePreview('');
                                  setImageFile(null);
                                }}
                                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="https://example.com/image.jpg"
                                disabled={!!imagePreview}
                              />
                            </div>
                          </div>
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
                      <h2 className="text-2xl font-bold text-foreground mb-6">ข้อมูลส่วนตัว</h2>
                      
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
                      type="button"
                      onClick={step > 0 ? back : () => window.history.back()}
                      variant="outline"
                    >
                      {step > 0 ? 'ก่อนหน้า' : 'ยกเลิก'}
                    </Button>
                    
                    <div className="flex gap-3">
                      {step < steps.length - 1 ? (
                        <Button type="button" onClick={next}>
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
