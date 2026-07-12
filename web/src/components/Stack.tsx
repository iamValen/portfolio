import { useEffect, useState } from 'react'
import { SKILLS } from '../lib/skills'
import { PROJECTS } from '../lib/projects'
import { cn } from '../lib/cn'
import { Section } from './Section'
import { Link } from './Link'
import { useReveal } from '../hooks/useReveal'

const CYCLE_MS = 3500
const FADE_MS = 220

// Where a "learned this in" source points to. Project names resolve to their
// project page; HomeLab jumps to its section. Anything else stays plain text.
const WHERE_LINKS: Record<string, string> = {
  HomeLab: '/#homelab',
  ...Object.fromEntries(PROJECTS.map(p => [p.name, `/projects/${p.slug}`])),
}

export function Stack() {
  const { ref, shown: inView } = useReveal<HTMLUListElement>()
  const [activeIdx, setActiveIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const [display, setDisplay] = useState(SKILLS[0])
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (paused || !inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setActiveIdx(i => (i + 1) % SKILLS.length)
    }, CYCLE_MS)
    return () => window.clearInterval(id)
  }, [paused, inView])

  useEffect(() => {
    const target = SKILLS[activeIdx]
    if (target.name === display.name) return
    setFading(true)
    const t = window.setTimeout(() => {
      setDisplay(target)
      setFading(false)
    }, FADE_MS)
    return () => window.clearTimeout(t)
  }, [activeIdx, display.name])

  const pick = (i: number) => {
    setPaused(true)
    setActiveIdx(i)
  }

  return (
    <Section id="stack" title="Stack">
      <ul className="tags" ref={ref}>
        {SKILLS.map((s, i) => (
          <li key={s.name}>
            <button
              type="button"
              className={cn('tag', i === activeIdx && 'tag--active')}
              onClick={() => pick(i)}
              aria-pressed={i === activeIdx}
            >
              {s.icon && (
                <img
                  src={`https://cdn.simpleicons.org/${s.icon}/e6ebf2`}
                  alt=""
                  className="tag-icon"
                  width={14}
                  height={14}
                  loading="lazy"
                />
              )}
              {s.name}
            </button>
          </li>
        ))}
      </ul>

      <div className={cn('usage', fading && 'usage--out')}>
        <h3 className="usage-title">
          {display.icon && (
            <img
              src={`https://cdn.simpleicons.org/${display.icon}/e6ebf2`}
              alt=""
              className="usage-icon"
              width={18}
              height={18}
            />
          )}
          {display.name}
        </h3>
        <ul className="usage-list">
          {display.uses.map((u, i) => {
            const to = WHERE_LINKS[u.where]
            return (
              <li key={i}>
                {to ? (
                  <Link to={to} className="usage-where usage-where--link">
                    {u.where}
                  </Link>
                ) : (
                  <span className="usage-where">{u.where}</span>
                )}
                <span className="usage-sep">·</span>
                <span className="usage-what">{u.what}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}
