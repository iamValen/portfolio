import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import { CANVAS, LIMITS, PAPER_COLORS, PEN_COLORS, type Note, type Stroke } from '@shared'
import { cn } from '../lib/cn'
import { paint } from '../lib/draw'
import { postNote } from '../lib/notesApi'

type Props = { onPosted: (note: Note) => void }

const PEN_WIDTH = 3

export function DrawPad({ onPosted }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const strokesRef = useRef<Stroke[]>([])
  const currentRef = useRef<Stroke | null>(null)

  const [penColor, setPenColor] = useState<string>(PEN_COLORS[0])
  const [paperColor, setPaperColor] = useState<string>(PAPER_COLORS[0])
  const [author, setAuthor] = useState('')
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function redraw() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const live = currentRef.current
      ? [...strokesRef.current, currentRef.current]
      : strokesRef.current
    paint(ctx, paperColor, live)
  }

  // size the backing store once, and repaint whenever the paper changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = CANVAS.width * dpr
    canvas.height = CANVAS.height * dpr
    redraw()
  }, [paperColor])

  function pointAt(e: RPointerEvent<HTMLCanvasElement>): [number, number] {
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * CANVAS.width
    const y = ((e.clientY - rect.top) / rect.height) * CANVAS.height
    return [clamp(x, CANVAS.width), clamp(y, CANVAS.height)]
  }

  function onDown(e: RPointerEvent<HTMLCanvasElement>) {
    if (busy) return
    e.currentTarget.setPointerCapture(e.pointerId)
    currentRef.current = { color: penColor, width: PEN_WIDTH, points: [pointAt(e)] }
    redraw()
  }

  function onMove(e: RPointerEvent<HTMLCanvasElement>) {
    const cur = currentRef.current
    if (!cur) return
    const p = pointAt(e)
    const last = cur.points[cur.points.length - 1]
    if (Math.hypot(p[0] - last[0], p[1] - last[1]) < 1.2) return
    cur.points.push(p)
    redraw()
  }

  function onUp() {
    const cur = currentRef.current
    currentRef.current = null
    if (!cur) return
    // a tap is one point; nudge a twin so it renders as a dot
    if (cur.points.length === 1) cur.points.push([cur.points[0][0] + 0.1, cur.points[0][1] + 0.1])
    strokesRef.current = [...strokesRef.current, cur]
    setDirty(true)
    redraw()
  }

  function undo() {
    strokesRef.current = strokesRef.current.slice(0, -1)
    setDirty(strokesRef.current.length > 0)
    redraw()
  }

  function clear() {
    strokesRef.current = []
    currentRef.current = null
    setDirty(false)
    redraw()
  }

  async function submit() {
    if (!dirty || busy) return
    setBusy(true)
    setError(null)
    try {
      const note = await postNote({
        author: author.trim() || undefined,
        color: paperColor,
        strokes: strokesRef.current,
      })
      clear()
      setAuthor('')
      onPosted(note)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'could not post')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="drawpad">
      <canvas
        ref={canvasRef}
        className="drawpad-canvas"
        style={{ background: paperColor, aspectRatio: `${CANVAS.width} / ${CANVAS.height}` }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onPointerCancel={onUp}
      />

      <div className="drawpad-tools">
        <div className="swatches" role="group" aria-label="pen colour">
          {PEN_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={cn('swatch', penColor === c && 'swatch--on')}
              style={{ background: c }}
              onClick={() => setPenColor(c)}
              aria-label={`pen ${c}`}
            />
          ))}
        </div>

        <div className="swatches" role="group" aria-label="paper colour">
          {PAPER_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={cn('swatch', 'swatch--paper', paperColor === c && 'swatch--on')}
              style={{ background: c }}
              onClick={() => setPaperColor(c)}
              aria-label={`paper ${c}`}
            />
          ))}
        </div>

        <div className="drawpad-actions">
          <button type="button" className="pad-btn" onClick={undo} disabled={!dirty}>undo</button>
          <button type="button" className="pad-btn" onClick={clear} disabled={!dirty}>clear</button>
        </div>
      </div>

      <div className="drawpad-submit">
        <input
          className="pad-name"
          type="text"
          placeholder="name (optional)"
          value={author}
          maxLength={LIMITS.maxAuthorLen}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button type="button" className="pad-post" onClick={submit} disabled={!dirty || busy}>
          {busy ? 'sticking...' : 'stick it up'}
        </button>
      </div>

      {error && <p className="pad-error">{error}</p>}
    </div>
  )
}

function clamp(v: number, max: number): number {
  return v < 0 ? 0 : v > max ? max : v
}
