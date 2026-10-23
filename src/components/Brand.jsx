import { Link } from '../router.jsx'

// Biểu tượng PalSpeak: khung chat có sóng âm, màu cam trên nền tím.
export function LogoMark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="logo-mark">
      <defs>
        <linearGradient id="ps-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffa24a" />
          <stop offset="1" stopColor="#f76b15" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#ps-grad)" />
      <path d="M11 12h18a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9l-6 4v-4h-3a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3z" fill="#4c1d95" />
      <g stroke="#ffc999" strokeWidth="2.2" strokeLinecap="round">
        <path d="M15 18v3" />
        <path d="M19 16v7" />
        <path d="M23 17.5v4" />
        <path d="M27 19v1" />
      </g>
    </svg>
  )
}

export function Brand({ to = '/', light = false }) {
  return (
    <Link to={to} className={`brand ${light ? 'light' : ''}`} aria-label="PalSpeak – trang chủ">
      <LogoMark />
      <span className="brand-name">Pal<span>Speak</span></span>
    </Link>
  )
}

const HUES = [214, 32, 158, 262, 350, 190, 12]

export function Avatar({ name = '?', size = 36, className = '' }) {
  const letter = (name.trim().split(/\s+/).pop() || '?')[0].toUpperCase()
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997
  const hue = HUES[h % HUES.length]
  return (
    <span
      className={`avatar ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.42, '--hue': hue }}
      aria-hidden="true"
    >
      {letter}
    </span>
  )
}
