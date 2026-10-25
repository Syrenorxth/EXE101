// Bảng điều khiển cho nhà trường (khách hàng B2B).
// Tab Tổng quan / Sinh viên / Lớp dùng DỮ LIỆU MẪU; tab Chỉ số thử nghiệm dùng dữ liệu thật trên trình duyệt này.
import { useMemo, useState } from 'react'
import { AppShell } from '../components/Layout.jsx'
import { BarChart, Meter } from '../components/Charts.jsx'
import ScoreBar, { tone } from '../components/ScoreBar.jsx'
import { Modal } from '../components/Feedback.jsx'
import Icon from '../components/Icons.jsx'
import { Link } from '../router.jsx'
import { useApp } from '../context/AppContext.jsx'
import { TOPICS } from '../data/content.js'
import { sampleCohort, weakestOf, loadClasses, addClass, pilotMetrics } from '../services/schoolData.js'
import { score1, downloadFile, toCsv } from '../lib/format.js'

const CRIT = { relevance: 'Relevance', clarity: 'Clarity', structure: 'Structure' }
const ADVICE = {
  relevance: 'nên tổ chức buổi chia sẻ về cách đọc mô tả công việc và trả lời đúng trọng tâm.',
  clarity: 'nên cho sinh viên luyện trả lời bằng giọng nói với giới hạn thời gian.',
  structure: 'nên tổ chức workshop về phương pháp STAR và khung trả lời câu hỏi chuyên môn.'
}
const TITLES = {
  overview: ['Tổng quan nhà trường', 'Tình hình luyện phỏng vấn của sinh viên'],
  students: ['Sinh viên', 'Theo dõi từng sinh viên theo lớp'],
  classes: ['Lớp & mã mời', 'Sinh viên nhập mã lớp khi tạo tài khoản để vào đúng lớp'],
  pilot: ['Chỉ số thử nghiệm MVP', 'Đo các giả thuyết H1–H3 từ dữ liệu thật']
}

const SampleTag = () => <span className="tag inline warn">Dữ liệu mẫu</span>

