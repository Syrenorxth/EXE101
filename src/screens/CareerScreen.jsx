import { CAREERS } from '../data/content.js'

export default function CareerScreen({ onPick }) {
  return (
    <section className="screen">
      <div className="intro">
        <p className="eyebrow">Luyện phỏng vấn Intern &amp; Fresher</p>
        <h1>Tập phỏng vấn với AI trước khi gặp nhà tuyển dụng thật</h1>
        <p className="lead">
          Chọn ngành, chọn doanh nghiệp, học nhanh cách trả lời rồi vào phỏng vấn mô phỏng.
          Sau mỗi buổi, bạn nhận điểm theo ba tiêu chí và gợi ý để trả lời tốt hơn.
        </p>
      </div>

      <h2 className="section-title">Bạn muốn luyện phỏng vấn ngành nào?</h2>
      <div className="grid grid-4">
        {CAREERS.map((c) => (
          <button
            key={c.id}
            className={`card choice ${c.active ? '' : 'disabled'}`}
            onClick={() => c.active && onPick(c.id)}
            disabled={!c.active}
          >
            <span className="choice-title">{c.name}</span>
            <span className="choice-desc">{c.desc}</span>
            <span className={`tag ${c.active ? 'tag-ok' : ''}`}>{c.active ? 'Có trong MVP' : 'Sau MVP'}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
