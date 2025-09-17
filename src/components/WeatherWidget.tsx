import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeather, formatForecastData } from '@/hooks/useWeather';
import { 
  Sun, 
  Cloud, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye,
  AlertCircle,
  CloudRain 
} from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const isEnglish = currentLanguage.code === 'en';
  const { weatherData, airPollution, loading, error, fetchKhonKaenWeather, fetchAirPollution, clearError } = useWeather();

  useEffect(() => {
    fetchKhonKaenWeather();
    fetchAirPollution();
  }, [fetchKhonKaenWeather, fetchAirPollution]);

  // Format weather data for display
  const currentWeather = weatherData ? {
    temperature: Math.round(weatherData.current.main.temp),
    condition: weatherData.current.weather[0]?.main.toLowerCase() || 'clear',
    humidity: weatherData.current.main.humidity,
    windSpeed: Math.round(weatherData.current.wind.speed * 3.6), // Convert m/s to km/h
    visibility: weatherData.current.visibility ? Math.round(weatherData.current.visibility / 1000) : 10,
    aqi: airPollution?.aqi || 28,
    aqiLevel: airPollution?.level || 'good'
  } : null;

  const forecast = weatherData ? formatForecastData(weatherData.forecast.list) : [];

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
      case 'clear':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy':
      case 'clouds':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rainy':
      case 'rain':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getAQIColor = (level: string) => {
    switch (level) {
      case 'good':
        return 'text-green-600 bg-green-50';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50';
      case 'unhealthy':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">กำลังโหลดข้อมูลสภาพอากาศ...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-lg mb-4">
                  <p className="font-medium">เกิดข้อผิดพลาดในการโหลดข้อมูลสภาพอากาศ</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
                <Button onClick={() => { clearError(); fetchKhonKaenWeather(); }} variant="outline">
                  ลองใหม่
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!currentWeather) {
    return null;
  }

  return (
    <section className="py-12 bg-accent/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8" data-aos="fade-up">
            <h3 className="text-2xl font-bold text-primary mb-2">
              {t('weather.title')} • {isEnglish ? 'Khon Kaen' : 'ขอนแก่น'}
            </h3>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString(isEnglish ? 'en-US' : 'th-TH', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Weather */}
            <Card className="lg:col-span-2 shadow-warm border-0 bg-card-gradient" data-aos="fade-right">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-1">
                      {t('weather.today')}
                    </h4>
                    <div className="flex items-center gap-3">
                      {getWeatherIcon(currentWeather.condition)}
                      <span className="text-4xl font-bold text-primary">
                        {currentWeather.temperature}°C
                      </span>
                    </div>
                  </div>

                  {/* AQI Badge */}
                  <div className={`px-3 py-2 rounded-lg ${getAQIColor(currentWeather.aqiLevel)}`}>
                    <div className="text-xs font-medium">
                      {t('weather.aqi')}
                    </div>
                    <div className="text-lg font-bold">
                      {currentWeather.aqi}
                    </div>
                  </div>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Droplets className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                    <div className="text-sm text-muted-foreground">
                      {isEnglish ? 'Humidity' : 'ความชื้น'}
                    </div>
                    <div className="font-semibold">{currentWeather.humidity}%</div>
                  </div>
                  <div className="text-center">
                    <Wind className="h-5 w-5 text-green-500 mx-auto mb-1" />
                    <div className="text-sm text-muted-foreground">
                      {isEnglish ? 'Wind' : 'ลม'}
                    </div>
                    <div className="font-semibold">{currentWeather.windSpeed} km/h</div>
                  </div>
                  <div className="text-center">
                    <Eye className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                    <div className="text-sm text-muted-foreground">
                      {isEnglish ? 'Visibility' : 'ทัศนวิสัย'}
                    </div>
                    <div className="font-semibold">{currentWeather.visibility} km</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Forecast */}
            <Card className="shadow-warm border-0 bg-card-gradient" data-aos="fade-left">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-primary mb-4">
                  {isEnglish ? '4-Day Forecast' : 'พยากรณ์ 4 วัน'}
                </h4>
                <div className="space-y-3">
                  {forecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getWeatherIcon(day.condition)}
                        <span className="font-medium text-sm">
                          {isEnglish ? day.dayEn : day.day}
                        </span>
                      </div>
                      <div className="text-sm font-medium">
                        <span className="text-primary">{day.temp.max}°</span>
                        <span className="text-muted-foreground ml-1">{day.temp.min}°</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Weather Alert */}
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-xs text-yellow-800">
                      {isEnglish 
                        ? 'UV Index: High. Use sunscreen when going outdoors.'
                        : 'ดัชนี UV: สูง แนะนำให้ทาครีมกันแดดเมื่อออกไปข้างนอก'
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};