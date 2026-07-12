import { useEffect } from 'react'
import { NOTES, type Note } from '../lib/notes'
import { Link } from '../components/Link'

export function NotePage({ slug }: { slug: string }) {
  const note = NOTES.find(n => n.slug === slug)
  const index = note ? NOTES.indexOf(note) : -1
  const prev = index > 0 ? NOTES[index - 1] : null
  const next = index >= 0 && index < NOTES.length - 1 ? NOTES[index + 1] : null

  useEffect(() => {
    document.title = note ? `${note.title} - Lab Notes` : 'Not found'
    return () => { document.title = 'Valentim Khakhitva' }
  }, [note])

  if (!note) return <NotFound />

  return (
    <article className="page">
      <header className="page-head">
        <Link to="/homelab#notes" className="back-link"><span className="arrow">←</span> all notes</Link>
        <div className="note-meta">
          <time className="note-date" dateTime={note.date}>
            {formatDate(note.date)}
          </time>
          <ul className="note-tags">
            {note.tags.map(t => <li key={t}>{t}</li>)}
          </ul>
        </div>
        <h1 className="page-title">{note.title}</h1>
        <p className="page-lede">{note.excerpt}</p>
      </header>

      <div className="prose">
        {note.body?.length
          ? note.body.map((p, i) => <p key={i}>{p}</p>)
          : <p className="muted">This one's still in draft.</p>}
      </div>

      <nav className="page-pager" aria-label="Notes navigation">
        {prev
          ? <Link to={`/notes/${prev.slug}`} className="pager-link"><span className="arrow">←</span> {prev.title}</Link>
          : <span />}
        {next
          ? <Link to={`/notes/${next.slug}`} className="pager-link pager-link--next">{next.title} <span className="arrow">→</span></Link>
          : <span />}
      </nav>
    </article>
  )
}

function NotFound() {
  return (
    <article className="page">
      <header className="page-head">
        <Link to="/homelab#notes" className="back-link"><span className="arrow">←</span> all notes</Link>
        <h1 className="page-title">Note not found</h1>
        <p className="page-lede">That slug doesn't match anything in the lab notes.</p>
      </header>
    </article>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' })
}

// Keep types reachable for tooling that follows imports.
export type { Note }
