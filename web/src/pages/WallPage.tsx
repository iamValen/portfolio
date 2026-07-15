import { useEffect, useState } from 'react'
import type { Note } from '@shared'
import { fetchNotes } from '../lib/notesApi'
import { DrawPad } from '../components/DrawPad'
import { NoteCard } from '../components/NoteCard'

const PAGE = 60

export function WallPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [loadingMore, setLoadingMore] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let alive = true
    fetchNotes()
      .then((list) => {
        if (!alive) return
        setNotes(list)
        setDone(list.length < PAGE)
        setStatus('ready')
      })
      .catch(() => {
        if (alive) setStatus('error')
      })
    return () => {
      alive = false
    }
  }, [])

  async function loadMore() {
    if (loadingMore || done || notes.length === 0) return
    setLoadingMore(true)
    try {
      const older = await fetchNotes(notes[notes.length - 1].createdAt)
      setNotes((prev) => [...prev, ...older])
      if (older.length < PAGE) setDone(true)
    } catch {
      // leave what we have; the load-more button stays available
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <section className="wall">
      <header className="wall-head">
        <h1 className="wall-title">sign the wall</h1>
        <p className="wall-lede muted">
          draw or scribble a little something and stick it up. it stays here for good.
        </p>
      </header>

      <DrawPad onPosted={(note) => setNotes((prev) => [note, ...prev])} />

      {status === 'loading' && <p className="muted wall-note">loading the wall...</p>}
      {status === 'error' && <p className="muted wall-note">the wall is napping, try again later.</p>}
      {status === 'ready' && notes.length === 0 && (
        <p className="muted wall-note">no notes yet. be the first to sign.</p>
      )}

      {notes.length > 0 && (
        <div className="wall-grid">
          {notes.map((n) => (
            <NoteCard key={n.id} note={n} />
          ))}
        </div>
      )}

      {status === 'ready' && !done && notes.length > 0 && (
        <div className="wall-more">
          <button className="pad-btn" type="button" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? 'loading...' : 'load older notes'}
          </button>
        </div>
      )}
    </section>
  )
}
