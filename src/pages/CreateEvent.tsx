import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Tag, Users, Image, Plus, Minus, DollarSign, Upload, X } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Empty default values for clean form experience
const sample = {
  title: '',
  date: '', // ให้ผู้ใช้เลือกวันที่เอง
  time: '',
  location: '',
  image: '',
  attendees: '',
  category: '',
};

const CreateEvent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState(sample.title);
  const [date, setDate] = useState(sample.date); // เริ่มต้นเป็นค่าว่าง
  const [time, setTime] = useState(sample.time);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('18:00');
  const [timeFormat, setTimeFormat] = useState('24'); // '12' for AM/PM, '24' for 24-hour
  const [location, setLocation] = useState(sample.location);
  const [image, setImage] = useState(sample.image);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const [category, setCategory] = useState(sample.category);
  const [attendees, setAttendees] = useState(sample.attendees);
  const [description, setDescription] = useState('');
  const [packages, setPackages] = useState([
    { id: 1, name: '', price: '', description: '' }
  ]);
  const [isFreeEvent, setIsFreeEvent] = useState(false);


  const steps = [
    { id: 0, title: 'ข้อมูลพื้นฐาน', description: 'ชื่อและรายละเอียดเทศกาล' },
    { id: 1, title: 'วันเวลาและสถานที่', description: 'กำหนดการและพิกัด' },
    { id: 2, title: 'รายละเอียด', description: 'ข้อมูลเพิ่มเติม' },
    { id: 3, title: 'ตรวจสอบ', description: 'ตรวจสอบข้อมูล' }
  ];

  const categories = ['เทศกาล', 'คอนเสิร์ต', 'นิทรรศการ', 'กีฬา', 'การกุศล', 'ธุรกิจ', 'การประชุม', 'อบรม'];
  
  // ฟังก์ชันตรวจสอบความครบถ้วนของข้อมูลในแต่ละ step
  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 0: // ข้อมูลพื้นฐาน
        return title.trim() !== '' && description.trim() !== '' && category !== '';
      
      case 1: // วันเวลาและสถานที่
        return date !== '' && time.trim() !== '' && location.trim() !== '';
      
      case 2: // รายละเอียด
        const hasValidAttendees = attendees !== '' && parseInt(attendees) > 0;
        const hasValidPackages = isFreeEvent || packages.some(pkg => 
          pkg.name.trim() !== '' && pkg.price !== '' && pkg.description.trim() !== ''
        );
        return hasValidAttendees && hasValidPackages;
      
      default:
        return true;
    }
  };
  
  // ฟังก์ชันสำหรับข้อความ error ของแต่ละ step
  const getStepErrorMessage = (stepNumber) => {
    switch (stepNumber) {
      case 0:
        const missingBasic = [];
        if (title.trim() === '') missingBasic.push('ชื่องาน');
        if (description.trim() === '') missingBasic.push('รายละเอียด');
        if (category === '') missingBasic.push('หมวดหมู่');
        return `กรุณากรอกข้อมูลต่อไปนี้ให้ครบถ้วน: ${missingBasic.join(', ')}`;
      
      case 1:
        const missingDateTime = [];
        if (date === '') missingDateTime.push('วันที่');
        if (time.trim() === '') missingDateTime.push('เวลา');
        if (location.trim() === '') missingDateTime.push('สถานที่');
        return `กรุณากรอกข้อมูลต่อไปนี้ให้ครบถ้วน: ${missingDateTime.join(', ')}`;
      
      case 2:
        const missingDetails = [];
        if (attendees === '' || parseInt(attendees) <= 0) missingDetails.push('จำนวนผู้เข้าร่วม');
        if (!isFreeEvent && !packages.some(pkg => pkg.name.trim() !== '' && pkg.price !== '' && pkg.description.trim() !== '')) {
          missingDetails.push('ข้อมูลแพ็คเกจ');
        }
        return `กรุณากรอกข้อมูลต่อไปนี้ให้ครบถ้วน: ${missingDetails.join(', ')}`;
      
      default:
        return '';
    }
  };
  
  const next = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, steps.length - 1));
    } else {
      alert(getStepErrorMessage(step));
    }
  };
  
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const saveEventAndRedirect = () => {
    // สร้าง event object เพื่อบันทึก
    const newEvent = {
      id: Date.now(), // ใช้ timestamp เป็น unique ID
      title,
      date,
      time,
      location,
      image: image || 'https://placehold.co/400x300',
      attendees: parseInt(attendees) || 0,
      category,
      description,
      packages: isFreeEvent ? [] : packages,
      isFreeEvent,
      isRegistered: false,
      createdBy: 'user@example.com', // อาจจะเปลี่ยนเป็น user จริงในอนาคต
      createdAt: new Date().toISOString()
    };
    
    // ดึงข้อมูลเก่าจาก localStorage
    const existingEvents = JSON.parse(localStorage.getItem('khonKaenEvents') || '[]');
    const updatedEvents = [newEvent, ...existingEvents];
    localStorage.setItem('khonKaenEvents', JSON.stringify(updatedEvents));
    
    // Event created successfully - redirect to events page
    console.log(`งานเทศกาลถูกสร้างเรียบร้อย: ${title} วันที่ ${date}`);
    
    // ไปยังหน้า Events
    navigate('/events');
  };

  const formatTime12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12.toString().padStart(2, '0')}:${minutes}${period}`;
  };

  const handleTimeSelection = () => {
    if (timeFormat === '12') {
      const formattedStartTime = formatTime12Hour(startTime);
      const formattedEndTime = formatTime12Hour(endTime);
      setTime(`${formattedStartTime} - ${formattedEndTime}`);
    } else {
      setTime(`${startTime} - ${endTime}`);
    }
    setShowTimePicker(false);
  };

  const addPackage = () => {
    const newId = Math.max(...packages.map(p => p.id)) + 1;
    setPackages([...packages, {
      id: newId,
      name: '',
      price: '',
      description: ''
    }]);
  };

  const removePackage = (id: number) => {
    if (packages.length > 1) {
      setPackages(packages.filter(p => p.id !== id));
    }
  };

  const updatePackage = (id: number, field: string, value: string) => {
    setPackages(packages.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const formatPrice = (price: string) => {
    if (!price || price === '0') {
      return 'Free';
    }
    return `${price} บาท`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ตรวจสอบประเภทไฟล์
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }
      
      // ตรวจสอบขนาดไฟล์ (จำกัดที่ 5MB)
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
    // ฟังก์ชันนี้ใช้สำหรับ form submission แต่ไม่ได้ใช้สร้าง event
    // การสร้าง event จะใช้ saveEventAndRedirect ใน step 4 แทน
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
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 ${
                              title.trim() === '' ? 'border-red-300 focus:ring-red-500' : 'border-border focus:ring-primary'
                            }`}
                            placeholder="ใส่ชื่องานเทศกาล/กิจกรรม"
                          />
                        </div>
                        {title.trim() === '' && (
                          <p className="text-red-500 text-xs mt-1">กรุณากรอกชื่องานเทศกาล/กิจกรรม</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          รายละเอียด *
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={4}
                          className={`w-full px-4 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 resize-none ${
                            description.trim() === '' ? 'border-red-300 focus:ring-red-500' : 'border-border focus:ring-primary'
                          }`}
                          placeholder="อธิบายรายละเอียดของงานเทศกาล/กิจกรรม..."
                        />
                        {description.trim() === '' && (
                          <p className="text-red-500 text-xs mt-1">กรุณากรอกรายละเอียดของงาน</p>
                        )}
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
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 ${
                              category === '' ? 'border-red-300 focus:ring-red-500' : 'border-border focus:ring-primary'
                            }`}
                          >
                            <option value="">เลือกหมวดหมู่</option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        {category === '' && (
                          <p className="text-red-500 text-xs mt-1">กรุณาเลือกหมวดหมู่</p>
                        )}
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
                              className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 ${
                                date === '' ? 'border-red-300 focus:ring-red-500' : 'border-border focus:ring-primary'
                              }`}
                            />
                          </div>
                          {date === '' && (
                            <p className="text-red-500 text-xs mt-1">กรุณาเลือกวันที่จัดงาน</p>
                          )}
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
                              className={`w-full pl-10 pr-12 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 ${
                                time.trim() === '' ? 'border-red-300 focus:ring-red-500' : 'border-border focus:ring-primary'
                              }`}
                              placeholder="เช่น 18:00 - 22:00"
                            />
                            <button
                              type="button"
                              onClick={() => setShowTimePicker(!showTimePicker)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              <Clock className="w-5 h-5" />
                            </button>
                          </div>
                          {time.trim() === '' && (
                            <p className="text-red-500 text-xs mt-1">กรุณากรอกเวลาจัดงาน</p>
                          )}
                          
                          {showTimePicker && (
                            <div className="mt-4 p-4 border border-border rounded-xl bg-card">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-foreground">กำหนดเวลา</h4>
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setTimeFormat('24')}
                                      className={`px-3 py-1 text-xs rounded ${timeFormat === '24' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                                    >
                                      24ชม.
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setTimeFormat('12')}
                                      className={`px-3 py-1 text-xs rounded ${timeFormat === '12' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                                    >
                                      AM/PM
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm text-muted-foreground mb-1">เวลาเริ่มต้น</label>
                                    <input
                                      type="time"
                                      value={startTime}
                                      onChange={(e) => setStartTime(e.target.value)}
                                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm text-muted-foreground mb-1">เวลาสิ้นสุด</label>
                                    <input
                                      type="time"
                                      value={endTime}
                                      onChange={(e) => setEndTime(e.target.value)}
                                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                  </div>
                                </div>
                                
                                <div className="flex gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => setShowTimePicker(false)}
                                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                                  >
                                    ยกเลิก
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleTimeSelection}
                                    className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                                  >
                                    ตกลง
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
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
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 ${
                              location.trim() === '' ? 'border-red-300 focus:ring-red-500' : 'border-border focus:ring-primary'
                            }`}
                            placeholder="ใส่ชื่อสถานที่จัดงาน"
                          />
                        </div>
                        {location.trim() === '' && (
                          <p className="text-red-500 text-xs mt-1">กรุณากรอกสถานที่จัดงาน</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          รูปภาพประกอบ
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
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 ${
                              (attendees === '' || parseInt(attendees) <= 0) ? 'border-red-300 focus:ring-red-500' : 'border-border focus:ring-primary'
                            }`}
                            placeholder="5000"
                            min="1"
                          />
                        </div>
                        {(attendees === '' || parseInt(attendees) <= 0) && (
                          <p className="text-red-500 text-xs mt-1">กรุณากรอกจำนวนผู้เข้าร่วม (ต้องมากกว่า 0)</p>
                        )}
                      </div>

                      {/* ค่าเข้าร่วมและแพ็คเกจ */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <label className="block text-sm font-medium text-foreground">
                            ค่าเข้าร่วมและแพ็คเกจ *
                          </label>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={isFreeEvent}
                                onChange={(e) => setIsFreeEvent(e.target.checked)}
                                className="w-4 h-4 text-primary"
                              />
                              เข้าร่วมฟรี
                            </label>
                          </div>
                        </div>

                        {!isFreeEvent && (
                          <div className="space-y-4">
                            {!packages.some(pkg => pkg.name.trim() !== '' && pkg.price !== '' && pkg.description.trim() !== '') && (
                              <p className="text-red-500 text-sm mb-2">กรุณากรอกข้อมูลแพ็คเกจอย่างน้อย 1 แพ็คเกจให้ครบถ้วน</p>
                            )}
                            {packages.map((pkg, index) => (
                              <div key={pkg.id} className="border border-border rounded-xl p-4 bg-muted/30">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-semibold text-foreground">แพ็คเกจที่ {index + 1}</h4>
                                  {packages.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removePackage(pkg.id)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-sm text-muted-foreground mb-1">ชื่อแพ็คเกจ *</label>
                                    <input
                                      type="text"
                                      value={pkg.name}
                                      onChange={(e) => updatePackage(pkg.id, 'name', e.target.value)}
                                      className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 ${
                                        pkg.name.trim() === '' ? 'border-red-300 focus:ring-red-500' : 'border-border focus:ring-primary'
                                      }`}
                                      placeholder="เช่น แพ็คเกจทั่วไป"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm text-muted-foreground mb-1">ราคา (บาท) *</label>
                                    <div className="relative">
                                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                      <input
                                        type="number"
                                        value={pkg.price}
                                        onChange={(e) => updatePackage(pkg.id, 'price', e.target.value)}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 ${
                                          pkg.price === '' ? 'border-red-300 focus:ring-red-500' : 'border-border focus:ring-primary'
                                        }`}
                                        placeholder="100"
                                        min="0"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm text-muted-foreground mb-1">คำอธิบายสั้น *</label>
                                    <input
                                      type="text"
                                      value={pkg.description}
                                      onChange={(e) => updatePackage(pkg.id, 'description', e.target.value)}
                                      className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 ${
                                        pkg.description.trim() === '' ? 'border-red-300 focus:ring-red-500' : 'border-border focus:ring-primary'
                                      }`}
                                      placeholder="รายละเอียดแพ็คเกจ"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            <button
                              type="button"
                              onClick={addPackage}
                              className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-foreground transition-colors flex items-center justify-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              เพิ่มแพ็คเกจใหม่
                            </button>
                          </div>
                        )}
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
                          <div>
                            <p className="text-muted-foreground">ค่าเข้าร่วม:</p>
                            <p className="font-medium text-foreground">
                              {isFreeEvent ? 'เข้าร่วมฟรี' : `${packages.length} แพ็คเกจ`}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-muted-foreground">รายละเอียด:</p>
                          <p className="font-medium text-foreground">{description || "-"}</p>
                        </div>
                        
                        {!isFreeEvent && packages.length > 0 && (
                          <div className="mt-4">
                            <p className="text-muted-foreground mb-2">แพ็คเกจค่าเข้าร่วม:</p>
                            <div className="space-y-2">
                              {packages.map((pkg, index) => (
                                <div key={pkg.id} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                                  <span className="font-medium">{pkg.name || `แพ็คเกจที่ ${index + 1}`}</span>
                                  <span className={`font-semibold ${pkg.price === '0' || !pkg.price ? 'text-green-600' : 'text-primary'}`}>
                                    {formatPrice(pkg.price)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
                    
                    <div className="flex flex-col items-end gap-2">
                      {step < steps.length - 1 && !validateStep(step) && (
                        <p className="text-red-500 text-xs text-right max-w-md">
                          {getStepErrorMessage(step)}
                        </p>
                      )}
                      <div className="flex gap-3">
                        {step < steps.length - 1 ? (
                          <Button 
                            onClick={next}
                            disabled={!validateStep(step)}
                            className={!validateStep(step) ? 'opacity-50 cursor-not-allowed' : ''}
                          >
                            ถัดไป
                          </Button>
                        ) : (
                          <Button 
                            onClick={saveEventAndRedirect} 
                            size="lg"
                            disabled={!validateStep(0) || !validateStep(1) || !validateStep(2)}
                            className={(!validateStep(0) || !validateStep(1) || !validateStep(2)) ? 'opacity-50 cursor-not-allowed' : ''}
                          >
                            ยืนยันการสร้างงานเทศกาล
                          </Button>
                        )}
                      </div>
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
