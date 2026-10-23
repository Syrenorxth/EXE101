import { AppShell } from '../components/Layout.jsx'
import { EmptyState } from '../components/Feedback.jsx'
import { Link } from '../router.jsx'

export default function NotFoundPage() {
  return (
    <AppShell title="Không tìm thấy trang">
      <div className="card">
        <EmptyState icon="search" title="Trang này không tồn tại" action={<Link to="/" className="btn btn-primary">Về trang chủ</Link>}>
          Đường dẫn có thể đã thay đổi hoặc bị gõ nhầm.
        </EmptyState>
      </div>
    </AppShell>
  )
}
