import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Star, Clock, Phone, Globe, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPlaceTypes, type Place } from '@/hooks/usePlaces';

// ใช้ข้อมูลจาก mapapi.js ที่มีอยู่แล้ว - ไม่ต้องใช้ Google Maps API Key เพิ่มเติม
// ข้อมูลสถานที่มาจาก Google Places API ผ่าน RapidAPI ใน mapapi.js

interface GoogleMapProps {
  places: Place[];
  selectedCategories: string[];
  onPlaceSelect?: (place: Place) => void;
  className?: string;
  height?: string;
  showControls?: boolean;
  showLegend?: boolean;
}

interface MarkerInfo {
  marker: google.maps.Marker;
  place: Place;
  infoWindow: google.maps.InfoWindow;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  places,
  selectedCategories,
  onPlaceSelect,
  className = '',
  height = '600px',
  showControls = true,
  showLegend = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<MarkerInfo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Khon Kaen center coordinates
  const KHON_KAEN_CENTER = { lat: 16.4419, lng: 102.8360 };

  // Load Google Maps
  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry']
    });

    loader.load().then(() => {
      setIsLoaded(true);
      initializeMap();
    }).catch((error) => {
      console.error('Error loading Google Maps:', error);
      setError('ไม่สามารถโหลด Google Maps ได้');
    });
  }, []);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google) return;

    const map = new google.maps.Map(mapRef.current, {
      center: KHON_KAEN_CENTER,
      zoom: 12,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true
    });

    mapInstanceRef.current = map;
  }, []);

  // Create marker icon based on place type
  const createMarkerIcon = (place: Place): string => {
    const types = place.types;
    let color = '#3B82F6'; // Default blue

    if (types.some(type => type.includes('restaurant') || type.includes('food'))) {
      color = '#EF4444'; // Red for restaurants
    } else if (types.some(type => type.includes('tourist_attraction') || type.includes('park'))) {
      color = '#10B981'; // Green for attractions
    } else if (types.some(type => type.includes('lodging'))) {
      color = '#8B5CF6'; // Purple for hotels
    } else if (types.some(type => type.includes('shopping'))) {
      color = '#F59E0B'; // Orange for shopping
    } else if (types.some(type => type.includes('university'))) {
      color = '#06B6D4'; // Cyan for universities
    }

    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 40 16 40C16 40 32 24.837 32 16C32 7.163 24.837 0 16 0Z" fill="${color}"/>
        <circle cx="16" cy="16" r="8" fill="white"/>
        <circle cx="16" cy="16" r="4" fill="${color}"/>
      </svg>
    `)}`;
  };

  // Create info window content
  const createInfoWindowContent = (place: Place): string => {
    const rating = place.rating ? place.rating.toFixed(1) : 'N/A';
    const reviews = place.user_ratings_total ? `(${place.user_ratings_total.toLocaleString()})` : '';
    const address = place.formatted_address || 'ขอนแก่น, ประเทศไทย';
    const placeType = formatPlaceTypes(place.types);
    const openStatus = place.opening_hours?.open_now !== undefined 
      ? place.opening_hours.open_now ? 'เปิดอยู่' : 'ปิดแล้ว'
      : '';

    return `
      <div style="max-width: 300px; padding: 12px;">
        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #1f2937;">${place.name}</h3>
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <span style="background: #3b82f6; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-right: 8px;">${placeType}</span>
          ${openStatus ? `<span style="background: ${place.opening_hours?.open_now ? '#10b981' : '#ef4444'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${openStatus}</span>` : ''}
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <span style="color: #fbbf24; margin-right: 4px;">⭐</span>
          <span style="font-weight: 600;">${rating}</span>
          <span style="color: #6b7280; margin-left: 4px;">${reviews}</span>
        </div>
        <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; line-height: 1.4;">${address}</p>
        <button 
          onclick="window.selectPlace('${place.place_id}')"
          style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;"
        >
          ดูรายละเอียด
        </button>
      </div>
    `;
  };

  // Add markers to map
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(({ marker, infoWindow }) => {
      marker.setMap(null);
      infoWindow.close();
    });
    markersRef.current = [];

    // Filter places based on selected categories
    const filteredPlaces = selectedCategories.length === 0 
      ? places 
      : places.filter(place => {
          return selectedCategories.some(category => {
            switch (category) {
              case 'ร้านอาหาร':
                return place.types.some(type => type.includes('restaurant') || type.includes('food'));
              case 'สถานที่ท่องเที่ยว':
                return place.types.some(type => type.includes('tourist_attraction') || type.includes('park'));
              case 'ที่พัก':
                return place.types.some(type => type.includes('lodging'));
              case 'แหล่งช้อปปิ้ง':
                return place.types.some(type => type.includes('shopping'));
              case 'มหาวิทยาลัย':
                return place.types.some(type => type.includes('university'));
              default:
                return true;
            }
          });
        });

    // Add new markers
    filteredPlaces.forEach(place => {
      if (!place.geometry?.location) return;

      const marker = new google.maps.Marker({
        position: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        },
        map: mapInstanceRef.current,
        title: place.name,
        icon: createMarkerIcon(place),
        animation: google.maps.Animation.DROP
      });

      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(place)
      });

      marker.addListener('click', () => {
        // Close all other info windows
        markersRef.current.forEach(({ infoWindow: otherInfoWindow }) => {
          otherInfoWindow.close();
        });
        
        // Open this info window
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push({ marker, place, infoWindow });
    });

    // Adjust map bounds to show all markers
    if (filteredPlaces.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      filteredPlaces.forEach(place => {
        if (place.geometry?.location) {
          bounds.extend(new google.maps.LatLng(
            place.geometry.location.lat,
            place.geometry.location.lng
          ));
        }
      });
      mapInstanceRef.current.fitBounds(bounds);
      
      // Don't zoom in too much for single markers
      google.maps.event.addListenerOnce(mapInstanceRef.current, 'bounds_changed', () => {
        const zoom = mapInstanceRef.current?.getZoom();
        if (zoom && zoom > 15) {
          mapInstanceRef.current?.setZoom(15);
        }
      });
    }
  }, [places, selectedCategories, isLoaded]);

  // Global function to handle place selection from info window
  useEffect(() => {
    (window as any).selectPlace = (placeId: string) => {
      const markerInfo = markersRef.current.find(({ place }) => place.place_id === placeId);
      if (markerInfo && onPlaceSelect) {
        onPlaceSelect(markerInfo.place);
      }
    };

    return () => {
      delete (window as any).selectPlace;
    };
  }, [onPlaceSelect]);

  // Map control functions
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 12;
      mapInstanceRef.current.setZoom(Math.min(currentZoom + 1, 20));
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 12;
      mapInstanceRef.current.setZoom(Math.max(currentZoom - 1, 1));
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(KHON_KAEN_CENTER);
      mapInstanceRef.current.setZoom(12);
    }
  };

  const handleFitBounds = () => {
    if (mapInstanceRef.current && markersRef.current.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markersRef.current.forEach(({ place }) => {
        if (place.geometry?.location) {
          bounds.extend(new google.maps.LatLng(
            place.geometry.location.lat,
            place.geometry.location.lng
          ));
        }
      });
      mapInstanceRef.current.fitBounds(bounds);
    }
  };

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted rounded-lg`} style={{ height }}>
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">ไม่สามารถโหลดแผนที่ได้</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="text-sm text-muted-foreground">
              กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือลองใหม่อีกครั้ง
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted rounded-lg`} style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">กำลังโหลดแผนที่...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: height }}
      />
      
      {/* Map Legend */}
      {showLegend && (
        <Card className="absolute top-4 left-4 z-10 max-w-xs">
          <CardContent className="p-3">
            <h4 className="font-semibold text-sm mb-2">สัญลักษณ์บนแผนที่</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>ร้านอาหาร</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>สถานที่ท่องเที่ยว</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>ที่พัก</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>แหล่งช้อปปิ้ง</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                <span>มหาวิทยาลัย</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Controls */}
      {showControls && (
        <>
          {/* Places Counter */}
          <Card className="absolute top-4 right-4 z-10">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">{markersRef.current.length} สถานที่</span>
              </div>
            </CardContent>
          </Card>

          {/* Zoom and Control Buttons */}
          <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white shadow-md w-10 h-10 p-0"
              onClick={handleZoomIn}
              title="ซูมเข้า"
            >
              +
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white shadow-md w-10 h-10 p-0"
              onClick={handleZoomOut}
              title="ซูมออก"
            >
              -
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white shadow-md w-10 h-10 p-0"
              onClick={handleRecenter}
              title="กลับไปที่ตำแหน่งเริ่มต้น"
            >
              <Navigation className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white shadow-md w-10 h-10 p-0"
              onClick={handleFitBounds}
              title="แสดงสถานที่ทั้งหมด"
              disabled={markersRef.current.length === 0}
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
