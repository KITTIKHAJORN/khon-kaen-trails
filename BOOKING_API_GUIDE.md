# BookingAPI Guide - คู่มือการใช้งาน API จองที่พัก

## ภาพรวม
BookingAPI เป็น API ที่ช่วยดึงข้อมูลรายละเอียดต่างๆ ของโรงแรมในขอนแก่นผ่าน Booking.com API และ Google Places API

## ฟีเจอร์หลัก

### 🏨 **การดึงข้อมูลโรงแรม**
- `getHotelDetails()` - ดึงรายละเอียดโรงแรมจาก Booking.com
- `getHotelDetailsFromBooking()` - ดึงรายละเอียดโรงแรมแบบเจาะจง
- `getBookingHotelsList()` - ดึงรายการโรงแรมสำหรับหน้า Places

### 💬 **การดึงรีวิว**
- `getHotelReviews(hotelId, limit)` - ดึงรีวิวโรงแรมจาก Booking.com API
- `getPlaceReviews(placeId)` - ดึงรีวิวจาก Google Places API
- `getCombinedReviews(hotelId, placeId)` - ดึงรีวิวจากทั้งสองแหล่ง
- `formatBookingReviews(reviewsData)` - แปลงรีวิวจาก Booking.com
- `formatGoogleReviews(reviews)` - แปลงรีวิวจาก Google Places

### 🔍 **การค้นหาโรงแรม**
- `searchHotelsFromPlaces()` - ค้นหาผ่าน Google Places API
- `searchHotelsFromBooking()` - ค้นหาผ่าน Booking.com API
- `searchHotelsByCoordinates()` - ค้นหาตามพิกัด

### 📍 **การจัดการ Location**
- `findKhonKaenDestId()` - ค้นหา destination ID ของขอนแก่น
- `findThailandDestId()` - ค้นหา destination ID ของประเทศไทย

## การใช้งานใน React Component

### 1. Import API functions
```javascript
import { getBookingHotelsList, getHotelDetailsFromBooking } from '@/api/bookingapi';
```

### 2. ดึงรายการโรงแรม
```javascript
const [hotels, setHotels] = useState([]);
const [loading, setLoading] = useState(false);

const loadHotels = async () => {
  setLoading(true);
  try {
    const response = await getBookingHotelsList(0); // หน้า 0
    if (response.results && Array.isArray(response.results)) {
      setHotels(response.results);
    }
  } catch (error) {
    console.error('ข้อผิดพลาด:', error);
  } finally {
    setLoading(false);
  }
};
```

### 3. ดึงรายละเอียดโรงแรม
```javascript
const handleHotelClick = async (hotel) => {
  if (hotel.booking_data?.hotel_id) {
    try {
      const details = await getHotelDetailsFromBooking(hotel.booking_data.hotel_id);
      console.log('รายละเอียดโรงแรม:', details);
    } catch (error) {
      console.error('ข้อผิดพลาด:', error);
    }
  }
};
```

### 4. ดึงรีวิวโรงแรม
```javascript
const [reviews, setReviews] = useState([]);

const loadReviews = async (hotel) => {
  try {
    const reviewsData = await getCombinedReviews(
      hotel.booking_data?.hotel_id || '',
      hotel.place_id || ''
    );
    setReviews(reviewsData);
  } catch (error) {
    console.error('ข้อผิดพลาด:', error);
  }
};
```

### 5. ลิงก์ไปจองที่ Booking.com
```javascript
const handleBookingRedirect = (hotel) => {
  const bookingUrl = hotel.booking_data?.url || 
    `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name)}`;
  
  window.open(bookingUrl, '_blank', 'noopener,noreferrer');
};
```

## โครงสร้างข้อมูลโรงแรม

```javascript
{
  place_id: "booking_12345",
  name: "โรงแรมขอนแก่นพลาซ่า",
  vicinity: "เมืองขอนแก่น",
  formatted_address: "123 ถนนมิตรภาพ ขอนแก่น 40000",
  rating: 4.5,
  types: ["lodging", "hotel", "accommodation"],
  photos: ["https://example.com/image.jpg"],
  geometry: {
    location: {
      lat: 16.4395,
      lng: 102.8296
    }
  },
  booking_data: {
    hotel_id: "12345",
    review_score: 4.5,
    review_count: 240,
    price: 1200,
    distance: 2.5,
    url: "https://www.booking.com/hotel/th/example.html"
  }
}
```

## โครงสร้างข้อมูลรีวิว

```javascript
{
  id: "review_12345",
  author_name: "สมชาย ใจดี",
  author_photo: "https://example.com/photo.jpg",
  rating: 5,
  text: "โรงแรมดีมาก บริการดี ห้องสะอาด",
  time: "2024-01-15T10:30:00Z",
  language: "th",
  helpful_votes: 3,
  source: "booking.com" // หรือ "google_places"
}
```

## การตั้งค่า API

