import { useState } from 'react'
import ScoreBar, { tone } from '../components/ScoreBar.jsx'
import { COMPANIES } from '../data/content.js'

const CRITERIA = [
  ['relevance', 'Relevance', 'Đúng trọng tâm câu hỏi'],
  ['clarity', 'Clarity', 'Diễn đạt rõ ràng, độ dài hợp lý'],
  ['structure', 'Structure', 'Có cấu trúc (STAR / định nghĩa → ví dụ → so sánh)']
]

export default function FeedbackScreen({ result, setup, onRetry, onNextTopic, onRoadmap }) {
  const [open, setOpen] = useState(0)
  const { overall } = result
  const newlyUnlocked = COMPANIES.filter(
    (c) => c.unlockPoints > result.pointsBefore && c.unlockPoints <= result.pointsAfter
  )

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
          {setup.timeChallenge && <span className="muted">Đã gồm 5 điểm thưởng thử thách thời gian</span>}
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
          <p className="muted">Chế độ demo chấm theo quy tắc (từ khóa, độ dài, cấu trúc câu). Bật AI thật để nhận nhận xét chi tiết theo nội dung.</p>
        )}
        {newlyUnlocked.map((c) => (
          <p key={c.id} className="unlock-note">Bạn vừa mở khóa doanh nghiệp {c.name} ({c.level}).</p>
        ))}
      </div>

      <h2 className="section-title">Chi tiết từng câu hỏi</h2>
      <div className="stack">
        {result.answers.map((a, i) => (
          <article key={i} className={`card answer ${open === i ? 'expanded' : ''}`}>
            <button className="answer-head" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              <span className="answer-q">Câu {i + 1}. {a.question}</span>
              <span className="answer-scores">
                {CRITERIA.map(([k, label]) => (
                  <span key={k} className={`mini ${tone(a[k])}`} title={label}>{label[0]} {a[k]}</span>
                ))}
              </span>
            </button>
            {open === i && (
              <div className="answer-body">
                <div>
                  <h3>Câu trả lời của bạn</h3>
                  <p className="quote">{a.answer || '(Không có câu trả lời)'}</p>
                  {a.timedOut && <p className="muted">Câu này bị hết giờ.</p>}
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
                <div className="better">
                  <h3>Gợi ý trả lời tốt hơn</h3>
                  <p>{a.better}</p>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="actions">
        <button className="btn btn-primary" onClick={onRetry}>Luyện lại chủ đề này</button>
        {setup.topicId < 3 && <button className="btn btn-ghost" onClick={onNextTopic}>Sang chủ đề {setup.topicId + 1}</button>}
        <button className="btn btn-ghost" onClick={onRoadmap}>Về lộ trình</button>
      </div>
    </section>
  )
}
