import Link from 'next/link'

const stats = [
  { valor: '20+', label: 'comandos implementados' },
  { valor: '6', label: 'syscalls principales' },
  { valor: '2', label: 'parciales documentados' },
  { valor: '~3k', label: 'líneas de C escritas' },
]

const tags = ['fork()', 'pipe()', 'semget()', 'shmget()', 'msgget()', 'open()', 'stat()', 'ioctl()']

export default function Reflexion() {
  return (
    <main className="bg-[#0a0a0a] text-gray-200">

      {/* HERO */}
      <header
        className="relative h-96 flex items-end px-6 pb-12 border-b border-white/10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1629904853716-f0bc54eea481?w=1400&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/80 to-[#0a0a0a]" />
        <div className="relative z-10 max-w-3xl mx-auto w-full">
          <p className="font-mono text-[11px] text-green-400 tracking-[0.25em] uppercase mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            // reflexión final · ensayo
          </p>
          <h1 className="text-4xl sm:text-5xl font-light text-white leading-[1.1] tracking-tight mb-4">
            Lo que aprendí escribiendo
            <span className="block text-gray-400 italic font-extralight">
              syscalls a mano.
            </span>
          </h1>
          <p className="text-base text-gray-400 leading-relaxed max-w-2xl">
            Una mirada a dos parciales donde Sistemas Operativos dejó de ser teoría y se volvió código que se compila y se ejecuta.
          </p>
        </div>
      </header>

      {/* META BAR */}
      <div className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-mono text-gray-500 uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <span className="text-gray-600">$</span>
            <span className="text-gray-300">hermes aguilar</span>
            <span className="text-gray-600">$</span>
            <span className="text-gray-300">guadalupe</span>
          </span>
          <span className="text-gray-700">·</span>
          <span>mayo 2026</span>
          <span className="text-gray-700">·</span>
          <span>~7 min de lectura</span>
          <span className="text-gray-700">·</span>
          <span className="text-green-400">UTM 025062</span>
        </div>
      </div>

      {/* ARTICLE */}
      <article className="max-w-3xl mx-auto px-6 py-16">

        {/* LEAD con drop cap */}
        <p className="text-lg text-gray-300 leading-[1.85] mb-12">
          <span className="float-left font-mono text-6xl leading-none text-green-400 mr-3 mt-1">
            A
          </span>
          lo largo del segundo y tercer parcial, la materia de Sistemas Operativos dejó de ser solo teoría para convertirse en algo que se puede ver, compilar y ejecutar. Trabajar directamente con syscalls como{' '}
          <code className="font-mono text-green-400 bg-white/5 px-1.5 py-0.5 rounded text-[0.95em]">fork()</code>,{' '}
          <code className="font-mono text-green-400 bg-white/5 px-1.5 py-0.5 rounded text-[0.95em]">pipe()</code>,{' '}
          <code className="font-mono text-green-400 bg-white/5 px-1.5 py-0.5 rounded text-[0.95em]">semget()</code> y{' '}
          <code className="font-mono text-green-400 bg-white/5 px-1.5 py-0.5 rounded text-[0.95em]">open()</code> permitió entender cómo el kernel de Linux gestiona los procesos, la memoria y los archivos desde adentro, no desde un libro.
        </p>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden mb-16">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#0a0a0a] px-4 py-5 flex flex-col gap-1">
              <span className="font-mono text-2xl font-light text-green-400">{s.valor}</span>
              <span className="text-[11px] text-gray-500 leading-snug">{s.label}</span>
            </div>
          ))}
        </div>

        {/* SECCIÓN 1 */}
        <section className="mb-16">
          <p className="font-mono text-[11px] text-green-400 tracking-[0.2em] uppercase mb-3">
            // 01 · segundo parcial
          </p>
          <h2 className="text-2xl font-light text-gray-100 tracking-tight mb-5">
            Procesos: cuando un programa se duplica a sí mismo
          </h2>
          <p className="text-[15px] text-gray-300 leading-[1.85] mb-5">
            El segundo parcial fue una introducción práctica al mundo de los procesos. Empezando desde el <code className="font-mono text-green-400 text-[0.9em]">fork()</code> más básico hasta construir árboles binarios de procesos y sistemas productor-consumidor con FIFO y colas de mensajes.
          </p>
          <p className="text-[15px] text-gray-400 leading-[1.85]">
            Lo más retador fue entender que padre e hijo comparten el código pero no la memoria, y que sincronizarlos requiere mecanismos explícitos como semáforos o pipes. La primera vez que ves dos procesos imprimiendo en intercalado descontrolado en la terminal, entiendes por qué la sincronización no es opcional.
          </p>
        </section>

        {/* PULL QUOTE */}
        <blockquote className="my-16 pl-6 border-l-2 border-green-400">
          <p className="text-2xl font-light text-gray-100 leading-snug italic tracking-tight">
            “El kernel no es una caja negra: es solo código que alguien escribió antes que tú.”
          </p>
          <footer className="mt-3 font-mono text-[11px] text-gray-500 uppercase tracking-wider">
            — nota de clase, marzo 2026
          </footer>
        </blockquote>

        {/* SECCIÓN 2 */}
        <section className="mb-16">
          <p className="font-mono text-[11px] text-green-400 tracking-[0.2em] uppercase mb-3">
            // 02 · tercer parcial
          </p>
          <h2 className="text-2xl font-light text-gray-100 tracking-tight mb-5">
            El shell: cada comando es una syscall disfrazada
          </h2>
          <p className="text-[15px] text-gray-300 leading-[1.85] mb-5">
            El tercer parcial llevó todo al siguiente nivel: construir un mini shell funcional desde cero en C. Implementar comandos como <code className="font-mono text-green-400 text-[0.9em]">ls</code>, <code className="font-mono text-green-400 text-[0.9em]">stat</code>, <code className="font-mono text-green-400 text-[0.9em]">find</code> o <code className="font-mono text-green-400 text-[0.9em]">who</code> usando syscalls directas fue la forma más concreta de entender cómo funciona Linux por dentro.
          </p>
          <p className="text-[15px] text-gray-400 leading-[1.85]">
            Cada comando del shell es, en realidad, una llamada al kernel disfrazada de texto. Cuando tecleas <code className="font-mono text-gray-300 text-[0.9em]">ls -la</code>, no estás invocando magia: estás llamando a <code className="font-mono text-green-400 text-[0.9em]">opendir()</code>, recorriendo el directorio con <code className="font-mono text-green-400 text-[0.9em]">readdir()</code>, y consultando metadatos con <code className="font-mono text-green-400 text-[0.9em]">stat()</code>. Punto.
          </p>
        </section>

        {/* SECCIÓN 3 - lo que faltó */}
        <section className="mb-16 bg-white/2 border border-white/10 rounded-lg p-7">
          <p className="font-mono text-[11px] text-amber-400 tracking-[0.2em] uppercase mb-3">
            // 03 · áreas de oportunidad
          </p>
          <h2 className="text-xl font-light text-gray-100 tracking-tight mb-4">
            Lo que quedó pendiente
          </h2>
          <p className="text-[15px] text-gray-400 leading-[1.85] mb-4">
            Quedaron temas del temario oficial sin práctica directa: la planificación de procesos, el interbloqueo, la administración de memoria virtual y los temporizadores.
          </p>
          <ul className="flex flex-col gap-2 mt-4">
            {[
              'Algoritmos de planificación (Round Robin, SJF, prioridad)',
              'Interbloqueo e inanición — detección y prevención',
              'Memoria virtual con paginación y segmentación',
              'Temporizadores y manejo de señales en profundidad',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-400">
                <span className="font-mono text-amber-400 text-xs mt-1">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-500 leading-relaxed mt-5 italic">
            Son temas que hubiera sido interesante atacar con código — los algoritmos de planificación, en particular, se quedan muy abstractos sin una implementación.
          </p>
        </section>

        {/* CONCLUSIÓN */}
        <section className="mb-16">
          <p className="font-mono text-[11px] text-green-400 tracking-[0.2em] uppercase mb-3">
            // 04 · cierre
          </p>
          <h2 className="text-2xl font-light text-gray-100 tracking-tight mb-5">
            ¿Y de aquí, qué sigue?
          </h2>
          <p className="text-[15px] text-gray-300 leading-[1.85] mb-5">
            Este portafolio representa no solo el trabajo del semestre sino la evidencia de que los sistemas operativos no son una caja negra. Linux expone todo a través de syscalls, <code className="font-mono text-green-400 text-[0.9em]">/proc</code> y el sistema de archivos, y con C se puede tocar casi cualquier parte del kernel.
          </p>
          <p className="text-[15px] text-gray-400 leading-[1.85]">
            La siguiente frontera natural sería explorar hilos con <code className="font-mono text-green-400 text-[0.9em]">pthreads</code>, manejo profundo de señales, y la administración de memoria virtual con <code className="font-mono text-green-400 text-[0.9em]">mmap()</code>. Por ahora, la sensación que queda es la de haber abierto una caja que ya no se puede cerrar.
          </p>
        </section>

        {/* TAGS */}
        <footer className="mt-20 pt-8 border-t border-white/10">
          <p className="font-mono text-[11px] text-gray-500 tracking-wider uppercase mb-4">
            // syscalls usadas
          </p>
          <div className="flex flex-wrap gap-2 mb-10">
            {tags.map((t) => (
              <span
                key={t}
                className="font-mono text-[11px] text-gray-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded hover:border-green-400/40 hover:text-green-400 transition-colors"
              >
                {t}
              </span>
            ))}
          </div>

          {/* NAV */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden">
            <Link
              href="/codigo"
              className="group bg-[#0a0a0a] hover:bg-[#141414] p-5 transition-colors"
            >
              <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                ← anterior
              </p>
              <p className="text-sm text-gray-200 group-hover:text-green-400 transition-colors">
                Prácticas y código
              </p>
            </Link>
            <Link
              href="/"
              className="group bg-[#0a0a0a] hover:bg-[#141414] p-5 transition-colors text-right"
            >
              <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                inicio →
              </p>
              <p className="text-sm text-gray-200 group-hover:text-green-400 transition-colors">
                Portada del blog
              </p>
            </Link>
          </div>
        </footer>

      </article>
    </main>
  )
}
