import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Star, Navigation, ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPlaceTypes, getPlaceCoordinates, type Place } from '@/hooks/usePlaces';

interface InteractiveOpenStreetMapProps {
  places: Place[];
  selectedCategories: string[];
  onPlaceSelect?: (place: Place) => void;
  className?: string;
  height?: string;
  showControls?: boolean;
  showLegend?: boolean;
}

interface MapTile {
  x: number;
  y: number;
  z: number;
  url: string;
}

export const InteractiveOpenStreetMap: React.FC<InteractiveOpenStreetMapProps> = ({
  places,
  selectedCategories,
  onPlaceSelect,
  className = '',
  height = '600px',
  showControls = true,
  showLegend = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapState, setMapState] = useState({
    center: { lat: 16.4419, lng: 102.8360 }, // Khon Kaen
    zoom: 12,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    mapOffset: { x: 0, y: 0 }
  });
  const [tiles, setTiles] = useState<MapTile[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedTiles, setLoadedTiles] = useState<Set<string>>(new Set());
  const tilesCache = useRef<Map<string, HTMLImageElement>>(new Map());

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

  // Convert lat/lng to tile coordinates
  const latLngToTile = (lat: number, lng: number, zoom: number) => {
    const latRad = (lat * Math.PI) / 180;
    const n = Math.pow(2, zoom);
    const x = Math.floor(((lng + 180) / 360) * n);
    const y = Math.floor(((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2) * n);
    return { x, y };
  };

  // Convert tile coordinates to lat/lng
  const tileToLatLng = (x: number, y: number, zoom: number) => {
    const n = Math.pow(2, zoom);
    const lng = (x / n) * 360 - 180;
    const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)));
    const lat = (latRad * 180) / Math.PI;
    return { lat, lng };
  };

  // Convert lat/lng to pixel coordinates - ตำแหน่งที่ล็อคกับแผนที่
  const latLngToPixelLocked = (lat: number, lng: number) => {
    if (!mapRef.current) return { x: 0, y: 0 };
    
    const containerRect = mapRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    // คำนวณตำแหน่งสัมพัทธ์กับ center ของแผนที่ (ไม่รวม offset)
    const zoom = mapState.zoom;
    
    // คำนวณระยะห่างจากจุดศูนย์กลางในหน่วย degrees
    const latDiff = lat - mapState.center.lat;
    const lngDiff = lng - mapState.center.lng;
    
    // แปลงเป็น pixels ด้วย scale ที่เหมาะสม
    const pixelsPerDegree = Math.pow(2, zoom) * 256 / 360;
    
    // คำนวณ pixel offset จากจุดศูนย์กลาง (ไม่รวม mapOffset)
    const pixelX = containerWidth / 2 + (lngDiff * pixelsPerDegree);
    const pixelY = containerHeight / 2 - (latDiff * pixelsPerDegree);
    
    return { x: pixelX, y: pixelY };
  };

  // Convert lat/lng to pixel coordinates with map offset (สำหรับ tiles)
  const latLngToPixelWithOffset = (lat: number, lng: number) => {
    const basePosition = latLngToPixelLocked(lat, lng);
    return {
      x: basePosition.x + mapState.mapOffset.x,
      y: basePosition.y + mapState.mapOffset.y
    };
  };

  // Convert place to coordinates with proper error handling
  const getPlacePixelPosition = (place: Place) => {
    const coords = getPlaceCoordinates(place);
    if (!coords) {
      console.warn('No coordinates for place:', place.name);
      return null;
    }
    return latLngToPixelLocked(coords.lat, coords.lng);
  };

  // Generate tiles for current view
  const generateTiles = useCallback(() => {
    if (!mapRef.current) return;
    
    const containerRect = mapRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    const centerTile = latLngToTile(mapState.center.lat, mapState.center.lng, mapState.zoom);
    const tileSize = 256;
    
    const tilesX = Math.ceil(containerWidth / tileSize) + 2;
    const tilesY = Math.ceil(containerHeight / tileSize) + 2;
    
    const newTiles: MapTile[] = [];
    
    for (let x = centerTile.x - Math.floor(tilesX / 2); x <= centerTile.x + Math.floor(tilesX / 2); x++) {
      for (let y = centerTile.y - Math.floor(tilesY / 2); y <= centerTile.y + Math.floor(tilesY / 2); y++) {
        if (x >= 0 && y >= 0 && x < Math.pow(2, mapState.zoom) && y < Math.pow(2, mapState.zoom)) {
          newTiles.push({
            x,
            y,
            z: mapState.zoom,
            url: `https://tile.openstreetmap.org/${mapState.zoom}/${x}/${y}.png`
          });
        }
      }
    }
    
    setTiles(newTiles);
  }, [mapState.center.lat, mapState.center.lng, mapState.zoom]);

  // Debounced tile generation to reduce loading
  const debouncedGenerateTiles = useCallback(() => {
    const timer = setTimeout(() => {
      generateTiles();
      setIsLoading(false);
    }, 200);
    
    return timer;
  }, [generateTiles]);

  // Update tiles when map state changes (only for zoom and center, not offset)
  useEffect(() => {
    setIsLoading(true);
    const timer = debouncedGenerateTiles();
    
    return () => clearTimeout(timer);
  }, [mapState.center.lat, mapState.center.lng, mapState.zoom, debouncedGenerateTiles]);

  // Don't reload tiles when just dragging (offset changes)
  useEffect(() => {
    if (!mapState.isDragging) {
      generateTiles();
    }
  }, [mapState.mapOffset, mapState.isDragging, generateTiles]);

  // Auto-fit bounds when places change
  useEffect(() => {
    if (filteredPlaces.length > 0) {
      const coordinates = filteredPlaces
        .map(place => getPlaceCoordinates(place))
        .filter(coords => coords !== null) as { lat: number; lng: number }[];
      
      console.log('=== Map Bounds Calculation ===');
      console.log('Total places:', filteredPlaces.length);
      console.log('Places with valid coordinates:', coordinates.length);
      
      if (coordinates.length > 0) {
        const lats = coordinates.map(c => c.lat);
        const lngs = coordinates.map(c => c.lng);
        
        // ตรวจสอบว่าพิกัดอยู่ในขอนแก่นหรือไม่
        const khonKaenBounds = {
          north: 16.6,
          south: 16.2,
          east: 103.0,
          west: 102.6
        };
        
        const validKhonKaenCoords = coordinates.filter(c => 
          c.lat >= khonKaenBounds.south && c.lat <= khonKaenBounds.north &&
          c.lng >= khonKaenBounds.west && c.lng <= khonKaenBounds.east
        );
        
        console.log('Coordinates in Khon Kaen area:', validKhonKaenCoords.length);
        console.log('Sample coordinates:', coordinates.slice(0, 3));
        
        if (validKhonKaenCoords.length > 0) {
          const validLats = validKhonKaenCoords.map(c => c.lat);
          const validLngs = validKhonKaenCoords.map(c => c.lng);
          
          const centerLat = (Math.max(...validLats) + Math.min(...validLats)) / 2;
          const centerLng = (Math.max(...validLngs) + Math.min(...validLngs)) / 2;
          
          console.log('Setting map center to:', { lat: centerLat, lng: centerLng });
          
          setMapState(prev => ({
            ...prev,
            center: { lat: centerLat, lng: centerLng },
            zoom: 13,
            mapOffset: { x: 0, y: 0 }
          }));
        } else {
          console.warn('No coordinates found in Khon Kaen area, using default center');
          setMapState(prev => ({
            ...prev,
            center: { lat: 16.4419, lng: 102.8360 },
            zoom: 12,
            mapOffset: { x: 0, y: 0 }
          }));
        }
      }
    }
  }, [filteredPlaces]);

  // Handle mouse events for dragging with throttling
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setMapState(prev => ({
      ...prev,
      isDragging: true,
      dragStart: { x: e.clientX, y: e.clientY }
    }));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!mapState.isDragging) return;
    
    const deltaX = e.clientX - mapState.dragStart.x;
    const deltaY = e.clientY - mapState.dragStart.y;
    
    // Only update if movement is significant to reduce re-renders
    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      setMapState(prev => ({
        ...prev,
        mapOffset: {
          x: prev.mapOffset.x + deltaX,
          y: prev.mapOffset.y + deltaY
        },
        dragStart: { x: e.clientX, y: e.clientY }
      }));
    }
  }, [mapState.isDragging, mapState.dragStart]);

  const handleMouseUp = useCallback(() => {
    if (mapState.isDragging) {
      // Convert offset to new center only if there was significant movement
      if (Math.abs(mapState.mapOffset.x) > 5 || Math.abs(mapState.mapOffset.y) > 5) {
        const tileSize = 256;
        const centerTile = latLngToTile(mapState.center.lat, mapState.center.lng, mapState.zoom);
        const newCenterTileX = centerTile.x - mapState.mapOffset.x / tileSize;
        const newCenterTileY = centerTile.y - mapState.mapOffset.y / tileSize;
        const newCenter = tileToLatLng(newCenterTileX, newCenterTileY, mapState.zoom);
        
        setMapState(prev => ({
          ...prev,
          center: newCenter,
          isDragging: false,
          mapOffset: { x: 0, y: 0 }
        }));
      } else {
        // Just stop dragging without changing center
        setMapState(prev => ({
          ...prev,
          isDragging: false,
          mapOffset: { x: 0, y: 0 }
        }));
      }
    }
  }, [mapState.isDragging, mapState.mapOffset, mapState.center, mapState.zoom]);

  // Zoom functions with useCallback
  const handleZoomIn = useCallback(() => {
    if (mapState.zoom < 18) {
      setMapState(prev => ({ ...prev, zoom: prev.zoom + 1, mapOffset: { x: 0, y: 0 } }));
    }
  }, [mapState.zoom]);

  const handleZoomOut = useCallback(() => {
    if (mapState.zoom > 1) {
      setMapState(prev => ({ ...prev, zoom: prev.zoom - 1, mapOffset: { x: 0, y: 0 } }));
    }
  }, [mapState.zoom]);

  const handleRecenter = useCallback(() => {
    setMapState(prev => ({
      ...prev,
      center: { lat: 16.4419, lng: 102.8360 },
      zoom: 12,
      mapOffset: { x: 0, y: 0 }
    }));
  }, []);

  const handleFitBounds = useCallback(() => {
    if (filteredPlaces.length > 0) {
      const lats = filteredPlaces.map(p => p.geometry?.location.lat).filter(Boolean) as number[];
      const lngs = filteredPlaces.map(p => p.geometry?.location.lng).filter(Boolean) as number[];
      
      const centerLat = (Math.max(...lats) + Math.min(...lats)) / 2;
      const centerLng = (Math.max(...lngs) + Math.min(...lngs)) / 2;
      
      setMapState(prev => ({
        ...prev,
        center: { lat: centerLat, lng: centerLng },
        zoom: 13,
        mapOffset: { x: 0, y: 0 }
      }));
    }
  }, [filteredPlaces]);

  // Get marker color
  const getMarkerColor = (place: Place): string => {
    const types = place.types;
    if (types.some(type => type.includes('restaurant') || type.includes('food'))) {
      return '#EF4444';
    } else if (types.some(type => type.includes('tourist_attraction') || type.includes('park'))) {
      return '#10B981';
    } else if (types.some(type => type.includes('lodging'))) {
      return '#8B5CF6';
    } else if (types.some(type => type.includes('shopping'))) {
      return '#F59E0B';
    } else if (types.some(type => type.includes('university'))) {
      return '#06B6D4';
    }
    return '#3B82F6';
  };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-full bg-gray-200 rounded-lg relative overflow-hidden cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Loading Overlay - only show for significant changes */}
        {isLoading && (mapState.zoom !== 12 || Math.abs(mapState.center.lat - 16.4419) > 0.01) && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md z-50">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">กำลังโหลด...</p>
            </div>
          </div>
        )}

        {/* Map Tiles */}
        {tiles.map((tile) => {
          const centerTile = latLngToTile(mapState.center.lat, mapState.center.lng, mapState.zoom);
          const tileSize = 256;
          const containerRect = mapRef.current?.getBoundingClientRect();
          const containerWidth = containerRect?.width || 800;
          const containerHeight = containerRect?.height || 600;
          
          // Tiles ขยับตาม offset เพื่อให้ markers ล็อคกับแผนที่
          const x = (tile.x - centerTile.x) * tileSize + containerWidth / 2 + mapState.mapOffset.x;
          const y = (tile.y - centerTile.y) * tileSize + containerHeight / 2 + mapState.mapOffset.y;
          
          const tileKey = `${tile.z}-${tile.x}-${tile.y}`;
          
          return (
            <img
              key={tileKey}
              src={tile.url}
              alt={`Map tile ${tile.x},${tile.y}`}
              className="absolute pointer-events-none transition-opacity duration-200"
              style={{
                left: x,
                top: y,
                width: tileSize,
                height: tileSize,
                zIndex: 1,
                opacity: loadedTiles.has(tileKey) ? 1 : 0
              }}
              onLoad={() => {
                setLoadedTiles(prev => new Set([...prev, tileKey]));
              }}
              onError={(e) => {
                // Hide broken tiles
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          );
        })}

        {/* Place Markers */}
        {filteredPlaces
          .map((place, index) => {
            const coords = getPlaceCoordinates(place);
            if (!coords) return null;
            
            const position = latLngToPixelLocked(coords.lat, coords.lng);
            const color = getMarkerColor(place);
            const isSelected = selectedPlace?.place_id === place.place_id;
            
            // Debug log for first few markers
            if (index < 3) {
              console.log(`Marker ${index + 1}: ${place.name}`, {
                originalCoords: coords,
                pixelPosition: position,
                mapCenter: mapState.center,
                zoom: mapState.zoom
              });
            }
            
            // Only show markers that are within the visible area
            const containerRect = mapRef.current?.getBoundingClientRect();
            const containerWidth = containerRect?.width || 800;
            const containerHeight = containerRect?.height || 600;
            
            if (position.x < -50 || position.x > containerWidth + 50 || 
                position.y < -50 || position.y > containerHeight + 50) {
              return null;
            }
            
            return (
              <div key={place.place_id}>
                {/* Marker */}
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer hover:scale-125 transition-all z-10 drop-shadow-lg"
                  style={{
                    left: position.x,
                    top: position.y,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlace(isSelected ? null : place);
                    console.log('Clicked marker:', place.name, 'at position:', position, 'coords:', coords);
                  }}
                >
                  {/* เพิ่มขนาด marker และทำให้เด่นชัดขึ้น */}
                  <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 40 16 40C16 40 32 24.837 32 16C32 7.163 24.837 0 16 0Z" 
                      fill={color}
                      stroke="white"
                      strokeWidth="3"
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                    />
                    <circle cx="16" cy="16" r="8" fill="white"/>
                    <circle cx="16" cy="16" r="5" fill={color}/>
                  </svg>
                  
                  {/* เพิ่ม label ชื่อสถานที่ */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium shadow-md max-w-32 truncate">
                    {place.name}
                  </div>
                </div>

                {/* Popup */}
                {isSelected && (
                  <Card 
                    className="absolute z-20 w-80 shadow-lg"
                    style={{
                      left: Math.min(position.x, (containerRect?.width || 800) - 320),
                      top: Math.max(position.y - 200, 10),
                    }}
                  >
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
                          onClick={() => {
                            // บันทึกข้อมูลและนำทางไปหน้ารายละเอียด
                            localStorage.setItem(`place_${place.place_id}`, JSON.stringify(place));
                            window.open(`/place/${place.place_id}`, '_blank');
                          }}
                          className="flex-1"
                        >
                          ดูรายละเอียด
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const coords = getPlaceCoordinates(place);
                            if (coords) {
                              const destination = `${coords.lat},${coords.lng}`;
                              window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
                            }
                          }}
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

        {/* Khon Kaen City Center Reference Point */}
        {(() => {
          const centerPosition = latLngToPixelLocked(16.4419, 102.8360);
          
          return (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-5"
              style={{
                left: centerPosition.x,
                top: centerPosition.y,
              }}
            >
              <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium shadow-md whitespace-nowrap">
                ใจกลางขอนแก่น
              </div>
            </div>
          );
        })()}
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
            </div>
            <div className="mt-2 pt-2 border-t text-xs text-muted-foreground flex items-center gap-1">
              <Move className="h-3 w-3" />
              <span>ลากเพื่อเลื่อนแผนที่</span>
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
              onClick={handleZoomIn}
              title="ซูมเข้า"
              disabled={mapState.zoom >= 18}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white shadow-md w-10 h-10 p-0"
              onClick={handleZoomOut}
              title="ซูมออก"
              disabled={mapState.zoom <= 1}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white shadow-md w-10 h-10 p-0"
              onClick={handleRecenter}
              title="กลับไปที่ตำแหน่งเริ่มต้น"
            >
              <RotateCcw className="h-4 w-4" />
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

      {/* Map Info */}
      <Card className="absolute bottom-4 left-4 z-[1000] max-w-xs">
        <CardContent className="p-3">
          <div className="text-xs">
            <div className="font-medium mb-1">ข้อมูลแผนที่</div>
            <div className="text-muted-foreground">
              ตำแหน่ง: {mapState.center.lat.toFixed(4)}, {mapState.center.lng.toFixed(4)}
            </div>
            <div className="text-muted-foreground">
              ระดับซูม: {mapState.zoom}
            </div>
            <div className="text-muted-foreground">
              Offset: {mapState.mapOffset.x.toFixed(0)}, {mapState.mapOffset.y.toFixed(0)}
            </div>
            <div className="text-muted-foreground">
              กำลังลาก: {mapState.isDragging ? 'ใช่' : 'ไม่'}
            </div>
            <div className="text-muted-foreground">
              สถานที่ทั้งหมด: {places.length}
            </div>
            <div className="text-muted-foreground">
              สถานที่ที่กรอง: {filteredPlaces.length}
            </div>
            <div className="text-muted-foreground">
              มีพิกัดครบ: {filteredPlaces.filter(p => getPlaceCoordinates(p) !== null).length}
            </div>
            <div className="text-muted-foreground">
              Markers แสดง: {filteredPlaces.filter(p => {
                const coords = getPlaceCoordinates(p);
                if (!coords) return false;
                const pos = latLngToPixelLocked(coords.lat, coords.lng);
                const containerRect = mapRef.current?.getBoundingClientRect();
                const containerWidth = containerRect?.width || 800;
                const containerHeight = containerRect?.height || 600;
                return pos.x >= -100 && pos.x <= containerWidth + 100 && 
                       pos.y >= -100 && pos.y <= containerHeight + 100;
              }).length}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