function Overview({ cohort }) {
  const { students, weeks } = cohort
  const active = students.filter((s) => s.activated)
  const practiced = students.filter((s) => s.sessions > 0)
  const sessions = students.reduce((n, s) => n + s.sessions, 0)
  const avgOf = (k) => practiced.reduce((n, s) => n + s.criteria[k], 0) / practiced.length
  const avg = practiced.reduce((n, s) => n + s.avg, 0) / practiced.length
  const funnel = TOPICS.map((t) => ({ t, n: students.filter((s) => s.topics >= t.id).length }))
  const support = practiced.filter((s) => s.avg < 5.2).sort((a, b) => a.avg - b.avg).slice(0, 6)
  const idle = active.filter((s) => s.sessions === 0).length
  const weakest = weakestOf({ relevance: avgOf('relevance'), clarity: avgOf('clarity'), structure: avgOf('structure') })

  return (
    <>
      <div className="stats">
        <div className="stat card"><span className="stat-icon brand"><Icon name="users" /></span><div><span className="stat-label">Đã kích hoạt</span><strong>{active.length}<small className="of">/{students.length}</small></strong><small>{Math.round((active.length / students.length) * 100)}% sinh viên</small></div></div>
        <div className="stat card"><span className="stat-icon green"><Icon name="chat" /></span><div><span className="stat-label">Buổi phỏng vấn</span><strong>{sessions}</strong><small>{(sessions / practiced.length).toFixed(1)} buổi / sinh viên</small></div></div>
        <div className="stat card"><span className="stat-icon accent"><Icon name="target" /></span><div><span className="stat-label">Điểm trung bình</span><strong>{avg.toFixed(1)}</strong><small>Thang 10</small></div></div>
        <div className="stat card"><span className="stat-icon orange"><Icon name="alert" /></span><div><span className="stat-label">Cần hỗ trợ</span><strong>{practiced.filter((s) => s.avg < 5.2).length}</strong><small>{idle} đã kích hoạt nhưng chưa luyện</small></div></div>
      </div>

      <div className="dash-grid wide">
        <section className="card">
          <div className="card-head"><h2>Số buổi luyện theo tuần <SampleTag /></h2></div>
          <BarChart data={weeks} unit=" buổi" />
        </section>
        <section className="card">
          <div className="card-head"><h2>Điểm theo tiêu chí</h2></div>
          <div className="criteria">
            {Object.entries(CRIT).map(([k, label]) => <ScoreBar key={k} label={label} value={avgOf(k)} />)}
          </div>
          <p className="tip"><Icon name="info" size={16} /><span>{CRIT[weakest]} thấp nhất: {ADVICE[weakest]}</span></p>
        </section>
      </div>

      <div className="dash-grid wide">
        <section className="card">
          <div className="card-head"><h2>Tiến độ theo chủ đề</h2></div>
          <ul className="funnel">
            {funnel.map(({ t, n }) => (
              <li key={t.id}>
                <span>Chủ đề {t.id}: {t.name}</span>
                <span className="funnel-bar"><span style={{ width: `${(n / students.length) * 100}%` }} /></span>
                <strong>{n}</strong>
              </li>
            ))}
          </ul>
        </section>
        <section className="card">
          <div className="card-head">
            <h2>Sinh viên cần hỗ trợ</h2>
            <Link to="/school/students" className="link-more">Tất cả <Icon name="arrowRight" size={14} /></Link>
          </div>
          <ul className="recent">
            {support.map((s) => (
              <li key={s.id} className="recent-item">
                <span className={`score-pill tone-${tone(s.avg)}`}>{s.avg.toFixed(1)}</span>
                <span className="recent-text">
                  <strong>{s.name}</strong>
                  <small>{s.classCode} · yếu nhất: {CRIT[weakestOf(s.criteria)]}</small>
                </span>
                <span className="muted small">{s.sessions} buổi</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}

function Students({ cohort }) {
  const [q, setQ] = useState('')
  const [cls, setCls] = useState('all')
  const [sort, setSort] = useState('avg-asc')
  const classes = loadClasses()
  const rows = useMemo(() => {
    const list = cohort.students.filter((s) =>
      (cls === 'all' || s.classCode === cls) && (!q.trim() || s.name.toLowerCase().includes(q.trim().toLowerCase()))
    )
    const [key, dir] = sort.split('-')
    // Sinh viên chưa có điểm luôn nằm cuối danh sách.
    const val = (s) => (key === 'avg' ? s.avg ?? (dir === 'asc' ? 99 : -1) : key === 'sessions' ? s.sessions : s.lastActive ?? 999)
    return [...list].sort((a, b) => (dir === 'asc' ? val(a) - val(b) : val(b) - val(a)))
  }, [cohort, q, cls, sort])

  const exportCsv = () => {
    downloadFile('palspeak-sinh-vien.csv', toCsv([
      ['Họ tên', 'Lớp', 'Kích hoạt', 'Số buổi', 'Chủ đề đã xong', 'Relevance', 'Clarity', 'Structure', 'Điểm TB', 'Hoạt động gần nhất (ngày)'],
      ...rows.map((s) => [s.name, s.classCode, s.activated ? 'Có' : 'Chưa', s.sessions, s.topics, score1(s.criteria?.relevance), score1(s.criteria?.clarity), score1(s.criteria?.structure), score1(s.avg), s.lastActive ?? ''])
    ]), 'text/csv;charset=utf-8')
  }

  return (
    <section className="card">
      <div className="card-head wrap">
        <h2>{rows.length} sinh viên <SampleTag /></h2>
        <div className="filters">
          <label className="search">
            <Icon name="search" size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên…" aria-label="Tìm sinh viên" />
          </label>
          <select value={cls} onChange={(e) => setCls(e.target.value)} aria-label="Lọc theo lớp">
            <option value="all">Mọi lớp</option>
            {classes.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sắp xếp">
            <option value="avg-asc">Điểm thấp → cao</option>
            <option value="avg-desc">Điểm cao → thấp</option>
            <option value="sessions-desc">Nhiều buổi nhất</option>
            <option value="last-asc">Hoạt động gần đây</option>
          </select>
          <button className="btn btn-ghost small" onClick={exportCsv}><Icon name="download" size={16} /> CSV</button>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Sinh viên</th><th>Lớp</th><th className="num">Số buổi</th><th>Chủ đề</th><th>Tiêu chí yếu nhất</th><th className="num">Điểm TB</th><th>Hoạt động</th></tr>
          </thead>
          <tbody>
            {rows.slice(0, 80).map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.classCode}</td>
                <td className="num">{s.sessions}</td>
                <td>{s.topics}/{TOPICS.length}</td>
                <td>{s.criteria ? CRIT[weakestOf(s.criteria)] : '–'}</td>
                <td className="num">{s.avg ? <><span className={`score-pill tone-${tone(s.avg)}`}>{s.avg.toFixed(1)}</span><Meter value={s.avg} className="hide-sm" /></> : '–'}</td>
                <td>{!s.activated ? <span className="tag inline">Chưa kích hoạt</span> : s.lastActive === 0 ? 'Hôm nay' : `${s.lastActive} ngày trước`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 80 && <p className="muted small">Hiển thị 80/{rows.length} sinh viên. Dùng bộ lọc hoặc xuất CSV để xem đầy đủ.</p>}
    </section>
  )
}

function Classes({ cohort }) {
  const { toast } = useApp()
  const [classes, setClasses] = useState(loadClasses)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [size, setSize] = useState(40)

  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      toast(`Đã sao chép mã ${code}`, 'success')
    } catch {
      toast(`Mã lớp: ${code}`)
    }
  }

  return (
    <>
      <div className="card-head">
        <p className="muted">Gửi mã cho lớp qua email hoặc nhóm Zalo. Sinh viên nhập mã ở bước tạo hồ sơ.</p>
        <button className="btn btn-primary small" onClick={() => setOpen(true)}><Icon name="plus" size={16} /> Tạo lớp mới</button>
      </div>
      <div className="grid grid-2">
        {classes.map((c) => {
          const list = cohort.students.filter((s) => s.classCode === c.code)
          const done = list.filter((s) => s.sessions > 0)
          const avg = done.length ? done.reduce((n, s) => n + s.avg, 0) / done.length : null
          return (
            <article key={c.code} className="card class-card">
              <div className="class-top">
                <div>
                  <h3>{c.name}</h3>
                  <p className="muted small">{c.size} sinh viên · {list.filter((s) => s.activated).length} đã kích hoạt</p>
                </div>
                <button className="code-chip" onClick={() => copy(c.code)} title="Sao chép mã lớp"><Icon name="copy" size={14} /> {c.code}</button>
              </div>
              <div className="class-stats">
                <span><strong>{done.length}</strong><small>đã luyện</small></span>
                <span><strong>{list.reduce((n, s) => n + s.sessions, 0)}</strong><small>buổi</small></span>
                <span><strong>{score1(avg)}</strong><small>điểm TB</small></span>
              </div>
              <div className="progress-line"><span style={{ width: `${list.length ? (done.length / c.size) * 100 : 0}%` }} /></div>
            </article>
          )
        })}
      </div>

      <Modal
        open={open}
        title="Tạo lớp mới"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setOpen(false)}>Hủy</button>
            <button className="btn btn-primary" disabled={!name.trim()} onClick={() => { setClasses(addClass(name.trim(), Number(size) || 0)); setOpen(false); setName(''); toast('Đã tạo lớp và mã mời mới.', 'success') }}>Tạo lớp</button>
          </>
        }
      >
        <div className="form">
          <label className="field"><span>Tên lớp</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Kỹ thuật phần mềm K20" autoFocus /></label>
          <label className="field"><span>Sĩ số</span><input type="number" min="1" value={size} onChange={(e) => setSize(e.target.value)} /></label>
        </div>
      </Modal>
    </>
  )
}

function Pilot() {
  const m = pilotMetrics()
  const pct = (v) => (v === null ? '–' : `${Math.round(v)}%`)
  const rows = [
    ['H1', 'Tỷ lệ hoàn thành buổi phỏng vấn', pct(m.completion), '≥ 70%', m.completion === null ? null : m.completion >= 70],
    ['H1', 'Tỷ lệ quay lại luyện buổi thứ hai', pct(m.returning), '≥ 40%', m.returning === null ? null : m.returning >= 40],
    ['H2', 'Điểm lần 2 so với lần 1 (cùng chủ đề)', m.gain === null ? '–' : `${m.gain >= 0 ? '+' : ''}${m.gain.toFixed(1)}`, 'Tăng', m.gain === null ? null : m.gain > 0],
    ['H2', 'Người học thấy phản hồi hữu ích (4–5/5)', pct(m.helpful), '≥ 60%', m.helpful === null ? null : m.helpful >= 60],
    ['H3', 'Đánh giá giống phỏng vấn thật (4–5/5)', pct(m.realism), '≥ 50%', m.realism === null ? null : m.realism >= 50]
  ]
  return (
    <>
      <div className="banner">
        <Icon name="info" />
        <span>
          Số liệu tính từ <strong>{m.students} tài khoản sinh viên</strong> trên trình duyệt này ({m.finished} buổi đã hoàn thành, {m.surveys} phiếu đánh giá), không tính buổi mẫu.
          Khi có máy chủ, bảng này sẽ tổng hợp từ toàn bộ người dùng thử nghiệm.
        </span>
      </div>
      <section className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Giả thuyết</th><th>Chỉ số</th><th className="num">Hiện tại</th><th className="num">Mục tiêu</th><th>Trạng thái</th></tr></thead>
            <tbody>
              {rows.map(([h, label, now, goal, ok]) => (
                <tr key={label}>
                  <td><span className="kind-tag">{h}</span></td>
                  <td>{label}</td>
                  <td className="num"><strong>{now}</strong></td>
                  <td className="num">{goal}</td>
                  <td>{ok === null ? <span className="muted small">Chưa đủ dữ liệu</span> : ok ? <span className="status ok"><Icon name="check" size={14} /> Đạt</span> : <span className="status no"><Icon name="alert" size={14} /> Chưa đạt</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small">Mục tiêu theo mục 8 tài liệu MVP, sẽ điều chỉnh sau khi có dữ liệu thử nghiệm thật. Chỉ số H4 (nhà trường đồng ý thử nghiệm) được ghi nhận thủ công.</p>
      </section>
    </>
  )
}

export default function SchoolPage({ tab }) {
  const { user } = useApp()
  const current = TITLES[tab] ? tab : 'overview'
  const cohort = sampleCohort()
  const [title, subtitle] = TITLES[current]

  return (
    <AppShell title={title} subtitle={`${user.school || 'Nhà trường'} · ${subtitle}`}>
      {current === 'overview' && <Overview cohort={cohort} />}
      {current === 'students' && <Students cohort={cohort} />}
      {current === 'classes' && <Classes cohort={cohort} />}
      {current === 'pilot' && <Pilot />}
    </AppShell>
  )
}
