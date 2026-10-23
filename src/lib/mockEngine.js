// "Chế độ demo": người phỏng vấn theo kịch bản + chấm điểm theo quy tắc.
// Dùng khi chưa cấu hình API key, hoặc khi cần trình chiếu không có mạng.
import { QUESTIONS, SITUATION_CHANGES, PERSONAS, TOPICS, COMPANIES, MODEL_ANSWERS, REVERSE_QUESTION } from '../data/content.js'

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const words = (t) => (t.trim() ? t.trim().split(/\s+/).length : 0)
const clamp = (n) => Math.max(1, Math.min(10, Math.round(n)))

const FOLLOW_UPS = {
  specific: {
    vi: 'Bạn có thể nói cụ thể hơn không? Chính bạn đã làm phần nào?',
    en: 'Could you be more specific? What exactly did you do yourself?'
  },
  result: {
    vi: 'Kết quả cuối cùng ra sao? Có con số hay minh chứng cụ thể nào không?',
    en: 'What was the final result? Any numbers or concrete evidence?'
  },
  example: {
    vi: 'Em lấy một ví dụ cụ thể từ dự án em đã làm được không?',
    en: 'Can you give a concrete example from a project you worked on?'
  },
  prevent: {
    vi: 'Sau khi xử lý xong, em làm gì để lỗi đó không lặp lại?',
    en: 'And afterwards, how would you make sure it does not happen again?'
  },
  shorten: {
    vi: 'Em tóm lại ý chính trong hai câu giúp chị.',
    en: 'Please sum up your main point in two sentences.'
  }
}

const CLOSING = {
  vi: 'Cảm ơn bạn. Công ty sẽ liên hệ với bạn về các bước tiếp theo. Nhận xét chi tiết sẽ hiện ngay sau đây.',
  en: 'Thank you. We will contact you about the next steps. Your detailed feedback is coming up next.'
}

const RESULT_WORDS = ['kết quả', 'cuối cùng', 'hoàn thành', 'tăng', 'giảm', 'nhờ đó', 'bài học', '%', 'result', 'finally', 'increased', 'reduced', 'improved', 'saved', 'achieved', 'completed', 'learned', 'outcome']
const EXAMPLE_WORDS = ['ví dụ', 'chẳng hạn', 'như là', 'example', 'for instance', 'such as']
const PREVENT_WORDS = ['báo', 'ghi lại', 'test', 'kiểm thử', 'lặp lại', 'rút kinh nghiệm', 'report', 'document', 'prevent', 'again', 'post-mortem', 'monitor']

// Lập danh sách câu hỏi chính theo trình tự của chủ đề: mỗi bước chọn một câu,
// tình huống thay đổi (nếu có) luôn ở cuối. Dùng chung cho chế độ demo và AI thật.
export function buildPlan(topicId) {
  const topic = TOPICS.find((t) => t.id === topicId)
  const plan = topic.stages.map((stage) => {
    const id = pick(stage.ids)
    return { ...QUESTIONS[id], id, stage: stage.name, bridge: stage.bridge }
  })
  if (topic.situationChange) {
    plan.push({
      ...pick(SITUATION_CHANGES),
      kind: 'situation',
      stage: 'Tình huống thay đổi',
      bridge: { vi: 'Câu cuối cùng.', en: 'One last question.' }
    })
  }
  return plan
}

export function createMockSession(ctx) {
  const plan = buildPlan(ctx.topicId)
  return { ctx, plan, index: 0, followUpAsked: false, reverseAsked: false, reverse: null, answers: plan.map(() => []) }
}

function needsFollowUp(session, answer) {
  const q = session.plan[session.index]
  const n = words(answer)
  const lower = answer.toLowerCase()
  const persona = session.ctx.personaId
  if (n < 25) return 'specific'
  if (persona === 'manager' && n > 150) return 'shorten'
  if (q.kind === 'tech' && persona === 'techlead' && !EXAMPLE_WORDS.some((w) => lower.includes(w))) return 'example'
  if (q.kind === 'incident') return PREVENT_WORDS.some((w) => lower.includes(w)) ? null : 'prevent'
  if (q.kind !== 'tech' && !RESULT_WORDS.some((w) => lower.includes(w))) return 'result'
  return null
}

