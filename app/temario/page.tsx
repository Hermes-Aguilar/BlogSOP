'use client'

import { useState } from 'react'
import Link from 'next/link'
import PageHero from '../components/PageHero'
import FooterNav from '../components/FooterNav'

type Tema = {
  id: string
  titulo: string
  descripcion: string
  contexto: string
  codigoEjemplo: string
  practicaId: number | null
  practicaTitulo?: string
  aprendidoHermes: string
  aprendidoGuadalupe: string
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
          'Linux es un sistema operativo tipo Unix de código abierto cuyo núcleo (kernel) gestiona el hardware, los procesos, la memoria y el sistema de archivos. Durante el curso se utilizó Parrot OS (basado en Debian) como entorno de trabajo, accediendo a las systemcalls del kernel directamente desde C.',
        contexto:
          'Linus Torvalds inició el kernel en 1991 inspirado en MINIX. Hoy es la base de Android, servidores web, supercomputadoras y distribuciones como Debian, Ubuntu o Parrot. Lo que lo hace especial es que TODO está expuesto: archivos en /proc para leer el estado del sistema, /dev para hablar con el hardware y systemcalls públicas para que cualquier programa pueda pedir servicios al kernel.',
        codigoEjemplo: `/*
 * Ejemplo 1.1 — Invocar comandos del sistema desde C.
 * system("uname -a") imprime la información completa del kernel.
 */
#include <stdio.h>
#include <stdlib.h>

int main() {
    system("uname -a");
    return 0;
}`,
        practicaId: null,
        aprendidoHermes:
          'Aprendí que el SO no es solo una interfaz: es la capa que traduce las llamadas del programa en operaciones reales sobre el hardware. Linux expone esa capa con archivos en /proc, /dev y systemcalls públicas, lo que permite estudiar al kernel desde adentro.',
        aprendidoGuadalupe:
          'Lo más interesante para mí fue entender que Linux no es un solo programa, sino un sistema modular: el kernel maneja el hardware, el shell traduce nuestros comandos y los procesos viven encima. Esa separación de responsabilidades es lo que lo hace tan estable.',
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
        contexto:
          'Cada proceso pasa por estados (nuevo → listo → ejecutando → bloqueado → terminado) que el planificador del kernel administra. El kernel guarda el estado completo (registros de CPU, descriptores abiertos, memoria virtual) en task_struct, y eso le permite suspender un proceso y reanudarlo más tarde sin que pierda nada de su trabajo.',
        codigoEjemplo: `/*
 * Ejemplo 2.1 — Imprime el PID del proceso actual.
 * getpid() devuelve el identificador único asignado por el kernel
 * a este proceso en particular.
 */
#include <stdio.h>
#include <unistd.h>

int main() {
    printf("PID del proceso: %d\n", getpid());
    return 0;
}`,
        practicaId: null,
        aprendidoHermes:
          'Entendí que cada vez que ejecutamos un binario, Linux crea un task_struct con su propio espacio de direcciones. La variable x del padre y la del hijo viven en memorias distintas aunque se llamen igual.',
        aprendidoGuadalupe:
          'Ver el ciclo completo de un proceso (nuevo → listo → ejecutando → terminado) me ayudó a entender por qué a veces un programa "se cuelga": no está roto, solo está bloqueado esperando un recurso o I/O.',
      },
      {
        id: '2.2',
        titulo: 'Sistema de llamado para crear procesos — fork()',
        descripcion:
          'fork() duplica el proceso actual creando un hijo idéntico. Devuelve 0 al hijo, el PID del hijo al padre, o -1 si falla. A partir de ese punto ambos procesos ejecutan el mismo código pero con memorias separadas.',
        contexto:
          'Linux usa una optimización llamada copy-on-write: la memoria del padre no se duplica de inmediato, sino solo cuando alguno de los dos la modifica. Eso hace que fork() sea barato aunque parezca que clona megabytes. El truco está en el valor de retorno: una sola llamada, dos respuestas distintas según en qué proceso te encuentres después.',
        codigoEjemplo: `/*
 * Ejemplo 2.2 — Crea un proceso hijo con fork().
 * El hijo recibe pid==0 y ejecuta la primera rama;
 * el padre recibe el PID del hijo y ejecuta la otra.
 */
#include <stdio.h>
#include <unistd.h>

int main() {
    pid_t pid = fork();

    if(pid == 0)
        printf("Soy el proceso hijo\n");
    else
        printf("Soy el proceso padre\n");

    return 0;
}`,
        practicaId: null,
        aprendidoHermes:
          'Aprendí que fork() es el único mecanismo en Unix para crear procesos nuevos, y que SIEMPRE hay que validar el retorno: -1 significa que el sistema no pudo crear el proceso (límite de procesos, falta de memoria, etc).',
        aprendidoGuadalupe:
          'Me sorprendió que fork() devuelva DOS valores diferentes en el mismo punto del código: 0 para el hijo y un PID para el padre. Esa es la forma elegante en que cada proceso sabe quién es sin tener que preguntarlo.',
      },
      {
        id: '2.4',
        titulo: 'Sistema de llamado para identificar procesos — getpid() / getppid()',
        descripcion:
          'getpid() devuelve el PID del proceso actual y getppid() el PID de su padre. Son la forma más sencilla de verificar la jerarquía de procesos creada por fork().',
        contexto:
          'El PID 1 es especial: es el primer proceso que arranca el kernel (init en sistemas viejos, systemd en Linux moderno) y todos los demás procesos descienden de él. Si un proceso se queda huérfano (su padre muere antes), el PID 1 lo adopta automáticamente para que pueda ser cosechado correctamente.',
        codigoEjemplo: `/*
 * Ejemplo 2.4 — Imprime el PID propio y el PID del padre.
 * Sirve para visualizar la jerarquía padre-hijo de procesos.
 */
#include <stdio.h>
#include <unistd.h>

int main() {
    printf("PID del proceso: %d\n", getpid());
    printf("PID del padre: %d\n", getppid());
    return 0;
}`,
        practicaId: null,
        aprendidoHermes:
          'Vi que después de fork() el hijo conserva como PPID el PID del padre, lo que permite reconstruir el árbol de procesos. Si el padre muere antes que el hijo, el PPID del hijo cambia a 1 (init/systemd).',
        aprendidoGuadalupe:
          'Me llamó la atención que los PIDs se reciclan: si un programa termina, su PID puede volver a usarse minutos después en otro proceso. Por eso nunca debes guardar un PID y asumir que sigue siendo el mismo.',
      },
      {
        id: '2.5',
        titulo: 'Sistema de llamada wait()',
        descripcion:
          'wait(&status) bloquea al padre hasta que cualquiera de sus hijos termine, y guarda el código de salida en status. Es indispensable para evitar que los hijos queden en estado zombi.',
        contexto:
          'Además del PID, wait devuelve un status que se inspecciona con macros: WIFEXITED indica si el hijo terminó normalmente y WEXITSTATUS extrae su código de salida. Esto le permite al padre saber si un hijo falló o terminó con éxito, y reaccionar en consecuencia.',
        codigoEjemplo: `/*
 * Ejemplo 2.5 — El padre crea un hijo y espera con wait()
 * a que termine. Sin wait(), el hijo quedaría en estado zombi.
 */
#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>

int main() {
    pid_t pid = fork();

    if(pid == 0) {
        printf("Hijo ejecutándose\n");
    } else {
        wait(NULL);
        printf("Padre: hijo terminado\n");
    }

    return 0;
}`,
        practicaId: null,
        aprendidoHermes:
          'Aprendí que sin wait() los hijos terminan pero su entrada en la tabla de procesos queda hasta que el padre la lea. Si el padre nunca llama a wait(), se acumulan zombis y se agotan los PIDs.',
        aprendidoGuadalupe:
          'Para mí lo importante fue ver que wait() es comunicación: el hijo le pasa silenciosamente al padre su código de salida, y el padre decide qué hacer (reintentar, abortar, continuar). Es la forma más simple de "reportar resultados" entre procesos.',
      },
      {
        id: '2.5.1',
        titulo: 'Uso de waitpid()',
        descripcion:
          'waitpid(pid, &status, opciones) es la versión específica de wait(): permite esperar a un hijo concreto por su PID, o usar opciones como WNOHANG para no bloquear. Es lo que se usa cuando el orden de finalización importa.',
        contexto:
          'Las opciones más útiles son WNOHANG (no bloquea, devuelve 0 si el hijo aún no termina, ideal para hacer polling sin congelar al padre) y WUNTRACED (también detecta hijos detenidos por una señal, no solo terminados). Esto le da al padre control fino sobre cómo y cuándo enterarse del estado de cada hijo.',
        codigoEjemplo: `/*
 * Ejemplo 2.5.1 — waitpid() para esperar a un hijo específico.
 * El padre solo se desbloquea cuando el hijo del PID indicado
 * termina (o cuando se cumple la opción WNOHANG/WUNTRACED).
 */
#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>

int main() {
    pid_t pid = fork();

    if(pid == 0) {
        printf("Hijo ejecutándose\n");
    } else {
        waitpid(pid, NULL, 0);
        printf("Padre: hijo %d terminado\n", pid);
    }

    return 0;
}`,
        practicaId: 6,
        practicaTitulo: 'Práctica 1.1 — Árbol binario de procesos',
        aprendidoHermes:
          'En el árbol binario de procesos, waitpid() fue clave: cada padre debía esperar exactamente a sus dos hijos, no a cualquier hijo. Sin waitpid() los reportes de "termina hijo X" salían desordenados.',
        aprendidoGuadalupe:
          'WNOHANG me cambió la perspectiva: con esa opción el padre puede seguir trabajando y solo de vez en cuando preguntar "¿ya terminó alguno?". Es muy parecido al async/await de otros lenguajes pero a nivel de procesos.',
      },
      {
        id: '2.6',
        titulo: 'Sistema de llamada _exit() y exit()',
        descripcion:
          'exit(n) termina el proceso ejecutando antes los handlers registrados con atexit() y vaciando los buffers de stdio. _exit(n) es la versión cruda: termina inmediatamente sin tocar buffers, lo que es importante después de fork() para no imprimir dos veces lo mismo.',
        contexto:
          'exit() sigue tres pasos antes de morir: ejecuta funciones registradas con atexit(), vacía los buffers de stdio (printf, fwrite) y luego llama a _exit(). _exit() es la versión directa al kernel, sin pasar por la librería estándar de C. Por eso es la opción correcta cuando un hijo debe terminar sin tocar el estado heredado del padre.',
        codigoEjemplo: `/*
 * Ejemplo 2.6 — exit(0) termina el proceso de inmediato.
 * Las líneas posteriores nunca se ejecutan.
 */
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main() {
    printf("Usando exit()\n");
    exit(0);

    printf("Esto no se ejecuta\n");
    return 0;
}`,
        practicaId: null,
        aprendidoHermes:
          'Aprendí la diferencia sutil pero crítica: si después de fork() el hijo llama a exit() en vez de _exit(), puede vaciar buffers heredados del padre y producir salida duplicada. _exit() evita ese problema.',
        aprendidoGuadalupe:
          'Me costó entender al principio por qué existirían dos formas de terminar un programa, pero hace sentido: exit() es para terminar "limpiamente" (cerrar archivos, vaciar logs); _exit() es para emergencias o procesos hijos donde no quieres tocar el estado heredado.',
      },
      {
        id: '2.7',
        titulo: 'Estado Zombi',
        descripcion:
          'Un proceso zombi es uno que ya terminó pero cuyo padre todavía no ha llamado a wait() para leer su código de salida. El kernel mantiene una entrada mínima (PID + status) hasta que se cosecha. Si nunca se hace, el zombi persiste.',
        contexto:
          'El nombre es literal: el proceso ya "murió" (terminó su ejecución) pero su entrada sigue en el sistema, sin poder hacer nada, esperando a ser cosechado por su padre. Solo se libera cuando el padre llama a wait(), o cuando el padre también muere y systemd (PID 1) se encarga de adoptarlo y limpiarlo.',
        codigoEjemplo: `/*
 * Ejemplo 2.7 — Crea un zombi de forma intencional:
 * el hijo termina rápido pero el padre no llama a wait(),
 * dejando al hijo en estado zombi durante 20 segundos.
 * (Verifica con: ps -el | grep Z)
 */
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main() {
    pid_t pid = fork();

    if(pid == 0) {
        printf("Hijo terminado\n");
        exit(0);
    } else {
        sleep(20); // Padre no usa wait()
    }

    return 0;
}`,
        practicaId: null,
        aprendidoHermes:
          'En clase vimos que un zombi no consume memoria ni CPU, solo un slot en la tabla de PIDs. Pero acumular miles de zombis agota los PIDs disponibles y bloquea fork(). La solución es siempre cosechar con wait/waitpid o ignorar SIGCHLD.',
        aprendidoGuadalupe:
          'El nombre me pareció gracioso pero el concepto es serio: un proceso "muerto pero presente" que ocupa un lugar inútilmente. Me gustó descubrir que systemd se encarga de los huérfanos cuando el padre muere primero.',
      },
      {
        id: '2.8',
        titulo: 'Hilos',
        descripcion:
          'A diferencia de los procesos, los hilos comparten el mismo espacio de direcciones del proceso que los crea. Eso los hace mucho más ligeros pero también más peligrosos: cualquier hilo puede modificar memoria del otro sin avisar, lo que obliga a sincronizar con mutex y variables de condición.',
        contexto:
          'Los hilos comparten todo el espacio de direcciones del proceso (variables globales, heap, descriptores de archivos), así que la comunicación entre ellos es directa: leer y escribir variables. Pero esa misma facilidad es el problema: dos hilos modificando la misma variable a la vez producen condiciones de carrera (race conditions) que solo se manifiestan a veces y son muy difíciles de depurar.',
        codigoEjemplo: `/*
 * Ejemplo 2.8 — Crea un hilo nuevo que ejecuta "mensaje".
 * pthread_join espera a que el hilo termine antes de continuar.
 * Compilar con: gcc archivo.c -lpthread
 */
#include <stdio.h>
#include <pthread.h>

void* mensaje(void* arg) {
    printf("Hola desde el hilo\n");
    return NULL;
}

int main() {
    pthread_t hilo;
    pthread_create(&hilo, NULL, mensaje, NULL);
    pthread_join(hilo, NULL);
    return 0;
}`,
        practicaId: null,
        aprendidoHermes:
          'Comprendí que el modelo "varios hilos en un proceso" es más rápido que "varios procesos" porque no hay que copiar memoria, pero exige disciplina: una variable global accedida por dos hilos sin mutex es un bug latente.',
        aprendidoGuadalupe:
          'Lo que más me gustó fue la analogía: un proceso es como una casa entera, los hilos son las personas viviendo dentro. Comparten todo (cocina, sala, refri), pero si dos quieren usar la misma cuchara al mismo tiempo, alguien tiene que coordinar.',
      },
      {
        id: '2.8.2',
        titulo: 'Creación de hilos — pthread_create()',
        descripcion:
          'pthread_create(&tid, NULL, funcion, arg) crea un nuevo hilo dentro del proceso actual que ejecutará "funcion(arg)". Termina el hilo con pthread_exit() o cuando la función retorna, y se cosecha con pthread_join().',
        contexto:
          'pthreads (POSIX threads) es el estándar Unix para hilos. Un hilo creado con pthread_create se considera "joinable" por defecto: alguien debe llamar a pthread_join() para liberar sus recursos. Si quieres que el hilo se limpie solo cuando termine, se le marca como "detached" con pthread_detach().',
        codigoEjemplo: `/*
 * Ejemplo 2.8.2 — Mismo patrón que 2.8:
 * pthread_create lanza un hilo, pthread_join lo cosecha al final.
 */
#include <stdio.h>
#include <pthread.h>

void* mensaje(void* arg) {
    printf("Hola desde el hilo\n");
    return NULL;
}

int main() {
    pthread_t hilo;
    pthread_create(&hilo, NULL, mensaje, NULL);
    pthread_join(hilo, NULL);
    return 0;
}`,
        practicaId: null,
        aprendidoHermes:
          'Aunque no implementamos hilos en las prácticas finales, entendí que pthread_create es a los hilos lo que fork() es a los procesos: el punto de entrada para concurrencia, pero con memoria compartida en lugar de duplicada.',
        aprendidoGuadalupe:
          'Me quedó claro por qué se usan tanto los hilos: en programas con interfaz gráfica el hilo principal pinta la UI y los hilos secundarios hacen el trabajo pesado en segundo plano. Sin eso la app se "congelaría" cada vez que pasara algo lento.',
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
        contexto:
          'El operador | del shell que escribes a diario (por ejemplo "ls | grep .c") usa exactamente este mecanismo: el shell crea un pipe, conecta la salida del primer comando a la entrada del segundo y los corre en paralelo. Es uno de los inventos más elegantes de Unix y la razón por la que se pueden encadenar comandos sin esfuerzo.',
        codigoEjemplo: `/*
 * Ejemplo 3.1 — Comunicación padre→hijo usando un pipe.
 * El padre escribe un mensaje en fd[1] y el hijo lo lee
 * desde fd[0]. Cada extremo cierra el descriptor que no usa.
 */
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>

int main() {
    int fd[2];
    pid_t pid;
    char mensaje[] = "Hola desde el padre";
    char buffer[100];

    if(pipe(fd) == -1) {
        perror("Error al crear pipe");
        exit(EXIT_FAILURE);
    }

    pid = fork();

    if(pid == 0) {
        close(fd[1]); // hijo cierra escritura
        read(fd[0], buffer, sizeof(buffer));
        printf("Hijo recibió: %s\n", buffer);
        close(fd[0]);
    } else {
        close(fd[0]); // padre cierra lectura
        write(fd[1], mensaje, strlen(mensaje) + 1);
        close(fd[1]);
    }

    return 0;
}`,
        practicaId: null,
        aprendidoHermes:
          'Aprendí que un pipe es básicamente un buffer FIFO en kernel-space con dos descriptores: uno para escribir y otro para leer. Para comunicación bidireccional hay que crear DOS pipes (uno por sentido), no se puede leer y escribir en el mismo.',
        aprendidoGuadalupe:
          'Me cambió la forma de ver el shell: cada vez que escribes algo como "ps aux | grep firefox" estás creando dos procesos y conectándolos con un pipe. Era algo que usaba todos los días sin saber lo que hacía por dentro.',
      },
      {
        id: '3.1.1',
        titulo: 'Tuberías sin nombre — pipe()',
        descripcion:
          'pipe(fd) crea un pipe anónimo y devuelve dos descriptores: fd[0] para lectura y fd[1] para escritura. Solo sirve entre procesos relacionados (padre-hijo) porque los descriptores se heredan a través de fork().',
        contexto:
          'Lo crítico al usarlo: el padre y el hijo heredan ambos descriptores tras fork(), y CADA UNO debe cerrar el extremo que no usa. Si no lo haces, read() nunca recibe EOF porque el kernel cree que alguien todavía puede escribir, y el lector se queda colgado para siempre.',
        codigoEjemplo: `/*
 * Ejemplo 3.1.1 — Uso básico de pipe() en un solo proceso.
 * Se escribe en fd[1] y se lee desde fd[0] como demostración.
 */
#include <stdio.h>
#include <unistd.h>
#include <string.h>

int main() {
    int fd[2];
    char mensaje[] = "Hola pipe";
    char buffer[20];

    pipe(fd);

    write(fd[1], mensaje, strlen(mensaje)+1);
    read(fd[0], buffer, sizeof(buffer));

    printf("Mensaje recibido: %s\n", buffer);
    return 0;
}`,
        practicaId: 7,
        practicaTitulo: 'Práctica 1.2 — Factorial con pipe bidireccional',
        aprendidoHermes:
          'En la práctica del factorial usamos dos pipes para que padre e hijo se intercambiaran un número y el resultado. Lo más confuso al principio fue cerrar los extremos no usados: si no cierras fd[1] del lector, el read() nunca devuelve EOF.',
        aprendidoGuadalupe:
          'La regla de "cerrar lo que no usas" me costó al principio porque parecía innecesaria, pero después entendí: el pipe está vivo mientras alguien tenga su descriptor abierto, así que para que el receptor sepa que el emisor terminó, todos los demás extremos deben estar cerrados.',
      },
      {
        id: '3.1.2',
        titulo: 'Tuberías con nombre — FIFO',
        descripcion:
          'Una FIFO (named pipe) es un pipe que existe como entrada en el sistema de archivos, creado con mkfifo(). A diferencia del pipe anónimo, dos procesos sin relación de parentesco pueden abrirlo por su ruta y comunicarse.',
        contexto:
          'Las FIFOs sobreviven al proceso que las creó: existen en el filesystem hasta que se borran con unlink(). Esto permite que un programa cree la FIFO al arrancar y otros se conecten después, incluso minutos más tarde. Es ideal para arquitecturas productor/consumidor donde los procesos no se conocen entre sí.',
        codigoEjemplo: `/*
 * Ejemplo 3.1.2 — Crea una FIFO en el filesystem.
 * Cualquier otro proceso podrá abrirla por su ruta "mi_fifo"
 * para leer o escribir, sin necesidad de fork().
 */
#include <stdio.h>
#include <sys/stat.h>

int main() {
    mkfifo("mi_fifo", 0666);
    printf("FIFO creada\n");
    return 0;
}`,
        practicaId: 8,
        practicaTitulo: 'Práctica 2 — Productor / Consumidor por FIFO',
        aprendidoHermes:
          'En la práctica productor/consumidor usamos /tmp/matriz_fifo. Lo interesante es que open() bloquea hasta que el otro lado también abra: eso es sincronización gratis, sin necesidad de semáforos.',
        aprendidoGuadalupe:
          'Me gustó que las FIFOs aparezcan como archivos normales en ls: tienen un permiso, un dueño, una ruta. Eso las hace muy intuitivas: dos programas independientes pueden encontrarse simplemente acordando una ruta como "/tmp/mi_fifo".',
      },
      {
        id: '3.2',
        titulo: 'Mecanismos IPC derivados de System V',
        descripcion:
          'System V IPC agrupa tres mecanismos: semáforos, memoria compartida y colas de mensajes. Todos comparten la misma filosofía: se identifican con una llave (key_t), se obtienen con *get(), se operan y se destruyen con *ctl(IPC_RMID).',
        contexto:
          'Apareció en los años 80 con AT&T System V Unix. Es verboso pero muy poderoso: el ciclo de vida de cada recurso es explícito (crear con *get, operar con *op/*at, destruir con *ctl(IPC_RMID)). Si no lo limpias correctamente, los recursos quedan colgando hasta el próximo reboot, y eso fue una de las trampas más comunes de las prácticas.',
        codigoEjemplo: `/*
 * Ejemplo 3.2 — Flujo común en System V IPC:
 * obtener una llave que servirá para crear cualquier
 * recurso (semáforo, shm o cola).
 */
#include <stdio.h>
#include <sys/ipc.h>

int main() {
    key_t clave = ftok("archivo", 1);
    printf("Llave System V: %d\n", clave);
    return 0;
}`,
        practicaId: 0,
        practicaTitulo: 'Investigación — Mecanismos IPC del Kernel de Linux',
        aprendidoHermes:
          'Entendí que System V IPC es el modelo "clásico" pero verboso: cada operación necesita varias systemcalls. POSIX IPC es la alternativa moderna y más limpia, pero el curso se enfocó en System V porque expone mejor lo que hace el kernel.',
        aprendidoGuadalupe:
          'Aunque la sintaxis es fea (semget, shmget, msgget...) me sirvió para apreciar las APIs modernas. Cuando ahora veo un mutex en Python o un canal en Go, sé que por debajo hay todo este "trabajo sucio" que System V nos hizo escribir a mano.',
      },
      {
        id: '3.2.1',
        titulo: 'Llaves — ftok() / IPC_PRIVATE',
        descripcion:
          'Una llave es un entero (key_t) que identifica de forma única un recurso IPC en todo el sistema. Se genera con ftok(ruta, id) a partir de un archivo existente, o se usa IPC_PRIVATE para pedir una llave nueva privada al proceso.',
        contexto:
          'Las llaves resuelven un problema concreto: cómo hacen dos procesos sin parentesco para ponerse de acuerdo sobre qué recurso IPC compartir. La respuesta es ftok(): si los dos llaman ftok con la misma ruta y el mismo id, obtienen exactamente el mismo número, sin necesidad de coordinarse de antemano.',
        codigoEjemplo: `/*
 * Ejemplo 3.2.1 — Genera una llave única con ftok()
 * a partir de un archivo existente y un identificador entero.
 * El archivo "archivo" debe existir; sirve solo de referencia.
 */
#include <stdio.h>
#include <sys/ipc.h>

int main() {
    key_t clave = ftok("archivo", 65);
    printf("Clave generada: %d\n", clave);
    return 0;
}`,
        practicaId: null,
        aprendidoHermes:
          'Aprendí que ftok() es determinista: la misma ruta y el mismo id producen siempre la misma llave, lo que permite que dos programas independientes encuentren el mismo recurso IPC sin acordarlo previamente.',
        aprendidoGuadalupe:
          'IPC_PRIVATE me confundió al principio porque "privado" suena a "solo para mí", pero en realidad significa "una llave nueva, no la comparten con nadie más". Es lo que se usa cuando padre e hijo se comunican: el hijo hereda la llave por fork().',
      },
      {
        id: '3.2.2',
        titulo: 'Semáforos en derivados de System V',
        descripcion:
          'Los semáforos son contadores controlados por el kernel que sincronizan accesos. semget() crea el conjunto, semop() ejecuta operaciones P (decrementa, espera) y V (incrementa, libera), y semctl() los inicializa o destruye.',
        contexto:
          'La operación P (decrementa) bloquea si el contador llega a cero, lo que se usa para "pedir permiso". La operación V (incrementa) libera y despierta a alguien bloqueado. Con un semáforo inicializado en 1 implementas un mutex; con uno inicializado en N controlas un pool de N recursos simultáneos.',
        codigoEjemplo: `/*
 * Ejemplo 3.2.2 — Crea un conjunto de semáforos System V.
 * IPC_CREAT crea el conjunto si no existe;
 * 0666 son los permisos (lectura/escritura para todos).
 */
#include <stdio.h>
#include <sys/ipc.h>
#include <sys/sem.h>

int main() {
    key_t key = ftok("archivo", 65);
    int semid = semget(key, 1, 0666 | IPC_CREAT);
    printf("Semáforo creado: %d\n", semid);
    return 0;
}`,
        practicaId: 10,
        practicaTitulo: 'Fuerza bruta — Semáforos + Memoria Compartida + crypt()',
        aprendidoHermes:
          'En el ataque de fuerza bruta usamos SEM_VACIO y SEM_LLENO para coordinar productor y consumidor sobre la memoria compartida. Aprendí que un semáforo no es solo un mutex: es un contador, lo que permite controlar varios recursos simultáneos.',
        aprendidoGuadalupe:
          'La analogía del baño público me ayudó: el semáforo es la cantidad de baños libres. P() es "voy a usar uno" (decrementa); V() es "ya salí" (incrementa). Si llegas y no hay (contador=0), te tienes que esperar.',
      },
      {
        id: '3.3',
        titulo: 'Memoria compartida',
        descripcion:
          'shmget() crea un segmento de memoria compartida, shmat() lo mapea al espacio de direcciones del proceso, shmdt() lo desmapea y shmctl(IPC_RMID) lo libera. Es el IPC más rápido porque no hay copias: ambos procesos leen y escriben directo en la misma RAM.',
        contexto:
          'Es el IPC más rápido porque ambos procesos leen y escriben en la MISMA región de RAM, sin copias entre kernel y user-space. Esa velocidad se paga con disciplina: si dos procesos escriben al mismo tiempo, se pisan los datos. Por eso casi siempre se acompaña con un semáforo que controla quién puede tocar la región y cuándo.',
        codigoEjemplo: `/*
 * Ejemplo 3.3 — Reserva un segmento de memoria compartida
 * de 1024 bytes. shmget devuelve un ID que después se mapea
 * al espacio de direcciones con shmat().
 */
#include <stdio.h>
#include <sys/ipc.h>
#include <sys/shm.h>

int main() {
    key_t key = ftok("archivo", 65);
    int shmid = shmget(key, 1024, 0666 | IPC_CREAT);
    printf("Memoria compartida ID: %d\n", shmid);
    return 0;
}`,
        practicaId: 10,
        practicaTitulo: 'Fuerza bruta — Semáforos + Memoria Compartida + crypt()',
        aprendidoHermes:
          'Aprendí que shmget no copia memoria: solo da un puntero a una región que existe una sola vez en el kernel. Por eso siempre debe ir acompañado de un semáforo o mutex, porque sin sincronización dos procesos pisan los datos del otro.',
        aprendidoGuadalupe:
          'Lo que más me gustó es la velocidad: como no hay copias, escribir y leer es prácticamente instantáneo. Por eso bases de datos como PostgreSQL o cosas como X11 lo usan internamente para mover gigabytes entre procesos sin bloquear el sistema.',
      },
      {
        id: '3.4',
        titulo: 'Cola de mensajes',
        descripcion:
          'Las colas de mensajes (msgget / msgsnd / msgrcv / msgctl) permiten enviar mensajes tipados entre procesos. A diferencia de los pipes, los mensajes mantienen su frontera y se pueden filtrar por tipo al recibirlos.',
        contexto:
          'La gran ventaja sobre los pipes es que cada mensaje conserva su estructura: si envías un struct de 50 bytes, el receptor recibe esos 50 bytes como una unidad, no un stream que hay que parsear. Además, los mensajes tienen tipo y se pueden recibir filtrando por tipo, lo que sirve para colas con múltiples productores/consumidores.',
        codigoEjemplo: `/*
 * Ejemplo 3.4 — Crea una cola de mensajes System V.
 * msgget devuelve el ID que después usarán
 * msgsnd (enviar) y msgrcv (recibir).
 */
#include <stdio.h>
#include <sys/ipc.h>
#include <sys/msg.h>

int main() {
    key_t key = ftok("archivo", 65);
    int msgid = msgget(key, 0666 | IPC_CREAT);
    printf("Cola de mensajes ID: %d\n", msgid);
    return 0;
}`,
        practicaId: 11,
        practicaTitulo: 'who_colas — WHO con colas de mensajes System V',
        aprendidoHermes:
          'En who_colas el padre enviaba cada sesión como un mensaje y el hijo los recibía y formateaba. Lo bonito de las colas es que conservan estructura: no tienes que parsear bytes, recibes el struct completo.',
        aprendidoGuadalupe:
          'El "tipo" de cada mensaje me pareció muy útil: puedes tener varios productores enviando a la misma cola y cada consumidor solo recibe los mensajes del tipo que le interesa. Es como tener canales de Discord pero a nivel de procesos.',
      },
      {
        id: '3.5',
        titulo: 'Información de IPC por medio de comandos del sistema',
        descripcion:
          'Linux ofrece comandos para inspeccionar y limpiar recursos IPC: ipcs lista semáforos, memoria compartida y colas activas; ipcrm los elimina por id o llave. /proc/sys/kernel/ permite ver y ajustar los límites del sistema.',
        contexto:
          'ipcs muestra todos los recursos IPC activos en el sistema (con id, owner, permisos). ipcrm los elimina por id o llave. /proc/sys/kernel/sem expone los límites del kernel para semáforos, /proc/sys/kernel/shmmax el máximo de memoria compartida, etc. Son los comandos que te salvan cuando un programa se cae sin limpiar y deja recursos colgando.',
        codigoEjemplo: `/*
 * Ejemplo 3.5 — Lanza el comando ipcs desde C
 * para listar los recursos IPC activos del sistema:
 * semáforos, memoria compartida y colas de mensajes.
 */
#include <stdlib.h>

int main() {
    system("ipcs");
    return 0;
}`,
        practicaId: null,
        aprendidoHermes:
          'Aprendí que un programa que se cae sin liberar IPC deja "fugas" persistentes: el segmento de shm o el semáforo siguen ocupando recursos hasta que reinicies o uses ipcrm. Es un error muy fácil de cometer y muy difícil de detectar sin ipcs.',
        aprendidoGuadalupe:
          'Para mí ipcs fue como descubrir el "administrador de tareas" pero para IPC: te muestra exactamente qué recursos están abiertos, quién los creó y cuántos bytes ocupan. Sin eso, los bugs de fugas eran imposibles de encontrar.',
      },
    ],
  },
  {
    num: '04',
    titulo: 'Proyecto integrador — Mini Shell',
    resumen: 'Shell personalizado en C que integra systemcalls de archivos, procesos y red.',
    temas: [
      {
        id: '4.1',
        titulo: 'Mini Shell — Shell personalizado en C',
        descripcion:
          'Como cierre del semestre se construyó un shell desde cero con tabla de despacho. Implementa más de 20 comandos (pwd, cd, ls, stat, statvfs, find, cat, ip, mac, who, mesg, wall, dev, free, date, uname, etc) usando systemcalls directas de Linux. Cada comando del shell es una llamada al kernel disfrazada de texto.',
        contexto:
          'El shell es el orquestador clásico de un sistema Unix: lee una línea, la parsea, decide si el comando es un builtin (cd, exit, etc) o un programa externo, y en este último caso hace fork+exec. Construir uno desde cero obliga a tocar casi todas las systemcalls del sistema y entender cómo se conectan entre sí.',
        codigoEjemplo: `/*
 * Ejemplo 4.1 — Esqueleto mínimo del Mini Shell:
 * lee una línea, la imprime y vuelve a empezar.
 * El shell completo (con tabla de comandos y ejecución
 * por syscalls) está en la práctica enlazada abajo.
 */
#include <stdio.h>
#include <string.h>

int main() {
    char linea[256];
    while (1) {
        printf("mini-shell$ ");
        if (!fgets(linea, sizeof(linea), stdin)) break;
        linea[strcspn(linea, "\n")] = 0;
        if (strcmp(linea, "exit") == 0) break;
        printf("comando ingresado: %s\n", linea);
    }
    return 0;
}`,
        practicaId: 1,
        practicaTitulo: 'Mini Shell — Shell personalizado en C',
        aprendidoHermes:
          'Construir un shell me hizo entender que casi nada del "user-land" de Linux es magia: ls es opendir+readdir+stat, ip es socket+ioctl, who es leer /run/systemd/sessions. Una vez que ves la systemcall debajo, dejas de ver al SO como caja negra.',
        aprendidoGuadalupe:
          'Implementar comandos como cd o pwd me hizo apreciar lo que damos por sentado: cada vez que escribes "cd .." el shell tiene que hablar con el kernel, validar permisos, actualizar variables. Y eso pasa en milisegundos cada vez.',
      },
    ],
  },
]

