import { useEffect, useState } from 'react'
import ScoreBar, { tone } from '../components/ScoreBar.jsx'
import { ScoreRing, RadarChart } from '../components/Charts.jsx'
import Icon, { SpeakerIcon } from '../components/Icons.jsx'
import { COMPANIES, REVERSE_TIP } from '../data/content.js'
import { splitSentences } from '../lib/mockEngine.js'
import { speak, stopSpeaking, TTS_SUPPORTED } from '../lib/speech.js'

const CRITERIA = [
  ['relevance', 'Relevance', 'Đúng trọng tâm câu hỏi'],
  ['clarity', 'Clarity', 'Diễn đạt rõ ràng, độ dài hợp lý'],
  ['structure', 'Structure', 'Có cấu trúc (STAR / định nghĩa → ví dụ → so sánh / xử lý sự cố)']
]

const VERDICT = {
  good: ['Rất tốt!', 'Bạn trả lời rõ ràng và có cấu trúc. Hãy thử doanh nghiệp hoặc chủ đề khó hơn.'],
  mid: ['Khá ổn, còn có thể tốt hơn', 'Xem các câu được đánh dấu bên dưới và luyện lại một lần nữa.'],
  low: ['Cần luyện thêm', 'Đừng lo, buổi đầu ai cũng vậy. Đọc câu trả lời mẫu rồi thử lại ngay.']
}

// Hiển thị câu trả lời, tô màu và đánh số những câu có lỗi.
function AnnotatedAnswer({ answer, issues }) {
  const sentences = splitSentences(answer || '')
  if (!sentences.length) return <p className="quote">(Không có câu trả lời)</p>
  const markOf = (i, s) => issues.findIndex((x) => x.index === i || (x.index < 0 && (s.includes(x.text.trim()) || x.text.includes(s))))
  return (
    <p className="quote annotated">
      {sentences.map((s, i) => {
        const k = markOf(i, s)
        return k >= 0 ? (
          <mark key={i} className="err-sentence">
            <sup className="err-num">{k + 1}</sup>{s}
          </mark>
        ) : (
          <span key={i}>{s}</span>
        )
      }).reduce((acc, el, i) => (i ? [...acc, ' ', el] : [el]), [])}
    </p>
  )
}

// Phần "Bạn có câu hỏi nào không?" cuối buổi: không chấm điểm, chỉ góp ý.
function ReverseBox({ reverse, lang }) {
  const text = (reverse.text || '').trim()
  const n = text ? text.split(/\s+/).length : 0
  const declined = !text || /^(no|nope|not really|không|dạ không|em không|mình không)\b/i.test(text)
  const asked = !declined && (text.includes('?') || n >= 6)
  return (
    <div className="card reverse-box">
      <h3 className="block-title">
        <Icon name="chat" size={16} /> Câu hỏi bạn hỏi lại nhà tuyển dụng <span className="tag inline">Không tính điểm</span>
      </h3>
      <p className="quote">{text || '(Không có câu hỏi)'}</p>
      <p className="muted">
        {asked
          ? 'Tốt: chủ động hỏi lại cho thấy bạn thật sự quan tâm đến vị trí. Câu hỏi nên xoay quanh công việc, nhóm hoặc lộ trình phát triển, tránh hỏi ngay về lương thưởng ở vòng đầu.'
          : (REVERSE_TIP[lang] || REVERSE_TIP.vi)}
      </p>
    </div>
  )
}

function Rating({ label, value, onChange }) {
  return (
    <div className="rating">
      <span>{label}</span>
      <div className="rating-scale" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={value === n} className={value === n ? 'on' : ''} onClick={() => onChange(n)}>{n}</button>
        ))}
      </div>
    </div>
  )
}

