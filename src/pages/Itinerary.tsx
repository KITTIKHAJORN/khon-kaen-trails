import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Clock, MapPin, Plus, Tag, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const Itinerary = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('plan');
  const [publicEditorTrip, setPublicEditorTrip] = useState<any | null>(null);
  const [step, setStep] = useState(0);

  // Saved trips state
  const [savedTrips, setSavedTrips] = useState(() => {
    try {
      const raw = localStorage.getItem('saved-trips');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  // trip currently being viewed in details modal
  const [viewingTrip, setViewingTrip] = useState<any | null>(null);

  // check URL for shared trip payload (base64 JSON in ?shared=)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const shared = params.get('shared');
      if (shared) {
        try {
          const json = atob(shared);
          const trip = JSON.parse(json);
          setViewingTrip(trip);
          setActiveTab('mytrips');
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Detailed itinerary state
  type Stop = {
    id: number;
    placeId: number | null;
    name: string;
    kind?: 'place' | 'lunch' | 'break' | 'rest';
    startTime?: string;
    endTime?: string;
    durationMinutes?: number; // legacy / fallback
    notes?: string;
  };

  // Trip dates and day-based stops
  const [startDate, setStartDate] = useState<string | undefined>(() => {
    try {
      return localStorage.getItem('itinerary-startDate') || undefined;
    } catch (e) {
      return undefined;
    }
  });
  const [endDate, setEndDate] = useState<string | undefined>(() => {
    try {
      return localStorage.getItem('itinerary-endDate') || undefined;
    } catch (e) {
      return undefined;
    }
  });

  // store stops per-day using an object keyed by ISO date string
  const [stopsByDay, setStopsByDay] = useState<Record<string, Stop[]>>(() => {
    try {
      const raw = localStorage.getItem('itinerary-stopsByDay');
      return raw ? (JSON.parse(raw) as Record<string, Stop[]>) : {};
    } catch (e) {
      return {};
    }
  });

  const [currentDay, setCurrentDay] = useState<string | undefined>(() => startDate);

  // place filter
  const [placeQuery, setPlaceQuery] = useState('');

  // trip info
  const [tripName, setTripName] = useState('');
  const [participants, setParticipants] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  // save trip function
  const saveTrip = () => {
    if (!tripName.trim() || !startDate || !endDate) {
      alert('กรุณากรอกชื่อทริป วันเริ่มต้น และวันสิ้นสุด');
      return;
    }
    
    const tripData = {
      name: tripName.trim(),
      participants: participants ? parseInt(participants) : undefined,
      startDate,
      endDate,
      stopsByDay,
      selectedHotels,
      isPublic: isPublic || false,
      createdAt: new Date().toISOString()
    };
    
    const newTrips = [...savedTrips, tripData];
    setSavedTrips(newTrips);
    localStorage.setItem('saved-trips', JSON.stringify(newTrips));
    alert('บันทึกทริปเรียบร้อยแล้ว!');
    // after saving, go to My Trips and reset the planning form & localStorage keys
    setActiveTab('mytrips');
    setStep(0);
    // clear form state
    setTripName('');
    setParticipants('');
    setStartDate(undefined);
    setEndDate(undefined);
    setStopsByDay({});
    setSelectedHotels({});
    setCurrentDay(undefined);
    try {
      localStorage.removeItem('itinerary-startDate');
      localStorage.removeItem('itinerary-endDate');
      localStorage.removeItem('itinerary-stopsByDay');
      localStorage.removeItem('itinerary-selectedHotels');
    } catch (e) {
      // ignore
    }
    // reset public flag
    setIsPublic(false);
  };

  useEffect(() => {
    try {
      localStorage.setItem('itinerary-startDate', startDate || '');
      localStorage.setItem('itinerary-endDate', endDate || '');
      localStorage.setItem('itinerary-stopsByDay', JSON.stringify(stopsByDay));
    } catch (e) {
      // ignore
    }
  }, [startDate, endDate, stopsByDay]);

  // helper to get stops array for the currently selected day
  const currentStops: Stop[] = currentDay ? (stopsByDay[currentDay] || []) : [];

  // validation helpers
  const validateStep0 = () => {
    if (!tripName.trim()) {
      alert('กรุณากรอกชื่อทริป');
      return false;
    }
    if (!startDate || !endDate) {
      alert('กรุณากรอกวันเริ่มต้นและวันสิ้นสุด');
      return false;
    }
    try {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (s > e) {
        alert('วันเริ่มต้นต้องไม่มากกว่าวันสิ้นสุด');
        return false;
      }
    } catch (e) {
      alert('วันที่ไม่ถูกต้อง');
      return false;
    }
    return true;
  };

  const validateStep1 = () => {
    const totalStops = Object.values(stopsByDay).reduce((sum, arr) => sum + arr.length, 0);
    if (totalStops === 0) {
      alert('โปรดเพิ่มสถานที่อย่างน้อยหนึ่งแห่งก่อนดำเนินการต่อ');
      return false;
    }
    return true;
  };

  // helper to update stops for current day
  const setCurrentStops = (updater: ((s: Stop[]) => Stop[]) | Stop[]) => {
    if (!currentDay) return;
    setStopsByDay(prev => ({ ...prev, [currentDay]: typeof updater === 'function' ? (updater as (s: Stop[]) => Stop[])(prev[currentDay] || []) : updater }));
  };

  // helpers for duration calculations & formatting
  const formatMinutes = (mins: number) => {
    if (!mins || mins <= 0) return '0 น.';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h} ชม ${m} น.` : `${m} น.`;
  };

  const computeEndTime = (start?: string, duration?: number) => {
    if (!start || !duration) return undefined;
    const parts = start.split(':').map(p => Number(p));
    if (parts.length !== 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) return undefined;
    const now = new Date();
    now.setHours(parts[0], parts[1], 0, 0);
    now.setMinutes(now.getMinutes() + (duration || 0));
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  // compute duration in minutes for a stop: prefer explicit duration, else compute from startTime/endTime
  const getStopDurationMinutes = (s: Stop) => {
    if (typeof s.durationMinutes === 'number' && !Number.isNaN(s.durationMinutes)) return s.durationMinutes;
    if (s.startTime && s.endTime) {
      const [sh, sm] = s.startTime.split(':').map(Number);
      const [eh, em] = s.endTime.split(':').map(Number);
      if ([sh, sm, eh, em].some(v => Number.isNaN(v))) return 0;
      const start = sh * 60 + sm;
      const end = eh * 60 + em;
      // if end < start, assume same-day wrap not allowed — treat as 0 or compute positive via next day
      return Math.max(0, end - start);
    }
    return 0;
  };

  // compute a stop's endTime string (HH:MM) if available, either from endTime or by using startTime+duration
  const computeStopEndTime = (s?: Stop) => {
    if (!s) return undefined;
    if (s.endTime) return s.endTime;
    if (s.startTime) {
      const dur = typeof s.durationMinutes === 'number' && !Number.isNaN(s.durationMinutes) ? s.durationMinutes : getDefaultDurationForStopKind(s.kind);
      return computeEndTime(s.startTime, dur);
    }
    return undefined;
  };

  const totalDurationForStops = (stops: Stop[]) => stops.reduce((sum, s) => sum + getStopDurationMinutes(s), 0);

  const totalDurationAllDays = Object.values(stopsByDay).reduce((sum, arr) => sum + totalDurationForStops(arr), 0);

  // Sample data for places
  const places = [
    { id: 1, name: 'อุทยานแห่งชาติภูผาแดง', category: 'ธรรมชาติ' },
    { id: 2, name: 'วัดพระธาตุขามแก่น', category: 'วัดวาอาราม' },
    { id: 3, name: 'ตลาดหนองบัว', category: 'แหล่งช้อปปิ้ง' },
    { id: 4, name: 'สวนสาธารณะแก่นนคร', category: 'ธรรมชาติ' },
    { id: 5, name: 'พิพิธภัณฑ์ขอนแก่น', category: 'แหล่งช้อปปิ้ง' },
  ];

  // Sample data for hotels with availability ranges (inclusive)
  type Hotel = { id: number; name: string; rating?: number; availableFrom: string; availableTo: string };
  const hotels: Hotel[] = [
    { id: 1, name: 'โรงแรมขอนแก่นเซ็นเตอร์', rating: 4.3, availableFrom: '2025-01-01', availableTo: '2026-12-31' },
    { id: 2, name: 'The Riverside Khon Kaen', rating: 4.6, availableFrom: '2025-06-01', availableTo: '2025-12-31' },
    { id: 3, name: 'Boutique Stay Khon Kaen', rating: 4.1, availableFrom: '2025-09-10', availableTo: '2025-09-20' },
  ];

  // Activity definitions (labels and default durations in minutes)
  const ACTIVITY_DEFS: { key: Stop['kind']; label: string; defaultMinutes: number }[] = [
    { key: 'lunch', label: 'พักเที่ยง', defaultMinutes: 60 },
    { key: 'break', label: 'พักเบรค', defaultMinutes: 15 },
    { key: 'rest', label: 'พักผ่อน', defaultMinutes: 30 },
  ];

  const getDefaultDurationForStopKind = (kind?: Stop['kind']) => {
    if (!kind || kind === 'place') return 60; // default for places: 60 minutes
    const def = ACTIVITY_DEFS.find(a => a.key === kind);
    return def ? def.defaultMinutes : 30;
  };

  // selected hotels per day (keyed by ISO date) - stores hotel id or undefined
  const [selectedHotels, setSelectedHotels] = useState<Record<string, number | undefined>>(() => {
    try {
      const raw = localStorage.getItem('itinerary-selectedHotels');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });

  // keep selectedHotels persisted when it changes
  useEffect(() => {
    try {
      localStorage.setItem('itinerary-selectedHotels', JSON.stringify(selectedHotels));
    } catch (e) {
      // ignore
    }
  }, [selectedHotels]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  วางแผนทริป
                </h1>
                <p className="text-muted-foreground text-lg">
                  สร้างทริปของคุณเองหรือดูทริปที่บันทึกไว้
                </p>
              </div>

              {/* Tabs */}
              <div className="flex justify-center mb-8">
                <div className="bg-muted p-1 rounded-xl">
                  <button
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      activeTab === 'plan'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('plan')}
                  >
                    วางแผนทริปเอง
                  </button>
                  <button
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      activeTab === 'mytrips'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('mytrips')}
                  >
                    ทริปของฉัน
                  </button>
                  <button
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      activeTab === 'public'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('public')}
                  >
                    ทริปสาธารณะ
                  </button>
                </div>
              </div>

              {activeTab === 'mytrips' && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">ทริปที่บันทึกไว้</h2>
                    <p className="text-muted-foreground">จัดการและแก้ไขทริปของคุณ</p>
                  </div>

                  {savedTrips.length === 0 ? (
                    <div className="bg-card rounded-2xl p-12 shadow-card text-center">
                      <div className="bg-muted/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                        <MapPin className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">ยังไม่มีทริปที่บันทึกไว้</h3>
                      <p className="text-muted-foreground mb-6">เริ่มวางแผนทริปแรกของคุณกันเถอะ</p>
                      <Button onClick={() => setActiveTab('plan')} size="lg">วางแผนทริปใหม่</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedTrips.map((trip: any, index: number) => (
                        <div key={index} className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-lg transition-all">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-foreground">{trip.name || `ทริป ${index + 1}`}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newTrips = savedTrips.filter((_: any, i: number) => i !== index);
                                setSavedTrips(newTrips);
                                localStorage.setItem('saved-trips', JSON.stringify(newTrips));
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-3 text-sm mb-6">
                            {trip.startDate && trip.endDate && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(trip.startDate).toLocaleDateString('th-TH')} - {new Date(trip.endDate).toLocaleDateString('th-TH')}</span>
                              </div>
                            )}
                            {trip.participants && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{trip.participants} คน</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{Object.keys(trip.stopsByDay || {}).length} วัน</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              className="flex-1"
                              onClick={() => {
                                setTripName(trip.name || '');
                                setParticipants(trip.participants ? String(trip.participants) : '');
                                setStartDate(trip.startDate);
                                setEndDate(trip.endDate);
                                setStopsByDay(trip.stopsByDay || {});
                                  setSelectedHotels(trip.selectedHotels || {});
                                  setCurrentDay(trip.startDate);
                                  setIsPublic(!!trip.isPublic);
                                  // if there's publicMeta, keep it; editing will save publicMeta later
                                  // no separate state required for publicMeta here
                                setActiveTab('plan');
                              }}
                            >
                              แก้ไขทริป
                            </Button>
                            <Button className="flex-1" variant="outline" onClick={() => setViewingTrip(trip)}>ดูรายละเอียด</Button>
                            {trip.isPublic && (
                              <Button className="flex-1" variant="ghost" onClick={() => {
                                try {
                                  const json = JSON.stringify(trip);
                                  const encoded = btoa(json);
                                  const url = `${window.location.origin}${window.location.pathname}?shared=${encoded}`;
                                  navigator.clipboard.writeText(url);
                                  alert('คัดลอกลิงก์แชร์เรียบร้อยแล้ว');
                                } catch (e) {
                                  alert('ไม่สามารถสร้างลิงก์แชร์ได้');
                                }
                              }}>คัดลอกลิงก์แชร์</Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'public' && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">ทริปสาธารณะ</h2>
                    <p className="text-muted-foreground">รายการทริปที่เผยแพร่ให้ผู้อื่นดู</p>
                  </div>

                  {savedTrips.filter((t: any) => t.isPublic).length === 0 ? (
                    <div className="bg-card rounded-2xl p-12 shadow-card text-center">
                      <div className="bg-muted/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                        <MapPin className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">ยังไม่มีทริปสาธารณะ</h3>
                      <p className="text-muted-foreground mb-6">คุณยังไม่ได้เผยแพร่ทริปใดๆ</p>
                      <Button onClick={() => setActiveTab('plan')} size="lg">สร้างทริปใหม่</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedTrips.filter((t: any) => t.isPublic).map((trip: any, index: number) => (
                        <div key={index} className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-lg transition-all">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-foreground">{trip.name || `ทริป ${index + 1}`}</h3>
                          </div>
                          <div className="text-sm text-muted-foreground mb-4">{trip.startDate ? `${new Date(trip.startDate).toLocaleDateString('th-TH')} - ${new Date(trip.endDate).toLocaleDateString('th-TH')}` : ''}</div>
                          <div className="mb-4 text-sm">
                            <p className="text-muted-foreground">รายละเอียดสาธารณะ:</p>
                            <p className="text-foreground">{trip.publicMeta?.description || <span className="text-muted-foreground">(ยังไม่มี)</span>}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1" onClick={() => setViewingTrip(trip)}>ดูรายละเอียด</Button>
                            <Button className="flex-1" variant="outline" onClick={() => setPublicEditorTrip(trip)}>แก้ไขข้อมูลสาธารณะ</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'plan' && (
                <div>
                  {/* Progress Steps */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${(step / 2) * 100}%` }}
                        />
                      </div>
                      {[
                        { id: 0, title: 'ข้อมูลพื้นฐาน', description: 'ชื่อทริปและรายละเอียด' },
                        { id: 1, title: 'เลือกสถานที่', description: 'เพิ่มสถานที่ท่องเที่ยว' },
                        { id: 2, title: 'ตรวจสอบ', description: 'ตรวจสอบและบันทึก' }
                      ].map((s) => (
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
                    {step === 0 && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground mb-6">ข้อมูลพื้นฐาน</h2>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">ชื่อทริป *</label>
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                              type="text"
                              value={tripName}
                              onChange={(e) => setTripName(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="เช่น ทริปขอนแก่น 3 วัน 2 คืน"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">จำนวนผู้เข้าร่วม</label>
                          <div className="relative max-w-md">
                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                              type="number"
                              value={participants}
                              onChange={(e) => setParticipants(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="4"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">วันเริ่มต้น *</label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                              <input
                                type="date"
                                value={startDate || ''}
                                onChange={(e) => {
                                  const v = e.target.value || undefined;
                                  setStartDate(v);
                                  if (v && !currentDay) setCurrentDay(v);
                                }}
                                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">วันสิ้นสุด *</label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                              <input
                                type="date"
                                value={endDate || ''}
                                onChange={(e) => setEndDate(e.target.value || undefined)}
                                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-foreground mb-2">ความเป็นส่วนตัว</label>
                          <div className="flex items-center gap-4">
                            <label className="inline-flex items-center gap-2">
                              <input type="radio" name="privacy" checked={!isPublic} onChange={() => setIsPublic(false)} />
                              <span className="text-sm">เฉพาะฉัน</span>
                            </label>
                            <label className="inline-flex items-center gap-2">
                              <input type="radio" name="privacy" checked={isPublic} onChange={() => setIsPublic(true)} />
                              <span className="text-sm">สาธารณะ</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 1 && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground mb-6">เลือกสถานที่และจัดแผน</h2>
                        
                        {/* Day picker */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-foreground mb-2">เลือกวัน</label>
                          <div className="flex items-center space-x-2 overflow-auto">
                            {(() => {
                              if (!startDate || !endDate) return (
                                <div className="text-sm text-muted-foreground bg-muted/30 rounded-xl p-4">ตั้งค่าวันเริ่มต้นและวันสิ้นสุดในขั้นตอนก่อนหน้าเพื่อแบ่งแผนเป็นรายวัน</div>
                              );
                              const s = new Date(startDate);
                              const e = new Date(endDate);
                              const days: string[] = [];
                              for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
                                days.push(new Date(d).toISOString().slice(0,10));
                              }
                              return days.map(d => (
                                <button key={d} onClick={() => setCurrentDay(d)} className={`px-4 py-2 rounded-xl font-medium transition-colors ${currentDay === d ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                                  {new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                                </button>
                              ));
                            })()}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Selected Places */}
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-medium text-foreground">สถานที่ที่เลือก</h3>
                              <span className="text-sm text-muted-foreground">{currentStops.length} สถานที่</span>
                            </div>

                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {currentStops.length === 0 && (
                                <div className="text-sm text-muted-foreground bg-muted/30 rounded-xl p-4 text-center">ยังไม่มีสถานที่ในแผนของคุณ<br/>เพิ่มจากรายการด้านขวา</div>
                              )}

                              {currentStops.map((stop, idx) => (
                                <div key={stop.id} className="bg-muted/30 rounded-xl p-4">
                                  <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-start">
                                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                        <MapPin className="h-5 w-5 text-primary" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-foreground">{stop.name || 'เลือกสถานที่'}</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {stop.kind && stop.kind !== 'place' ? ACTIVITY_DEFS.find(a => a.key === stop.kind)?.label : places.find(p => p.id === stop.placeId)?.category}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center space-x-1">
                                      <Button size="sm" variant="ghost" onClick={() => {
                                        if (idx === 0) return;
                                        const copy = [...currentStops];
                                        [copy[idx-1], copy[idx]] = [copy[idx], copy[idx-1]];
                                        setCurrentStops(copy);
                                      }}>↑</Button>
                                      <Button size="sm" variant="ghost" onClick={() => {
                                        if (idx === currentStops.length - 1) return;
                                        const copy = [...currentStops];
                                        [copy[idx+1], copy[idx]] = [copy[idx], copy[idx+1]];
                                        setCurrentStops(copy);
                                      }}>↓</Button>
                                      <Button size="sm" variant="ghost" onClick={() => {
                                        setCurrentStops(prev => prev.filter(s => s.id !== stop.id));
                                      }}>
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <label className="text-xs text-muted-foreground">เวลาเริ่มต้น</label>
                                      <input type="time" value={stop.startTime || ''} onChange={(e) => {
                                        const v = e.target.value;
                                        setCurrentStops(prev => prev.map(s => {
                                          if (s.id !== stop.id) return s;
                                          const defaultMinutes = getDefaultDurationForStopKind(s.kind);
                                          const computedEnd = computeEndTime(v, defaultMinutes);
                                          let newEnd = s.endTime;
                                          if (!s.endTime) {
                                            newEnd = computedEnd;
                                          } else {
                                            try {
                                              const [sh, sm] = v.split(':').map(Number);
                                              const [eh, em] = (s.endTime || '').split(':').map(Number);
                                              if (Number.isNaN(eh) || (eh * 60 + em) <= (sh * 60 + sm)) {
                                                newEnd = computedEnd;
                                              }
                                            } catch (e) {
                                              newEnd = computedEnd;
                                            }
                                          }
                                          return { ...s, startTime: v, endTime: newEnd };
                                        }));
                                      }} className="w-full px-2 py-1 text-sm border border-border rounded-lg bg-background" />
                                    </div>

                                    <div>
                                      <label className="text-xs text-muted-foreground">เวลาสิ้นสุด</label>
                                      <input type="time" value={stop.endTime || ''} onChange={(e) => {
                                        const v = e.target.value;
                                        setCurrentStops(prev => prev.map(s => s.id === stop.id ? {...s, endTime: v} : s));
                                      }} className="w-full px-2 py-1 text-sm border border-border rounded-lg bg-background" />
                                    </div>

                                    <div>
                                      <label className="text-xs text-muted-foreground">นาที (สำรอง)</label>
                                      <input type="number" value={stop.durationMinutes ?? ''} onChange={(e) => {
                                        const v = Number(e.target.value || 0);
                                        setCurrentStops(prev => prev.map(s => s.id === stop.id ? {...s, durationMinutes: v} : s));
                                      }} className="w-full px-2 py-1 text-sm border border-border rounded-lg bg-background" />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Places Selection */}
                          <div>
                            <div>
                              <h3 className="text-lg font-medium text-foreground mb-3">สถานที่</h3>
                              
                              <div className="mb-3">
                                <input 
                                  type="text" 
                                  placeholder="ค้นหา..." 
                                  value={placeQuery}
                                  onChange={(e) => setPlaceQuery(e.target.value)}
                                  className="w-full px-2 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                                />
                              </div>
                              
                              <div className="space-y-1 max-h-64 overflow-y-auto">
                {places
                                  .filter(p => p.name.toLowerCase().includes(placeQuery.toLowerCase()) || p.category.toLowerCase().includes(placeQuery.toLowerCase()))
                                  .map((place) => (
                                  <div key={place.id} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-foreground text-xs truncate">{place.name}</h4>
                                      <p className="text-xs text-muted-foreground">{place.category}</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-6 w-6 p-0" onClick={() => {
                                      let day = currentDay;
                                      if (!day) {
                                        const d = new Date();
                                        const iso = d.toISOString().slice(0,10);
                                        setStartDate(iso);
                                        setEndDate(iso);
                                        setCurrentDay(iso);
                                        day = iso;
                                      }
                                      if (!day) return;
                                      const existing = stopsByDay[day] || [];
                                      const nextId = existing.length ? Math.max(...existing.map(s => s.id)) + 1 : 1;
                                      const prev = existing[existing.length - 1];
                                      const prevEnd = computeStopEndTime(prev);
                                      const defaultMinutes = getDefaultDurationForStopKind('place');
                                      const start = prevEnd;
                                      const end = start ? computeEndTime(start, defaultMinutes) : undefined;
                                      const newStop: Stop = { id: nextId, kind: 'place', placeId: place.id, name: place.name, startTime: start, endTime: end, durationMinutes: undefined };
                                      setStopsByDay(prevState => ({ ...prevState, [day!]: [...(prevState[day!] || []), newStop] }));
                                    }}>
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {/* Quick Activities */}
                          <div className="mt-4">
                            <h3 className="text-lg font-medium text-foreground mb-3">กิจกรรมด่วน</h3>
                            <div className="flex gap-2">
                              {ACTIVITY_DEFS.map(a => (
                                <Button key={String(a.key)} size="sm" variant="ghost" onClick={() => {
                                  if (!currentDay) {
                                    alert('กรุณาเลือกวันก่อนเพื่อเพิ่มกิจกรรม');
                                    return;
                                  }
                                  const existing = stopsByDay[currentDay] || [];
                                  const nextId = existing.length ? Math.max(...existing.map(s => s.id)) + 1 : 1;
                                  const prev = existing[existing.length - 1];
                                  const prevEnd = computeStopEndTime(prev);
                                  const defaultMinutes = a.defaultMinutes;
                                  const start = prevEnd;
                                  const end = start ? computeEndTime(start, defaultMinutes) : undefined;
                                  const stop: Stop = { id: nextId, placeId: null, name: a.label, kind: a.key, startTime: start, endTime: end, durationMinutes: a.defaultMinutes };
                                  setStopsByDay(prev => ({ ...prev, [currentDay]: [...(prev[currentDay] || []), stop] }));
                                }}>{a.label}</Button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Hotel Selection */}
                          <div>
                            <h3 className="text-lg font-medium text-foreground mb-3">ที่พัก (เลือกตามที่ว่าง)</h3>
                            {!currentDay ? (
                              <div className="text-sm text-muted-foreground bg-muted/30 rounded-xl p-4">เลือกวันก่อนเพื่อดูโรงแรมที่ว่างในวันนั้น</div>
                            ) : (
                              <div className="space-y-2">
                                {(() => {
                                  // helper: check if hotel is available on currentDay
                                  const isAvailable = (h: Hotel) => {
                                    try {
                                      const d = new Date(currentDay);
                                      const from = new Date(h.availableFrom);
                                      const to = new Date(h.availableTo);
                                      // normalize time portion
                                      d.setHours(0,0,0,0);
                                      from.setHours(0,0,0,0);
                                      to.setHours(0,0,0,0);
                                      return d >= from && d <= to;
                                    } catch (e) {
                                      return false;
                                    }
                                  };

                                  const avail = hotels.filter(h => isAvailable(h));
                                  if (avail.length === 0) return <div className="text-sm text-muted-foreground">ไม่มีโรงแรมว่างสำหรับวันดังกล่าว</div>;

                                  return avail.map(h => (
                                    <div key={h.id} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-foreground text-sm truncate">{h.name}</h4>
                                        <p className="text-xs text-muted-foreground">คะแนน {h.rating ?? '-'} • ว่าง: {h.availableFrom} — {h.availableTo}</p>
                                      </div>
                                      <div className="ml-2">
                                        {selectedHotels[currentDay] === h.id ? (
                                          <Button size="sm" variant="outline" onClick={() => {
                                            setSelectedHotels(prev => ({ ...prev, [currentDay!]: undefined }));
                                          }}>ยกเลิก</Button>
                                        ) : (
                                          <Button size="sm" onClick={() => {
                                            setSelectedHotels(prev => ({ ...prev, [currentDay!]: h.id }));
                                          }}>เลือก</Button>
                                        )}
                                      </div>
                                    </div>
                                  ));
                                })()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground mb-6">ตรวจสอบและบันทึก</h2>
                        
                        <div className="bg-muted/30 rounded-xl p-6">
                          <h3 className="font-semibold text-foreground mb-4">สรุปข้อมูลทริป</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <p className="text-muted-foreground">ชื่อทริป:</p>
                              <p className="font-medium text-foreground">{tripName || "-"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">จำนวนผู้เข้าร่วม:</p>
                              <p className="font-medium text-foreground">{participants ? `${participants} คน` : "-"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">วันเริ่มต้น:</p>
                              <p className="font-medium text-foreground">{startDate ? new Date(startDate).toLocaleDateString('th-TH') : "-"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">วันสิ้นสุด:</p>
                              <p className="font-medium text-foreground">{endDate ? new Date(endDate).toLocaleDateString('th-TH') : "-"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">จำนวนวัน:</p>
                              <p className="font-medium text-foreground">{Object.keys(stopsByDay).length} วัน</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">จำนวนสถานที่:</p>
                              <p className="font-medium text-foreground">{Object.values(stopsByDay).reduce((sum, arr) => sum + arr.length, 0)} สถานที่</p>
                              <div className="mb-4">
                                <label className="inline-flex items-center gap-2">
                                  <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                                  <span className="text-sm">เผยแพร่ทริปนี้ให้ผู้อื่นดู (Public)</span>
                                </label>
                              </div>
                            </div>
                          </div>
                          
                          {Object.keys(stopsByDay).length > 0 && (
                            <div>
                              <p className="text-muted-foreground mb-2">รายละเอียดแต่ละวัน:</p>
                              <div className="space-y-2">
                                {Object.entries(stopsByDay).map(([day, stops]) => (
                                  <div key={day} className="text-sm">
                                    <span className="font-medium text-foreground">{new Date(day).toLocaleDateString('th-TH')}:</span>
                                    <span className="text-muted-foreground ml-2">{stops.length} สถานที่</span>
                                    {selectedHotels[day] ? (
                                      <div className="text-sm text-foreground ml-6">ที่พัก: {hotels.find(h => h.id === selectedHotels[day])?.name}</div>
                                    ) : (
                                      <div className="text-sm text-muted-foreground ml-6">ยังไม่ได้เลือกที่พัก</div>
                                    )}
                                    {stops.length > 0 && (
                                      <ul className="ml-6 mt-1 list-disc list-inside text-sm text-muted-foreground">
                                          {stops.map(s => (
                                            <li key={s.id} className="text-sm text-muted-foreground">{s.name}{getStopDurationMinutes(s) ? ` — ${formatMinutes(getStopDurationMinutes(s))}` : ''}</li>
                                          ))}
                                      </ul>
                                    )}
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
                        onClick={() => step > 0 ? setStep(step - 1) : setActiveTab('mytrips')}
                        variant="outline"
                      >
                        {step > 0 ? 'ก่อนหน้า' : 'ทริปของฉัน'}
                      </Button>
                      
                      <div className="flex gap-3">
                        {step < 2 ? (
                          <Button onClick={() => {
                            if (step === 0) {
                              if (!validateStep0()) return;
                            }
                            if (step === 1) {
                              if (!validateStep1()) return;
                            }
                            setStep(step + 1);
                          }}>
                            ถัดไป
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button onClick={saveTrip} size="lg">
                              บันทึกทริป
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />

      {/* Trip Details Modal */}
      {viewingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-2xl p-6 w-full max-w-3xl mx-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{viewingTrip.name || 'รายละเอียดทริป'}</h3>
                <p className="text-sm text-muted-foreground">{viewingTrip.participants ? `${viewingTrip.participants} คน` : ''}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setViewingTrip(null)}>ปิด</Button>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">วัน:</span> <span className="font-medium">{viewingTrip.startDate ? new Date(viewingTrip.startDate).toLocaleDateString('th-TH') : '-'} - {viewingTrip.endDate ? new Date(viewingTrip.endDate).toLocaleDateString('th-TH') : '-'}</span></div>
                <div><span className="text-muted-foreground">วันที่บันทึก:</span> <span className="font-medium">{viewingTrip.createdAt ? new Date(viewingTrip.createdAt).toLocaleString('th-TH') : '-'}</span></div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground">รายละเอียดแต่ละวัน</h4>
                <div className="space-y-2 mt-2 text-sm">
                  {Object.entries(viewingTrip.stopsByDay || {}).map(([day, stops]: any) => (
                    <div key={day} className="bg-muted/20 rounded-md p-3">
                      <div className="font-medium text-foreground">{new Date(day).toLocaleDateString('th-TH')}</div>
                      <div className="text-muted-foreground text-sm">{stops.length} สถานที่/กิจกรรม</div>
                      <ul className="mt-2 list-disc list-inside text-sm">
                        {stops.map((s: any) => (
                          <li key={s.id}>{s.name}{s.startTime ? ` — ${s.startTime}` : ''}{s.endTime ? ` to ${s.endTime}` : ''}{s.durationMinutes ? ` (${formatMinutes(s.durationMinutes)})` : ''}</li>
                        ))}
                      </ul>
                      <div className="mt-2 text-sm">
                        {viewingTrip.selectedHotels && viewingTrip.selectedHotels[day] ? (
                          <div className="text-foreground">ที่พัก: {hotels.find(h => h.id === viewingTrip.selectedHotels[day])?.name}</div>
                        ) : (
                          <div className="text-muted-foreground">ยังไม่ได้เลือกที่พัก</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Public Editor Modal */}
      {publicEditorTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-2xl p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">แก้ไขข้อมูลสาธารณะ</h3>
              <div>
                <Button variant="ghost" onClick={() => setPublicEditorTrip(null)}>ปิด</Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">คำอธิบายสาธารณะ</label>
                <textarea className="w-full p-2 border border-border rounded-lg" defaultValue={publicEditorTrip.publicMeta?.description || ''} id="public-desc" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">ข้อมูลติดต่อ (อีเมล/เบอร์)</label>
                <input className="w-full p-2 border border-border rounded-lg" defaultValue={publicEditorTrip.publicMeta?.contact || ''} id="public-contact" />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPublicEditorTrip(null)}>ยกเลิก</Button>
                <Button onClick={() => {
                  const desc = (document.getElementById('public-desc') as HTMLTextAreaElement).value;
                  const contact = (document.getElementById('public-contact') as HTMLInputElement).value;
                  const updated = savedTrips.map((t: any) => t === publicEditorTrip ? { ...t, publicMeta: { description: desc, contact } } : t);
                  setSavedTrips(updated);
                  try { localStorage.setItem('saved-trips', JSON.stringify(updated)); } catch (e) {}
                  setPublicEditorTrip(null);
                }}>บันทึก</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Itinerary;