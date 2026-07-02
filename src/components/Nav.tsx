import { useActiveSection } from '../hooks/useActiveSection'
import { useRoute } from '../hooks/useRoute'
import { cn } from '../lib/cn'
import { Link } from './Link'

type NavItem =
  | { kind: 'section'; id: string; label: string }
  | { kind: 'page'; to: string; match: string; label: string }

const NAV: NavItem[] = [
  { kind: 'section', id: 'about',      label: 'About' },
  { kind: 'section', id: 'experience', label: 'Experience' },
  { kind: 'page',    to: '/projects',  match: '/projects', label: 'Projects' },
  { kind: 'page',    to: '/homelab',   match: '/homelab',  label: 'HomeLab' },
  { kind: 'section', id: 'stack',      label: 'Stack' },
  { kind: 'section', id: 'education',  label: 'Education' },
]

const SECTION_IDS = NAV.flatMap(item => (item.kind === 'section' ? [item.id] : []))

export function Nav() {
  const { path } = useRoute()
  const onHome = path === '/' || path === ''
  const active = useActiveSection(onHome ? SECTION_IDS : [])

  const isPageActive = (match: string) =>
    match === '/homelab'
      ? path.startsWith('/homelab') || path.startsWith('/notes')
      : path.startsWith(match)

  return (
    <nav className="nav" aria-label="Sections">
      <div className="nav-inner">
        <Link to="/#top" className="nav-brand">vk</Link>
        <ul className="nav-list">
          {NAV.map(item =>
            item.kind === 'section' ? (
              <li key={item.id}>
                <Link
                  to={`/#${item.id}`}
                  className={cn('nav-link', onHome && active === item.id && 'nav-link--active')}
                >
                  {item.label}
                </Link>
              </li>
            ) : (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn('nav-link', isPageActive(item.match) && 'nav-link--active')}
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
    </nav>
  )
}
