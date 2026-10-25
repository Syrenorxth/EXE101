import { COMPANIES, TOPICS, PERSONAS, POSITIONS, personasOf, resolvePersona, defaultPersonaOf, careerById, stageName } from '../data/content.js'
import { isTopicUnlocked, doneKey } from '../lib/progress.js'
import { AI_ENABLED } from '../lib/aiEngine.js'
import { STT_SUPPORTED, TTS_SUPPORTED } from '../lib/speech.js'
import { Avatar } from '../components/Brand.jsx'
import Icon from '../components/Icons.jsx'

export default function SetupScreen({ setup, progress, onChange, onLearn, onSkip, onBack }) {
  const company = COMPANIES.find((c) => c.id === setup.companyId)
  const persona = PERSONAS[setup.personaId]
  const topic = TOPICS.find((t) => t.id === setup.topicId)
  const career = careerById(company.career)
  const locked = topic?.lockedPersona && resolvePersona(topic.lockedPersona, career.id)
  const questions = topic.stages.length + (topic.situationChange ? 1 : 0)

  return (
    <section className="screen setup-layout">
      <div className="setup">
        <button className="link-back" onClick={onBack}><Icon name="arrowLeft" size={16} /> Doanh nghiệp</button>

        <div className="card setup-block">
          <h3 className="block-title"><span className="block-num">1</span> Vị trí ứng tuyển</h3>
          <div className="chips">
            {company.positions.map((p) => (
              <button key={p} className={`chip ${setup.position === p ? 'on' : ''}`} onClick={() => onChange({ position: p })}>{p}</button>
            ))}
          </div>
          <p className="muted small">{POSITIONS[setup.position]}</p>
        </div>

        <div className="card setup-block">
          <h3 className="block-title"><span className="block-num">2</span> Chủ đề</h3>
          <div className="stack">
            {TOPICS.map((t) => {
              const open = isTopicUnlocked(progress, company.id, t.id)
              const best = progress.done[doneKey(company.id, t.id)]
              return (
                <button
                  key={t.id}
                  disabled={!open}
                  className={`option ${setup.topicId === t.id ? 'on' : ''} ${open ? '' : 'disabled'}`}
                  onClick={() => onChange({ topicId: t.id, personaId: defaultPersonaOf(t, career.id) })}
                >
                  <span className="option-num">{open ? `Chủ đề ${t.id}` : <><Icon name="lock" size={12} /> Chủ đề {t.id}</>}</span>
                  <span className="option-title">{t.name}</span>
                  <span className="option-desc">{open ? t.goal : `Hoàn thành chủ đề ${t.id - 1} để mở`}</span>
                  <span className="option-stages">{t.stages.map((s) => stageName(s, career.id)).join(' → ')}{t.situationChange ? ' → Tình huống thay đổi' : ''}</span>
                  {best !== undefined && <span className="tag tag-ok">Tốt nhất {best.toFixed(1)}/10</span>}
                </button>
              )
            })}
          </div>
        </div>

        <div className="card setup-block">
          <h3 className="block-title"><span className="block-num">3</span> Người phỏng vấn</h3>
          <div className="grid grid-3 tight">
            {personasOf(career.id).map((p) => {
              const off = Boolean(locked) && locked !== p.id
              return (
                <button
                  key={p.id}
                  disabled={off}
                  className={`option persona ${setup.personaId === p.id ? 'on' : ''} ${off ? 'disabled' : ''}`}
                  onClick={() => onChange({ personaId: p.id })}
                >
                  <Avatar name={p.name} size={44} />
                  <span className="option-title">{p.name}</span>
                  <span className="option-num">{p.role}</span>
                  <span className="option-desc">{p.trait}. Rèn: {p.trains.toLowerCase()}.</span>
                  <span className="persona-time"><Icon name="clock" size={12} /> {p.timeLimit} giây/câu</span>
                </button>
              )
            })}
          </div>
          {locked && (
            <p className="muted small">Phỏng vấn chuyên môn luôn do {PERSONAS[locked].name} ({PERSONAS[locked].role.toLowerCase()}) đảm nhận, giống vòng phỏng vấn chuyên môn thật.</p>
          )}
        </div>

        <div className="card setup-block">
          <h3 className="block-title"><span className="block-num">4</span> Tùy chọn</h3>
          <div className="two-col">
            <div>
              <h4>Ngôn ngữ phỏng vấn</h4>
              <div className="chips">
                <button className={`chip ${setup.language === 'en' ? 'on' : ''}`} onClick={() => onChange({ language: 'en' })}>English</button>
                <button className={`chip ${setup.language === 'vi' ? 'on' : ''}`} onClick={() => onChange({ language: 'vi' })}>Tiếng Việt</button>
              </div>
              <p className="muted small">Nhận xét sau buổi luôn bằng tiếng Việt.</p>
            </div>
            <div>
              <h4>Chế độ chấm</h4>
              <div className="chips">
                <button disabled={!AI_ENABLED} className={`chip ${setup.mode === 'ai' ? 'on' : ''}`} onClick={() => onChange({ mode: 'ai' })}><Icon name="sparkles" size={14} /> AI thật</button>
                <button className={`chip ${setup.mode === 'demo' ? 'on' : ''}`} onClick={() => onChange({ mode: 'demo' })}>Chế độ demo</button>
              </div>
              {!AI_ENABLED && <p className="muted small">Chưa cấu hình API key nên đang dùng chế độ demo. Xem README để bật AI.</p>}
            </div>
            <div>
              <h4>Giới hạn thời gian</h4>
              <label className="switch">
                <input id="time-challenge" type="checkbox" checked={setup.timeChallenge} onChange={(e) => onChange({ timeChallenge: e.target.checked })} />
                <span>{setup.timeChallenge ? `${persona.timeLimit} giây mỗi câu (+5 điểm thưởng)` : 'Tắt'}</span>
              </label>
            </div>
            <div>
              <h4>Giọng nói</h4>
              <label className="switch">
                <input id="voice" type="checkbox" checked={setup.voice} disabled={!TTS_SUPPORTED} onChange={(e) => onChange({ voice: e.target.checked })} />
                <span>Đọc câu hỏi thành tiếng</span>
              </label>
              <p className="muted small">
                {STT_SUPPORTED
                  ? 'Trong buổi phỏng vấn, bấm nút micro để trả lời bằng giọng nói.'
                  : 'Trình duyệt này chưa hỗ trợ nói thành chữ. Hãy dùng Chrome hoặc Edge để trả lời bằng micro.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <aside className="card summary-card">
        <span className="kicker">Tóm tắt buổi phỏng vấn</span>
        <div className="summary-company">
          <span className={`co-logo co-${company.id}`}>{company.name[0]}</span>
          <div>
            <strong>{company.name}</strong>
            <small>{career.short} · {company.kind} · {setup.position}</small>
          </div>
        </div>
        <div className="summary-persona">
          <Avatar name={persona.name} size={40} />
          <div>
            <strong>{persona.name}</strong>
            <small>{persona.role}</small>
          </div>
        </div>
        <ul className="summary-list">
          <li><Icon name="book" size={15} /> Chủ đề {topic.id}: {topic.name}</li>
          <li><Icon name="chat" size={15} /> {questions} câu hỏi chính + câu hỏi đào sâu</li>
          <li><Icon name="globe" size={15} /> {setup.language === 'en' ? 'English' : 'Tiếng Việt'}</li>
          <li><Icon name="clock" size={15} /> {setup.timeChallenge ? `${persona.timeLimit} giây mỗi câu` : 'Không giới hạn thời gian'}</li>
          <li><Icon name={setup.mode === 'ai' ? 'sparkles' : 'zap'} size={15} /> {setup.mode === 'ai' ? 'Chấm bằng AI thật' : 'Chấm theo quy tắc (demo)'}</li>
        </ul>
        <button className="btn btn-accent block" onClick={onLearn}>
          <Icon name="book" size={16} /> Học trước{progress.lessons[topic.id] ? '' : ' (+5 điểm)'}
        </button>
        <button className="btn btn-primary block" onClick={onSkip}>
          <Icon name="mic" size={16} /> Vào phỏng vấn ngay
        </button>
        <p className="fine">Mẹo: đeo tai nghe và ngồi ở nơi yên tĩnh để micro nhận giọng chính xác hơn.</p>
      </aside>
    </section>
  )
}
