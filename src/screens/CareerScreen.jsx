import { CAREERS } from '../data/content.js'
import Icon from '../components/Icons.jsx'

const ICON = { it: 'code', marketing: 'trend', finance: 'coins', sales: 'briefcase' }

export default function CareerScreen({ onPick }) {
  return (
    <section className="screen">
      <div className="screen-intro">
        <h2>Bạn muốn luyện phỏng vấn ngành nào?</h2>
        <p className="muted">Bản MVP tập trung vào ngành Công nghệ thông tin. Các ngành khác sẽ mở ở giai đoạn sau.</p>
      </div>
      <div className="grid grid-4">
        {CAREERS.map((c) => (
          <button
            key={c.id}
            className={`card career ${c.active ? '' : 'disabled'}`}
            onClick={() => c.active && onPick(c.id)}
            disabled={!c.active}
          >
            <span className="career-icon"><Icon name={ICON[c.id] || 'briefcase'} size={26} /></span>
            <span className="career-title">{c.name}</span>
            <span className="career-desc">{c.desc}</span>
            <span className={`tag ${c.active ? 'tag-ok' : ''}`}>{c.active ? 'Đang mở' : 'Sắp ra mắt'}</span>
            {c.active && <span className="career-go">Chọn <Icon name="arrowRight" size={16} /></span>}
          </button>
        ))}
      </div>
    </section>
  )
}
