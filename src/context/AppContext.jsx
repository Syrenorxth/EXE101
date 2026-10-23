// Trạng thái dùng chung toàn app: tài khoản, tiến độ, giao diện sáng/tối, thông báo.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import * as auth from '../services/auth.js'
import { storage } from '../services/storage.js'
import { loadProgress, saveProgress } from '../lib/progress.js'

const Ctx = createContext(null)
const THEME_KEY = 'palspeak:theme'

export function AppProvider({ children }) {
  const [user, setUser] = useState(auth.currentUser)
  // Giữ tiến độ kèm id tài khoản, tránh ghi nhầm tiến độ của người này sang người khác khi đổi tài khoản.
  const [store, setStore] = useState(() => ({ userId: user?.id ?? null, data: loadProgress(user?.id) }))
  const [theme, setThemeState] = useState(() => storage.get(THEME_KEY, 'light'))
  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

  useEffect(() => { saveProgress(store.userId, store.data) }, [store])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
  }, [theme])

  const setTheme = useCallback((t) => {
    setThemeState(t)
    storage.set(THEME_KEY, t)
  }, [])

  const setProgress = useCallback((next) => {
    setStore((s) => ({ ...s, data: typeof next === 'function' ? next(s.data) : next }))
  }, [])

  const toast = useCallback((text, tone = 'info') => {
    const id = ++toastId.current
    setToasts((t) => [...t, { id, text, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }, [])

  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const signIn = useCallback((u) => {
    setUser(u)
    setStore({ userId: u.id, data: loadProgress(u.id) })
    return u
  }, [])

  const value = useMemo(() => ({
    user,
    progress: store.data,
    setProgress,
    theme,
    setTheme,
    toasts,
    toast,
    dismissToast,
    register: async (data) => signIn(await auth.register(data)),
    login: async (data) => signIn(await auth.login(data)),
    loginDemo: async (role) => signIn(await auth.loginDemo(role)),
    logout: async () => {
      await auth.logout()
      setUser(null)
      setStore({ userId: null, data: loadProgress(null) })
    },
    updateUser: async (patch) => {
      const u = await auth.updateUser(user.id, patch)
      setUser(u)
      return u
    },
    deleteAccount: async () => {
      await auth.deleteUser(user.id)
      setUser(null)
      setStore({ userId: null, data: loadProgress(null) })
    }
  }), [user, store, setProgress, theme, setTheme, toasts, toast, dismissToast, signIn])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useApp = () => useContext(Ctx)
