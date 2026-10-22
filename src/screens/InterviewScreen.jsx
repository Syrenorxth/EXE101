import { useCallback, useEffect, useRef, useState } from 'react'
import { COMPANIES, PERSONAS, TOPICS } from '../data/content.js'
import { createMockSession, mockStart, mockReply, mockEvaluate } from '../lib/mockEngine.js'
import { createAiSession, aiStart, aiReply, aiEvaluate } from '../lib/aiEngine.js'
import { speak, stopSpeaking, useDictation, TTS_SUPPORTED } from '../lib/speech.js'
import { MicIcon, SpeakerIcon } from '../components/Icons.jsx'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const countWords = (t) => (t.trim() ? t.trim().split(/\s+/).length : 0)

// Gói hai "bộ máy" phỏng vấn về cùng một giao diện.
function makeEngine(setup) {
  if (setup.mode === 'ai') {
    const s = createAiSession(setup)
    return {
      start: () => aiStart(s),
      reply: (text, timedOut, spoken) => aiReply(s, text, timedOut, spoken),
      evaluate: () => aiEvaluate(s)
    }
  }
  const s = createMockSession(setup)
  return {
    start: async () => { await wait(500); return mockStart(s) },
    reply: async (text, timedOut, spoken) => { await wait(700); return mockReply(s, text, timedOut, spoken) },
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
  const [speakingIdx, setSpeakingIdx] = useState(null)

  const engineRef = useRef(null)
  const startedRef = useRef(false)
  const inputRef = useRef('')
  const listRef = useRef(null)
  const phaseRef = useRef(phase)
  const speakingRef = useRef(false)
  const spokenRef = useRef(false) // câu trả lời hiện tại có dùng micro không
  phaseRef.current = phase
  inputRef.current = input

  // ---------- Speech-to-Text ----------
  const dictation = useDictation(setup.language, (text) => {
    spokenRef.current = true
    setInput((prev) => (prev.trim() ? `${prev.trimEnd()} ${text}` : text))
  })

  // ---------- Text-to-Speech ----------
  const readAloud = useCallback((text, idx) => {
    speakingRef.current = true
    setSpeakingIdx(idx)
    speak(text, setup.language, {
      onEnd: () => {
        speakingRef.current = false
        setSpeakingIdx(null)
      }
    })
  }, [setup.language])

  const countRef = useRef(0)
  useEffect(() => { countRef.current = messages.length }, [messages])

  const pushInterviewer = useCallback((msgs) => {
    const lastIdx = countRef.current + msgs.length - 1
    countRef.current += msgs.length
    setMessages((m) => [...m, ...msgs])
    if (setup.voice && TTS_SUPPORTED) readAloud(msgs.map((x) => x.text).join(' '), lastIdx)
    if (msgs.some((x) => x.ask)) setAskId((n) => n + 1)
  }, [setup.voice, readAloud])

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
    return () => stopSpeaking()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Tự cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, phase, dictation.interim])

  const submit = useCallback(async (timedOut = false) => {
    if (phaseRef.current !== 'answering') return
    const pending = dictation.interim.trim()
    const text = [inputRef.current.trim(), pending].filter(Boolean).join(' ')
    if (!text && !timedOut) return
    phaseRef.current = 'waiting' // chặn gửi trùng trước khi React kịp render lại
    if (dictation.listening) dictation.stop(true)
    stopSpeaking()
    speakingRef.current = false
    setSpeakingIdx(null)
    const spoken = spokenRef.current
    spokenRef.current = false
    setTimeLeft(null)
    countRef.current += 1
    setMessages((m) => [...m, { role: 'candidate', text: text || '(Hết giờ, chưa kịp trả lời)', timedOut, spoken }])
    setInput('')
    setPhase('waiting')
    try {
      const { done, messages: next } = await engineRef.current.reply(text, timedOut, spoken)
      pushInterviewer(next)
      if (done) {
        setPhase('evaluating')
        const result = await engineRef.current.evaluate()
        stopSpeaking()
        onFinish(result)
      } else {
        setPhase('answering')
      }
    } catch (e) {
      fail(e)
    }
  }, [onFinish, pushInterviewer, dictation])

  // Đồng hồ cho thử thách giới hạn thời gian (tạm dừng khi đang đọc câu hỏi)
  useEffect(() => {
    if (!setup.timeChallenge || askId === 0) return
    setTimeLeft(persona.timeLimit)
    const id = setInterval(() => {
      setTimeLeft((t) => (t === null || t <= 0 || speakingRef.current ? t : t - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [askId, setup.timeChallenge, persona.timeLimit])

  // Hết giờ thì tự gửi phần đang viết hoặc đang nói
  useEffect(() => {
    if (timeLeft === 0) submit(true)
  }, [timeLeft, submit])

  const onKey = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      submit(false)
    }
  }

  const toggleMic = () => {
    if (dictation.listening) dictation.stop()
    else {
      stopSpeaking()
      speakingRef.current = false
      setSpeakingIdx(null)
      dictation.start()
    }
  }

  const answered = messages.filter((m) => m.role === 'candidate').length
  const pct = timeLeft !== null ? (timeLeft / persona.timeLimit) * 100 : 100
  const canAnswer = phase === 'answering'

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
          <div><dt>Giọng nói</dt><dd>{setup.voice ? 'Đọc câu hỏi' : 'Tắt đọc câu hỏi'}{dictation.supported ? ' · Trả lời bằng micro' : ''}</dd></div>
          <div><dt>Đã trả lời</dt><dd>{answered} lượt</dd></div>
          <div><dt>Chế độ</dt><dd>{setup.mode === 'ai' ? 'AI thật' : 'Demo (chấm theo quy tắc)'}</dd></div>
        </dl>
        <button className="btn btn-ghost small" onClick={() => { stopSpeaking(); dictation.stop(true); onExit() }}>Dừng buổi phỏng vấn</button>
      </aside>

      <div className="chat card">
        <div className="chat-list" ref={listRef}>
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role} ${m.kind || ''} ${speakingIdx === i ? 'speaking' : ''}`}>
              {KIND_LABEL[m.kind] && <span className="msg-label">{KIND_LABEL[m.kind]}</span>}
              <p>{m.text}</p>
              {m.role === 'interviewer' && TTS_SUPPORTED && (
                <button className="listen" onClick={() => readAloud(m.text, i)} aria-label="Nghe lại câu này">
                  <SpeakerIcon /> {speakingIdx === i ? 'Đang đọc…' : 'Nghe'}
                </button>
              )}
              {(m.spoken || m.timedOut) && (
                <span className="msg-tags">
                  {m.spoken && <span className="msg-label light">Trả lời bằng giọng nói</span>}
                  {m.timedOut && <span className="msg-label warn">Hết giờ</span>}
                </span>
              )}
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
          {setup.timeChallenge && timeLeft !== null && canAnswer && (
            <div className={`timer ${timeLeft <= 10 ? 'urgent' : ''}`}>
              <div className="timer-fill" style={{ width: `${pct}%` }} />
              <span>{speakingIdx !== null ? 'Đồng hồ tạm dừng khi đang đọc câu hỏi' : `Còn ${timeLeft} giây`}</span>
            </div>
          )}
          <textarea
            id="answer"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder={canAnswer ? 'Nhập câu trả lời, hoặc bấm micro để nói… (Ctrl + Enter để gửi)' : 'Chờ người phỏng vấn…'}
            disabled={!canAnswer}
            rows={4}
          />
          {dictation.listening && (
            <div className="live-transcript">
              <span className="rec-dot" /> Đang nghe… {dictation.interim && <em>{dictation.interim}</em>}
            </div>
          )}
          {dictation.error && <div className="mic-error">{dictation.error}</div>}
          <div className="composer-bar">
            <div className="composer-left">
              <button
                className={`btn mic ${dictation.listening ? 'on' : ''}`}
                onClick={toggleMic}
                disabled={!canAnswer || !dictation.supported}
                title={dictation.supported ? 'Trả lời bằng giọng nói' : 'Trình duyệt chưa hỗ trợ nhận diện giọng nói, hãy dùng Chrome hoặc Edge'}
              >
                <MicIcon /> {dictation.listening ? 'Dừng nói' : 'Nói câu trả lời'}
              </button>
              <span className="muted">{countWords(input)} từ</span>
            </div>
            <button className="btn btn-primary" onClick={() => submit(false)} disabled={!canAnswer || !(input.trim() || dictation.interim.trim())}>
              Gửi câu trả lời
            </button>
          </div>
          {!dictation.supported && (
            <p className="muted">Trình duyệt này chưa hỗ trợ nói thành chữ. Hãy mở bằng Chrome hoặc Edge để dùng micro.</p>
          )}
        </div>
      </div>
    </section>
  )
}