const questionMessage = (q, lang) => ({
  role: 'interviewer',
  kind: q.kind === 'situation' ? 'situation' : 'question',
  text: q[lang],
  ask: true
})

// Trả về danh sách tin nhắn mở đầu.
export function mockStart(session) {
  const lang = session.ctx.language
  const persona = PERSONAS[session.ctx.personaId]
  const q = session.plan[0]
  const intro = q.bridge ? `${persona.intro[lang]} ${q.bridge[lang]}` : persona.intro[lang]
  return [
    { role: 'interviewer', kind: 'intro', text: intro },
    questionMessage(q, lang)
  ]
}

// Nhận câu trả lời, trả về { messages, done }.
export function mockReply(session, answer, timedOut, spoken = false) {
  const lang = session.ctx.language
  const persona = PERSONAS[session.ctx.personaId]

  // Ứng viên vừa trả lời câu "Bạn có câu hỏi nào không?" → kết thúc buổi phỏng vấn.
  if (session.reverseAsked) {
    session.reverse = { text: answer, timedOut, spoken }
    return { done: true, messages: [{ role: 'interviewer', kind: 'closing', text: CLOSING[lang] }] }
  }

  session.answers[session.index].push({ text: answer, timedOut, spoken })

  if (!session.followUpAsked && !timedOut) {
    const reason = needsFollowUp(session, answer)
    if (reason) {
      session.followUpAsked = true
      return { done: false, messages: [{ role: 'interviewer', kind: 'followup', text: FOLLOW_UPS[reason][lang], ask: true }] }
    }
  }

  session.index += 1
  session.followUpAsked = false
  const ack = pick(persona.ack[lang])

  // Hết câu hỏi chính → mời ứng viên hỏi lại, như cuối một buổi phỏng vấn thật.
  if (session.index >= session.plan.length) {
    session.reverseAsked = true
    return {
      done: false,
      messages: [{ role: 'interviewer', kind: 'reverse', text: `${ack} ${REVERSE_QUESTION[lang]}`, ask: true }]
    }
  }

  const q = session.plan[session.index]
  return {
    done: false,
    messages: [
      { role: 'interviewer', kind: 'ack', text: q.bridge ? `${ack} ${q.bridge[lang]}` : ack },
      questionMessage(q, lang)
    ]
  }
}

// ---------- Chấm điểm theo quy tắc ----------
const FILLERS = ['thì là', 'kiểu như', 'kiểu là', 'ừm', 'ờ', 'nói chung là', 'um', 'uh', 'erm', 'you know', 'i mean', 'basically']
const FILLER_EXAMPLE = { vi: '"thì là", "kiểu như"', en: '"um", "uh", "you know", "basically"' }
const STAR = [
  ['bối cảnh', 'khi ', 'lúc ', 'hồi ', 'trong dự án', 'học kỳ', 'situation', 'when ', 'during'],
  ['nhiệm vụ', 'phụ trách', 'yêu cầu', 'mục tiêu', 'cần ', 'task', 'goal', 'responsible'],
  ['em đã', 'mình đã', 'tôi đã', 'đã làm', 'em làm', 'quyết định', 'i did', 'i built', 'i implemented', 'i decided', 'i '],
  RESULT_WORDS
]
const TECH = [
  [' là ', 'nghĩa là', 'dùng để', ' is ', 'means', 'used to'],
  EXAMPLE_WORDS,
  ['so với', 'khác', 'ưu điểm', 'nhược điểm', 'đánh đổi', 'trade-off', 'compared', 'whereas', 'however', 'nhưng']
]
// Khung xử lý sự cố (bài học chủ đề 2): khoanh vùng → tìm nguyên nhân → khắc phục → báo cáo.
const INCIDENT = [
  ['bình tĩnh', 'khoanh vùng', 'xác định', 'kiểm tra', 'tái hiện', 'stay calm', 'narrow', 'identify', 'check', 'reproduce'],
  ['log', 'nguyên nhân', 'thay đổi gần nhất', 'deploy', 'cause', 'recent', 'latest change', 'root'],
  ['sửa', 'rollback', 'khắc phục', 'hotfix', 'phiên bản ổn định', 'fix', 'roll back', 'restore', 'stable version'],
  ['báo', 'trưởng nhóm', 'ghi lại', 'test', 'report', 'team lead', 'document', 'inform', 'prevent']
]
const CONNECTORS = ['đầu tiên', 'thứ nhất', 'thứ hai', 'sau đó', 'tiếp theo', 'cuối cùng', 'first', 'second', 'then', 'next', 'finally']

