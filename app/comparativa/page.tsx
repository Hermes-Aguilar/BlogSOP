const parciales = [
  {
    num: '2do parcial',
    descripcion: 'Temas 2 y 3 — Procesos y Administración de procesos',
    temas: [
      {
        temario: '2.1 Definición y tipos de procesos',
        practica: 'Ejercicio 1 y 2 — fork() básico, identificación de PID/PPID',
        estado: 'cubierto',
      },
      {
        temario: '2.2 Estados y control de procesos',
        practica: 'Ejercicio 3 y 4 — cadena de procesos vs árbol plano',
        estado: 'cubierto',
      },
      {
        temario: '2.3 Planificación',
        practica: 'Solo teoría, sin práctica directa',
        estado: 'sin práctica',
      },
      {
        temario: '2.4 Multiprocesamiento e hilos',
        practica: 'Práctica 1.1 — árbol binario de procesos con fork() recursivo',
        estado: 'cubierto',
      },
      {
        temario: '3.1 Concurrencia',
        practica: 'Práctica 1.2 — factorial con dos procesos ejecutándose en paralelo',
        estado: 'cubierto',
      },
      {
        temario: '3.2 Exclusión mutua',
        practica: 'fuerza.c — semáforos SEM_VACIO/SEM_LLENO para acceso exclusivo a memoria compartida',
        estado: 'cubierto',
      },
      {
        temario: '3.3 Comunicación de procesos',
        practica: 'Práctica 1.2 (pipe), Práctica 2 (FIFO), who_colas.c (colas de mensajes)',
        estado: 'cubierto',
      },
      {
        temario: '3.4 Sincronización de procesos',
        practica: 'fuerza.c — semget/semop/semctl para sincronizar padre e hijo',
        estado: 'cubierto',
      },
    ],
  },
  {
    num: '3er parcial',
    descripcion: 'Temas 6 y 8 — Sistema de archivos y señales/tiempo',
    temas: [
      {
        temario: '6.1 Almacenamiento físico de archivos',
        practica: 'Mini Shell — stat(), statvfs(), inode, bloques y dispositivos con dev',
        estado: 'cubierto',
      },
      {
        temario: '6.2 Estructura y función del sistema de archivos',
        practica: 'Mini Shell — ls con flags (-la, -i, -lai), opendir(), readdir()',
        estado: 'cubierto',
      },
      {
        temario: '6.3 Propiedades',
        practica: 'Mini Shell — stat() muestra permisos, uid, gid, fechas de acceso',
        estado: 'cubierto',
      },
      {
        temario: '6.4 Operaciones sobre archivos',
        practica: 'Mini Shell — cat, unlink, rename, find, mkdir, cd, pwd',
        estado: 'cubierto',
      },
      {
        temario: '6.5 Seguridad y protección',
        practica: 'fuerza.c — lectura de /etc/shadow y verificación de hashes con crypt_r()',
        estado: 'cubierto',
      },
      {
        temario: '7.1 Caracterización de dispositivos E/S',
        practica: 'Mini Shell — cmd_dev lista dispositivos de bloque y carácter en /dev',
        estado: 'cubierto',
      },
      {
        temario: '7.2 Arquitectura del sistema de E/S',
        practica: 'Mini Shell — ioctl() con SIOCGIFCONF para interfaces de red (ip, mac)',
        estado: 'cubierto',
      },
      {
        temario: '7.3 Almacenamiento secundario',
        practica: 'Solo teoría, sin práctica directa',
        estado: 'sin práctica',
      },
      {
        temario: '8.1-8.2 Concepto y tipos de señales',
        practica: 'Solo teoría — no se implementó manejo de señales en el shell',
        estado: 'sin práctica',
      },
      {
        temario: '8.3 Envío y tratamiento de señales',
        practica: 'Mini Shell — mesg y wall envían mensajes a terminales con dprintf()',
        estado: 'modificado',
      },
      {
        temario: '8.4 Funciones de tiempo',
        practica: 'Mini Shell — cmd_date con time(), localtime(), strftime()',
        estado: 'cubierto',
      },
      {
        temario: '8.5 Temporizadores',
        practica: 'fuerza.c — clock_gettime(CLOCK_MONOTONIC) para medir tiempo de ejecución',
        estado: 'modificado',
      },
    ],
  },
  {
    num: 'Temas no cubiertos',
    descripcion: 'Temas 1, 4 y 5 — Introducción, Interbloqueo y Memoria',
    temas: [
      {
        temario: '1. Introducción — concepto, historia, clasificación',
        practica: 'No se asignaron prácticas',
        estado: 'sin práctica',
      },
      {
        temario: '4. Interbloqueo e inanición (4.1–4.8)',
        practica: 'No se asignaron prácticas',
        estado: 'sin práctica',
      },
      {
        temario: '5. Administración de la memoria (5.1–5.5)',
        practica: 'No se asignaron prácticas',
        estado: 'sin práctica',
      },
    ],
  },
]

const badgeStyle: Record<string, string> = {
  cubierto: 'text-green-400 before:bg-green-400',
  modificado: 'text-amber-400 before:bg-amber-400',
  'sin práctica': 'text-gray-500 before:bg-gray-600',
}

export default function Comparativa() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <p className="font-mono text-[11px] text-green-400 tracking-[0.2em] uppercase mb-3">
        // comparativa
      </p>
      <h1 className="text-3xl font-light text-gray-100 tracking-tight mb-2">
        Temario vs Prácticas
      </h1>
      <p className="text-sm text-gray-400 mb-10 max-w-xl leading-relaxed">
        Comparación entre el plan de estudios oficial (UTM — 025062) y las prácticas realizadas en clase.
      </p>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-5 mb-12 pb-6 border-b border-white/10">
        {[
          { estado: 'cubierto', label: 'Cubierto' },
          { estado: 'modificado', label: 'Parcial' },
          { estado: 'sin práctica', label: 'Solo teoría' },
        ].map((l) => (
          <span
            key={l.estado}
            className={`text-[11px] font-mono uppercase tracking-wider flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full ${badgeStyle[l.estado]}`}
          >
            {l.label}
          </span>
        ))}
      </div>

      {parciales.map((p) => (
        <section key={p.num} className="mb-16">
          <div className="mb-6">
            <p className="font-mono text-[11px] text-green-400 uppercase tracking-[0.2em]">
              // {p.num}
            </p>
            <p className="text-xs text-gray-500 mt-1">{p.descripcion}</p>
          </div>

          <div className="border-t border-white/10">
            {/* Header */}
            <div className="grid grid-cols-[1.5fr_2fr_110px] border-b border-white/10">
              <div className="px-4 py-3 text-[11px] font-mono uppercase tracking-wider text-gray-500">Tema del temario</div>
              <div className="px-4 py-3 text-[11px] font-mono uppercase tracking-wider text-gray-500">Práctica realizada</div>
              <div className="px-4 py-3 text-[11px] font-mono uppercase tracking-wider text-gray-500">Estado</div>
            </div>
            {/* Rows */}
            {p.temas.map((t, i) => (
              <div
                key={i}
                className="grid grid-cols-[1.5fr_2fr_110px] border-b border-white/10 hover:bg-white/5 transition-colors"
              >
                <div className="px-4 py-4 text-sm text-gray-200 leading-relaxed">{t.temario}</div>
                <div className="px-4 py-4 text-sm text-gray-400 leading-relaxed">{t.practica}</div>
                <div className="px-4 py-4 flex items-center">
                  <span
                    className={`text-[11px] font-mono uppercase tracking-wider flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full ${badgeStyle[t.estado]}`}
                  >
                    {t.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}