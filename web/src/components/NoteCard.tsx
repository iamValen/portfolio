import { useEffect, useRef, type CSSProperties } from 'react'
import { CANVAS, type Note } from '@shared'
import { paint } from '../lib/draw'

export function NoteCard({ note }: { note: Note }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = CANVAS.width * dpr
    canvas.height = CANVAS.height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    paint(ctx, note.color, note.strokes)
  }, [note])

  const style = { '--tilt': `${tiltFor(note.id)}deg` } as CSSProperties

  return (
    <figure className="wall-card" style={style}>
      <canvas
        ref={canvasRef}
        className="wall-canvas"
        style={{ aspectRatio: `${CANVAS.width} / ${CANVAS.height}` }}
        aria-label={note.author ? `note by ${note.author}` : 'a note'}
      />
      <figcaption className="wall-card-meta">
        <span className="wall-card-author">{note.author || 'anonymous'}</span>
        <span className="wall-card-date">{formatDate(note.createdAt)}</span>
      </figcaption>
    </figure>
  )
}

// small, stable tilt derived from the id so a card keeps the same angle across
// re-renders instead of jittering.
function tiltFor(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return (Math.abs(h) % 100) / 100 * 6 - 3
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
