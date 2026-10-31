// Phỏng vấn theo CV và JD: đọc file, cho AI quét rồi lập danh sách câu hỏi riêng cho buổi phỏng vấn.
// Kết quả (plan) có cùng dạng với buildPlan() nên dùng lại được người phỏng vấn AI và chế độ demo.
import { CAREERS, DEFAULT_CAREER } from '../data/content.js'
import { AI_ENABLED, chat, parseJson } from './aiEngine.js'

// Thư viện đọc PDF và Word tải từ CDN khi cần, không phải cài thêm gói nào.
const PDFJS = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.min.mjs'
const PDF_WORKER = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs'
const MAMMOTH = 'https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js'

export const ACCEPT = '.pdf,.docx,.txt,.md'
export const MAX_FILE_MB = 5
export const MIN_CHARS = 80
const MAX_CHARS = 6000 // phần gửi cho AI, đủ cho một CV và một JD thông thường

const tidy = (t) => t.replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/[ \t]{2,}/g, ' ').trim()

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const el = document.createElement('script')
    el.src = src
    el.onload = resolve
    el.onerror = () => reject(new Error('Không tải được thư viện đọc file. Kiểm tra kết nối mạng hoặc dán nội dung vào ô bên dưới.'))
    document.head.appendChild(el)
  })
}

async function readPdf(file) {
  const pdfjs = await import(/* @vite-ignore */ PDFJS)
  pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise
  const pages = []
  for (let i = 1; i <= doc.numPages; i++) {
    const content = await (await doc.getPage(i)).getTextContent()
    // Xuống dòng khi pdf.js báo hết dòng để giữ bố cục mục trong CV.
    pages.push(content.items.map((it) => it.str + (it.hasEOL ? '\n' : '')).join(''))
  }
  return pages.join('\n')
}

async function readDocx(file) {
  if (!window.mammoth) await loadScript(MAMMOTH)
  const { value } = await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
  return value
}

export async function readFileText(file) {
  if (file.size > MAX_FILE_MB * 1024 * 1024) throw new Error(`File lớn hơn ${MAX_FILE_MB} MB.`)
  const name = file.name.toLowerCase()
  const isPdf = name.endsWith('.pdf')
  const isDocx = name.endsWith('.docx')
  if (!isPdf && !isDocx && !name.endsWith('.txt') && !name.endsWith('.md')) throw new Error('Chỉ hỗ trợ file PDF, Word (.docx) hoặc văn bản (.txt).')
  let text
  try {
    text = isPdf ? await readPdf(file) : isDocx ? await readDocx(file) : await file.text()
  } catch (e) {
    if (e.message.startsWith('Không tải được')) throw e
    throw new Error('File bị lỗi hoặc không đúng định dạng. Hãy xuất lại file hoặc dán nội dung vào ô bên dưới.')
  }
  text = tidy(text)
  if (!text) throw new Error('Không đọc được chữ trong file (có thể là ảnh scan). Hãy dán nội dung vào ô bên dưới.')
  if (text.length < MIN_CHARS) throw new Error(`Nội dung file quá ngắn (cần ít nhất ${MIN_CHARS} ký tự).`)
  return text
}

// ---------- Từ khóa kỹ năng dùng cho chế độ demo ----------
const SKILLS = {
  it: ['javascript', 'typescript', 'react', 'vue', 'angular', 'node.js', 'nodejs', 'java', 'spring', 'python', 'django', 'c#', '.net', 'php', 'laravel', 'sql', 'mysql', 'postgresql', 'mongodb', 'git', 'docker', 'aws', 'rest api', 'html', 'css', 'unit test', 'testing', 'flutter', 'kotlin', 'swift', 'linux', 'agile', 'scrum'],
  marketing: ['seo', 'content', 'facebook ads', 'google ads', 'tiktok', 'social media', 'copywriting', 'canva', 'photoshop', 'google analytics', 'email marketing', 'branding', 'kol', 'pr', 'sự kiện', 'event', 'nghiên cứu thị trường', 'market research', 'digital marketing'],
  finance: ['excel', 'kế toán', 'accounting', 'kiểm toán', 'audit', 'báo cáo tài chính', 'financial statement', 'thuế', 'tax', 'misa', 'sap', 'ifrs', 'vas', 'phân tích tài chính', 'financial analysis', 'power bi', 'acca', 'cfa', 'ngân sách', 'budget'],
  sales: ['bán hàng', 'sales', 'b2b', 'b2c', 'crm', 'đàm phán', 'negotiation', 'chăm sóc khách hàng', 'customer service', 'telesales', 'doanh số', 'kpi', 'lead', 'salesforce', 'tư vấn', 'thuyết trình', 'presentation']
}
const SOFT = ['tiếng anh', 'english', 'giao tiếp', 'communication', 'làm việc nhóm', 'teamwork', 'giải quyết vấn đề', 'problem solving', 'quản lý thời gian', 'time management']

