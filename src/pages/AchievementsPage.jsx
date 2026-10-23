import { AppShell } from '../components/Layout.jsx'
import Icon from '../components/Icons.jsx'
import { useApp } from '../context/AppContext.jsx'
import { BADGES } from '../lib/achievements.js'
import { LEVELS, levelOf } from '../lib/progress.js'
import { COMPANIES } from '../data/content.js'
import { fmtDate } from '../lib/format.js'

const EARN = [
  ['Hoàn thành bài học trước phỏng vấn', '+5 điểm, mỗi chủ đề một lần'],
  ['Hoàn thành một buổi phỏng vấn', 'Điểm trung bình × 3 (tối đa 30 điểm)'],
  ['Bật giới hạn thời gian', '+5 điểm thưởng mỗi buổi']
]

export default function AchievementsPage() {
  const { progress } = useApp()
  const level = levelOf(progress.points)
  const owned = progress.badges || {}
  const count = BADGES.filter((b) => owned[b.id]).length

  return (
    <AppShell title="Huy hiệu & cấp độ" subtitle={`Bạn đã nhận ${count}/${BADGES.length} huy hiệu`}>
      <div className="dash-grid">
        <section className="card level-card big">
          <span className="kicker">Cấp độ hiện tại</span>
          <h2>{level.name}</h2>
          <p className="level-points"><strong>{progress.points}</strong> điểm rèn luyện</p>
          <div className="level-bar"><span style={{ width: `${level.pct}%` }} /></div>
          <ol className="levels">
            {LEVELS.map((l, i) => (
              <li key={l.name} className={i <= level.index ? 'done' : ''}>
                <span>{i <= level.index ? <Icon name="check" size={12} /> : i + 1}</span>
                <strong>{l.name}</strong>
                <small>{l.min} điểm{COMPANIES.find((c) => c.unlockPoints === l.min && l.min > 0) ? ` · mở ${COMPANIES.find((c) => c.unlockPoints === l.min).name}` : ''}</small>
              </li>
            ))}
          </ol>
        </section>
        <section className="card">
          <span className="kicker">Cách nhận điểm rèn luyện</span>
          <ul className="earn">
            {EARN.map(([a, b]) => (
              <li key={a}><Icon name="star" size={16} /><div><strong>{a}</strong><small>{b}</small></div></li>
            ))}
          </ul>
        </section>
      </div>

      <h2 className="section-title">Bộ sưu tập huy hiệu</h2>
      <div className="badge-grid">
        {BADGES.map((b) => {
          const at = owned[b.id]
          return (
            <article key={b.id} className={`card badge ${at ? 'owned' : 'locked'}`}>
              <span className="badge-icon"><Icon name={at ? b.icon : 'lock'} size={26} /></span>
              <h3>{b.name}</h3>
              <p>{b.desc}</p>
              <small>{at ? `Nhận ngày ${fmtDate(at)}` : 'Chưa đạt'}</small>
            </article>
          )
        })}
      </div>
    </AppShell>
  )
}
