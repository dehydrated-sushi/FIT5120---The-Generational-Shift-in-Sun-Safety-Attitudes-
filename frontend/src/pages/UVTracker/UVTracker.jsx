import { useState, useEffect } from 'react';
import { getUVAlert } from '../../services/uvService';
import { DEFAULT_LAT, DEFAULT_LON } from '../../constants/defaults';
import './UVTracker.css';

function getUVLevel(uv) {
  if (uv <= 2) return { label: 'Low', className: 'low' };
  if (uv <= 5) return { label: 'Moderate', className: 'moderate' };
  if (uv <= 7) return { label: 'High', className: 'high' };
  if (uv <= 10) return { label: 'Very High', className: 'very-high' };
  return { label: 'Extreme', className: 'extreme' };
}

export default function UVTracker() {
  const [uvData, setUvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async (lat, lon) => {
      try {
        const data = await getUVAlert(lat, lon);
        if (!cancelled) setUvData(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchData(pos.coords.latitude, pos.coords.longitude),
        () => fetchData(DEFAULT_LAT, DEFAULT_LON),
        { timeout: 8000 },
      );
    } else {
      fetchData(DEFAULT_LAT, DEFAULT_LON);
    }

    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="tracker-root">
        <div className="tracker-card">
          <p>Loading UV data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tracker-root">
        <div className="tracker-card">
          <p>Failed to load UV data: {error}</p>
        </div>
      </div>
    );
  }

  const current = uvData.current;
  const forecast = uvData.forecast || [];
  const uvLevel = getUVLevel(current.uv);

  return (
    <div className="tracker-root">
      <div className="tracker-card">
        <div className="tracker-header">
          <h1 className="tracker-title">UV Tracker</h1>
          <p className="tracker-subtitle">
            Real-time UV index and weather outlook for your location.
          </p>
        </div>

        <div className={`tracker-current ${uvLevel.className}`}>
          <p><strong>Current UV Index:</strong> {current.uv}</p>
          <p><strong>Risk Level:</strong> {current.level}</p>
          <p><strong>Temperature:</strong> {current.temp}°C</p>
          <p><strong>Conditions:</strong> {current.weather}</p>
        </div>

        {!current.is_daytime ? (
          <div className="tracker-section tracker-soft">
            <h2>Night Mode</h2>
            <p>{current.uv_note}</p>
          </div>
        ) : (
          <div className="tracker-section tracker-soft">
            <h2>Safety Advice</h2>
            <p>
              When UV is high or very high, wear sunscreen, sunglasses, and a hat,
              and try to stay in the shade.
            </p>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="tracker-section">
            <h2>Weather Forecast</h2>
            <div className="tracker-chart">
              {forecast.map((item) => (
                <div className="tracker-bar-group" key={item.time}>
                  <div
                    className="tracker-bar"
                    style={{ height: `${Math.max(item.temp * 4, 8)}px` }}
                  ></div>
                  <span className="tracker-bar-value">{Math.round(item.temp)}°C</span>
                  <span className="tracker-bar-time">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="tracker-section tracker-soft">
          <h2>About UV Levels</h2>
          <p>
            UV levels are highest around midday and early afternoon. Plan outdoor
            activities earlier in the morning or later in the evening where possible.
          </p>
        </div>
      </div>
    </div>
  );
}
