// Tiến độ học tập của từng tài khoản, lưu trên trình duyệt (localStorage).
// Các hàm bên dưới đều là hàm thuần (nhận tiến độ cũ, trả về tiến độ mới),
// nên khi chuyển sang máy chủ thật chỉ cần thay loadProgress/saveProgress.
import { storage } from '../services/storage.js'

const keyOf = (userId) => `palspeak:progress:${userId}`

const empty = () => ({ points: 0, lessons: {}, done: {}, history: [], presenter: false, started: 0, badges: {} })

export function loadProgress(userId) {
  if (!userId) return empty()
  const saved = storage.get(keyOf(userId), null)
  return saved ? { ...empty(), ...saved } : empty()
}

export function saveProgress(userId, p) {
  if (userId) storage.set(keyOf(userId), p)
}

export function removeProgress(userId) {
  storage.remove(keyOf(userId))
}

export function resetProgress() {
  return empty()
}

export const doneKey = (companyId, topicId) => `${companyId}:${topicId}`

export function isCompanyUnlocked(p, company) {
  return p.presenter || p.points >= company.unlockPoints
}

export function isTopicUnlocked(p, companyId, topicId) {
  if (p.presenter || topicId === 1) return true
  return p.done[doneKey(companyId, topicId - 1)] !== undefined
}

// Điểm rèn luyện nhận được sau một buổi phỏng vấn.
export function pointsFor(avg, timeChallenge) {
  return Math.round(avg * 3) + (timeChallenge ? 5 : 0)
}

export function completeLesson(p, topicId) {
  if (p.lessons[topicId]) return { progress: p, earned: 0 }
  return {
    progress: { ...p, points: p.points + 5, lessons: { ...p.lessons, [topicId]: true } },
    earned: 5
  }
}

// Đếm số buổi đã bắt đầu, để tính tỷ lệ hoàn thành (chỉ số H1 của MVP).
export function markStarted(p) {
  return { ...p, started: (p.started || 0) + 1 }
}

// s gồm id, thông tin buổi phỏng vấn và result (kết quả chấm đầy đủ để xem lại).
export function recordSession(p, s) {
  const key = doneKey(s.companyId, s.topicId)
  const best = Math.max(p.done[key] ?? 0, s.avg)
  return {
    ...p,
    points: p.points + s.earned,
    done: { ...p.done, [key]: best },
    history: [{ at: new Date().toISOString(), ...s }, ...p.history].slice(0, 50)
  }
}

export function saveSurvey(p, sessionId, survey) {
  return {
    ...p,
    history: p.history.map((h) => (h.id === sessionId ? { ...h, survey: { ...survey, at: new Date().toISOString() } } : h))
  }
}

// ---------- Thống kê ----------
const dayKey = (d) => {
  const x = new Date(d)
  return `${x.getFullYear()}-${x.getMonth()}-${x.getDate()}`
}

// Số ngày luyện liên tiếp tính đến hôm nay (hoặc hôm qua nếu hôm nay chưa luyện).
export function streakOf(history) {
  const days = new Set(history.map((h) => dayKey(h.at)))
  const d = new Date()
  if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1)
  let n = 0
  while (days.has(dayKey(d))) {
    n += 1
    d.setDate(d.getDate() - 1)
  }
  return n
}

export function statsOf(p) {
  const h = p.history
  const n = h.length
  const avgOf = (fn) => (n ? h.reduce((s, x) => s + fn(x), 0) / n : 0)
  const crit = (k) => avgOf((x) => x.result?.overall?.[k] ?? x.avg)
  return {
    sessions: n,
    avg: avgOf((x) => x.avg),
    best: n ? Math.max(...h.map((x) => x.avg)) : 0,
    streak: streakOf(h),
    criteria: { relevance: crit('relevance'), clarity: crit('clarity'), structure: crit('structure') }
  }
}

// Cấp độ theo điểm rèn luyện, mốc trùng với điểm mở khóa doanh nghiệp.
export const LEVELS = [
  { min: 0, name: 'Tân binh' },
  { min: 60, name: 'Ứng viên tiềm năng' },
  { min: 150, name: 'Ứng viên vững vàng' },
  { min: 300, name: 'Sẵn sàng đi làm' }
]

export function levelOf(points) {
  const i = LEVELS.findLastIndex((l) => points >= l.min)
  const next = LEVELS[i + 1]
  return {
    index: i,
    name: LEVELS[i].name,
    next: next || null,
    pct: next ? ((points - LEVELS[i].min) / (next.min - LEVELS[i].min)) * 100 : 100
  }
}
