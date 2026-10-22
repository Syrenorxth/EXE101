import { useCallback, useEffect, useRef, useState } from 'react'
import { COMPANIES, PERSONAS, TOPICS } from '../data/content.js'
import { createMockSession, mockStart, mockReply, mockEvaluate } from '../lib/mockEngine.js'
import { createAiSession, aiStart, aiReply, aiEvaluate } from '../lib/aiEngine.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const countWords = (t) => (t.trim() ? t.trim().split(/\s+/).length : 0)

// Gói hai "bộ máy" phỏng vấn về cùng một giao diện.
function makeEngine(setup) {
  if (setup.mode === 'ai') {
    const s = createAiSession(setup)
    return {
      start: () => aiStart(s),
      reply: (text, timedOut) => aiReply(s, text, timedOut),
      evaluate: () => aiEvaluate(s)
    }
  }
  const s = createMockSession(setup)
  return {
    start: async () => { await wait(500); return mockStart(s) },
    reply: async (text, timedOut) => { await wait(700); return mockReply(s, text, timedOut) },
    evaluate: async () => { await wait(900); return mockEvaluate(s) }
  }
}

const KIND_LABEL = { followup: 'Câu hỏi đào sâu', situation: 'Tình huống thay đổi' }

export default function InterviewScreen({ setup, onFinish, onExit, onSwitchToDemo }) {
  const company = COMPANIES.find((c) => c.id === setup.companyId)
  const persona = PERSONAS[setup.personaId]
  const topic = TOPICS.find((t) => t.id === setup.topicId)

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState('starting') // starting | answering | waiting | evaluating | error
  const [error, setError] = useState('')
  const [askId, setAskId] = useState(0)
  const [timeLeft, setTimeLeft] = useState(null)

  const engineRef = useRef(null)
  const startedRef = useRef(false)
  const inputRef = useRef('')
  const listRef = useRef(null)
  const phaseRef = useRef(phase)
  phaseRef.current = phase
  inputRef.current = input

  const pushInterviewer = useCallback((msgs) => {
    setMessages((m) => [...m, ...msgs])
    if (msgs.some((x) => x.ask)) setAskId((n) => n + 1)
  }, [])

  const fail = (e) => {
    setError(e.message || String(e))
    setPhase('error')
  }

  // Mở đầu buổi phỏng vấn
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    engineRef.current = makeEngine(setup)
    engineRef.current.start()
      .then((msgs) => { pushInterviewer(msgs); setPhase('answering') })
      .catch(fail)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Tự cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, phase])

  const submit = useCallback(async (timedOut = false) => {
    if (phaseRef.current !== 'answering') return
    const text = inputRef.current.trim()
    if (!text && !timedOut) return
    phaseRef.current = 'waiting' // chặn gửi trùng trước khi React kịp render lại
    setTimeLeft(null)
    setMessages((m) => [...m, { role: 'candidate', text: text || '(Hết giờ, chưa kịp trả lời)', timedOut }])
    setInput('')
    setPhase('waiting')
    try {
      const { done, messages: next } = await engineRef.current.reply(text, timedOut)
      pushInterviewer(next)
      if (done) {
        setPhase('evaluating')
        const result = await engineRef.current.evaluate()
        onFinish(result)
      } else {
        setPhase('answering')
      }
    } catch (e) {
      fail(e)
    }
  }, [onFinish, pushInterviewer])

  // Đồng hồ cho thử thách giới hạn thời gian
  useEffect(() => {
    if (!setup.timeChallenge || askId === 0) return
    setTimeLeft(persona.timeLimit)
    const id = setInterval(() => {
      setTimeLeft((t) => (t === null || t <= 0 ? t : t - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [askId, setup.timeChallenge, persona.timeLimit])

  // Hết giờ thì tự gửi phần đang viết
  useEffect(() => {
    if (timeLeft === 0) submit(true)
  }, [timeLeft, submit])

  const onKey = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      submit(false)
    }
  }

  const answered = messages.filter((m) => m.role === 'candidate').length
  const pct = timeLeft !== null ? (timeLeft / persona.timeLimit) * 100 : 100

  return (
    <section className="screen interview">
      <aside className="side card">
        <p className="eyebrow">Đang phỏng vấn</p>
        <h2 className="side-company">{company.name}</h2>
        <p className="muted">{company.kind} · {setup.position}</p>
        <div className="persona-box">
          <span className="avatar">{persona.name.split(' ').pop()[0]}</span>
          <div>
            <strong>{persona.name}</strong>
            <span className="muted block">{persona.role}</span>
          </div>
        </div>
        <dl className="meta">
          <div><dt>Chủ đề</dt><dd>{topic.id}. {topic.name}</dd></div>
          <div><dt>Ngôn ngữ</dt><dd>{setup.language === 'vi' ? 'Tiếng Việt' : 'English'}</dd></div>
          <div><dt>Thử thách</dt><dd>Câu hỏi đào sâu{setup.timeChallenge ? `, ${persona.timeLimit} giây/câu` : ''}{topic.situationChange ? ', tình huống thay đổi' : ''}</dd></div>
          <div><dt>Đã trả lời</dt><dd>{answered} lượt</dd></div>
          <div><dt>Chế độ</dt><dd>{setup.mode === 'ai' ? 'AI thật' : 'Demo (chấm theo quy tắc)'}</dd></div>
        </dl>
        <button className="btn btn-ghost small" onClick={onExit}>Dừng buổi phỏng vấn</button>
      </aside>

      <div className="chat card">
        <div className="chat-list" ref={listRef}>
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role} ${m.kind || ''}`}>
              {KIND_LABEL[m.kind] && <span className="msg-label">{KIND_LABEL[m.kind]}</span>}
              <p>{m.text}</p>
              {m.timedOut && <span className="msg-label warn">Hết giờ</span>}
            </div>
          ))}
          {(phase === 'starting' || phase === 'waiting') && (
            <div className="msg interviewer typing"><span /><span /><span /></div>
          )}
          {phase === 'evaluating' && (
            <div className="status-line">Đang chấm điểm và chuẩn bị nhận xét…</div>
          )}
          {phase === 'error' && (
            <div className="error-box">
              <strong>Không kết nối được với AI.</strong>
              <p>{error}</p>
              <p>Kiểm tra API key trong file .env và kết nối mạng, hoặc chuyển sang chế độ demo để tiếp tục.</p>
              <div className="actions left">
                <button className="btn btn-primary small" onClick={onSwitchToDemo}>Chuyển sang chế độ demo</button>
                <button className="btn btn-ghost small" onClick={onExit}>Quay lại</button>
              </div>
            </div>
          )}
        </div>

        <div className="composer">
          {setup.timeChallenge && timeLeft !== null && phase === 'answering' && (
            <div className={`timer ${timeLeft <= 10 ? 'urgent' : ''}`}>
              <div className="timer-fill" style={{ width: `${pct}%` }} />
              <span>Còn {timeLeft} giây</span>
            </div>
          )}
          <textarea
            id="answer"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder={phase === 'answering' ? 'Nhập câu trả lời của bạn… (Ctrl + Enter để gửi)' : 'Chờ người phỏng vấn…'}
            disabled={phase !== 'answering'}
            rows={4}
          />
          <div className="composer-bar">
            <span className="muted">{countWords(input)} từ</span>
            <button className="btn btn-primary" onClick={() => submit(false)} disabled={phase !== 'answering' || !input.trim()}>
              Gửi câu trả lời
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
