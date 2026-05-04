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
      {/* INTRODUCCIÓN */}
      <section className="bg-white border-b border-gray-200 px-8 py-8 flex flex-col sm:flex-row gap-8">
        <div className="flex-1">
          <p className="font-mono text-xs text-green-600 tracking-widest uppercase mb-3">
            // about
          </p>
          <h2 className="text-base font-medium text-gray-900 mb-2">
            ¿Qué es este blog?
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Este portafolio documenta el trabajo realizado durante el segundo y tercer parcial 
            de la materia de Sistemas Operativos. Aquí encontrarás una comparativa entre el 
            temario oficial y las prácticas realizadas, análisis de comandos entre distintos 
            sistemas y mejoras a los scripts desarrollados en clase.
          </p>
        </div>

        <div className="flex-1">
          <p className="font-mono text-xs text-green-600 tracking-widest uppercase mb-3">
            // stack
          </p>
          <h2 className="text-base font-medium text-gray-900 mb-2">
            Entorno de trabajo
          </h2>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Sistema operativo', value: 'Parrot OS / Linux' },
              { label: 'Shell', value: 'Bash' },
              { label: 'Materia', value: 'Sistemas Operativos' },
              { label: 'Semestre', value: '6to semestre' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                <span className="font-mono text-green-600 text-xs">$</span>
                <span className="text-gray-400">{item.label}:</span>
                <span className="text-gray-800 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )


  
}