'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/temario', label: 'Temario' },
  { href: '/laboratorio', label: 'Laboratorio' },
  { href: '/codigo', label: 'Practicas' },
  { href: '/reflexion', label: 'Conclusiones' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-black/70 backdrop-blur-md border-b border-white/10 px-10 flex items-center gap-10 sticky top-0 z-10">

      {/* LOGO */}
      <Link href="/" className="font-mono text-[16px] font-medium flex items-center gap-1.5 py-6 select-none">
        <span className="text-green-400">~$</span>
        <span className="text-gray-500 font-normal"> sudo </span>
        <span className="text-gray-100">blog</span>
        <span className="inline-block w-[2px] h-4 bg-green-400 ml-1 cursor-blink" />
      </Link>

      <div className="flex">
        {navLinks.map((l) => {
          const isActive = pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[13px] tracking-wide uppercase font-mono px-5 py-6 border-b-2 transition-colors ${
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