const escapeRe = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const has = (text, w) => new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRe(w)}(?=$|[^\\p{L}\\p{N}])`, 'iu').test(text)
const found = (text, list) => list.filter((w) => has(text, w))

function guessCareer(jd, cv, fallback) {
  const scores = CAREERS.map((c) => [c.id, found(jd, SKILLS[c.id]).length * 2 + found(cv, SKILLS[c.id]).length])
  const [id, n] = scores.sort((a, b) => b[1] - a[1])[0]
  return n > 0 ? id : fallback || DEFAULT_CAREER
}

function guessRole(jd) {
  const lines = jd.split('\n').map((l) => l.trim()).filter(Boolean)
  const labelled = lines.map((l) => l.match(/^(vị trí|chức danh|position|job title|tuyển dụng|tuyển)\s*[:\-–]?\s*(.{3,70})$/i)).find(Boolean)
  if (labelled) return labelled[2].replace(/[.:]$/, '').trim()
  // JD dán thành một đoạn liền: "Công ty X tuyển Fresher Frontend Developer. Mô tả: ..."
  const inline = jd.match(/(?:tuyển dụng|tuyển|is hiring|hiring|vị trí|position)\s*[:\-–]?\s*([^\n.,;:()]{3,60})/i)
  if (inline) return inline[1].trim()
  const first = lines.find((l) => !/^(công ty|company|mô tả|job description|jd)\b/i.test(l))
  const sentence = first?.split(/[.:;]/)[0].trim()
  return sentence && sentence.length <= 70 ? sentence : 'vị trí trong JD'
}

function guessCompany(jd) {
  const m = jd.match(/(?:công ty|company|tập đoàn|ngân hàng)\s*[:\-–]?\s*([^\n,.;()]{2,50})/i)
  // Bỏ phần "... tuyển ..." dính phía sau tên công ty
  return m ? m[1].split(/\s+(?:cần |đang )?(?:tuyển|is hiring|hiring|tìm kiếm)/i)[0].trim() : ''
}

function guessLevel(jd, fallback) {
  if (/intern|thực tập/i.test(jd)) return 'Intern'
  if (/fresher|mới tốt nghiệp|fresh graduate/i.test(jd)) return 'Fresher'
  return fallback === 'Intern' ? 'Intern' : 'Fresher'
}

// Câu trong CV nói về dự án / kinh nghiệm, dùng làm chất liệu cho câu hỏi đào sâu.
function cvHighlight(cv) {
  // CV dán liền một đoạn thì tách theo câu; bỏ nhãn đầu câu như "Kinh nghiệm:"
  const line = cv.split(/\n|(?<=[.;])\s+/).map((l) => l.replace(/^[•\-–*\s]+/, '').trim())
    .find((l) => l.length >= 12 && /(dự án|project|thực tập|intern|kinh nghiệm|câu lạc bộ|chiến dịch|campaign)/i.test(l))
  if (!line) return ''
  const text = line.replace(/^[^:]{2,25}:\s*/, '').replace(/[.;]$/, '')
  return text.length <= 120 ? text : text.slice(0, 120).replace(/[,\s][^,\s]*$/, '') + '…'
}

const INCIDENTS = {
  it: {
    vi: 'Ngay trước hạn bàn giao, tính năng bạn phụ trách bị lỗi trên môi trường thật. Bạn sẽ xử lý thế nào?',
    en: 'Right before a deadline, a feature you own breaks in production. How would you handle it?'
  },
  marketing: {
    vi: 'Sau tuần đầu, chiến dịch bạn phụ trách có kết quả thấp hơn nhiều so với kỳ vọng. Bạn sẽ làm gì?',
    en: 'After the first week, the campaign you run is performing far below target. What would you do?'
  },
  finance: {
    vi: 'Ngay trước hạn nộp, bạn phát hiện số liệu trên báo cáo lệch so với sổ sách. Bạn sẽ xử lý thế nào?',
    en: 'Just before a deadline, you find the report figures do not match the books. How would you handle it?'
  },
  sales: {
    vi: 'Một khách hàng lớn phàn nàn và dọa hủy hợp đồng vì giao hàng chậm. Bạn sẽ xử lý thế nào?',
    en: 'A key client complains and threatens to cancel because of a late delivery. How would you handle it?'
  }
}

const OUTLINE = {
  intro: 'Tên, chuyên ngành → kinh nghiệm hoặc dự án sát với JD nhất → vì sao bạn hợp với vị trí này.',
  project: 'Bối cảnh → nhiệm vụ của bạn → bạn đã làm gì → kết quả có số liệu, bài học.',
  skill: 'Định nghĩa ngắn → ví dụ bạn đã dùng trong dự án → khi nào nên dùng, so sánh với cách khác.',
  gap: 'Thừa nhận thẳng thắn → điều bạn đã có liên quan → kế hoạch học cụ thể, có mốc thời gian.',
  incident: 'Xác nhận và khoanh vùng vấn đề → tìm nguyên nhân → khắc phục hoặc đề xuất giải pháp → báo cáo, phòng tránh lặp lại.',
  fit: 'Điều bạn biết về công ty và vị trí → 2 điểm bạn đáp ứng JD, kèm bằng chứng → điều bạn muốn học thêm.'
}

// Phân tích không dùng AI: so khớp từ khóa kỹ năng giữa JD và CV rồi điền vào mẫu câu hỏi.
function demoAnalyze({ cv, jd, fallbackCareer, fallbackLevel }) {
  const careerId = guessCareer(jd, cv, fallbackCareer)
  const role = guessRole(jd)
  const company = guessCompany(jd)
  const level = guessLevel(jd, fallbackLevel)
  const jdSkills = [...new Set([...found(jd, SKILLS[careerId]), ...found(jd, SOFT)])]
  const cvSkills = new Set([...found(cv, SKILLS[careerId]), ...found(cv, SOFT)])
  const matched = jdSkills.filter((s) => cvSkills.has(s))
  const gaps = jdSkills.filter((s) => !cvSkills.has(s))
  const match = jdSkills.length ? Math.round((matched.length / jdSkills.length) * 100) : 50
  const highlight = cvHighlight(cv)
  const skill = matched[0] || jdSkills[0]
  const gap = gaps[0]
  const at = { vi: company ? ` tại ${company}` : '', en: company ? ` at ${company}` : '' }
  const roleKw = role.toLowerCase().split(/\s+/).filter((w) => w.length > 2)

  const plan = [
    {
      kind: 'behavior',
      stage: 'Giới thiệu & lý do ứng tuyển',
      vi: `Bạn hãy giới thiệu ngắn gọn về bản thân và vì sao bạn ứng tuyển vị trí ${role}${at.vi}.`,
      en: `Please introduce yourself briefly and tell me why you are applying for the ${role} position${at.en}.`,
      kw: ['ngành', 'học', 'dự án', 'kinh nghiệm', 'kỹ năng', 'major', 'project', 'experience', 'skill', ...roleKw],
      outline: OUTLINE.intro
    },
    {
      kind: 'behavior',
      stage: 'Kinh nghiệm trong CV',
      vi: highlight
        ? `Trong CV bạn có ghi "${highlight}". Bạn hãy kể rõ vai trò của mình và kết quả đạt được.`
        : 'Hãy kể về dự án hoặc kinh nghiệm trong CV liên quan nhất đến vị trí này: bạn làm gì và kết quả ra sao?',
      en: highlight
        ? `Your CV mentions "${highlight}". Tell me about your role and the results you achieved.`
        : 'Tell me about the project or experience in your CV that is most relevant to this role: what did you do and what was the result?',
      kw: ['vai trò', 'phụ trách', 'kết quả', 'nhóm', 'role', 'result', 'team', 'responsible', ...matched.slice(0, 4)],
      outline: OUTLINE.project
    },
    {
      kind: 'tech',
      stage: 'Kỹ năng JD yêu cầu',
      vi: skill
        ? `JD yêu cầu ${skill}. Bạn đã sử dụng ${skill} như thế nào? Hãy cho một ví dụ cụ thể.`
        : 'Kỹ năng chuyên môn nào trong JD bạn tự tin nhất? Hãy cho một ví dụ bạn đã áp dụng nó.',
      en: skill
        ? `The JD asks for ${skill}. How have you used ${skill}? Please give a concrete example.`
        : 'Which technical skill in the JD are you most confident in? Give an example of how you applied it.',
      kw: [...(skill ? [skill] : []), 'ví dụ', 'dự án', 'so với', 'example', 'project', 'compared'],
      outline: OUTLINE.skill
    },
    {
      kind: 'behavior',
      stage: 'Khoảng trống so với JD',
      vi: gap
        ? `Vị trí này cần ${gap} nhưng CV của bạn chưa thể hiện rõ. Bạn sẽ bù đắp phần này thế nào?`
        : 'So với JD, đâu là điểm bạn còn yếu nhất và bạn đang cải thiện nó ra sao?',
      en: gap
        ? `This role needs ${gap}, but your CV does not show it clearly. How would you close that gap?`
        : 'Compared with the JD, what is your weakest point and how are you improving it?',
      kw: [...(gap ? [gap] : []), 'học', 'kế hoạch', 'khóa học', 'tháng', 'learn', 'plan', 'course', 'month', 'improve'],
      outline: OUTLINE.gap
    },
    {
      kind: 'incident',
      stage: 'Tình huống trong công việc',
      ...INCIDENTS[careerId],
      kw: ['xác nhận', 'nguyên nhân', 'khắc phục', 'báo cáo', 'ưu tiên', 'confirm', 'cause', 'fix', 'report', 'priority'],
      outline: OUTLINE.incident
    },
    {
      kind: 'behavior',
      stage: 'Mức độ phù hợp',
      vi: `Vì sao bạn nghĩ mình phù hợp với ${company || 'công ty'} hơn những ứng viên khác?`,
      en: `Why do you think you are a better fit for ${company || 'our company'} than other candidates?`,
      kw: ['phù hợp', 'đáp ứng', 'kinh nghiệm', 'mục tiêu', 'fit', 'experience', 'goal', ...matched.slice(0, 3)],
      outline: OUTLINE.fit
    }
  ]

  return {
    role,
    company,
    careerId,
    level,
    match,
    strengths: matched.length ? matched.map((s) => `CV có thể hiện ${s}, đúng yêu cầu của JD`) : ['Chưa thấy kỹ năng nào trong CV trùng khớp rõ với JD'],
    gaps: gaps.length ? gaps.map((s) => `JD cần ${s} nhưng CV chưa nhắc tới`) : ['Không thấy kỹ năng nào JD yêu cầu mà CV còn thiếu'],
    summary: `${role}${at.vi}: CV đáp ứng ${matched.length}/${jdSkills.length || 0} kỹ năng nhận ra trong JD.`,
    jdSummary: `Vị trí ${role}${at.vi}, cấp độ ${level}. Kỹ năng yêu cầu: ${jdSkills.join(', ') || 'không nhận ra'}.`,
    cvSummary: `Kỹ năng thể hiện trong CV: ${[...cvSkills].join(', ') || 'không nhận ra'}.${highlight ? ` Nổi bật: ${highlight}.` : ''}`,
    plan,
    mode: 'demo'
  }
}

// ---------- Phân tích bằng AI ----------
const KINDS = ['behavior', 'tech', 'incident']

function aiPrompt(cv, jd) {
  return `Bạn là chuyên gia tuyển dụng tại Việt Nam. Hãy đọc JD và CV dưới đây, đánh giá mức độ phù hợp và soạn một buổi phỏng vấn sát với chính JD và CV này.
