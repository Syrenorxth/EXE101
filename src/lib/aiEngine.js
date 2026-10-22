// Người phỏng vấn dùng AI thật (qua proxy /api/chat của Vite, xem vite.config.js).
import { PERSONAS, TOPICS, POSITIONS, COMPANIES } from '../data/content.js'
import { finalize, splitSentences } from './mockEngine.js'

/* global __AI_ENABLED__, __AI_MODEL__ */
export const AI_ENABLED = typeof __AI_ENABLED__ !== 'undefined' && __AI_ENABLED__
const MODEL = typeof __AI_MODEL__ !== 'undefined' ? __AI_MODEL__ : 'gpt-4o-mini'

const END = '[KẾT THÚC]'
const SITUATION = '[TÌNH HUỐNG]'
const MAX_TURNS = 12

async function chat(messages, temperature = 0.7) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, messages, temperature })
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Máy chủ AI trả lỗi ${res.status}. ${body.slice(0, 200)}`)
  }
  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content
  if (!text) throw new Error('AI không trả về nội dung.')
  return text.trim()
}

function systemPrompt(ctx) {
  const persona = PERSONAS[ctx.personaId]
  const topic = TOPICS.find((t) => t.id === ctx.topicId)
  const company = COMPANIES.find((c) => c.id === ctx.companyId)
  const mainCount = topic.take + (topic.situationChange ? 1 : 0)
  const language = ctx.language === 'en'
    ? 'English'
    : 'Tiếng Việt, giữ nguyên thuật ngữ kỹ thuật tiếng Anh như cách người phỏng vấn ở Việt Nam thường nói'

  return `Bạn đóng vai người phỏng vấn trong PalSpeak, nền tảng luyện phỏng vấn cho sinh viên IT Việt Nam.
Vai của bạn: ${persona.name} – ${persona.role}. Phong cách: ${persona.trait}.
Doanh nghiệp: ${company.name} (${company.kind}, mức độ ${company.level}). ${company.desc}
Vị trí ứng tuyển: ${ctx.position} (${POSITIONS[ctx.position]}).
Chủ đề: ${topic.name}. Mục tiêu: ${topic.goal}
Ngôn ngữ phỏng vấn: ${language}.

Quy tắc:
1. Mỗi lượt chỉ hỏi MỘT câu, tối đa 60 từ.
2. Buổi phỏng vấn có đúng ${mainCount} câu hỏi chính, phù hợp chủ đề và cấp độ ${ctx.position}.
3. Nếu câu trả lời mơ hồ, quá ngắn hoặc thiếu kết quả cụ thể, hỏi thêm tối đa MỘT câu đào sâu cho câu hỏi chính đó.
${topic.situationChange ? `4. Câu hỏi chính cuối cùng là một tình huống thay đổi đột ngột trong dự án (deadline, nhân sự, yêu cầu khách hàng). Bắt đầu lượt đó bằng "${SITUATION}".` : '4. Không có tình huống thay đổi trong buổi này.'}
5. Không nhận xét, không chấm điểm, không gợi ý đáp án trong lúc phỏng vấn.
6. Lượt đầu tiên: chào ngắn theo đúng phong cách của vai, rồi hỏi câu chính thứ nhất.
7. Khi ứng viên đã trả lời xong câu chính cuối cùng (và câu đào sâu nếu có), cảm ơn ngắn gọn và kết thúc bằng đúng chuỗi "${END}".
8. Nếu ứng viên trả lời lạc đề hoặc không nghiêm túc, nhắc nhẹ và hỏi lại.`
}

function toMessage(raw) {
  let text = raw
  let done = false
  let kind = 'question'
  if (text.includes(END)) {
    done = true
    text = text.replace(END, '').trim()
    kind = 'closing'
  }
  if (text.includes(SITUATION)) {
    text = text.replace(SITUATION, '').trim()
    kind = 'situation'
  }
  return { done, message: { role: 'interviewer', kind, text, ask: !done } }
}

export function createAiSession(ctx) {
  return { ctx, messages: [{ role: 'system', content: systemPrompt(ctx) }], turns: 0, transcript: [] }
}

export async function aiStart(session) {
  const raw = await chat([...session.messages, { role: 'user', content: 'Bắt đầu buổi phỏng vấn.' }])
  session.messages.push({ role: 'user', content: 'Bắt đầu buổi phỏng vấn.' }, { role: 'assistant', content: raw })
  session.turns = 1
  const { message } = toMessage(raw)
  session.transcript.push({ who: 'Người phỏng vấn', text: message.text })
  return [message]
}

export async function aiReply(session, answer, timedOut, spoken = false) {
  session.spoken = session.spoken || spoken
  const content = timedOut ? `${answer || '(không trả lời)'}\n(Ứng viên hết thời gian trả lời)` : answer
  session.messages.push({ role: 'user', content })
  session.transcript.push({ who: 'Ứng viên', text: content })

  if (session.turns >= MAX_TURNS) {
    const closing = session.ctx.language === 'en' ? 'Thank you, that is all for today.' : 'Cảm ơn bạn, buổi phỏng vấn kết thúc tại đây.'
    return { done: true, messages: [{ role: 'interviewer', kind: 'closing', text: closing }] }
  }

  const raw = await chat(session.messages)
  session.messages.push({ role: 'assistant', content: raw })
  session.turns += 1
  const { done, message } = toMessage(raw)
  session.transcript.push({ who: 'Người phỏng vấn', text: message.text })
  return { done, messages: [message] }
}

function parseJson(text) {
  const cleaned = text.replace(/```json|```/g, '')
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start < 0 || end < start) throw new Error('Không đọc được kết quả chấm điểm từ AI.')
  return JSON.parse(cleaned.slice(start, end + 1))
}

const score = (n) => Math.max(1, Math.min(10, Math.round(Number(n) || 1)))

export async function aiEvaluate(session) {
  const { ctx } = session
  const topic = TOPICS.find((t) => t.id === ctx.topicId)
  const company = COMPANIES.find((c) => c.id === ctx.companyId)
  const transcript = session.transcript.map((l) => `${l.who}: ${l.text}`).join('\n')

  const prompt = `Bạn là chuyên gia đánh giá phỏng vấn tuyển dụng IT tại Việt Nam.
