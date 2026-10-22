const STEPS = ['Ngành nghề', 'Doanh nghiệp', 'Thiết lập', 'Học trước', 'Phỏng vấn', 'Phản hồi']

export default function Stepper({ current }) {
  return (
    <ol className="stepper" aria-label="Các bước luyện tập">
      {STEPS.map((s, i) => (
        <li key={s} className={i < current ? 'done' : i === current ? 'current' : ''}>
          <span className="step-dot">{i + 1}</span>
          <span className="step-label">{s}</span>
        </li>
      ))}
    </ol>
  )
}
