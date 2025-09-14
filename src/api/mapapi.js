// mapapi.js
// Google Maps Places API integration using RapidAPI

const RAPIDAPI_HOST = 'google-map-places.p.rapidapi.com'
const RAPIDAPI_KEY = '2ed1b7b119msh21fe7e2cef81710p1743f8jsneb5527ebb396'
const BASE_URL = 'https://google-map-places.p.rapidapi.com/maps/api/place'

// Text Search API - ค้นหาสถานที่ตามข้อความ
export async function textSearch(params = {}) {
  const {
    query = 'restaurants in Khon Kaen',
    radius = 1000,
    opennow = true,
    location = '16.4419,102.8360', // ขอนแก่น, ประเทศไทย
    language = 'th',
    region = 'th'
  } = params

  const queryParams = new URLSearchParams({
    query,
    radius: radius.toString(),
    opennow: opennow.toString(),
    location,
    language,
    region
  })

  const url = `${BASE_URL}/textsearch/json?${queryParams}`

  console.log('API Request URL:', url)
  console.log('API Request Params:', Object.fromEntries(queryParams))

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(`API error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    console.log('API Response Data:', data)
    return data
  } catch (error) {
    console.error('Text Search API Error:', error)
    throw error
  }
}

// Nearby Search API - ค้นหาสถานที่ใกล้เคียง
export async function nearbySearch(params = {}) {
  const {
    location = '16.4419,102.8360', // ขอนแก่น, ประเทศไทย
    radius = 1000,
    type = 'restaurant',
    keyword = '',
    language = 'th'
  } = params

  const queryParams = new URLSearchParams({
    location,
    radius: radius.toString(),
    type,
    language
  })

  if (keyword) {
    queryParams.append('keyword', keyword)
  }

  const url = `${BASE_URL}/nearbysearch/json?${queryParams}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Nearby Search API Error:', error)
    throw error
  }
}




// ===== ฟังก์ชันเฉพาะสำหรับประเทศไทยและขอนแก่น =====

// ค้นหาร้านอาหารในขอนแก่น
export async function searchKhonKaenRestaurants(query = 'ร้านอาหาร', radius = 5000) {
  return textSearch({
    query: `${query} ขอนแก่น`,
    location: '16.4419,102.8360', // ขอนแก่น
    radius,
    language: 'th',
    region: 'th'
  })
}

// ค้นหาสถานที่ท่องเที่ยวในขอนแก่น
export async function searchKhonKaenAttractions(query = 'สถานที่ท่องเที่ยว', radius = 10000) {
  return textSearch({
    query: `${query} ขอนแก่น`,
    location: '16.4419,102.8360', // ขอนแก่น
    radius,
    language: 'th',
    region: 'th'
  })
}

// ค้นหาที่พักในขอนแก่น
export async function searchKhonKaenHotels(query = 'โรงแรม', radius = 5000) {
  return textSearch({
    query: `${query} ขอนแก่น`,
    location: '16.4419,102.8360', // ขอนแก่น
    radius,
    language: 'th',
    region: 'th'
  })
}

// ค้นหามหาวิทยาลัยในขอนแก่น
export async function searchKhonKaenUniversities(query = 'มหาวิทยาลัย', radius = 5000) {
  return textSearch({
    query: `${query} ขอนแก่น`,
    location: '16.4419,102.8360', // ขอนแก่น
    radius,
    language: 'th',
    region: 'th'
  })
}

// ค้นหาห้างสรรพสินค้าในขอนแก่น
export async function searchKhonKaenMalls(query = 'ห้างสรรพสินค้า', radius = 5000) {
  return textSearch({
    query: `${query} ขอนแก่น`,
    location: '16.4419,102.8360', // ขอนแก่น
    radius,
    language: 'th',
    region: 'th'
  })
}


// ค้นหาสถานที่ใกล้เคียงในขอนแก่น
export async function searchNearbyKhonKaen(type = 'restaurant', radius = 2000) {
  return nearbySearch({
    location: '16.4419,102.8360', // ขอนแก่น
    radius,
    type,
    language: 'th'
  })
}

// ===== ฟังก์ชันสำหรับดึงแผนที่ =====

