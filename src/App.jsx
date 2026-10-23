import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Stepper from './components/Stepper.jsx'
import CareerScreen from './screens/CareerScreen.jsx'
import CompanyScreen from './screens/CompanyScreen.jsx'
import SetupScreen from './screens/SetupScreen.jsx'
import LearnScreen from './screens/LearnScreen.jsx'
import InterviewScreen from './screens/InterviewScreen.jsx'
import FeedbackScreen from './screens/FeedbackScreen.jsx'
import ProgressScreen from './screens/ProgressScreen.jsx'
import { TOPICS } from './data/content.js'
import { AI_ENABLED } from './lib/aiEngine.js'
import { loadProgress, saveProgress, completeLesson, recordSession, pointsFor, resetProgress } from './lib/progress.js'

const STEP_OF = { career: 0, companies: 1, setup: 2, learn: 3, interview: 4, feedback: 5 }

export default function App() {
  const [screen, setScreen] = useState('career')
  const [progress, setProgress] = useState(loadProgress)
  const [setup, setSetup] = useState({
    careerId: 'it',
    companyId: null,
    position: 'Intern',
    topicId: 1,
    personaId: 'hr',
    language: 'en',
    timeChallenge: true,
    voice: true,
    mode: AI_ENABLED ? 'ai' : 'demo'
  })
  const [result, setResult] = useState(null)
  const [sessionKey, setSessionKey] = useState(0)

  // Hàm trong useEffect không được trả về giá trị (trừ hàm dọn dẹp).
  // Chrome bản mới cho window.scrollTo trả về Promise, nếu viết gọn
  // "() => window.scrollTo(0, 0)" thì React sẽ báo lỗi và trang bị trắng.
  useEffect(() => { saveProgress(progress) }, [progress])
  useEffect(() => { window.scrollTo(0, 0) }, [screen])

  const update = (patch) => setSetup((s) => ({ ...s, ...patch }))

  const chooseCompany = (company) => {
    const position = company.positions.includes(setup.position) ? setup.position : company.positions[0]
    update({ companyId: company.id, position, topicId: 1, personaId: TOPICS[0].defaultPersona })
    setScreen('setup')
  }

  const finishLesson = () => {
    const { progress: next } = completeLesson(progress, setup.topicId)
    setProgress(next)
    startInterview()
  }

  const startInterview = () => {
    setSessionKey((k) => k + 1)
    setScreen('interview')
  }

  const finishInterview = (evaluation) => {
    const earned = pointsFor(evaluation.overall.avg, setup.timeChallenge)
    const before = progress
    const after = recordSession(progress, {
      companyId: setup.companyId,
      topicId: setup.topicId,
      position: setup.position,
      personaId: setup.personaId,
      avg: evaluation.overall.avg,
      earned,
      mode: evaluation.mode
    })
    setProgress(after)
    setResult({ ...evaluation, earned, pointsBefore: before.points, pointsAfter: after.points })
    setScreen('feedback')
  }

  return (
    <div className="app">
      <Header
        points={progress.points}
        mode={setup.mode}
        onHome={() => setScreen('career')}
        onRoadmap={() => setScreen(setup.companyId ? 'companies' : 'career')}
        onProgress={() => setScreen('progress')}
      />
      {STEP_OF[screen] !== undefined && <Stepper current={STEP_OF[screen]} />}

      <main className="main">
        {screen === 'career' && (
          <CareerScreen
            onPick={(careerId) => { update({ careerId }); setScreen('companies') }}
          />
        )}
        {screen === 'companies' && (
          <CompanyScreen progress={progress} onPick={chooseCompany} onBack={() => setScreen('career')} />
        )}
        {screen === 'setup' && (
          <SetupScreen
            setup={setup}
            progress={progress}
            onChange={update}
            onLearn={() => setScreen('learn')}
            onSkip={startInterview}
            onBack={() => setScreen('companies')}
          />
        )}
        {screen === 'learn' && (
          <LearnScreen
            topicId={setup.topicId}
            alreadyDone={Boolean(progress.lessons[setup.topicId])}
            onDone={finishLesson}
            onBack={() => setScreen('setup')}
          />
        )}
        {screen === 'interview' && (
          <InterviewScreen
            key={sessionKey}
            setup={setup}
            onFinish={finishInterview}
            onExit={() => setScreen('setup')}
            onSwitchToDemo={() => { update({ mode: 'demo' }); setSessionKey((k) => k + 1) }}
          />
        )}
        {screen === 'feedback' && result && (
          <FeedbackScreen
            result={result}
            setup={setup}
            progress={progress}
            onRetry={startInterview}
            onNextTopic={() => {
              const next = Math.min(3, setup.topicId + 1)
              update({ topicId: next, personaId: TOPICS[next - 1].defaultPersona })
              setScreen('setup')
            }}
            onRoadmap={() => setScreen('companies')}
          />
        )}
        {screen === 'progress' && (
          <ProgressScreen
            progress={progress}
            onTogglePresenter={() => setProgress((p) => ({ ...p, presenter: !p.presenter }))}
            onReset={() => setProgress(resetProgress())}
            onBack={() => setScreen(setup.companyId ? 'companies' : 'career')}
          />
        )}
      </main>

      <footer className="footer">
        PalSpeak MVP · Dự án EXE101 · Điểm số do AI đưa ra chỉ phục vụ mục đích học tập, không phải đánh giá chính thức về năng lực tuyển dụng.
      </footer>
    </div>
  )
}
