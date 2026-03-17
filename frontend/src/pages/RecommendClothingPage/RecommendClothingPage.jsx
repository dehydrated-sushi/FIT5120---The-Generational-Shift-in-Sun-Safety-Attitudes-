// pages/RecommendClothing/RecommendClothingPage.jsx
import './RecommendClothingPage.css';
import { useWeather } from '../../context/UVContext';

// clothing emoji
const CLOTHING_ICONS = {
  'T-shirt':                        '👕',
  'Cap':                             '🧢',
  'Long-sleeve shirt':               '👔',
  'Sunglasses':                      '🕶',
  'Wide-brim hat':                   '👒',
  'UV protective long-sleeve top':   '🥼',
  'Closed shoes':                    '👟',
  'Full coverage clothing':          '🧥',
  'Long pants':                      '👖',
  'Maximum coverage clothing':       '🧣',
  'Full-length pants':               '👖',
};

function getClothingAdvice(uvIndex) {
  if (uvIndex <= 2) {
    return {
      level: 'Low',
      className: 'low',
      message: 'Minimal protection needed. Enjoy your time outside!',
      clothing: ['T-shirt', 'Cap'],
      comfort: 'Lightweight clothing is suitable and keeps you comfortable.',
      style: 'Keep it simple and casual — a great day to wear what you like.',
    };
  }
  if (uvIndex <= 5) {
    return {
      level: 'Moderate',
      className: 'moderate',
      message: 'Add a little more protection before going outside.',
      clothing: ['Long-sleeve shirt', 'Sunglasses', 'Wide-brim hat'],
      comfort: 'Choose breathable materials to stay cool while covering your skin.',
      style: 'A light long-sleeve top and sunglasses make a smart summer look.',
    };
  }
  if (uvIndex <= 7) {
    return {
      level: 'High',
      className: 'high',
      message: 'Strong sun protection is recommended today.',
      clothing: ['UV protective long-sleeve top', 'Sunglasses', 'Wide-brim hat', 'Closed shoes'],
      comfort: 'Loose, breathable fabrics that block UV still feel comfortable.',
      style: 'Clean, covered looks balance protection and style well.',
    };
  }
  if (uvIndex <= 10) {
    return {
      level: 'Very High',
      className: 'very-high',
      message: 'Cover up and minimise time outdoors if possible.',
      clothing: ['Full coverage clothing', 'Wide-brim hat', 'Sunglasses', 'Long pants'],
      comfort: 'Breathable full-coverage clothing reduces heat while protecting your skin.',
      style: 'Full coverage can still look great with light fabrics and simple layering.',
    };
  }
  return {
    level: 'Extreme',
    className: 'extreme',
    message: 'Stay indoors if possible. Maximum protection required.',
    clothing: ['Maximum coverage clothing', 'Wide-brim hat', 'Sunglasses', 'Full-length pants'],
    comfort: 'Even breathable materials can not fully compensate in extreme UV — limit time outside.',
    style: 'Today is about protection first. Full coverage is the only choice.',
  };
}

export default function RecommendClothing({ onRefresh }) {
    const { weather } = useWeather();
  // ── Empty state ───────────────────────────────────────────────
  if (!weather || weather.uvIndex == null) {
    return (
      <div className="recommend-root">
        <div className="recommend-empty">
          <span className="recommend-empty__icon">🌤</span>
          <h1 className="recommend-empty__title">No UV Data</h1>
          <p className="recommend-empty__desc">
            UV data is unavailable. Please go back and refresh your location data first.
          </p>
          {onRefresh && (
            <button className="recommend-empty__btn" onClick={onRefresh}>
              Refresh UV Data
            </button>
          )}
        </div>
      </div>
    );
  }

  const advice = getClothingAdvice(weather.uvIndex);

  return (
    <div className="recommend-root">
      <div className="recommend-scroll">

        {/* ── Header ── */}
        <header className="recommend-header">
          <div className="recommend-header-left">
            <span className="recommend-page-label">Sun Safety</span>
            <h1 className="recommend-title">Clothing Guide</h1>
          </div>
          <div className="recommend-location-tag">
            <span>⌖</span>
            <span>{weather.location}</span>
          </div>
        </header>

        {/* ── UV summary card ── */}
        <div className={`recommend-uv-card ${advice.className}`}>
          <div className="recommend-uv-badge">
            <span className="recommend-uv-badge__number">{weather.uvIndex}</span>
            <span className="recommend-uv-badge__label">UV</span>
          </div>
          <div className="recommend-uv-info">
            <span className="recommend-uv-level">{advice.level} UV</span>
            <span className="recommend-uv-msg">{advice.message}</span>
          </div>
        </div>

        {/* ── Clothing list ── */}
        <p className="recommend-section-label">Recommended Clothing</p>
        <div className="recommend-clothing-grid">
          {advice.clothing.map((item) => (
            <div key={item} className="clothing-item">
              <div className="clothing-item__icon">
                {CLOTHING_ICONS[item] || '👕'}
              </div>
              <span className="clothing-item__name">{item}</span>
            </div>
          ))}
        </div>

        {/* ── Comfort tip ── */}
        <p className="recommend-section-label">Thermal Comfort</p>
        <div className="recommend-info-card">
          <div className="recommend-info-card__header">
            <div className="recommend-info-card__icon-wrap recommend-info-card__icon-wrap--comfort">
              🌬
            </div>
            <span className="recommend-info-card__title">Fabric & Feel</span>
          </div>
          <p className="recommend-info-card__body">{advice.comfort}</p>
        </div>

        {/* ── Style tip ── */}
        <p className="recommend-section-label">Style Tip</p>
        <div className="recommend-info-card">
          <div className="recommend-info-card__header">
            <div className="recommend-info-card__icon-wrap recommend-info-card__icon-wrap--style">
              ✨
            </div>
            <span className="recommend-info-card__title">Look Good, Stay Safe</span>
          </div>
          <p className="recommend-info-card__body">{advice.style}</p>
        </div>

        {/* ── Footer ── */}
        <p className="recommend-footer">
          Updated{' '}
          {weather.lastUpdated?.toLocaleTimeString('en-AU', {
            hour: '2-digit',
            minute: '2-digit',
          }) || 'Just now'}
          {' · '}Using Home page UV data
        </p>

      </div>
    </div>
  );
}