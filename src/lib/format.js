// Định dạng ngày giờ, số theo kiểu Việt Nam.
export const fmtDate = (iso) => new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
export const fmtDateTime = (iso) => new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
export const fmtShort = (iso) => {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function fromNow(iso) {
  const start = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const days = Math.round((start(new Date()) - start(new Date(iso))) / 86400000)
  if (days <= 0) return 'Hôm nay'
  if (days === 1) return 'Hôm qua'
  if (days < 30) return `${days} ngày trước`
  return fmtDate(iso)
}

export function daysUntil(dateStr) {
  if (!dateStr) return null
  const target = new Date(`${dateStr}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target - today) / 86400000)
}

export function greeting() {
  const h = new Date().getHours()
  if (h < 11) return 'Chào buổi sáng'
  if (h < 14) return 'Chào buổi trưa'
  if (h < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

// Tên gọi: chữ cuối trong họ tên tiếng Việt.
export const givenName = (name = '') => name.trim().split(/\s+/).pop() || name

export const score1 = (v) => (v === null || v === undefined ? '–' : v.toFixed(1))

export function downloadFile(name, content, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function toCsv(rows) {
  const esc = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`
  return '﻿' + rows.map((r) => r.map(esc).join(',')).join('\n')
}
