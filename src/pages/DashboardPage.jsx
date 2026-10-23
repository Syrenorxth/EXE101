import { AppShell } from '../components/Layout.jsx'
import { LineChart, RadarChart, Meter } from '../components/Charts.jsx'
import { tone } from '../components/ScoreBar.jsx'
import { EmptyState } from '../components/Feedback.jsx'
import Icon from '../components/Icons.jsx'
import Mascot from '../components/Mascot.jsx'
import { Link } from '../router.jsx'
import { useApp } from '../context/AppContext.jsx'
import { COMPANIES, TOPICS, PERSONAS } from '../data/content.js'
import { BADGES } from '../lib/achievements.js'
import { statsOf, levelOf, isCompanyUnlocked, isTopicUnlocked, doneKey } from '../lib/progress.js'
import { greeting, givenName, daysUntil, fromNow, fmtShort, score1 } from '../lib/format.js'

const CRIT_TIPS = {
  relevance: 'Trả lời thẳng vào câu hỏi ngay câu đầu tiên, rồi mới giải thích.',
  clarity: 'Nói câu ngắn, bỏ từ đệm, giữ mỗi câu trả lời trong khoảng 1–2 phút.',
  structure: 'Sắp xếp theo STAR với câu hành vi, định nghĩa → ví dụ → so sánh với câu kỹ thuật.'
}

// Gợi ý buổi luyện tiếp theo: chủ đề đầu tiên chưa làm, nếu đã làm hết thì chủ đề điểm thấp nhất.
// Ưu tiên doanh nghiệp tuyển đúng vị trí trong hồ sơ (Intern/Fresher).
function suggest(progress, position) {
  const unlocked = COMPANIES.filter((c) => isCompanyUnlocked(progress, c))
  const fit = unlocked.filter((c) => c.positions.includes(position))
  const open = [...fit, ...unlocked.filter((c) => !fit.includes(c))]
  for (const c of open) {
    for (const t of TOPICS) {
      if (isTopicUnlocked(progress, c.id, t.id) && progress.done[doneKey(c.id, t.id)] === undefined) return { company: c, topic: t, reason: 'Chủ đề tiếp theo trong lộ trình' }
    }
  }
  let low = null
  for (const c of open) for (const t of TOPICS) {
    const v = progress.done[doneKey(c.id, t.id)]
    if (v !== undefined && (!low || v < low.v)) low = { company: c, topic: t, v }
  }
  return low ? { ...low, reason: `Điểm tốt nhất mới ${low.v.toFixed(1)}/10, luyện lại để cải thiện` } : null
}

