import Link from 'next/link'
import HeroBackground from './components/HeroBackground'
import RevealHeading from './components/RevealHeading'
import SpotlightCard from './components/SpotlightCard'
import FooterNav from './components/FooterNav'

const sections = [
  {
    id: '01',
    slug: '/temario',
    label: 'temario',
    title: 'Temario del curso',
    desc: 'Cada tema explicado con su descripción, código asociado y lo aprendido.',
  },
  {
    id: '02',
    slug: '/laboratorio',
    label: 'lab',
    title: 'Laboratorio de comandos',
    desc: 'Comparación de comandos entre Linux, macOS y Windows.',
  },
  {
    id: '03',
    slug: '/codigo',
    label: 'code',
    title: 'Mejoras de código',
    desc: 'Scripts de las prácticas con anotaciones y versiones mejoradas.',
  },
  {
    id: '04',
    slug: '/reflexion',
    label: 'reflect',
    title: 'Conclusión final',
    desc: 'Conclusiones sobre el aprendizaje del semestre.',
  },
  {
    id: '05',
    slug: '/contacto',
    label: 'contact',
    title: 'Contacto y créditos',
    desc: 'El equipo detrás del blog y el profesor de la materia.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen">

      {/* HERO */}
      <section className="relative h-112 flex items-end px-8 pb-14 overflow-hidden">
        <HeroBackground image="https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1400&q=80" />

        <div className="relative z-10 max-w-3xl">
          <p className="font-mono text-[11px] text-green-400 tracking-[0.25em] uppercase mb-5 flex items-center gap-2 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
            Portafolio · 6to semestre
          </p>
          <RevealHeading
            text="Sistemas Operativos"
            as="h1"
            className="text-5xl sm:text-7xl font-light text-white leading-[1.05] tracking-[-0.04em] mb-5 bg-gradient-to-br from-white via-white to-green-200 bg-clip-text text-transparent"
          />
          <p
            className="text-sm text-gray-300 leading-relaxed max-w-xl animate-fade-up"
            style={{ animationDelay: '600ms' }}
          >
            Temario del curso, prácticas con su código y salida, y conclusión final del semestre.
          </p>
        </div>
      </section>

      {/* INTRODUCCIÓN — about + stack */}
      <section className="max-w-5xl mx-auto px-8 pt-16 pb-12 grid grid-cols-1 sm:grid-cols-2 gap-12">
        <div>
          <p className="font-mono text-[11px] text-green-400 tracking-[0.2em] uppercase mb-3">
            // about
          </p>
          <h2 className="text-lg font-light text-gray-100 mb-3 tracking-tight">
            ¿Qué es este blog?
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Este portafolio documenta el trabajo realizado en la materia de
            Sistemas Operativos. Encontrarás el temario oficial con cada
            tema explicado, los códigos de las prácticas con su salida en consola, y un
            análisis de comandos entre distintos sistemas.
          </p>
        </div>

        <div>
          <p className="font-mono text-[11px] text-green-400 tracking-[0.2em] uppercase mb-3">
            // stack
          </p>
          <h2 className="text-lg font-light text-gray-100 mb-3 tracking-tight">
            Entorno de trabajo
          </h2>
          <div className="flex flex-col">
            {[
              { label: 'Sistema operativo', value: 'Parrot OS / Linux' },
              { label: 'Shell', value: 'Bash' },
              { label: 'Materia', value: 'Sistemas Operativos' },
              { label: 'Semestre', value: '6to semestre' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 text-sm py-2 border-b border-white/10 last:border-0"
              >
                <span className="font-mono text-green-400 text-[11px] w-3">$</span>
                <span className="text-gray-500 text-xs flex-1">{item.label}</span>
                <span className="text-gray-200 font-mono text-xs">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDEX CARDS */}
      <section className="max-w-5xl mx-auto px-8 pb-16">
        <p className="font-mono text-[11px] text-green-400 tracking-[0.2em] uppercase mb-6">
          // secciones
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden">
          {sections.map((s, i) => (
            <SpotlightCard
              key={s.id}
              href={s.slug}
              style={{ animationDelay: `${i * 70}ms` }}
              className="animate-fade-up group bg-[#0a0a0a] hover:bg-[#101010] p-6 transition-colors flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] text-green-400 tracking-widest uppercase">
                  {s.id} · {s.label}
                </p>
                <span className="font-mono text-[11px] text-gray-600 group-hover:text-green-400 group-hover:translate-x-1 transition-all duration-300">
                  →
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-100 leading-snug">
                {s.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
            </SpotlightCard>
          ))}

          {/* Sexta celda: imagen decorativa para no dejar el hueco vacío */}
          <div
            style={{ animationDelay: `${sections.length * 70}ms` }}
            className="animate-fade-up relative bg-[#0a0a0a] min-h-[160px] overflow-hidden"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?w=900&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
            <div className="relative z-10 h-full p-6 flex flex-col justify-end">
              <p className="font-mono text-[10px] text-green-400 tracking-widest uppercase mb-1">
                // linux · kernel
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                Todo lo que ves en este blog corre sobre systemcalls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NAV inferior */}
      <section className="max-w-5xl mx-auto px-8 pb-20">
        <FooterNav
          className="mt-0 pt-0 border-t-0"
          prevHref="/contacto"
          prevLabel="Contacto y créditos"
          nextHref="/temario"
          nextLabel="Temario del curso"
        />
      </section>

    </main>
  )
}
