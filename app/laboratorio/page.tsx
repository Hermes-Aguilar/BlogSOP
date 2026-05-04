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

export default function Laboratorio() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <p className="font-mono text-xs text-green-600 tracking-widest uppercase mb-2">
        // laboratorio
      </p>
      <h1 className="text-2xl font-medium text-gray-900 mb-1">
        Laboratorio de comandos
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Syscalls y comandos implementados en Linux durante el segundo y tercer parcial.
      </p>

      <div className="flex flex-col gap-10">
        {categorias.map((cat) => (
          <div key={cat.categoria}>
            {/* Header de categoría */}
            <div className="flex items-center gap-3 mb-4">
              <p className="font-mono text-xs text-green-600 uppercase tracking-widest">
                // {cat.categoria}
              </p>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-mono">
                {cat.parcial}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {cat.comandos.map((cmd) => (
                <div
                  key={cmd.nombre}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Header del comando */}
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <span className="font-mono text-sm font-semibold text-gray-900">
                      {cmd.nombre}
                    </span>
                    <span className="font-mono text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded">
                      {cmd.syscall}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="px-4 py-3 flex flex-col gap-2">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {cmd.descripcion}
                    </p>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-start gap-3 text-xs">
                        <span className="font-mono text-gray-400 w-16 shrink-0">uso</span>
                        <code className="bg-gray-900 text-green-400 px-2 py-1 rounded font-mono">
                          {cmd.uso}
                        </code>
                      </div>
                      <div className="flex items-start gap-3 text-xs">
                        <span className="font-mono text-gray-400 w-16 shrink-0">output</span>
                        <span className="text-gray-500 italic">{cmd.ejemplo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}