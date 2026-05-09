import PageHero from '../components/PageHero'
import FooterNav from '../components/FooterNav'

const team = [
  {
    rol: 'autor · estudiante',
    nombre: 'Hermes Aguilar Villa',
    alias: '@hermes',
    bio: 'Estudiante de 6to semestre, encargado del desarrollo del blog, las prácticas de syscalls y la documentación técnica del portafolio.',
    foco: ['Next.js', 'C / syscalls', 'Linux'],
    contactos: [
      { tipo: 'email', valor: 'hermes@correo.utm', href: 'mailto:auvh050615@gs.utm.mx' },
      { tipo: 'github', valor: 'github.com/hermes', href: 'https://github.com/Hermes-Aguilar' },
    ],
  },
  {
    rol: 'compañera · co-autora',
    nombre: 'Guadalupe',
    alias: '@guadalupe',
    bio: 'Compañera de equipo en las prácticas de Sistemas Operativos. Colaboró en la implementación de procesos y practicas durante todo el semestre, y en la documentacion del blog',
    foco: ['Bash scripting', 'Procesos', 'IPC'],
    contactos: [
      { tipo: 'email', valor: 'guadalupe@correo.utm', href: 'mailto:hemg050704@gs.utm.mx' },
      { tipo: 'github', valor: 'github.com/guadalupe', href: 'https://github.com/Guadalupe0405' },
    ],
  },
]

const profLinks = [
  { label: 'correo', valor: 'geronimo@utm.utm.mx', href: 'mailto:gcgero@utm.utm.mx' },
  { label: 'pagina web', valor: 'peginaweb.com', href: 'https://mixteco.utm.mx/~gcgero/' },
]

const profTags = [
  'sistemas distribuidos',
  'redes',
  'software libre',
  'GULMIX',
  'cómputo móvil',
  'IPv6',
  'sistemas colaborativos',
  'tecnologías educativas',
]

const profPubs = [
  {
    año: '2024',
    cita: 'Gerónimo-Castillo G., Rocha-Trejo E., Vasquez-Cid de Leon C. Inmersión a los algoritmos de sincronización de relojes en sistemas distribuidos. Revista PENTACIENCIAS, 6(6), 179-199.',
  },
  {
    año: '2019',
    cita: 'Reyes-Pérez O., Gerónimo-Castillo G., López-Santiago N. Desafíos del alumnado indígena en una universidad de la zona mixteca de Oaxaca: el caso de la UNICHA. Ciencia y Mar, XXIII(67), 77-86.',
  },
  {
    año: '2005',
    cita: 'Gerónimo G., Aquino L., Becerra L., Calvo I. El proyecto Edumóvil: Consideraciones Iniciales. ENC‒2005. ISBN 968-863-859-5.',
  },
  {
    año: '2003',
    cita: 'Rocha E., Gerónimo G. Uso del Software Libre para el Desarrollo de Aplicaciones en la Universidad Tecnológica de la Mixteca. XXX Aniversario FCC-BUAP. ISBN 968-863-711-4.',
  },
]

