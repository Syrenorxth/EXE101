import { useState } from 'react'
import { Brand } from '../components/Brand.jsx'
import { ThemeToggle } from '../components/Layout.jsx'
import Icon from '../components/Icons.jsx'
import Mascot, { FloatingChips, Sparkles } from '../components/Mascot.jsx'
import { Link } from '../router.jsx'
import { useApp } from '../context/AppContext.jsx'

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login'
  const { login, register, loginDemo, toast } = useApp()
  // Đăng nhập xong, App tự chuyển về trang "next" hoặc trang chính của tài khoản.
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', agree: false })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))


  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!isLogin && !form.agree) {
      setError('Bạn cần đồng ý với điều khoản sử dụng để tạo tài khoản.')
      return
    }
    setBusy(true)
    try {
      const u = isLogin ? await login(form) : await register(form)
      toast(isLogin ? `Chào mừng trở lại, ${u.name}!` : 'Tạo tài khoản thành công.', 'success')
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  const demo = async (role) => {
    setBusy(true)
    const u = await loginDemo(role)
    toast(`Đã vào tài khoản demo: ${u.name}`, 'success')
  }

  return (
    <div className="auth">
      <aside className="auth-side">
        <div className="hero-bg" aria-hidden="true" />
        <Sparkles />
        <Brand light />
        <div className="auth-scene">
          <Mascot size={190} say={isLogin ? 'Chào bạn quay lại!' : 'Mình là Pal, cùng luyện nhé!'} />
          <FloatingChips items={[['mic', 'Tell me about yourself'], ['star', 'Structure 8.5/10'], ['award', 'Huy hiệu mới!']]} />
        </div>
        <div className="auth-side-copy">
          <h2>Mỗi buổi luyện là một lần bớt run khi gặp nhà tuyển dụng thật.</h2>
          <ul className="ticks on-dark">
            <li><Icon name="check" size={16} /> 3 doanh nghiệp mô phỏng, 3 vai người phỏng vấn</li>
            <li><Icon name="check" size={16} /> Trả lời bằng giọng nói, nhận xét từng câu</li>
            <li><Icon name="check" size={16} /> Theo dõi tiến bộ qua từng buổi</li>
          </ul>
        </div>
        <p className="auth-side-note">PalSpeak · Dự án EXE101</p>
      </aside>

      <main className="auth-main">
        <div className="auth-top">
          <Link to="/" className="link-back"><Icon name="arrowLeft" size={16} /> Trang chủ</Link>
          <ThemeToggle />
        </div>
        <div className="auth-card">
          <Mascot size={84} className="auth-mobile-mascot" wave={false} />
          <h1>{isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}</h1>
          <p className="muted">
            {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Đăng ký miễn phí' : 'Đăng nhập'}</Link>
          </p>

          <form onSubmit={submit} className="form" noValidate>
            {!isLogin && (
              <>
                <div className="segmented" role="radiogroup" aria-label="Bạn là">
                  <button type="button" role="radio" aria-checked={form.role === 'student'} className={form.role === 'student' ? 'on' : ''} onClick={() => setForm((f) => ({ ...f, role: 'student' }))}>
                    <Icon name="user" size={16} /> Sinh viên
                  </button>
                  <button type="button" role="radio" aria-checked={form.role === 'school'} className={form.role === 'school' ? 'on' : ''} onClick={() => setForm((f) => ({ ...f, role: 'school' }))}>
                    <Icon name="school" size={16} /> Nhà trường
                  </button>
                </div>
                <label className="field">
                  <span>{form.role === 'school' ? 'Họ tên người phụ trách' : 'Họ và tên'}</span>
                  <input value={form.name} onChange={set('name')} placeholder="Nguyễn Văn A" autoComplete="name" required />
                </label>
              </>
            )}
            <label className="field">
              <span>Email</span>
              <input type="email" value={form.email} onChange={set('email')} placeholder="ban@truong.edu.vn" autoComplete="email" required />
            </label>
            <label className="field">
              <span className="field-row">
                Mật khẩu
                {isLogin && <button type="button" className="link-btn" onClick={() => toast('Bản thử nghiệm chưa hỗ trợ lấy lại mật khẩu. Hãy dùng tài khoản demo hoặc tạo tài khoản mới.', 'warn')}>Quên mật khẩu?</button>}
              </span>
              <span className="input-wrap">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder={isLogin ? '••••••' : 'Ít nhất 6 ký tự'} autoComplete={isLogin ? 'current-password' : 'new-password'} required />
                <button type="button" className="icon-btn" onClick={() => setShowPass((s) => !s)} aria-label={showPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}><Icon name="eye" size={16} /></button>
              </span>
            </label>
            {!isLogin && (
              <label className="check">
                <input type="checkbox" checked={form.agree} onChange={set('agree')} />
                <span>Tôi đồng ý với <Link to="/terms">điều khoản sử dụng và quyền riêng tư</Link>.</span>
              </label>
            )}
            {error && <div className="form-error" role="alert"><Icon name="alert" size={16} /> {error}</div>}
            <button className="btn btn-primary block" disabled={busy}>
              {busy ? 'Đang xử lý…' : isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>
          </form>

          <div className="divider"><span>hoặc dùng thử ngay</span></div>
          <div className="demo-buttons">
            <button className="btn btn-ghost" onClick={() => demo('student')} disabled={busy}><Icon name="user" size={16} /> Tài khoản sinh viên demo</button>
            <button className="btn btn-ghost" onClick={() => demo('school')} disabled={busy}><Icon name="school" size={16} /> Tài khoản nhà trường demo</button>
          </div>
          <p className="fine">Bản thử nghiệm: tài khoản được lưu trên trình duyệt này, chưa có máy chủ.</p>
        </div>
      </main>
    </div>
  )
}
