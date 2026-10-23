// Dữ liệu mẫu cho tài khoản sinh viên demo: vài buổi phỏng vấn đã làm trong tuần qua,
// được chấm thật bằng bộ chấm của chế độ demo, để trang tổng quan có số liệu khi trình bày.
import { TOPICS, MODEL_ANSWERS } from '../data/content.js'
import { createMockSession, mockEvaluate, splitSentences } from '../lib/mockEngine.js'
import { resetProgress, completeLesson, recordSession, pointsFor } from '../lib/progress.js'
import { awardBadges } from '../lib/achievements.js'
import { newId } from './storage.js'

const SAMPLE = [
  { companyId: 'pixelstart', topicId: 1, daysAgo: 6, keep: 1 },
  { companyId: 'pixelstart', topicId: 1, daysAgo: 5, keep: 3 },
  { companyId: 'pixelstart', topicId: 2, daysAgo: 3, keep: 2 },
  { companyId: 'pixelstart', topicId: 2, daysAgo: 1, keep: 99 }
]

// keep: số câu giữ lại từ câu trả lời mẫu (ít câu → câu trả lời sơ sài → điểm thấp).
function answerFor(q, keep) {
  const model = (MODEL_ANSWERS[q.id]?.en || '').replaceAll('{company}', 'PixelStart')
  return splitSentences(model).slice(0, keep).join(' ')
}

export function seedDemoProgress() {
  let p = completeLesson(resetProgress(), 1).progress
  for (const s of SAMPLE) {
    const topic = TOPICS.find((t) => t.id === s.topicId)
    const ctx = { companyId: s.companyId, topicId: s.topicId, personaId: topic.defaultPersona, language: 'en', position: 'Intern' }
    const session = createMockSession(ctx)
    session.plan.forEach((q, i) => session.answers[i].push({ text: answerFor(q, s.keep), timedOut: false, spoken: false }))
    session.reverse = { text: 'What does a typical day look like for an intern in your team?', timedOut: false, spoken: false }
    const result = mockEvaluate(session)
    const at = new Date(Date.now() - s.daysAgo * 86400000).toISOString()
    p = recordSession(p, {
      id: newId(),
      ...ctx,
      at,
      timeChallenge: true,
      spoken: false,
      mode: 'demo',
      sample: true,
      avg: result.overall.avg,
      earned: pointsFor(result.overall.avg, true),
      result
    })
  }
  return awardBadges(p).progress
}
