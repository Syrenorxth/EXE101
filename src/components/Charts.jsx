// Biểu đồ vẽ bằng SVG thuần (không cần thư viện): vòng điểm, radar, đường, cột.
import { tone } from './ScoreBar.jsx'

export function ScoreRing({ value, size = 132, stroke = 11, label = '/10' }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(1, value / 10))
  return (
    <div className={`ring tone-${tone(value)}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} className="ring-track" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="ring-value"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-text">
        <strong style={{ fontSize: size * 0.27 }}>{value.toFixed(1)}</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}

export function RadarChart({ data, size = 240, max = 10 }) {
  const cx = size / 2
  const cy = size / 2 + 6
  const R = size / 2 - 38
  const n = data.length
  const pt = (i, v) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n
    return [cx + Math.cos(a) * R * (v / max), cy + Math.sin(a) * R * (v / max)]
  }
  const poly = (v) => data.map((_, i) => pt(i, typeof v === 'function' ? v(i) : v).join(',')).join(' ')
  return (
    <svg className="radar" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={data.map((d) => `${d.label} ${d.value.toFixed(1)}`).join(', ')}>
      {[2.5, 5, 7.5, 10].map((g) => (
        <polygon key={g} points={poly(g)} className="radar-grid" />
      ))}
      {data.map((_, i) => {
        const [x, y] = pt(i, max)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} className="radar-axis" />
      })}
      <polygon points={poly((i) => data[i].value)} className="radar-area" />
      {data.map((d, i) => {
        const [x, y] = pt(i, d.value)
        return <circle key={i} cx={x} cy={y} r="4" className="radar-dot" />
      })}
      {data.map((d, i) => {
        const [x, y] = pt(i, max + 2.6)
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="radar-label">
            <tspan x={x} dy="-0.4em">{d.label}</tspan>
            <tspan x={x} dy="1.2em" className="radar-value">{d.value.toFixed(1)}</tspan>
          </text>
        )
      })}
    </svg>
  )
}

export function LineChart({ points, max = 10, height = 220, emptyText = 'Chưa có dữ liệu' }) {
  const W = 640
  const H = height
  const pad = { l: 34, r: 16, t: 16, b: 30 }
  if (!points.length) return <div className="chart-empty">{emptyText}</div>
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b
  const x = (i) => pad.l + (points.length === 1 ? iw / 2 : (i * iw) / (points.length - 1))
  const y = (v) => pad.t + ih - (v / max) * ih
  const line = points.map((p, i) => `${x(i)},${y(p.value)}`).join(' ')
  const area = `${x(0)},${y(0)} ${line} ${x(points.length - 1)},${y(0)}`
  const step = Math.ceil(points.length / 8)
  return (
    <svg className="linechart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Biểu đồ điểm theo từng buổi">
      <defs>
        <linearGradient id="lc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="lc-stop-a" />
          <stop offset="1" className="lc-stop-b" />
        </linearGradient>
      </defs>
      {[0, 2.5, 5, 7.5, 10].map((g) => (
        <g key={g}>
          <line x1={pad.l} x2={W - pad.r} y1={y(g)} y2={y(g)} className="lc-grid" />
          {g % 5 === 0 && <text x={pad.l - 8} y={y(g)} textAnchor="end" dominantBaseline="middle" className="lc-tick">{g}</text>}
        </g>
      ))}
      <polygon points={area} fill="url(#lc-fill)" />
      <polyline points={line} className="lc-line" fill="none" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.value)} r="5" className="lc-dot">
            <title>{`${p.label}: ${p.value.toFixed(1)}/10`}</title>
          </circle>
          {i % step === 0 && <text x={x(i)} y={H - 8} textAnchor="middle" className="lc-tick">{p.label}</text>}
        </g>
      ))}
    </svg>
  )
}

export function BarChart({ data, height = 200, unit = '' }) {
  const W = 640
  const H = height
  const pad = { l: 12, r: 12, t: 22, b: 28 }
  const max = Math.max(...data.map((d) => d.value), 1)
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b
  const bw = (iw / data.length) * 0.6
  return (
    <svg className="barchart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Biểu đồ cột">
      <line x1={pad.l} x2={W - pad.r} y1={pad.t + ih} y2={pad.t + ih} className="lc-grid" />
      {data.map((d, i) => {
        const cx = pad.l + (iw / data.length) * (i + 0.5)
        const h = (d.value / max) * ih
        return (
          <g key={d.label}>
            <rect x={cx - bw / 2} y={pad.t + ih - h} width={bw} height={h} rx="6" className={i === data.length - 1 ? 'bar bar-last' : 'bar'}>
              <title>{`${d.label}: ${d.value}${unit}`}</title>
            </rect>
            <text x={cx} y={pad.t + ih - h - 7} textAnchor="middle" className="bar-value">{d.value}</text>
            <text x={cx} y={H - 8} textAnchor="middle" className="lc-tick">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

// Thanh ngang nhỏ, dùng cho bảng và thẻ.
export function Meter({ value, max = 10, className = '' }) {
  return (
    <span className={`meter ${className}`}>
      <span className={`meter-fill tone-${tone((value / max) * 10)}`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
    </span>
  )
}
