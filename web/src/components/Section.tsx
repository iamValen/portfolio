import type { ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'
import { cn } from '../lib/cn'

type Props = {
  id: string
  title: string
  children: ReactNode
}

export function Section({ id, title, children }: Props) {
  const { ref, shown } = useReveal<HTMLElement>()
  return (
    <section
      id={id}
      ref={ref}
      className={cn('section', shown && 'section--shown')}
    >
      <h2 className="section-title">{title}</h2>
      <div className="section-body">{children}</div>
    </section>
  )
}