Ngành phải là một trong: ${CAREERS.map((c) => `${c.id} (${c.name})`).join(', ')}.
Cấp độ là "Intern" (sinh viên chưa đi làm) hoặc "Fresher" (mới tốt nghiệp, dưới 1 năm kinh nghiệm).
Soạn ĐÚNG 6 câu hỏi chính, theo trình tự của một buổi phỏng vấn thật: giới thiệu bản thân gắn với vị trí → đào sâu một kinh nghiệm hoặc dự án CỤ THỂ trong CV → kỹ năng chuyên môn JD yêu cầu → điểm JD cần mà CV còn thiếu → một tình huống thực tế trong công việc của vị trí → vì sao phù hợp với công ty.
Mỗi câu hỏi:
- "kind": "behavior" (hành vi, trả lời theo STAR), "tech" (kiến thức chuyên môn) hoặc "incident" (xử lý sự cố, tình huống khó)
- "stage": tên bước ngắn bằng tiếng Việt, tối đa 5 từ
- "vi" và "en": cùng một câu hỏi bằng tiếng Việt và tiếng Anh, tối đa 40 từ, nhắc tới chi tiết thật trong CV hoặc JD
- "kw": 6–10 từ khóa (chữ thường, cả tiếng Việt và tiếng Anh) mà câu trả lời tốt nên có
- "outline": dàn ý trả lời tốt, 1 câu tiếng Việt, các bước nối bằng "→"
- "model_vi" và "model_en": câu trả lời mẫu 60–110 từ, chỉ dùng thông tin có trong CV, không bịa thành tích
Chỉ trả về JSON hợp lệ, không thêm chữ nào khác, theo mẫu:
{"role":"tên vị trí","company":"tên công ty, để trống nếu JD không ghi","career":"it","level":"Intern","match":0,"summary":"Nhận xét 2 câu về mức độ phù hợp","strengths":["điểm CV đáp ứng JD"],"gaps":["điểm JD cần mà CV còn thiếu"],"jd_summary":"tóm tắt yêu cầu chính của JD, 1–2 câu","cv_summary":"tóm tắt CV, 1–2 câu","questions":[{"kind":"behavior","stage":"...","vi":"...","en":"...","kw":["..."],"outline":"...","model_vi":"...","model_en":"..."}]}
"match" là phần trăm phù hợp 0–100.

