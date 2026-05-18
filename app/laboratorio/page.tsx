import PageHero from '../components/PageHero'
import FooterNav from '../components/FooterNav'

const categorias = [
  {
    categoria: 'Sistema de archivos',
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
      {
        nombre: 'exit',
        syscall: 'exit() / _exit()',
        descripcion: 'Builtin del Mini Shell que termina la sesión interactiva. Internamente llama a exit() para vaciar buffers de stdio antes de salir.',
        uso: 'exit',
        ejemplo: '[adios]',
      },
      {
        nombre: 'clock_gettime()',
        syscall: 'time.h',
        descripcion: 'Obtiene el tiempo del sistema con resolución de nanosegundos. CLOCK_MONOTONIC es ideal para medir duración porque no se ve afectado por cambios de hora.',
        uso: 'clock_gettime(CLOCK_MONOTONIC, &ts)',
        ejemplo: 'fuerza.c — medir tiempo total del ataque',
      },
    ],
  },
  {
    categoria: 'Red',
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
    comandos: [
      {
        nombre: 'fork()',
        syscall: 'fork()',
        descripcion: 'Crea un proceso hijo idéntico al padre. Retorna 0 al hijo y el PID del hijo al padre. Usado en ejercicios 1–4 y prácticas de árbol binario y factorial.',
        uso: 'pid_t pid = fork();',
        ejemplo: 'Ejercicio 1: padre x=10, hijo x=5',
      },
      {
        nombre: 'getpid() / getppid()',
        syscall: 'unistd.h',
        descripcion: 'getpid() devuelve el PID del proceso actual. getppid() devuelve el PID del padre. Permiten reconstruir la jerarquía padre-hijo creada por fork().',
        uso: 'pid_t pid = getpid();',
        ejemplo: 'Práctica 1.1: PID=6001, PPID=5900',
      },
      {
        nombre: 'exit() / _exit()',
        syscall: 'stdlib.h / unistd.h',
        descripcion: 'exit() termina ejecutando handlers atexit() y vaciando buffers de stdio. _exit() es la versión cruda al kernel: ideal en hijos tras fork() para no duplicar salida.',
        uso: 'exit(EXIT_SUCCESS); / _exit(0);',
        ejemplo: 'Ejercicio 2.6 — terminar limpio sin tocar buffers',
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
    comandos: [
      {
        nombre: 'ftok()',
        syscall: 'sys/ipc.h',
        descripcion: 'Genera una llave única (key_t) a partir de una ruta de archivo y un ID entero. Es determinista: dos procesos sin parentesco obtienen la misma llave si usan los mismos parámetros.',
        uso: 'key_t k = ftok("archivo", 65);',
        ejemplo: 'fuerza.c y who_colas.c — llave compartida entre productor y consumidor',
      },
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
  {
    categoria: 'Hilos — POSIX threads',
    comandos: [
      {
        nombre: 'pthread_create()',
        syscall: 'pthread.h',
        descripcion: 'Crea un nuevo hilo dentro del proceso actual que ejecuta una función dada. Compartir memoria con el proceso padre permite comunicación directa entre hilos.',
        uso: 'pthread_create(&tid, NULL, func, arg)',
        ejemplo: 'tema 2.8.2 — hilos que imprimen "Hola desde el hilo"',
      },
      {
        nombre: 'pthread_join()',
        syscall: 'pthread.h',
        descripcion: 'Espera a que un hilo específico termine y libera sus recursos. Equivalente a wait() pero para hilos en lugar de procesos.',
        uso: 'pthread_join(tid, NULL)',
        ejemplo: 'tema 2.8 — el main espera a que el hilo termine',
      },
    ],
  },
  {
    categoria: 'Seguridad y temporización',
    comandos: [
      {
        nombre: 'crypt_r()',
        syscall: 'crypt.h',
        descripcion: 'Versión thread-safe de crypt(). Genera el hash de una contraseña usando el algoritmo indicado por el salt ($1$ MD5, $5$ SHA-256, $6$ SHA-512). Compilar con -lcrypt.',
        uso: 'crypt_r(pwd, salt, &data)',
        ejemplo: 'fuerza.c — comparar hash candidato con /etc/shadow',
      },
      {
        nombre: 'inet_ntop()',
        syscall: 'arpa/inet.h',
        descripcion: 'Convierte una dirección IP binaria (struct in_addr) a su representación textual. Es la versión moderna y thread-safe de inet_ntoa().',
        uso: 'inet_ntop(AF_INET, &sa, buf, sz)',
        ejemplo: 'cmd_ip — formatear "192.168.1.10"',
      },
      {
        nombre: 'dprintf()',
        syscall: 'stdio.h',
        descripcion: 'Variante de printf() que escribe directamente sobre un descriptor de archivo en lugar de un FILE*. Útil para escribir a terminales abiertas con open().',
        uso: 'dprintf(fd, "fmt", args)',
        ejemplo: 'cmd_mesg / cmd_wall — enviar a la TTY del usuario',
      },
    ],
  },
]

import Link from 'next/link'

export default function Laboratorio() {
  return (
    <main className="bg-[#0a0a0a] text-gray-200">
      {/* HERO */}
      <PageHero
        kicker="// laboratorio · systemcalls"
        title="Laboratorio de comandos"
        accent="— systemcalls de Linux"
        subtitle="Systemcalls y comandos implementados en Linux a lo largo del curso de Sistemas Operativos."
        image="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80"
      />

      <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-16">
        {/* INTRO */}
        <section className="border border-white/10 rounded-lg bg-[#0d0d0d] px-6 py-7">
          <p className="font-mono text-[11px] text-green-400 tracking-[0.2em] uppercase mb-3">
            // antes de empezar
          </p>
          <h2 className="text-lg font-light text-gray-100 tracking-tight mb-4">
            Cómo se construyó este laboratorio
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-3">
            Los comandos listados a continuación corresponden a los códigos
            escritos durante las prácticas del curso. Cada uno se implementó en
            C reproduciendo el comportamiento del comando real de Linux, pero
            invocando directamente la systemcall del kernel que está por detrás.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            Por ejemplo, el comando <code className="font-mono text-green-400 text-[0.9em]">pwd</code> se programa con{' '}
            <code className="font-mono text-green-400 text-[0.9em]">getcwd()</code>,{' '}
            <code className="font-mono text-green-400 text-[0.9em]">cd</code> con{' '}
            <code className="font-mono text-green-400 text-[0.9em]">chdir()</code>,{' '}
            <code className="font-mono text-green-400 text-[0.9em]">mkdir</code> con{' '}
            <code className="font-mono text-green-400 text-[0.9em]">mkdir()</code>,{' '}
            <code className="font-mono text-green-400 text-[0.9em]">ls</code> con{' '}
            <code className="font-mono text-green-400 text-[0.9em]">opendir() / readdir() / stat()</code>,{' '}
            <code className="font-mono text-green-400 text-[0.9em]">cat</code> con{' '}
            <code className="font-mono text-green-400 text-[0.9em]">open() / read()</code>, y así
            sucesivamente con cada uno de los comandos. La columna{' '}
            <span className="text-gray-300">systemcall</span> de cada tarjeta indica
            exactamente qué llamada al kernel se usó en la práctica.
          </p>
        </section>

        {categorias.map((cat) => (
          <section key={cat.categoria}>
            {/* Header de categoría */}
            <header className="flex items-baseline justify-between gap-4 mb-6 pb-3 border-b border-white/10">
              <p className="font-mono text-[11px] text-green-400 uppercase tracking-[0.2em]">
                // {cat.categoria}
              </p>
            </header>

            <div className="mb-4 border border-white/10 rounded-lg bg-[#0d0d0d] overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-white/10">
                <div className="px-5 py-4">
                  <p className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-2">
                    // comando (shell)
                  </p>
                  <span className="font-mono text-sm font-medium text-purple-400">
                    {cat.comandos[0].nombre}
                  </span>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    Lo que se escribe en la terminal.
                  </p>
                </div>
                <div className="px-5 py-4">
                  <p className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-2">
                    // función (C / systemcall)
                  </p>
                  <span className="font-mono text-sm text-green-400 break-all">
                    {cat.comandos[0].syscall}
                  </span>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    Lo que se usa para programarlo en C.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden">
              {cat.comandos.map((cmd, i) => (
                <article
                  key={cmd.nombre}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="animate-fade-up bg-[#0a0a0a] hover:bg-[#141414] transition-colors p-5 flex flex-col gap-3"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-sm font-medium text-purple-400">
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
        <FooterNav
          className="mt-4"
          prevHref="/temario"
          prevLabel="Temario del curso"
          nextHref="/codigo"
          nextLabel="Prácticas y código"
        />
      </div>
    </main>
  )
}