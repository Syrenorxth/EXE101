import { COMPANIES, TOPICS } from '../data/content.js'
import { isCompanyUnlocked, doneKey } from '../lib/progress.js'

export default function CompanyScreen({ progress, onPick, onBack }) {
  return (
    <section className="screen">
      <div className="screen-head">
        <button className="link-back" onClick={onBack}>← Ngành nghề</button>
        <h1>Chọn doanh nghiệp mô phỏng</h1>
        <p className="lead">Ngành Công nghệ thông tin · Mỗi doanh nghiệp có phong cách tuyển dụng riêng, mô phỏng theo thị trường Việt Nam.</p>
      </div>

      <div className="grid grid-3">
        {COMPANIES.map((c) => {
          const open = isCompanyUnlocked(progress, c)
          const doneCount = TOPICS.filter((t) => progress.done[doneKey(c.id, t.id)] !== undefined).length
          return (
            <article key={c.id} className={`card company ${open ? '' : 'locked'}`}>
              <div className="company-top">
                <h3>{c.name}</h3>
                <span className={`level level-${c.unlockPoints}`}>{c.level}</span>
              </div>
              <p className="company-kind">{c.kind}</p>
              <p className="company-desc">{c.desc}</p>
              <dl className="meta">
                <div><dt>Vị trí</dt><dd>{c.positions.join(', ')}{c.laterPositions ? ` · ${c.laterPositions.join(', ')} (sau MVP)` : ''}</dd></div>
                <div><dt>Quy trình</dt><dd>{c.rounds}</dd></div>
                <div><dt>Hoàn thành</dt><dd>{doneCount}/3 chủ đề</dd></div>
              </dl>
              {open ? (
                <button className="btn btn-primary" onClick={() => onPick(c)}>Luyện với {c.name}</button>
              ) : (
                <div className="lock-note">
                  Cần {c.unlockPoints} điểm rèn luyện để mở (bạn đang có {progress.points}).
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
