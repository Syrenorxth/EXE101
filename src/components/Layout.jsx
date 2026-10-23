// Khung trang: AppShell cho người đã đăng nhập (thanh bên + thanh trên),
// PublicHeader/PublicFooter cho trang giới thiệu và đăng nhập.
import { useEffect, useState } from 'react'
import { Brand, Avatar } from './Brand.jsx'
import Icon from './Icons.jsx'
import { Link, navigate, useRoute } from '../router.jsx'
import { useApp } from '../context/AppContext.jsx'
import { AI_ENABLED } from '../lib/aiEngine.js'

const NAV = {
  student: [
    { to: '/dashboard', label: 'Tổng quan', icon: 'home' },
    { to: '/practice', label: 'Luyện phỏng vấn', icon: 'chat' },
    { to: '/history', label: 'Lịch sử & tiến bộ', icon: 'chart' },
    { to: '/library', label: 'Thư viện', icon: 'book' },
    { to: '/achievements', label: 'Huy hiệu', icon: 'award' }
  ],
  school: [
    { to: '/school', label: 'Tổng quan', icon: 'grid', exact: true },
    { to: '/school/students', label: 'Sinh viên', icon: 'users' },
    { to: '/school/classes', label: 'Lớp & mã mời', icon: 'building' },
    { to: '/school/pilot', label: 'Chỉ số thử nghiệm', icon: 'target' },
    { to: '/library', label: 'Nội dung luyện tập', icon: 'book' },
    { to: '/practice', label: 'Trải nghiệm như sinh viên', icon: 'chat' }
  ]
}

const THEMES = [
  ['light', 'sun', 'Giao diện sáng'],
  ['dark', 'moon', 'Giao diện tối'],
  ['system', 'monitor', 'Theo hệ thống']
]

export function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useApp()
  const i = THEMES.findIndex((t) => t[0] === theme)
  const [, icon, label] = THEMES[i < 0 ? 2 : i]
  const next = THEMES[(i + 1) % THEMES.length]
  return (
    <button className={`icon-btn ${className}`} onClick={() => setTheme(next[0])} title={`${label} · bấm để đổi`} aria-label={`${label}, bấm để chuyển sang ${next[2].toLowerCase()}`}>
      <Icon name={icon} />
    </button>
  )
}

export function AppShell({ title, subtitle, actions, focus = false, children }) {
  const { user, progress, logout, toast } = useApp()
  const { path } = useRoute()
  const [open, setOpen] = useState(false)
  const items = NAV[user.role] || NAV.student

  useEffect(() => { setOpen(false) }, [path])

  const isActive = (item) => (item.exact ? path === item.to : path === item.to || path.startsWith(`${item.to}/`))

  // Rời trang cần đăng nhập trước, rồi mới xóa phiên (tránh bị chuyển sang trang đăng nhập).
  const doLogout = async () => {
    navigate('/')
    await logout()
    toast('Bạn đã đăng xuất.')
  }

  return (
    <div className={`shell ${focus ? 'focus' : ''} ${open ? 'nav-open' : ''}`}>
      <aside className="sidebar" aria-label="Điều hướng chính">
        <div className="sidebar-top">
          <Brand to={user.role === 'school' ? '/school' : '/dashboard'} light />
          <button className="icon-btn only-mobile" onClick={() => setOpen(false)} aria-label="Đóng menu"><Icon name="x" /></button>
        </div>
        {user.role === 'school' && <p className="sidebar-org">{user.school}</p>}
        <nav className="side-nav">
          {items.map((item) => (
            <Link key={item.to} to={item.to} className={`side-link ${isActive(item) ? 'active' : ''}`} aria-current={isActive(item) ? 'page' : undefined}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          {user.role === 'student' && (
            <Link to="/practice" className="side-cta">
              <Icon name="mic" />
              <span>
                <strong>Luyện ngay</strong>
                <small>Một buổi chỉ 10–15 phút</small>
              </span>
            </Link>
          )}
          <Link to="/profile" className={`side-link ${path === '/profile' ? 'active' : ''}`}>
            <Icon name="sliders" />
            <span>Hồ sơ & cài đặt</span>
          </Link>
          <button className="side-link" onClick={doLogout}>
            <Icon name="logout" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
      <div className="scrim" onClick={() => setOpen(false)} aria-hidden="true" />

      <div className="shell-main">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setOpen(true)} aria-label="Mở menu"><Icon name="menu" /></button>
          <div className="topbar-title">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="topbar-right">
            {actions}
            <span className={`mode-chip ${AI_ENABLED ? 'ai' : 'demo'}`} title={AI_ENABLED ? 'Đã cấu hình API key, có thể dùng AI thật' : 'Chưa cấu hình API key, chấm điểm theo quy tắc'}>
              <Icon name={AI_ENABLED ? 'sparkles' : 'zap'} size={14} />
              {AI_ENABLED ? 'AI sẵn sàng' : 'Chế độ demo'}
            </span>
            {user.role === 'student' && (
              <Link to="/achievements" className="points-chip" title="Điểm rèn luyện">
                <Icon name="star" size={14} />
                <strong>{progress.points}</strong>
                <span>điểm</span>
              </Link>
            )}
            <ThemeToggle />
            <Link to="/profile" className="me" aria-label="Hồ sơ của bạn">
              <Avatar name={user.name} size={34} />
              <span className="me-text">
                <strong>{user.name}</strong>
                <small>{user.role === 'school' ? 'Nhà trường' : user.school || 'Sinh viên'}</small>
              </span>
            </Link>
          </div>
        </header>
        <main className="page" id="main">{children}</main>
      </div>
    </div>
  )
}

export function PublicHeader() {
  const { user } = useApp()
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id) => {
    if (window.location.hash.replace('#', '') !== '/' && window.location.hash !== '') {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className={`public-header ${solid ? 'solid' : ''}`}>
      <div className="public-inner">
        <Brand light />
        <nav className="public-nav">
          <button onClick={() => go('features')}>Tính năng</button>
          <button onClick={() => go('how')}>Cách hoạt động</button>
          <button onClick={() => go('schools')}>Cho nhà trường</button>
          <button onClick={() => go('pricing')}>Bảng giá</button>
          <button onClick={() => go('faq')}>Hỏi đáp</button>
        </nav>
        <div className="public-actions">
          <ThemeToggle className="on-dark" />
          {user ? (
            <Link to={user.role === 'school' ? '/school' : '/dashboard'} className="btn btn-accent small">Vào ứng dụng <Icon name="arrowRight" size={16} /></Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-on-dark small hide-xs">Đăng nhập</Link>
              <Link to="/register" className="btn btn-accent small">Dùng thử miễn phí</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-inner footer-grid">
        <div>
          <Brand light />
          <p>Nền tảng luyện phỏng vấn xin việc cùng AI cho sinh viên IT Việt Nam ở cấp độ Intern và Fresher.</p>
        </div>
        <div>
          <h4>Sản phẩm</h4>
          <Link to="/register">Tạo tài khoản</Link>
          <Link to="/login">Đăng nhập</Link>
          <Link to="/terms">Điều khoản & quyền riêng tư</Link>
        </div>
        <div>
          <h4>Dự án</h4>
          <span>PalSpeak · Dự án môn EXE101</span>
          <span>Bản MVP · Phiên bản 0.2</span>
        </div>
      </div>
      <div className="public-inner footer-note">
        Điểm số do AI đưa ra chỉ phục vụ mục đích học tập, không phải đánh giá chính thức về năng lực tuyển dụng.
        Tên doanh nghiệp trong bài luyện là doanh nghiệp mô phỏng.
      </div>
    </footer>
  )
}
