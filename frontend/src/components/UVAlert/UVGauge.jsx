// components/UVAlert/UVGauge.jsx
// Colour-coded 5-segment scale bar with active segment indicator

const UV_SEGMENTS = [
  { key: 'low',      color: '#4ade80', label: 'Low',       range: [0, 2]  },
  { key: 'moderate', color: '#facc15', label: 'Moderate',  range: [3, 5]  },
  { key: 'high',     color: '#fb923c', label: 'High',      range: [6, 7]  },
  { key: 'veryHigh', color: '#f87171', label: 'Very High', range: [8, 10] },
  { key: 'extreme',  color: '#c084fc', label: 'Extreme',   range: [11, 20]},
];

function getActiveSegment(index) {
  for (const seg of UV_SEGMENTS) {
    if (index >= seg.range[0] && index <= seg.range[1]) return seg.key;
  }
  return 'extreme';
}

export default function UVGauge({ uvIndex }) {
  const active = getActiveSegment(uvIndex);
  return (
    <div className="uv-gauge">
      {UV_SEGMENTS.map(seg => (
        <div
          key={seg.key}
          className={`gauge-seg ${active === seg.key ? 'gauge-seg--active' : ''}`}
          style={{ background: seg.color }}
          title={seg.label}
        />
      ))}
    </div>
  );
}