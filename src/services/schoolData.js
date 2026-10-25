// Dữ liệu cho trang Nhà trường (B2B).
// - sampleCohort(): dữ liệu MẪU của một khóa sinh viên, sinh cố định theo hạt giống
//   để mỗi lần mở đều giống nhau. Bản thật sẽ lấy từ máy chủ theo mã lớp.
// - pilotMetrics(): chỉ số thử nghiệm MVP tính từ dữ liệu THẬT trên trình duyệt này.
import { TOPICS } from '../data/content.js'
import { loadProgress, doneKey } from '../lib/progress.js'
import { listUsers } from './auth.js'
import { storage, newId } from './storage.js'

function rng(seed) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const LAST = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Ngô', 'Dương', 'Lý']
const MIDDLE = ['Minh', 'Thu', 'Văn', 'Thị', 'Đức', 'Ngọc', 'Quang', 'Hải', 'Gia', 'Thanh', 'Bảo', 'Khánh']
const FIRST = ['Khoa', 'Hà', 'An', 'Linh', 'Nam', 'Trang', 'Huy', 'Mai', 'Long', 'Vy', 'Phúc', 'Hương', 'Tuấn', 'Dũng', 'Thảo', 'Bình', 'Quân', 'Ngân', 'Sơn', 'Yến']

const CLASS_KEY = 'palspeak:school-classes'
const DEFAULT_CLASSES = [
  { id: 'c1', code: 'KTPM-K18', name: 'Kỹ thuật phần mềm K18', size: 48 },
  { id: 'c2', code: 'MKT-K18', name: 'Digital Marketing K18', size: 52 },
  { id: 'c3', code: 'TCNH-K18', name: 'Tài chính – Ngân hàng K18', size: 40 },
  { id: 'c4', code: 'QTKD-K18', name: 'Quản trị kinh doanh K18', size: 44 }
]

export function loadClasses() {
  return storage.get(CLASS_KEY, DEFAULT_CLASSES)
}

export function addClass(name, size) {
  const code = `PS-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const next = [...loadClasses(), { id: newId(), code, name, size }]
  storage.set(CLASS_KEY, next)
  return next
}

let cache = null

export function sampleCohort() {
  if (cache) return cache
  const r = rng(2026)
  const pick = (arr) => arr[Math.floor(r() * arr.length)]
  const students = []
  DEFAULT_CLASSES.forEach((c) => {
    for (let i = 0; i < c.size; i++) {
      const activated = r() < 0.82
      const sessions = activated ? Math.floor(r() * 11) : 0
      const base = 4.2 + r() * 3.6
      const gain = sessions > 1 ? Math.min(1.8, sessions * 0.18) : 0
      const crit = {
        relevance: Math.min(9.6, base + gain + r() * 0.8),
        clarity: Math.min(9.6, base + gain + (r() - 0.5)),
        structure: Math.min(9.6, base + gain - 0.4 + r() * 0.6)
      }
      const avg = (crit.relevance + crit.clarity + crit.structure) / 3
      students.push({
        id: `${c.code}-${i + 1}`,
        name: `${pick(LAST)} ${pick(MIDDLE)} ${pick(FIRST)}`,
        classCode: c.code,
        activated,
        sessions,
        avg: sessions ? avg : null,
        criteria: sessions ? crit : null,
        topics: sessions ? Math.min(TOPICS.length, Math.ceil(sessions / 3)) : 0,
        lastActive: activated ? Math.floor(r() * (sessions ? 14 : 30)) : null
      })
    }
  })
  const weeks = Array.from({ length: 8 }, (_, i) => ({
    label: `T${i + 1}`,
    value: Math.round(40 + i * 22 + r() * 30)
  }))
  cache = { students, weeks }
  return cache
}

export function weakestOf(criteria) {
  if (!criteria) return null
  return Object.entries(criteria).sort((a, b) => a[1] - b[1])[0][0]
}

// ---------- Chỉ số thử nghiệm MVP (mục 8 của tài liệu MVP) ----------
export function pilotMetrics() {
  const students = listUsers().filter((u) => u.role === 'student')
  let started = 0
  let finished = 0
  let active = 0
  let returning = 0
  const gains = []
  const surveys = []
  for (const u of students) {
    const p = loadProgress(u.id)
    const real = p.history.filter((h) => !h.sample)
    started += p.started || 0
    finished += real.length
    if (real.length >= 1) active += 1
    if (real.length >= 2) returning += 1
    const groups = {}
    for (const h of [...real].reverse()) (groups[doneKey(h.companyId, h.topicId)] ||= []).push(h.avg)
    Object.values(groups).forEach((g) => { if (g.length >= 2) gains.push(g[1] - g[0]) })
    real.forEach((h) => { if (h.survey) surveys.push(h.survey) })
  }
  const pct = (a, b) => (b ? (a / b) * 100 : null)
  return {
    students: students.length,
    finished,
    surveys: surveys.length,
    completion: pct(finished, started),
    returning: pct(returning, active),
    gain: gains.length ? gains.reduce((s, x) => s + x, 0) / gains.length : null,
    helpful: pct(surveys.filter((s) => s.helpful >= 4).length, surveys.length),
    realism: pct(surveys.filter((s) => s.realism >= 4).length, surveys.length)
  }
}
