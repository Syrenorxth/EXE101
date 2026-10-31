// Phỏng vấn theo CV & JD: sinh viên gửi CV và mô tả công việc (JD), AI quét
// rồi tạo một buổi phỏng vấn riêng → phòng phỏng vấn → phản hồi.
import { useRef, useState } from 'react'
import { AppShell } from '../components/Layout.jsx'
import { Avatar } from '../components/Brand.jsx'
import Icon from '../components/Icons.jsx'
import InterviewScreen from '../screens/InterviewScreen.jsx'
import FeedbackScreen from '../screens/FeedbackScreen.jsx'
import { useApp } from '../context/AppContext.jsx'
import { navigate } from '../router.jsx'
import { careerById, personasOf, POSITIONS } from '../data/content.js'
import { AI_ENABLED } from '../lib/aiEngine.js'
import { TTS_SUPPORTED } from '../lib/speech.js'
import { analyzeCvJd, readFileText, ACCEPT, MAX_FILE_MB, MIN_CHARS } from '../lib/cvJd.js'
import { DEFAULT_PREFS } from '../services/auth.js'
import { newId } from '../services/storage.js'
import { recordSession, pointsFor, markStarted, saveSurvey, groupKey } from '../lib/progress.js'
import { awardBadges } from '../lib/achievements.js'

const TITLES = {
  input: ['Phỏng vấn theo CV & JD', 'Gửi CV và mô tả công việc, AI sẽ tạo buổi phỏng vấn riêng cho bạn'],
  review: ['Kết quả quét CV & JD', 'Kiểm tra lại rồi bắt đầu buổi phỏng vấn'],
  interview: ['Phòng phỏng vấn', 'Câu hỏi được soạn từ chính CV và JD của bạn'],
  feedback: ['Kết quả buổi phỏng vấn', 'Đối chiếu câu trả lời với yêu cầu của JD']
}

