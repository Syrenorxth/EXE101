import { useCallback, useEffect, useRef, useState } from 'react'
import { COMPANIES, PERSONAS, TOPICS } from '../data/content.js'
import { createMockSession, mockStart, mockReply, mockEvaluate } from '../lib/mockEngine.js'
import { createAiSession, aiStart, aiReply, aiEvaluate } from '../lib/aiEngine.js'
import { speak, stopSpeaking, useDictation, TTS_SUPPORTED } from '../lib/speech.js'
import { Avatar } from '../components/Brand.jsx'
import Icon, { MicIcon, SpeakerIcon } from '../components/Icons.jsx'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const countWords = (t) => (t.trim() ? t.trim().split(/\s+/).length : 0)

// Gói hai "bộ máy" phỏng vấn về cùng một giao diện.
// index(): câu chính đang hỏi (chỉ chế độ demo biết chính xác; AI tự dẫn dắt nên trả về null).
function makeEngine(setup) {
  if (setup.mode === 'ai') {
    const s = createAiSession(setup)
    return {
      plan: s.plan,
      index: () => (s.reverseAsked ? s.plan.length : null),
      start: () => aiStart(s),
      reply: (text, timedOut, spoken) => aiReply(s, text, timedOut, spoken),
      evaluate: () => aiEvaluate(s)
    }
  }
  const s = createMockSession(setup)
  return {
    plan: s.plan,
    index: () => (s.reverseAsked ? s.plan.length : s.index),
    start: async () => { await wait(500); return mockStart(s) },
    reply: async (text, timedOut, spoken) => { await wait(700); return mockReply(s, text, timedOut, spoken) },
    evaluate: async () => { await wait(900); return mockEvaluate(s) }
  }
}

const KIND_LABEL = { followup: 'Câu hỏi đào sâu', situation: 'Tình huống thay đổi', reverse: 'Câu hỏi cuối buổi · không tính điểm' }

