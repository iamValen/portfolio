import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { useRoute } from '../hooks/useRoute'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }

export function Link({ to, children, onClick, ...rest }: Props) {
  const { navigate } = useRoute()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    onClick?.(e)
    if (e.defaultPrevented) return
    e.preventDefault()
    navigate(to)
  }

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
