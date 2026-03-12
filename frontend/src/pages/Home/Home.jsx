// pages/Home/Home.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../../components/Navigation/Navbar';
import UVAlert, { getUVLevel } from '../../components/UVAlert/UVAlert';
import UVGauge from '../../components/UVAlert/UVGauge';
import './Home.css';
import '../../components/UVAlert/UVAlert.css';

// ── UV level config ───────────────────────────────────────────
const HOURLY_MOCK = [
  { time: '8 AM',  uv: 3,  temp: 22, icon: '🌤' },
  { time: '10 AM', uv: 6,  temp: 25, icon: '☀️' },
  { time: 'Now',   uv: 8,  temp: 27, icon: '☀️', now: true },
  { time: '2 PM',  uv: 9,  temp: 29, icon: '☀️' },
  { time: '4 PM',  uv: 5,  temp: 26, icon: '🌤' },
  { time: '6 PM',  uv: 2,  temp: 22, icon: '🌅' },
  { time: '8 PM',  uv: 0,  temp: 18, icon: '🌙' },
];

const TIPS = {
  low: [
    { emoji: '😎', title: 'Minimal protection needed',  body: 'No sunscreen required for short outdoor activities today.' },
    { emoji: '🚶', title: 'Great day to be outside',    body: 'UV levels are safe — enjoy your outdoor activities freely.' },
  ],
  moderate: [
    { emoji: '🧴', title: 'Apply SPF 30+ Sunscreen',    body: 'Apply before heading out, especially for stays over 30 min.' },
    { emoji: '🧢', title: 'Wear a Hat',                 body: 'A broad-brimmed hat protects your face, neck and ears.' },
  ],
  high: [
    { emoji: '🧴', title: 'SPF 50+ is essential',       body: 'Apply generously and reapply every 2 hours outdoors.' },
    { emoji: '🏠', title: 'Seek shade midday',           body: 'Stay out of direct sun between 11am–3pm when UV peaks.' },
    { emoji: '🕶', title: 'Protect your eyes',           body: 'Wear UV-rated sunglasses to prevent eye damage.' },
  ],
  veryHigh: [
    { emoji: '🧴', title: 'Apply SPF 50+ Sunscreen',    body: 'Reapply every 2 hours, especially after swimming or sweating.' },
    { emoji: '🕶', title: 'Wear Sunglasses & a Hat',    body: 'UV-blocking sunglasses and a broad-brimmed hat are essential.' },
    { emoji: '🏠', title: 'Seek Shade 10am–3pm',        body: 'UV is at its peak. Avoid prolonged outdoor exposure.' },
  ],
  extreme: [
    { emoji: '🏠', title: 'Stay indoors if possible',   body: 'Avoid all non-essential outdoor activity during peak hours.' },
    { emoji: '🧴', title: 'Full coverage required',     body: 'SPF 50+, long sleeves, hat and UV sunglasses — no exceptions.' },
    { emoji: '💧', title: 'Stay hydrated',              body: 'Heat and UV together accelerate dehydration. Drink water regularly.' },
  ],
};

function uvCircleStyle(uv) {
  if (uv <= 2)  return { background: 'rgba(74,222,128,0.28)',  border: '1.5px solid #4ade80' };
  if (uv <= 5)  return { background: 'rgba(250,204,21,0.28)',  border: '1.5px solid #facc15' };
  if (uv <= 7)  return { background: 'rgba(251,146,60,0.28)',  border: '1.5px solid #fb923c' };
  if (uv <= 10) return { background: 'rgba(248,113,113,0.28)', border: '1.5px solid #f87171' };
  return          { background: 'rgba(192,132,252,0.28)',       border: '1.5px solid #c084fc' };
}