const TIPS = {
  behavior: ['Bối cảnh: chuyện xảy ra ở đâu, khi nào', 'Nhiệm vụ: bạn chịu trách nhiệm gì', 'Hành động: chính bạn đã làm gì', 'Kết quả: con số, bài học'],
  tech: ['Định nghĩa ngắn gọn', 'Ví dụ từ dự án của bạn', 'So sánh, đánh đổi: khi nào nên dùng'],
  incident: ['Bình tĩnh, khoanh vùng lỗi', 'Tìm nguyên nhân: log, thay đổi gần nhất', 'Khắc phục hoặc rollback', 'Báo cáo, phòng tránh lặp lại'],
  situation: ['Xác nhận lại yêu cầu mới', 'Sắp xếp ưu tiên', 'Nói rõ rủi ro và đề xuất phương án'],
  reverse: ['Hỏi về công việc, nhóm hoặc lộ trình học tập', 'Tránh hỏi ngay về lương thưởng ở vòng đầu']
}

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
  const [plan, setPlan] = useState([])

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
    setPlan(engineRef.current.plan)
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

  const exit = () => {
    stopSpeaking()
    dictation.stop(true)
    onExit()
  }

  const answered = messages.filter((m) => m.role === 'candidate').length
  const pct = timeLeft !== null ? (timeLeft / persona.timeLimit) * 100 : 100
  const canAnswer = phase === 'answering'
  const idx = engineRef.current?.index() ?? null
  let currentIdx = -1
  messages.forEach((m, i) => { if (m.role === 'interviewer' && m.ask) currentIdx = i })
  const current = messages[currentIdx]
  const kind = current?.kind === 'reverse' ? 'reverse' : current?.kind === 'situation' ? 'situation' : idx !== null && plan[idx] ? plan[idx].kind : null

  const status =
    phase === 'starting' ? 'Đang vào phòng…'
      : phase === 'waiting' ? 'Đang lắng nghe và suy nghĩ…'
        : phase === 'evaluating' ? 'Đang chấm điểm và chuẩn bị nhận xét…'
          : phase === 'error' ? 'Mất kết nối'
            : speakingIdx !== null ? 'Đang nói…'
              : dictation.listening ? 'Đang nghe bạn trả lời…'
                : 'Đang chờ bạn trả lời'

  const R = 26
  const C = 2 * Math.PI * R

  return (
    <section className="room">
      <div className="room-top">
        <div className="room-title">
          <span className="live-dot" />
          <strong>{company.name}</strong>
          <span className="muted">· {setup.position} · Chủ đề {topic.id}: {topic.name}</span>
        </div>
        <div className="room-top-right">
          <span className="chip-static"><Icon name="globe" size={14} /> {setup.language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
          <span className="chip-static"><Icon name={setup.mode === 'ai' ? 'sparkles' : 'zap'} size={14} /> {setup.mode === 'ai' ? 'AI thật' : 'Demo'}</span>
          <button className="btn btn-end small" onClick={exit}><Icon name="phoneOff" size={16} /> Kết thúc</button>
        </div>
      </div>

      <div className="room-grid">
        <div className="room-main">
          <div className={`stage ${speakingIdx !== null ? 'is-speaking' : ''} ${dictation.listening ? 'is-listening' : ''} ${phase === 'waiting' || phase === 'starting' ? 'is-thinking' : ''}`}>
            {setup.timeChallenge && timeLeft !== null && canAnswer && (
              <div className={`stage-timer ${timeLeft <= 10 ? 'urgent' : ''}`} title={speakingIdx !== null ? 'Đồng hồ tạm dừng khi đang đọc câu hỏi' : `Còn ${timeLeft} giây`}>
                <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
                  <circle cx="32" cy="32" r={R} className="t-track" />
                  <circle cx="32" cy="32" r={R} className="t-value" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} transform="rotate(-90 32 32)" />
                </svg>
                <span>{speakingIdx !== null ? <Icon name="speaker" size={16} /> : timeLeft}</span>
              </div>
            )}
            <div className="stage-avatar">
              <span className="pulse p1" />
              <span className="pulse p2" />
              <Avatar name={persona.name} size={104} />
            </div>
            <div className="stage-name">{persona.name}</div>
            <div className="stage-role">{persona.role} · {company.name}</div>
            <div className="stage-status">
              <div className={`wave ${speakingIdx !== null ? 'on' : ''}`}><span /><span /><span /><span /><span /></div>
              {status}
            </div>
            <div className={`self-tile ${dictation.listening ? 'on' : ''}`}>
              <Icon name="user" size={18} />
              <span>Bạn</span>
              <span className="self-mic"><Icon name="mic" size={13} /></span>
            </div>
          </div>

          <div className="card caption">
            {current ? (
              <>
                <div className="caption-head">
                  <span className="caption-label">{KIND_LABEL[current.kind] || 'Câu hỏi'}</span>
                  {TTS_SUPPORTED && (
                    <button className="listen" onClick={() => readAloud(current.text, currentIdx)} aria-label="Nghe lại câu hỏi">
                      <SpeakerIcon /> {speakingIdx === currentIdx ? 'Đang đọc…' : 'Nghe lại'}
                    </button>
                  )}
                </div>
                <p className="caption-text">{current.text}</p>
              </>
            ) : (
              <p className="caption-text muted">Người phỏng vấn đang vào phòng…</p>
            )}
          </div>

          {phase === 'error' ? (
            <div className="card error-box">
              <strong><Icon name="alert" size={16} /> Không kết nối được với AI.</strong>
              <p>{error}</p>
              <p>Kiểm tra API key trong file .env và kết nối mạng, hoặc chuyển sang chế độ demo để tiếp tục.</p>
              <div className="actions left">
                <button className="btn btn-primary small" onClick={onSwitchToDemo}>Chuyển sang chế độ demo</button>
                <button className="btn btn-ghost small" onClick={onExit}>Quay lại</button>
              </div>
            </div>
          ) : (
            <div className="card composer">
              <textarea
                id="answer"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder={canAnswer ? 'Nhập câu trả lời, hoặc bấm micro để nói… (Ctrl + Enter để gửi)' : phase === 'evaluating' ? 'Đang chấm điểm…' : 'Chờ người phỏng vấn…'}
                disabled={!canAnswer}
                rows={4}
              />
              {dictation.listening && (
                <div className="live-transcript">
                  <span className="rec-dot" /> Đang nghe… {dictation.interim && <em>{dictation.interim}</em>}
                </div>
              )}
              {dictation.error && <div className="mic-error"><Icon name="alert" size={14} /> {dictation.error}</div>}
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
                  <span className="muted small">{countWords(input)} từ</span>
                  {setup.timeChallenge && timeLeft !== null && canAnswer && (
                    <span className={`time-pill ${timeLeft <= 10 ? 'urgent' : ''}`}>
                      <Icon name="clock" size={13} /> {speakingIdx !== null ? 'Tạm dừng khi đang đọc' : `Còn ${timeLeft} giây`}
                    </span>
                  )}
                </div>
                <button className="btn btn-accent" onClick={() => submit(false)} disabled={!canAnswer || !(input.trim() || dictation.interim.trim())}>
                  <Icon name="send" size={16} /> Gửi câu trả lời
                </button>
              </div>
              {!dictation.supported && (
                <p className="muted small">Trình duyệt này chưa hỗ trợ nói thành chữ. Hãy mở bằng Chrome hoặc Edge để dùng micro.</p>
              )}
            </div>
          )}
        </div>

        <aside className="room-side">
          <div className="card agenda">
            <h3>Trình tự buổi phỏng vấn</h3>
            <ol>
              {plan.map((q, i) => (
                <li key={i} className={idx === null ? '' : i < idx ? 'done' : i === idx ? 'current' : ''}>
                  <span className="agenda-dot">{idx !== null && i < idx ? <Icon name="check" size={12} /> : i + 1}</span>
                  {q.stage}
                </li>
              ))}
              <li className={idx !== null && idx >= plan.length ? 'current' : ''}>
                <span className="agenda-dot">?</span>
                Bạn hỏi lại nhà tuyển dụng
              </li>
            </ol>
            <p className="muted small">{answered} lượt trả lời{setup.timeChallenge ? ` · ${persona.timeLimit} giây/câu` : ''}</p>
          </div>

          {kind && TIPS[kind] && (
            <div className="card tips">
              <h3><Icon name="info" size={15} /> Gợi ý khung trả lời</h3>
              <ol>{TIPS[kind].map((t) => <li key={t}>{t}</li>)}</ol>
            </div>
          )}

          <div className="card transcript">
            <h3>Bản ghi hội thoại</h3>
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
              {phase === 'evaluating' && <div className="status-line">Đang chấm điểm và chuẩn bị nhận xét…</div>}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