Dưới đây là bản ghi buổi phỏng vấn vị trí ${ctx.position} tại ${company.name}, chủ đề "${topic.name}".
Chấm từng câu hỏi chính (gộp cả câu trả lời cho câu đào sâu của nó) theo 3 tiêu chí, thang 1–10:
- relevance: đúng trọng tâm câu hỏi
- clarity: diễn đạt rõ ràng, độ dài hợp lý
- structure: có cấu trúc (STAR với câu hành vi; định nghĩa → ví dụ → so sánh với câu kỹ thuật)
Chấm sát thực tế cấp độ ${ctx.position}, không cho điểm cao nếu câu trả lời sơ sài. Câu bị hết giờ thì trừ điểm clarity.${session.spoken ? '\nỨng viên trả lời bằng giọng nói được chuyển thành chữ tự động: bỏ qua lỗi chính tả hoặc dấu câu do máy nhận diện, chỉ đánh giá nội dung và cách diễn đạt.' : ''}
Với mỗi câu hỏi chính:
- "answer": chép NGUYÊN VĂN câu trả lời của ứng viên (gộp cả phần trả lời câu đào sâu), không tóm tắt.
- "sentences": chỉ ra tối đa 4 câu cụ thể có vấn đề. "text" phải trích NGUYÊN VĂN đúng một câu trong câu trả lời; "issue" nói rõ câu đó sai ở đâu (lạc đề, mơ hồ, thiếu số liệu, thiếu vai trò cá nhân, từ ngữ chưa phù hợp, thiếu tự tin, sai kiến thức...); "fix" viết lại chính câu đó cho tốt hơn, bằng ${ctx.language === 'en' ? 'tiếng Anh' : 'tiếng Việt'}. Nếu không câu nào có vấn đề thì để mảng rỗng.
- "model_answer": viết một câu trả lời mẫu hoàn chỉnh, tối ưu cho câu hỏi này, 80–150 từ, dùng lại kinh nghiệm và chi tiết ứng viên đã nêu (không bịa thêm thành tích lớn), theo cấu trúc STAR hoặc định nghĩa → ví dụ → so sánh, viết bằng ${ctx.language === 'en' ? 'tiếng Anh' : 'tiếng Việt'}.
Viết nhận xét bằng tiếng Việt, cụ thể, dựa trên chính câu trả lời của ứng viên.
Chỉ trả về JSON hợp lệ, không thêm chữ nào khác, theo mẫu:
{"answers":[{"question":"...","answer":"nguyên văn câu trả lời","relevance":0,"clarity":0,"structure":0,"strengths":["..."],"improvements":["..."],"sentences":[{"text":"câu nguyên văn","issue":"vấn đề","fix":"câu viết lại"}],"better":"Dàn ý ngắn để trả lời tốt hơn","model_answer":"câu trả lời mẫu hoàn chỉnh"}],"summary":"Nhận xét chung 2–3 câu"}

BẢN GHI:
${transcript}`

  const raw = await chat([{ role: 'user', content: prompt }], 0.2)
  const data = parseJson(raw)
  const answers = (data.answers || []).map((a) => ({
    question: a.question || '',
    answer: a.answer || '',
    spoken: Boolean(session.spoken),
    model: a.model_answer || '',
    sentenceIssues: (a.sentences || [])
      .filter((x) => x && x.text)
      .slice(0, 4)
      .map((x) => ({
        index: splitSentences(a.answer || '').findIndex((s) => s.includes(x.text.trim()) || x.text.includes(s)),
        text: x.text,
        issue: x.issue || '',
        fix: x.fix || ''
      })),
    relevance: score(a.relevance),
    clarity: score(a.clarity),
    structure: score(a.structure),
    strengths: a.strengths || [],
    improvements: a.improvements || [],
    better: a.better || '',
    timedOut: false
  }))
  if (!answers.length) throw new Error('AI không trả về phần chấm điểm.')
  return finalize(answers, data.summary, 'ai')
}
