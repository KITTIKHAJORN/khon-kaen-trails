// weatherapi.js
// Weather API integration using RapidAPI - Open Weather API

const RAPIDAPI_HOST = 'open-weather13.p.rapidapi.com'
const RAPIDAPI_KEY = '2ed1b7b119msh21fe7e2cef81710p1743f8jsneb5527ebb396'
const BASE_URL = 'https://open-weather13.p.rapidapi.com'

// Current Weather API - ดึงข้อมูลสภาพอากาศปัจจุบัน (ใช้ข้อมูลจากพยากรณ์ 5 วัน)
export async function getCurrentWeather(params = {}) {
  const {
    lat = null, // ละติจูด (ต้องระบุ)
    lon = null, // ลองติจูด (ต้องระบุ)
    lang = 'th' // ภาษาไทย
  } = params

  // ตรวจสอบว่ามีพิกัดหรือไม่
  if (!lat || !lon) {
    throw new Error('กรุณาระบุละติจูดและลองติจูด')
  }

  // ใช้ข้อมูลจากพยากรณ์ 5 วัน โดยเอาข้อมูลแรก (ปัจจุบัน)
  const forecastData = await getForecastWeather({ lat, lon, lang })
  
  if (!forecastData || !forecastData.list || forecastData.list.length === 0) {
    throw new Error('ไม่พบข้อมูลสภาพอากาศ')
  }

  // เอาข้อมูลแรกจากรายการพยากรณ์เป็นข้อมูลปัจจุบัน
  const currentData = {
    ...forecastData,
    current: forecastData.list[0],
    main: forecastData.list[0].main,
    weather: forecastData.list[0].weather,
    wind: forecastData.list[0].wind,
    dt: forecastData.list[0].dt
  }

  console.log('Current Weather Data (from forecast):', currentData)
  return currentData
}

