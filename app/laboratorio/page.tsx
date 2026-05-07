const categorias = [
  {
    categoria: 'Sistema de archivos',
    parcial: '3er parcial — Mini Shell',
    comandos: [
      {
        nombre: 'pwd',
        syscall: 'getcwd()',
        descripcion: 'Muestra el directorio de trabajo actual.',
        uso: 'pwd',
        ejemplo: '/home/hermes/Escritorio',
      },
      {
        nombre: 'cd',
        syscall: 'chdir()',
        descripcion: 'Cambia el directorio de trabajo actual.',
        uso: 'cd <ruta>',
        ejemplo: 'cd /etc',
      },
      {
        nombre: 'mkdir',
        syscall: 'mkdir()',
        descripcion: 'Crea un nuevo directorio con permisos 0775.',
        uso: 'mkdir <nombre>',
        ejemplo: 'mkdir proyectos',
      },
      {
        nombre: 'ls',
        syscall: 'opendir() / readdir() / stat()',
        descripcion: 'Lista el contenido de un directorio. Soporta flags: -a, -l, -i, -la, -li, -lai.',
        uso: 'ls [-flags] [ruta]',
        ejemplo: 'ls -la /home',
      },
      {
        nombre: 'cat',
        syscall: 'open() / read() / fstat()',
        descripcion: 'Muestra el contenido de un archivo en pantalla.',
        uso: 'cat <archivo>',
        ejemplo: 'cat /etc/hostname',
      },
      {
        nombre: 'stat',
        syscall: 'stat()',
        descripcion: 'Muestra metadatos de un archivo: tamaño, permisos, inode, fechas de acceso y modificación.',
        uso: 'stat <ruta>',
        ejemplo: 'stat /etc/passwd',
      },
      {
        nombre: 'statvfs',
        syscall: 'statvfs()',
        descripcion: 'Muestra información del sistema de archivos: bloques totales, libres, disponibles en MB.',
        uso: 'statvfs <ruta>',
        ejemplo: 'statvfs /',
      },
      {
        nombre: 'unlink',
        syscall: 'unlink()',
        descripcion: 'Elimina un archivo del sistema de archivos.',
        uso: 'unlink <archivo>',
        ejemplo: 'unlink temp.txt',
      },
      {
        nombre: 'rename',
        syscall: 'rename()',
        descripcion: 'Renombra o mueve un archivo.',
        uso: 'rename <origen> <destino>',
        ejemplo: 'rename viejo.txt nuevo.txt',
      },
      {
        nombre: 'find',
        syscall: 'opendir() / readdir() / stat() (recursivo)',
        descripcion: 'Busca un archivo o directorio de forma recursiva desde una ruta dada.',
        uso: 'find <ruta> <nombre>',
        ejemplo: 'find /home hermes',
      },
    ],
  },
  {
    categoria: 'Sistema e información del OS',
    parcial: '3er parcial — Mini Shell',
    comandos: [
      {
        nombre: 'uname',
        syscall: 'uname()',
        descripcion: 'Muestra información del sistema operativo: nombre, nodo, release, versión y arquitectura.',
        uso: 'uname',
        ejemplo: 'Linux parrot 6.1.0 ... x86_64',
      },
      {
        nombre: 'date',
        syscall: 'time() / localtime() / strftime()',
        descripcion: 'Muestra la fecha y hora actual del sistema.',
        uso: 'date',
        ejemplo: '2025-05-04 13:32:00 CST',
      },
      {
        nombre: 'free',
        syscall: 'fopen("/proc/meminfo")',
        descripcion: 'Muestra el uso de memoria RAM y swap leyendo /proc/meminfo.',
        uso: 'free',
        ejemplo: 'Mem: 8192 MB total, 3200 MB usada',
      },
      {
        nombre: 'clear',
        syscall: 'printf() con escape ANSI',
        descripcion: 'Limpia la pantalla de la terminal usando secuencias de escape ANSI.',
        uso: 'clear',
        ejemplo: '\\033[H\\033[2J\\033[3J',
      },
      {
        nombre: 'dev',
        syscall: 'opendir("/dev") / stat() / major() / minor()',
        descripcion: 'Lista todos los dispositivos de bloque y carácter en /dev con sus números mayor y menor.',
        uso: 'dev',
        ejemplo: 'sda, tty0, null...',
      },
    ],
  },
  {
    categoria: 'Red',
    parcial: '3er parcial — Mini Shell',
    comandos: [
      {
        nombre: 'ip',
        syscall: 'socket() / ioctl(SIOCGIFCONF) / ioctl(SIOCGIFADDR)',
        descripcion: 'Muestra la dirección IP de todas las interfaces de red usando ioctl.',
        uso: 'ip',
        ejemplo: 'eth0: 192.168.1.10',
      },
      {
        nombre: 'mac',
        syscall: 'socket() / ioctl(SIOCGIFHWADDR)',
        descripcion: 'Muestra la dirección MAC de todas las interfaces de red.',
        uso: 'mac',
        ejemplo: 'eth0: a4:bb:6d:12:34:56',
      },
    ],
  },
  {
    categoria: 'Usuarios y mensajes',
    parcial: '3er parcial — Mini Shell',
    comandos: [
      {
        nombre: 'who',
        syscall: 'opendir("/run/systemd/sessions")',
        descripcion: 'Lista los usuarios conectados al sistema leyendo las sesiones de systemd.',
        uso: 'who',
        ejemplo: 'hermes  tty1  2025-05-04 13:00',
      },
      {
        nombre: 'mesg',
        syscall: 'open() / dprintf()',
        descripcion: 'Envía un mensaje de texto a la terminal de un usuario específico.',
        uso: 'mesg <usuario> <mensaje>',
        ejemplo: 'mesg hermes hola',
      },
      {
        nombre: 'wall',
        syscall: 'open() / dprintf()',
        descripcion: 'Envía un mensaje broadcast a todos los usuarios conectados.',
        uso: 'wall <mensaje>',
        ejemplo: 'wall "reinicio en 5 minutos"',
      },
    ],
  },
  {
    categoria: 'Procesos — fork y pipes',
    parcial: '2do parcial',
    comandos: [
      {
        nombre: 'fork()',
        syscall: 'fork()',
        descripcion: 'Crea un proceso hijo idéntico al padre. Retorna 0 al hijo y el PID del hijo al padre. Usado en ejercicios 1–4 y prácticas de árbol binario y factorial.',
        uso: 'pid_t pid = fork();',
        ejemplo: 'Ejercicio 1: padre x=10, hijo x=5',
      },
      {
        nombre: 'wait() / waitpid()',
        syscall: 'wait() / waitpid()',
        descripcion: 'El padre espera a que un hijo termine. waitpid() permite esperar a un hijo específico por PID.',
        uso: 'wait(NULL) / waitpid(pid, NULL, 0)',
        ejemplo: 'Práctica 1 — árbol binario de procesos',
      },
      {
        nombre: 'pipe()',
        syscall: 'pipe()',
        descripcion: 'Crea un canal de comunicación unidireccional entre procesos. Se usan dos pipes para comunicación bidireccional.',
        uso: 'pipe(fd)',
        ejemplo: 'Práctica 1.2 — factorial con pipe bidireccional',
      },
      {
        nombre: 'mkfifo()',
        syscall: 'mkfifo()',
        descripcion: 'Crea una tubería con nombre (FIFO) en el sistema de archivos, permitiendo IPC entre procesos no relacionados.',
        uso: 'mkfifo("/tmp/matriz_fifo", 0666)',
        ejemplo: 'Práctica 2 — productor/consumidor con FIFO',
      },
    ],
  },
  {
    categoria: 'IPC — Semáforos, Memoria Compartida y Colas',
    parcial: '2do parcial',
    comandos: [
      {
        nombre: 'semget() / semop() / semctl()',
        syscall: 'sys/sem.h',
        descripcion: 'Crea, opera y controla semáforos System V. semget() crea el conjunto, semop() realiza operaciones P/V, semctl() lo elimina.',
        uso: 'semget(key, nsems, flags)',
        ejemplo: 'fuerza.c — sincronización productor/consumidor con SEM_VACIO y SEM_LLENO',
      },
      {
        nombre: 'shmget() / shmat() / shmdt() / shmctl()',
        syscall: 'sys/shm.h',
        descripcion: 'Crea y gestiona segmentos de memoria compartida System V. Permite que padre e hijo compartan datos sin copiarlos.',
        uso: 'shmget(key, size, flags)',
        ejemplo: 'fuerza.c — ZonaCompartida con palabra encontrada y flag terminado',
      },
      {
        nombre: 'msgget() / msgsnd() / msgrcv() / msgctl()',
        syscall: 'sys/msg.h',
        descripcion: 'Crea y gestiona colas de mensajes System V. Los mensajes tienen tipo y se reciben por filtro.',
        uso: 'msgget(IPC_PRIVATE, flags)',
        ejemplo: 'who_colas.c — padre envía sesiones, hijo imprime con cola de mensajes',
      },
    ],
  },
]

