export default function Header({ points, mode, onHome, onRoadmap, onProgress }) {
  return (
    <header className="header">
      <div className="header-inner">
        <button className="brand" onClick={onHome} aria-label="Về trang đầu">
          <span className="brand-mark">P</span>
          <span className="brand-name">PalSpeak</span>
        </button>
        <nav className="nav">
          <button className="nav-link" onClick={onRoadmap}>Lộ trình</button>
          <button className="nav-link" onClick={onProgress}>Tiến độ</button>
        </nav>
        <div className="header-right">
          <span className={`mode-badge ${mode}`}>{mode === 'ai' ? 'AI thật' : 'Chế độ demo'}</span>
          <span className="points-pill" title="Điểm rèn luyện">
            <strong>{points}</strong> điểm rèn luyện
          </span>
        </div>
      </div>
    </header>
  )
}
