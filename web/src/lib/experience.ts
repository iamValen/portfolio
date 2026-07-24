export type Experience = {
  company: string
  role: string
  period: string
  /** A brief, first-person description of what you do / own in this role. */
  description: string
  /** Technologies you use here, written like the projects' stack line. Optional. */
  stack?: string
}

export const EXPERIENCES: Experience[] = [
  {
    company: 'Deloitte',
    role: 'Junior Platform Engineer',
    period: 'Starting Sept 2026',
    description:
      "I'm joining in September 2026, my first role out of university. I'll be on the platform engineering side, so infrastructure and the tooling teams build on. I'll write up what I actually work on once I've started.",
    // stack goes here once I know what I'm working with
  },
]
