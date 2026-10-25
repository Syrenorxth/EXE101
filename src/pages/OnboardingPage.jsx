import { useState } from 'react'
import { Brand } from '../components/Brand.jsx'
import Icon from '../components/Icons.jsx'
import Mascot from '../components/Mascot.jsx'
import { navigate } from '../router.jsx'
import { useApp } from '../context/AppContext.jsx'
import { CAREERS, DEFAULT_CAREER, companiesOf } from '../data/content.js'

const YEARS = ['Năm 2', 'Năm 3', 'Năm 4', 'Đã tốt nghiệp']
const MAJORS = ['Kỹ thuật phần mềm', 'Hệ thống thông tin', 'Khoa học máy tính', 'Trí tuệ nhân tạo', 'Marketing', 'Truyền thông đa phương tiện', 'Tài chính – Ngân hàng', 'Kế toán – Kiểm toán', 'Quản trị kinh doanh', 'Kinh doanh quốc tế', 'Ngôn ngữ Anh', 'Khác']
const STEPS = ['Về bạn', 'Mục tiêu', 'Tùy chọn']
const SAY = ['Chào bạn, mình là Pal!', 'Mục tiêu rõ thì luyện nhanh hơn!', 'Sắp xong rồi đó!']

export default function OnboardingPage() {
  const { user, updateUser, toast } = useApp()
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({
    school: user.school || '',
    major: user.major || MAJORS[0],
    year: user.year || 'Năm 3',
    position: user.position || 'Intern',
    career: user.career || DEFAULT_CAREER,
    companyKind: user.companyKind || '',
    interviewDate: user.interviewDate || '',
    target: user.target || '',
    classCode: user.classCode || '',
    prefs: { ...user.prefs }
  })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const setPref = (k, v) => setForm((f) => ({ ...f, prefs: { ...f.prefs, [k]: v } }))

  const finish = async () => {
    setBusy(true)
    await updateUser({ ...form, onboarded: true })
    toast('Hồ sơ đã sẵn sàng. Bắt đầu buổi luyện đầu tiên nhé!', 'success')
    navigate('/dashboard')
  }

  return (
    <div className="onboard">
      <header className="onboard-top">
        <Brand to="/dashboard" />
        <button className="link-btn" onClick={finish} disabled={busy}>Bỏ qua</button>
      </header>
      <div className="onboard-card card">
        <Mascot size={96} className="onboard-mascot" say={SAY[step]} />
        <ol className="onboard-steps">
          {STEPS.map((s, i) => (
            <li key={s} className={i < step ? 'done' : i === step ? 'current' : ''}>
              <span>{i < step ? <Icon name="check" size={14} /> : i + 1}</span>{s}
            </li>
          ))}
        </ol>

        {step === 0 && (
          <div className="form">
            <h1>Chào {user.name.split(' ').pop()}, bạn đang học ở đâu?</h1>
            <p className="muted">Thông tin giúp PalSpeak chọn câu hỏi phù hợp và kết nối với nhà trường của bạn.</p>
            <label className="field">
              <span>Trường</span>
              <input value={form.school} onChange={(e) => set('school', e.target.value)} placeholder="Ví dụ: Đại học FPT" />
            </label>
            <div className="field-grid">
              <label className="field">
                <span>Chuyên ngành</span>
                <select value={form.major} onChange={(e) => set('major', e.target.value)}>
                  {MAJORS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Năm học</span>
                <select value={form.year} onChange={(e) => set('year', e.target.value)}>
                  {YEARS.map((y) => <option key={y}>{y}</option>)}
                </select>
              </label>
            </div>
            <label className="field">
              <span>Mã lớp do nhà trường cấp <small>(không bắt buộc)</small></span>
              <input value={form.classCode} onChange={(e) => set('classCode', e.target.value.toUpperCase())} placeholder="Ví dụ: KTPM-K18" />
            </label>
          </div>
        )}

        {step === 1 && (
          <div className="form">
            <h1>Bạn đang chuẩn bị cho buổi phỏng vấn nào?</h1>
            <p className="muted">PalSpeak sẽ gợi ý lộ trình và đếm ngược đến ngày phỏng vấn.</p>
            <span className="field-label">Ngành bạn muốn ứng tuyển</span>
            <div className="chips">
              {CAREERS.map((c) => (
                <button key={c.id} type="button" className={`chip ${form.career === c.id ? 'on' : ''}`} onClick={() => setForm((f) => ({ ...f, career: c.id, companyKind: '' }))}>{c.name}</button>
              ))}
            </div>
            <span className="field-label">Vị trí ứng tuyển</span>
            <div className="choice-row">
              {[['Intern', 'Sinh viên chưa có kinh nghiệm đi làm'], ['Fresher', 'Mới tốt nghiệp hoặc dưới 1 năm kinh nghiệm']].map(([p, d]) => (
                <button key={p} type="button" className={`pick ${form.position === p ? 'on' : ''}`} onClick={() => set('position', p)}>
                  <strong>{p}</strong>
                  <small>{d}</small>
                </button>
              ))}
            </div>
            <span className="field-label">Loại công ty bạn nhắm tới</span>
            <div className="chips">
              {companiesOf(form.career).map((c) => (
                <button key={c.id} type="button" className={`chip ${form.companyKind === c.kind ? 'on' : ''}`} onClick={() => set('companyKind', c.kind)}>{c.kind}</button>
              ))}
            </div>
            <div className="field-grid">
              <label className="field">
                <span>Ngày phỏng vấn dự kiến <small>(nếu có)</small></span>
                <input type="date" value={form.interviewDate} onChange={(e) => set('interviewDate', e.target.value)} />
              </label>
              <label className="field">
                <span>Mục tiêu của bạn</span>
                <input value={form.target} onChange={(e) => set('target', e.target.value)} placeholder="Ví dụ: Thực tập fullstack" />
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form">
            <h1>Bạn muốn luyện thế nào?</h1>
            <p className="muted">Có thể đổi lại bất cứ lúc nào trong Hồ sơ & cài đặt.</p>
            <span className="field-label">Ngôn ngữ phỏng vấn mặc định</span>
            <div className="choice-row">
              {[['en', 'English', 'Sát với công ty gia công và công ty nước ngoài'], ['vi', 'Tiếng Việt', 'Phù hợp khi mới bắt đầu luyện']].map(([k, t, d]) => (
                <button key={k} type="button" className={`pick ${form.prefs.language === k ? 'on' : ''}`} onClick={() => setPref('language', k)}>
                  <strong>{t}</strong>
                  <small>{d}</small>
                </button>
              ))}
            </div>
            <label className="switch">
              <input type="checkbox" checked={form.prefs.voice} onChange={(e) => setPref('voice', e.target.checked)} />
              <span>Đọc câu hỏi thành tiếng</span>
            </label>
            <label className="switch">
              <input type="checkbox" checked={form.prefs.timeChallenge} onChange={(e) => setPref('timeChallenge', e.target.checked)} />
              <span>Bật giới hạn thời gian mỗi câu (+5 điểm thưởng mỗi buổi)</span>
            </label>
          </div>
        )}

        <div className="onboard-actions">
          {step > 0 ? <button className="btn btn-ghost" onClick={() => setStep(step - 1)}><Icon name="arrowLeft" size={16} /> Quay lại</button> : <span />}
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Tiếp tục <Icon name="arrowRight" size={16} /></button>
          ) : (
            <button className="btn btn-accent" onClick={finish} disabled={busy}>{busy ? 'Đang lưu…' : 'Hoàn tất'} <Icon name="check" size={16} /></button>
          )}
        </div>
      </div>
    </div>
  )
}
