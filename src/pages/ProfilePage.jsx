import { useState } from 'react'
import { AppShell } from '../components/Layout.jsx'
import { Avatar } from '../components/Brand.jsx'
import { Confirm } from '../components/Feedback.jsx'
import Icon from '../components/Icons.jsx'
import { navigate } from '../router.jsx'
import { useApp } from '../context/AppContext.jsx'
import { DEFAULT_PREFS } from '../services/auth.js'
import { resetProgress } from '../lib/progress.js'
import { STT_SUPPORTED, TTS_SUPPORTED } from '../lib/speech.js'
import { fmtDate, downloadFile } from '../lib/format.js'

const THEMES = [['light', 'Sáng', 'sun'], ['dark', 'Tối', 'moon'], ['system', 'Theo hệ thống', 'monitor']]

export default function ProfilePage() {
  const { user, progress, setProgress, updateUser, deleteAccount, logout, theme, setTheme, toast } = useApp()
  const isSchool = user.role === 'school'
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    school: user.school || '',
    major: user.major || '',
    year: user.year || '',
    position: user.position || 'Intern',
    target: user.target || '',
    interviewDate: user.interviewDate || '',
    classCode: user.classCode || '',
    title: user.title || ''
  })
  const [prefs, setPrefs] = useState({ ...DEFAULT_PREFS, ...user.prefs })
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = async (patch, msg) => {
    setBusy(true)
    try {
      await updateUser(patch)
      toast(msg, 'success')
    } catch (e) {
      toast(e.message, 'warn')
    }
    setBusy(false)
  }

  const exportData = () => {
    downloadFile(`palspeak-du-lieu-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ user, progress }, null, 2), 'application/json')
  }

  return (
    <AppShell title="Hồ sơ & cài đặt" subtitle="Quản lý thông tin cá nhân và tùy chọn luyện tập">
      <div className="profile-head card">
        <Avatar name={user.name} size={72} />
        <div>
          <h2>{user.name}</h2>
          <p className="muted">{user.email} · {isSchool ? 'Tài khoản nhà trường' : 'Sinh viên'}{user.demo ? ' · Tài khoản demo' : ''}</p>
          <p className="muted small">Tham gia từ {fmtDate(user.createdAt)}</p>
        </div>
      </div>

      <div className="profile-grid">
        <section className="card">
          <h3 className="block-title"><Icon name="user" size={16} /> Thông tin {isSchool ? 'người phụ trách' : 'cá nhân'}</h3>
          <form className="form" onSubmit={(e) => { e.preventDefault(); save(form, 'Đã lưu hồ sơ.') }}>
            <div className="field-grid">
              <label className="field"><span>Họ và tên</span><input value={form.name} onChange={set('name')} /></label>
              <label className="field"><span>Email</span><input type="email" value={form.email} onChange={set('email')} /></label>
            </div>
            <label className="field"><span>Trường</span><input value={form.school} onChange={set('school')} /></label>
            {isSchool ? (
              <label className="field"><span>Chức vụ</span><input value={form.title} onChange={set('title')} /></label>
            ) : (
              <>
                <div className="field-grid">
                  <label className="field"><span>Chuyên ngành</span><input value={form.major} onChange={set('major')} /></label>
                  <label className="field"><span>Năm học</span><input value={form.year} onChange={set('year')} /></label>
                </div>
                <div className="field-grid">
                  <label className="field">
                    <span>Vị trí ứng tuyển</span>
                    <select value={form.position} onChange={set('position')}><option>Intern</option><option>Fresher</option></select>
                  </label>
                  <label className="field"><span>Ngày phỏng vấn dự kiến</span><input type="date" value={form.interviewDate} onChange={set('interviewDate')} /></label>
                </div>
                <div className="field-grid">
                  <label className="field"><span>Mục tiêu</span><input value={form.target} onChange={set('target')} /></label>
                  <label className="field"><span>Mã lớp</span><input value={form.classCode} onChange={(e) => setForm((f) => ({ ...f, classCode: e.target.value.toUpperCase() }))} /></label>
                </div>
              </>
            )}
            <div><button className="btn btn-primary" disabled={busy}>Lưu thay đổi</button></div>
          </form>
        </section>

        <div className="stack">
          {!isSchool && (
            <section className="card">
              <h3 className="block-title"><Icon name="sliders" size={16} /> Tùy chọn luyện tập mặc định</h3>
              <span className="field-label">Ngôn ngữ phỏng vấn</span>
              <div className="chips">
                <button className={`chip ${prefs.language === 'en' ? 'on' : ''}`} onClick={() => setPrefs((p) => ({ ...p, language: 'en' }))}>English</button>
                <button className={`chip ${prefs.language === 'vi' ? 'on' : ''}`} onClick={() => setPrefs((p) => ({ ...p, language: 'vi' }))}>Tiếng Việt</button>
              </div>
              <label className="switch">
                <input type="checkbox" checked={prefs.voice} disabled={!TTS_SUPPORTED} onChange={(e) => setPrefs((p) => ({ ...p, voice: e.target.checked }))} />
                <span>Đọc câu hỏi thành tiếng</span>
              </label>
              <label className="switch">
                <input type="checkbox" checked={prefs.timeChallenge} onChange={(e) => setPrefs((p) => ({ ...p, timeChallenge: e.target.checked }))} />
                <span>Bật giới hạn thời gian mỗi câu</span>
              </label>
              <p className="muted small">
                Trình duyệt: đọc thành tiếng {TTS_SUPPORTED ? 'được hỗ trợ' : 'không hỗ trợ'} · trả lời bằng micro {STT_SUPPORTED ? 'được hỗ trợ' : 'cần Chrome hoặc Edge'}.
              </p>
              <button className="btn btn-primary small" disabled={busy} onClick={() => save({ prefs }, 'Đã lưu tùy chọn luyện tập.')}>Lưu tùy chọn</button>
            </section>
          )}

          <section className="card">
            <h3 className="block-title"><Icon name="monitor" size={16} /> Giao diện</h3>
            <div className="segmented">
              {THEMES.map(([k, label, icon]) => (
                <button key={k} className={theme === k ? 'on' : ''} onClick={() => setTheme(k)}><Icon name={icon} size={16} /> {label}</button>
              ))}
            </div>
          </section>

          <section className="card">
            <h3 className="block-title"><Icon name="shield" size={16} /> Dữ liệu & tài khoản</h3>
            {!isSchool && (
              <label className="switch">
                <input id="presenter" type="checkbox" checked={progress.presenter} onChange={() => setProgress((p) => ({ ...p, presenter: !p.presenter }))} />
                <span>Chế độ trình bày: mở khóa toàn bộ doanh nghiệp và chủ đề</span>
              </label>
            )}
            <div className="btn-list">
              <button className="btn btn-ghost small" onClick={exportData}><Icon name="download" size={16} /> Tải dữ liệu của tôi (JSON)</button>
              {!isSchool && <button className="btn btn-ghost small" onClick={() => setConfirm('reset')}><Icon name="refresh" size={16} /> Xóa toàn bộ tiến độ</button>}
              <button className="btn btn-ghost small" onClick={() => { navigate('/'); logout() }}><Icon name="logout" size={16} /> Đăng xuất</button>
              <button className="btn btn-danger-ghost small" onClick={() => setConfirm('delete')}><Icon name="trash" size={16} /> Xóa tài khoản</button>
            </div>
          </section>
        </div>
      </div>

      <Confirm
        open={confirm === 'reset'}
        title="Xóa toàn bộ tiến độ?"
        body="Điểm rèn luyện, huy hiệu và lịch sử phỏng vấn sẽ bị xóa khỏi trình duyệt này. Không thể hoàn tác."
        confirmLabel="Xóa tiến độ"
        danger
        onConfirm={() => { setProgress(resetProgress()); toast('Đã xóa tiến độ.') }}
        onClose={() => setConfirm(null)}
      />
      <Confirm
        open={confirm === 'delete'}
        title="Xóa tài khoản?"
        body="Tài khoản và toàn bộ dữ liệu luyện tập sẽ bị xóa khỏi trình duyệt này. Không thể hoàn tác."
        confirmLabel="Xóa tài khoản"
        danger
        onConfirm={() => { navigate('/'); deleteAccount().then(() => toast('Đã xóa tài khoản.')) }}
        onClose={() => setConfirm(null)}
      />
    </AppShell>
  )
}
