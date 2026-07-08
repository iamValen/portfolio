import { useEffect } from 'react'
import { PROJECTS } from '../lib/projects'
import { ProjectCard } from '../components/Projects'
import { Link } from '../components/Link'

export function ProjectsPage() {
  useEffect(() => {
    document.title = 'Projects - Valentim Khakhitva'
    return () => { document.title = 'Valentim Khakhitva' }
  }, [])

  return (
    <article className="page">
      <header className="page-head">
        <Link to="/#top" className="back-link"><span className="arrow">←</span> back to portfolio</Link>
        <h1 className="page-title">Projects</h1>
        <p className="page-lede">
          Things I've built, each with its own case study.
        </p>
      </header>

      <div className="projects-list">
        {PROJECTS.map(p => <ProjectCard key={p.slug} project={p} />)}
      </div>

      <p className="projects-more">
        More on{' '}
        <a href="https://github.com/iamValen" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </p>
    </article>
  )
}
