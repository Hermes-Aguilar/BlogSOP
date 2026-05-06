import Link from 'next/link'

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
    title: 'Reflexión final',
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
      <section
        className="relative h-112 flex items-end px-8 pb-14"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1400&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/60 to-black/80" />

        <div className="relative z-10 max-w-3xl">
          <p className="font-mono text-[11px] text-green-400 tracking-[0.25em] uppercase mb-5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Portafolio · 6to semestre
          </p>
          <h1 className="text-4xl sm:text-5xl font-light text-white leading-tight tracking-tight mb-4">
            Sistemas Operativos
            <span className="block text-gray-400 mt-1">— segundo y tercer parcial</span>
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed max-w-xl">
            Temario del curso, prácticas con su código y salida, y reflexión final del semestre.
          </p>
        </div>
      </section>

      {/* INDEX CARDS */}
      <section className="max-w-5xl mx-auto px-8 py-16">
        <p className="font-mono text-[11px] text-green-400 tracking-[0.2em] uppercase mb-6">
          // secciones
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden">
          {sections.map((s) => (
            <Link
              key={s.id}
              href={s.slug}
              className="group bg-[#0a0a0a] hover:bg-[#141414] p-6 transition-colors flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] text-green-400 tracking-widest uppercase">
                  {s.id} · {s.label}
                </p>
                <span className="font-mono text-[11px] text-gray-600 group-hover:text-green-400 transition-colors">
                  →
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-100 leading-snug">
                {s.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* INTRODUCCIÓN */}
      <section className="max-w-5xl mx-auto px-8 pb-20 grid grid-cols-1 sm:grid-cols-2 gap-12">
        <div>
          <p className="font-mono text-[11px] text-green-400 tracking-[0.2em] uppercase mb-3">
            // about
          </p>
          <h2 className="text-lg font-light text-gray-100 mb-3 tracking-tight">
            ¿Qué es este blog?
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Este portafolio documenta el trabajo realizado durante el segundo y tercer parcial
            de la materia de Sistemas Operativos. Encontrarás el temario oficial con cada
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

    </main>
  )
}