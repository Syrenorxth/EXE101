// Linh vật "Pal": rô-bốt đeo tai nghe, biết chớp mắt, vẫy tay, nhún nhảy (vẽ bằng SVG + CSS animation).
// Dùng: <Mascot size={180} say="Sẵn sàng chưa?" />
import { useId } from 'react'
import Icon from './Icons.jsx'

export default function Mascot({ size = 180, say, wave = true, className = '' }) {
  const id = useId().replace(/:/g, '')
  return (
    <div className={`mascot-wrap ${className}`} style={{ width: size }}>
      {say && (
        <div className="mascot-say" key={say}>
          {say}
        </div>
      )}
      <svg className="mascot" viewBox="0 0 200 220" width={size} height={size * 1.1} aria-hidden="true">
        <defs>
          <linearGradient id={`h${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#6d28d9" />
          </linearGradient>
          <linearGradient id={`o${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffb15c" />
            <stop offset="1" stopColor="#f76b15" />
          </linearGradient>
        </defs>
        <ellipse className="m-shadow" cx="100" cy="210" rx="46" ry="7" />
        <g className="m-body">
          {/* Ăng-ten */}
          <line x1="100" y1="32" x2="100" y2="14" stroke="#6d28d9" strokeWidth="5" strokeLinecap="round" />
          <circle className="m-glow" cx="100" cy="10" r="8" fill={`url(#o${id})`} />
          {/* Tai nghe */}
          <rect x="26" y="62" width="18" height="40" rx="9" fill={`url(#o${id})`} />
          <rect x="156" y="62" width="18" height="40" rx="9" fill={`url(#o${id})`} />
          <path d="M36 66 C36 22 164 22 164 66" fill="none" stroke="#4c1d95" strokeWidth="6" strokeLinecap="round" />
          {/* Đầu và màn hình mặt */}
          <rect x="40" y="30" width="120" height="104" rx="38" fill={`url(#h${id})`} />
          <rect x="56" y="52" width="88" height="62" rx="24" fill="#1e0b40" />
          <ellipse className="m-eye" cx="82" cy="80" rx="8" ry="9" fill="#ffd2a6" />
          <ellipse className="m-eye" cx="118" cy="80" rx="8" ry="9" fill="#ffd2a6" />
          <path d="M86 97 Q100 108 114 97" fill="none" stroke="#ffd2a6" strokeWidth="4" strokeLinecap="round" />
          <circle cx="68" cy="98" r="5" fill="#f76b15" opacity="0.55" />
          <circle cx="132" cy="98" r="5" fill="#f76b15" opacity="0.55" />
          {/* Thân */}
          <rect x="62" y="138" width="76" height="58" rx="24" fill="#7c3aed" />
          <circle cx="100" cy="166" r="15" fill={`url(#o${id})`} />
          <rect x="96" y="157" width="8" height="13" rx="4" fill="#fff" />
          <path d="M92 167 a8 8 0 0 0 16 0 M100 175 v4" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          {/* Tay trái */}
          <path d="M64 152 Q44 162 46 182" fill="none" stroke="#7c3aed" strokeWidth="10" strokeLinecap="round" />
          <circle cx="46" cy="184" r="8" fill={`url(#o${id})`} />
          {/* Tay phải (vẫy) */}
          <g className={wave ? 'm-arm' : ''}>
            <path d="M136 152 Q160 140 166 116" fill="none" stroke="#7c3aed" strokeWidth="10" strokeLinecap="round" />
            <circle cx="167" cy="112" r="9" fill={`url(#o${id})`} />
          </g>
        </g>
      </svg>
    </div>
  )
}

// Các thẻ nhỏ bay lơ lửng quanh linh vật.
export function FloatingChips({ items }) {
  return (
    <div className="float-chips" aria-hidden="true">
      {items.map(([icon, text], i) => (
        <span key={text} className={`float-chip fc${i + 1}`}>
          <Icon name={icon} size={15} /> {text}
        </span>
      ))}
    </div>
  )
}

// Hạt lấp lánh trang trí nền (dùng trong các khối nền tím).
export function Sparkles({ count = 14 }) {
  return (
    <div className="sparkles" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 37 + 11) % 100}%`,
            top: `${(i * 53 + 7) % 100}%`,
            width: 4 + (i % 3) * 3,
            height: 4 + (i % 3) * 3,
            animationDelay: `${(i % 7) * 0.6}s`,
            animationDuration: `${3 + (i % 4)}s`
          }}
        />
      ))}
    </div>
  )
}
