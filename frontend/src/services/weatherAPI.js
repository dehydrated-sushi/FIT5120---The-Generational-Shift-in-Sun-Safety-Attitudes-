// services/weatherApi.js
import api from './api';
import { ENDPOINTS } from '../constants/api';

const API_KEY = import.meta.env.VITE_OWM_KEY;
const BASE = 'https://api.openweathermap.org';

export async function geocode(query) {
  const isPostcode = /^\d{4}$/.test(query.trim());

  if (isPostcode) {
    const res = await api.get(ENDPOINTS.LOCATIONS, { params: { postcode: query.trim() } });
    const matches = res.data.matches;
    if (!matches || !matches.length) throw new Error('Location not found');
    const first = matches[0];
    return { lat: first.lat, lon: first.lon, name: `${first.suburb}, ${first.state}` };
  }

  const url = `${BASE}/geo/1.0/direct?q=${encodeURIComponent(query)},AU&limit=1&appid=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.length) throw new Error('Location not found');
  return { lat: data[0].lat, lon: data[0].lon, name: data[0].name };
}
export async function fetchWeather(lat, lon) {
  // 
  const [weatherRes, uvRes] = await Promise.all([
    fetch(`${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
    fetch(`${BASE}/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
  ]);

  const weather = await weatherRes.json();
  const uv = await uvRes.json();

  //
  const forecastRes = await fetch(
    `${BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=12&appid=${API_KEY}`
  );
  const forecast = await forecastRes.json();

  return {
    uvIndex: Math.round(uv.value),
    temperature: Math.round(weather.main.temp),
    feelsLike: Math.round(weather.main.feels_like),
    humidity: weather.main.humidity,
    wind: Math.round(weather.wind.speed * 3.6),
    cloudCover: weather.clouds.all,
    condition: weather.weather[0].main,
    lastUpdated: new Date(),
    hourly: forecast.list.map(h => ({
      time: new Date(h.dt * 1000).toLocaleTimeString('en-AU', { hour: 'numeric', hour12: true }),
      uv: 0, 
      temp: Math.round(h.main.temp),
      icon: getWeatherEmoji(h.weather[0].main),
    })),
  };
}

function getWeatherEmoji(condition) {
  const map = {
    Clear: '☀️', Clouds: '☁️', Rain: '🌧', Drizzle: '🌦',
    Thunderstorm: '⛈', Snow: '❄️', Mist: '🌫', Fog: '🌫',
  };
  return map[condition] || '🌤';
}