// ดึงภาพแผนที่แบบ Static Map
export function getStaticMap(params = {}) {
  const {
    center = '16.4419,102.8360', // ขอนแก่น
    zoom = 12,
    size = '600x400',
    maptype = 'roadmap', // roadmap, satellite, hybrid, terrain
    markers = [],
    language = 'th'
  } = params

  // สร้าง URL สำหรับ Static Map API ผ่าน RapidAPI
  const baseUrl = 'https://google-map-places.p.rapidapi.com/maps/api/staticmap'
  
  const queryParams = new URLSearchParams({
    center,
    zoom: zoom.toString(),
    size,
    maptype,
    language
  })

  // เพิ่ม markers ถ้ามี
  if (markers.length > 0) {
    markers.forEach(marker => {
      const markerString = `color:${marker.color || 'red'}|${marker.lat},${marker.lng}`
      queryParams.append('markers', markerString)
    })
  }

  return `${baseUrl}?${queryParams}`
}

// สร้าง markers จากข้อมูลสถานที่
export function createMarkersFromPlaces(places) {
  return places
    .filter(place => place.geometry?.location)
    .map(place => {
      // กำหนดสี marker ตามประเภท
      let color = 'blue'
      const types = place.types || []
      
      if (types.some(type => type.includes('restaurant') || type.includes('food'))) {
        color = 'red'
      } else if (types.some(type => type.includes('tourist_attraction') || type.includes('park'))) {
        color = 'green'
      } else if (types.some(type => type.includes('lodging'))) {
        color = 'purple'
      } else if (types.some(type => type.includes('shopping'))) {
        color = 'orange'
      } else if (types.some(type => type.includes('university'))) {
        color = 'blue'
      }

      return {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        color,
        title: place.name
      }
    })
}

// ดึงภาพแผนที่พร้อม markers สำหรับขอนแก่น
export async function getKhonKaenMapWithPlaces(places = [], options = {}) {
  const {
    zoom = 12,
    size = '800x600',
    maptype = 'roadmap'
  } = options

  const markers = createMarkersFromPlaces(places)
  
  return getStaticMap({
    center: '16.4419,102.8360',
    zoom,
    size,
    maptype,
    markers,
    language: 'th'
  })
}

// ฟังก์ชันทดสอบเพื่อตรวจสอบข้อมูลที่ได้จาก API
export async function testApiResponse() {
  try {
    console.log('Testing API response...')
    const response = await searchKhonKaenRestaurants('ร้านอาหาร', 5000)
    console.log('API Response Status:', response.status)
    console.log('Number of results:', response.results?.length || 0)
    
    if (response.results && response.results.length > 0) {
      const firstPlace = response.results[0]
      console.log('=== COMPLETE PLACE DATA ===')
      console.log('Full place object:', firstPlace)
      console.log('Place name:', firstPlace.name)
      console.log('Place ID:', firstPlace.place_id)
      console.log('Geometry object:', firstPlace.geometry)
      
      // ตรวจสอบพิกัดในรูปแบบต่างๆ ที่อาจมี
      if (firstPlace.geometry) {
        console.log('Geometry keys:', Object.keys(firstPlace.geometry))
        
        if (firstPlace.geometry.location) {
          console.log('Location object:', firstPlace.geometry.location)
          console.log('Location keys:', Object.keys(firstPlace.geometry.location))
          console.log('Latitude:', firstPlace.geometry.location.lat)
          console.log('Longitude:', firstPlace.geometry.location.lng)
        }
        
        // ตรวจสอบรูปแบบอื่นๆ ที่อาจมี
        if (firstPlace.geometry.lat) {
          console.log('Direct lat/lng in geometry:', firstPlace.geometry.lat, firstPlace.geometry.lng)
        }
      }
      
      // ตรวจสอบข้อมูลอื่นๆ
      console.log('Types:', firstPlace.types)
      console.log('Rating:', firstPlace.rating)
      console.log('Address:', firstPlace.formatted_address)
    }
    
    return response
  } catch (error) {
    console.error('API Test Error:', error)
    throw error
  }
}

