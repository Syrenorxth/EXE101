import { CAREERS } from '../data/content.js'
import Icon from '../components/Icons.jsx'

const ICON = { it: 'code', marketing: 'trend', finance: 'coins', sales: 'briefcase' }

export default function CareerScreen({ current, onPick }) {
  return (
    <section className="screen">
      <div className="screen-intro">
        <h2>Bạn muốn luyện phỏng vấn ngành nào?</h2>
        <p className="muted">Mỗi ngành có 3 doanh nghiệp mô phỏng, người phỏng vấn chuyên môn và bộ câu hỏi riêng.</p>
      </div>
      <div className="grid grid-4">
        {CAREERS.map((c) => (
          <button
            key={c.id}
            className={`card career ${c.active ? '' : 'disabled'} ${current === c.id ? 'selected' : ''}`}
            onClick={() => c.active && onPick(c.id)}
            disabled={!c.active}
          >
            <span className="career-icon"><Icon name={ICON[c.id] || 'briefcase'} size={26} /></span>
            <span className="career-title">{c.name}</span>
            <span className="career-desc">{c.desc}</span>
            <span className={`tag ${c.active ? 'tag-ok' : ''}`}>{c.active ? (current === c.id ? 'Ngành của bạn' : 'Đang mở') : 'Sắp ra mắt'}</span>
            {c.active && <span className="career-go">Chọn <Icon name="arrowRight" size={16} /></span>}
          </button>
        ))}
      </div>
    </section>
  )
}