// Khảo sát ngắn sau buổi (phục vụ đo chỉ số H2, H3 trong kế hoạch thử nghiệm MVP).
function Survey({ survey, onSubmit }) {
  const [helpful, setHelpful] = useState(0)
  const [realism, setRealism] = useState(0)
  const [note, setNote] = useState('')
  if (survey) {
    return (
      <div className="card survey done">
        <Icon name="check" /> Cảm ơn bạn đã đánh giá: phản hồi hữu ích {survey.helpful}/5, giống phỏng vấn thật {survey.realism}/5.
      </div>
    )
  }
  return (
    <div className="card survey">
      <h3 className="block-title"><Icon name="star" size={16} /> Đánh giá nhanh buổi phỏng vấn</h3>
      <p className="muted small">Hai câu hỏi giúp nhóm PalSpeak cải thiện sản phẩm (1 = rất thấp, 5 = rất cao).</p>
      <Rating label="Phản hồi có hữu ích với bạn không?" value={helpful} onChange={setHelpful} />
      <Rating label="Buổi luyện giống phỏng vấn thật đến mức nào?" value={realism} onChange={setRealism} />
      <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Góp ý thêm (không bắt buộc)" />
      <button className="btn btn-primary small" disabled={!helpful || !realism} onClick={() => onSubmit({ helpful, realism, note: note.trim() })}>Gửi đánh giá</button>
    </div>
  )
}

