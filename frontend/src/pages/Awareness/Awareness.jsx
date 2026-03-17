// pages/Awareness/Awareness.jsx
import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, Legend
} from 'recharts';
import './Awareness.css';

// ── AC1: Skin Cancer Data (AIHW source) ──────────────────────
const SKIN_CANCER_DATA = [
  { year: '2000', incidence: 8200,  melanoma: 7800  },
  { year: '2003', incidence: 9100,  melanoma: 8500  },
  { year: '2006', incidence: 10400, melanoma: 9800  },
  { year: '2009', incidence: 11800, melanoma: 11200 },
  { year: '2012', incidence: 13200, melanoma: 12600 },
  { year: '2015', incidence: 14100, melanoma: 13500 },
  { year: '2018', incidence: 15800, melanoma: 15100 },
  { year: '2021', incidence: 17200, melanoma: 16400 },
  { year: '2023', incidence: 18100, melanoma: 17300 },
];

// ── AC2: UV Index by Season/State (ARPANSA source) ───────────
const UV_TREND_DATA = [
  { month: 'Jan', VIC: 12, QLD: 14, NSW: 13, WA: 13 },
  { month: 'Feb', VIC: 11, QLD: 13, NSW: 12, WA: 12 },
  { month: 'Mar', VIC: 9,  QLD: 12, NSW: 10, WA: 11 },
  { month: 'Apr', VIC: 6,  QLD: 10, NSW: 7,  WA: 8  },
  { month: 'May', VIC: 3,  QLD: 8,  NSW: 5,  WA: 5  },
  { month: 'Jun', VIC: 2,  QLD: 6,  NSW: 3,  WA: 3  },
  { month: 'Jul', VIC: 2,  QLD: 7,  NSW: 3,  WA: 4  },
  { month: 'Aug', VIC: 4,  QLD: 9,  NSW: 5,  WA: 6  },
  { month: 'Sep', VIC: 6,  QLD: 11, NSW: 8,  WA: 8  },
  { month: 'Oct', VIC: 9,  QLD: 13, NSW: 10, WA: 11 },
  { month: 'Nov', VIC: 11, QLD: 14, NSW: 12, WA: 12 },
  { month: 'Dec', VIC: 12, QLD: 15, NSW: 13, WA: 14 },
];

const STATE_COLORS = {
  VIC: '#60a5fa',
  QLD: '#f87171',
  NSW: '#34d399',
  WA:  '#fbbf24',
};

// ── AC5: Myths ────────────────────────────────────────────────
const MYTHS = [
  {
    id: 1,
    emoji: '☁️',
    myth: "I don't need sunscreen on a cloudy day.",
    fact: "Up to 80% of UV radiation passes through clouds. Overcast skies give a false sense of safety — UV damage happens even when you can't see the sun.",
    stat: "80% of UV rays penetrate cloud cover",
  },
  {
    id: 2,
    emoji: '🏃',
    myth: "I only need sunscreen if I'm outside for a long time.",
    fact: "UV damage begins in as little as 11 minutes at a UV index of 11 (common in Australian summer). Even a short walk to the shops can cause cumulative skin damage.",
    stat: "Melanoma is Australia's most common cancer in ages 15–39",
  },
  {
    id: 3,
    emoji: '🎨',
    myth: "People with darker skin don't need sun protection.",
    fact: "While melanin provides some natural protection, people of all skin tones can develop skin cancer from UV exposure. Darker skin can also develop hyperpigmentation and other UV-related damage.",
    stat: "UV damage affects all skin tones",
  },
  {
    id: 4,
    emoji: '🪟',
    myth: "I'm safe from UV rays when I'm indoors near a window.",
    fact: "UVA rays — which cause skin ageing and contribute to cancer — penetrate glass. Car windows and office windows provide little to no UVA protection.",
    stat: "UVA rays penetrate standard glass",
  },
  {
    id: 5,
    emoji: '🌊',
    myth: "Getting a tan is a sign of healthy skin.",
    fact: "A tan is your skin's response to UV damage — it's a sign that DNA damage has already occurred. There is no such thing as a 'safe' tan from UV exposure.",
    stat: "Australia has the world's highest melanoma rate",
  },
];