export default function Temario() {
  const [abierto, setAbierto] = useState<string | null>(null)

  return (
    <main className="bg-[#0a0a0a] text-gray-200">
      {/* HERO */}
      <PageHero
        kicker="// temario · proyecto ordinario"
        title="Temario"
        accent="— Sistemas Operativos"
        subtitle="Cada tema del programa explicado con su descripción, código de ejemplo y la práctica del semestre relacionada."
        image="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1400&q=80"
      />

      <div className="max-w-5xl mx-auto px-6 py-16">
        {capitulos.map((cap) => (
          <section key={cap.num} className="mb-16">
            {/* Header capítulo */}
            <div className="mb-6 pb-4 border-b border-white/10 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] text-green-400 uppercase tracking-[0.2em]">
                  // capítulo {cap.num}
                </p>
                <h2 className="text-2xl font-light text-gray-100 tracking-tight mt-1">
                  {cap.titulo}
                </h2>
                <p className="text-xs text-gray-500 mt-1.5">{cap.resumen}</p>
              </div>
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
                      {t.practicaId !== null && (
                        <span className="hidden sm:inline-flex font-mono text-[10px] text-amber-400 uppercase tracking-wider px-2 py-0.5 border border-amber-400/30 rounded">
                          práctica
                        </span>
                      )}
                      <span
                        className={`font-mono text-[11px] text-gray-500 transition-transform ${
                          isOpen ? 'rotate-90 text-green-400' : ''
                        }`}
                      >
                        ▸
                      </span>
                    </button>

                    <div className={`collapse-grid ${isOpen ? 'is-open' : ''}`}>
                      <div className="collapse-inner">
                        <div className="px-5 pb-6 pt-2 bg-[#070707]">
                          <div className="border-l-2 border-green-400/40 pl-5 sm:ml-12 flex flex-col gap-6">
                          {/* Descripción */}
                          <div>
                            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                              // qué es
                            </p>
                            <p className="text-sm text-gray-300 leading-relaxed mb-3">
                              {t.descripcion}
                            </p>
                            <p className="text-sm text-gray-400 leading-relaxed">
                              {t.contexto}
                            </p>
                          </div>

                          {/* Código del tema */}
                          <div>
                            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                              // código del tema
                            </p>
                            <div className="bg-black rounded-lg overflow-hidden border border-white/10">
                              <header className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-[#0d0d0d]">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70"></span>
                                <span className="font-mono text-[11px] text-gray-500 ml-2">
                                  ejemplo_{t.id.replace(/\./g, '_')}.c
                                </span>
                              </header>
                              <pre className="overflow-auto text-green-400 font-mono text-xs leading-relaxed p-4 whitespace-pre max-h-96">
{t.codigoEjemplo || '// código pendiente — se agregará próximamente'}
                              </pre>
                            </div>
                          </div>

                          {/* Práctica relacionada */}
                          {t.practicaId !== null && (
                            <div>
                              <p className="font-mono text-[10px] text-amber-400 uppercase tracking-wider mb-2">
                                // práctica relacionada
                              </p>
                              <Link
                                href={`/codigo?id=${t.practicaId}`}
                                className="group flex items-center gap-3 px-4 py-3 border border-amber-400/30 rounded-md hover:border-amber-400 hover:bg-amber-400/5 transition-colors"
                              >
                                <span className="font-mono text-[11px] text-amber-400 shrink-0">
                                  $
                                </span>
                                <span className="text-sm text-gray-200 flex-1 truncate">
                                  {t.practicaTitulo}
                                </span>
                                <span className="font-mono text-[11px] text-gray-500 group-hover:text-amber-400 transition-colors shrink-0">
                                  ver práctica →
                                </span>
                              </Link>
                            </div>
                          )}

                          {/* Lo que aprendimos — dos perspectivas */}
                          <div>
                            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-3">
                              // lo que aprendimos
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="border border-white/10 rounded-md p-4 bg-[#0a0a0a]">
                                <p className="font-mono text-[10px] text-green-400 uppercase tracking-wider mb-2">
                                  @hermes
                                </p>
                                <p className="text-sm text-gray-300 leading-relaxed italic">
                                  {t.aprendidoHermes}
                                </p>
                              </div>
                              <div className="border border-white/10 rounded-md p-4 bg-[#0a0a0a]">
                                <p className="font-mono text-[10px] text-amber-400 uppercase tracking-wider mb-2">
                                  @guadalupe
                                </p>
                                <p className="text-sm text-gray-300 leading-relaxed italic">
                                  {t.aprendidoGuadalupe}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}

        {/* NAV inferior */}
        <FooterNav
          prevHref="/"
          prevLabel="Inicio"
          nextHref="/laboratorio"
          nextLabel="Laboratorio de comandos"
        />
      </div>
    </main>
  )
}
