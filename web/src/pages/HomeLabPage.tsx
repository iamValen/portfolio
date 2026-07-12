import { useEffect } from 'react'
import { SERVICE_GROUPS } from '../lib/services'
import { NOTES } from '../lib/notes'
import { Link } from '../components/Link'

export function HomeLabPage() {
  useEffect(() => {
    document.title = 'HomeLab - Valentim Khakhitva'
    return () => { document.title = 'Valentim Khakhitva' }
  }, [])

  return (
    <article className="page">
      <header className="page-head">
        <Link to="/#homelab" className="back-link"><span className="arrow">←</span> back to portfolio</Link>
        <h1 className="page-title">HomeLab</h1>
        <div className="status-line">
          <span className="status-dot" />
          <span>online</span>
          <span className="status-sep">·</span>
          <span>running since June 2023</span>
        </div>
        <p className="page-lede">
          The place I try every infra idea before it touches anything that
          matters. Production-shaped operations on a small budget, documented
          as I go.
        </p>
      </header>

      <div className="prose">
        <p>
          The lab is built to mirror how real infrastructure behaves: a
          locked-down network at the edge, services running as isolated
          stacks, and state I can rebuild from backups. Nothing here is
          critical, which is exactly why it's the right place to break things
          and learn the recovery.
        </p>
      </div>

      <h2 className="subhead">Services</h2>
      <div className="grid">
        {SERVICE_GROUPS.map(group => (
          <article key={group.name} className="card">
            <h3 className="card-title">{group.name}</h3>
            {group.blurb && <p className="card-blurb">{group.blurb}</p>}
            <ul className="list">
              {group.services.map(s => (
                <li key={s.name}>
                  <b className="service-name">
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
                  </b>{' '}
                  {s.what}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <h2 className="subhead">Roadmap</h2>
      <ul className="list checklist">
        <li>Centralised log aggregation</li>
        <li>Infrastructure-as-code for the compose stacks</li>
        <li>CI pipeline that deploys to the lab on tag</li>
        <li>Secrets management beyond .env files</li>
      </ul>

      <section id="notes" className="homelab-notes">
        <h2 className="subhead">Lab Notes</h2>
        <p className="page-lede page-lede--tight">
          Writeups from the lab - outages, lessons, the rule of thumb I wish
          I'd had before.
        </p>
        <ul className="notes">
          {NOTES.map(n => (
            <li key={n.slug} className="note">
              <Link to={`/notes/${n.slug}`} className="note-head note-head--link">
                <div className="note-meta">
                  <time className="note-date" dateTime={n.date}>
                    {formatDate(n.date)}
                  </time>
                  <ul className="note-tags">
                    {n.tags.map(t => <li key={t}>{t}</li>)}
                  </ul>
                </div>
                <h3 className="note-title">{n.title}</h3>
                <p className="note-excerpt">{n.excerpt}</p>
                <span className="note-toggle">read <span className="arrow">→</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' })
}