// ── Canvas Weather Engine ─────────────────────────────────────
function useWeatherCanvas(canvasRef, weatherMode) {
  const stateRef = useRef({ particles: [], lightningTimer: 60, lightningAlpha: 0, raf: null });

  const BG = {
    sunny:        { top: '#1a6fa8', bot: '#0e3560' },
    partlycloudy: { top: '#2a5070', bot: '#152535' },
    cloudy:       { top: '#2a3545', bot: '#141820' },
    rain:         { top: '#1a2535', bot: '#0a1018' },
    storm:        { top: '#0f1520', bot: '#080c12' },
    neutral:      { top: '#1a2540', bot: '#0d1428' },
  };

  const initParticles = useCallback((mode) => {
    const state = stateRef.current;
    state.particles = [];
    const Raindrop = (heavy) => ({
      type: 'rain', heavy,
      x: Math.random() * 420 - 15,
      y: Math.random() * -300,
      speed: heavy ? 14 + Math.random() * 8 : 7 + Math.random() * 5,
      len:   heavy ? 18 + Math.random() * 12 : 10 + Math.random() * 8,
      alpha: heavy ? 0.35 + Math.random() * 0.3 : 0.2 + Math.random() * 0.2,
      wind:  heavy ? 3.5 : 1.5,
    });
    const Cloud = (y, scale, speed, alpha) => ({
      type: 'cloud',
      x: Math.random() * 500, y, scale, speed, alpha,
    });
    if (mode === 'rain') {
      for (let i = 0; i < 120; i++) state.particles.push(Raindrop(false));
    } else if (mode === 'storm') {
      for (let i = 0; i < 200; i++) state.particles.push(Raindrop(true));
      state.particles.push(Cloud(120, 1.0, 0.18, 0.55));
      state.particles.push(Cloud(160, 1.3, 0.12, 0.65));
      state.particles.push(Cloud(90,  0.8, 0.22, 0.45));
      state.particles.push(Cloud(200, 1.1, 0.10, 0.50));
    } else if (mode === 'cloudy') {
      state.particles.push(Cloud(100, 1.1, 0.14, 0.28));
      state.particles.push(Cloud(150, 1.4, 0.09, 0.32));
      state.particles.push(Cloud(80,  0.9, 0.18, 0.22));
      state.particles.push(Cloud(210, 1.2, 0.11, 0.25));
    } else if (mode === 'partlycloudy') {
      state.particles.push(Cloud(130, 0.9, 0.16, 0.18));
      state.particles.push(Cloud(90,  1.1, 0.10, 0.14));
      state.particles.push(Cloud(180, 0.8, 0.20, 0.12));
    }
    state.lightningTimer = 60;
    state.lightningAlpha = 0;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;

    initParticles(weatherMode);
    const state = stateRef.current;

    const drawBg = () => {
      const cfg = BG[weatherMode] || BG.neutral;
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, cfg.top); g.addColorStop(1, cfg.bot);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    };

    const drawSun = (t) => {
      const cx = W * 0.78, cy = 130, r = 46;
      for (let i = 3; i >= 0; i--) {
        const pulse = Math.sin(t * 0.8 + i) * 5;
        const g = ctx.createRadialGradient(cx, cy, r + i*14 + pulse, cx, cy, r + i*22 + pulse + 8);
        g.addColorStop(0, `rgba(255,220,80,${0.055 - i*0.01})`);
        g.addColorStop(1, 'rgba(255,180,0,0)');
        ctx.beginPath(); ctx.arc(cx, cy, r + i*26 + pulse, 0, Math.PI*2);
        ctx.fillStyle = g; ctx.fill();
      }
      const sg = ctx.createRadialGradient(cx-8, cy-8, 4, cx, cy, r);
      sg.addColorStop(0, '#fff9d0'); sg.addColorStop(0.4, '#ffe566'); sg.addColorStop(1, '#f59e0b');
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
      ctx.fillStyle = sg; ctx.fill();
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.12);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const inner = r + 10, outer = r + 20 + Math.sin(t * 1.5 + i) * 4;
        ctx.strokeStyle = 'rgba(255,220,80,0.32)'; ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a)*inner, Math.sin(a)*inner);
        ctx.lineTo(Math.cos(a)*outer, Math.sin(a)*outer);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawCloud = (p, t) => {
      p.x += p.speed; if (p.x > W + 180) p.x = -180;
      ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = '#fff';
      ctx.beginPath();
      const x = p.x, y = p.y, s = p.scale;
      ctx.ellipse(x, y, 55*s, 28*s, 0, 0, Math.PI*2);
      ctx.ellipse(x+35*s, y-10*s, 38*s, 22*s, 0, 0, Math.PI*2);
      ctx.ellipse(x-30*s, y-5*s, 32*s, 18*s, 0, 0, Math.PI*2);
      ctx.fill(); ctx.restore();
    };

    const drawRain = (p) => {
      p.y += p.speed; p.x += p.wind;
      if (p.y > H + 20) { p.y = Math.random() * -200; p.x = Math.random() * (W + 30) - 15; }
      ctx.strokeStyle = p.heavy ? `rgba(140,180,220,${p.alpha})` : `rgba(160,200,230,${p.alpha})`;
      ctx.lineWidth = p.heavy ? 1.2 : 0.8;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.wind*1.2, p.y + p.len); ctx.stroke();
    };

    const drawLightning = (alpha) => {
      if (alpha <= 0) return;
      ctx.fillStyle = `rgba(200,220,255,${alpha * 0.16})`;
      ctx.fillRect(0, 0, W, H);
      ctx.save();
      ctx.strokeStyle = `rgba(220,240,255,${alpha * 0.88})`;
      ctx.lineWidth = 2; ctx.shadowColor = '#a0c0ff'; ctx.shadowBlur = 14;
      const bx = W * 0.45 + Math.random() * 60;
      ctx.beginPath();
      ctx.moveTo(bx, 80); ctx.lineTo(bx-18, 200); ctx.lineTo(bx+10, 200); ctx.lineTo(bx-25, 380);
      ctx.stroke(); ctx.restore();
    };

    let startTime = null;
    const frame = (ts) => {
      if (!startTime) startTime = ts;
      const t = ts - startTime;
      ctx.clearRect(0, 0, W, H);
      drawBg();

      if (weatherMode === 'sunny') {
        drawSun(t * 0.001);
        const sh = ctx.createLinearGradient(0, H*0.7, 0, H);
        sh.addColorStop(0, 'rgba(255,200,50,0)'); sh.addColorStop(1, 'rgba(255,150,0,0.1)');
        ctx.fillStyle = sh; ctx.fillRect(0, H*0.7, W, H*0.3);
      }
      if (weatherMode === 'partlycloudy') {
        ctx.save(); ctx.globalAlpha = 0.5; drawSun(t * 0.001); ctx.restore();
      }

      state.particles.forEach(p => {
        if (p.type === 'cloud') drawCloud(p, t);
      });

      if (weatherMode === 'rain' || weatherMode === 'storm') {
        ctx.save();
        state.particles.forEach(p => { if (p.type === 'rain') drawRain(p); });
        ctx.restore();
        for (let i = 0; i < 5; i++) {
          const rx = 50 + i*70 + Math.sin(t*0.002 + i*1.3)*10, ry = H - 24;
          const rr = 8 + Math.sin(t*0.003 + i*0.8)*4;
          ctx.beginPath(); ctx.ellipse(rx, ry, rr, rr*0.35, 0, 0, Math.PI*2);
          ctx.strokeStyle = 'rgba(140,180,220,0.14)'; ctx.lineWidth = 1; ctx.stroke();
        }
      }

      if (weatherMode === 'storm') {
        state.lightningTimer--;
        if (state.lightningTimer <= 0) {
          state.lightningAlpha = 1.0;
          state.lightningTimer = 80 + Math.random() * 140;
        }
        if (state.lightningAlpha > 0) {
          drawLightning(state.lightningAlpha);
          state.lightningAlpha -= 0.06;
        }
      }

      // Readability overlay
      const ov = ctx.createLinearGradient(0, 0, 0, H);
      ov.addColorStop(0, 'rgba(0,0,0,0.06)'); ov.addColorStop(1, 'rgba(0,0,0,0.52)');
      ctx.fillStyle = ov; ctx.fillRect(0, 0, W, H);

      state.raf = requestAnimationFrame(frame);
    };

    state.raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(state.raf);
  }, [weatherMode, canvasRef, initParticles]);
}

