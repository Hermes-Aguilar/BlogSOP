'use client'

import Link from 'next/link'
import { useRef, MouseEvent, ReactNode } from 'react'

type Props = {
  href: string
  className?: string
  style?: React.CSSProperties
  children: ReactNode
}

export default function SpotlightCard({ href, className = '', style, children }: Props) {
  const ref = useRef<HTMLAnchorElement>(null)

  const handleMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mx', `${x}%`)
    el.style.setProperty('--my', `${y}%`)
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      style={style}
      className={`spotlight-card ${className}`}
    >
      {children}
    </Link>
  )
}
