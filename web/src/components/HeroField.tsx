import { useEffect, useRef } from 'react'

type Square = {
  x: number
  y: number
  size: number
  alpha: number
  vx: number
  vy: number
  kx: number
  ky: number
}

// neutral white squares that live behind the hero and spill out to the sides.
// they drift on their own the whole time (grouped so clusters share a slow
// direction) and get a little kick away from the cursor as it passes, which
// decays back into the drift. squares fade near the edges instead of popping.
export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const clampAlpha = (a: number) => Math.max(0.03, Math.min(0.2, a))
    const clamp01 = (a: number) => (a < 0 ? 0 : a > 1 ? 1 : a)

    // each group is an alpha band + a shared slow drift, so squares read as
    // loose clusters rather than one even blanket of noise.
    const groups = [
      { alpha: 0.17, vx: 0.09, vy: 0.05 },
      { alpha: 0.12, vx: -0.07, vy: 0.08 },
      { alpha: 0.09, vx: 0.06, vy: -0.06 },
      { alpha: 0.06, vx: -0.08, vy: -0.04 },
      { alpha: 0.13, vx: 0.04, vy: 0.09 },
      { alpha: 0.1, vx: -0.05, vy: -0.07 },
    ]

    let width = 0
    let height = 0
    let squares: Square[] = []
    const fade = 80 // px fade zone at the edges

    function build() {
      const rect = canvas!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      if (width === 0 || height === 0) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      const target = Math.max(40, Math.min(180, Math.round((width * height) / 6000)))
      const perGroup = Math.ceil(target / groups.length)

      squares = []
      for (const g of groups) {
        const ax = rand(0, width)
        const ay = rand(0, height)
        for (let j = 0; j < perGroup && squares.length < target; j++) {
          squares.push({
            x: ax + rand(-1600, 1600),
            y: ay + rand(-900, 900),
            size: rand(4, 8),
            alpha: clampAlpha(g.alpha + rand(-0.035, 0.035)),
            vx: g.vx + rand(-0.02, 0.02),
            vy: g.vy + rand(-0.02, 0.02),
            kx: 0,
            ky: 0,
          })
        }
      }
    }

    function edgeAlpha(s: Square) {
      const fx = clamp01(Math.min(s.x, width - s.x) / fade)
      const fy = clamp01(Math.min(s.y, height - s.y) / fade)
      return s.alpha * fx * fy
    }

    function paint() {
      ctx!.clearRect(0, 0, width, height)
      for (const s of squares) {
        ctx!.fillStyle = `rgba(255, 255, 255, ${edgeAlpha(s)})`
        ctx!.fillRect(s.x, s.y, s.size, s.size)
      }
    }

    build()

    const ro = new ResizeObserver(() => {
      build()
      if (reduce) paint()
    })
    ro.observe(canvas)

    // reduced motion: draw the field once, hold still, no listeners.
    if (reduce) {
      paint()
      return () => ro.disconnect()
    }

    const mouse = { x: -9999, y: -9999, active: false }
    const radius = 150

    // listen on the window so the cursor also nudges squares out in the side
    // areas, not just over the centered text column.
    const onMove = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      if (mx >= -60 && mx <= width + 60 && my >= -60 && my <= height + 60) {
        mouse.x = mx
        mouse.y = my
        mouse.active = true
      } else {
        mouse.active = false
      }
    }

    window.addEventListener('mousemove', onMove)

    let raf = 0
    let last = performance.now()

    const frame = (now: number) => {
      const dt = Math.min(32, now - last) / 16.67
      last = now
      ctx!.clearRect(0, 0, width, height)

      const wrap = 12
      for (const s of squares) {
        if (mouse.active) {
          const dx = s.x - mouse.x
          const dy = s.y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < radius * radius) {
            const d = Math.sqrt(d2) || 1
            const push = (1 - d / radius) * 0.7
            s.kx += (dx / d) * push
            s.ky += (dy / d) * push
          }
        }

        s.kx *= 0.9
        s.ky *= 0.9
        s.x += (s.vx + s.kx) * dt
        s.y += (s.vy + s.ky) * dt

        if (s.x < -wrap) s.x += width + wrap * 2
        else if (s.x > width + wrap) s.x -= width + wrap * 2
        if (s.y < -wrap) s.y += height + wrap * 2
        else if (s.y > height + wrap) s.y -= height + wrap * 2

        ctx!.fillStyle = `rgba(255, 255, 255, ${edgeAlpha(s)})`
        ctx!.fillRect(s.x, s.y, s.size, s.size)
      }

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-field" aria-hidden="true" />
}