JD:
"""${jd.slice(0, MAX_CHARS)}"""

CV:
"""${cv.slice(0, MAX_CHARS)}"""`
}

async function aiAnalyze({ cv, jd, fallbackCareer, fallbackLevel }) {
  const data = parseJson(await chat([{ role: 'user', content: aiPrompt(cv, jd) }], 0.3))
  const plan = (data.questions || [])
    .filter((q) => q && q.vi && q.en)
    .slice(0, 8)
    .map((q) => ({
      kind: KINDS.includes(q.kind) ? q.kind : 'behavior',
      stage: q.stage || 'Câu hỏi',
      vi: q.vi,
      en: q.en,
      kw: (Array.isArray(q.kw) ? q.kw : []).map((k) => String(k).toLowerCase()).slice(0, 12),
      outline: q.outline || '',
      model: q.model_vi || q.model_en ? { vi: q.model_vi || '', en: q.model_en || '' } : undefined
    }))
  if (plan.length < 3) throw new Error('AI không soạn đủ câu hỏi.')
  const list = (x) => (Array.isArray(x) ? x.map(String).filter(Boolean).slice(0, 5) : [])
  return {
    role: data.role || guessRole(jd),
    company: data.company || '',
    careerId: CAREERS.some((c) => c.id === data.career) ? data.career : guessCareer(jd, cv, fallbackCareer),
    level: data.level === 'Intern' || data.level === 'Fresher' ? data.level : guessLevel(jd, fallbackLevel),
    match: Math.max(0, Math.min(100, Math.round(Number(data.match) || 0))),
    strengths: list(data.strengths),
    gaps: list(data.gaps),
    summary: data.summary || '',
    jdSummary: data.jd_summary || '',
    cvSummary: data.cv_summary || '',
    plan,
    mode: 'ai'
  }
}

// Trả về kết quả phân tích; nếu AI lỗi thì dùng cách so khớp từ khóa và báo lại lý do.
export async function analyzeCvJd({ cv, jd, useAi = AI_ENABLED, fallbackCareer, fallbackLevel }) {
  const input = { cv: tidy(cv), jd: tidy(jd), fallbackCareer, fallbackLevel }
  let analysis
  let warning = ''
  if (useAi) {
    try {
      analysis = await aiAnalyze(input)
    } catch (e) {
      warning = `AI chưa phân tích được (${e.message}). Đã chuyển sang phân tích theo từ khóa.`
    }
  }
  if (!analysis) {
    await new Promise((r) => setTimeout(r, 900))
    analysis = demoAnalyze(input)
  }
  // Đoạn trích gửi kèm cho người phỏng vấn AI để hỏi đào sâu đúng chi tiết.
  analysis.cvText = input.cv.slice(0, 2500)
  analysis.jdText = input.jd.slice(0, 2500)
  return { analysis, warning }
}
