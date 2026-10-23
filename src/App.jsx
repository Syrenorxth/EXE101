import { useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext.jsx'
import { Toaster } from './components/Feedback.jsx'
import { useRoute, Redirect } from './router.jsx'
import LandingPage from './pages/LandingPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import PracticePage from './pages/PracticePage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import SessionPage from './pages/SessionPage.jsx'
import LibraryPage from './pages/LibraryPage.jsx'
import AchievementsPage from './pages/AchievementsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SchoolPage from './pages/SchoolPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <AppProvider>
      <Routes />
      <Toaster />
    </AppProvider>
  )
}

const homeOf = (user) => (user.role === 'school' ? '/school' : '/dashboard')

function Routes() {
  const { path, search, query } = useRoute()
  const { user } = useApp()
  const [first, second] = path.split('/').filter(Boolean)

  // Hàm trong useEffect không được trả về giá trị (trừ hàm dọn dẹp).
  // Chrome bản mới cho window.scrollTo trả về Promise, nếu viết gọn
  // "() => window.scrollTo(0, 0)" thì React sẽ báo lỗi và trang bị trắng.
  useEffect(() => { window.scrollTo(0, 0) }, [path])

  // Trang công khai
  if (!first) return <LandingPage />
  if (first === 'terms') return <TermsPage />
  if (first === 'login' || first === 'register') {
    if (user) return <Redirect to={query.next || homeOf(user)} />
    return <AuthPage mode={first} />
  }

  // Các trang còn lại cần đăng nhập
  if (!user) return <Redirect to={`/login?next=${encodeURIComponent(path)}`} />
  if (user.role === 'student' && !user.onboarded && first !== 'onboarding') return <Redirect to="/onboarding" />

  switch (first) {
    case 'onboarding': return <OnboardingPage />
    case 'dashboard': return user.role === 'school' ? <Redirect to="/school" /> : <DashboardPage />
    case 'practice': return <PracticePage key={search} query={query} />
    case 'history': return second ? <SessionPage id={second} /> : <HistoryPage />
    case 'library': return <LibraryPage tab={query.tab} />
    case 'achievements': return <AchievementsPage />
    case 'profile': return <ProfilePage />
    case 'school': return user.role === 'school' ? <SchoolPage tab={second || 'overview'} /> : <Redirect to="/dashboard" />
    default: return <NotFoundPage />
  }
}
