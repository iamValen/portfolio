import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as RPointerEvent } from 'react'
import type { Note } from '@shared'
import { fetchAllNotes, fetchHasPosted } from '../lib/notesApi'
import { boardHeight, scatter, CARD_W, CARD_H, type Pos } from '../lib/wallLayout'
import { DrawPad } from '../components/DrawPad'
import { NoteCard } from '../components/NoteCard'

const SIGNED_KEY = 'wall-signed'

// remember locally that you signed so the pad stays hidden on the next visit,
// even before the api answers. wrapped because storage can throw in private mode.
function readSigned(): boolean {
  try {
    return localStorage.getItem(SIGNED_KEY) === '1'
  } catch {
    return false
  }
}
function rememberSigned() {
  try {
    localStorage.setItem(SIGNED_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function WallPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [signed, setSigned] = useState<boolean>(readSigned)

  const boardRef = useRef<HTMLDivElement>(null)
  const [boardWidth, setBoardWidth] = useState(0)

  // notes the visitor has dragged, which card is lifted on top, and which one
  // is being held right now (drives the grabbing look)
  const [moved, setMoved] = useState<Record<string, Pos>>({})
  const [frontId, setFrontId] = useState<string | null>(null)
  const [heldId, setHeldId] = useState<string | null>(null)
  const drag = useRef<{ id: string; px: number; py: number; ox: number; oy: number } | null>(null)

  useEffect(() => {
    let alive = true
    fetchAllNotes()
      .then((list) => {
        if (!alive) return
        setNotes(list)
        setStatus('ready')
      })
      .catch(() => {
        if (alive) setStatus('error')
      })
    return () => {
      alive = false
    }
  }, [])

  // confirm with the server whether this ip already signed, so the pad hides
  // even on a fresh browser with no local flag
  useEffect(() => {
    let alive = true
    fetchHasPosted().then((posted) => {
      if (alive && posted) setSigned(true)
    })
    return () => {
      alive = false
    }
  }, [])

  function markSigned() {
    setSigned(true)
    rememberSigned()
  }

  // track the board width so the scatter can spread across it and reflow on resize
  useEffect(() => {
    const el = boardRef.current
    if (!el) return
    const measure = () => setBoardWidth(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const base = useMemo(() => scatter(notes.map((n) => n.id), boardWidth), [notes, boardWidth])
  // a dragged card wins over its scattered spot
  const positions = useMemo(() => ({ ...base, ...moved }), [base, moved])
  // the board is sized to the natural pile, not to wherever you've dragged
  // things, so it stays a fixed rectangle you can't drag a note out of
  const height = useMemo(() => boardHeight(base), [base])

  function onDown(id: string, e: RPointerEvent<HTMLElement>) {
    const cur = positions[id] ?? { x: 0, y: 0 }
    drag.current = { id, px: e.clientX, py: e.clientY, ox: cur.x, oy: cur.y }
    setFrontId(id)
    setHeldId(id)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onMove(e: RPointerEvent<HTMLElement>) {
    const d = drag.current
    if (!d) return
    // keep the note inside the board on both axes, no dragging off into space
    const maxX = Math.max(0, boardWidth - CARD_W)
    const maxY = Math.max(0, height - CARD_H)
    const x = Math.min(maxX, Math.max(0, d.ox + (e.clientX - d.px)))
    const y = Math.min(maxY, Math.max(0, d.oy + (e.clientY - d.py)))
    setMoved((prev) => ({ ...prev, [d.id]: { x, y } }))
  }

  function onUp() {
    drag.current = null
    setHeldId(null)
  }

  return (
    <section className="wall">
      <header className="wall-head">
        <h1 className="wall-title">sign the wall</h1>
        <p className="wall-lede muted">
          draw or scribble a little something and stick it up. one per visitor,
          and it stays here for good. drag the notes around if you like.
        </p>
      </header>

      {signed ? (
        <p className="wall-signed">
          you've signed the wall, thanks for stopping by. drag the notes around
          and find yours.
        </p>
      ) : (
        <DrawPad
          onPosted={(note) => {
            setNotes((prev) => [...prev, note])
            markSigned()
          }}
          onAlreadySigned={markSigned}
        />
      )}

      {status === 'loading' && <p className="muted wall-note">loading the wall...</p>}
      {status === 'error' && <p className="muted wall-note">the wall is napping, try again later.</p>}
      {status === 'ready' && notes.length === 0 && (
        <p className="muted wall-note">no notes yet. be the first to sign.</p>
      )}

      <div
        ref={boardRef}
        className="wall-board"
        style={{ height: notes.length ? height : undefined }}
      >
        {notes.map((n) => {
          const p = positions[n.id]
          const style: CSSProperties = {
            left: `${p?.x ?? 0}px`,
            top: `${p?.y ?? 0}px`,
            zIndex: frontId === n.id ? 1000 : undefined,
          }
          return (
            <NoteCard
              key={n.id}
              note={n}
              style={style}
              dragging={heldId === n.id}
              onPointerDown={(e) => onDown(n.id, e)}
              onPointerMove={onMove}
              onPointerUp={onUp}
            />
          )
        })}
      </div>
    </section>
  )
}
