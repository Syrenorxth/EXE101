// Lớp lưu trữ dùng chung. Bản hiện tại lưu trên trình duyệt (localStorage);
// khi có máy chủ thật chỉ cần thay các dịch vụ trong thư mục services/.
export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? fallback : JSON.parse(raw)
    } catch {
      return fallback
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Trình duyệt chặn lưu trữ: bỏ qua, app vẫn chạy trong phiên hiện tại.
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch {
      // bỏ qua
    }
  }
}

export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

// Giả lập độ trễ mạng để giao diện có trạng thái "đang tải" giống bản thật.
export const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms))
