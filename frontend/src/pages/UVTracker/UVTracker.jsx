import { useMemo, useState } from "react";
import useUVData from "../../hooks/useUVData";
import "./UVTracker.css";

function getUVLabel(uv) {
  if (uv <= 2) return "LOW";
  if (uv <= 5) return "MODERATE";
  if (uv <= 7) return "HIGH";
  if (uv <= 10) return "VERY HIGH";
  return "EXTREME";
}

function getBackgroundClass(level) {
  switch (level) {
    case "LOW":
      return "bg-low";
    case "MODERATE":
      return "bg-moderate";
    case "HIGH":
      return "bg-high";
    case "VERY HIGH":
      return "bg-very-high";
    case "EXTREME":
      return "bg-extreme";
    default:
      return "bg-moderate";
  }
}

function getGaugeAngle(uv) {
  const capped = Math.min(uv, 12);
  return (capped / 12) * 360;
}

export default function UVTracker() {
  const { uvData, city, loading, error } = useUVData();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedItem = useMemo(() => {
    if (!uvData.length) return null;
    return uvData[selectedIndex] || uvData[0];
  }, [uvData, selectedIndex]);

  if (loading) {
    return <div className="uv-page-status">Loading UV forecast...</div>;
  }

  if (error) {
    return <div className="uv-page-status error">Error: {error}</div>;
  }

  if (!selectedItem) {
    return <div className="uv-page-status">No UV data available.</div>;
  }

  const level = getUVLabel(selectedItem.uv);
  const bgClass = getBackgroundClass(level);
  const angle = getGaugeAngle(selectedItem.uv);

  return (
    <div className={`uv-page ${bgClass}`}>
      <section className="uv-hero">
        <h1 className="uv-level-title">{level}</h1>
        <p className="uv-weather-text">
          {selectedItem.weather ? selectedItem.weather : "Clear"}
        </p>
        <p className="uv-location-text">{city || "Melbourne"}</p>
      </section>

      <section className="uv-time-slider-section">
        <div className="uv-time-slider">
          {uvData.map((item, index) => (
            <button
              key={`${item.time}-${index}`}
              className={`uv-time-pill ${
                selectedIndex === index ? "active" : ""
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <span className="uv-time-pill-time">{item.time}</span>
              <span className="uv-time-pill-value">{item.uv}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="uv-gauge-section">
        <div
          className="uv-gauge-ring"
          style={{
            background: `conic-gradient(
              #35b000 0deg 72deg,
              #f1d000 72deg 144deg,
              #ff9800 144deg 216deg,
              #e53935 216deg 288deg,
              #8e24aa 288deg 360deg
            )`,
          }}
        >
          <div className="uv-gauge-inner">
            <div className="uv-gauge-value">{selectedItem.uv}</div>
            <div className="uv-gauge-level">{level}</div>
            <div className="uv-gauge-weather">{selectedItem.weather}</div>
            <div className="uv-gauge-temp">{selectedItem.temp}°C</div>
          </div>

          <div
            className="uv-gauge-pointer"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <div className="uv-gauge-pointer-dot" />
          </div>
        </div>
      </section>

      <section className="uv-info-card">
        <div className="uv-warning-row">
          <span className="uv-warning-sign">{selectedItem.warning_sign}</span>
          <p>{selectedItem.warning_message}</p>
        </div>

        <h3>Recommended clothing</h3>
        <ul className="uv-clothing-list">
          {selectedItem.clothing.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}