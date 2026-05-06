'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tema = {
  id: string
  titulo: string
  descripcion: string
  codigoId: number | null
  aprendido: string
}

type Capitulo = {
  num: string
  titulo: string
  resumen: string
  temas: Tema[]
}

const capitulos: Capitulo[] = [
  {
    num: '01',
    titulo: 'Introducción al sistema operativo Linux',
    resumen: 'Fundamentos del SO, su historia y por qué Linux fue la base de las prácticas.',
    temas: [
      {
        id: '1.1',
        titulo: 'Introducción al sistema operativo Linux',
        descripcion:
          'Linux es un sistema operativo tipo Unix de código abierto cuyo núcleo (kernel) gestiona el hardware, los procesos, la memoria y el sistema de archivos. Durante el curso se utilizó Parrot OS (basado en Debian) como entorno de trabajo, accediendo a las syscalls del kernel directamente desde C.',
        codigoId: null,
        aprendido:
          'Aprendí que el SO no es solo una interfaz: es la capa que traduce las llamadas del programa en operaciones reales sobre el hardware. Linux expone esa capa con archivos en /proc, /dev y syscalls públicas, lo que permite estudiar al kernel desde adentro.',
      },
    ],
  },
  {
    num: '02',
    titulo: 'Procesos e Hilos',
    resumen: 'Creación, identificación, sincronización y finalización de procesos en Linux.',
    temas: [
      {
        id: '2.1',
        titulo: 'Introducción a procesos',
        descripcion:
          'Un proceso es la instancia en ejecución de un programa, con su propio espacio de memoria, descriptores de archivos y contexto de CPU. El kernel mantiene una estructura task_struct para cada uno y los identifica con un PID único.',
        codigoId: 2,
        aprendido:
          'Entendí que cada vez que ejecutamos un binario, Linux crea un task_struct con su propio espacio de direcciones. La variable x del padre y la del hijo viven en memorias distintas aunque se llamen igual.',
      },
      {
        id: '2.2',
        titulo: 'Sistema de llamado para crear procesos — fork()',
        descripcion:
          'fork() duplica el proceso actual creando un hijo idéntico. Devuelve 0 al hijo, el PID del hijo al padre, o -1 si falla. A partir de ese punto ambos procesos ejecutan el mismo código pero con memorias separadas (copy-on-write).',
        codigoId: 3,
        aprendido:
          'Aprendí que fork() es el único mecanismo en Unix para crear procesos nuevos, y que SIEMPRE hay que validar el retorno: -1 significa que el sistema no pudo crear el proceso (límite de procesos, falta de memoria, etc).',
      },
      {
        id: '2.4',
        titulo: 'Sistema de llamado para identificar procesos — getpid() / getppid()',
        descripcion:
          'getpid() devuelve el PID del proceso actual y getppid() el PID de su padre. Son la forma más sencilla de verificar la jerarquía de procesos creada por fork().',
        codigoId: 2,
        aprendido:
          'Vi que después de fork() el hijo conserva como PPID el PID del padre, lo que permite reconstruir el árbol de procesos. Si el padre muere antes que el hijo, el PPID del hijo cambia a 1 (init/systemd).',
      },
      {
        id: '2.5',
        titulo: 'Sistema de llamada wait()',
        descripcion:
          'wait(&status) bloquea al padre hasta que cualquiera de sus hijos termine, y guarda el código de salida en status. Es indispensable para evitar que los hijos queden en estado zombi.',
        codigoId: 4,
        aprendido:
          'Aprendí que sin wait() los hijos terminan pero su entrada en la tabla de procesos queda hasta que el padre la lea. Si el padre nunca llama a wait(), se acumulan zombis y se agotan los PIDs.',
      },
      {
        id: '2.5.1',
        titulo: 'Uso de waitpid()',
        descripcion:
          'waitpid(pid, &status, opciones) es la versión específica de wait(): permite esperar a un hijo concreto por su PID, o usar opciones como WNOHANG para no bloquear. Es lo que se usa cuando el orden de finalización importa.',
        codigoId: 6,
        aprendido:
          'En el árbol binario de procesos, waitpid() fue clave: cada padre debía esperar exactamente a sus dos hijos, no a cualquier hijo. Sin waitpid() los reportes de "termina hijo X" salían desordenados.',
      },
      {
        id: '2.6',
        titulo: 'Sistema de llamada _exit() y exit()',
        descripcion:
          'exit(n) termina el proceso ejecutando antes los handlers registrados con atexit() y vaciando los buffers de stdio. _exit(n) es la versión cruda: termina inmediatamente sin tocar buffers, lo que es importante después de fork() para no imprimir dos veces lo mismo.',
        codigoId: 5,
        aprendido:
          'Aprendí la diferencia sutil pero crítica: si después de fork() el hijo llama a exit() en vez de _exit(), puede vaciar buffers heredados del padre y producir salida duplicada. _exit() evita ese problema.',
      },
      {
        id: '2.7',
        titulo: 'Estado Zombi',
        descripcion:
          'Un proceso zombi es uno que ya terminó pero cuyo padre todavía no ha llamado a wait() para leer su código de salida. El kernel mantiene una entrada mínima (PID + status) hasta que se cosecha. Si nunca se hace, el zombi persiste.',
        codigoId: 4,
        aprendido:
          'En clase vimos que un zombi no consume memoria ni CPU, solo un slot en la tabla de PIDs. Pero acumular miles de zombis agota los PIDs disponibles y bloquea fork(). La solución es siempre cosechar con wait/waitpid o ignorar SIGCHLD.',
      },
      {
        id: '2.8',
        titulo: 'Hilos',
        descripcion:
          'A diferencia de los procesos, los hilos comparten el mismo espacio de direcciones del proceso que los crea. Eso los hace mucho más ligeros pero también más peligrosos: cualquier hilo puede modificar memoria del otro sin avisar, lo que obliga a sincronizar con mutex y variables de condición.',
        codigoId: null,
        aprendido:
          'Comprendí que el modelo "varios hilos en un proceso" es más rápido que "varios procesos" porque no hay que copiar memoria, pero exige disciplina: una variable global accedida por dos hilos sin mutex es un bug latente.',
      },
      {
        id: '2.8.2',
        titulo: 'Creación de hilos — pthread_create()',
        descripcion:
          'pthread_create(&tid, NULL, funcion, arg) crea un nuevo hilo dentro del proceso actual que ejecutará "funcion(arg)". Termina el hilo con pthread_exit() o cuando la función retorna, y se cosecha con pthread_join().',
        codigoId: null,
        aprendido:
          'Aunque no implementamos hilos en las prácticas finales, entendí que pthread_create es a los hilos lo que fork() es a los procesos: el punto de entrada para concurrencia, pero con memoria compartida en lugar de duplicada.',
      },
    ],
  },
  {
    num: '03',
    titulo: 'Mecanismos de comunicación entre procesos — IPC',
    resumen: 'Tuberías, FIFOs, semáforos, memoria compartida y colas de mensajes.',
    temas: [
      {
        id: '3.1',
        titulo: 'Comunicación mediante tuberías',
        descripcion:
          'Las tuberías (pipes) son canales unidireccionales en memoria del kernel que conectan la salida de un proceso con la entrada de otro. Son el mecanismo IPC más simple en Unix y el que está detrás del operador "|" del shell.',
        codigoId: 7,
        aprendido:
          'Aprendí que un pipe es básicamente un buffer FIFO en kernel-space con dos descriptores: uno para escribir y otro para leer. Para comunicación bidireccional hay que crear DOS pipes (uno por sentido), no se puede leer y escribir en el mismo.',
      },
      {
        id: '3.1.1',
        titulo: 'Tuberías sin nombre — pipe()',
        descripcion:
          'pipe(fd) crea un pipe anónimo y devuelve dos descriptores: fd[0] para lectura y fd[1] para escritura. Solo sirve entre procesos relacionados (padre-hijo) porque los descriptores se heredan a través de fork().',
        codigoId: 7,
        aprendido:
          'En la práctica del factorial usamos dos pipes para que padre e hijo se intercambiaran un número y el resultado. Lo más confuso al principio fue cerrar los extremos no usados: si no cierras fd[1] del lector, el read() nunca devuelve EOF.',
      },
      {
        id: '3.1.2',
        titulo: 'Tuberías con nombre — FIFO',
        descripcion:
          'Una FIFO (named pipe) es un pipe que existe como entrada en el sistema de archivos, creado con mkfifo(). A diferencia del pipe anónimo, dos procesos sin relación de parentesco pueden abrirlo por su ruta y comunicarse.',
        codigoId: 8,
        aprendido:
          'En la práctica productor/consumidor usamos /tmp/matriz_fifo. Lo interesante es que open() bloquea hasta que el otro lado también abra: eso es sincronización gratis, sin necesidad de semáforos.',
      },
      {
        id: '3.2',
        titulo: 'Mecanismos IPC derivados de System V',
        descripcion:
          'System V IPC agrupa tres mecanismos: semáforos, memoria compartida y colas de mensajes. Todos comparten la misma filosofía: se identifican con una llave (key_t), se obtienen con *get(), se operan y se destruyen con *ctl(IPC_RMID).',
        codigoId: 0,
        aprendido:
          'Entendí que System V IPC es el modelo "clásico" pero verboso: cada operación necesita varias syscalls. POSIX IPC es la alternativa moderna y más limpia, pero el curso se enfocó en System V porque expone mejor lo que hace el kernel.',
      },
      {
        id: '3.2.1',
        titulo: 'Llaves — ftok() / IPC_PRIVATE',
        descripcion:
          'Una llave es un entero (key_t) que identifica de forma única un recurso IPC en todo el sistema. Se genera con ftok(ruta, id) a partir de un archivo existente, o se usa IPC_PRIVATE para pedir una llave nueva privada al proceso.',
        codigoId: 0,
        aprendido:
          'Aprendí que ftok() es determinista: la misma ruta y el mismo id producen siempre la misma llave, lo que permite que dos programas independientes encuentren el mismo recurso IPC sin acordarlo previamente.',
      },
      {
        id: '3.2.2',
        titulo: 'Semáforos en derivados de System V',
        descripcion:
          'Los semáforos son contadores controlados por el kernel que sincronizan accesos. semget() crea el conjunto, semop() ejecuta operaciones P (decrementa, espera) y V (incrementa, libera), y semctl() los inicializa o destruye.',
        codigoId: 10,
        aprendido:
          'En el ataque de fuerza bruta usamos SEM_VACIO y SEM_LLENO para coordinar productor y consumidor sobre la memoria compartida. Aprendí que un semáforo no es solo un mutex: es un contador, lo que permite controlar varios recursos simultáneos.',
      },
      {
        id: '3.3',
        titulo: 'Memoria compartida',
        descripcion:
          'shmget() crea un segmento de memoria compartida, shmat() lo mapea al espacio de direcciones del proceso, shmdt() lo desmapea y shmctl(IPC_RMID) lo libera. Es el IPC más rápido porque no hay copias: ambos procesos leen y escriben directo en la misma RAM.',
        codigoId: 10,
        aprendido:
          'Aprendí que shmget no copia memoria: solo da un puntero a una región que existe una sola vez en el kernel. Por eso siempre debe ir acompañado de un semáforo o mutex, porque sin sincronización dos procesos pisan los datos del otro.',
      },
      {
        id: '3.4',
        titulo: 'Cola de mensajes',
        descripcion:
          'Las colas de mensajes (msgget / msgsnd / msgrcv / msgctl) permiten enviar mensajes tipados entre procesos. A diferencia de los pipes, los mensajes mantienen su frontera y se pueden filtrar por tipo al recibirlos.',
        codigoId: 11,
        aprendido:
          'En who_colas el padre enviaba cada sesión como un mensaje y el hijo los recibía y formateaba. Lo bonito de las colas es que conservan estructura: no tienes que parsear bytes, recibes el struct completo.',
      },
      {
        id: '3.5',
        titulo: 'Información de IPC por medio de comandos del sistema',
        descripcion:
          'Linux ofrece comandos para inspeccionar y limpiar recursos IPC: ipcs lista semáforos, memoria compartida y colas activas; ipcrm los elimina por id o llave. /proc/sys/kernel/ permite ver y ajustar los límites del sistema.',
        codigoId: 0,
        aprendido:
          'Aprendí que un programa que se cae sin liberar IPC deja "fugas" persistentes: el segmento de shm o el semáforo siguen ocupando recursos hasta que reinicies o uses ipcrm. Es un error muy fácil de cometer y muy difícil de detectar sin ipcs.',
      },
    ],
  },
]