// ── Weather mode from UV + condition ─────────────────────────
function getWeatherMode(condition = '') {
  const c = condition.toLowerCase();
  if (c.includes('storm') || c.includes('thunder')) return 'storm';
  if (c.includes('rain') || c.includes('shower'))   return 'rain';
  if (c.includes('overcast') || c.includes('mostly cloudy')) return 'cloudy';
  if (c.includes('partly cloudy'))  return 'partlycloudy';
  if (c.includes('sunny') || c.includes('clear')) return 'sunny';
  return 'neutral';
}

// ── MOCK data (replace with real API calls later) ─────────────
const MOCK_WEATHER = {
  location: 'Melbourne, VIC',
  uvIndex: 8,
  temperature: 27,
  feelsLike: 29,
  cloudCover: 15,
  humidity: 42,
  wind: 18,
  condition: 'Mostly Sunny',
  lastUpdated: new Date(),
};

// ── Home component ────────────────────────────────────────────
export default function Home() {
  // Screen state: 'permission' | 'manual' | 'loading' | 'data' | 'error'
  const [screen, setScreen]     = useState('permission');
  const [weather, setWeather]   = useState(null);
  const [query, setQuery]       = useState('');
  const [inputError, setInputError] = useState('');
  const [time, setTime]         = useState(new Date());
  const [revealed, setRevealed] = useState(false);
  const [stale, setStale]       = useState(false);

  const canvasRef = useRef(null);
  const weatherMode = weather ? getWeatherMode(weather.condition) : 'neutral';

  useWeatherCanvas(canvasRef, weatherMode);

  // Clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Staleness check — warn if data > 1 hour old (AC6)
  useEffect(() => {
    if (!weather) return;
    const check = setInterval(() => {
      const age = (Date.now() - weather.lastUpdated.getTime()) / 1000 / 60;
      setStale(age > 60);
    }, 30000);
    return () => clearInterval(check);
  }, [weather]);

  // AC1 — Request geolocation
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setScreen('manual');
      return;
    }
    setScreen('loading');
    navigator.geolocation.getCurrentPosition(
      (_pos) => {
        // TODO: replace with real API call using pos.coords.latitude / longitude
        setTimeout(() => {
          setWeather({ ...MOCK_WEATHER, lastUpdated: new Date() });
          setStale(false);
          setScreen('data');
        }, 1200);
      },
      (_err) => {
        setScreen('manual');
      },
      { timeout: 8000 }
    );
  };

  // AC1 — Manual suburb / postcode search
  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setInputError('');
    setScreen('loading');
    // TODO: replace with real geocoding + UV API call
    setTimeout(() => {
      const isValid = /^[a-zA-Z\s]{3,}$|^\d{4}$/.test(q);
      if (!isValid) {
        setScreen('error');
        setInputError('Location not recognised. Please try a valid suburb or postcode.');
        return;
      }
      setWeather({ ...MOCK_WEATHER, location: q, lastUpdated: new Date() });
      setStale(false);
      setScreen('data');
    }, 1000);
  };

  // AC2 — Refresh
  const handleRefresh = () => {
    setScreen('loading');
    setTimeout(() => {
      setWeather(w => ({ ...w, lastUpdated: new Date() }));
      setStale(false);
      setScreen('data');
    }, 1000);
  };

  const uvLevel  = weather ? getUVLevel(weather.uvIndex) : null;
  const tips     = uvLevel ? TIPS[uvLevel.key] : [];

  return (
    <div className={`home-root ${revealed ? 'home-root--revealed' : ''}`}>
      {/* Animated weather canvas */}
      <canvas ref={canvasRef} className="home-canvas" />
      <div className="home-grid-overlay" />

      {/* ── AC1: Location permission ── */}
      {screen === 'permission' && (
        <div className="home-screen home-screen--center">
          <div className="perm-card">
            <div className="perm-icon">📍</div>
            <h2 className="perm-title">Allow Location Access</h2>
            <p className="perm-desc">
              UVGuard needs your location to show real-time UV data for where you are right now.
            </p>
            <button className="btn-primary" onClick={requestLocation}>
              Allow While Using App
            </button>
            <button className="btn-secondary" onClick={() => setScreen('manual')}>
              Enter location manually instead
            </button>
          </div>
        </div>
      )}

      {/* ── AC1: Manual entry ── */}
      {(screen === 'manual' || screen === 'error') && (
        <div className="home-screen home-screen--form">
          <div className="form-icon">🔍</div>
          <h2 className="form-title">Enter your location</h2>
          <p className="form-desc">Type your suburb or postcode to get UV data for your area.</p>
          <form onSubmit={handleSearch} className="form-group">
            <input
              className={`form-input ${screen === 'error' ? 'form-input--error' : ''}`}
              type="text"
              placeholder="e.g. Richmond or 3121"
              value={query}
              onChange={e => { setQuery(e.target.value); setInputError(''); }}
            />
            {inputError && (
              <p className="form-error">⚠ {inputError}</p>
            )}
            <button className="btn-primary" type="submit">
              Get UV Data
            </button>
          </form>
        </div>
      )}

      {/* ── AC2: Loading ── */}
      {screen === 'loading' && (
        <div className="home-screen home-screen--center">
          <div className="loading-ring" />
          <p className="loading-text">Fetching UV data…</p>
          <p className="loading-sub">Usually takes less than 3 seconds</p>
        </div>
      )}

      {/* ── Main data screen ── */}
      {screen === 'data' && weather && (
        <div className="home-screen">
          <div className="home-scroll">

            {/* Top bar */}
            <header className="home-header">
              <div className="header-brand">
                <span className="brand-icon">☀</span>
                <span className="brand-name">UVGuard</span>
              </div>
              <div className="header-time">
                {time.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                <span className="header-date">
                  {time.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
              </div>
            </header>

            {/* Search bar */}
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-wrap">
                <span className="search-icon-char">⌕</span>
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search suburb or postcode…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                <button className="search-btn" type="submit">Go</button>
              </div>
            </form>

            {/* AC6: Stale data warning */}
            {stale && (
              <div className="stale-banner">
                <span>⏰</span>
                <span>
                  Data last updated over 1 hour ago. UV conditions may have changed —{' '}
                  <button className="stale-refresh-btn" onClick={handleRefresh}>tap to refresh</button>.
                </span>
              </div>
            )}

            {/* UV Card */}
            <div
              className="uv-card"
              style={{
                background: uvLevel.cardBg,
                borderColor: uvLevel.border,
                boxShadow: `0 8px 40px ${uvLevel.shadow}`,
              }}
            >
              {/* Location + live badge */}
              <div className="uv-card__top">
                <div className="uv-card__location">⌖ {weather.location}</div>
                <div className="live-badge">
                  <div className="live-dot" />
                  LIVE
                </div>
              </div>

              {/* UV hero — AC2 + AC3 */}
              <div className="uv-hero">
                <span className="uv-hero__label">UV Index</span>
                <span className="uv-hero__number">{weather.uvIndex}</span>
                <span className="uv-hero__severity">{uvLevel.label}</span>
                <div className="uv-hero__temp-row">
                  <span className="uv-hero__temp">{weather.temperature}°C</span>
                  <span className="uv-hero__feels">· Feels like {weather.feelsLike}°C</span>
                </div>
              </div>

              {/* Scale bar */}
              <UVGauge uvIndex={weather.uvIndex} />

              {/* Human language alert — AC4 */}
              <UVAlert uvIndex={weather.uvIndex} />

              {/* Weather stats */}
              <div className="weather-stats">
                <div className="stat">
                  <span className="stat__icon">🌡</span>
                  <span className="stat__val">{weather.temperature}°C</span>
                  <span className="stat__lbl">Temp</span>
                </div>
                <div className="stat">
                  <span className="stat__icon">🌤</span>
                  <span className="stat__val">{weather.cloudCover}%</span>
                  <span className="stat__lbl">Cloud</span>
                </div>
                <div className="stat">
                  <span className="stat__icon">💧</span>
                  <span className="stat__val">{weather.humidity}%</span>
                  <span className="stat__lbl">Humidity</span>
                </div>
                <div className="stat">
                  <span className="stat__icon">🌬</span>
                  <span className="stat__val">{weather.wind}km/h</span>
                  <span className="stat__lbl">Wind</span>
                </div>
              </div>
            </div>

            {/* Hourly forecast */}
            <p className="section-label">Hourly Forecast</p>
            <div className="hourly-strip">
              {HOURLY_MOCK.map((h, i) => (
                <div key={i} className={`hour-card ${h.now ? 'hour-card--now' : ''}`}>
                  <span className="hour-card__time">{h.time}</span>
                  <div className="hour-card__circle" style={uvCircleStyle(h.uv)}>{h.uv}</div>
                  <span className="hour-card__icon">{h.icon}</span>
                  <span className="hour-card__temp">{h.temp}°C</span>
                </div>
              ))}
            </div>

            {/* Tips */}
            <p className="section-label">Sun Safety Tips</p>
            <div className="tips-card">
              <div className="tips-card__header">
                <div className="tips-card__icon-wrap">☀️</div>
                <span className="tips-card__title">Today's Recommendations</span>
              </div>
              {tips.map((tip, i) => (
                <div key={i} className="tip-item">
                  <span className="tip-item__emoji">{tip.emoji}</span>
                  <div className="tip-item__body">
                    <strong>{tip.title}</strong>
                    {tip.body}
                  </div>
                </div>
              ))}
            </div>

            {/* AC6: Timestamp */}
            <p className="home-footer">
              Updated {weather.lastUpdated.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
              {' · '}Data: Open-Meteo
            </p>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}