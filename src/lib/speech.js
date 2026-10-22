// Giọng nói dùng Web Speech API có sẵn trong trình duyệt (miễn phí, không cần cài thêm).
// - Speech-to-Text (nói thành chữ): Chrome, Edge.
// - Text-to-Speech (đọc chữ thành tiếng): hầu hết trình duyệt.
import { useCallback, useEffect, useRef, useState } from 'react'

const Recognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null
export const STT_SUPPORTED = Boolean(Recognition)
export const TTS_SUPPORTED = typeof window !== 'undefined' && 'speechSynthesis' in window

const LANG = { vi: 'vi-VN', en: 'en-US' }

const STT_ERRORS = {
  'not-allowed': 'Trình duyệt chưa được cấp quyền dùng micro. Bấm biểu tượng ổ khóa cạnh thanh địa chỉ để cho phép.',
  'service-not-allowed': 'Trình duyệt chưa được cấp quyền dùng micro.',
  'audio-capture': 'Không tìm thấy micro. Kiểm tra lại tai nghe hoặc micro.',
  'no-speech': 'Không nghe thấy giọng nói. Hãy nói to và gần micro hơn.',
  network: 'Nhận diện giọng nói cần kết nối mạng.'
}

function pickVoice(lang) {
  const voices = window.speechSynthesis.getVoices()
  const code = LANG[lang]
  return (
    voices.find((v) => v.lang === code) ||
    voices.find((v) => v.lang?.toLowerCase().startsWith(code.slice(0, 2))) ||
    null
  )
}

export function hasVoiceFor(lang) {
  if (!TTS_SUPPORTED) return false
  return Boolean(pickVoice(lang))
}

// Đọc một đoạn văn bản. onEnd luôn được gọi, kể cả khi lỗi.
// Đoạn dài được chia theo câu rồi xếp hàng đọc lần lượt, vì Chrome hay tự ngắt
// một lần đọc kéo dài quá khoảng 15 giây.
let speechToken = 0

export function speak(text, lang, { onStart, onEnd } = {}) {
  if (!TTS_SUPPORTED || !text) {
    onEnd?.()
    return
  }
  window.speechSynthesis.cancel()
  const token = ++speechToken
  const parts = text.split(/(?<=[.!?…])\s+/).filter((p) => p.trim())
  const voice = pickVoice(lang)
  let finished = false
  const words = text.split(/\s+/).length
  // Phòng khi trình duyệt không báo đọc xong (không có giọng đọc phù hợp...).
  const guard = setTimeout(() => finish(), words * 600 + 3000)
  function finish() {
    if (finished) return
    finished = true
    clearTimeout(guard)
    if (token === speechToken) onEnd?.() // lần đọc đã bị thay bằng lần mới thì bỏ qua
  }
  parts.forEach((part, i) => {
    const u = new SpeechSynthesisUtterance(part)
    u.lang = LANG[lang] || 'vi-VN'
    if (voice) u.voice = voice
    u.rate = 1
    if (i === 0) u.onstart = () => onStart?.()
    if (i === parts.length - 1) u.onend = finish
    u.onerror = (e) => { if (e.error !== 'interrupted' && e.error !== 'canceled') finish() }
    window.speechSynthesis.speak(u)
  })
}

export function stopSpeaking() {
  speechToken++
  if (TTS_SUPPORTED) window.speechSynthesis.cancel()
}

// Hook ghi âm giọng nói thành chữ. onFinal nhận từng đoạn đã nhận diện xong.
export function useDictation(lang, onFinal) {
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [error, setError] = useState('')
  const recRef = useRef(null)
  const onFinalRef = useRef(onFinal)
  onFinalRef.current = onFinal

  const stop = useCallback((discard = false) => {
    const rec = recRef.current
    if (!rec) return
    if (discard) rec.abort()
    else rec.stop()
  }, [])

  const start = useCallback(() => {
    if (!Recognition || recRef.current) return
    const rec = new Recognition()
    rec.lang = LANG[lang] || 'vi-VN'
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (e) => {
      let finalText = ''
      let interimText = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) finalText += r[0].transcript
        else interimText += r[0].transcript
      }
      if (finalText.trim()) onFinalRef.current(finalText.trim())
      setInterim(interimText)
    }
    rec.onerror = (e) => {
      if (e.error !== 'aborted') setError(STT_ERRORS[e.error] || 'Không nhận diện được giọng nói, hãy thử lại.')
    }
    rec.onend = () => {
      recRef.current = null
      setListening(false)
      setInterim('')
    }
    try {
      rec.start()
      recRef.current = rec
      setListening(true)
      setError('')
    } catch {
      setError('Không bật được micro, hãy thử lại.')
    }
  }, [lang])

  useEffect(() => () => recRef.current?.abort(), [])

  return { supported: STT_SUPPORTED, listening, interim, error, start, stop }
}
