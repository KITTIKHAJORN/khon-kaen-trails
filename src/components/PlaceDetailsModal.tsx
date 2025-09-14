import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Star, Clock, Phone, Globe, Navigation, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatPlaceTypes, getPriceLevel, type Place } from '@/hooks/usePlaces';

interface PlaceDetailsModalProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({
  place,
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  
  if (!place) return null;

  const handleViewDetails = () => {
    // บันทึกข้อมูลสถานที่ใน localStorage สำหรับหน้ารายละเอียด
    localStorage.setItem(`place_${place.place_id}`, JSON.stringify(place));
    
    // นำทางไปหน้ารายละเอียด
    navigate(`/place/${place.place_id}`);
    onClose();
  };

  const handleGetDirections = () => {
    const destination = `${place.geometry.location.lat},${place.geometry.location.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${place.place_id}`;
    window.open(url, '_blank');
  };

  const handleCallPlace = () => {
    // This would need to be implemented with additional place details API call
    console.log('Call place:', place.name);
  };

  const handleVisitWebsite = () => {
    // This would need to be implemented with additional place details API call
    console.log('Visit website:', place.name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-start justify-between pr-8">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">{place.name}</h2>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary/10 text-primary">
                  {formatPlaceTypes(place.types)}
                </Badge>
                {place.opening_hours?.open_now !== undefined && (
                  <Badge 
                    variant={place.opening_hours.open_now ? "default" : "destructive"}
                    className={place.opening_hours.open_now ? "bg-green-100 text-green-800" : ""}
                  >
                    {place.opening_hours.open_now ? 'เปิดอยู่' : 'ปิดแล้ว'}
                  </Badge>
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Rating and Reviews */}
          {place.rating && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-2xl font-bold">{place.rating.toFixed(1)}</span>
                    </div>
                    {place.user_ratings_total && (
                      <div className="text-muted-foreground">
                        <Users className="h-4 w-4 inline mr-1" />
                        {place.user_ratings_total.toLocaleString()} รีวิว
                      </div>
                    )}
                  </div>
                  {place.price_level && (
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">ระดับราคา</div>
                      <div className="font-medium">{getPriceLevel(place.price_level)}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Address */}
          {place.formatted_address && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">ที่อยู่</h3>
                    <p className="text-muted-foreground">{place.formatted_address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Business Status */}
          {place.business_status && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">สถานะ</h3>
                    <p className="text-muted-foreground">
                      {place.business_status === 'OPERATIONAL' ? 'เปิดให้บริการ' : 
                       place.business_status === 'CLOSED_TEMPORARILY' ? 'ปิดชั่วคราว' :
                       place.business_status === 'CLOSED_PERMANENTLY' ? 'ปิดถาวร' : 
                       place.business_status}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Place Types */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">ประเภทสถานที่</h3>
              <div className="flex flex-wrap gap-2">
                {place.types.slice(0, 8).map((type, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {type.replace(/_/g, ' ')}
                  </Badge>
                ))}
                {place.types.length > 8 && (
                  <Badge variant="outline" className="text-xs">
                    +{place.types.length - 8} อื่นๆ
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Photos Placeholder */}
          {place.photos && place.photos.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">รูปภาพ</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {place.photos.slice(0, 6).map((photo, index) => (
                    <div 
                      key={index}
                      className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center"
                    >
                      <span className="text-xs text-muted-foreground">รูปภาพ {index + 1}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  * ต้องใช้ Google Places Photo API เพื่อแสดงรูปภาพจริง
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button onClick={handleViewDetails} className="w-full">
              <MapPin className="mr-2 h-4 w-4" />
              ดูรายละเอียดเต็ม
            </Button>
            <Button variant="outline" onClick={handleGetDirections} className="w-full">
              <Navigation className="mr-2 h-4 w-4" />
              นำทาง
            </Button>
          </div>

          {/* Additional Info */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <h4 className="font-medium mb-1">ข้อมูลเพิ่มเติม</h4>
                  <p className="text-muted-foreground">
                    ข้อมูลจาก Google Places API • Place ID: {place.place_id}
                  </p>
                  {place.geometry?.location && (
                    <p className="text-muted-foreground text-xs mt-1">
                      พิกัด: {place.geometry.location.lat.toFixed(6)}, {place.geometry.location.lng.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