export default function Temario() {
  const [abierto, setAbierto] = useState<string | null>(null)

  return (
    <main className="bg-[#0a0a0a] text-gray-200">
      {/* HERO */}
      <header
        className="relative h-80 flex items-end px-6 pb-12 border-b border-white/10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1400&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/80 to-[#0a0a0a]" />
        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <p className="font-mono text-[11px] text-green-400 tracking-[0.25em] uppercase mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            // temario · proyecto ordinario
          </p>
          <h1 className="text-4xl sm:text-5xl font-light text-white leading-tight tracking-tight mb-4">
            Temario
            <span className="block text-gray-400 mt-1">— Sistemas Operativos</span>
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed max-w-xl">
            Cada tema del programa explicado con su descripción, el código asociado y lo que aprendí en la práctica.
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {capitulos.map((cap) => (
          <section key={cap.num} className="mb-16">
            {/* Header capítulo */}
            <div className="mb-6 pb-4 border-b border-white/10">
              <p className="font-mono text-[11px] text-green-400 uppercase tracking-[0.2em]">
                // capítulo {cap.num}
              </p>
              <h2 className="text-2xl font-light text-gray-100 tracking-tight mt-1">
                {cap.titulo}
              </h2>
              <p className="text-xs text-gray-500 mt-1.5">{cap.resumen}</p>
            </div>

            {/* Lista de temas */}
            <div className="border border-white/10 rounded-lg overflow-hidden divide-y divide-white/10 bg-[#0a0a0a]">
              {cap.temas.map((t) => {
                const key = `${cap.num}-${t.id}`
                const isOpen = abierto === key
                return (
                  <div key={key}>
                    <button
                      onClick={() => setAbierto(isOpen ? null : key)}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="font-mono text-[11px] text-green-400 tracking-wider w-12 shrink-0">
                        {t.id}
                      </span>
                      <span className="flex-1 text-sm text-gray-100 leading-snug">
                        {t.titulo}
                      </span>
                      <span
                        className={`font-mono text-[11px] text-gray-500 transition-transform ${
                          isOpen ? 'rotate-90 text-green-400' : ''
                        }`}
                      >
                        ▸
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-6 pt-2 bg-[#070707]">
                        <div className="border-l-2 border-green-400/40 pl-5 ml-12 flex flex-col gap-5">
                          {/* Descripción */}
                          <div>
                            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                              // qué es
                            </p>
                            <p className="text-sm text-gray-300 leading-relaxed">
                              {t.descripcion}
                            </p>
                          </div>

                          {/* Link a código */}
                          <div>
                            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                              // código asociado
                            </p>
                            {t.codigoId !== null ? (
                              <Link
                                href={`/codigo?id=${t.codigoId}`}
                                className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-400/40 rounded-md text-[12px] font-mono text-green-400 hover:bg-green-400/10 transition-colors"
                              >
                                <span>$</span>
                                <span>ver código</span>
                                <span>→</span>
                              </Link>
                            ) : (
                              <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded-md text-[12px] font-mono text-gray-500">
                                tema teórico — sin código asociado
                              </span>
                            )}
                          </div>

                          {/* Lo que aprendí */}
                          <div>
                            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                              // lo que aprendí
                            </p>
                            <p className="text-sm text-gray-400 leading-relaxed italic">
                              {t.aprendido}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
