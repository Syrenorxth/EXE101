// Xem lại kết quả chi tiết của một buổi phỏng vấn đã lưu.
import { AppShell } from '../components/Layout.jsx'
import FeedbackScreen from '../screens/FeedbackScreen.jsx'
import { EmptyState } from '../components/Feedback.jsx'
import Icon from '../components/Icons.jsx'
import { Link, navigate } from '../router.jsx'
import { useApp } from '../context/AppContext.jsx'
import { COMPANIES, PERSONAS, TOPICS } from '../data/content.js'
import { saveSurvey } from '../lib/progress.js'
import { fmtDateTime } from '../lib/format.js'

export default function SessionPage({ id }) {
  const { progress, setProgress, toast } = useApp()
  const entry = progress.history.find((h) => h.id === id)

  if (!entry || !entry.result) {
    return (
      <AppShell title="Không tìm thấy buổi phỏng vấn">
        <div className="card">
          <EmptyState icon="search" title="Buổi phỏng vấn này không còn trong lịch sử" action={<Link to="/history" className="btn btn-primary">Về lịch sử</Link>}>
            Lịch sử chỉ giữ 50 buổi gần nhất trên trình duyệt này.
          </EmptyState>
        </div>
      </AppShell>
    )
  }

  const company = COMPANIES.find((c) => c.id === entry.companyId)
  const topic = TOPICS.find((t) => t.id === entry.topicId)
  const older = progress.history.slice(progress.history.indexOf(entry) + 1).find((h) => h.companyId === entry.companyId && h.topicId === entry.topicId)

  return (
    <AppShell
      title={`${company?.name} · Chủ đề ${entry.topicId}`}
      subtitle={`${fmtDateTime(entry.at)} · ${topic?.name} · ${PERSONAS[entry.personaId]?.name}${entry.sample ? ' · Buổi mẫu' : ''}`}
      actions={<Link to="/history" className="btn btn-ghost small hide-xs"><Icon name="arrowLeft" size={16} /> Lịch sử</Link>}
    >
      <FeedbackScreen
        readOnly
        result={{ ...entry.result, earned: entry.earned, previousAvg: older?.avg }}
        setup={{ language: entry.language || 'en', topicId: entry.topicId }}
        survey={entry.survey}
        onSurvey={entry.sample ? null : (s) => { setProgress((p) => saveSurvey(p, entry.id, s)); toast('Cảm ơn bạn đã góp ý!', 'success') }}
        onRetry={() => navigate(`/practice?company=${entry.companyId}&topic=${entry.topicId}`)}
        onHistory={() => navigate('/history')}
      />
    </AppShell>
  )
}
