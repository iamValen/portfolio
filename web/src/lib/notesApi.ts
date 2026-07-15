import type { Note, NoteInput } from '@shared'

const BASE = '/api'

export async function fetchNotes(before?: string): Promise<Note[]> {
  const url = new URL(`${BASE}/notes`, window.location.origin)
  if (before) url.searchParams.set('before', before)
  const res = await fetch(url)
  if (!res.ok) throw new Error('could not load notes')
  const data = (await res.json()) as { notes: Note[] }
  return data.notes
}

export async function postNote(input: NoteInput): Promise<Note> {
  const res = await fetch(`${BASE}/notes`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = (await res.json().catch(() => ({}))) as { note?: Note; error?: string }
  if (!res.ok || !data.note) throw new Error(data.error || 'could not post note')
  return data.note
}
