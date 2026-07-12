import { PROJECTS, type Project } from '../lib/projects'
import { Section } from './Section'
import { Link } from './Link'
import { cn } from '../lib/cn'

export function Projects() {
  return (
    <Section id="projects" title="Projects">
      {PROJECTS.map(p => <ProjectCard key={p.slug} project={p} />)}

      <p className="projects-more">
        More on{' '}
        <a href="https://github.com/iamValen" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </p>
    </Section>
  )
}

export function ProjectStatus({ status, liveUrl }: { status: Project['status']; liveUrl?: string }) {
  const badge = (
    <span className={cn('project-status', `project-status--${status}`)}>
      <span className="project-status-dot" aria-hidden="true" />
      {status === 'online' ? 'Online' : 'Offline'}
    </span>
  )

  if (status === 'online' && liveUrl) {
    return (
      <a href={liveUrl} target="_blank" rel="noreferrer" className="project-status-link">
        {badge}
      </a>
    )
  }
  return badge
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project">
      {project.thumbnail && (
        <Link
          to={`/projects/${project.slug}`}
          className="project-thumb"
          aria-label={`Open ${project.name}`}
        >
          <img src={project.thumbnail} alt="" loading="lazy" />
        </Link>
      )}

      <header className="project-head">
        <div className="project-title-row">
          <h3 className="project-name">{project.name}</h3>
          <ProjectStatus status={project.status} liveUrl={project.liveUrl} />
        </div>
        <p className="project-role">{project.role}</p>
      </header>

      <p className="project-desc">{project.excerpt}</p>

      <footer className="project-foot">
        <p className="project-stack">{project.stack}</p>
        <ul className="metrics">
          {project.metrics.map(m => (
            <li key={m.label}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </li>
          ))}
        </ul>
      </footer>

      <div className="project-actions">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="project-action"
          >
            <GitHubIcon />
            Source
          </a>
        )}
        <Link to={`/projects/${project.slug}`} className="project-action project-action--primary">
          Read more
          <span aria-hidden="true" className="arrow">→</span>
        </Link>
      </div>
    </article>
  )
}

export function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="project-action-icon" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
      />
    </svg>
  )
}
