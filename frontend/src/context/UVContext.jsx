import { createContext, useContext, useState } from 'react';

const UVContext = createContext(null);

export function UVProvider({ children }) {
  const [weather, setWeather] = useState(null);
  return (
    <UVContext.Provider value={{ weather, setWeather }}>
      {children}
    </UVContext.Provider>
  );
}

export function useWeather() {
  return useContext(UVContext);
}