import { useEffect, useState } from 'react'
import ScoreBar, { tone } from '../components/ScoreBar.jsx'
import { SpeakerIcon } from '../components/Icons.jsx'
import { COMPANIES, REVERSE_TIP } from '../data/content.js'
import { splitSentences } from '../lib/mockEngine.js'
import { speak, stopSpeaking, TTS_SUPPORTED } from '../lib/speech.js'

const CRITERIA = [
  ['relevance', 'Relevance', 'Đúng trọng tâm câu hỏi'],
  ['clarity', 'Clarity', 'Diễn đạt rõ ràng, độ dài hợp lý'],
  ['structure', 'Structure', 'Có cấu trúc (STAR / định nghĩa → ví dụ → so sánh / xử lý sự cố)']
]

// Hiển thị câu trả lời, tô màu và đánh số những câu có lỗi.
function AnnotatedAnswer({ answer, issues }) {
  const sentences = splitSentences(answer || '')
  if (!sentences.length) return <p className="quote">(Không có câu trả lời)</p>
  const markOf = (i, s) => {
    const k = issues.findIndex((x) => x.index === i || (x.index < 0 && (s.includes(x.text.trim()) || x.text.includes(s))))
    return k
  }
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
    <div className="card summary reverse-box">
      <h2 className="block-title">
        Câu hỏi bạn hỏi lại nhà tuyển dụng <span className="tag inline">Không tính điểm</span>
      </h2>
      <p className="quote">{text || '(Không có câu hỏi)'}</p>
      <p className="muted">
        {asked
          ? 'Tốt: chủ động hỏi lại cho thấy bạn thật sự quan tâm đến vị trí. Câu hỏi nên xoay quanh công việc, nhóm hoặc lộ trình phát triển, tránh hỏi ngay về lương thưởng ở vòng đầu.'
          : (REVERSE_TIP[lang] || REVERSE_TIP.vi)}
      </p>
    </div>
  )
}

export default function FeedbackScreen({ result, setup, onRetry, onNextTopic, onRoadmap }) {
  const [open, setOpen] = useState(0)
  const [playing, setPlaying] = useState(null)
  const { overall } = result
  const newlyUnlocked = COMPANIES.filter(
    (c) => c.unlockPoints > result.pointsBefore && c.unlockPoints <= result.pointsAfter
  )
  const totalIssues = result.answers.reduce((n, a) => n + (a.sentenceIssues?.length || 0), 0)

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
    <section className="screen">
      <div className="screen-head">
        <p className="eyebrow">Phản hồi sau buổi phỏng vấn</p>
        <h1>Kết quả của bạn</h1>
      </div>

      <div className="feedback-top">
        <div className="card overall">
          <span className="muted">Điểm trung bình</span>
          <span className={`big-score ${tone(overall.avg)}`}>{overall.avg.toFixed(1)}<small>/10</small></span>
          <span className="earned">+{result.earned} điểm rèn luyện</span>
          <span className="muted">{totalIssues ? `Phát hiện ${totalIssues} câu cần sửa` : 'Không phát hiện câu nào cần sửa'}</span>
        </div>
        <div className="card criteria">
          {CRITERIA.map(([k, label, hint]) => (
            <ScoreBar key={k} label={label} hint={hint} value={overall[k]} />
          ))}
        </div>
      </div>

      <div className="card summary">
        <h2 className="block-title">Nhận xét chung</h2>
        <p>{result.summary}</p>
        {result.mode === 'demo' && (
          <p className="muted">Chế độ demo chấm theo quy tắc (từ khóa, độ dài, cấu trúc câu) và dùng câu trả lời mẫu soạn sẵn. Bật AI thật để nhận nhận xét và câu trả lời mẫu viết riêng theo nội dung của bạn.</p>
        )}
        {newlyUnlocked.map((c) => (
          <p key={c.id} className="unlock-note">Bạn vừa mở khóa doanh nghiệp {c.name} ({c.level}).</p>
        ))}
      </div>

      <h2 className="section-title">Chi tiết từng câu hỏi</h2>
      <div className="stack">
        {result.answers.map((a, i) => {
          const issues = a.sentenceIssues || []
          return (
            <article key={i} className={`card answer ${open === i ? 'expanded' : ''}`}>
              <button className="answer-head" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span className="answer-q">Câu {i + 1}. {a.question}</span>
                <span className="answer-scores">
                  {issues.length > 0 && <span className="mini low">{issues.length} lỗi</span>}
                  {CRITERIA.map(([k, label]) => (
                    <span key={k} className={`mini ${tone(a[k])}`} title={label}>{label[0]} {a[k]}</span>
                  ))}
                </span>
              </button>
              {open === i && (
                <div className="answer-body">
                  <div>
                    <h3>
                      Câu trả lời của bạn
                      {a.spoken && <span className="tag inline">Trả lời bằng giọng nói</span>}
                      {a.timedOut && <span className="tag inline warn">Hết giờ</span>}
                    </h3>
                    <AnnotatedAnswer answer={a.answer} issues={issues} />
                  </div>

                  <div>
                    <h3>Lỗi cụ thể theo từng câu</h3>
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
                    <div>
                      <h3>Điểm mạnh</h3>
                      <ul>{a.strengths.map((s, j) => <li key={j}>{s}</li>)}</ul>
                    </div>
                    <div>
                      <h3>Cần cải thiện</h3>
                      <ul>{a.improvements.length ? a.improvements.map((s, j) => <li key={j}>{s}</li>) : <li>Không có điểm lớn cần sửa.</li>}</ul>
                    </div>
                  </div>

                  {a.model && (
                    <div className="model">
                      <div className="model-head">
                        <h3>Câu trả lời mẫu tối ưu</h3>
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

      <div className="actions">
        <button className="btn btn-primary" onClick={onRetry}>Luyện lại chủ đề này</button>
        {setup.topicId < 3 && <button className="btn btn-ghost" onClick={onNextTopic}>Sang chủ đề {setup.topicId + 1}</button>}
        <button className="btn btn-ghost" onClick={onRoadmap}>Về lộ trình</button>
      </div>
    </section>
  )
}
