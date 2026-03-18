import { createContext, useContext, useEffect, useState } from 'react';

const UVContext = createContext(null);
const WEATHER_STORAGE_KEY = 'uvguard_weather';

function readStoredWeather() {
  try {
    const raw = localStorage.getItem(WEATHER_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed) return null;

    return {
      ...parsed,
      lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : new Date(),
    };
  } catch {
    return null;
  }
}

export function UVProvider({ children }) {
  const [weather, setWeather] = useState(() => readStoredWeather());

  useEffect(() => {
    try {
      if (!weather) {
        localStorage.removeItem(WEATHER_STORAGE_KEY);
        return;
      }

      localStorage.setItem(WEATHER_STORAGE_KEY, JSON.stringify(weather));
    } catch {
      // Ignore storage failures so the app still works in restricted environments.
    }
  }, [weather]);

  return (
    <UVContext.Provider value={{ weather, setWeather }}>
      {children}
    </UVContext.Provider>
  );
}

export function useWeather() {
  return useContext(UVContext);
}