// Forecast Weather API - ดึงข้อมูลพยากรณ์อากาศ 5 วัน
export async function getForecastWeather(params = {}) {
  const {
    lat = null, // ละติจูด (ต้องระบุ)
    lon = null, // ลองติจูด (ต้องระบุ)
    lang = 'th' // ภาษาไทย
  } = params

  // ตรวจสอบว่ามีพิกัดหรือไม่
  if (!lat || !lon) {
    throw new Error('กรุณาระบุละติจูดและลองติจูด')
  }

  // ปรับพิกัดให้แม่นยำขึ้น (ใช้ทศนิยม 6 ตำแหน่ง)
  const preciseLat = parseFloat(lat).toFixed(6)
  const preciseLon = parseFloat(lon).toFixed(6)

  const queryParams = new URLSearchParams({
    latitude: preciseLat,
    longitude: preciseLon,
    lang: lang
  })

  const url = `${BASE_URL}/fivedaysforcast?${queryParams}`

  console.log('Forecast Weather API Request URL:', url)
  console.log('Forecast Weather API Request Params:', Object.fromEntries(queryParams))
  console.log('📍 พิกัดที่ใช้:', { lat: preciseLat, lon: preciseLon })

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
      console.error('Forecast Weather API Error Response:', errorText)
      throw new Error(`Forecast Weather API error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Forecast Weather API Response Data:', data)
    
    // ตรวจสอบและปรับปรุงข้อมูลที่ได้
    if (data && data.list && data.list.length > 0) {
      console.log('✅ ได้รับข้อมูลสภาพอากาศสำเร็จ:', data.list.length, 'รายการ')
      
      // ตรวจสอบและแก้ไขข้อมูลอุณหภูมิในทุกรายการ
      data.list.forEach((item, index) => {
        if (item.main && item.main.temp) {
          const originalTemp = item.main.temp
          console.log(`📊 ข้อมูลที่ ${index + 1}: อุณหภูมิดิบ ${originalTemp}`)
          
          // ตรวจสอบว่าอุณหภูมิเป็น Kelvin หรือไม่
          if (item.main.temp > 200) {
            item.main.temp = item.main.temp - 273.15 // แปลงจาก Kelvin เป็น Celsius
            console.log(`🌡️ แปลงอุณหภูมิจาก Kelvin: ${originalTemp}K → ${item.main.temp.toFixed(1)}°C`)
          }
          
          // ตรวจสอบว่าอุณหภูมิสมเหตุสมผลหรือไม่
          if (item.main.temp > 50 || item.main.temp < -20) {
            console.warn(`⚠️ อุณหภูมิไม่สมเหตุสมผลที่ ${index + 1}: ${item.main.temp}°C`)
            console.log('❌ ข้อมูลอุณหภูมิไม่ถูกต้อง - ใช้ข้อมูลจาก API เท่านั้น')
          }
          
          console.log(`🌡️ อุณหภูมิสุดท้ายที่ ${index + 1}: ${item.main.temp}°C`)
        }
        
        // ตรวจสอบข้อมูลความชื้น
        if (item.main && item.main.humidity) {
          if (item.main.humidity > 100 || item.main.humidity < 0) {
            console.warn(`⚠️ ความชื้นไม่สมเหตุสมผลที่ ${index + 1}: ${item.main.humidity}%`)
            console.log('❌ ข้อมูลความชื้นไม่ถูกต้อง - ใช้ข้อมูลจาก API เท่านั้น')
          }
        }
        
        // ตรวจสอบข้อมูลความกดอากาศ
        if (item.main && item.main.pressure) {
          if (item.main.pressure < 900 || item.main.pressure > 1100) {
            console.warn(`⚠️ ความกดอากาศไม่สมเหตุสมผลที่ ${index + 1}: ${item.main.pressure} hPa`)
            console.log('❌ ข้อมูลความกดอากาศไม่ถูกต้อง - ใช้ข้อมูลจาก API เท่านั้น')
          }
        }
      })
    }
    
    return data
  } catch (error) {
    console.error('Forecast Weather API Error:', error)
    throw error
  }
}

// Air Pollution API - ดึงข้อมูลมลพิษทางอากาศ
export async function getAirPollution(params = {}) {
  const {
    place = 'Khon Kaen,TH', // ขอนแก่น, ประเทศไทย
    units = 'metric',
    lang = 'th',
    mode = 'json'
  } = params

  const queryParams = new URLSearchParams({
    place,
    units,
    lang,
    mode
  })

  const url = `${BASE_URL}/air-pollution?${queryParams}`

  console.log('Air Pollution API Request URL:', url)
  console.log('Air Pollution API Request Params:', Object.fromEntries(queryParams))

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Air Pollution API Error Response:', errorText)
      throw new Error(`Air Pollution API error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Air Pollution API Response Data:', data)
    return data
  } catch (error) {
    console.error('Air Pollution API Error:', error)
    throw error
  }
}

// ===== ฟังก์ชันเฉพาะสำหรับขอนแก่น =====

// ตรวจสอบว่าพิกัดอยู่ในรัศมี 500 เมตรจากจุดอ้างอิง
export function isWithin500Meters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // รัศมีโลกในหน่วยเมตร
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // ระยะทางในหน่วยเมตร
  
  return distance <= 500; // ตรวจสอบว่าอยู่ในรัศมี 500 เมตร
}

// หาพิกัดที่ใกล้ที่สุดในรัศมี 500 เมตร
export function findNearestWeatherPoint(targetLat, targetLon, weatherPoints) {
  let nearestPoint = null;
  let minDistance = Infinity;
  
  weatherPoints.forEach(point => {
    const distance = calculateDistance(targetLat, targetLon, point.lat, point.lon);
    if (distance < minDistance && distance <= 500) {
      minDistance = distance;
      nearestPoint = point;
    }
  });
  
  return nearestPoint;
}

// คำนวณระยะทางระหว่างสองจุด
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // รัศมีโลกในหน่วยเมตร
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // ระยะทางในหน่วยเมตร
}

// ดึงข้อมูลสภาพอากาศปัจจุบันในขอนแก่น
export async function getKhonKaenCurrentWeather() {
  return getCurrentWeather({
    lat: 16.4419, // ละติจูดของขอนแก่น
    lon: 102.8358, // ลองติจูดของขอนแก่น
    lang: 'th'
  })
}

