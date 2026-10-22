import { useState } from 'react'
import { COMPANIES, TOPICS, PERSONAS } from '../data/content.js'

const fmt = (iso) => new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })

export default function ProgressScreen({ progress, onTogglePresenter, onReset, onBack }) {
  const [confirmReset, setConfirmReset] = useState(false)
  const sessions = progress.history.length
  const avg = sessions ? progress.history.reduce((s, h) => s + h.avg, 0) / sessions : 0

  return (
    <section className="screen">
      <div className="screen-head">
        <button className="link-back" onClick={onBack}>← Quay lại</button>
        <h1>Tiến độ luyện tập</h1>
      </div>

      <div className="grid grid-3">
        <div className="card stat"><span className="muted">Điểm rèn luyện</span><strong>{progress.points}</strong></div>
        <div className="card stat"><span className="muted">Buổi phỏng vấn</span><strong>{sessions}</strong></div>
        <div className="card stat"><span className="muted">Điểm trung bình</span><strong>{sessions ? avg.toFixed(1) : '–'}</strong></div>
      </div>

      <h2 className="section-title">Lịch sử</h2>
      {sessions === 0 ? (
        <div className="card empty">Chưa có buổi phỏng vấn nào. Chọn một doanh nghiệp trong Lộ trình để bắt đầu.</div>
      ) : (
        <div className="table-wrap card">
          <table>
            <thead>
              <tr><th>Thời gian</th><th>Doanh nghiệp</th><th>Vị trí</th><th>Chủ đề</th><th>Người phỏng vấn</th><th>Điểm</th><th>+Điểm RL</th></tr>
            </thead>
            <tbody>
              {progress.history.map((h, i) => (
                <tr key={i}>
                  <td>{fmt(h.at)}</td>
                  <td>{COMPANIES.find((c) => c.id === h.companyId)?.name}</td>
                  <td>{h.position}</td>
                  <td>{TOPICS.find((t) => t.id === h.topicId)?.name}</td>
                  <td>{PERSONAS[h.personaId]?.name}</td>
                  <td className="num">{h.avg.toFixed(1)}</td>
                  <td className="num">+{h.earned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="section-title">Dành cho buổi thuyết trình</h2>
      <div className="card settings">
        <label className="switch">
          <input id="presenter" type="checkbox" checked={progress.presenter} onChange={onTogglePresenter} />
          <span>Chế độ trình bày: mở khóa toàn bộ doanh nghiệp và chủ đề</span>
        </label>
        {!confirmReset ? (
          <button className="btn btn-ghost small" onClick={() => setConfirmReset(true)}>Xóa toàn bộ tiến độ</button>
        ) : (
          <div className="actions left">
            <span>Xóa hết điểm và lịch sử?</span>
            <button className="btn btn-danger small" onClick={() => { onReset(); setConfirmReset(false) }}>Xóa</button>
            <button className="btn btn-ghost small" onClick={() => setConfirmReset(false)}>Hủy</button>
          </div>
        )}
      </div>
    </section>
  )
}
