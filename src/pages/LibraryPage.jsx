import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '../components/Layout.jsx'
import { LessonBody } from '../screens/LearnScreen.jsx'
import { Avatar } from '../components/Brand.jsx'
import Icon, { SpeakerIcon } from '../components/Icons.jsx'
import { navigate } from '../router.jsx'
import { CAREERS, QUESTIONS, SITUATION_CHANGES, TOPICS, REVERSE_QUESTION, REVERSE_TIP, DEFAULT_CAREER, companiesOf, personasOf, lessonFor, modelAnswerFor, topicsOfQuestion } from '../data/content.js'
import { useApp } from '../context/AppContext.jsx'
import { speak, stopSpeaking, TTS_SUPPORTED } from '../lib/speech.js'

const TABS = [
  ['lessons', 'Bài học', 'book'],
  ['questions', 'Ngân hàng câu hỏi', 'chat'],
  ['personas', 'Người phỏng vấn', 'users'],
  ['tips', 'Mẹo cuối buổi', 'info']
]

const KINDS = {
  behavior: ['Hành vi', 'Khung STAR'],
  tech: ['Kiến thức', 'Định nghĩa → ví dụ → so sánh'],
  incident: ['Xử lý tình huống khó', 'Xác nhận, khoanh vùng → nguyên nhân → giải pháp → báo cáo'],
  situation: ['Tình huống thay đổi', 'Xác nhận → ưu tiên → trao đổi rủi ro']
}

const ALL = [
  ...Object.entries(QUESTIONS).map(([id, q]) => ({ id, ...q })),
  ...SITUATION_CHANGES.map((q) => ({ ...q, kind: 'situation' }))
]


function QuestionBank({ career }) {
  const [kind, setKind] = useState('all')
  const [lang, setLang] = useState('en')
  const [q, setQ] = useState('')
  const [openId, setOpenId] = useState(null)
  const [playing, setPlaying] = useState(null)

  useEffect(() => () => stopSpeaking(), [])

  const list = useMemo(() => ALL.filter((x) =>
    (!x.career || x.career === career) &&
    (kind === 'all' || x.kind === kind) &&
    (!q.trim() || `${x.vi} ${x.en}`.toLowerCase().includes(q.trim().toLowerCase()))
  ), [kind, q, career])

  const play = (key, text) => {
    if (playing === key) {
      stopSpeaking()
      setPlaying(null)
      return
    }
    setPlaying(key)
    speak(text, lang, { onEnd: () => setPlaying((p) => (p === key ? null : p)) })
  }

  return (
    <>
      <div className="toolbar">
        <label className="search">
          <Icon name="search" size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm câu hỏi…" aria-label="Tìm câu hỏi" />
        </label>
        <div className="chips">
          <button className={`chip ${kind === 'all' ? 'on' : ''}`} onClick={() => setKind('all')}>Tất cả ({ALL.filter((x) => !x.career || x.career === career).length})</button>
          {Object.entries(KINDS).map(([k, [label]]) => (
            <button key={k} className={`chip ${kind === k ? 'on' : ''}`} onClick={() => setKind(k)}>{label}</button>
          ))}
        </div>
        <div className="segmented small">
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
          <button className={lang === 'vi' ? 'on' : ''} onClick={() => setLang('vi')}>VI</button>
        </div>
      </div>

      <div className="stack">
        {list.map((x) => {
          const model = modelAnswerFor(x.id, career, lang, companiesOf(career)[0].name)
          const isOpen = openId === x.id
          return (
            <article key={x.id} className={`card qa ${isOpen ? 'expanded' : ''}`}>
              <button className="qa-head" onClick={() => setOpenId(isOpen ? null : x.id)} aria-expanded={isOpen}>
                <span className={`kind-tag kind-${x.kind}`}>{KINDS[x.kind][0]}</span>
                <span className="qa-q">{x[lang]}</span>
                <span className="qa-topics">{topicsOfQuestion(x.id, career).map((t) => `CĐ ${t}`).join(' · ')}</span>
                <Icon name="chevronDown" className="chev" />
              </button>
              {isOpen && (
                <div className="qa-body">
                  <p className="muted small">{lang === 'en' ? x.vi : x.en}</p>
                  <p><strong>Khung trả lời:</strong> {KINDS[x.kind][1]}</p>
                  <p><strong>Dàn ý gợi ý:</strong> {x.outline}</p>
                  {model && (
                    <div className="model">
                      <div className="model-head">
                        <h4><Icon name="sparkles" size={15} /> Câu trả lời mẫu</h4>
                        {TTS_SUPPORTED && (
                          <button className="listen" onClick={() => play(x.id, model)}><SpeakerIcon /> {playing === x.id ? 'Dừng' : 'Nghe mẫu'}</button>
                        )}
                      </div>
                      <p>{model}</p>
                    </div>
                  )}
                </div>
              )}
            </article>
          )
        })}
        {!list.length && <p className="muted">Không có câu hỏi nào khớp.</p>}
      </div>
    </>
  )
}