export default function FeedbackScreen({ result, setup, survey, onSurvey, onRetry, onNextTopic, onRoadmap, onHistory, readOnly = false }) {
  const [open, setOpen] = useState(0)
  const [playing, setPlaying] = useState(null)
  const { overall } = result
  const newlyUnlocked = COMPANIES.filter(
    (c) => (!setup.careerId || c.career === setup.careerId) && c.unlockPoints > result.pointsBefore && c.unlockPoints <= result.pointsAfter
  )
  const totalIssues = result.answers.reduce((n, a) => n + (a.sentenceIssues?.length || 0), 0)
  const [headline, advice] = VERDICT[tone(overall.avg)]
  const diff = result.previousAvg !== undefined ? overall.avg - result.previousAvg : null

  useEffect(() => () => stopSpeaking(), [])

  const play = (i, text) => {
    if (playing === i) {
      stopSpeaking()
      setPlaying(null)
      return
    }
    setPlaying(i)
    speak(text, setup.language, { onEnd: () => setPlaying((p) => (p === i ? null : p)) })
  }

  return (
    <section className="screen feedback">
      <div className="result-hero card">
        <div className="result-score">
          <ScoreRing value={overall.avg} size={150} stroke={12} />
          <div>
            <span className="kicker">Điểm trung bình</span>
            <h2>{headline}</h2>
            <p className="muted">{advice}</p>
            <div className="result-chips">
              {result.earned !== undefined && <span className="chip-static accent"><Icon name="star" size={14} /> +{result.earned} điểm rèn luyện</span>}
              {diff !== null && (
                <span className={`chip-static ${diff >= 0 ? 'green' : 'red'}`}>
                  <Icon name="trend" size={14} /> {diff >= 0 ? '+' : ''}{diff.toFixed(1)} so với lần trước
                </span>
              )}
              <span className="chip-static"><Icon name="alert" size={14} /> {totalIssues ? `${totalIssues} câu cần sửa` : 'Không có câu cần sửa'}</span>
            </div>
          </div>
        </div>
        <div className="result-criteria">
          <RadarChart size={210} data={CRITERIA.map(([k, label]) => ({ label, value: overall[k] }))} />
          <div className="criteria">
            {CRITERIA.map(([k, label, hint]) => (
              <ScoreBar key={k} label={label} hint={hint} value={overall[k]} />
            ))}
          </div>
        </div>
      </div>

      {(newlyUnlocked.length > 0 || result.newBadges?.length > 0) && (
        <div className="celebrate card">
          <Icon name="award" size={22} />
          <div>
            {newlyUnlocked.map((c) => <p key={c.id}>Bạn vừa mở khóa doanh nghiệp <strong>{c.name}</strong> ({c.level}).</p>)}
            {result.newBadges?.map((b) => <p key={b.id}>Huy hiệu mới: <strong>{b.name}</strong> · {b.desc}</p>)}
          </div>
        </div>
      )}

      <div className="card summary">
        <h3 className="block-title"><Icon name="sparkles" size={16} /> Nhận xét chung</h3>
        <p>{result.summary}</p>
        {result.mode === 'demo' && (
          <p className="muted small">Chế độ demo chấm theo quy tắc (từ khóa, độ dài, cấu trúc câu) và dùng câu trả lời mẫu soạn sẵn. Bật AI thật để nhận nhận xét và câu trả lời mẫu viết riêng theo nội dung của bạn.</p>
        )}
      </div>

      <h3 className="section-title">Chi tiết từng câu hỏi</h3>
      <div className="stack">
        {result.answers.map((a, i) => {
          const issues = a.sentenceIssues || []
          const avg = (a.relevance + a.clarity + a.structure) / 3
          return (
            <article key={i} className={`card answer ${open === i ? 'expanded' : ''}`}>
              <button className="answer-head" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span className={`answer-num tone-${tone(avg)}`}>{i + 1}</span>
                <span className="answer-q">{a.question}</span>
                <span className="answer-scores">
                  {issues.length > 0 && <span className="mini low">{issues.length} lỗi</span>}
                  {CRITERIA.map(([k, label]) => (
                    <span key={k} className={`mini ${tone(a[k])}`} title={label}>{label[0]} {a[k]}</span>
                  ))}
                  <Icon name="chevronDown" className="chev" />
                </span>
              </button>
              {open === i && (
                <div className="answer-body">
                  <div>
                    <h4>
                      Câu trả lời của bạn
                      {a.spoken && <span className="tag inline">Trả lời bằng giọng nói</span>}
                      {a.timedOut && <span className="tag inline warn">Hết giờ</span>}
                    </h4>
                    <AnnotatedAnswer answer={a.answer} issues={issues} />
                  </div>

                  <div>
                    <h4>Lỗi cụ thể theo từng câu</h4>
                    {issues.length ? (
                      <ol className="issues">
                        {issues.map((x, k) => (
                          <li key={k}>
                            <span className="err-num big">{k + 1}</span>
                            <div>
                              <p className="issue-quote">“{x.text}”</p>
                              <p><strong>Vấn đề:</strong> {x.issue}</p>
                              {x.fix && <p className="issue-fix"><strong>Nên sửa:</strong> {x.fix}</p>}
                            </div>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="muted">Không phát hiện lỗi ở câu nào.</p>
                    )}
                  </div>

                  <div className="two-col">
                    <div className="pros">
                      <h4><Icon name="check" size={15} /> Điểm mạnh</h4>
                      <ul>{a.strengths.map((s, j) => <li key={j}>{s}</li>)}</ul>
                    </div>
                    <div className="cons">
                      <h4><Icon name="target" size={15} /> Cần cải thiện</h4>
                      <ul>{a.improvements.length ? a.improvements.map((s, j) => <li key={j}>{s}</li>) : <li>Không có điểm lớn cần sửa.</li>}</ul>
                    </div>
                  </div>

                  {a.model && (
                    <div className="model">
                      <div className="model-head">
                        <h4><Icon name="sparkles" size={15} /> Câu trả lời mẫu tối ưu</h4>
                        {TTS_SUPPORTED && (
                          <button className="listen" onClick={() => play(i, a.model)}>
                            <SpeakerIcon /> {playing === i ? 'Dừng' : 'Nghe mẫu'}
                          </button>
                        )}
                      </div>
                      <p>{a.model}</p>
                    </div>
                  )}
                  {a.better && (
                    <p className="outline"><strong>Dàn ý:</strong> {a.better}</p>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>

      {result.reverse && <ReverseBox reverse={result.reverse} lang={setup.language} />}

      {onSurvey && <Survey survey={survey} onSubmit={onSurvey} />}

      <div className="actions">
        <button className="btn btn-accent" onClick={onRetry}><Icon name="refresh" size={16} /> Luyện lại chủ đề này</button>
        {!readOnly && setup.topicId < 3 && <button className="btn btn-primary" onClick={onNextTopic}>Sang chủ đề {setup.topicId + 1} <Icon name="arrowRight" size={16} /></button>}
        {onRoadmap && <button className="btn btn-ghost" onClick={onRoadmap}>Về lộ trình</button>}
        {onHistory && <button className="btn btn-ghost" onClick={onHistory}>Xem lịch sử</button>}
      </div>
    </section>
  )
}
