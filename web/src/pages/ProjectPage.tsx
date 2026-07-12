import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { PROJECTS } from '../lib/projects'
import { Link } from '../components/Link'
import { GitHubIcon, ProjectStatus } from '../components/Projects'

export function ProjectPage({ slug }: { slug: string }) {
  const project = PROJECTS.find(p => p.slug === slug)
  const index = project ? PROJECTS.indexOf(project) : -1
  const prev = index > 0 ? PROJECTS[index - 1] : null
  const next = index >= 0 && index < PROJECTS.length - 1 ? PROJECTS[index + 1] : null

  useEffect(() => {
    document.title = project ? `${project.name} - Valentim Khakhitva` : 'Not found'
    return () => { document.title = 'Valentim Khakhitva' }
  }, [project])

  if (!project) return <NotFound />

  return (
    <article className="page">
      <header className="page-head">
        <Link to="/projects" className="back-link"><span className="arrow">←</span> all projects</Link>
        <h1 className="page-title">{project.name}</h1>
        <div className="project-page-status">
          <ProjectStatus status={project.status} liveUrl={project.liveUrl} />
        </div>
        <p className="project-page-role">{project.role}</p>
        <p className="project-page-stack">{project.stack}</p>

        {project.metrics.length > 0 && (
          <ul className="metrics project-page-metrics">
            {project.metrics.map(m => (
              <li key={m.label}>
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </li>
            ))}
          </ul>
        )}

        {project.github && (
          <p className="project-page-links">
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="project-action"
            >
              <GitHubIcon />
              View on GitHub
            </a>
          </p>
        )}
      </header>

      <p className="page-lede project-page-lede">{project.excerpt}</p>

      {project.screenshots && project.screenshots.length > 0 && (
        <div className="project-screenshots">
          {project.screenshots.map((s, i) => (
            <figure key={i} className="project-screenshot">
              <img src={s.src} alt={s.alt} loading="lazy" />
              {s.caption && <figcaption>{s.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}

      {project.sections && project.sections.length > 0 ? (
        <div className="prose">
          {project.sections.map((s, i) => (
            <section key={i} className="project-section">
              <h2 className="project-section-heading">{s.heading}</h2>
              {s.body.map((p, j) => <p key={j}>{formatText(p)}</p>)}
              {s.screenshot && (
                <figure className="project-screenshot project-section-screenshot">
                  <img src={s.screenshot.src} alt={s.screenshot.alt} loading="lazy" />
                  {s.screenshot.caption && <figcaption>{s.screenshot.caption}</figcaption>}
                </figure>
              )}
            </section>
          ))}
        </div>
      ) : (
        <p className="muted">Case study in progress.</p>
      )}

      <nav className="page-pager" aria-label="Projects navigation">
        {prev
          ? <Link to={`/projects/${prev.slug}`} className="pager-link"><span className="arrow">←</span> {prev.name}</Link>
          : <span />}
        {next
          ? <Link to={`/projects/${next.slug}`} className="pager-link pager-link--next">{next.name} <span className="arrow">→</span></Link>
          : <span />}
      </nav>
    </article>
  )
}

function NotFound() {
  return (
    <article className="page">
      <header className="page-head">
        <Link to="/projects" className="back-link"><span className="arrow">←</span> all projects</Link>
        <h1 className="page-title">Project not found</h1>
        <p className="page-lede">That slug doesn't match anything.</p>
      </header>
    </article>
  )
}

// Minimal markdown-ish parser: **bold** and `code`.
function formatText(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="hl-keyword">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="hl-code">{part.slice(1, -1)}</code>
    }
    return part
  })
}