export default function LibraryPage({ tab = 'lessons' }) {
  const current = TABS.some((t) => t[0] === tab) ? tab : 'lessons'
  const { user } = useApp()
  const [lesson, setLesson] = useState(1)
  const [career, setCareer] = useState(user.career || DEFAULT_CAREER)

  return (
    <AppShell title="Thư viện" subtitle="Bài học, câu hỏi mẫu và mẹo phỏng vấn">
      <div className="tabs" role="tablist">
        {TABS.map(([k, label, icon]) => (
          <button key={k} role="tab" aria-selected={current === k} className={current === k ? 'on' : ''} onClick={() => navigate(`/library?tab=${k}`, { replace: true })}>
            <Icon name={icon} size={16} /> {label}
          </button>
        ))}
      </div>

      {current !== 'tips' && (
        <div className="chips career-chips" role="radiogroup" aria-label="Chọn ngành">
          {CAREERS.map((c) => (
            <button key={c.id} role="radio" aria-checked={career === c.id} className={`chip ${career === c.id ? 'on' : ''}`} onClick={() => setCareer(c.id)}>{c.name}</button>
          ))}
        </div>
      )}

      {current === 'lessons' && (
        <div className="lesson-layout">
          <div className="lesson-nav">
            {TOPICS.map((t) => (
              <button key={t.id} className={`option ${lesson === t.id ? 'on' : ''}`} onClick={() => setLesson(t.id)}>
                <span className="option-num">Chủ đề {t.id}</span>
                <span className="option-title">{lessonFor(t.id, career).title}</span>
              </button>
            ))}
          </div>
          <div className="lesson-content">
            <h2 className="section-title">{lessonFor(lesson, career).title}</h2>
            <LessonBody lesson={lessonFor(lesson, career)} />
          </div>
        </div>
      )}

      {current === 'questions' && <QuestionBank career={career} />}

      {current === 'personas' && (
        <div className="grid grid-3">
          {personasOf(career).map((p) => (
            <article key={p.id} className="card persona-card">
              <Avatar name={p.name} size={64} />
              <h3>{p.name}</h3>
              <p className="muted">{p.role}</p>
              <dl className="meta">
                <div><dt>Phong cách</dt><dd>{p.trait}</dd></div>
                <div><dt>Rèn luyện</dt><dd>{p.trains}</dd></div>
                <div><dt>Thời gian</dt><dd>{p.timeLimit} giây mỗi câu</dd></div>
              </dl>
              <blockquote>“{p.intro.vi}”</blockquote>
            </article>
          ))}
        </div>
      )}

      {current === 'tips' && (
        <div className="card narrow-card">
          <h3 className="block-title"><Icon name="chat" size={16} /> Khi được hỏi “{REVERSE_QUESTION.en}”</h3>
          <p>{REVERSE_TIP.vi}</p>
          <h4>Câu hỏi nên hỏi</h4>
          <ul>
            <li>What does a typical day look like for a new member of your team?</li>
            <li>How do you evaluate interns and freshers here?</li>
            <li>What will I be working on in my first three months?</li>
            <li>Một ngày làm việc của thực tập sinh trong nhóm diễn ra thế nào?</li>
          </ul>
          <h4>Nên tránh</h4>
          <ul>
            <li>Hỏi ngay về lương thưởng, ngày nghỉ ở vòng phỏng vấn đầu.</li>
            <li>Trả lời “Không có câu hỏi” vì dễ bị xem là chưa thật sự quan tâm.</li>
            <li>Hỏi những thông tin đã có sẵn trên website của công ty.</li>
          </ul>
        </div>
      )}
    </AppShell>
  )
}
