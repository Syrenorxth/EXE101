import { COMPANIES, TOPICS } from '../data/content.js'
import { isCompanyUnlocked, doneKey } from '../lib/progress.js'
import Icon from '../components/Icons.jsx'

export default function CompanyScreen({ progress, onPick, onBack }) {
  return (
    <section className="screen">
      <div className="screen-intro">
        <button className="link-back" onClick={onBack}><Icon name="arrowLeft" size={16} /> Ngành nghề</button>
        <h2>Chọn doanh nghiệp mô phỏng</h2>
        <p className="muted">Ngành Công nghệ thông tin · Mô phỏng theo ba kiểu doanh nghiệp IT phổ biến ở Việt Nam. Doanh nghiệp khó hơn mở khi đủ điểm rèn luyện.</p>
      </div>

      <div className="grid grid-3">
        {COMPANIES.map((c) => {
          const open = isCompanyUnlocked(progress, c)
          const doneCount = TOPICS.filter((t) => progress.done[doneKey(c.id, t.id)] !== undefined).length
          const lockPct = Math.min(100, (progress.points / c.unlockPoints) * 100)
          return (
            <article key={c.id} className={`card company ${open ? '' : 'locked'}`}>
              <div className={`company-banner co-${c.id}`}>
                <span className="company-logo">{c.name[0]}</span>
                <span className={`level-pill level-${c.unlockPoints}`}>{c.level}</span>
              </div>
              <div className="company-body">
                <h3>{c.name}</h3>
                <p className="company-kind">{c.kind}</p>
                <p className="company-desc">{c.desc}</p>
                <div className="rounds">
                  {c.rounds.split('→').map((r, i) => (
                    <span key={r} className="round">{i > 0 && <Icon name="arrowRight" size={12} />}{r.trim()}</span>
                  ))}
                </div>
                <dl className="meta">
                  <div><dt>Vị trí</dt><dd>{c.positions.join(', ')}{c.laterPositions ? ` · ${c.laterPositions.join(', ')} (sau MVP)` : ''}</dd></div>
                  <div><dt>Hoàn thành</dt><dd>{doneCount}/{TOPICS.length} chủ đề</dd></div>
                </dl>
                <div className="progress-line"><span style={{ width: `${(doneCount / TOPICS.length) * 100}%` }} /></div>
                {open ? (
                  <button className="btn btn-primary block" onClick={() => onPick(c)}>Luyện với {c.name} <Icon name="arrowRight" size={16} /></button>
                ) : (
                  <div className="lock-note">
                    <span><Icon name="lock" size={16} /> Cần {c.unlockPoints} điểm rèn luyện</span>
                    <div className="progress-line warm"><span style={{ width: `${lockPct}%` }} /></div>
                    <small>Bạn đang có {progress.points}/{c.unlockPoints} điểm</small>
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