export default function Contacto() {
  return (
    <main className="bg-[#0a0a0a] text-gray-200">

      {/* HERO */}
      <PageHero
        kicker="// contacto · who-is"
        title="Detrás del repositorio"
        accent="hay personas reales."
        subtitle="El equipo que construyó este portafolio y el profesor que nos enseñó a abrir la caja negra del kernel."
        height="h-96"
        maxWidth="max-w-3xl"
        image="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1400&q=80"
      />

      {/* META BAR */}
      <div className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-mono text-gray-500 uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <span className="text-gray-600">$</span>
            <span className="text-gray-300">whoami</span>
          </span>
          <span className="text-gray-700">·</span>
          <span>2 colaboradores</span>
          <span className="text-gray-700">·</span>
          <span>1 docente</span>
          <span className="text-gray-700">·</span>
          <span className="text-green-400">UTM 2026</span>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-16">

        {/* INTRO */}
        <p className="text-lg text-gray-300 leading-[1.85] mb-14">
          <span className="float-left font-mono text-6xl leading-none text-green-400 mr-3 mt-1">
            E
          </span>
          ste portafolio no es un proyecto en solitario. Detrás de cada{' '}
          <code className="font-mono text-green-400 bg-white/5 px-1.5 py-0.5 rounded text-[0.95em]">fork()</code>{' '}
          y cada línea de C hubo un equipo de dos personas trabajando en pareja, y un profesor que decidió que la mejor forma de entender Linux era escribir código que toca el kernel directamente.
        </p>

        {/* SECCIÓN 1 — EQUIPO */}
        <section className="mb-20">
          <p className="font-mono text-[11px] text-green-400 tracking-[0.2em] uppercase mb-3">
            // 01 · el equipo
          </p>
          <h2 className="text-2xl font-light text-gray-100 tracking-tight mb-8">
            Las personas que escribieron el código
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden">
            {team.map((p) => (
              <div key={p.nombre} className="bg-[#0a0a0a] p-6 flex flex-col gap-4">

                {/* avatar terminal */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-400/10 border border-green-400/30 flex items-center justify-center font-mono text-green-400 text-lg">
                    {p.nombre.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-green-400 tracking-widest uppercase">
                      {p.rol}
                    </span>
                    <span className="text-sm text-gray-100 font-light tracking-tight">
                      {p.nombre}
                    </span>
                    <span className="font-mono text-[11px] text-gray-500">
                      {p.alias}
                    </span>
                  </div>
                </div>

                <p className="text-[13px] text-gray-400 leading-relaxed">
                  {p.bio}
                </p>

                {/* foco */}
                <div className="flex flex-wrap gap-1.5">
                  {p.foco.map((f) => (
                    <span
                      key={f}
                      className="font-mono text-[10px] text-gray-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* contactos */}
                <div className="flex flex-col mt-auto pt-3 border-t border-white/10">
                  {p.contactos.map((c) => {
                    const isExternal = c.href.startsWith('http')
                    return (
                      <a
                        key={c.tipo}
                        href={c.href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-3 py-1.5 text-xs group"
                      >
                        <span
                          className={`font-mono text-[11px] w-3 ${
                            isExternal ? 'text-cyan-400' : 'text-green-400'
                          }`}
                        >
                          $
                        </span>
                        <span className="text-gray-500 text-[11px] uppercase tracking-wider w-12">
                          {c.tipo}
                        </span>
                        <span
                          className={`text-gray-300 font-mono text-[12px] transition-colors truncate ${
                            isExternal
                              ? 'group-hover:text-cyan-400'
                              : 'group-hover:text-green-400'
                          }`}
                        >
                          {c.valor}
                        </span>
                      </a>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PULL QUOTE */}
        <blockquote className="my-20 pl-6 border-l-2 border-green-400">
          <p className="text-2xl font-light text-gray-100 leading-snug italic tracking-tight">
            “Aprendí más leyendo manpages con él en clase que en cualquier libro.”
          </p>
          <footer className="mt-3 font-mono text-[11px] text-gray-500 uppercase tracking-wider">
            — Gabriel Gerónimo Castillo
          </footer>
        </blockquote>

        {/* SECCIÓN 2 — PROFESOR (destacada) */}
        <section className="mb-20">
          <p className="font-mono text-[11px] text-amber-400 tracking-[0.2em] uppercase mb-3">
            // 02 · docente · destacado
          </p>
          <h2 className="text-2xl font-light text-gray-100 tracking-tight mb-8">
            Gabriel Gerónimo Castillo: la voz detrás del temario
          </h2>

          <div className="border border-white/10 rounded-lg overflow-hidden">

            {/* header tipo terminal */}
            <div className="bg-white/5 border-b border-white/10 px-5 py-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
              <span className="font-mono text-[11px] text-gray-500 ml-3 tracking-wider">
                ~/profesor — bash
              </span>
            </div>

            <div className="p-7 flex flex-col gap-6">

              {/* nombre + linea de comando */}
              <div className="flex flex-col gap-2">
                <p className="font-mono text-[11px] text-gray-500 tracking-wider">
                  <span className="text-green-400">$</span> cat /etc/profesor.info
                </p>
                <h3 className="text-xl font-light text-gray-100 tracking-tight">
                  M.C. Gabriel Gerónimo Castillo
                </h3>
                <p className="font-mono text-[12px] text-gray-500">
                  Profesor-investigador · Instituto de Computación · UTM
                </p>
              </div>

              {/* bio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="sm:col-span-2 flex flex-col gap-4">
                  <p className="text-[14px] text-gray-300 leading-[1.85]">
                    Maestro en Ciencias de la Computación y Licenciado en Computación por la Benemérita Universidad Autónoma de Puebla. Profesor-investigador en el Sistema de Universidades Estatales de Oaxaca: Universidad Tecnológica de la Mixteca (UTM), Universidad de la Sierra Sur (UNSIS), NovaUniversitas (NU) y Universidad de Chalcatongo (UNICHA).
                  </p>
                  <p className="text-[14px] text-gray-400 leading-[1.85]">
                    Ha sido Coordinador de la Universidad Virtual-UTM, Director del Cuerpo Académico de Redes y Sistemas Distribuidos y Director del Grupo de Investigación de Tecnologías Aplicadas a la Enseñanza de la UTM. Vice-Rector Académico de NovaUniversitas y de la Universidad de Chalcatongo. Actualmente adscrito al Instituto de Computación de la UTM.
                  </p>
                </div>

                {/* stats + tux */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-px bg-white/10 border border-white/10 rounded overflow-hidden">
                    {[
                      { v: 'M.C.', l: 'Cs. de la Computación · BUAP' },
                      { v: '4', l: 'universidades del SUEO' },
                      { v: 'GULMIX', l: 'fundador del grupo de Linux' },
                      { v: '30+', l: 'años de docencia universitaria' },
                    ].map((s) => (
                      <div key={s.l} className="bg-[#0a0a0a] px-4 py-3">
                        <p className="font-mono text-lg font-light text-amber-400">{s.v}</p>
                        <p className="text-[10px] text-gray-500 leading-snug">{s.l}</p>
                      </div>
                    ))}
                  </div>

                  {/* mascota Tux */}
                  <figure className="bg-[#0a0a0a] border border-white/10 rounded overflow-hidden flex flex-col items-center px-4 py-5 gap-2">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg"
                      alt="Tux, la mascota oficial del kernel Linux"
                      className="h-24 w-auto select-none pointer-events-none"
                      loading="lazy"
                    />
                    <figcaption className="text-center">
                      <p className="font-mono text-[10px] text-amber-400 tracking-[0.2em] uppercase">
                        tux · linux mascot
                      </p>
                      <p className="text-[10px] text-gray-500 leading-snug mt-1 italic">
                        “software libre como motor académico”
                      </p>
                    </figcaption>
                  </figure>
                </div>
              </div>

              {/* trabajo academico, software libre y linux */}
              <div className="bg-white/2 border border-white/10 rounded-lg p-5">
                <p className="font-mono text-[11px] text-amber-400 tracking-[0.2em] uppercase mb-3">
                  // software libre, linux y líneas de investigación
                </p>
                <p className="text-[13px] text-gray-300 leading-[1.85] mb-4">
                  Fue <span className="text-amber-400">fundador del Grupo de Usuarios de Linux de la Mixteca (GULMIX)</span>, impulsando el uso de software libre como motor académico y de desarrollo en la región. Su trabajo de investigación abarca redes, sistemas distribuidos, sistemas colaborativos y tecnologías aplicadas a la enseñanza.
                </p>
                <ul className="flex flex-col gap-2">
                  {[
                    'Fundador del Grupo de Usuarios de Linux de la Mixteca (GULMIX)',
                    'Software libre como base de desarrollo en la UTM',
                    'Redes y sistemas distribuidos · sincronización de relojes',
                    'Proyecto EDUMÓVIL · cómputo móvil aplicado a primarias (Motorola Foundation, 2007)',
                    'Monitoreo en redes IPv6, IEEE 802.11 y Bluetooth',
                    'Sistemas colaborativos: Groupware y Workflows',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[13px] text-gray-400">
                      <span className="font-mono text-amber-400 text-xs mt-1">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[12px] text-gray-500 leading-relaxed mt-4 italic">
                  Proyectos dirigidos con financiamiento: PIEE-SEP (2016, 2018) y EDUMÓVIL Academic Initiative (Motorola Foundation, 2007).
                </p>
              </div>

              {/* publicaciones seleccionadas */}
              <div>
                <p className="font-mono text-[11px] text-gray-500 tracking-wider uppercase mb-3">
                  // publicaciones seleccionadas
                </p>
                <ul className="flex flex-col gap-3">
                  {profPubs.map((pub) => (
                    <li
                      key={pub.cita}
                      className="flex gap-3 text-[12px] text-gray-400 leading-relaxed border-l border-white/10 pl-3"
                    >
                      <span className="font-mono text-amber-400 text-[11px] shrink-0 w-10 pt-0.5">
                        {pub.año}
                      </span>
                      <span>{pub.cita}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-gray-600 italic mt-3">
                  Más de 25 publicaciones en congresos como ENC, ANIEI, Virtual Educa y SOMI.
                </p>
              </div>

              {/* tags / áreas */}
              <div>
                <p className="font-mono text-[11px] text-gray-500 tracking-wider uppercase mb-3">
                  // áreas de interés
                </p>
                <div className="flex flex-wrap gap-2">
                  {profTags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[11px] text-gray-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded hover:border-amber-400/40 hover:text-amber-400 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* contactos profesor */}
              <div className="border-t border-white/10 pt-5">
                <p className="font-mono text-[11px] text-gray-500 tracking-wider uppercase mb-3">
                  // contacto
                </p>
                <div className="flex flex-col">
                  {profLinks.map((c) => {
                    const isExternal = c.href.startsWith('http')
                    return (
                      <a
                        key={c.label}
                        href={c.href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0 group"
                      >
                        <span
                          className={`font-mono text-[11px] w-3 ${
                            isExternal ? 'text-cyan-400' : 'text-amber-400'
                          }`}
                        >
                          $
                        </span>
                        <span className="text-gray-500 text-[11px] uppercase tracking-wider w-16">
                          {c.label}
                        </span>
                        <span
                          className={`text-gray-200 font-mono text-[13px] transition-colors ${
                            isExternal
                              ? 'group-hover:text-cyan-400'
                              : 'group-hover:text-amber-400'
                          }`}
                        >
                          {c.valor}
                        </span>
                        <span
                          className={`ml-auto font-mono text-gray-600 transition-colors text-xs ${
                            isExternal
                              ? 'group-hover:text-cyan-400'
                              : 'group-hover:text-amber-400'
                          }`}
                        >
                          →
                        </span>
                      </a>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECCIÓN 3 — Cierre / agradecimientos */}
        <section className="mb-16">
          <p className="font-mono text-[11px] text-green-400 tracking-[0.2em] uppercase mb-3">
            // 03 · agradecimientos
          </p>
          <h2 className="text-2xl font-light text-gray-100 tracking-tight mb-5">
            Gracias por leer hasta aquí
          </h2>
          <p className="text-[15px] text-gray-300 leading-[1.85] mb-5">
            Si tienes preguntas, comentarios o quieres revisar el código fuente de las prácticas, cualquiera de los contactos de arriba funciona. Este blog está pensado como evidencia académica, pero también como referencia para futuros estudiantes que se topen con el mismo temario.
          </p>
          <p className="text-[15px] text-gray-400 leading-[1.85]">
            Y si eres estudiante leyendo esto antes de tu propio examen: lee las manpages, escribe el código tú, y no le tengas miedo a <code className="font-mono text-green-400 text-[0.9em]">strace</code>.
          </p>
        </section>

        {/* FOOTER NAV */}
        <FooterNav
          className="mt-20"
          prevHref="/reflexion"
          prevLabel="Conclusión final"
          nextHref="/"
          nextLabel="Portada del blog"
        />

      </article>
    </main>
  )
}
