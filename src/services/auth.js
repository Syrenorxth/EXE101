// Tài khoản giả lập: lưu danh sách người dùng ngay trên trình duyệt.
// Các hàm trả về Promise giống như gọi API thật, để sau này thay bằng
// fetch('/api/auth/...') mà không phải sửa giao diện.
// LƯU Ý: đây chỉ là bản mô phỏng. Bản thật phải xác thực và băm mật khẩu ở máy chủ.
import { storage, newId, delay } from './storage.js'
import { saveProgress, removeProgress } from '../lib/progress.js'
import { seedDemoProgress } from './demoSeed.js'

const USERS = 'palspeak:users'
const SESSION = 'palspeak:session'

export const DEFAULT_PREFS = { language: 'en', voice: true, timeChallenge: true }

// Tăng số này mỗi khi sửa thông tin hoặc dữ liệu mẫu của tài khoản demo:
// trình duyệt đã có tài khoản demo cũ sẽ được cập nhật ở lần vào demo tiếp theo.
const DEMO_VERSION = 2

export const DEMO_ACCOUNTS = {
  student: {
    email: 'demo.sinhvien@palspeak.vn',
    name: 'Trần Hà Minh',
    role: 'student',
    school: 'Đại học FPT',
    major: 'Kỹ thuật phần mềm',
    year: 'Năm 4',
    position: 'Fresher',
    target: 'Thực tập fullstack',
    classCode: 'KTPM-K18'
  },
  school: {
    email: 'demo.nhatruong@palspeak.vn',
    name: 'Trần Thu Hà',
    role: 'school',
    school: 'Đại học FPT',
    title: 'Trưởng phòng Hỗ trợ việc làm & Quan hệ doanh nghiệp'
  }
}

// Băm đơn giản (FNV-1a) để không lưu mật khẩu dạng chữ thường. Không dùng cho bản thật.
function hash(text) {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(16)
}

const readUsers = () => storage.get(USERS, [])
const writeUsers = (users) => storage.set(USERS, users)
const publicUser = (u) => {
  if (!u) return null
  const { passwordHash, ...rest } = u
  return rest
}
const normalize = (email) => email.trim().toLowerCase()

export function listUsers() {
  return readUsers().map(publicUser)
}

export function currentUser() {
  const id = storage.get(SESSION, null)
  return publicUser(readUsers().find((u) => u.id === id))
}

function createUser(data, password) {
  const user = {
    id: newId(),
    createdAt: new Date().toISOString(),
    prefs: { ...DEFAULT_PREFS },
    onboarded: data.role === 'school',
    ...data,
    email: normalize(data.email),
    passwordHash: password ? hash(password) : null
  }
  writeUsers([...readUsers(), user])
  return user
}

export async function register({ name, email, password, role }) {
  await delay()
  if (!name.trim()) throw new Error('Vui lòng nhập họ tên.')
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Email chưa đúng định dạng.')
  if (password.length < 6) throw new Error('Mật khẩu cần ít nhất 6 ký tự.')
  if (readUsers().some((u) => u.email === normalize(email))) throw new Error('Email này đã được đăng ký. Hãy đăng nhập.')
  const user = createUser({ name: name.trim(), email, role }, password)
  storage.set(SESSION, user.id)
  return publicUser(user)
}

export async function login({ email, password }) {
  await delay()
  const user = readUsers().find((u) => u.email === normalize(email))
  if (!user || !user.passwordHash || user.passwordHash !== hash(password)) {
    throw new Error('Email hoặc mật khẩu không đúng.')
  }
  storage.set(SESSION, user.id)
  return publicUser(user)
}

// Vào nhanh bằng tài khoản demo (không cần mật khẩu), dùng khi trình bày.
export async function loginDemo(role) {
  await delay(300)
  const demo = DEMO_ACCOUNTS[role]
  const users = readUsers()
  let user = users.find((u) => u.email === demo.email)
  if (!user) {
    user = createUser({ ...demo, onboarded: true, demo: true, demoVersion: DEMO_VERSION }, null)
    if (role === 'student') saveProgress(user.id, seedDemoProgress())
  } else if (user.demoVersion !== DEMO_VERSION) {
    Object.assign(user, demo, { demoVersion: DEMO_VERSION })
    writeUsers(users)
    if (role === 'student') saveProgress(user.id, seedDemoProgress())
  }
  storage.set(SESSION, user.id)
  return publicUser(user)
}

export async function logout() {
  storage.remove(SESSION)
}

export async function updateUser(id, patch) {
  await delay(250)
  const users = readUsers()
  const i = users.findIndex((u) => u.id === id)
  if (i < 0) throw new Error('Không tìm thấy tài khoản.')
  if (patch.email && users.some((u) => u.id !== id && u.email === normalize(patch.email))) {
    throw new Error('Email này đã được tài khoản khác sử dụng.')
  }
  users[i] = { ...users[i], ...patch, ...(patch.email ? { email: normalize(patch.email) } : {}) }
  writeUsers(users)
  return publicUser(users[i])
}

export async function deleteUser(id) {
  await delay(250)
  writeUsers(readUsers().filter((u) => u.id !== id))
  removeProgress(id)
  storage.remove(SESSION)
}
