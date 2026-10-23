// Điều hướng theo dấu # trên địa chỉ (#/dashboard, #/history/abc...).
// Không cần thư viện ngoài, chạy được cả khi đưa lên hosting tĩnh.
import { useEffect, useState } from 'react'

function read() {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [path, qs = ''] = raw.split('?')
  return { path: path || '/', search: qs, query: Object.fromEntries(new URLSearchParams(qs)) }
}

export function navigate(to, { replace = false } = {}) {
  if (replace) window.location.replace(`#${to}`)
  else window.location.hash = to
}

export function useRoute() {
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const onChange = () => setRoute(read())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export function Link({ to, children, ...rest }) {
  return <a href={`#${to}`} {...rest}>{children}</a>
}

export function Redirect({ to }) {
  useEffect(() => { navigate(to, { replace: true }) }, [to])
  return null
}