// Place Details API - ดึงรายละเอียดเต็มของสถานที่
export async function getPlaceDetails(placeId) {
  const url = `${BASE_URL}/details/json?place_id=${placeId}&language=th&region=th`
  
  console.log('Place Details API Request URL:', url)
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Place Details API Error Response:', errorText)
      throw new Error(`API error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Place Details API Response:', data)
    return data
  } catch (error) {
    console.error('Place Details API Error:', error)
    throw error
  }
}

// ดึงรีวิวของสถานที่
export async function getPlaceReviews(placeId) {
  try {
    const details = await getPlaceDetails(placeId)
    
    if (details.status === 'OK' && details.result) {
      const place = details.result
      
      return {
        place_id: placeId,
        name: place.name,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        reviews: place.reviews || [], // รีวิวจาก Google Places API
        opening_hours: place.opening_hours,
        formatted_phone_number: place.formatted_phone_number,
        website: place.website,
        photos: place.photos || []
      }
    }
    
    return null
  } catch (error) {
    console.error('Get Place Reviews Error:', error)
    throw error
  }
}

// ===== Google Places Photo API =====

// สร้าง URL รูปภาพจาก photo_reference
export function getPlacePhotoUrl(photoReference, maxWidth = 800) {
  if (!photoReference) return null
  
  const url = `https://google-map-places.p.rapidapi.com/maps/api/place/photo?photo_reference=${photoReference}&maxwidth=${maxWidth}`
  
  console.log('Photo URL generated:', url)
  return url
}

// ดึงรูปภาพจาก Google Places Photo API
export async function fetchPlacePhoto(photoReference, maxWidth = 800) {
  if (!photoReference) return null
  
  const url = `https://google-map-places.p.rapidapi.com/maps/api/place/photo?photo_reference=${photoReference}&maxwidth=${maxWidth}`
  
  console.log('Fetching photo from API:', url)
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY
      },
      redirect: 'follow'
    })

    if (!response.ok) {
      console.error('Photo API Error:', response.status, response.statusText)
      return null
    }

    // API จะ redirect ไปยัง Google Photos URL จริง
    console.log('Photo API Response URL:', response.url)
    return response.url
  } catch (error) {
    console.error('Photo API Error:', error)
    return null
  }
}

// ดึงข้อมูลรูปภาพทั้งหมดจาก place.photos
export function processPlacePhotos(placePhotos = [], maxPhotos = 10) {
  if (!placePhotos || placePhotos.length === 0) return []
  
  console.log('Processing place photos:', placePhotos.length)
  
  return placePhotos.slice(0, maxPhotos).map((photo, index) => ({
    photo_reference: photo.photo_reference,
    width: photo.width,
    height: photo.height,
    thumbnail_url: getPlacePhotoUrl(photo.photo_reference, 400),
    medium_url: getPlacePhotoUrl(photo.photo_reference, 800),
    large_url: getPlacePhotoUrl(photo.photo_reference, 1200),
    attributions: photo.html_attributions || [],
    index: index
  }))
}

// ดึงรูปภาพทั้งหมดของสถานที่
export async function getPlacePhotos(placeId, maxPhotos = 10) {
  try {
    const details = await getPlaceDetails(placeId)
    
    if (details.status === 'OK' && details.result && details.result.photos) {
      const photos = details.result.photos.slice(0, maxPhotos)
      
      console.log('📸 Processing photos:', photos.length)
      
      // โหลดรูปภาพแบบ parallel
      const photoPromises = photos.map(async (photo, index) => {
        const photoUrl = await getPlacePhotoByReference(photo.photo_reference, 800)
        const thumbnailUrl = await getPlacePhotoByReference(photo.photo_reference, 400)
        
        return {
          photo_reference: photo.photo_reference,
          width: photo.width,
          height: photo.height,
          url: photoUrl,
          thumbnail_url: thumbnailUrl,
          attributions: photo.html_attributions || [],
          index: index
        }
      })
      
      const resolvedPhotos = await Promise.all(photoPromises)
      return resolvedPhotos.filter(photo => photo.url) // กรองเฉพาะรูปที่โหลดได้
    }
    
    return []
  } catch (error) {
    console.error('Get Place Photos Error:', error)
    return []
  }
}

// ดึงรูปภาพหลักของสถานที่
export async function getPlaceMainPhoto(placeId) {
  try {
    const photos = await getPlacePhotos(placeId, 1)
    return photos.length > 0 ? photos[0] : null
  } catch (error) {
    console.error('Get Place Main Photo Error:', error)
    return null
  }
}