// ดึงข้อมูลสภาพอากาศตามพิกัด
export async function getWeatherByCoordinates(lat, lon) {
  return getCurrentWeather({
    lat: lat,
    lon: lon,
    lang: 'th'
  })
}

// ดึงข้อมูลพยากรณ์อากาศในขอนแก่น
export async function getKhonKaenForecast() {
  return getForecastWeather({
    lat: 16.4419,
    lon: 102.8358,
    lang: 'th'
  })
}

// ดึงข้อมูลพยากรณ์อากาศตามพิกัด
export async function getForecastByCoordinates(lat, lon) {
  return getForecastWeather({
    lat: lat,
    lon: lon,
    lang: 'th'
  })
}

// ดึงข้อมูลมลพิษทางอากาศในขอนแก่น
export async function getKhonKaenAirPollution() {
  return getAirPollution({
    place: 'Khon Kaen,TH',
    units: 'metric',
    lang: 'th'
  })
}

// ดึงข้อมูลสภาพอากาศครบถ้วนในขอนแก่น
export async function getKhonKaenWeatherData() {
  try {
    // ใช้ข้อมูลจากพยากรณ์ 5 วันเท่านั้น
    const forecast = await getKhonKaenForecast()
    
    if (!forecast || !forecast.list || forecast.list.length === 0) {
      throw new Error('ไม่พบข้อมูลสภาพอากาศ')
    }

    // เอาข้อมูลแรกจากรายการพยากรณ์เป็นข้อมูลปัจจุบัน
    const current = {
      ...forecast.list[0],
      main: forecast.list[0].main,
      weather: forecast.list[0].weather,
      wind: forecast.list[0].wind,
      dt: forecast.list[0].dt
    }

    return {
      current,
      forecast,
      coordinates: { lat: 16.4419, lon: 102.8358 },
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching complete weather data:', error)
    throw error
  }
}

// ดึงข้อมูลสภาพอากาศและพยากรณ์อากาศครบถ้วนตามพิกัดในขอนแก่น
export async function getWeatherDataByCoordinates(lat, lon) {
  try {
    console.log(`📍 ดึงข้อมูลสภาพอากาศสำหรับพิกัด: ${lat}, ${lon}`);
    
    // ใช้ข้อมูลจากพยากรณ์ 5 วันเท่านั้น เพราะ API มีแค่ endpoint เดียว
    const forecast = await getForecastByCoordinates(lat, lon)
    
    if (!forecast || !forecast.list || forecast.list.length === 0) {
      throw new Error('ไม่พบข้อมูลสภาพอากาศ')
    }

    // เอาข้อมูลแรกจากรายการพยากรณ์เป็นข้อมูลปัจจุบัน
    const current = {
      ...forecast.list[0],
      main: forecast.list[0].main,
      weather: forecast.list[0].weather,
      wind: forecast.list[0].wind,
      dt: forecast.list[0].dt
    }

    // ตรวจสอบและแก้ไขข้อมูลอุณหภูมิ
    if (current.main && current.main.temp) {
      console.log(`🌡️ อุณหภูมิดิบ: ${current.main.temp}`);
      
      // ตรวจสอบว่าอุณหภูมิเป็น Kelvin หรือไม่
      if (current.main.temp > 200) {
        current.main.temp = current.main.temp - 273.15; // แปลงจาก Kelvin เป็น Celsius
        console.log(`🌡️ แปลงอุณหภูมิจาก Kelvin: ${current.main.temp + 273.15}K → ${current.main.temp.toFixed(1)}°C`);
      }
      
      // ตรวจสอบว่าอุณหภูมิสมเหตุสมผลหรือไม่
      if (current.main.temp > 50 || current.main.temp < -20) {
        console.warn('⚠️ อุณหภูมิไม่สมเหตุสมผล:', current.main.temp);
        console.log('❌ ข้อมูลอุณหภูมิไม่ถูกต้อง - ใช้ข้อมูลจาก API เท่านั้น');
      }
      
      console.log(`🌡️ อุณหภูมิสุดท้าย: ${current.main.temp}°C`);
    }

    // ตรวจสอบข้อมูล UV Index
    console.log('🔍 ตรวจสอบข้อมูล UV Index:');
    console.log('  - current.uvi:', current.uvi);
    console.log('  - current.main.uvi:', current.main?.uvi);
    console.log('  - current.sys.uvi:', current.sys?.uvi);
    console.log('  - current.uv:', current.uv);
    
    // ลองหาข้อมูล UV Index จากหลายที่
    let uvIndex = null;
    if (current.uvi !== undefined && current.uvi !== null) {
      uvIndex = current.uvi;
      console.log(`☀️ พบ UV Index ใน current.uvi: ${uvIndex}`);
    } else if (current.main && current.main.uvi !== undefined && current.main.uvi !== null) {
      uvIndex = current.main.uvi;
      console.log(`☀️ พบ UV Index ใน current.main.uvi: ${uvIndex}`);
    } else if (current.sys && current.sys.uvi !== undefined && current.sys.uvi !== null) {
      uvIndex = current.sys.uvi;
      console.log(`☀️ พบ UV Index ใน current.sys.uvi: ${uvIndex}`);
    } else if (current.uv !== undefined && current.uv !== null) {
      uvIndex = current.uv;
      console.log(`☀️ พบ UV Index ใน current.uv: ${uvIndex}`);
    } else {
      console.log('⚠️ ไม่พบข้อมูล UV Index ใน API response');
      // ตรวจสอบข้อมูลทั้งหมดใน current object
      console.log('📋 ข้อมูลทั้งหมดใน current object:', Object.keys(current));
      if (current.main) {
        console.log('📋 ข้อมูลทั้งหมดใน current.main:', Object.keys(current.main));
      }
    }
    
    // ตั้งค่า UV Index
    if (uvIndex !== null) {
      current.uvi = uvIndex;
      console.log(`✅ ตั้งค่า UV Index: ${uvIndex}`);
    } else {
      console.log('❌ ไม่สามารถหาข้อมูล UV Index ได้');
    }

    // ตรวจสอบข้อมูลสภาพอากาศ
    if (current.weather && current.weather[0]) {
      const weatherDesc = current.weather[0].description;
      console.log(`🌤️ สภาพอากาศ: ${weatherDesc}`);
    }

    return {
      current,
      forecast,
      coordinates: { lat, lon },
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching weather data by coordinates:', error)
    throw error
  }
}

// ดึงข้อมูลสภาพอากาศตามสถานที่ในขอนแก่น (ใช้ร่วมกับ mapapi.js)
export async function getWeatherByPlace(placeData) {
  if (!placeData || !placeData.geometry || !placeData.geometry.location) {
    throw new Error('ข้อมูลสถานที่ไม่ถูกต้อง')
  }
  
  const { lat, lng } = placeData.geometry.location
  console.log(`🏢 ดึงข้อมูลสภาพอากาศสำหรับสถานที่: ${placeData.name || 'ไม่ระบุชื่อ'}`);
  console.log(`📍 พิกัดสถานที่: ${lat}, ${lng}`);
  
  return getWeatherDataByCoordinates(lat, lng)
}

// ดึงข้อมูลสภาพอากาศในรัศมี 500 เมตรจากสถานที่ที่ระบุ
export async function getWeatherWithin500Meters(placeData, radiusMeters = 500) {
  if (!placeData || !placeData.geometry || !placeData.geometry.location) {
    throw new Error('ข้อมูลสถานที่ไม่ถูกต้อง')
  }
  
  const { lat, lng } = placeData.geometry.location
  console.log(`🎯 ดึงข้อมูลสภาพอากาศในรัศมี ${radiusMeters} เมตรจาก: ${placeData.name || 'ไม่ระบุชื่อ'}`);
  console.log(`📍 พิกัดสถานที่: ${lat}, ${lng}`);
  
  // ดึงข้อมูลสภาพอากาศตามพิกัดที่ระบุ
  const weatherData = await getWeatherDataByCoordinates(lat, lng)
  
  // เพิ่มข้อมูลรัศมี
  return {
    ...weatherData,
    placeInfo: {
      name: placeData.name || 'ไม่ระบุชื่อ',
      address: placeData.vicinity || placeData.formatted_address || 'ไม่ระบุที่อยู่',
      radius: radiusMeters
    }
  }
}

// ดึงข้อมูลสภาพอากาศตามชื่อสถานที่ในขอนแก่น
export async function getWeatherByPlaceName(placeName) {
  // ฟังก์ชันนี้จะต้องใช้ร่วมกับ mapapi.js เพื่อค้นหาสถานที่ก่อน
  // จากนั้นจึงดึงข้อมูลสภาพอากาศตามพิกัดของสถานที่นั้น
  throw new Error('กรุณาใช้ getWeatherByPlace() พร้อมกับข้อมูลจาก mapapi.js')
}

// Helper function - แปลงอุณหภูมิ
export function formatTemperature(temp, unit = '°C') {
  if (temp === null || temp === undefined) return 'ไม่ระบุ'
  
  // ตรวจสอบว่าอุณหภูมิเป็น Kelvin หรือไม่ (มากกว่า 200)
  let celsiusTemp = temp
  if (temp > 200) {
    celsiusTemp = temp - 273.15 // แปลงจาก Kelvin เป็น Celsius
    console.log(`🌡️ แปลงอุณหภูมิจาก Kelvin: ${temp}K → ${celsiusTemp.toFixed(1)}°C`)
  }
  
  // ตรวจสอบว่าอุณหภูมิสมเหตุสมผลหรือไม่
  if (celsiusTemp > 50 || celsiusTemp < -20) {
    console.warn(`⚠️ อุณหภูมิไม่สมเหตุสมผล: ${celsiusTemp}°C`)
    // ใช้ค่าเริ่มต้นถ้าอุณหภูมิไม่สมเหตุสมผล
    celsiusTemp = 25
  }
  
  return `${Math.round(celsiusTemp)}${unit}`
}

// Helper function - แปลงความชื้น
export function formatHumidity(humidity) {
  if (humidity === null || humidity === undefined) return 'ไม่ระบุ'
  return `${humidity}%`
}

// Helper function - แปลงความเร็วลม
export function formatWindSpeed(speed, unit = 'm/s') {
  if (speed === null || speed === undefined) return 'ไม่ระบุ'
  return `${speed} ${unit}`
}

// Helper function - แปลงความกดอากาศ
export function formatPressure(pressure, unit = 'hPa') {
  if (pressure === null || pressure === undefined) return 'ไม่ระบุ'
  return `${pressure} ${unit}`
}

// Helper function - แปลง UV Index
export function formatUVIndex(uv) {
  if (uv === null || uv === undefined || uv === '') {
    console.log('⚠️ ไม่พบข้อมูล UV Index');
    return 'ไม่ระบุ'
  }
  
  // ตรวจสอบว่าค่าเป็นตัวเลขหรือไม่
  const uvValue = parseFloat(uv);
  if (isNaN(uvValue)) {
    console.log('⚠️ UV Index ไม่ใช่ตัวเลข:', uv);
    return 'ไม่ระบุ'
  }
  
  // แปลงค่า UV Index เป็นคำอธิบาย
  let level = ''
  let description = ''
  let color = ''
  
  if (uvValue <= 2) {
    level = 'ต่ำ'
    description = 'ปลอดภัย'
    color = '🟢'
  } else if (uvValue <= 5) {
    level = 'ปานกลาง'
    description = 'ระวังเล็กน้อย'
    color = '🟡'
  } else if (uvValue <= 7) {
    level = 'สูง'
    description = 'อันตรายปานกลาง'
    color = '🟠'
  } else if (uvValue <= 10) {
    level = 'สูงมาก'
    description = 'อันตรายสูง'
    color = '🔴'
  } else {
    level = 'อันตราย'
    description = 'อันตรายมาก'
    color = '🟣'
  }
  
  const result = `${color} ${uvValue} (${level})`
  console.log(`☀️ UV Index: ${result} - ${description}`);
  return result
}
