export type Experience = {
  company: string
  role: string
  period: string
  /** A brief, first-person description of what you do / own in this role. */
  description: string
  /** Technologies you use here, written like the projects' stack line. */
  stack: string
}

export const EXPERIENCES: Experience[] = [
  {
    company: 'Deloitte',
    role: 'Programmer',
    period: 'Sept 2026 → Present',
    description:
      'TODO: brief description of your role here, what you build, what you own, the impact.',
    stack: 'TODO · list · the · technologies · you · use',
  },
]
