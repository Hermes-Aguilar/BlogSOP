'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/comparativa', label: 'Temario vs Prácticas' },
  { href: '/laboratorio', label: 'Laboratorio' },
  { href: '/codigo', label: 'Código' },
  { href: '/reflexion', label: 'Reflexión' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-gray-200 px-6 flex items-center gap-6 sticky top-0 z-10">
      
      {/* LOGO */}
      <Link href="/" className="font-mono text-sm font-bold flex items-center gap-1 py-4 select-none">
        <span className="text-green-600">~$</span>
        <span className="text-gray-400 font-normal"> sudo </span>
        <span className="text-gray-900">blog</span>
        <span className="inline-block w-[2px] h-4 bg-green-600 ml-0.5 cursor-blink" />
      </Link>

      <div className="flex">
        {navLinks.map((l) => {
          const isActive = pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`text-xs px-4 py-4 border-b-2 transition-colors ${
                isActive
                  ? 'border-green-600 text-green-600 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
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