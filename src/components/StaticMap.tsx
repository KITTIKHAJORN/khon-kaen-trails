import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, Navigation, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPlaceTypes, type Place } from '@/hooks/usePlaces';
import { getKhonKaenMapWithPlaces, createMarkersFromPlaces } from '@/api/mapapi';

interface StaticMapProps {
  places: Place[];
  selectedCategories: string[];
  onPlaceSelect?: (place: Place) => void;
  className?: string;
  height?: string;
  showControls?: boolean;
  showLegend?: boolean;
}

export const StaticMap: React.FC<StaticMapProps> = ({
  places,
  selectedCategories,
  onPlaceSelect,
  className = '',
  height = '600px',
  showControls = true,
  showLegend = true
}) => {
  const [mapImageUrl, setMapImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
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

  // Generate map image URL
  useEffect(() => {
    const generateMapUrl = async () => {
      setIsLoading(true);
      try {
        const mapUrl = await getKhonKaenMapWithPlaces(filteredPlaces, {
          zoom,
          size: '800x600',
          maptype: mapType
        });
        setMapImageUrl(mapUrl);
      } catch (error) {
        console.error('Error generating map URL:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateMapUrl();
  }, [filteredPlaces, zoom, mapType]);

  const handleRefreshMap = () => {
    const generateMapUrl = async () => {
      setIsLoading(true);
      try {
        const mapUrl = await getKhonKaenMapWithPlaces(filteredPlaces, {
          zoom,
          size: '800x600',
          maptype: mapType
        });
        setMapImageUrl(mapUrl);
      } catch (error) {
        console.error('Error generating map URL:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateMapUrl();
  };

  const handleZoomIn = () => {
    if (zoom < 18) setZoom(zoom + 1);
  };

  const handleZoomOut = () => {
    if (zoom > 1) setZoom(zoom - 1);
  };

  const handleMapTypeChange = () => {
    const types: ('roadmap' | 'satellite' | 'hybrid' | 'terrain')[] = ['roadmap', 'satellite', 'hybrid', 'terrain'];
    const currentIndex = types.indexOf(mapType);
    const nextIndex = (currentIndex + 1) % types.length;
    setMapType(types[nextIndex]);
  };

  const getMapTypeLabel = () => {
    switch (mapType) {
      case 'roadmap': return 'ถนน';
      case 'satellite': return 'ดาวเทียม';
      case 'hybrid': return 'ผสม';
      case 'terrain': return 'ภูมิประเทศ';
      default: return 'ถนน';
    }
  };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Map Image */}
      <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">กำลังโหลดแผนที่...</p>
            </div>
          </div>
        ) : mapImageUrl ? (
          <img
            src={mapImageUrl}
            alt="แผนที่ขอนแก่น"
            className="w-full h-full object-cover rounded-lg"
            onError={() => {
              console.error('Failed to load map image');
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">แผนที่ขอนแก่น</h3>
              <p className="text-muted-foreground mb-4">
                แผนที่จาก Google Maps API
              </p>
              <Button onClick={handleRefreshMap}>
                <RefreshCw className="mr-2 h-4 w-4" />
                โหลดแผนที่
              </Button>
            </div>
          </div>
        )}
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
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
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
          <Card className="absolute top-4 right-4 z-[1000]">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">{filteredPlaces.length} สถานที่</span>
              </div>
            </CardContent>
          </Card>

          {/* Map Type Selector */}
          <Card className="absolute top-20 right-4 z-[1000]">
            <CardContent className="p-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleMapTypeChange}
                className="text-xs"
              >
                {getMapTypeLabel()}
              </Button>
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
              disabled={zoom >= 18}
            >
              +
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white shadow-md w-10 h-10 p-0"
              onClick={handleZoomOut}
              title="ซูมออก"
              disabled={zoom <= 1}
            >
              -
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white shadow-md w-10 h-10 p-0"
              onClick={handleRefreshMap}
              title="รีเฟรชแผนที่"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </>
      )}

      {/* Places List Overlay */}
      <Card className="absolute bottom-4 left-4 z-[1000] max-w-sm max-h-48 overflow-y-auto">
        <CardContent className="p-3">
          <h4 className="font-semibold text-sm mb-2">สถานที่บนแผนที่</h4>
          {filteredPlaces.length > 0 ? (
            <div className="space-y-2">
              {filteredPlaces.slice(0, 5).map((place) => (
                <div
                  key={place.place_id}
                  className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                  onClick={() => onPlaceSelect?.(place)}
                >
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-xs truncate">{place.name}</h5>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {place.rating && (
                        <>
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span>{place.rating.toFixed(1)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full ml-2"
                    style={{
                      backgroundColor: 
                        place.types.some(type => type.includes('restaurant')) ? '#EF4444' :
                        place.types.some(type => type.includes('tourist_attraction')) ? '#10B981' :
                        place.types.some(type => type.includes('lodging')) ? '#8B5CF6' :
                        place.types.some(type => type.includes('shopping')) ? '#F59E0B' :
                        place.types.some(type => type.includes('university')) ? '#06B6D4' :
                        '#3B82F6'
                    }}
                  />
                </div>
              ))}
              {filteredPlaces.length > 5 && (
                <p className="text-xs text-muted-foreground text-center">
                  และอีก {filteredPlaces.length - 5} สถานที่
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">ไม่มีสถานที่ที่แสดง</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
