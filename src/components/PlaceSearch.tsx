import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Star, Clock, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePlacesSearch, formatPlaceTypes, type Place } from '@/hooks/usePlaces';

// Hook for debouncing search queries
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface PlaceSearchProps {
  onPlaceSelect?: (place: Place) => void;
  placeholder?: string;
  className?: string;
  showResults?: boolean;
  maxResults?: number;
}

export const PlaceSearch: React.FC<PlaceSearchProps> = ({
  onPlaceSelect,
  placeholder = "ค้นหาสถานที่ในขอนแก่น...",
  className = "",
  showResults = true,
  maxResults = 5
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const { places, loading, error, searchPlaces, clearPlaces, clearError } = usePlacesSearch();
  const debouncedQuery = useDebounce(query, 300);

  // Auto search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      handleSearch(debouncedQuery);
      setIsOpen(true);
    } else {
      clearPlaces();
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length >= 2) {
      await searchPlaces({
        query: `${searchQuery} ขอนแก่น`,
        location: '16.4419,102.8360',
        radius: 10000,
        language: 'th',
        region: 'th'
      });
    }
  }, [searchPlaces]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (error) {
      clearError();
    }
  };

  const handlePlaceSelect = (place: Place) => {
    setQuery(place.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    onPlaceSelect?.(place);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || places.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < Math.min(places.length - 1, maxResults - 1) ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handlePlaceSelect(places[selectedIndex]);
        } else if (query.trim()) {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    clearPlaces();
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const displayPlaces = places.slice(0, maxResults);

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && showResults && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg border-border">
          <CardContent className="p-0">
            {loading && query.trim().length >= 2 && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">กำลังค้นหา...</span>
              </div>
            )}

            {error && (
              <div className="p-4 text-center">
                <div className="text-destructive text-sm mb-2">
                  เกิดข้อผิดพลาดในการค้นหา
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleSearch(query)}
                >
                  ลองใหม่
                </Button>
              </div>
            )}

            {!loading && !error && displayPlaces.length === 0 && query.trim().length >= 2 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                ไม่พบสถานที่ที่ตรงกับ "{query}"
              </div>
            )}

            {!loading && !error && displayPlaces.length > 0 && (
              <div className="max-h-80 overflow-y-auto">
                {displayPlaces.map((place, index) => (
                  <div
                    key={place.place_id}
                    className={`p-4 cursor-pointer border-b border-border last:border-b-0 transition-colors ${
                      index === selectedIndex 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handlePlaceSelect(place)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm line-clamp-1 flex-1">
                            {place.name}
                          </h4>
                          {place.rating && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {place.rating.toFixed(1)}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {formatPlaceTypes(place.types)}
                          </Badge>
                          {place.opening_hours?.open_now !== undefined && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              place.opening_hours.open_now 
                                ? 'text-green-700 bg-green-100' 
                                : 'text-red-700 bg-red-100'
                            }`}>
                              {place.opening_hours.open_now ? 'เปิด' : 'ปิด'}
                            </span>
                          )}
                        </div>
                        
                        {place.formatted_address && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {place.formatted_address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {places.length > maxResults && (
                  <div className="p-3 text-center border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      และอีก {places.length - maxResults} สถานที่
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

