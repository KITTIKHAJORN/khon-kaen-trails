// bookingapi.js
// รวมฟังก์ชันเรียก API สำหรับ Booking.com และ RapidAPI อื่นๆ

const BOOKING_RAPIDAPI_HOST = 'booking-com.p.rapidapi.com'
const BOOKING_RAPIDAPI_KEY = '2ed1b7b119msh21fe7e2cef81710p1743f8jsneb5527ebb396'

// ฟังก์ชันสำหรับดึงข้อมูลรายละเอียดโรงแรมจาก Booking.com
export async function getHotelDetails(hotelId) {
  if (!hotelId) {
    throw new Error('Hotel ID is required')
  }

  console.log('🏨 ไม่มี API endpoint สำหรับรายละเอียดโรงแรม')
  
  // ส่งคืนข้อมูลว่างเนื่องจากไม่มี API endpoint ที่ถูกต้อง
  return null
}

// ฟังก์ชันสำหรับค้นหาโรงแรมจาก Google Places API
export async function searchHotelsFromPlaces(query, placeData = null) {
  // ใช้ Google Places API แทน Booking.com API
  const { textSearch } = await import("/src/api/mapapi.js")
  
  if (!placeData?.geometry?.location) {
    throw new Error('ไม่พบข้อมูลพิกัดของสถานที่')
  }
  
  const latitude = placeData.geometry.location.lat
  const longitude = placeData.geometry.location.lng
  const location = `${latitude},${longitude}`
  
  console.log('🔍 กำลังค้นหาสถานที่จาก Google Places:', query)
  console.log('📍 พิกัดสถานที่:', location)
  
  return textSearch({
    query: `${query}`,
    location: location,
    radius: 5000,
    language: 'th',
    region: 'th'
  })
}

// ฟังก์ชันสำหรับค้นหา dest_id ของขอนแก่น
export async function findKhonKaenDestId() {
  // ลองใช้หลาย endpoint ที่เป็นไปได้
  const possibleEndpoints = [
    `https://${BOOKING_RAPIDAPI_HOST}/v1/locations/search`,
    `https://${BOOKING_RAPIDAPI_HOST}/v1/hotels/locations`,
    `https://${BOOKING_RAPIDAPI_HOST}/locations/search`,
    `https://${BOOKING_RAPIDAPI_HOST}/hotels/locations`
  ]

  for (const url of possibleEndpoints) {
    try {
      const params = new URLSearchParams({
        locale: 'en-gb',
        name: 'Khon Kaen'
      })

      console.log('🔍 กำลังค้นหา dest_id ของขอนแก่น...')
      console.log('API URL:', `${url}?${params}`)

      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': BOOKING_RAPIDAPI_KEY,
          'X-RapidAPI-Host': BOOKING_RAPIDAPI_HOST
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ ผลการค้นหา dest_id ของขอนแก่น:', data)
        
        // ค้นหา dest_id ของขอนแก่นจากผลลัพธ์
        if (data && Array.isArray(data)) {
          const khonKaen = data.find(location => 
            location.name && (
              location.name.toLowerCase().includes('khon kaen') ||
              location.name.toLowerCase().includes('ขอนแก่น')
            )
          )
          
          if (khonKaen && khonKaen.dest_id) {
            console.log('✅ พบ dest_id ของขอนแก่น:', khonKaen.dest_id)
            return khonKaen.dest_id
          }
        }
        
        // ถ้าไม่เจอ ให้ลองค้นหาด้วย Thailand
        console.log('⚠️ ไม่เจอขอนแก่น ลองค้นหาด้วย Thailand...')
        return await findThailandDestId()
      } else {
        console.log(`❌ Endpoint ${url} ไม่ทำงาน (${response.status})`)
      }
    } catch (error) {
      console.log(`❌ ข้อผิดพลาดกับ endpoint ${url}:`, error.message)
    }
  }
  
  console.log('⚠️ ไม่สามารถเชื่อมต่อ API ได้ ใช้ค่าเริ่มต้น')
  return '-2092174'
}

