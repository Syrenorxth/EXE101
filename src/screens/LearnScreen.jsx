import { LESSONS } from '../data/content.js'

export default function LearnScreen({ topicId, alreadyDone, onDone, onBack }) {
  const lesson = LESSONS[topicId]
  return (
    <section className="screen narrow">
      <div className="screen-head">
        <button className="link-back" onClick={onBack}>← Thiết lập</button>
        <p className="eyebrow">Học trước · Chủ đề {topicId}</p>
        <h1>{lesson.title}</h1>
      </div>

      {lesson.blocks.map((b) => (
        <div key={b.heading} className="card lesson">
          <h2 className="block-title">{b.heading}</h2>
          <dl className="lesson-list">
            {b.items.map(([term, desc]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}

      <div className="actions">
        <button className="btn btn-primary" onClick={onDone}>
          Đã nắm, bắt đầu phỏng vấn{alreadyDone ? '' : ' (+5 điểm)'}
        </button>
      </div>
    </section>
  )
}
