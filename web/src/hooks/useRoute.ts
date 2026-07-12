import { useCallback, useEffect, useState } from 'react'

export function useRoute() {
  const [path, setPath] = useState(() => window.location.pathname)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.origin)
    const samePath = url.pathname === window.location.pathname

    if (!samePath) {
      window.history.pushState({}, '', url.pathname + url.hash)
      // Notify every useRoute subscriber that the path changed.
      window.dispatchEvent(new PopStateEvent('popstate'))
    }

    if (url.hash) {
      const id = url.hash.slice(1)
      const scroll = () => {
        document.getElementById(id)?.scrollIntoView({
          behavior: samePath ? 'smooth' : 'auto',
          block: 'start',
        })
      }
      if (samePath) scroll()
      else requestAnimationFrame(() => requestAnimationFrame(scroll))
    } else if (!samePath) {
      window.scrollTo(0, 0)
    }
  }, [])

  return { path, navigate }
}
