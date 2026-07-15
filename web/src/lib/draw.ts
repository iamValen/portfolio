import { CANVAS, type Stroke } from '@shared'

// paint a note (paper fill + strokes) into a 2d context already scaled to the
// fixed CANVAS coordinate space. shared by the draw pad and the wall cards so
// what you draw is exactly what shows up.
export function paint(ctx: CanvasRenderingContext2D, paper: string, strokes: Stroke[]) {
  ctx.fillStyle = paper
  ctx.fillRect(0, 0, CANVAS.width, CANVAS.height)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  for (const s of strokes) {
    if (s.points.length === 0) continue
    ctx.strokeStyle = s.color
    ctx.lineWidth = s.width
    ctx.beginPath()
    ctx.moveTo(s.points[0][0], s.points[0][1])
    for (let i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i][0], s.points[i][1])
    ctx.stroke()
  }
}
