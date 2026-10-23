// Huy hiệu: thưởng cho những thói quen luyện tập tốt, xét lại sau mỗi buổi.
import { COMPANIES, TOPICS } from '../data/content.js'
import { doneKey, streakOf } from './progress.js'

// Có chủ đề nào mà lần gần nhất cao hơn lần đầu ít nhất 1 điểm không.
function improved(p) {
  const groups = {}
  for (const h of [...p.history].reverse()) {
    const k = doneKey(h.companyId, h.topicId)
    ;(groups[k] ||= []).push(h.avg)
  }
  return Object.values(groups).some((g) => g.length >= 2 && g[g.length - 1] - g[0] >= 1)
}

export const BADGES = [
  { id: 'first', icon: 'chat', name: 'Buổi đầu tiên', desc: 'Hoàn thành buổi phỏng vấn đầu tiên.', test: (p) => p.history.length >= 1 },
  { id: 'lesson', icon: 'book', name: 'Chịu khó học trước', desc: 'Hoàn thành một bài học trước khi phỏng vấn.', test: (p) => Object.keys(p.lessons).length >= 1 },
  { id: 'all-lessons', icon: 'sparkles', name: 'Nắm chắc lý thuyết', desc: 'Hoàn thành cả 3 bài học.', test: (p) => Object.keys(p.lessons).length >= TOPICS.length },
  { id: 'english', icon: 'globe', name: 'Interview in English', desc: 'Hoàn thành một buổi phỏng vấn bằng tiếng Anh.', test: (p) => p.history.some((h) => h.language === 'en') },
  { id: 'voice', icon: 'mic', name: 'Dám nói', desc: 'Trả lời bằng micro trong một buổi phỏng vấn.', test: (p) => p.history.some((h) => h.spoken) },
  { id: 'timer', icon: 'clock', name: 'Phản xạ nhanh', desc: 'Hoàn thành một buổi có giới hạn thời gian.', test: (p) => p.history.some((h) => h.timeChallenge) },
  { id: 'score8', icon: 'star', name: 'Câu trả lời ấn tượng', desc: 'Đạt điểm trung bình từ 8.0 trong một buổi.', test: (p) => p.history.some((h) => h.avg >= 8) },
  { id: 'improve', icon: 'chart', name: 'Tiến bộ rõ rệt', desc: 'Tăng ít nhất 1 điểm so với lần đầu ở cùng một chủ đề.', test: improved },
  { id: 'five', icon: 'target', name: 'Luyện đều tay', desc: 'Hoàn thành 5 buổi phỏng vấn.', test: (p) => p.history.length >= 5 },
  { id: 'streak3', icon: 'flame', name: 'Chuỗi 3 ngày', desc: 'Luyện tập 3 ngày liên tiếp.', test: (p) => streakOf(p.history) >= 3 },
  { id: 'novatech', icon: 'building', name: 'Mở cửa NovaTech', desc: 'Đạt 60 điểm rèn luyện để mở khóa NovaTech.', test: (p) => p.points >= 60 },
  { id: 'globalcore', icon: 'building', name: 'Mở cửa GlobalCore', desc: 'Đạt 150 điểm rèn luyện để mở khóa GlobalCore.', test: (p) => p.points >= 150 },
  {
    id: 'company',
    icon: 'award',
    name: 'Về đích một doanh nghiệp',
    desc: 'Hoàn thành cả 3 chủ đề ở cùng một doanh nghiệp.',
    test: (p) => COMPANIES.some((c) => TOPICS.every((t) => p.done[doneKey(c.id, t.id)] !== undefined))
  }
]

// Trả về tiến độ đã gắn thêm huy hiệu mới và danh sách huy hiệu vừa nhận.
export function awardBadges(p) {
  const owned = p.badges || {}
  const newly = BADGES.filter((b) => !owned[b.id] && b.test(p))
  if (!newly.length) return { progress: p, newly }
  const at = new Date().toISOString()
  return {
    progress: { ...p, badges: { ...owned, ...Object.fromEntries(newly.map((b) => [b.id, at])) } },
    newly
  }
}
