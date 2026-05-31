// ════════════════════════════════════════════════════════════════════
// UI Components — Engagement Simulator
// ════════════════════════════════════════════════════════════════════

const { useState, useMemo, useEffect, useRef, useCallback } = React;
const T = window.T;

// ---------- Icons (inline SVG, original) ----------
const Icon = ({ name, size = 16, color = 'currentColor', strokeWidth = 1.6 }) => {
  const paths = {
    flask: <><path d="M9 3h6M10 3v6.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.5V3" /><path d="M7 15h10" /></>,
    heart: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />,
    share: <><path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></>,
    repeat: <><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></>,
    chat: <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />,
    info: <><circle cx="12" cy="12" r="9" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>,
    sparkle: <path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7zM19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9z" />,
    bolt: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.9" /><path d="M16 3.1A4 4 0 0 1 16 11" /></>,
    chart: <><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
    refresh: <><polyline points="23 4 23 10 17 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>,
    moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 4" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    arrowUp: <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>,
    arrowDown: <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>,
    check: <polyline points="20 6 9 17 4 12" />,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    alert: <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    chevDown: <polyline points="6 9 12 15 18 9" />,
    chevUp: <polyline points="18 15 12 9 6 15" />,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
    cite: <><path d="M3 21V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13l-4-3-4 3-4-3-4 3z" /></>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22 6 12 13 2 6" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {paths[name] || null}
    </svg>
  );
};

// ---------- Sparkline ----------
function Sparkline({ values, color, height = 44 }) {
  const w = 200, h = height, pad = 4;
  const max = Math.max(...values), min = Math.min(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return [x, y];
  });
  const d = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');
  const da = `${d} L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`;
  const id = `g-${color.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={da} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// Generate a stable-ish sparkline distribution shape from a mu + alpha
function distroValues(mu, alpha, n = 32) {
  if (!mu || mu <= 0) return new Array(n).fill(0);
  // Use the variance of negative binomial-ish distribution to shape a smooth curve
  // Just produce a smoothed deterministic noise envelope around mu
  const sd = Math.sqrt(mu + alpha * mu * mu);
  const seed = Math.floor(mu * 7.3);
  const rand = (i) => {
    const x = Math.sin(seed * 11 + i * 3.7) * 10000;
    return x - Math.floor(x);
  };
  const raw = [];
  for (let i = 0; i < n; i++) {
    raw.push(mu + (rand(i) - 0.5) * sd * 0.9);
  }
  // smooth
  const sm = raw.map((_, i) => (raw[Math.max(0, i - 1)] + raw[i] + raw[Math.min(n - 1, i + 1)]) / 3);
  return sm;
}

// ---------- Metric Pill (Likes/Shares/Comments header) ----------
function MetricCard({ icon, label, color, low, high, med, unit, mu, alpha, active, onClick }) {
  const vals = useMemo(() => distroValues(mu, alpha), [mu, alpha]);
  return (
    <button
      onClick={onClick}
      className={`metric-card ${active ? 'active' : ''}`}
      style={{ '--accent': color }}
    >
      <div className="metric-head">
        <div className="metric-icon" style={{ color }}>
          <Icon name={icon} size={18} />
        </div>
        <div className="metric-label">{T(label)}</div>
        {active && <div className="metric-active-dot" />}
      </div>
      <div className="metric-range" style={{ color }}>
        {Math.round(low).toLocaleString()}<span className="metric-dash">–</span>{Math.round(high).toLocaleString()}
      </div>
      <div className="metric-median">{T("maybe around")} {Math.round(med).toLocaleString()} {T(Math.round(med) === 1 && unit ? unit.replace(/s$/, '') : (unit || ''))}</div>
      <div className="metric-spark">
        <Sparkline values={vals} color={color} />
      </div>
    </button>
  );
}

// ---------- Signal Chip ----------
function SignalChip({ name, icon, detected, color, hint }) {
  return (
    <div className={`signal-chip ${detected ? 'on' : ''}`} title={hint} style={{ '--c': color }}>
      <div className="signal-icon">
        <Icon name={icon} size={14} />
      </div>
      <div className="signal-text">
        <div className="signal-name">{T(name)}</div>
        <div className="signal-state">{detected ? T('Detected') : T('Not detected')}</div>
      </div>
    </div>
  );
}

// ---------- Factor Bar ----------
function FactorBar({ f, maxAbs }) {
  const pct = Math.min(1, Math.abs(f.contrib) / maxAbs) * 100;
  const up = f.contrib > 0;
  return (
    <div className="factor-row">
      <div className={`factor-arrow ${up ? 'up' : 'down'}`}>
        <Icon name={up ? 'arrowUp' : 'arrowDown'} size={12} strokeWidth={2.2} />
      </div>
      <div className="factor-info">
        <div className="factor-label">{T(f.label)}</div>
        <div className="factor-sub">{T(f.sub)}</div>
      </div>
      <div className="factor-bar-wrap">
        <div className={`factor-bar ${up ? 'up' : 'down'}`} style={{ width: `${pct}%` }} />
      </div>
      <div className={`factor-mult ${up ? 'up' : 'down'}`}>
        {up ? '+' : ''}{((f.mult - 1) * 100).toFixed(0)}%
      </div>
    </div>
  );
}

// ---------- Step Pill ----------
function StepPill({ n, children }) {
  return (
    <div className="step-pill">
      <div className="step-n">{n}</div>
      <h3>{children}</h3>
    </div>
  );
}

// ---------- Segment control ----------
function Segment({ options, value, onChange }) {
  return (
    <div className="segment">
      {options.map(o => (
        <button key={o.value} className={value === o.value ? 'on' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ---------- Slider with value display ----------
function Slider({ value, onChange, min, max, step = 1, format, leftLabel, rightLabel }) {
  return (
    <div className="slider-wrap">
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
      />
      <div className="slider-rail" style={{ width: `${((value - min) / (max - min)) * 100}%` }} />
      <div className="slider-labels">
        <span>{leftLabel || min}</span>
        <span>{rightLabel || max}</span>
      </div>
    </div>
  );
}

// ---------- Pulse logo ----------
function BrandMark() {
  return (
    <div className="brandmark" aria-hidden="true">
      <img src="logo-icon.png" alt="Fundraising Engagement Lab" width="40" height="40" />
    </div>
  );
}

Object.assign(window, {
  Icon, Sparkline, MetricCard, SignalChip, FactorBar, StepPill, Segment, Slider, BrandMark,
});
