import { useEffect, useState } from 'react'

export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)

  useEffect(() => {
    if (ids.length === 0) {
      setActive(null)
      return
    }
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        }
        const first = ids.find(id => visible.has(id))
        if (first) setActive(first)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [ids])

  return active
}
