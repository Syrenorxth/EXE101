import { COMPANIES, TOPICS, PERSONAS, POSITIONS } from '../data/content.js'
import { isTopicUnlocked, doneKey } from '../lib/progress.js'
import { AI_ENABLED } from '../lib/aiEngine.js'

export default function SetupScreen({ setup, progress, onChange, onLearn, onSkip, onBack }) {
  const company = COMPANIES.find((c) => c.id === setup.companyId)
  const persona = PERSONAS[setup.personaId]

  return (
    <section className="screen">
      <div className="screen-head">
        <button className="link-back" onClick={onBack}>← Doanh nghiệp</button>
        <h1>Thiết lập buổi phỏng vấn tại {company.name}</h1>
        <p className="lead">{company.kind} · Mức độ {company.level}</p>
      </div>

      <div className="setup">
        <div className="setup-block">
          <h2 className="block-title">Vị trí ứng tuyển</h2>
          <div className="chips">
            {company.positions.map((p) => (
              <button key={p} className={`chip ${setup.position === p ? 'on' : ''}`} onClick={() => onChange({ position: p })}>
                {p}
              </button>
            ))}
          </div>
          <p className="muted">{POSITIONS[setup.position]}</p>
        </div>

        <div className="setup-block">
          <h2 className="block-title">Chủ đề</h2>
          <div className="stack">
            {TOPICS.map((t) => {
              const open = isTopicUnlocked(progress, company.id, t.id)
              const best = progress.done[doneKey(company.id, t.id)]
              return (
                <button
                  key={t.id}
                  disabled={!open}
                  className={`option ${setup.topicId === t.id ? 'on' : ''} ${open ? '' : 'disabled'}`}
                  onClick={() => onChange({ topicId: t.id, personaId: t.defaultPersona })}
                >
                  <span className="option-num">Chủ đề {t.id}</span>
                  <span className="option-title">{t.name}</span>
                  <span className="option-desc">{open ? t.goal : `Hoàn thành chủ đề ${t.id - 1} để mở`}</span>
                  {best !== undefined && <span className="tag tag-ok">Tốt nhất {best.toFixed(1)}/10</span>}
                </button>
              )
            })}
          </div>
        </div>

        <div className="setup-block">
          <h2 className="block-title">Người phỏng vấn</h2>
          <div className="grid grid-3 tight">
            {Object.values(PERSONAS).map((p) => (
              <button key={p.id} className={`option ${setup.personaId === p.id ? 'on' : ''}`} onClick={() => onChange({ personaId: p.id })}>
                <span className="option-title">{p.name}</span>
                <span className="option-num">{p.role}</span>
                <span className="option-desc">{p.trait}. Rèn: {p.trains.toLowerCase()}.</span>
              </button>
            ))}
          </div>
        </div>

        <div className="setup-block two-col">
          <div>
            <h2 className="block-title">Ngôn ngữ phỏng vấn</h2>
            <div className="chips">
              <button className={`chip ${setup.language === 'vi' ? 'on' : ''}`} onClick={() => onChange({ language: 'vi' })}>Tiếng Việt</button>
              <button className={`chip ${setup.language === 'en' ? 'on' : ''}`} onClick={() => onChange({ language: 'en' })}>English</button>
            </div>
          </div>
          <div>
            <h2 className="block-title">Giới hạn thời gian</h2>
            <label className="switch">
              <input id="time-challenge" type="checkbox" checked={setup.timeChallenge} onChange={(e) => onChange({ timeChallenge: e.target.checked })} />
              <span>{setup.timeChallenge ? `Bật · ${persona.timeLimit} giây mỗi câu (+5 điểm thưởng)` : 'Tắt'}</span>
            </label>
          </div>
          <div>
            <h2 className="block-title">Chế độ chấm</h2>
            <div className="chips">
              <button disabled={!AI_ENABLED} className={`chip ${setup.mode === 'ai' ? 'on' : ''}`} onClick={() => onChange({ mode: 'ai' })}>AI thật</button>
              <button className={`chip ${setup.mode === 'demo' ? 'on' : ''}`} onClick={() => onChange({ mode: 'demo' })}>Chế độ demo</button>
            </div>
            {!AI_ENABLED && <p className="muted">Chưa cấu hình API key nên đang dùng chế độ demo. Xem README để bật AI.</p>}
          </div>
        </div>

        <div className="actions">
          <button className="btn btn-primary" onClick={onLearn}>Học trước khi phỏng vấn</button>
          <button className="btn btn-ghost" onClick={onSkip}>Vào phỏng vấn ngay</button>
        </div>
      </div>
    </section>
  )
}
