'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/temario', label: 'Temario' },
  { href: '/laboratorio', label: 'Laboratorio' },
  { href: '/codigo', label: 'Código' },
  { href: '/reflexion', label: 'Reflexión' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-black/70 backdrop-blur-md border-b border-white/10 px-8 flex items-center gap-8 sticky top-0 z-10">

      {/* LOGO */}
      <Link href="/" className="font-mono text-[13px] font-medium flex items-center gap-1 py-4 select-none">
        <span className="text-green-400">~$</span>
        <span className="text-gray-500 font-normal"> sudo </span>
        <span className="text-gray-100">blog</span>
        <span className="inline-block w-[2px] h-3.5 bg-green-400 ml-0.5 cursor-blink" />
      </Link>

      <div className="flex">
        {navLinks.map((l) => {
          const isActive = pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[11px] tracking-wide uppercase font-mono px-3 py-4 border-b transition-colors ${
                isActive
                  ? 'border-green-400 text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-100'
              }`}
            >
              {l.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}