// ฟังก์ชันสำหรับค้นหา dest_id ของประเทศไทย
async function findThailandDestId() {
  const url = `https://${BOOKING_RAPIDAPI_HOST}/v1/locations/search`
  
  const params = new URLSearchParams({
    locale: 'en-gb',
    name: 'Thailand'
  })

  console.log('🔍 กำลังค้นหา dest_id ของประเทศไทย...')

  try {
    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': BOOKING_RAPIDAPI_KEY,
        'X-RapidAPI-Host': BOOKING_RAPIDAPI_HOST
      }
    })

    if (!response.ok) {
      throw new Error(`Location API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ ผลการค้นหา dest_id ของประเทศไทย:', data)
    
    if (data && Array.isArray(data)) {
      const thailand = data.find(location => 
        location.name && location.name.toLowerCase().includes('thailand')
      )
      
      if (thailand && thailand.dest_id) {
        console.log('✅ พบ dest_id ของประเทศไทย:', thailand.dest_id)
        return thailand.dest_id
      }
    }
    
    // ถ้าไม่เจอ ให้ใช้ค่าเริ่มต้น
    return '-2092174'
    
  } catch (error) {
    console.error('❌ ข้อผิดพลาดในการค้นหา dest_id ของประเทศไทย:', error)
    return '-2092174'
  }
}

// ฟังก์ชันสำหรับค้นหาโรงแรมจาก Booking.com API
export async function searchHotelsFromBooking(query, placeData = null) {
  const url = `https://${BOOKING_RAPIDAPI_HOST}/v1/hotels/search`
  
  // ค้นหา dest_id ของขอนแก่นจาก API ก่อน
  const destId = await findKhonKaenDestId()
  
  // สร้างวันที่ check-in และ check-out
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const checkinDate = today.toISOString().split('T')[0]
  const checkoutDate = tomorrow.toISOString().split('T')[0]
  
  // ใช้ชื่อโรงแรมที่ผู้ใช้เลือกในการค้นหา
  const searchQuery = query || (placeData ? placeData.name : 'hotel')
  
  const params = new URLSearchParams({
    dest_id: destId,
    dest_type: 'city',
    locale: 'en-gb',
    filter_by_currency: 'THB',
    order_by: 'popularity',
    checkin_date: checkinDate,
    checkout_date: checkoutDate,
    room_number: '1',
    adults_number: '1',
    children_number: '1',
    children_ages: '0,17',
    page_number: '0',
    include_adjacency: 'true',
    units: 'metric',
    search_text: searchQuery // เพิ่มการค้นหาตามชื่อโรงแรม
  })

  console.log('🔍 กำลังค้นหาโรงแรมจาก Booking.com:', searchQuery)
  console.log('📍 ใช้ dest_id ที่พบ:', destId)
  console.log('📅 วันที่ check-in:', checkinDate)
  console.log('📅 วันที่ check-out:', checkoutDate)
  console.log('🔍 ค้นหาตามชื่อ:', searchQuery)
  console.log('API URL:', `${url}?${params}`)

  try {
    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': BOOKING_RAPIDAPI_KEY,
        'X-RapidAPI-Host': BOOKING_RAPIDAPI_HOST
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Booking Search API Error Response:', errorText)
      throw new Error(`Booking Search API error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ ผลการค้นหาโรงแรมจาก Booking.com:', data)
    return data
  } catch (error) {
    console.error('❌ ข้อผิดพลาดในการค้นหาโรงแรม:', error)
    throw error
  }
}

// ฟังก์ชันสำหรับค้นหาโรงแรมแบบเจาะจงตามพิกัด
export async function searchHotelsByCoordinates(placeData) {
  if (!placeData?.geometry?.location) {
    throw new Error('ไม่พบข้อมูลพิกัดของสถานที่')
  }

  const url = `https://${BOOKING_RAPIDAPI_HOST}/v1/hotels/search`
  
  // ค้นหา dest_id ของขอนแก่นก่อน
  const destId = await findKhonKaenDestId()
  
  // ใช้พิกัดของสถานที่และ dest_id
  const latitude = placeData.geometry.location.lat
  const longitude = placeData.geometry.location.lng
  
  // สร้างวันที่ check-in และ check-out
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const checkinDate = today.toISOString().split('T')[0]
  const checkoutDate = tomorrow.toISOString().split('T')[0]
  
  const params = new URLSearchParams({
    dest_id: destId,
    dest_type: 'city',
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    locale: 'en-gb',
    filter_by_currency: 'THB',
    order_by: 'distance', // เรียงตามระยะทาง
    checkin_date: checkinDate,
    checkout_date: checkoutDate,
    room_number: '1',
    adults_number: '1',
    children_number: '1',
    children_ages: '0,17',
    page_number: '0',
    include_adjacency: 'true',
    units: 'metric',
    search_text: placeData.name // ค้นหาตามชื่อโรงแรม
  })

  console.log('🔍 กำลังค้นหาโรงแรมตามพิกัด:', placeData.name)
  console.log('📍 พิกัด:', latitude, longitude)
  console.log('📍 dest_id:', destId)
  console.log('📅 วันที่ check-in:', checkinDate)
  console.log('📅 วันที่ check-out:', checkoutDate)
  console.log('API URL:', `${url}?${params}`)

  try {
    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': BOOKING_RAPIDAPI_KEY,
        'X-RapidAPI-Host': BOOKING_RAPIDAPI_HOST
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Booking Search by Coordinates API Error Response:', errorText)
      throw new Error(`Booking Search by Coordinates API error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ ผลการค้นหาโรงแรมตามพิกัด:', data)
    return data
  } catch (error) {
    console.error('❌ ข้อผิดพลาดในการค้นหาโรงแรมตามพิกัด:', error)
    throw error
  }
}

// ฟังก์ชันสำหรับดึงรายละเอียดโรงแรมจาก Booking.com API
export async function getHotelDetailsFromBooking(hotelId) {
  if (!hotelId) {
    throw new Error('Hotel ID is required')
  }

  console.log('🏨 ไม่มี API endpoint สำหรับรายละเอียดโรงแรม ID:', hotelId)
  
  // ส่งคืนข้อมูลว่างเนื่องจากไม่มี API endpoint ที่ถูกต้อง
  return null
}

// ฟังก์ชันสำหรับตรวจสอบว่าเป็นโรงแรมหรือไม่
export function isHotelType(types) {
  if (!types || !Array.isArray(types)) return false
  
  const hotelTypes = ['hotel', 'lodging', 'accommodation', 'resort', 'hostel', 'guest_house']
  return types.some(type => hotelTypes.includes(type))
}

// ฟังก์ชันสำหรับแปลงข้อมูลโรงแรมจาก Google Places เป็นรูปแบบที่ใช้กับ Booking API
export function extractHotelInfoFromPlace(place) {
  // ลองดึง hotel_id จาก place_id หรือ name
  // ในกรณีจริงอาจต้องใช้การ mapping หรือ search API
  return {
    place_id: place.place_id,
    name: place.name,
    address: place.vicinity || place.formatted_address,
    rating: place.rating,
    types: place.types,
    geometry: place.geometry
  }
}

// ฟังก์ชันสำหรับดึงรายการโรงแรมจาก Booking API สำหรับหน้า Places
export async function getBookingHotelsList(page = 0) {
  console.log(`🔍 กำลังดึงรายการโรงแรมจาก Booking.com สำหรับหน้า Places - หน้า ${page + 1}`)
  
  try {
    // ใช้วิธีเดียวเพื่อให้ง่ายต่อการจัดการ pagination
    const hotels = await getHotelsByDestId(page)
    
    console.log(`✅ พบ ${hotels.length} โรงแรมในหน้า ${page + 1}`)
    
    // แปลงข้อมูลให้เป็นรูปแบบเดียวกับ Google Places และดึงรูปภาพ (มี delay เพื่อหลีกเลี่ยง rate limit)
    const formattedHotels = []
    
    for (let i = 0; i < hotels.length; i++) {
      const hotel = hotels[i]
      let photos = []
      
      // ดึงรูปภาพของโรงแรม (ทุกโรงแรม แต่มี delay เพื่อหลีกเลี่ยง rate limit)
      if (hotel.hotel_id || hotel.id) {
        try {
          console.log(`📸 ดึงรูปภาพโรงแรม ${i + 1}/${hotels.length}:`, hotel.hotel_id || hotel.id)
          const photosData = await getHotelPhotos(hotel.hotel_id || hotel.id)
          
          // ตรวจสอบรูปแบบข้อมูลรูปภาพ
          if (photosData) {
            if (Array.isArray(photosData)) {
              // ถ้าเป็น Array โดยตรง
              console.log('📸 ประมวลผล Array โดยตรง จำนวน:', photosData.length)
              photos = photosData.map(photo => {
                // ตรวจสอบว่า photo เป็น object หรือ string
                if (typeof photo === 'object' && photo !== null) {
                  // ลองหาหลายรูปแบบของ URL
                  return photo.url || 
                         photo.photo_url || 
                         photo.src || 
                         photo.url_square60 || 
                         photo.url_medium || 
                         photo.url_large ||
                         photo.url_max_300 ||
                         photo.original ||
                         photo.medium ||
                         photo.large ||
                         photo.max_300 ||
                         photo.square60 ||
                         photo.max_1280 ||
                         photo.url_max_1280 ||
                         photo
                } else {
                  return photo
                }
              })
              console.log('📸 รูปภาพที่ได้:', photos.slice(0, 3)) // แสดง 3 รูปแรก
            } else if (photosData.photos && Array.isArray(photosData.photos)) {
              // ถ้าเป็น object ที่มี property photos
              console.log('📸 ประมวลผล photos property จำนวน:', photosData.photos.length)
              photos = photosData.photos.map(photo => {
                if (typeof photo === 'object' && photo !== null) {
                  return photo.url || photo.photo_url || photo.src || photo.url_square60 || photo.url_medium || photo.url_large || photo
                } else {
                  return photo
                }
              })
              console.log('📸 รูปภาพที่ได้:', photos.slice(0, 3)) // แสดง 3 รูปแรก
            } else if (photosData.data && Array.isArray(photosData.data)) {
              // ถ้าเป็น object ที่มี property data
              console.log('📸 ประมวลผล data property จำนวน:', photosData.data.length)
              photos = photosData.data.map(photo => {
                if (typeof photo === 'object' && photo !== null) {
                  return photo.url || photo.photo_url || photo.src || photo.url_square60 || photo.url_medium || photo.url_large || photo
                } else {
                  return photo
                }
              })
              console.log('📸 รูปภาพที่ได้:', photos.slice(0, 3)) // แสดง 3 รูปแรก
            }
          }
          
          // เพิ่ม delay 1 วินาทีระหว่างการเรียก API เพื่อหลีกเลี่ยง rate limit
          if (i < hotels.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        } catch (error) {
          console.log('⚠️ ไม่สามารถดึงรูปภาพโรงแรมได้:', hotel.hotel_id || hotel.id, error.message)
          // หยุดดึงรูปภาพถ้าเจอ rate limit
          if (error.message.includes('429')) {
            console.log('🚫 พบ Rate Limit หยุดดึงรูปภาพ')
            break
          }
        }
      }
      
      formattedHotels.push({
        place_id: hotel.hotel_id || hotel.id || `booking_${Math.random().toString(36).substr(2, 9)}`,
        name: hotel.hotel_name || hotel.name || hotel.title || hotel.hotel_name_trans || 'ไม่ระบุชื่อ',
        vicinity: hotel.address || 'ไม่ระบุที่อยู่',
        formatted_address: hotel.address || 'ไม่ระบุที่อยู่',
        rating: hotel.review_score || hotel.rating || hotel.score || 0,
        price_level: null,
        types: ['lodging', 'hotel', 'accommodation'],
        photos: photos,
        geometry: hotel.latitude && hotel.longitude ? {
          location: {
            lat: parseFloat(hotel.latitude),
            lng: parseFloat(hotel.longitude)
          }
        } : null,
        opening_hours: {
          open_now: true
        },
        business_status: 'OPERATIONAL',
        booking_data: {
          hotel_id: hotel.hotel_id || hotel.id,
          review_score: hotel.review_score || hotel.rating || hotel.score,
          review_count: hotel.review_nr || hotel.review_count || hotel.reviews_count,
          price: hotel.price_breakdown?.gross_price || hotel.price || hotel.min_price,
          distance: hotel.distance || hotel.distance_km,
          url: hotel.url
        }
      })
    }
    
    return {
      results: formattedHotels,
      status: 'OK',
      total_results: 200, // ประมาณการ
      has_next_page: hotels.length >= 20
    }
    
  } catch (error) {
    console.error('❌ ข้อผิดพลาดในการดึงรายการโรงแรม:', error)
    throw error
  }
}

// ฟังก์ชันสำหรับดึงโรงแรมตาม dest_id
async function getHotelsByDestId(page = 0) {
  // ลองใช้หลาย endpoint ที่เป็นไปได้
  const possibleEndpoints = [
    `https://${BOOKING_RAPIDAPI_HOST}/v1/hotels/search`,
    `https://${BOOKING_RAPIDAPI_HOST}/hotels/search`,
    `https://${BOOKING_RAPIDAPI_HOST}/v1/search`,
    `https://${BOOKING_RAPIDAPI_HOST}/search`
  ]
  
  // ค้นหา dest_id ของขอนแก่น
  const destId = await findKhonKaenDestId()
  
  // สร้างวันที่ check-in และ check-out
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const checkinDate = today.toISOString().split('T')[0]
  const checkoutDate = tomorrow.toISOString().split('T')[0]

  console.log(`📍 กำลังดึงหน้า ${page + 1} ใช้ dest_id:`, destId)
  
  for (const url of possibleEndpoints) {
    try {
      console.log(`📄 กำลังดึงหน้า ${page + 1} จาก ${url}`)
        
      const params = new URLSearchParams({
        dest_id: destId,
        dest_type: 'city',
        locale: 'en-gb',
        filter_by_currency: 'THB',
        order_by: 'popularity',
        checkin_date: checkinDate,
        checkout_date: checkoutDate,
        room_number: '1',
        adults_number: '1',
        children_number: '1',
        children_ages: '0,17',
        page_number: page.toString(),
        include_adjacency: 'true',
        units: 'metric',
        // เพิ่มพารามิเตอร์เพื่อให้ได้ข้อมูลมากขึ้น
        price_min: '0',
        price_max: '10000',
        stars: '1,2,3,4,5',
        accommodation_type: 'hotel,resort,hostel,guesthouse,apartment'
      })

      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': BOOKING_RAPIDAPI_KEY,
          'X-RapidAPI-Host': BOOKING_RAPIDAPI_HOST
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`📄 หน้า ${page + 1}:`, data)
        
        // แปลงข้อมูลให้เป็นรูปแบบเดียวกับ Google Places API
        let hotels = []
        if (data.result && Array.isArray(data.result)) {
          hotels = data.result
        } else if (data.data && Array.isArray(data.data)) {
          hotels = data.data
        } else if (data.results && Array.isArray(data.results)) {
          hotels = data.results
        } else if (data.hotels && Array.isArray(data.hotels)) {
          hotels = data.hotels
        } else if (Array.isArray(data)) {
          hotels = data
        }
        
        console.log(`✅ หน้า ${page + 1}: พบ ${hotels.length} โรงแรม`)
        return hotels
      } else {
        console.log(`❌ Endpoint ${url} ไม่ทำงาน (${response.status})`)
      }
    } catch (error) {
      console.log(`❌ ข้อผิดพลาดกับ endpoint ${url}:`, error.message)
    }
  }
  
  // ถ้าทุก endpoint ล้มเหลว ให้ส่งคืนอาร์เรย์ว่าง
  console.log('⚠️ ไม่สามารถเชื่อมต่อ API ได้')
  return []
}

// ฟังก์ชันสำหรับดึงโรงแรมตามพิกัด
async function getHotelsByCoordinates() {
  const url = `https://${BOOKING_RAPIDAPI_HOST}/v1/hotels/search`
  
  // ใช้พิกัดของขอนแก่น
  const khonKaenLat = 16.4395
  const khonKaenLng = 102.8296
  
  // สร้างวันที่ check-in และ check-out
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const checkinDate = today.toISOString().split('T')[0]
  const checkoutDate = tomorrow.toISOString().split('T')[0]

  console.log('📍 วิธีที่ 2: ใช้พิกัด:', khonKaenLat, khonKaenLng)
  
  try {
    const allHotels = []
    const maxPages = 5 // ดึงข้อมูล 5 หน้า
    
    // ดึงข้อมูลหลายหน้า
    for (let page = 0; page < maxPages; page++) {
      console.log(`📄 วิธีที่ 2 - กำลังดึงหน้า ${page + 1}/${maxPages}`)
      
      const params = new URLSearchParams({
        latitude: khonKaenLat.toString(),
        longitude: khonKaenLng.toString(),
        locale: 'en-gb',
        filter_by_currency: 'THB',
        order_by: 'distance',
        checkin_date: checkinDate,
        checkout_date: checkoutDate,
        room_number: '1',
        adults_number: '1',
        children_number: '1',
        children_ages: '0,17',
        page_number: page.toString(),
        include_adjacency: 'true',
        units: 'metric',
        price_min: '0',
        price_max: '10000'
      })

      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': BOOKING_RAPIDAPI_KEY,
          'X-RapidAPI-Host': BOOKING_RAPIDAPI_HOST
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`📄 วิธีที่ 2 - หน้า ${page + 1}: ไม่มีข้อมูลเพิ่ม (404)`)
          break
        }
        console.log(`📄 วิธีที่ 2 - หน้า ${page + 1}: ข้อผิดพลาด ${response.status}`)
        continue
      }

      const data = await response.json()
      
      let hotels = []
      if (data.result && Array.isArray(data.result)) {
        hotels = data.result
      } else if (data.data && Array.isArray(data.data)) {
        hotels = data.data
      } else if (data.results && Array.isArray(data.results)) {
        hotels = data.results
      } else if (data.hotels && Array.isArray(data.hotels)) {
        hotels = data.hotels
      } else if (Array.isArray(data)) {
        hotels = data
      }
      
      if (hotels.length === 0) {
        console.log(`📄 วิธีที่ 2 - หน้า ${page + 1}: ไม่มีข้อมูลเพิ่ม`)
        break
      }
      
      allHotels.push(...hotels)
      console.log(`📄 วิธีที่ 2 - หน้า ${page + 1}: พบ ${hotels.length} โรงแรม (รวมทั้งหมด: ${allHotels.length})`)
      
      if (hotels.length < 20) {
        console.log(`📄 วิธีที่ 2 - หน้า ${page + 1}: น้อยกว่า 20 โรงแรม (หน้าสุดท้าย)`)
        break
      }
      
      // เพิ่ม delay
      if (page < maxPages - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    console.log(`✅ วิธีที่ 2 เสร็จสิ้น: รวมทั้งหมด ${allHotels.length} โรงแรม`)
    return allHotels
    
  } catch (error) {
    console.error('❌ ข้อผิดพลาดในการดึงรายการโรงแรม (พิกัด):', error)
    return []
  }
}

// ฟังก์ชันสำหรับดึงรีวิวโรงแรมจาก Booking.com API
export async function getHotelReviews(hotelId, limit = 10, pageNumber = 0) {
  if (!hotelId) {
    throw new Error('Hotel ID is required')
  }

  const url = `https://${BOOKING_RAPIDAPI_HOST}/v1/hotels/reviews`
  
  const params = new URLSearchParams({
    sort_type: 'SORT_MOST_RELEVANT',
    customer_type: 'solo_traveller,review_category_group_of_friends',
    locale: 'en-gb',
    language_filter: 'en-gb,de,fr',
    page_number: pageNumber.toString(),
    hotel_id: hotelId.toString()
  })

  console.log('💬 กำลังดึงรีวิวโรงแรม ID:', hotelId)
  console.log('API URL:', `${url}?${params}`)

  try {
    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': BOOKING_RAPIDAPI_KEY,
        'X-RapidAPI-Host': BOOKING_RAPIDAPI_HOST
      }
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ รีวิวโรงแรม - โครงสร้างข้อมูล:', JSON.stringify(data, null, 2))
      console.log('✅ รีวิวโรงแรม - ข้อมูลดิบ:', data)
      
      // ตรวจสอบโครงสร้างข้อมูล
      if (data && typeof data === 'object') {
        console.log('🔍 Keys ในข้อมูล:', Object.keys(data))
        if (data.reviews) {
          console.log('📝 จำนวนรีวิว:', data.reviews.length)
          if (data.reviews.length > 0) {
            console.log('📝 รีวิวแรก:', data.reviews[0])
            console.log('📝 Keys ในรีวิวแรก:', Object.keys(data.reviews[0]))
          }
        }
        if (data.data) {
          console.log('🔍 Keys ใน data:', Object.keys(data.data))
        }
      }
      
      return data
    } else {
      const errorText = await response.text()
      console.error('Hotel Reviews API Error Response:', errorText)
      throw new Error(`Hotel Reviews API error: ${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    console.error('❌ ข้อผิดพลาดในการดึงรีวิวโรงแรม:', error)
    throw error
  }
}

// ฟังก์ชันสำหรับดึงรูปภาพโรงแรมจาก Booking.com API
export async function getHotelPhotos(hotelId) {
  if (!hotelId) {
    throw new Error('Hotel ID is required')
  }

  const url = `https://${BOOKING_RAPIDAPI_HOST}/v1/hotels/photos`
  
  const params = new URLSearchParams({
    hotel_id: hotelId.toString(),
    locale: 'en-gb'
  })

  console.log('📸 กำลังดึงรูปภาพโรงแรม ID:', hotelId)
  console.log('API URL:', `${url}?${params}`)

  try {
    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': BOOKING_RAPIDAPI_KEY,
        'X-RapidAPI-Host': BOOKING_RAPIDAPI_HOST
      }
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ รูปภาพโรงแรม:', data)
      
      // ตรวจสอบโครงสร้างข้อมูลรูปภาพ
      if (Array.isArray(data)) {
        console.log('📸 ข้อมูลเป็น Array โดยตรง จำนวน:', data.length)
        if (data.length > 0) {
          console.log('📸 รูปภาพแรก:', data[0])
          console.log('📸 Keys ในรูปภาพแรก:', Object.keys(data[0]))
        }
      } else if (data && typeof data === 'object') {
        console.log('🔍 Keys ในข้อมูลรูปภาพ:', Object.keys(data))
        if (data.photos) {
          console.log('📸 จำนวนรูปภาพ:', data.photos.length)
          if (data.photos.length > 0) {
            console.log('📸 รูปภาพแรก:', data.photos[0])
          }
        }
        if (data.data) {
          console.log('🔍 Keys ใน data:', Object.keys(data.data))
        }
      }
      
      return data
    } else if (response.status === 429) {
      console.error('🚫 Rate Limit: 429 - API ถูกเรียกใช้บ่อยเกินไป')
      throw new Error(`Rate Limit: ${response.status} - Too Many Requests`)
    } else {
      const errorText = await response.text()
      console.error('Hotel Photos API Error Response:', errorText)
      throw new Error(`Hotel Photos API error: ${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    console.error('❌ ข้อผิดพลาดในการดึงรูปภาพโรงแรม:', error)
    throw error
  }
}

// ฟังก์ชันทดสอบ API รูปภาพ
export async function testPhotosAPI() {
  const testHotelId = '1377073'
  console.log('🧪 กำลังทดสอบ API รูปภาพด้วย hotel_id:', testHotelId)
  
  try {
    const result = await getHotelPhotos(testHotelId)
    console.log('🧪 ผลการทดสอบ API รูปภาพ:', result)
    return result
  } catch (error) {
    console.error('🧪 ข้อผิดพลาดในการทดสอบ API รูปภาพ:', error)
    return null
  }
}

// ฟังก์ชันสำหรับดึงรีวิวจาก Google Places API (สำรอง)
export async function getPlaceReviews(placeId) {
  try {
    const { getPlaceDetails } = await import("/src/api/mapapi.js")
    
    const placeDetails = await getPlaceDetails(placeId)
    
    if (placeDetails.result?.reviews) {
      console.log('✅ รีวิวจาก Google Places:', placeDetails.result.reviews)
      return placeDetails.result.reviews
    }
    
    return []
  } catch (error) {
    console.error('❌ ข้อผิดพลาดในการดึงรีวิวจาก Google Places:', error)
    return []
  }
}

// ฟังก์ชันสำหรับแปลงรีวิวจาก Booking.com เป็นรูปแบบมาตรฐาน
export function formatBookingReviews(reviewsData) {
  console.log('🔍 กำลังแปลงรีวิว:', reviewsData)
  
  // ตรวจสอบโครงสร้างข้อมูลที่แตกต่างกัน
  let reviews = []
  
  if (reviewsData?.data?.reviews && Array.isArray(reviewsData.data.reviews)) {
    reviews = reviewsData.data.reviews
    console.log('✅ พบรีวิวใน reviewsData.data.reviews:', reviews.length)
  } else if (reviewsData?.reviews && Array.isArray(reviewsData.reviews)) {
    reviews = reviewsData.reviews
    console.log('✅ พบรีวิวใน reviewsData.reviews:', reviews.length)
  } else if (Array.isArray(reviewsData)) {
    reviews = reviewsData
    console.log('✅ พบรีวิวใน Array:', reviews.length)
  } else if (reviewsData?.data && Array.isArray(reviewsData.data)) {
    reviews = reviewsData.data
    console.log('✅ พบรีวิวใน reviewsData.data:', reviews.length)
  } else {
    console.warn('ไม่พบรีวิวในรูปแบบที่คาดหวัง:', reviewsData)
    return []
  }

  return reviews.map(review => ({
    id: review.review_id || review.id || review.review_uuid || Math.random().toString(36).substr(2, 9),
    author_name: review.reviewer_name || review.author_name || review.name || 'ผู้รีวิว',
    author_photo: review.reviewer_photo || review.author_photo || review.photo || null,
    rating: review.review_score || review.rating || review.score || 0,
    text: review.review_text || review.text || review.comment || review.review_text_content || '',
    time: review.review_date || review.time || review.date || review.created_at || null,
    language: review.review_language || review.language || 'en',
    helpful_votes: review.helpful_count || review.helpful_votes || 0,
    source: 'booking.com',
    // ข้อมูลเพิ่มเติม
    country: review.reviewer_country || review.country || null,
    stay_date: review.stay_date || null,
    room_type: review.room_type || null
  }))
}

// ฟังก์ชันสำหรับแปลงรีวิวจาก Google Places เป็นรูปแบบมาตรฐาน
export function formatGoogleReviews(reviews) {
  if (!reviews || !Array.isArray(reviews)) {
    return []
  }

  return reviews.map(review => ({
    id: review.author_url || Math.random().toString(36).substr(2, 9),
    author_name: review.author_name || 'ผู้รีวิว',
    author_photo: review.profile_photo_url || null,
    rating: review.rating || 0,
    text: review.text || '',
    time: review.time || null,
    language: review.language || 'th',
    helpful_votes: 0,
    source: 'google_places'
  }))
}

// ฟังก์ชันสำหรับดึงรีวิวแบบรวม (Booking.com + Google Places)
export async function getCombinedReviews(hotelId, placeId = null) {
  const allReviews = []

  try {
    // ดึงรีวิวจาก Booking.com
    console.log('🔄 กำลังดึงรีวิวจาก Booking.com...')
    const bookingReviews = await getHotelReviews(hotelId, 10, 0)
    const formattedBookingReviews = formatBookingReviews(bookingReviews)
    allReviews.push(...formattedBookingReviews)
    console.log(`✅ ได้รีวิวจาก Booking.com: ${formattedBookingReviews.length} รีวิว`)
  } catch (error) {
    console.error('❌ ไม่สามารถดึงรีวิวจาก Booking.com:', error)
  }

  // ดึงรีวิวจาก Google Places (ถ้ามี place_id)
  if (placeId) {
    try {
      console.log('🔄 กำลังดึงรีวิวจาก Google Places...')
      const googleReviews = await getPlaceReviews(placeId)
      const formattedGoogleReviews = formatGoogleReviews(googleReviews)
      allReviews.push(...formattedGoogleReviews)
      console.log(`✅ ได้รีวิวจาก Google Places: ${formattedGoogleReviews.length} รีวิว`)
    } catch (error) {
      console.error('❌ ไม่สามารถดึงรีวิวจาก Google Places:', error)
    }
  }

  // เรียงตามคะแนนและเวลาล่าสุด
  const sortedReviews = allReviews.sort((a, b) => {
    // เรียงตามคะแนนก่อน (สูงสุดก่อน)
    if (b.rating !== a.rating) {
      return b.rating - a.rating
    }
    // ถ้าคะแนนเท่ากัน เรียงตามเวลาล่าสุด
    if (b.time && a.time) {
      return new Date(b.time) - new Date(a.time)
    }
    return 0
  })

  console.log(`✅ รวมรีวิวทั้งหมด: ${sortedReviews.length} รีวิว`)
  return sortedReviews
}