export default function DashboardPage() {
  const { user, progress } = useApp()
  const stats = statsOf(progress)
  const level = levelOf(progress.points)
  const next = suggest(progress, user.position)
  const countdown = daysUntil(user.interviewDate)
  const chartPoints = [...progress.history].reverse().slice(-10).map((h) => ({ label: fmtShort(h.at), value: h.avg }))
  const weakest = stats.sessions ? Object.entries(stats.criteria).sort((a, b) => a[1] - b[1])[0] : null
  const recentBadges = BADGES.filter((b) => progress.badges?.[b.id]).sort((a, b) => progress.badges[b.id].localeCompare(progress.badges[a.id])).slice(0, 4)

  return (
    <AppShell title={`${greeting()}, ${givenName(user.name)}`} subtitle={user.target || 'Sẵn sàng cho buổi luyện hôm nay chưa?'}>
      {countdown !== null && countdown >= 0 && (
        <div className="banner">
          <Icon name="calendar" />
          <span>
            {countdown === 0 ? 'Hôm nay là ngày phỏng vấn của bạn. Chúc bạn thật bình tĩnh!' : <>Còn <strong>{countdown} ngày</strong> đến buổi phỏng vấn của bạn. Mỗi ngày một buổi luyện là đủ.</>}
          </span>
        </div>
      )}

      <div className="stats">
        <div className="stat card">
          <span className="stat-icon accent"><Icon name="star" /></span>
          <div><span className="stat-label">Điểm rèn luyện</span><strong>{progress.points}</strong><small>{level.name}</small></div>
        </div>
        <div className="stat card">
          <span className="stat-icon brand"><Icon name="chat" /></span>
          <div><span className="stat-label">Buổi phỏng vấn</span><strong>{stats.sessions}</strong><small>{progress.started ? `${progress.started} lần bắt đầu` : 'Chưa bắt đầu buổi nào'}</small></div>
        </div>
        <div className="stat card">
          <span className="stat-icon green"><Icon name="target" /></span>
          <div><span className="stat-label">Điểm trung bình</span><strong>{stats.sessions ? stats.avg.toFixed(1) : '–'}</strong><small>Cao nhất {stats.sessions ? stats.best.toFixed(1) : '–'}</small></div>
        </div>
        <div className="stat card">
          <span className="stat-icon orange"><Icon name="flame" /></span>
          <div><span className="stat-label">Chuỗi ngày luyện</span><strong>{stats.streak}</strong><small>{stats.streak ? 'Giữ vững nhé!' : 'Luyện hôm nay để bắt đầu chuỗi'}</small></div>
        </div>
      </div>

      <div className="dash-grid">
        <section className="card next-card">
          <Mascot size={120} className="next-mascot" say={stats.sessions ? 'Luyện tiếp nào!' : 'Bắt đầu thôi!'} />
          <span className="kicker">Buổi luyện được gợi ý</span>
          {next ? (
            <>
              <h2>{next.company.name} · Chủ đề {next.topic.id}: {next.topic.name}</h2>
              <p className="muted">{next.reason}. {next.topic.goal}</p>
              <div className="next-meta">
                <span><Icon name="user" size={15} /> {PERSONAS[next.topic.defaultPersona].name}, {PERSONAS[next.topic.defaultPersona].role.toLowerCase()}</span>
                <span><Icon name="clock" size={15} /> 10–15 phút</span>
                <span><Icon name="globe" size={15} /> {user.prefs?.language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
              </div>
              <Link to={`/practice?company=${next.company.id}&topic=${next.topic.id}`} className="btn btn-accent">
                <Icon name="play" size={16} /> Bắt đầu buổi luyện
              </Link>
            </>
          ) : (
            <p>Bạn đã mở hết nội dung. Chọn bất kỳ doanh nghiệp nào để luyện tiếp.</p>
          )}
        </section>

        <section className="card level-card">
          <span className="kicker">Cấp độ</span>
          <h2>{level.name}</h2>
          <div className="level-bar"><span style={{ width: `${level.pct}%` }} /></div>
          <p className="muted">
            {level.next ? `Còn ${level.next.min - progress.points} điểm để lên "${level.next.name}".` : 'Bạn đã đạt cấp độ cao nhất.'}
          </p>
          <div className="mini-badges">
            {recentBadges.length ? recentBadges.map((b) => (
              <span key={b.id} className="badge-dot" title={b.name}><Icon name={b.icon} size={16} /></span>
            )) : <span className="muted small">Chưa có huy hiệu nào.</span>}
            <Link to="/achievements" className="link-more">Xem huy hiệu <Icon name="arrowRight" size={14} /></Link>
          </div>
        </section>
      </div>

      {stats.sessions === 0 ? (
        <div className="card">
          <EmptyState
            mascot
            title="Chưa có buổi phỏng vấn nào"
            action={<Link to="/practice" className="btn btn-primary">Bắt đầu buổi đầu tiên</Link>}
          >
            Buổi đầu tiên với PixelStart chỉ có 3 câu hỏi, người phỏng vấn là chị Lan bên nhân sự rất thân thiện.
          </EmptyState>
        </div>
      ) : (
        <div className="dash-grid wide">
          <section className="card">
            <div className="card-head">
              <h2>Điểm qua các buổi gần đây</h2>
              <Link to="/history" className="link-more">Xem tất cả <Icon name="arrowRight" size={14} /></Link>
            </div>
            <LineChart points={chartPoints} />
          </section>
          <section className="card">
            <div className="card-head"><h2>Ba tiêu chí</h2></div>
            <RadarChart size={230} data={[
              { label: 'Relevance', value: stats.criteria.relevance },
              { label: 'Clarity', value: stats.criteria.clarity },
              { label: 'Structure', value: stats.criteria.structure }
            ]} />
            {weakest && (
              <p className="tip"><Icon name="info" size={16} /><span>Cần ưu tiên <strong>{weakest[0][0].toUpperCase() + weakest[0].slice(1)}</strong>: {CRIT_TIPS[weakest[0]]}</span></p>
            )}
          </section>
        </div>
      )}

      <div className="dash-grid wide">
        <section className="card">
          <div className="card-head">
            <h2>Lộ trình doanh nghiệp</h2>
            <Link to="/practice" className="link-more">Mở lộ trình <Icon name="arrowRight" size={14} /></Link>
          </div>
          <div className="roadmap">
            {COMPANIES.map((c) => {
              const open = isCompanyUnlocked(progress, c)
              return (
                <div key={c.id} className={`road-row ${open ? '' : 'locked'}`}>
                  <div className="road-company">
                    <span className={`co-logo co-${c.id}`}>{c.name[0]}</span>
                    <div>
                      <strong>{c.name}</strong>
                      <small>{open ? c.kind : `Mở khi đạt ${c.unlockPoints} điểm`}</small>
                    </div>
                  </div>
                  <div className="road-topics">
                    {TOPICS.map((t) => {
                      const best = progress.done[doneKey(c.id, t.id)]
                      const ok = open && isTopicUnlocked(progress, c.id, t.id)
                      const cls = best !== undefined ? `done tone-${tone(best)}` : ok ? 'open' : 'locked'
                      const body = (
                        <>
                          <span>{best !== undefined ? best.toFixed(1) : ok ? <Icon name="play" size={12} /> : <Icon name="lock" size={12} />}</span>
                          <small>Chủ đề {t.id}</small>
                        </>
                      )
                      return ok ? (
                        <Link key={t.id} to={`/practice?company=${c.id}&topic=${t.id}`} className={`road-topic ${cls}`} title={t.name}>{body}</Link>
                      ) : (
                        <span key={t.id} className={`road-topic ${cls}`} title={t.name}>{body}</span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Buổi gần đây</h2>
            <Link to="/history" className="link-more">Lịch sử <Icon name="arrowRight" size={14} /></Link>
          </div>
          {progress.history.length ? (
            <ul className="recent">
              {progress.history.slice(0, 4).map((h) => (
                <li key={h.id || h.at}>
                  <Link to={`/history/${h.id}`} className="recent-item">
                    <span className={`score-pill tone-${tone(h.avg)}`}>{score1(h.avg)}</span>
                    <span className="recent-text">
                      <strong>{COMPANIES.find((c) => c.id === h.companyId)?.name} · Chủ đề {h.topicId}</strong>
                      <small>{fromNow(h.at)} · {PERSONAS[h.personaId]?.name}{h.sample ? ' · Buổi mẫu' : ''}</small>
                    </span>
                    <Meter value={h.avg} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Các buổi bạn đã luyện sẽ hiện ở đây.</p>
          )}
        </section>
      </div>
    </AppShell>
  )
}
