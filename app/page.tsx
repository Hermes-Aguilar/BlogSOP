import Link from 'next/link'

const sections = [
  {
    id: '01',
    slug: '/comparativa',
    label: 'compare',
    title: 'Temario vs prácticas',
    desc: 'Qué se planeó y qué se hizo realmente en cada parcial.',
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
]

export default function Home() {
  return (
    <main className="min-h-screen">

      {/* HERO CON IMAGEN */}
      <section
        className="relative h-80 flex items-end px-8 pb-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1400&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay oscuro para que el texto se lea */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Texto encima */}
        <div className="relative z-10">
          <p className="font-mono text-xs text-green-400 tracking-widest uppercase mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            Portafolio de evidencias ·  6to semestre
          </p>
          <h1 className="text-3xl font-medium text-white leading-snug mb-2">
            Sistemas Operativos<br />
            — segundo y tercer parcial
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed max-w-lg">
            Documentación comparativa entre el plan de estudios oficial y las prácticas realizadas.
          </p>
        </div>
      </section>

      {/* INDEX CARDS */}
      <section className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
        {sections.map((s) => (
          <Link
            key={s.id}
            href={s.slug}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-400 transition-colors group"
          >
            <p className="font-mono text-xs text-green-600 mb-2">
              {s.id} / {s.label}
            </p>
            <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
              {s.title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
          </Link>
        ))}
      </section>

    </main>
  )
}