import Link from 'next/link'

export default function Laboratorio() {
  return (
    <main className="bg-[#0a0a0a] text-gray-200">
      {/* HERO */}
      <header
        className="relative h-80 flex items-end px-6 pb-12 border-b border-white/10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/80 to-[#0a0a0a]" />
        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <p className="font-mono text-[11px] text-green-400 tracking-[0.25em] uppercase mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            // laboratorio · syscalls
          </p>
          <h1 className="text-4xl sm:text-5xl font-light text-white leading-tight tracking-tight mb-4">
            Laboratorio de comandos
            <span className="block text-gray-400 mt-1">— syscalls de Linux</span>
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed max-w-xl">
            Syscalls y comandos implementados en Linux durante el segundo y tercer parcial.
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-16">
        {categorias.map((cat) => (
          <section key={cat.categoria}>
            {/* Header de categoría */}
            <header className="flex items-baseline justify-between gap-4 mb-6 pb-3 border-b border-white/10">
              <p className="font-mono text-[11px] text-green-400 uppercase tracking-[0.2em]">
                // {cat.categoria}
              </p>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                {cat.parcial}
              </span>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden">
              {cat.comandos.map((cmd) => (
                <article
                  key={cmd.nombre}
                  className="bg-[#0a0a0a] hover:bg-[#141414] transition-colors p-5 flex flex-col gap-3"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-sm font-medium text-gray-100">
                      {cmd.nombre}
                    </span>
                    <span className="font-mono text-[10px] text-green-400 truncate">
                      {cmd.syscall}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {cmd.descripcion}
                  </p>

                  <div className="flex flex-col gap-1.5 mt-1 pt-3 border-t border-white/10">
                    <div className="flex items-start gap-3 text-[11px]">
                      <span className="font-mono text-gray-500 w-12 shrink-0">uso</span>
                      <code className="font-mono text-gray-200 break-all">
                        {cmd.uso}
                      </code>
                    </div>
                    <div className="flex items-start gap-3 text-[11px]">
                      <span className="font-mono text-gray-500 w-12 shrink-0">output</span>
                      <span className="font-mono text-gray-500 break-all">{cmd.ejemplo}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {/* NAV inferior */}
        <footer className="mt-4 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden">
            <Link
              href="/temario"
              className="group bg-[#0a0a0a] hover:bg-[#141414] p-5 transition-colors"
            >
              <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                ← anterior
              </p>
              <p className="text-sm text-gray-200 group-hover:text-green-400 transition-colors">
                Temario del curso
              </p>
            </Link>
            <Link
              href="/codigo"
              className="group bg-[#0a0a0a] hover:bg-[#141414] p-5 transition-colors text-right"
            >
              <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                siguiente →
              </p>
              <p className="text-sm text-gray-200 group-hover:text-green-400 transition-colors">
                Prácticas y código
              </p>
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}