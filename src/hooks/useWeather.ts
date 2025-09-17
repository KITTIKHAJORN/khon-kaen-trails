import { useState, useCallback } from 'react';
import { 
  getKhonKaenWeatherData,
  getWeatherDataByCoordinates,
  getKhonKaenAirPollution,
  formatTemperature,
  formatHumidity,
  formatWindSpeed,
  formatUVIndex
} from '@/api/weatherapi';

export interface WeatherData {
  current: {
    main: {
      temp: number;
      humidity: number;
      pressure: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    visibility?: number;
    uvi?: number;
  };
  forecast: {
    list: Array<{
      dt: number;
      main: {
        temp: number;
        temp_max: number;
        temp_min: number;
      };
      weather: Array<{
        main: string;
        description: string;
        icon: string;
      }>;
    }>;
  };
}

export interface AirPollutionData {
  aqi: number;
  level: string;
}

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [airPollution, setAirPollution] = useState<AirPollutionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKhonKaenWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getKhonKaenWeatherData();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลสภาพอากาศ');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCoordinates = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getWeatherDataByCoordinates(lat, lon);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลสภาพอากาศ');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAirPollution = useCallback(async () => {
    try {
      const data = await getKhonKaenAirPollution();
      if (data && data.list && data.list[0]) {
        const aqi = data.list[0].main.aqi;
        let level = 'good';
        if (aqi > 3) level = 'unhealthy';
        else if (aqi > 2) level = 'moderate';
        
        setAirPollution({ aqi: aqi * 25, level }); // Convert to 0-100 scale
      }
    } catch (err) {
      console.warn('Could not fetch air pollution data:', err);
      // Set default values if API fails
      setAirPollution({ aqi: 28, level: 'good' });
    }
  }, []);

  return {
    weatherData,
    airPollution,
    loading,
    error,
    fetchKhonKaenWeather,
    fetchWeatherByCoordinates,
    fetchAirPollution,
    clearError: () => setError(null)
  };
};

// Helper functions for weather data formatting
export const getWeatherIcon = (condition: string) => {
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('clear') || conditionLower.includes('sun')) return 'sunny';
  if (conditionLower.includes('cloud')) return 'cloudy';
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return 'rainy';
  if (conditionLower.includes('snow')) return 'snowy';
  if (conditionLower.includes('thunder')) return 'stormy';
  return 'sunny';
};

export const formatForecastData = (forecastList: any[]) => {
  const dailyData: { [key: string]: any } = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toDateString();
    
    if (!dailyData[dayKey]) {
      dailyData[dayKey] = {
        date: date,
        temps: [],
        weather: item.weather[0],
        day: date.toLocaleDateString('th-TH', { weekday: 'long' }),
        dayEn: date.toLocaleDateString('en-US', { weekday: 'short' })
      };
    }
    
    dailyData[dayKey].temps.push(item.main.temp);
  });
  
  return Object.values(dailyData).slice(0, 4).map((day: any) => ({
    day: day.day,
    dayEn: day.dayEn,
    temp: {
      max: Math.round(Math.max(...day.temps)),
      min: Math.round(Math.min(...day.temps))
    },
    condition: getWeatherIcon(day.weather.main)
  }));
};