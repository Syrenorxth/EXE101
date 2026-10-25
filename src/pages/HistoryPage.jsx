import { useMemo, useState } from 'react'
import { AppShell } from '../components/Layout.jsx'
import { LineChart, Meter } from '../components/Charts.jsx'
import { tone } from '../components/ScoreBar.jsx'
import { EmptyState } from '../components/Feedback.jsx'
import Icon from '../components/Icons.jsx'
import { Link } from '../router.jsx'
import { useApp } from '../context/AppContext.jsx'
import { COMPANIES, TOPICS, PERSONAS, CAREERS, companiesOf } from '../data/content.js'
import { statsOf, doneKey } from '../lib/progress.js'
import { fmtDateTime, fmtShort, score1, downloadFile, toCsv } from '../lib/format.js'

const companyName = (id) => COMPANIES.find((c) => c.id === id)?.name || id
const topicName = (id) => TOPICS.find((t) => t.id === id)?.name || ''

export default function HistoryPage() {
  const { progress } = useApp()
  const [company, setCompany] = useState('all')
  const [topic, setTopic] = useState('all')
  const stats = statsOf(progress)

  const rows = useMemo(() => progress.history.filter((h) =>
    (company === 'all' || h.companyId === company) && (topic === 'all' || String(h.topicId) === topic)
  ), [progress.history, company, topic])

  // So sánh lần đầu và lần gần nhất của từng chủ đề (chỉ số H2 của MVP).
  const compare = useMemo(() => {
    const groups = {}
    for (const h of [...progress.history].reverse()) (groups[doneKey(h.companyId, h.topicId)] ||= []).push(h)
    return Object.values(groups).filter((g) => g.length >= 2).map((g) => ({
      companyId: g[0].companyId,
      topicId: g[0].topicId,
      first: g[0].avg,
      last: g[g.length - 1].avg,
      count: g.length
    }))
  }, [progress.history])

  const exportCsv = () => {
    const data = [
      ['Thời gian', 'Doanh nghiệp', 'Vị trí', 'Chủ đề', 'Người phỏng vấn', 'Ngôn ngữ', 'Chế độ', 'Relevance', 'Clarity', 'Structure', 'Điểm TB', 'Điểm RL'],
      ...rows.map((h) => [
        fmtDateTime(h.at), companyName(h.companyId), h.position, `${h.topicId}. ${topicName(h.topicId)}`, PERSONAS[h.personaId]?.name,
        h.language === 'vi' ? 'Tiếng Việt' : 'English', h.mode === 'ai' ? 'AI' : 'Demo',
        score1(h.result?.overall?.relevance), score1(h.result?.overall?.clarity), score1(h.result?.overall?.structure), score1(h.avg), h.earned
      ])
    ]
    downloadFile('palspeak-lich-su.csv', toCsv(data), 'text/csv;charset=utf-8')
  }

  if (!progress.history.length) {
    return (
      <AppShell title="Lịch sử & tiến bộ" subtitle="Theo dõi điểm qua từng buổi">
        <div className="card">
          <EmptyState icon="chart" title="Chưa có buổi phỏng vấn nào" action={<Link to="/practice" className="btn btn-primary">Bắt đầu luyện</Link>}>
            Sau mỗi buổi, kết quả chi tiết sẽ được lưu ở đây để bạn xem lại và so sánh.
          </EmptyState>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      title="Lịch sử & tiến bộ"
      subtitle="Theo dõi điểm qua từng buổi"
      actions={<button className="btn btn-ghost small hide-xs" onClick={exportCsv}><Icon name="download" size={16} /> Xuất CSV</button>}
    >
      <div className="stats">
        <div className="stat card"><span className="stat-icon brand"><Icon name="chat" /></span><div><span className="stat-label">Số buổi</span><strong>{stats.sessions}</strong></div></div>
        <div className="stat card"><span className="stat-icon green"><Icon name="target" /></span><div><span className="stat-label">Điểm trung bình</span><strong>{stats.avg.toFixed(1)}</strong></div></div>
        <div className="stat card"><span className="stat-icon accent"><Icon name="star" /></span><div><span className="stat-label">Cao nhất</span><strong>{stats.best.toFixed(1)}</strong></div></div>
        <div className="stat card">
          <span className="stat-icon orange"><Icon name="percent" /></span>
          <div>
            <span className="stat-label">Tỷ lệ hoàn thành</span>
            <strong>{progress.started ? `${Math.min(100, Math.round((progress.history.filter((h) => !h.sample).length / progress.started) * 100))}%` : '–'}</strong>
          </div>
        </div>
      </div>

      <div className="dash-grid wide">
        <section className="card">
          <div className="card-head"><h2>Điểm theo thời gian</h2></div>
          <LineChart points={[...rows].reverse().map((h) => ({ label: fmtShort(h.at), value: h.avg }))} emptyText="Không có buổi nào khớp bộ lọc" />
        </section>
        <section className="card">
          <div className="card-head"><h2>Lần đầu và lần gần nhất</h2></div>
          {compare.length ? (
            <ul className="compare">
              {compare.map((c) => {
                const d = c.last - c.first
                return (
                  <li key={`${c.companyId}${c.topicId}`}>
                    <div>
                      <strong>{companyName(c.companyId)} · Chủ đề {c.topicId}</strong>
                      <small>{c.count} lần luyện</small>
                    </div>
                    <span className="compare-nums">
                      {c.first.toFixed(1)} <Icon name="arrowRight" size={14} /> <strong>{c.last.toFixed(1)}</strong>
                      <span className={`delta ${d >= 0 ? 'up' : 'down'}`}>{d >= 0 ? '+' : ''}{d.toFixed(1)}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="muted">Luyện cùng một chủ đề ít nhất hai lần để thấy mức tiến bộ.</p>
          )}
        </section>
      </div>

      <section className="card">
        <div className="card-head wrap">
          <h2>Tất cả các buổi</h2>
          <div className="filters">
            <select value={company} onChange={(e) => setCompany(e.target.value)} aria-label="Lọc theo doanh nghiệp">
              <option value="all">Mọi doanh nghiệp</option>
              {CAREERS.map((k) => (
                <optgroup key={k.id} label={k.name}>
                  {companiesOf(k.id).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
              ))}
            </select>
            <select value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Lọc theo chủ đề">
              <option value="all">Mọi chủ đề</option>
              {TOPICS.map((t) => <option key={t.id} value={t.id}>Chủ đề {t.id}</option>)}
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Thời gian</th><th>Doanh nghiệp</th><th>Chủ đề</th><th>Người phỏng vấn</th><th>Ngôn ngữ</th><th className="num">Điểm</th><th className="num">+Điểm RL</th><th /></tr>
            </thead>
            <tbody>
              {rows.map((h) => (
                <tr key={h.id || h.at}>
                  <td>{fmtDateTime(h.at)}{h.sample && <span className="tag inline">Mẫu</span>}</td>
                  <td>{companyName(h.companyId)}<small className="block muted">{h.position}</small></td>
                  <td>{h.topicId}. {topicName(h.topicId)}</td>
                  <td>{PERSONAS[h.personaId]?.name}</td>
                  <td>{h.language === 'vi' ? 'Tiếng Việt' : h.language === 'en' ? 'English' : '–'}</td>
                  <td className="num"><span className={`score-pill tone-${tone(h.avg)}`}>{score1(h.avg)}</span><Meter value={h.avg} className="hide-sm" /></td>
                  <td className="num">+{h.earned}</td>
                  <td>{h.result ? <Link to={`/history/${h.id}`} className="link-more">Xem lại <Icon name="arrowRight" size={14} /></Link> : <span className="muted small">Không có chi tiết</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  )
}
