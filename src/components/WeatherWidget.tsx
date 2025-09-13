import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Sun, 
  Cloud, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye,
  AlertCircle 
} from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const isEnglish = currentLanguage.code === 'en';

  // Mock weather data (in real app, this would come from weather API)
  const weatherData = {
    current: {
      temperature: 32,
      condition: 'sunny',
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      aqi: 28,
      aqiLevel: 'good'
    },
    forecast: [
      { day: 'อาทิทย์', dayEn: 'Sun', temp: { max: 34, min: 26 }, condition: 'sunny' },
      { day: 'จันทร์', dayEn: 'Mon', temp: { max: 33, min: 25 }, condition: 'cloudy' },
      { day: 'อังคาร', dayEn: 'Tue', temp: { max: 35, min: 27 }, condition: 'sunny' },
      { day: 'พุธ', dayEn: 'Wed', temp: { max: 31, min: 24 }, condition: 'rainy' },
    ]
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rainy':
        return <Droplets className="h-8 w-8 text-blue-500" />;
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
                      {getWeatherIcon(weatherData.current.condition)}
                      <span className="text-4xl font-bold text-primary">
                        {weatherData.current.temperature}°C
                      </span>
                    </div>
                  </div>

                  {/* AQI Badge */}
                  <div className={`px-3 py-2 rounded-lg ${getAQIColor(weatherData.current.aqiLevel)}`}>
                    <div className="text-xs font-medium">
                      {t('weather.aqi')}
                    </div>
                    <div className="text-lg font-bold">
                      {weatherData.current.aqi}
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
                    <div className="font-semibold">{weatherData.current.humidity}%</div>
                  </div>
                  <div className="text-center">
                    <Wind className="h-5 w-5 text-green-500 mx-auto mb-1" />
                    <div className="text-sm text-muted-foreground">
                      {isEnglish ? 'Wind' : 'ลม'}
                    </div>
                    <div className="font-semibold">{weatherData.current.windSpeed} km/h</div>
                  </div>
                  <div className="text-center">
                    <Eye className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                    <div className="text-sm text-muted-foreground">
                      {isEnglish ? 'Visibility' : 'ทัศนวิสัย'}
                    </div>
                    <div className="font-semibold">{weatherData.current.visibility} km</div>
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
                  {weatherData.forecast.map((day, index) => (
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