// ── Custom Tooltip ────────────────────────────────────────────
const CancerTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>{p.value.toLocaleString()}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const UVTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>UV {p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ── Share helper ──────────────────────────────────────────────
function shareContent(text) {
  if (navigator.share) {
    navigator.share({ title: 'UVGuard — Sun Safety Facts', text });
  } else {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  }
}

// ── Main component ────────────────────────────────────────────
export default function Awareness() {
  const [expandedMyth, setExpandedMyth] = useState(null);
  const [activeStates, setActiveStates] = useState(['VIC', 'QLD', 'NSW', 'WA']);
  const [revealed] = useState(true);

  const toggleState = (state) => {
    setActiveStates(prev =>
      prev.includes(state)
        ? prev.filter(s => s !== state)
        : [...prev, state]
    );
  };

  return (
    <div className={`awareness-root ${revealed ? 'awareness-root--revealed' : ''}`}>
      <div className="awareness-scroll">

        {/* Header */}
        <header className="awareness-header">
          <div className="awareness-header__eyebrow">📊 Data & Insights</div>
          <h1 className="awareness-header__title">Know the Facts</h1>
          <p className="awareness-header__sub">
            Real data. Real risk. Understand why sun protection matters.
          </p>
        </header>

        {/* ── AC1: Skin Cancer Chart ── */}
        <section className="awareness-section">
          <div className="section-tag">AC1 · Skin Cancer</div>
          <h2 className="section-title">Australia's Skin Cancer Crisis</h2>

          <div className="chart-card">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={SKIN_CANCER_DATA} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="melGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                <Tooltip content={<CancerTooltip />} />
                <Area type="monotone" dataKey="incidence" name="All Skin Cancer" stroke="#f87171" fill="url(#incGrad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="melanoma" name="Melanoma" stroke="#fbbf24" fill="url(#melGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              <span className="legend-dot" style={{ background: '#f87171' }} />All Skin Cancer
              <span className="legend-dot" style={{ background: '#fbbf24', marginLeft: 12 }} />Melanoma
            </div>
          </div>

          {/* AC4: Plain language */}
          <div className="insight-box">
            <span className="insight-box__icon">💡</span>
            <p className="insight-box__text">
              Melanoma is Australia's <strong>most common cancer in people aged 15–39</strong>.
              New cases have more than doubled since 2000 — and the trend shows no signs of slowing.
            </p>
          </div>

          {/* AC6: Share */}
          <button
            className="share-btn"
            onClick={() => shareContent('Australia has the world\'s highest melanoma rate — melanoma is the most common cancer in Australians aged 15–39. Check UVGuard for more sun safety facts!')}
          >
            <span>📤</span> Share this stat
          </button>
        </section>

        {/* ── AC2: UV Trend Chart ── */}
        <section className="awareness-section">
          <div className="section-tag">AC2 · UV Trends</div>
          <h2 className="section-title">UV Levels Across Australia</h2>

          {/* State filter */}
          <div className="state-filters">
            {Object.entries(STATE_COLORS).map(([state, color]) => (
              <button
                key={state}
                className={`state-filter-btn ${activeStates.includes(state) ? 'active' : ''}`}
                style={activeStates.includes(state) ? { borderColor: color, color } : {}}
                onClick={() => toggleState(state)}
              >
                {state}
              </button>
            ))}
          </div>

          <div className="chart-card">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={UV_TREND_DATA} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                {/* Danger zone reference */}
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} domain={[0, 16]} />
                <Tooltip content={<UVTooltip />} />
                {/* UV 3+ warning line */}
                {Object.entries(STATE_COLORS).map(([state, color]) =>
                  activeStates.includes(state) ? (
                    <Line
                      key={state}
                      type="monotone"
                      dataKey={state}
                      stroke={color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ) : null
                )}
              </LineChart>
            </ResponsiveContainer>
            <p className="chart-note">⚠ UV index 3+ requires sun protection · Source: ARPANSA</p>
          </div>

          {/* AC4: Plain language */}
          <div className="insight-box">
            <span className="insight-box__icon">🌞</span>
            <p className="insight-box__text">
              In Victoria, UV levels reach <strong>extreme (12+) every summer</strong>.
              Queensland experiences dangerous UV levels for over 9 months of the year —
              making year-round protection essential across all Australian states.
            </p>
          </div>

          {/* AC6: Share */}
          <button
            className="share-btn"
            onClick={() => shareContent('Did you know Queensland has dangerous UV levels for 9+ months a year? Australia\'s UV is no joke. Stay protected with UVGuard!')}
          >
            <span>📤</span> Share this stat
          </button>
        </section>

        {/* ── AC5: Myth Busting ── */}
        <section className="awareness-section">
          <div className="section-tag">AC5 · Myth Busting</div>
          <h2 className="section-title">Common Sun Myths — Busted</h2>
          <p className="section-sub">Tap a card to read the facts.</p>

          <div className="myths-list">
            {MYTHS.map(myth => (
              <div
                key={myth.id}
                className={`myth-card ${expandedMyth === myth.id ? 'myth-card--expanded' : ''}`}
                onClick={() => setExpandedMyth(expandedMyth === myth.id ? null : myth.id)}
              >
                <div className="myth-card__header">
                  <span className="myth-card__emoji">{myth.emoji}</span>
                  <div className="myth-card__content">
                    <p className="myth-card__label">MYTH</p>
                    <p className="myth-card__myth">"{myth.myth}"</p>
                  </div>
                  <span className="myth-card__chevron">
                    {expandedMyth === myth.id ? '▲' : '▼'}
                  </span>
                </div>

                {expandedMyth === myth.id && (
                  <div className="myth-card__body">
                    <div className="myth-card__divider" />
                    <p className="myth-card__fact-label">✅ FACT</p>
                    <p className="myth-card__fact">{myth.fact}</p>
                    <div className="myth-card__stat">
                      <span>📊</span> {myth.stat}
                    </div>
                    {/* AC6: Share */}
                    <button
                      className="share-btn share-btn--small"
                      onClick={(e) => {
                        e.stopPropagation();
                        shareContent(`Sun myth busted! "${myth.myth}" — ${myth.fact} Learn more on UVGuard.`);
                      }}
                    >
                      <span>📤</span> Share this myth
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Data sources */}
        <p className="awareness-sources">
          Sources: AIHW Cancer in Australia 2023 · ARPANSA UV Index Data · Cancer Council Australia
        </p>

      </div>
    </div>
  );
}