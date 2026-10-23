import { LESSONS } from '../data/content.js'
import Icon from '../components/Icons.jsx'

export function LessonBody({ lesson }) {
  return lesson.blocks.map((b, bi) => (
    <div key={b.heading} className="card lesson">
      <h3 className="block-title"><span className="block-num">{bi + 1}</span> {b.heading}</h3>
      <dl className="lesson-list">
        {b.items.map(([term, desc]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{desc}</dd>
          </div>
        ))}
      </dl>
    </div>
  ))
}

export default function LearnScreen({ topicId, alreadyDone, onDone, onBack }) {
  const lesson = LESSONS[topicId]
  return (
    <section className="screen narrow">
      <div className="screen-intro">
        <button className="link-back" onClick={onBack}><Icon name="arrowLeft" size={16} /> Thiết lập</button>
        <span className="kicker">Học trước · Chủ đề {topicId} · khoảng 3 phút</span>
        <h2>{lesson.title}</h2>
      </div>

      <LessonBody lesson={lesson} />

      <div className="actions">
        <button className="btn btn-accent big" onClick={onDone}>
          <Icon name="check" size={16} /> Đã nắm, bắt đầu phỏng vấn{alreadyDone ? '' : ' (+5 điểm)'}
        </button>
      </div>
    </section>
  )
}
