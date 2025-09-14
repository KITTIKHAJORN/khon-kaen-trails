import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Star, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPlaceTypes, type Place } from '@/hooks/usePlaces';

interface SimpleMapProps {
  places: Place[];
  selectedCategories: string[];
  onPlaceSelect?: (place: Place) => void;
  className?: string;
  height?: string;
  showControls?: boolean;
  showLegend?: boolean;
}

export const SimpleMap: React.FC<SimpleMapProps> = ({
  places,
  selectedCategories,
  onPlaceSelect,
  className = '',
  height = '600px',
  showControls = true,
  showLegend = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 16.4419, lng: 102.8360 }); // Khon Kaen
  const [zoom, setZoom] = useState(12);

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

  // Get marker color based on place type
  const getMarkerColor = (place: Place): string => {
    const types = place.types;
    if (types.some(type => type.includes('restaurant') || type.includes('food'))) {
      return '#EF4444'; // Red for restaurants
    } else if (types.some(type => type.includes('tourist_attraction') || type.includes('park'))) {
      return '#10B981'; // Green for attractions
    } else if (types.some(type => type.includes('lodging'))) {
      return '#8B5CF6'; // Purple for hotels
    } else if (types.some(type => type.includes('shopping'))) {
      return '#F59E0B'; // Orange for shopping
    } else if (types.some(type => type.includes('university'))) {
      return '#06B6D4'; // Cyan for universities
    }
    return '#3B82F6'; // Default blue
  };

  // Convert lat/lng to pixel coordinates (simplified projection)
  const latLngToPixel = (lat: number, lng: number, mapBounds: any) => {
    const x = ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100;
    const y = ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  // Calculate map bounds based on places
  const getMapBounds = () => {
    if (filteredPlaces.length === 0) {
      return {
        north: mapCenter.lat + 0.05,
        south: mapCenter.lat - 0.05,
        east: mapCenter.lng + 0.05,
        west: mapCenter.lng - 0.05
      };
    }

    const lats = filteredPlaces.map(p => p.geometry?.location.lat).filter(Boolean) as number[];
    const lngs = filteredPlaces.map(p => p.geometry?.location.lng).filter(Boolean) as number[];

    const padding = 0.01;
    return {
      north: Math.max(...lats) + padding,
      south: Math.min(...lats) - padding,
      east: Math.max(...lngs) + padding,
      west: Math.min(...lngs) - padding
    };
  };

  const mapBounds = getMapBounds();

  const handleGetDirections = (place: Place) => {
    const destination = `${place.geometry.location.lat},${place.geometry.location.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, '_blank');
  };

  const handleRecenter = () => {
    setMapCenter({ lat: 16.4419, lng: 102.8360 });
    setZoom(12);
  };

  const handleFitBounds = () => {
    if (filteredPlaces.length > 0) {
      const lats = filteredPlaces.map(p => p.geometry?.location.lat).filter(Boolean) as number[];
      const lngs = filteredPlaces.map(p => p.geometry?.location.lng).filter(Boolean) as number[];
      
      const centerLat = (Math.max(...lats) + Math.min(...lats)) / 2;
      const centerLng = (Math.max(...lngs) + Math.min(...lngs)) / 2;
      
      setMapCenter({ lat: centerLat, lng: centerLng });
      setZoom(13);
    }
  };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Map Background */}
      <div 
        ref={mapRef}
        className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg relative overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, rgba(59, 130, 246, 0.05) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(16, 185, 129, 0.05) 25%, transparent 25%)
          `,
          backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px'
        }}
      >
        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={`h-${i}`}
              className="absolute border-t border-gray-300"
              style={{ top: `${i * 10}%`, width: '100%' }}
            />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={`v-${i}`}
              className="absolute border-l border-gray-300"
              style={{ left: `${i * 10}%`, height: '100%' }}
            />
          ))}
        </div>

        {/* Khon Kaen City Center */}
        <div
          className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${latLngToPixel(16.4419, 102.8360, mapBounds).x}%`,
            top: `${latLngToPixel(16.4419, 102.8360, mapBounds).y}%`
          }}
        />

        {/* Place Markers */}
        {filteredPlaces
          .filter(place => place.geometry?.location)
          .map((place) => {
            const position = latLngToPixel(
              place.geometry!.location.lat,
              place.geometry!.location.lng,
              mapBounds
            );
            const color = getMarkerColor(place);
            
            return (
              <div
                key={place.place_id}
                className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer hover:scale-110 transition-transform"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  zIndex: selectedPlace?.place_id === place.place_id ? 20 : 10
                }}
                onClick={() => setSelectedPlace(selectedPlace?.place_id === place.place_id ? null : place)}
              >
                {/* Marker */}
                <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M12 0C5.373 0 0 5.373 0 12C0 18.627 12 30 12 30C12 30 24 18.627 24 12C24 5.373 18.627 0 12 0Z" 
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <circle cx="12" cy="12" r="6" fill="white"/>
                  <circle cx="12" cy="12" r="3" fill={color}/>
                </svg>
                
                {/* Popup */}
                {selectedPlace?.place_id === place.place_id && (
                  <Card className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 z-30 shadow-lg">
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2">{place.name}</h3>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-primary/10 text-primary text-xs">
                          {formatPlaceTypes(place.types)}
                        </Badge>
                        {place.opening_hours?.open_now !== undefined && (
                          <Badge 
                            variant={place.opening_hours.open_now ? "default" : "destructive"}
                            className={`text-xs ${place.opening_hours.open_now ? "bg-green-100 text-green-800" : ""}`}
                          >
                            {place.opening_hours.open_now ? 'เปิดอยู่' : 'ปิดแล้ว'}
                          </Badge>
                        )}
                      </div>

                      {place.rating && (
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{place.rating.toFixed(1)}</span>
                          {place.user_ratings_total && (
                            <span className="text-sm text-muted-foreground">
                              ({place.user_ratings_total.toLocaleString()})
                            </span>
                          )}
                        </div>
                      )}

                      {place.formatted_address && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {place.formatted_address}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => onPlaceSelect?.(place)}
                          className="flex-1"
                        >
                          ดูรายละเอียด
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGetDirections(place)}
                        >
                          <Navigation className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
      </div>

      {/* Map Legend */}
      {showLegend && (
        <Card className="absolute top-4 left-4 z-[1000] max-w-xs">
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
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span>ใจกลางเมืองขอนแก่น</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Controls */}
      {showControls && (
        <>
          {/* Places Counter */}
          <Card className="absolute top-4 right-4 z-[1000]">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">{filteredPlaces.length} สถานที่</span>
              </div>
            </CardContent>
          </Card>

          {/* Control Buttons */}
          <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
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
              disabled={filteredPlaces.length === 0}
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      {/* Instructions */}
      <Card className="absolute bottom-4 left-4 z-[1000] max-w-xs">
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">
            💡 คลิกที่ marker เพื่อดูข้อมูลสถานที่
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