### RapidAPI Key สำหรับ Booking.com
```javascript
const BOOKING_RAPIDAPI_HOST = 'booking-com15.p.rapidapi.com'
const BOOKING_RAPIDAPI_KEY = 'your-rapidapi-key-here'
```

### API Endpoints สำหรับรีวิว
```javascript
// ดึงรีวิวโรงแรม
GET https://booking-com15.p.rapidapi.com/api/v1/hotels/getHotelReviews
Parameters:
- hotel_id: ID ของโรงแรม
- sort_option_id: sort_most_relevant
- page_number: หมายเลขหน้า
- languagecode: en-us หรือ th
```

### Google Places API
- ต้องมี Google Places API Key
- เปิดใช้งาน Places API ใน Google Cloud Console

## ตัวอย่างการใช้งานในหน้า Booking

### หน้าหลัก (src/pages/Booking.tsx)
- ใช้ `getBookingHotelsList()` เพื่อดึงรายการโรงแรม
- แสดงโรงแรมในรูปแบบ Card Grid
- มีปุ่ม "ดู" และ "จอง" สำหรับแต่ละโรงแรม

### Modal รายละเอียด
- ใช้ `getHotelDetailsFromBooking()` เพื่อดึงรายละเอียดเพิ่มเติม
- ใช้ `HotelReviews` component เพื่อแสดงรีวิวจริง
- แสดงข้อมูลครบถ้วนของโรงแรม
- มีปุ่มลิงก์ไป Booking.com

## Error Handling

```javascript
try {
  const response = await getBookingHotelsList(0);
  // จัดการข้อมูลสำเร็จ
} catch (error) {
  console.error('ข้อผิดพลาด:', error);
  // แสดงข้อความผิดพลาดให้ผู้ใช้
  setError('ไม่สามารถโหลดข้อมูลโรงแรมได้');
}
```

## Loading States

```javascript
const [loading, setLoading] = useState(false);

// ระหว่างโหลดข้อมูล
if (loading) {
  return <div>กำลังโหลด...</div>;
}

// เมื่อโหลดเสร็จ
return <div>ข้อมูลโรงแรม</div>;
```

## การค้นหาและกรอง

```javascript
const [searchQuery, setSearchQuery] = useState('');

const filteredHotels = hotels.filter(hotel => 
  hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  hotel.vicinity.toLowerCase().includes(searchQuery.toLowerCase())
);
```

## Pagination

```javascript
const [currentPage, setCurrentPage] = useState(0);

const loadMoreHotels = async () => {
  const nextPage = currentPage + 1;
  const response = await getBookingHotelsList(nextPage);
  setHotels(prev => [...prev, ...response.results]);
  setCurrentPage(nextPage);
};
```

## การทดสอบ API

### 1. ทดสอบใน Console
```javascript
// เปิด Developer Tools และทดสอบ
import { getBookingHotelsList } from './src/api/bookingapi.js';
getBookingHotelsList(0).then(console.log);
```

### 2. ใช้ Component ตัวอย่าง
```javascript
import HotelBookingExample from '@/components/HotelBookingExample';
// ใช้ในหน้าใดหน้าหนึ่งเพื่อทดสอบ API
```

## ข้อควรระวัง

1. **Rate Limiting**: API มีข้อจำกัดในการเรียกใช้ ควรมี delay ระหว่างการเรียก
2. **Error Handling**: ควรจัดการ error อย่างเหมาะสม
3. **API Keys**: อย่าเปิดเผย API keys ในโค้ดที่ public
4. **Data Validation**: ตรวจสอบข้อมูลที่ได้จาก API ก่อนใช้งาน

## การพัฒนาต่อ

1. **Caching**: เพิ่มการ cache ข้อมูลเพื่อลด API calls
2. **Offline Support**: รองรับการใช้งานแบบ offline
3. **Advanced Filters**: เพิ่มตัวกรองราคา, คะแนน, ระยะทาง
4. **Favorites**: ระบบเก็บโรงแรมที่สนใจ
5. **Reviews**: แสดงรีวิวจากผู้ใช้

## การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **API Error 401**: ตรวจสอบ API Key
2. **API Error 429**: เกิน rate limit, เพิ่ม delay
3. **ไม่มีข้อมูล**: ตรวจสอบ dest_id ของขอนแก่น
4. **รูปภาพไม่แสดง**: ใช้ placeholder image

### Debug Tips

```javascript
// เปิด console.log เพื่อดูข้อมูล
console.log('🏨 ข้อมูลโรงแรม:', hotels);
console.log('📊 สถิติ:', {
  จำนวนโรงแรม: hotels.length,
  โรงแรมที่มีราคา: hotels.filter(h => h.booking_data?.price).length
});
```

## การอัพเดท

เมื่อมีการอัพเดท API:
1. อัพเดท version ใน package.json
2. ทดสอบการทำงาน
3. อัพเดท documentation
4. แจ้งทีมพัฒนา

---

**หมายเหตุ**: API นี้ใช้สำหรับโครงการ Khon Kaen Trails เพื่อแสดงข้อมูลโรงแรมในจังหวัดขอนแก่นเท่านั้น
