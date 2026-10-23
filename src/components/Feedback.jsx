// Thông báo nổi (toast) và hộp xác nhận dùng chung.
import { useEffect } from 'react'
import Icon from './Icons.jsx'
import Mascot from './Mascot.jsx'
import { useApp } from '../context/AppContext.jsx'

const TOAST_ICON = { info: 'info', success: 'check', warn: 'alert', badge: 'award' }

export function Toaster() {
  const { toasts, dismissToast } = useApp()
  return (
    <div className="toaster" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.tone}`}>
          <Icon name={TOAST_ICON[t.tone] || 'info'} />
          <span>{t.text}</span>
          <button className="icon-btn" onClick={() => dismissToast(t.id)} aria-label="Đóng thông báo">
            <Icon name="x" size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}

export function Modal({ open, title, children, onClose, footer }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng"><Icon name="x" /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  )
}

export function Confirm({ open, title, body, confirmLabel = 'Xác nhận', danger = false, onConfirm, onClose }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Hủy</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</button>
        </>
      }
    >
      <p>{body}</p>
    </Modal>
  )
}

export function EmptyState({ icon = 'info', mascot = false, title, children, action }) {
  return (
    <div className="empty">
      {mascot ? <Mascot size={110} /> : <span className="empty-icon"><Icon name={icon} size={26} /></span>}
      <h3>{title}</h3>
      {children && <p className="muted">{children}</p>}
      {action}
    </div>
  )
}