// Ô nhập một tài liệu: tải file lên hoặc dán nội dung.
function DocInput({ id, label, hint, placeholder, value, onChange }) {
  const inputRef = useRef(null)
  const [file, setFile] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [drag, setDrag] = useState(false)

  const load = async (f) => {
    if (!f) return
    setError('')
    setBusy(true)
    try {
      onChange(await readFileText(f))
      setFile(f.name)
    } catch (e) {
      setFile('')
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card doc-input">
      <h3 className="block-title"><Icon name="file" size={16} /> {label}</h3>
      <p className="muted small">{hint}</p>
      <div
        className={`dropzone ${drag ? 'drag' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); load(e.dataTransfer.files[0]) }}
      >
        <Icon name={busy ? 'refresh' : file ? 'check' : 'download'} size={22} className={busy ? 'spin' : ''} />
        <div>
          <strong>{busy ? 'Đang đọc file…' : file || 'Kéo thả file vào đây'}</strong>
          <small>PDF, Word (.docx) hoặc .txt · tối đa {MAX_FILE_MB} MB</small>
        </div>
        <button type="button" className="btn btn-ghost small" onClick={() => inputRef.current?.click()} disabled={busy}>Chọn file</button>
        <input
          ref={inputRef}
          id={`${id}-file`}
          type="file"
          accept={ACCEPT}
          hidden
          onChange={(e) => { load(e.target.files[0]); e.target.value = '' }}
        />
      </div>
      {error && <p className="mic-error"><Icon name="alert" size={14} /> {error}</p>}
      <label className="field" htmlFor={id}>
        <span className="field-row">Hoặc dán nội dung <small>{value.length} ký tự</small></span>
        <textarea id={id} rows={9} value={value} placeholder={placeholder} onChange={(e) => { onChange(e.target.value); setFile('') }} />
      </label>
    </div>
  )
}

function MatchBar({ value }) {
  const tone = value >= 70 ? 'good' : value >= 45 ? 'mid' : 'low'
  return (
    <div className={`match-bar ${tone}`}>
      <div className="match-head"><span>Mức độ phù hợp với JD</span><strong>{value}%</strong></div>
      <div className="match-track"><span style={{ width: `${value}%` }} /></div>
    </div>
  )
}

export default function CvInterviewPage({ from }) {
  const { user, progress, setProgress, toast } = useApp()
  const prefs = { ...DEFAULT_PREFS, ...user.prefs }
  const setupOf = (a) => {
    const career = careerById(a.careerId)
    return {
      custom: a,
      careerId: career.id,
      position: a.level,
      personaId: career.specialist,
      language: prefs.language,
      timeChallenge: prefs.timeChallenge,
      voice: prefs.voice,
      mode: AI_ENABLED ? 'ai' : 'demo'
    }
  }
  // Mở lại từ lịch sử (?from=<id>): dùng lại kết quả quét đã lưu, vào thẳng bước kiểm tra.
  const saved = progress.history.find((h) => h.id === from && h.custom)?.custom
  const [screen, setScreen] = useState(saved ? 'review' : 'input')
  const [cv, setCv] = useState(saved?.cvText || '')
  const [jd, setJd] = useState(saved?.jdText || '')
  const [busy, setBusy] = useState(false)
  const [analysis, setAnalysis] = useState(saved || null)
  const [showQuestions, setShowQuestions] = useState(false)
  const [setup, setSetup] = useState(saved ? setupOf(saved) : null)
  const [result, setResult] = useState(null)
  const [sessionKey, setSessionKey] = useState(0)

  const go = (s) => {
    setScreen(s)
    window.scrollTo(0, 0)
  }
  const update = (patch) => setSetup((s) => ({ ...s, ...patch }))
  const ready = cv.trim().length >= MIN_CHARS && jd.trim().length >= MIN_CHARS

  const scan = async () => {
    setBusy(true)
    try {
      const { analysis: a, warning } = await analyzeCvJd({ cv, jd, fallbackCareer: user.career, fallbackLevel: user.position })
      if (warning) toast(warning, 'warn')
      setAnalysis(a)
      setShowQuestions(false)
      setSetup(setupOf(a))
      go('review')
    } finally {
      setBusy(false)
    }
  }

  const start = () => {
    setProgress(markStarted)
    setSessionKey((k) => k + 1)
    go('interview')
  }

  // Lưu vào lịch sử và cộng điểm rèn luyện giống buổi luyện theo lộ trình.
  const finish = (evaluation) => {
    const a = setup.custom
    const earned = pointsFor(evaluation.overall.avg, setup.timeChallenge)
    const id = newId()
    const cvInfo = { role: a.role, company: a.company, careerId: a.careerId, level: a.level, match: a.match }
    const previous = progress.history.find((h) => groupKey(h) === groupKey({ kind: 'cv', cv: cvInfo }))
    const recorded = recordSession(progress, {
      id,
      kind: 'cv',
      cv: cvInfo,
      // Chỉ giữ kết quả quét và câu hỏi để phỏng vấn lại, không lưu nội dung CV/JD
      custom: { ...a, cvText: '', jdText: '' },
      careerId: setup.careerId,
      position: setup.position,
      personaId: setup.personaId,
      language: setup.language,
      timeChallenge: setup.timeChallenge,
      spoken: evaluation.answers.some((x) => x.spoken),
      mode: evaluation.mode,
      avg: evaluation.overall.avg,
      earned,
      result: evaluation
    })
    const { progress: after, newly } = awardBadges(recorded)
    setProgress(after)
    newly.forEach((b) => toast(`Huy hiệu mới: ${b.name}`, 'badge'))
    setResult({
      ...evaluation,
      id,
      earned,
      pointsBefore: progress.points,
      pointsAfter: after.points,
      previousAvg: previous?.avg,
      newBadges: newly
    })
    go('feedback')
  }

  const [title, subtitle] = TITLES[screen]

  return (
    <AppShell title={title} subtitle={subtitle} focus={screen === 'interview'}>
      {screen === 'input' && (
        <section className="screen">
          <div className="cv-intro card">
            <span className="cv-intro-icon"><Icon name="sparkles" size={22} /></span>
            <div>
              <strong>AI đọc CV của bạn và JD của nhà tuyển dụng, rồi soạn 6 câu hỏi sát với vị trí đó.</strong>
              <p className="muted small">Câu hỏi sẽ đào sâu đúng dự án bạn ghi trong CV và hỏi vào những kỹ năng JD yêu cầu mà CV còn thiếu. CV chỉ dùng cho buổi này, PalSpeak không lưu lại.</p>
            </div>
          </div>
          <div className="cv-grid">
            <DocInput
              id="cv"
              label="CV của bạn"
              hint="Nên dùng file PDF xuất từ Word/Canva (không phải ảnh chụp) để đọc được chữ."
              placeholder="Dán nội dung CV: học vấn, kinh nghiệm, dự án, kỹ năng…"
              value={cv}
              onChange={setCv}
            />
            <DocInput
              id="jd"
              label="Mô tả công việc (JD)"
              hint="Sao chép tin tuyển dụng từ TopCV, ITviec, LinkedIn… hoặc tải file JD."
              placeholder="Dán JD: tên vị trí, công ty, mô tả công việc, yêu cầu…"
              value={jd}
              onChange={setJd}
            />
          </div>
          <div className="actions">
            <button className="btn btn-ghost" onClick={() => navigate('/practice')}>Luyện theo lộ trình</button>
            <button className="btn btn-accent" onClick={scan} disabled={!ready || busy}>
              <Icon name={busy ? 'refresh' : 'search'} size={16} className={busy ? 'spin' : ''} />
              {busy ? 'Đang quét CV & JD…' : AI_ENABLED ? 'Quét bằng AI và tạo buổi phỏng vấn' : 'Quét và tạo buổi phỏng vấn'}
            </button>
          </div>
          {!ready && <p className="muted small right">Cần ít nhất {MIN_CHARS} ký tự cho mỗi phần CV và JD.</p>}
          {!AI_ENABLED && <p className="muted small right">Chưa cấu hình API key nên đang quét theo từ khóa (chế độ demo).</p>}
        </section>
      )}

      {screen === 'review' && analysis && setup && (
        <section className="screen setup-layout">
          <div className="setup">
            <button className="link-back" onClick={() => go('input')}><Icon name="arrowLeft" size={16} /> Sửa CV hoặc JD</button>

            <div className="card setup-block">
              <span className="kicker">{analysis.mode === 'ai' ? 'AI đã quét CV & JD' : 'Quét theo từ khóa (demo)'}</span>
              <h3 className="cv-role">{analysis.role}</h3>
              <p className="muted">{[analysis.company, careerById(analysis.careerId).name, `${analysis.level} · ${POSITIONS[analysis.level]}`].filter(Boolean).join(' · ')}</p>
              <MatchBar value={analysis.match} />
              {analysis.summary && <p>{analysis.summary}</p>}
              <div className="two-col cv-fit">
                <div>
                  <h4 className="good-text"><Icon name="check" size={15} /> CV đáp ứng</h4>
                  <ul className="cv-list good">{analysis.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
                </div>
                <div>
                  <h4 className="low-text"><Icon name="alert" size={15} /> Cần bổ sung</h4>
                  <ul className="cv-list low">{analysis.gaps.map((s) => <li key={s}>{s}</li>)}</ul>
                </div>
              </div>
            </div>

            <div className="card setup-block">
              <h3 className="block-title"><span className="block-num">1</span> Trình tự buổi phỏng vấn</h3>
              <ol className="cv-plan">
                {analysis.plan.map((q, i) => (
                  <li key={i}>
                    <strong>{q.stage}</strong>
                    {showQuestions && <span>{q[setup.language]}</span>}
                  </li>
                ))}
              </ol>
              <button className="btn btn-ghost small" onClick={() => setShowQuestions((v) => !v)}>
                <Icon name="eye" size={14} /> {showQuestions ? 'Ẩn câu hỏi' : 'Xem trước câu hỏi'}
              </button>
              <p className="muted small">Nên giữ bất ngờ như phỏng vấn thật: chỉ xem trước khi muốn chuẩn bị kỹ.</p>
            </div>

            <div className="card setup-block">
              <h3 className="block-title"><span className="block-num">2</span> Người phỏng vấn</h3>
              <div className="grid grid-3 tight">
                {personasOf(setup.careerId).map((p) => (
                  <button key={p.id} className={`option persona ${setup.personaId === p.id ? 'on' : ''}`} onClick={() => update({ personaId: p.id })}>
                    <Avatar name={p.name} size={44} />
                    <span className="option-title">{p.name}</span>
                    <span className="option-num">{p.role}</span>
                    <span className="option-desc">{p.trait}.</span>
                    <span className="persona-time"><Icon name="clock" size={12} /> {p.timeLimit} giây/câu</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="card setup-block">
              <h3 className="block-title"><span className="block-num">3</span> Tùy chọn</h3>
              <div className="two-col">
                <div>
                  <h4>Ngôn ngữ phỏng vấn</h4>
                  <div className="chips">
                    <button className={`chip ${setup.language === 'en' ? 'on' : ''}`} onClick={() => update({ language: 'en' })}>English</button>
                    <button className={`chip ${setup.language === 'vi' ? 'on' : ''}`} onClick={() => update({ language: 'vi' })}>Tiếng Việt</button>
                  </div>
                </div>
                <div>
                  <h4>Chế độ chấm</h4>
                  <div className="chips">
                    <button disabled={!AI_ENABLED} className={`chip ${setup.mode === 'ai' ? 'on' : ''}`} onClick={() => update({ mode: 'ai' })}><Icon name="sparkles" size={14} /> AI thật</button>
                    <button className={`chip ${setup.mode === 'demo' ? 'on' : ''}`} onClick={() => update({ mode: 'demo' })}>Chế độ demo</button>
                  </div>
                </div>
                <div>
                  <h4>Giới hạn thời gian</h4>
                  <label className="switch">
                    <input id="cv-time" type="checkbox" checked={setup.timeChallenge} onChange={(e) => update({ timeChallenge: e.target.checked })} />
                    <span>{setup.timeChallenge ? 'Bật' : 'Tắt'}</span>
                  </label>
                </div>
                <div>
                  <h4>Giọng nói</h4>
                  <label className="switch">
                    <input id="cv-voice" type="checkbox" checked={setup.voice} disabled={!TTS_SUPPORTED} onChange={(e) => update({ voice: e.target.checked })} />
                    <span>Đọc câu hỏi thành tiếng</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <aside className="card summary-card">
            <span className="kicker">Tóm tắt buổi phỏng vấn</span>
            <div className="summary-company">
              <span className="co-logo co-cv"><Icon name="briefcase" size={18} /></span>
              <div>
                <strong>{analysis.company || 'Nhà tuyển dụng'}</strong>
                <small>{analysis.role} · {analysis.level}</small>
              </div>
            </div>
            <ul className="summary-list">
              <li><Icon name="file" size={15} /> Câu hỏi soạn từ CV & JD của bạn</li>
              <li><Icon name="chat" size={15} /> {analysis.plan.length} câu hỏi chính + câu hỏi đào sâu</li>
              <li><Icon name="globe" size={15} /> {setup.language === 'en' ? 'English' : 'Tiếng Việt'}</li>
              <li><Icon name={setup.mode === 'ai' ? 'sparkles' : 'zap'} size={15} /> {setup.mode === 'ai' ? 'Chấm bằng AI thật' : 'Chấm theo quy tắc (demo)'}</li>
            </ul>
            <button className="btn btn-primary block" onClick={start}>
              <Icon name="mic" size={16} /> Bắt đầu phỏng vấn
            </button>
            <p className="fine">Kết quả được lưu vào lịch sử và cộng điểm rèn luyện như buổi luyện thường.</p>
          </aside>
        </section>
      )}

      {screen === 'interview' && setup && (
        <InterviewScreen
          key={sessionKey}
          setup={setup}
          onFinish={finish}
          onExit={() => go('review')}
          onSwitchToDemo={() => { update({ mode: 'demo' }); setSessionKey((k) => k + 1) }}
        />
      )}

      {screen === 'feedback' && result && setup && (
        <FeedbackScreen
          result={result}
          setup={setup}
          readOnly
          retryLabel="Phỏng vấn lại"
          survey={progress.history.find((h) => h.id === result.id)?.survey}
          onSurvey={(s) => { setProgress((p) => saveSurvey(p, result.id, s)); toast('Cảm ơn bạn đã góp ý!', 'success') }}
          onRetry={start}
          onHistory={() => navigate('/history')}
          extraActions={<button className="btn btn-ghost" onClick={() => go('input')}>Thử CV hoặc JD khác</button>}
        />
      )}
    </AppShell>
  )
}