// ---------- Chỉ lỗi theo từng câu ----------
export function splitSentences(text) {
  return text
    .split(/(?<=[.!?…])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

const VAGUE = ['nhiều', 'khá tốt', 'rất tốt', 'cũng ổn', 'khá ổn', 'bình thường', 'cũng được', 'một số', 'a lot', 'lots of', 'pretty good', 'very good', 'some things', 'many things', 'stuff', 'various']
const HEDGE = ['em không biết', 'mình không biết', 'chắc là', 'có lẽ', 'không chắc', "i don't know", 'i dont know', 'i am not sure', "i'm not sure", 'maybe', 'i guess', 'i think maybe', 'probably']
const INFORMAL = ['oke', 'ok', 'okela', 'bt', 'vl', 'gonna', 'wanna', 'kinda', 'gotta', 'yeah', 'yep', 'nope', 'cool', 'awesome']
const TEAM_ONLY = ['nhóm em', 'chúng em', 'bọn em', 'nhóm mình', 'we', 'our team', 'my team']
const SELF = ['em đã', 'em phụ trách', 'em tự', 'mình đã', 'mình phụ trách', 'tôi đã', 'tôi phụ trách', 'i built', 'i did', 'i was', 'i designed', 'i implemented', 'i wrote', 'i handled', 'i led', 'i created', 'i developed', 'i worked on', "i'm responsible", 'i am responsible', 'my role', 'my part']

// Gợi ý câu nói mẫu theo ngôn ngữ phỏng vấn (giải thích vẫn bằng tiếng Việt).
const FIX_TEXT = {
  hedge: {
    vi: 'Nói điều bạn biết chắc, hoặc nêu cách bạn sẽ tìm hiểu: “Em chưa làm trực tiếp, nhưng em sẽ bắt đầu bằng…”.',
    en: 'Nói điều bạn biết chắc, hoặc nêu cách bạn sẽ tìm hiểu: “I haven\'t done this directly yet, but I would start by…”.'
  },
  team: {
    vi: 'Nói rõ vai trò của bạn: “Trong nhóm, em phụ trách…, em đã…”.',
    en: 'Nói rõ vai trò của bạn: “In the team, I was responsible for…, and I…”.'
  },
  informal: {
    vi: 'Dùng từ trang trọng hơn, ví dụ “được ạ”, “nhìn chung”, “cụ thể là”.',
    en: 'Dùng từ trang trọng hơn, ví dụ “yes” thay cho “yeah”, “going to” thay cho “gonna”, “great” thay cho “awesome”.'
  }
}

const escapeRe = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// Khớp nguyên cụm từ (tránh nhầm “ổn” trong “ổn định”).
const hasWord = (text, w) => new RegExp(`(^|[\\s,.;:!?“”"'()])${escapeRe(w)}(?=$|[\\s,.;:!?“”"'()])`, 'i').test(text)
const hasAny = (text, list) => list.some((w) => hasWord(text, w))

function cleanFillers(sentence) {
  let out = sentence
  for (const f of FILLERS) {
    out = out.replace(new RegExp(`(^|[\\s,.;:!?])${escapeRe(f)}(?=$|[\\s,.;:!?])[,]?`, 'gi'), '$1')
  }
  out = out.replace(/\s{2,}/g, ' ').replace(/\s+([,.!?])/g, '$1').replace(/^[\s,]+/, '').trim()
  return out.charAt(0).toUpperCase() + out.slice(1)
}

// Trả về danh sách câu có vấn đề: { index, text, issue, fix }
export function analyzeSentences(q, text, lang = 'vi') {
  const sentences = splitSentences(text)
  const whole = ` ${text.toLowerCase()} `
  const talksAboutSelf = SELF.some((w) => whole.includes(w))
  const issues = []

  sentences.forEach((sentence, index) => {
    const lower = ` ${sentence.toLowerCase()} `
    const n = sentence.split(/\s+/).length
    let issue = null
    let fix = null

    if (hasAny(lower, FILLERS)) {
      issue = 'Có từ đệm làm câu nói thiếu chắc chắn.'
      fix = `Bỏ từ đệm: “${cleanFillers(sentence)}”`
    } else if (hasAny(lower, HEDGE)) {
      issue = 'Cách nói thiếu tự tin, dễ khiến người phỏng vấn nghi ngờ năng lực.'
      fix = FIX_TEXT.hedge[lang]
    } else if (sentences.length === 1 && n < 8) {
      issue = 'Câu trả lời chỉ có một câu ngắn, chưa đủ thông tin để đánh giá.'
      fix = 'Mở rộng theo dàn ý gợi ý bên dưới, ít nhất 3–4 câu.'
    } else if (n > 35) {
      issue = `Câu quá dài (${n} từ), người nghe khó theo kịp.`
      fix = 'Tách thành 2–3 câu ngắn, mỗi câu chỉ nói một ý.'
    } else if (q.kind !== 'tech' && !talksAboutSelf && hasAny(lower, TEAM_ONLY)) {
      issue = 'Chỉ nói về cả nhóm, chưa rõ chính bạn đã làm gì.'
      fix = FIX_TEXT.team[lang]
    } else if (hasAny(lower, VAGUE) && !/\d/.test(sentence)) {
      issue = 'Diễn đạt chung chung, thiếu con số hoặc ví dụ cụ thể.'
      fix = 'Thêm số liệu hoặc ví dụ: thời gian, số người dùng, mức cải thiện (%)...'
    } else if (hasAny(lower, INFORMAL)) {
      issue = 'Từ ngữ hơi thân mật, chưa phù hợp với buổi phỏng vấn.'
      fix = FIX_TEXT.informal[lang]
    }

    if (issue) issues.push({ index, text: sentence, issue, fix })
  })

  return issues.slice(0, 4)
}

const STRUCTURE_TIP = {
  tech: 'Nên trả lời theo khung: định nghĩa → ví dụ → so sánh, đánh đổi.',
  incident: 'Nên trả lời theo khung xử lý sự cố: khoanh vùng → tìm nguyên nhân (log, thay đổi gần nhất) → khắc phục hoặc rollback → báo cáo và phòng tránh.',
  behavior: 'Nên sắp xếp theo STAR: bối cảnh → nhiệm vụ → hành động → kết quả.'
}

function scoreAnswer(q, text, timedOut, lang = 'vi') {
  const lower = ` ${text.toLowerCase()} `
  const n = words(text)
  const strengths = []
  const improvements = []

  // Relevance
  const hit = q.kw.filter((k) => lower.includes(k))
  let relevance = clamp(3 + hit.length * 1.5)
  if (n < 10) relevance = Math.min(relevance, 3)
  if (relevance >= 7) strengths.push('Bám sát câu hỏi, đề cập đúng các ý chính.')
  else {
    const isAscii = (k) => /^[\x00-\x7F]+$/.test(k)
    const missing = q.kw.filter((k) => !lower.includes(k) && (lang === 'en' ? isAscii(k) : true)).slice(0, 4)
    improvements.push(`Câu trả lời chưa chạm đủ ý chính. Nên nhắc tới: ${missing.join(', ')}.`)
  }

  // Clarity
  let clarity = 10
  const sentences = text.split(/[.!?…]+/).filter((s) => s.trim()).length || 1
  const avgLen = n / sentences
  const fillerCount = FILLERS.filter((f) => hasWord(lower, f)).length
  if (n < 25) { clarity -= 4; improvements.push('Câu trả lời quá ngắn, nhà tuyển dụng khó đánh giá năng lực của bạn.') }
  else if (n < 40) clarity -= 1
  if (n > 220) { clarity -= 3; improvements.push('Câu trả lời khá dài. Hãy nói ý chính trước rồi mới giải thích.') }
  if (avgLen > 35) { clarity -= 2; improvements.push('Câu văn quá dài, nên tách thành nhiều câu ngắn.') }
  if (fillerCount) { clarity -= Math.min(3, fillerCount); improvements.push(`Hạn chế các từ đệm như ${FILLER_EXAMPLE[lang] || FILLER_EXAMPLE.vi}.`) }
  if (timedOut) { clarity -= 1; improvements.push('Bạn chưa hoàn thành câu trả lời trong thời gian giới hạn.') }
  clarity = clamp(clarity)
  if (clarity >= 7) strengths.push('Độ dài hợp lý, diễn đạt dễ theo dõi.')

  // Structure
  const starHits = STAR.filter((g) => g.some((w) => lower.includes(w))).length
  const techHits = TECH.filter((g) => g.some((w) => lower.includes(w))).length
  const incidentHits = INCIDENT.filter((g) => g.some((w) => lower.includes(w))).length
  const connector = CONNECTORS.some((w) => lower.includes(w)) ? 1 : 0
  const structure = q.kind === 'tech'
    ? clamp(2 + techHits * 2.5 + connector)
    : q.kind === 'incident'
      ? clamp(2 + incidentHits * 2 + connector)
      : clamp(2 + starHits * 2 + connector)
  if (structure >= 7) strengths.push('Câu trả lời có cấu trúc rõ ràng.')
  else improvements.push(STRUCTURE_TIP[q.kind] || STRUCTURE_TIP.behavior)

  if (!strengths.length) strengths.push('Bạn đã hoàn thành câu trả lời, đây là bước đầu tốt để luyện tiếp.')
  return { relevance, clarity, structure, strengths, improvements }
}

export function mockEvaluate(session) {
  const lang = session.ctx.language
  const answers = session.plan.map((q, i) => {
    const parts = session.answers[i]
    const text = parts.map((p) => p.text).join(' ')
    const timedOut = parts.some((p) => p.timedOut)
    const spoken = parts.some((p) => p.spoken)
    const companyName = COMPANIES.find((c) => c.id === session.ctx.companyId)?.name || ''
    const model = (MODEL_ANSWERS[q.id]?.[lang] || '').replaceAll('{company}', companyName)
    return {
      question: q[lang],
      answer: text,
      timedOut,
      spoken,
      better: q.outline,
      model,
      sentenceIssues: analyzeSentences(q, text, lang),
      ...scoreAnswer(q, text, timedOut, lang)
    }
  })
  const result = finalize(answers, null, 'demo')
  result.reverse = session.reverse
  return result
}

export function finalize(answers, summary, mode) {
  const avgOf = (k) => answers.reduce((s, a) => s + a[k], 0) / (answers.length || 1)
  const overall = { relevance: avgOf('relevance'), clarity: avgOf('clarity'), structure: avgOf('structure') }
  overall.avg = (overall.relevance + overall.clarity + overall.structure) / 3
  const weakest = Object.entries({ Relevance: overall.relevance, Clarity: overall.clarity, Structure: overall.structure })
    .sort((a, b) => a[1] - b[1])[0][0]
  const text = summary || `Điểm trung bình ${overall.avg.toFixed(1)}/10. Tiêu chí cần ưu tiên cải thiện: ${weakest}. Hãy xem gợi ý ở từng câu và luyện lại chủ đề này.`
  return { answers, overall, summary: text, mode }
}
