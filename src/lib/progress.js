// Lưu tiến độ học tập của người học ngay trên trình duyệt (localStorage).
const KEY = 'palspeak-progress-v1'

const EMPTY = { points: 0, lessons: {}, done: {}, history: [], presenter: false }

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...EMPTY }
    return { ...EMPTY, ...JSON.parse(raw) }
  } catch {
    return { ...EMPTY }
  }
}

export function saveProgress(p) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    // Trình duyệt chặn lưu trữ: bỏ qua, app vẫn chạy trong phiên hiện tại.
  }
}

export function resetProgress() {
  return { ...EMPTY }
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

export function recordSession(p, s) {
  const key = doneKey(s.companyId, s.topicId)
  const best = Math.max(p.done[key] ?? 0, s.avg)
  return {
    ...p,
    points: p.points + s.earned,
    done: { ...p.done, [key]: best },
    history: [{ ...s, at: new Date().toISOString() }, ...p.history].slice(0, 30)
  }
}
