// types and limits shared by the web app and the notes api. one source of
// truth so the wire format can't quietly drift between the two sides.

export type Point = [number, number] // [x, y] in canvas coordinates

export type Stroke = {
  color: string
  width: number
  points: Point[]
}

export type NoteInput = {
  author?: string
  color: string // sticky paper colour, one of PAPER_COLORS
  strokes: Stroke[]
}

export type Note = NoteInput & {
  id: string
  createdAt: string // ISO
}

// fixed drawing surface. the pad draws at this size and the wall renders from
// it, so every note scales the same way no matter the screen.
export const CANVAS = { width: 280, height: 260 }

// paper colours for the note itself. muted so a wall of them still reads calm
// against the dark site.
export const PAPER_COLORS = ['#f4e9c1', '#e7d4f0', '#cfe8d7', '#d6e4f0', '#f0d9d3'] as const

// pen colours offered in the pad
export const PEN_COLORS = ['#1a1a1a', '#2f6fb0', '#b04a3f', '#3f7d4f'] as const

// guard rails so one note can't be enormous or used to hammer the server
export const LIMITS = {
  maxStrokes: 400,
  maxPointsPerStroke: 600,
  maxTotalPoints: 5000,
  maxAuthorLen: 40,
  maxStrokeWidth: 24,
}
