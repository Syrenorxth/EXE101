// Luồng luyện tập: ngành → doanh nghiệp → thiết lập → học trước → phỏng vấn → phản hồi.
import { useState } from 'react'
import { AppShell } from '../components/Layout.jsx'
import Stepper from '../components/Stepper.jsx'
import CareerScreen from '../screens/CareerScreen.jsx'
import CompanyScreen from '../screens/CompanyScreen.jsx'
import SetupScreen from '../screens/SetupScreen.jsx'
import LearnScreen from '../screens/LearnScreen.jsx'
import InterviewScreen from '../screens/InterviewScreen.jsx'
import FeedbackScreen from '../screens/FeedbackScreen.jsx'
import { useApp } from '../context/AppContext.jsx'
import { navigate } from '../router.jsx'
import { COMPANIES, TOPICS } from '../data/content.js'
import { AI_ENABLED } from '../lib/aiEngine.js'
import { completeLesson, recordSession, pointsFor, markStarted, saveSurvey, isCompanyUnlocked, isTopicUnlocked } from '../lib/progress.js'
import { awardBadges } from '../lib/achievements.js'
import { DEFAULT_PREFS } from '../services/auth.js'
import { newId } from '../services/storage.js'

const STEP_OF = { career: 0, companies: 1, setup: 2, learn: 3, interview: 4, feedback: 5 }
const TITLES = {
  career: ['Luyện phỏng vấn', 'Chọn ngành bạn muốn luyện'],
  companies: ['Chọn doanh nghiệp', 'Mỗi doanh nghiệp có quy trình tuyển dụng riêng'],
  setup: ['Thiết lập buổi phỏng vấn', 'Chọn vị trí, chủ đề và người phỏng vấn'],
  learn: ['Học trước khi phỏng vấn', 'Ba phút ôn lại khung trả lời'],
  interview: ['Phòng phỏng vấn', 'Hãy trả lời như đang gặp nhà tuyển dụng thật'],
  feedback: ['Kết quả buổi phỏng vấn', 'Xem lỗi từng câu và luyện lại']
}

// Đọc ?company=&topic= từ địa chỉ (từ nút "Bắt đầu" ở trang Tổng quan), chỉ nhận nội dung đã mở khóa.
function initialFrom(query, progress) {
  const company = COMPANIES.find((c) => c.id === query.company && isCompanyUnlocked(progress, c))
  if (!company) return { company: null, topicId: 1 }
  const t = Number(query.topic)
  return { company, topicId: TOPICS.some((x) => x.id === t) && isTopicUnlocked(progress, company.id, t) ? t : 1 }
}

export default function PracticePage({ query }) {
  const { user, progress, setProgress, toast } = useApp()
  const prefs = { ...DEFAULT_PREFS, ...user.prefs }
  const [init] = useState(() => initialFrom(query, progress))
  const [screen, setScreen] = useState(init.company ? 'setup' : 'career')
  const [setup, setSetup] = useState(() => {
    const position = user.position || 'Intern'
    return {
      careerId: 'it',
      companyId: init.company?.id ?? null,
      position: init.company ? (init.company.positions.includes(position) ? position : init.company.positions[0]) : position,
      topicId: init.topicId,
      personaId: TOPICS[init.topicId - 1].defaultPersona,
      language: prefs.language,
      timeChallenge: prefs.timeChallenge,
      voice: prefs.voice,
      mode: AI_ENABLED ? 'ai' : 'demo'
    }
  })
  const [result, setResult] = useState(null)
  const [sessionKey, setSessionKey] = useState(0)

  const go = (s) => {
    setScreen(s)
    window.scrollTo(0, 0)
  }
  const update = (patch) => setSetup((s) => ({ ...s, ...patch }))

  const chooseCompany = (company) => {
    const position = company.positions.includes(setup.position) ? setup.position : company.positions[0]
    update({ companyId: company.id, position, topicId: 1, personaId: TOPICS[0].defaultPersona })
    go('setup')
  }

  const startInterview = () => {
    setProgress(markStarted)
    setSessionKey((k) => k + 1)
    go('interview')
  }

  const finishLesson = () => {
    const { progress: next, earned } = completeLesson(progress, setup.topicId)
    if (earned) toast(`+${earned} điểm rèn luyện vì đã học trước`, 'success')
    setProgress(awardBadges(next).progress)
    startInterview()
  }

  const finishInterview = (evaluation) => {
    const earned = pointsFor(evaluation.overall.avg, setup.timeChallenge)
    const id = newId()
    const previous = progress.history.find((h) => h.companyId === setup.companyId && h.topicId === setup.topicId)
    const recorded = recordSession(progress, {
      id,
      companyId: setup.companyId,
      topicId: setup.topicId,
      position: setup.position,
      personaId: setup.personaId,
      language: setup.language,
      timeChallenge: setup.timeChallenge,
      spoken: evaluation.answers.some((a) => a.spoken),
      mode: evaluation.mode,
      avg: evaluation.overall.avg,
      earned,
      result: evaluation
    })
    const { progress: after, newly } = awardBadges(recorded)
    setProgress(after)
    newly.forEach((b) => toast(`Huy hiệu mới: ${b.name}`, 'badge'))
    setResult({
      ...evaluation,
      id,
      earned,
      pointsBefore: progress.points,
      pointsAfter: after.points,
      previousAvg: previous?.avg,
      newBadges: newly
    })
    go('feedback')
  }

  const [title, subtitle] = TITLES[screen]

  return (
    <AppShell title={title} subtitle={subtitle} focus={screen === 'interview'}>
      {STEP_OF[screen] !== undefined && screen !== 'interview' && <Stepper current={STEP_OF[screen]} />}

      {screen === 'career' && <CareerScreen onPick={(careerId) => { update({ careerId }); go('companies') }} />}
      {screen === 'companies' && <CompanyScreen progress={progress} onPick={chooseCompany} onBack={() => go('career')} />}
      {screen === 'setup' && (
        <SetupScreen
          setup={setup}
          progress={progress}
          onChange={update}
          onLearn={() => go('learn')}
          onSkip={startInterview}
          onBack={() => go('companies')}
        />
      )}
      {screen === 'learn' && (
        <LearnScreen
          topicId={setup.topicId}
          alreadyDone={Boolean(progress.lessons[setup.topicId])}
          onDone={finishLesson}
          onBack={() => go('setup')}
        />
      )}
      {screen === 'interview' && (
        <InterviewScreen
          key={sessionKey}
          setup={setup}
          onFinish={finishInterview}
          onExit={() => go('setup')}
          onSwitchToDemo={() => { update({ mode: 'demo' }); setSessionKey((k) => k + 1) }}
        />
      )}
      {screen === 'feedback' && result && (
        <FeedbackScreen
          result={result}
          setup={setup}
          survey={progress.history.find((h) => h.id === result.id)?.survey}
          onSurvey={(s) => { setProgress((p) => saveSurvey(p, result.id, s)); toast('Cảm ơn bạn đã góp ý!', 'success') }}
          onRetry={startInterview}
          onNextTopic={() => {
            const next = Math.min(TOPICS.length, setup.topicId + 1)
            update({ topicId: next, personaId: TOPICS[next - 1].defaultPersona })
            go('setup')
          }}
          onRoadmap={() => go('companies')}
          onHistory={() => navigate('/history')}
        />
      )}
    </AppShell>
  )
}
