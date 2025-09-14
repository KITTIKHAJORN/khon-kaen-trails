import { useState, useEffect, useCallback } from 'react';
import { 
  textSearch, 
  nearbySearch, 
  searchKhonKaenRestaurants,
  searchKhonKaenAttractions,
  searchKhonKaenHotels,
  searchKhonKaenUniversities,
  searchKhonKaenMalls,
  searchNearbyKhonKaen
} from '@/api/mapapi';

// Types for Places API response
export interface PlacePhoto {
  height: number;
  width: number;
  photo_reference: string;
}

export interface PlaceGeometry {
  location: {
    lat: number;
    lng: number;
  };
  viewport?: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
  // รองรับรูปแบบอื่นๆ ที่อาจมาจาก API
  lat?: number;
  lng?: number;
}

export interface Place {
  place_id: string;
  name: string;
  formatted_address?: string;
  geometry: PlaceGeometry;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  types: string[];
  photos?: PlacePhoto[];
  opening_hours?: {
    open_now: boolean;
  };
  business_status?: string;
}

export interface PlacesResponse {
  results: Place[];
  status: string;
  next_page_token?: string;
}

// Hook for general places search
export const usePlacesSearch = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPlaces = useCallback(async (params: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await textSearch(params);
      if (response.status === 'OK') {
        setPlaces(response.results || []);
      } else {
        setError(`API Error: ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการค้นหา');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchNearby = useCallback(async (params: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await nearbySearch(params);
      if (response.status === 'OK') {
        setPlaces(response.results || []);
      } else {
        setError(`API Error: ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการค้นหา');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    places,
    loading,
    error,
    searchPlaces,
    searchNearby,
    clearPlaces: () => setPlaces([]),
    clearError: () => setError(null)
  };
};

// Hook for Khon Kaen specific searches
export const useKhonKaenPlaces = () => {
  const [restaurants, setRestaurants] = useState<Place[]>([]);
  const [attractions, setAttractions] = useState<Place[]>([]);
  const [hotels, setHotels] = useState<Place[]>([]);
  const [universities, setUniversities] = useState<Place[]>([]);
  const [malls, setMalls] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(async (query?: string, radius?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchKhonKaenRestaurants(query, radius);
      if (response.status === 'OK') {
        setRestaurants(response.results || []);
      } else {
        setError(`API Error: ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการค้นหาร้านอาหาร');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAttractions = useCallback(async (query?: string, radius?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchKhonKaenAttractions(query, radius);
      if (response.status === 'OK') {
        setAttractions(response.results || []);
      } else {
        setError(`API Error: ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการค้นหาสถานที่ท่องเที่ยว');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHotels = useCallback(async (query?: string, radius?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchKhonKaenHotels(query, radius);
      if (response.status === 'OK') {
        setHotels(response.results || []);
      } else {
        setError(`API Error: ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการค้นหาที่พัก');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUniversities = useCallback(async (query?: string, radius?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchKhonKaenUniversities(query, radius);
      if (response.status === 'OK') {
        setUniversities(response.results || []);
      } else {
        setError(`API Error: ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการค้นหามหาวิทยาลัย');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMalls = useCallback(async (query?: string, radius?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchKhonKaenMalls(query, radius);
      if (response.status === 'OK') {
        setMalls(response.results || []);
      } else {
        setError(`API Error: ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการค้นหาห้างสรรพสินค้า');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading all categories from API...');
      
      const [
        restaurantsRes,
        attractionsRes,
        hotelsRes,
        universitiesRes,
        mallsRes
      ] = await Promise.all([
        searchKhonKaenRestaurants('ร้านอาหาร', 10000), // เพิ่ม radius
        searchKhonKaenAttractions('สถานที่ท่องเที่ยว', 15000),
        searchKhonKaenHotels('โรงแรม', 10000),
        searchKhonKaenUniversities('มหาวิทยาลัย', 10000),
        searchKhonKaenMalls('ห้างสรรพสินค้า', 10000)
      ]);

      console.log('📊 API Results:');
      console.log('- Restaurants:', restaurantsRes.results?.length || 0);
      console.log('- Attractions:', attractionsRes.results?.length || 0);
      console.log('- Hotels:', hotelsRes.results?.length || 0);
      console.log('- Universities:', universitiesRes.results?.length || 0);
      console.log('- Malls:', mallsRes.results?.length || 0);

      if (restaurantsRes.status === 'OK') setRestaurants(restaurantsRes.results || []);
      if (attractionsRes.status === 'OK') setAttractions(attractionsRes.results || []);
      if (hotelsRes.status === 'OK') setHotels(hotelsRes.results || []);
      if (universitiesRes.status === 'OK') setUniversities(universitiesRes.results || []);
      if (mallsRes.status === 'OK') setMalls(mallsRes.results || []);

    } catch (err) {
      console.error('❌ Error loading categories:', err);
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    restaurants,
    attractions,
    hotels,
    universities,
    malls,
    loading,
    error,
    fetchRestaurants,
    fetchAttractions,
    fetchHotels,
    fetchUniversities,
    fetchMalls,
    fetchAllCategories,
    clearError: () => setError(null)
  };
};

// Hook for getting place photo URL
export const usePlacePhoto = () => {
  const getPhotoUrl = useCallback((photoReference: string, maxWidth: number = 400) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=YOUR_GOOGLE_MAPS_API_KEY`;
  }, []);

  return { getPhotoUrl };
};

// Utility functions
export const getPlaceCoordinates = (place: Place): { lat: number; lng: number } | null => {
  // ลองหาพิกัดจากโครงสร้างข้อมูลต่างๆ ที่อาจมี
  
  // รูปแบบมาตรฐาน: geometry.location.lat/lng
  if (place.geometry?.location?.lat && place.geometry?.location?.lng) {
    return {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng
    };
  }
  
  // รูปแบบอื่น: geometry.lat/lng โดยตรง
  if (place.geometry?.lat && place.geometry?.lng) {
    return {
      lat: place.geometry.lat,
      lng: place.geometry.lng
    };
  }
  
  // รูปแบบอื่น: lat/lng ใน root object
  if ((place as any).lat && (place as any).lng) {
    return {
      lat: (place as any).lat,
      lng: (place as any).lng
    };
  }
  
  console.warn('No coordinates found for place:', place.name, place);
  return null;
};

export const formatPlaceTypes = (types: string[]): string => {
  const typeMap: { [key: string]: string } = {
    restaurant: 'ร้านอาหาร',
    tourist_attraction: 'สถานที่ท่องเที่ยว',
    lodging: 'ที่พัก',
    shopping_mall: 'ห้างสรรพสินค้า',
    university: 'มหาวิทยาลัย',
    hospital: 'โรงพยาบาล',
    gas_station: 'ปั๊มน้ำมัน',
    bank: 'ธนาคาร',
    atm: 'ตู้ ATM',
    pharmacy: 'ร้านขายยา',
    convenience_store: 'ร้านสะดวกซื้อ'
  };

  const mainType = types.find(type => typeMap[type]);
  return mainType ? typeMap[mainType] : 'สถานที่';
};

export const getPriceLevel = (priceLevel?: number): string => {
  if (!priceLevel) return 'ไม่ระบุราคา';
  
  const levels = ['ฟรี', 'ราคาประหยัด', 'ราคาปานกลาง', 'ราคาแพง', 'ราคาแพงมาก'];
  return levels[priceLevel] || 'ไม่ระบุราคา';
};
