'use client'

import { useState } from 'react'

const practicas = [
{
    id: 0,
    titulo: 'Investigación — Mecanismos IPC del Kernel de Linux',
    parcial: '2do parcial',
    descripcion: 'Investigación sobre los parámetros IPC en /proc/sys/kernel/: semáforos, memoria compartida y colas de mensajes. Incluye su relación con las syscalls.',
    lenguaje: 'text',
    mejoras: [
      'Agregar ejemplos prácticos de cuándo ajustar shmmax en bases de datos como PostgreSQL.',
      'Incluir un script de monitoreo que lea /proc/sys/kernel/ en tiempo real.',
      'Documentar cómo verificar los IPC activos con ipcs -a desde la terminal.',
      'Agregar una sección sobre POSIX IPC como alternativa moderna al System V.',
    ],
    codigo: ``,
  },
  
  {
    id: 1,
    titulo: 'Mini Shell — Shell personalizado en C',
    parcial: '3er parcial',
    descripcion: 'Shell interactivo implementado desde cero con tabla de despacho. Implementa 20+ comandos usando syscalls directas de Linux.',
    lenguaje: 'c',
    mejoras: [
      'Agregar historial de comandos con una estructura de cola circular.',
      'Implementar redirección de entrada/salida (>, <, >>).',
      'Agregar soporte para pipes entre comandos (cmd1 | cmd2).',
      'Manejar señales como SIGINT (Ctrl+C) para no matar el shell.',
      'Agregar autocompletado de rutas con Tab usando readline.',
    ],
    codigo: `#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <dirent.h>
#include <pwd.h>
#include <grp.h>
#include <time.h>
#include <sys/types.h>
#include <sys/statvfs.h>
#include <fcntl.h>
#include <sys/socket.h>
#include <ifaddrs.h>
#include <net/if.h>
#include <sys/ioctl.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <utmp.h>
#include <sys/utsname.h>
#include <sys/sysmacros.h>
#include <utmpx.h> 



#define RUTA_MAX  256
#define INPUT_MAX 256

#define COLOR_DIR     "033[1;34m"   // azul negrita  -> directorios
#define COLOR_EXEC    "033[1;32m"   // verde negrita -> ejecutables
#define COLOR_LINK    "033[1;36m"   // cian negrita  -> enlaces
#define COLOR_RESET   "033[0m"      // sin color

// MÓDULO: Comandos

static void modo_str(mode_t m, char *buf);

// Función para mostrar el directorio actual
static void cmd_pwd(const char *arg) {
    (void)arg;
    char cwd[RUTA_MAX];
    if (getcwd(cwd, sizeof(cwd)) != NULL)
        printf("%s\n", cwd);
}

// Función para cambiar de directorio
static void cmd_cd(const char *arg) {
    if (arg == NULL) { printf("Uso: cd \n"); return; }
    if (chdir(arg) != 0)
        printf("Error: No se puede acceder al directorio '%s'\n", arg);
}

// Función para crear un directorio
static void cmd_mkdir(const char *arg) {
    if (arg == NULL) { printf("Uso:\n"); return; }
    if (mkdir(arg, 0775) != 0)
        perror("Error al crear directorio");
}

// Función para mostrar las IPs de todas las interfaces usando ioctl
static void cmd_ip(const char *arg) {
    (void)arg;
    int sock = socket(AF_INET, SOCK_DGRAM, 0);
    if (sock < 0) { perror("socket"); return; }

    char buf[4096];
    struct ifconf ifc;
    ifc.ifc_len = sizeof(buf);
    ifc.ifc_buf = buf;
    if (ioctl(sock, SIOCGIFCONF, &ifc) < 0) {
        perror("ioctl SIOCGIFCONF"); close(sock); return;
    }

    struct ifreq *ifr = ifc.ifc_req;
    int n = ifc.ifc_len / (int)sizeof(struct ifreq);
    printf("  %-14s %s\n", "Interfaz", "IP");
    printf("  %-14s %s\n", "--------------", "---------------");
    for (int i = 0; i < n; i++) {
        struct ifreq req;
        strncpy(req.ifr_name, ifr[i].ifr_name, IFNAMSIZ - 1);
        char ip[INET_ADDRSTRLEN] = "no disponible";
        if (ioctl(sock, SIOCGIFADDR, &req) == 0) {
            struct sockaddr_in *sa = (struct sockaddr_in *)&req.ifr_addr;
            inet_ntop(AF_INET, &sa->sin_addr, ip, sizeof(ip));
        }
        printf("  %-14s %s\n", ifr[i].ifr_name, ip);
    }
    close(sock);
}

// Función para mostrar las MACs de todas las interfaces usando ioctl
static void cmd_mac(const char *arg) {
    (void)arg;
    int sock = socket(AF_INET, SOCK_DGRAM, 0);
    if (sock < 0) { perror("socket"); return; }

    char buf[4096];
    struct ifconf ifc;
    ifc.ifc_len = sizeof(buf);
    ifc.ifc_buf = buf;
    if (ioctl(sock, SIOCGIFCONF, &ifc) < 0) {
        perror("ioctl SIOCGIFCONF"); close(sock); return;
    }

    struct ifreq *ifr = ifc.ifc_req;
    int n = ifc.ifc_len / (int)sizeof(struct ifreq);
    printf("  %-14s %s\n", "Interfaz", "MAC");
    printf("  %-14s %s\n", "--------------", "-----------------");
    for (int i = 0; i < n; i++) {
        struct ifreq req;
        strncpy(req.ifr_name, ifr[i].ifr_name, IFNAMSIZ - 1);
        char mac[18] = "no disponible";
        if (ioctl(sock, SIOCGIFHWADDR, &req) == 0) {
            unsigned char *hw = (unsigned char *)req.ifr_hwaddr.sa_data;
            snprintf(mac, sizeof(mac), "%02x:%02x:%02x:%02x:%02x:%02x",
                     hw[0], hw[1], hw[2], hw[3], hw[4], hw[5]);
        }
        printf("  %-14s %s\n", ifr[i].ifr_name, mac);
    }
    close(sock);
}

// Función para listar el contenido de un directorio ls, ls -a, ls -la, ls -i, ls -l, ls -lai, ls -li
static void cmd_ls(const char *arg) {
    char flag[INPUT_MAX] = "";
    char ruta_buf[INPUT_MAX] = ".";

    if (arg != NULL) {
        char buffer[INPUT_MAX];
        strncpy(buffer, arg, INPUT_MAX);
        buffer[INPUT_MAX - 1] = '\0';

        char *token = strtok(buffer, " ");
        while (token != NULL) {
            if (token[0] == '-')
                strncpy(flag, token, INPUT_MAX - 1);
            else
                strncpy(ruta_buf, token, INPUT_MAX - 1);
            token = strtok(NULL, " ");
        }
    }

    int mostrar_ocultos = (strstr(flag, "a") != NULL); // -a, -la
    int formato_largo   = (strstr(flag, "l") != NULL); // -la
    int mostrar_inode   = (strstr(flag, "i") != NULL); // -i

    DIR *dir = opendir(ruta_buf);
    if (dir == NULL) {
        perror("Error al abrir directorio");
        return;
    }

    struct dirent *entrada;
    while ((entrada = readdir(dir)) != NULL) {
        if (!mostrar_ocultos && entrada->d_name[0] == '.') continue;

        char ruta_completa[RUTA_MAX];
        snprintf(ruta_completa, sizeof(ruta_completa), "%s/%s", ruta_buf, entrada->d_name);

        struct stat info;
        if (stat(ruta_completa, &info) != 0) continue;

        if (formato_largo) {
            char modo[11];
            modo_str(info.st_mode, modo);

            struct passwd *pw = getpwuid(info.st_uid);
            struct group  *gr = getgrgid(info.st_gid);

            char fecha[20];
            strftime(fecha, sizeof(fecha), "%b %d %H:%M", localtime(&info.st_mtime));

            const char *color = S_ISDIR(info.st_mode)  ? COLOR_DIR  :
                                S_ISLNK(info.st_mode)  ? COLOR_LINK :
                                (info.st_mode & S_IXUSR) ? COLOR_EXEC : COLOR_RESET;

            if (mostrar_inode) {
                printf("%lu %s %2lu %-8s %-8s %6lld %s %s%s%s\n",
                    (unsigned long)info.st_ino,
                    modo,
                    (unsigned long)info.st_nlink,
                    pw ? pw->pw_name : "?",
                    gr ? gr->gr_name : "?",
                    (long long)info.st_size,
                    fecha,
                    color, entrada->d_name, COLOR_RESET);
            } else {
                printf("%s %2lu %-8s %-8s %6lld %s %s%s%s\n",
                    modo,
                    (unsigned long)info.st_nlink,
                    pw ? pw->pw_name : "?",
                    gr ? gr->gr_name : "?",
                    (long long)info.st_size,
                    fecha,
                    color, entrada->d_name, COLOR_RESET);
            }
        } else if (mostrar_inode) {
            const char *color = S_ISDIR(info.st_mode)  ? COLOR_DIR  :
                                S_ISLNK(info.st_mode)  ? COLOR_LINK :
                                (info.st_mode & S_IXUSR) ? COLOR_EXEC : COLOR_RESET;
            printf("%lu %s%s%s\n", (unsigned long)info.st_ino, color, entrada->d_name, COLOR_RESET);
        } else {
            const char *color = S_ISDIR(info.st_mode)  ? COLOR_DIR  :
                                S_ISLNK(info.st_mode)  ? COLOR_LINK :
                                (info.st_mode & S_IXUSR) ? COLOR_EXEC : COLOR_RESET;
            printf("%s%s%s\n", color, entrada->d_name, COLOR_RESET);
        }
    }
    closedir(dir);
}



static void modo_str(mode_t m, char *buf) {
    buf[0] = S_ISDIR(m) ? 'd' : S_ISLNK(m) ? 'l' : S_ISBLK(m) ? 'b' :
             S_ISCHR(m) ? 'c' : S_ISFIFO(m) ? 'p' : S_ISSOCK(m) ? 's' : '-';
    buf[1] = (m & S_IRUSR) ? 'r' : '-';
    buf[2] = (m & S_IWUSR) ? 'w' : '-';
    buf[3] = (m & S_ISUID) ? 's' : (m & S_IXUSR) ? 'x' : '-';
    buf[4] = (m & S_IRGRP) ? 'r' : '-';
    buf[5] = (m & S_IWGRP) ? 'w' : '-';
    buf[6] = (m & S_ISGID) ? 's' : (m & S_IXGRP) ? 'x' : '-';
    buf[7] = (m & S_IROTH) ? 'r' : '-';
    buf[8] = (m & S_IWOTH) ? 'w' : '-';
    buf[9] = (m & S_IXOTH) ? 'x' : '-';
    buf[10] = '\0';
}

// Función para mostrar información de un archivo o directorio
static void cmd_stat(const char *arg) {
    if (arg == NULL) { printf("Uso: stat <ruta>\n"); return; }

    // Verificar con opendir si es directorio
    DIR *dir = opendir(arg);
    if (dir) {
        closedir(dir);
    }
    if (access(arg, F_OK) != 0) {
        printf("Error: '%s' no es una ruta válida\n", arg);
        return;
    }

    struct stat sb;
    if (stat(arg, &sb) != 0) { 
        perror("stat"); return; 
    }

    char modo[11];
    modo_str(sb.st_mode, modo);

    char tatime[32], tmtime[32], tctime[32];
    struct tm *tm;
    tm = localtime(&sb.st_atime); strftime(tatime, sizeof tatime, "%Y-%m-%d %H:%M:%S", tm);
    tm = localtime(&sb.st_mtime); strftime(tmtime, sizeof tmtime, "%Y-%m-%d %H:%M:%S", tm);
    tm = localtime(&sb.st_ctime); strftime(tctime, sizeof tctime, "%Y-%m-%d %H:%M:%S", tm);

    printf("  Archivo    : %s\n",         arg);
    printf("  Tamaño     : %lld bytes\n", (long long)sb.st_size);
    printf("  Bloques    : %lld (blksize=%ld)\n", (long long)sb.st_blocks, (long)sb.st_blksize);
    printf("  Modo       : %s (%o)\n",    modo, sb.st_mode & 07777);
    printf("  Inode      : %lu\n",        (unsigned long)sb.st_ino);
    printf("  Dispositivo: %lu\n",        (unsigned long)sb.st_dev);
    printf("  Enlaces    : %lu\n",        (unsigned long)sb.st_nlink);
    printf("  UID        : %u\n",         sb.st_uid);
    printf("  GID        : %u\n",         sb.st_gid);
    printf("  Acceso     : %s\n",         tatime);
    printf("  Modificación: %s\n",        tmtime);
    printf("  Actualización: %s\n",       tctime);
}

// Función para mostrar información del sistema de archivos
static void cmd_statvfs(const char *arg) {
    if (arg == NULL) { printf("Uso: statvfs <ruta>\n"); return; }

    DIR *dir = opendir(arg);
    if (dir) closedir(dir);

    if (access(arg, F_OK) != 0) {
        printf("Error: '%s' no es una ruta válida\n", arg);
        return;
    }


    struct statvfs sv;
    if (statvfs(arg, &sv) != 0) { 
        perror("statvfs"); return; }

    unsigned long block_size = sv.f_frsize ? sv.f_frsize : sv.f_bsize;
    double total  = (double)sv.f_blocks * block_size / (1024 * 1024);
    double libre  = (double)sv.f_bfree  * block_size / (1024 * 1024);
    double dispon = (double)sv.f_bavail * block_size / (1024 * 1024);

    printf("  Ruta            : %s\n",   arg);
    printf("  Tamaño bloque   : %lu bytes\n", block_size);
    printf("  Bloques totales : %lu\n",  (unsigned long)sv.f_blocks);
    printf("  Bloques libres  : %lu\n",  (unsigned long)sv.f_bfree);
    printf("  Bloques dispon. : %lu\n",  (unsigned long)sv.f_bavail);
    printf("  Total           : %.2f MB\n", total);
    printf("  Libre           : %.2f MB\n", libre);
    printf("  Disponible      : %.2f MB\n", dispon);
    printf("  Inodos totales  : %lu\n",  (unsigned long)sv.f_files);
    printf("  Inodos libres   : %lu\n",  (unsigned long)sv.f_ffree);
    printf("  Inodos dispon.  : %lu\n",  (unsigned long)sv.f_favail);
    printf("  ID filesystem   : %lu\n",  sv.f_fsid);
    printf("  Flags           : %lu\n",  sv.f_flag);
    printf("  Nombre max      : %lu chars\n", sv.f_namemax);
}

// Función para salir del shell
static void cmd_exit(const char *arg) {
    (void)arg;
    exit(0);
}

// Función para mostrar el contenido de un archivo
static void cmd_cat(const char *arg) {
    if (arg == NULL) {
        printf("Uso: cat <archivo>\n");
        return;
    }

    int fd = open(arg, O_RDONLY);
    if (fd < 0) {
        perror("Error al abrir archivo");
        return;
    }

    struct stat info;
    if (fstat(fd, &info) != 0) {
        perror("Error al acceder al archivo");
        close(fd);
        return;
    }

    if (S_ISDIR(info.st_mode)) {
        printf("'%s' es un directorio\n", arg);
        close(fd);
        return;
    }

    if (!S_ISREG(info.st_mode)) {
        printf("'%s' no es un archivo ordinario\n", arg);
        close(fd);
        return;
    }

    char buffer[512];
    ssize_t n;
    while ((n = read(fd, buffer, sizeof(buffer))) > 0)
        write(STDOUT_FILENO, buffer, n);

    if (n < 0)
        perror("Error al leer archivo");

    close(fd);
}
// Función para borrar archivos
static void cmd_unlink(const char *arg){
    if (arg == NULL) {
        printf("Uso: unlink <archivo>\n");
        return;
    }
    if (unlink(arg) != 0) {
        perror("Error al borrar archivo");
    }
}



// Función para renombrar archivos
static void cmd_rename(const char *arg) {
    if (arg == NULL) {
        printf("Uso: rename <origen> <destino>\n");
        return;
    }
    char buffer[INPUT_MAX];
    strncpy(buffer, arg, INPUT_MAX);
    buffer[INPUT_MAX - 1] = '\0';

    char *nombre_actual = strtok(buffer, " ");
    char *destino = strtok(NULL, " ");

    if (nombre_actual ==  NULL || destino == NULL) {
        printf("Uso: rename <origen> <destino>\n");
        return;
    }

    if (access(nombre_actual, F_OK) != 0) {
        perror("Error el archivo no existe");
    }

    if (rename(nombre_actual, destino) != 0) {
        perror("Error al renombrar archivo");
    }

}

//funccion de ayuda oara el comando find y se llame recursivamente para buscar en subdirectorios

static void find_recursivo(const char *ruta, const char *nombre, int *encontrado) {
    DIR *dir = opendir(ruta);
    if (dir == NULL) return;

    struct dirent *entrada;
    while ((entrada = readdir(dir)) != NULL) {
        if (strcmp(entrada->d_name, ".") == 0 || strcmp(entrada->d_name, "..") == 0)
            continue;

        char ruta_completa[RUTA_MAX];
        snprintf(ruta_completa, sizeof(ruta_completa), "%s/%s", ruta, entrada->d_name);

        struct stat info;
        if (stat(ruta_completa, &info) == 0) {
            if (strcmp(entrada->d_name, nombre) == 0) {
                if (S_ISDIR(info.st_mode))
                    printf(COLOR_DIR "%s/" COLOR_RESET " [DIR]\n", ruta_completa);
                else if (info.st_mode & S_IXUSR)
                    printf(COLOR_EXEC "%s" COLOR_RESET "\n", ruta_completa);
                else
                    printf("%s\n", ruta_completa);
                *encontrado = 1;
            }
            if (S_ISDIR(info.st_mode)) {
                find_recursivo(ruta_completa, nombre, encontrado);
            }
        }
    }
    closedir(dir);
}

// Función para el comando find (recursivo)
static void cmd_find(const char *arg) {
    if (arg == NULL) {
        printf("Uso: find <ruta> <nombre>\n");
        return;
    }

    char buffer[INPUT_MAX];
    strncpy(buffer, arg, INPUT_MAX);
    buffer[INPUT_MAX - 1] = '\0';

    char *ruta = strtok(buffer, " ");
    char *nombre = strtok(NULL, " ");

    if (ruta == NULL || nombre == NULL) {
        printf("Uso: find <ruta> <nombre>\n");
        return;
    }

    if (access(ruta, F_OK) != 0) {
        printf("Error: La ruta '%s' no existe\n", ruta);
        return;
    }

    DIR *dir = opendir(ruta);
    if (dir == NULL) {
        printf("Error: '%s' no es un directorio\n", ruta);
        return;
    }
    closedir(dir);

    int encontrado = 0;
    find_recursivo(ruta, nombre, &encontrado);

    if (!encontrado) {
        printf("Archivo o directorio '%s' no encontrado en '%s'\n", nombre, ruta);
    }
}

static void cmd_clear(const char *arg) {
    (void)arg;
    printf("033[H033[2J033[3J");
    fflush(stdout);
}

// Función para mostrar la fecha y hora actual
static void cmd_date(const char *arg) {
    (void)arg;
    time_t t = time(NULL);
    struct tm *tm_info = localtime(&t);
    char buf[64];
    strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S %Z", tm_info);
    printf("%s\n", buf);
}




static void cmd_who(const char *arg) {
    (void)arg;

    printf("  %-12s %-12s %-20s %s\n", "Usuario", "Terminal", "Fecha", "Host");
    printf("  %-12s %-12s %-20s %s\n", "------------", "------------", "--------------------", "--------------------");

    DIR *dir = opendir("/run/systemd/sessions");
    if (!dir) { perror("opendir /run/systemd/sessions"); return; }

    struct dirent *entrada;
    while ((entrada = readdir(dir)) != NULL) {
        // Solo archivos numéricos (sin punto ni .ref)
        if (entrada->d_name[0] == '.') continue;
        if (strstr(entrada->d_name, ".ref")) continue;

        char ruta[256];
        snprintf(ruta, sizeof(ruta), "/run/systemd/sessions/%s", entrada->d_name);

        FILE *f = fopen(ruta, "r");
        if (!f) continue;

        char usuario[64] = "";
        char tty[64]     = "";
        char seat[64]    = "";
        long long realtime = 0;
        int  is_manager  = 0;

        char linea[256];
        while (fgets(linea, sizeof(linea), f)) {
            linea[strcspn(linea, "\n")] = '\0';
            if      (strncmp(linea, "USER=",     5) == 0) strncpy(usuario,   linea + 5,  sizeof(usuario)  - 1);
            else if (strncmp(linea, "TTY=",      4) == 0) strncpy(tty,       linea + 4,  sizeof(tty)      - 1);
            else if (strncmp(linea, "SEAT=",     5) == 0) strncpy(seat,      linea + 5,  sizeof(seat)     - 1);
            else if (strncmp(linea, "REALTIME=", 9) == 0) realtime = atoll(linea + 9);
            else if (strncmp(linea, "CLASS=manager", 13) == 0) is_manager = 1;
        }
        fclose(f);

        // Saltar sesiones internas de manager
        if (is_manager) continue;
        // Saltar si no tiene usuario
        if (usuario[0] == '\0') continue;

        char fecha[32] = "-";
        if (realtime > 0) {
            time_t t = (time_t)(realtime / 1000000LL);
            struct tm *tm_info = localtime(&t);
            strftime(fecha, sizeof(fecha), "%Y-%m-%d %H:%M", tm_info);
        }

        // Mostrar TTY o SEAT si no hay TTY
        char terminal[64];
        if (tty[0])       strncpy(terminal, tty,  sizeof(terminal) - 1);
        else if (seat[0]) strncpy(terminal, seat, sizeof(terminal) - 1);
        else              strncpy(terminal, "-",  sizeof(terminal) - 1);

        printf("  %-12s %-12s %-20s %s\n", usuario, terminal, fecha, "-");
    }
    closedir(dir);
}



// Función auxiliar: dado un usuario, devuelve su TTY leyendo systemd/sessions
static int buscar_tty_usuario(const char *usuario, char *tty_out, size_t tty_size) {
    DIR *dir = opendir("/run/systemd/sessions");
    if (!dir) return 0;

    struct dirent *entrada;
    int encontrado = 0;

    while ((entrada = readdir(dir)) != NULL) {
        if (entrada->d_name[0] == '.') continue;
        if (strstr(entrada->d_name, ".ref")) continue;

        char ruta[256];
        snprintf(ruta, sizeof(ruta), "/run/systemd/sessions/%s", entrada->d_name);

        FILE *f = fopen(ruta, "r");
        if (!f) continue;

        char user[64] = "", tty[64] = "", clase[64] = "";
        char linea[256];
        while (fgets(linea, sizeof(linea), f)) {
            linea[strcspn(linea, "\n")] = '\0';
            if      (strncmp(linea, "USER=",  5) == 0) strncpy(user,  linea + 5,  sizeof(user)  - 1);
            else if (strncmp(linea, "TTY=",   4) == 0) strncpy(tty,   linea + 4,  sizeof(tty)   - 1);
            else if (strncmp(linea, "CLASS=", 6) == 0) strncpy(clase, linea + 6,  sizeof(clase) - 1);
        }
        fclose(f);

        if (strcmp(clase, "manager") == 0) continue;
        if (strcmp(user, usuario) != 0)    continue;
        if (tty[0] == '\0')                continue;

        snprintf(tty_out, tty_size, "/dev/%s", tty);
        encontrado = 1;
        break;
    }
    closedir(dir);
    return encontrado;
}

// Enviar mensaje a un usuario específico
static void cmd_mesg(const char *arg) {
    if (arg == NULL) { printf("Uso: mesg <usuario> <mensaje>\n"); return; }

    char buffer[INPUT_MAX];
    strncpy(buffer, arg, INPUT_MAX - 1);
    buffer[INPUT_MAX - 1] = '\0';

    char *usuario = strtok(buffer, " ");
    char *mensaje = strtok(NULL, "");
    if (usuario == NULL || mensaje == NULL) {
        printf("Uso: mesg <usuario> <mensaje>\n");
        return;
    }

    char tty_path[128];
    if (!buscar_tty_usuario(usuario, tty_path, sizeof(tty_path))) {
        printf("Usuario '%s' no encontrado o sin terminal accesible\n", usuario);
        return;
    }

    int fd = open(tty_path, O_WRONLY);
    if (fd < 0) {
        perror("Error al abrir terminal");
        return;
    }

    const char *remitente = getenv("USER") ? getenv("USER") : "desconocido";
    dprintf(fd, "\nMensaje de %s: %s\n", remitente, mensaje);
    close(fd);
    printf("Mensaje enviado a %s (%s)\n", usuario, tty_path);
}

// Enviar mensaje a todos los usuarios conectados
static void cmd_wall(const char *arg) {
    if (arg == NULL) { printf("Uso: wall <mensaje>\n"); return; }

    DIR *dir = opendir("/run/systemd/sessions");
    if (!dir) { perror("opendir /run/systemd/sessions"); return; }

    const char *remitente = getenv("USER") ? getenv("USER") : "root";
    struct dirent *entrada;

    while ((entrada = readdir(dir)) != NULL) {
        if (entrada->d_name[0] == '.') continue;
        if (strstr(entrada->d_name, ".ref")) continue;

        char ruta[256];
        snprintf(ruta, sizeof(ruta), "/run/systemd/sessions/%s", entrada->d_name);

        FILE *f = fopen(ruta, "r");
        if (!f) continue;

        char tty[64] = "", clase[64] = "";
        char linea[256];
        while (fgets(linea, sizeof(linea), f)) {
            linea[strcspn(linea, "\n")] = '\0';
            if      (strncmp(linea, "TTY=",   4) == 0) strncpy(tty,   linea + 4, sizeof(tty)   - 1);
            else if (strncmp(linea, "CLASS=", 6) == 0) strncpy(clase, linea + 6, sizeof(clase) - 1);
        }
        fclose(f);

        if (strcmp(clase, "manager") == 0) continue;
        if (tty[0] == '\0') continue;

        char tty_path[128];
        snprintf(tty_path, sizeof(tty_path), "/dev/%s", tty);

        int fd = open(tty_path, O_WRONLY);
        if (fd >= 0) {
            dprintf(fd, "\nBroadcast de %s: %s\n", remitente, arg);
            close(fd);
        }
    }
    closedir(dir);
}




// Función para mostrar información del sistema operativo
static void cmd_uname(const char *arg) {
    (void)arg;
    struct utsname info;
    if (uname(&info) != 0) { perror("uname"); return; }
    printf("  Sistema      : %s\n", info.sysname);
    printf("  Nodo         : %s\n", info.nodename);
    printf("  Release      : %s\n", info.release);
    printf("  Versión      : %s\n", info.version);
    printf("  Arquitectura : %s\n", info.machine);
}

// Función para listar dispositivos de bloque y carácter con nº, nombre, mayor y menor
static void cmd_dev(const char *arg) {
    (void)arg;
    DIR *dir = opendir("/dev");
    if (!dir) { perror("opendir /dev"); return; }
    printf("  %-5s %-22s %-6s %-6s\n", "Nº", "Nombre", "Mayor", "Menor");
    printf("  %-5s %-22s %-6s %-6s\n", "-----", "----------------------", "------", "------");
    struct dirent *entrada;
    int n = 0;
    while ((entrada = readdir(dir)) != NULL) {
        if (entrada->d_name[0] == '.') continue;
        char ruta[RUTA_MAX + 5];
        snprintf(ruta, sizeof(ruta), "/dev/%s", entrada->d_name);
        struct stat sb;
        if (stat(ruta, &sb) != 0) continue;
        if (S_ISBLK(sb.st_mode) || S_ISCHR(sb.st_mode)) {
            printf("  %-5d %-22s %-6u %-6u\n",
                   n++, entrada->d_name,
                   major(sb.st_rdev), minor(sb.st_rdev));
        }
    }
    closedir(dir);
}

// Función para mostrar el uso de memoria leyendo /proc/meminfo
static void cmd_free(const char *arg) {
    (void)arg;
    FILE *f = fopen("/proc/meminfo", "r");
    if (!f) { perror("fopen /proc/meminfo"); return; }
    long total = 0, libre = 0, disponible = 0, buffers = 0, cached = 0;
    long swap_total = 0, swap_libre = 0;
    char linea[256], clave[64];
    long valor;
    while (fgets(linea, sizeof(linea), f)) {
        if (sscanf(linea, "%63s %ld", clave, &valor) == 2) {
            if      (strcmp(clave, "MemTotal:")     == 0) total        = valor;
            else if (strcmp(clave, "MemFree:")      == 0) libre        = valor;
            else if (strcmp(clave, "MemAvailable:") == 0) disponible   = valor;
            else if (strcmp(clave, "Buffers:")      == 0) buffers      = valor;
            else if (strcmp(clave, "Cached:")       == 0) cached       = valor;
            else if (strcmp(clave, "SwapTotal:")    == 0) swap_total   = valor;
            else if (strcmp(clave, "SwapFree:")     == 0) swap_libre   = valor;
        }
    }
    fclose(f);
    long usada      = total - libre - buffers - cached;
    long swap_usada = swap_total - swap_libre;
    printf("              Total(MB)  Usada(MB)  Libre(MB)  Disp.(MB)\n");
    printf("  Mem:        %9ld %10ld %10ld %10ld\n",
           total/1024, usada/1024, libre/1024, disponible/1024);
    printf("  Swap:       %9ld %10ld %10ld\n",
           swap_total/1024, swap_usada/1024, swap_libre/1024);
}


// MÓDULO: Tabla de despacho
typedef struct {
    const char *nombre;
    void (*funcion)(const char *arg);
} Comando;

static const Comando comandos[] = {
    { "pwd",     cmd_pwd     },
    { "cd",      cmd_cd      },
    { "mkdir",   cmd_mkdir   },
    { "ls",      cmd_ls      },
    { "ip",      cmd_ip      },
    { "mac",     cmd_mac     }, 
    { "stat",    cmd_stat    },
    { "statvfs", cmd_statvfs },
    { "cat",     cmd_cat     },
    { "unlink",  cmd_unlink  },
    { "rename",  cmd_rename  },
    { "find",    cmd_find    },
    { "clear",   cmd_clear   },
    { "date",    cmd_date    },
    { "who",     cmd_who     },
    { "mesg",    cmd_mesg    },
    { "wall",    cmd_wall    },
    { "uname",   cmd_uname   },
    { "dev",     cmd_dev     },
    { "free",    cmd_free    },
    { "exit",    cmd_exit    },
};
// Número de comandos en la tabla de despacho
static const int NUM_COMANDOS = sizeof(comandos) / sizeof(comandos[0]);



// MÓDULO: Shell (bucle + despacho)
static void ejecutar(const char *nombre, const char *arg) {
    for (int i = 0; i < NUM_COMANDOS; i++) {
        if (strcmp(comandos[i].nombre, nombre) == 0) {
            comandos[i].funcion(arg);
            return;
        }
    }
    printf("Comando no reconocido: %s\n", nombre);
}

static void iniciar_shell() {
    char input[INPUT_MAX];

    while (1) {
        printf("033[1;32m>033[0m ");
        if (fgets(input, sizeof(input), stdin) == NULL) break;

        input[strcspn(input, "\n")] = 0;

        char *cmd = strtok(input, " ");
        char *arg = strtok(NULL, "");

        if (cmd == NULL) continue;

        ejecutar(cmd, arg);
    }
}


int main() {
    iniciar_shell();
    return 0;
}`,
  },
{
    id: 2,
    titulo: 'Ejercicio 1 — Fork básico con variable independiente',
    parcial: '2do parcial',
    descripcion: 'Demuestra que padre e hijo tienen espacios de memoria independientes tras fork(). Cada uno modifica su propia copia de x sin afectar al otro.',
    lenguaje: 'c',
    mejoras: [
      'Agregar wait() en el padre para evitar procesos zombie.',
      'Imprimir también el PPID del hijo para visualizar la jerarquía.',
      'Usar volatile en x si se quiere observar comportamiento con señales.',
    ],
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main(void)
{
    int x = 0;
    pid_t pid;
    pid = fork();
    if (pid == 0)
    {
        /* Código ejecutado por el proceso hijo */
        x = 5;
        printf("Hijo: PID=%ld, x=%d\n", (long)getpid(), x);
    }
    else
    {
        /* Código ejecutado por el proceso padre */
        x = 10;
        printf("Padre: PID=%ld, x=%d\n", (long)getpid(), x);
    }
    return EXIT_SUCCESS;
}`,
  },
  {
    id: 3,
    titulo: 'Ejercicio 2 — Fork con manejo de error',
    parcial: '2do parcial',
    descripcion: 'Fork básico con los tres casos: hijo (pid==0), padre (pid>0) y error (pid<0). Versión más robusta que ejercicio 1 usando fprintf y perror.',
    lenguaje: 'c',
    mejoras: [
      'Agregar wait() en el padre para esperar al hijo.',
      'Imprimir el PID del hijo desde el padre usando la variable hijo.',
      'Verificar con getppid() desde el hijo que el padre es correcto.',
    ],
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
int main(void)
{
    pid_t hijo;
    hijo = fork();
    if (hijo == 0)
    {
        /* Código ejecutado por el proceso hijo */
        fprintf(stdout, "Soy el hijo, PID=%ld\n", (long)getpid());
    }
    else if (hijo > 0)
    {
        /* Código ejecutado por el proceso padre */
        fprintf(stdout, "Soy el padre, PID=%ld\n", (long)getpid());
    }
    else
    {
        /* Error al crear el proceso */
        perror("fork");
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}`,
  },
  {
    id: 4,
    titulo: 'Ejercicio 3 — Cadena de procesos (padre crea hijos en secuencia)',
    parcial: '2do parcial',
    descripcion: 'El padre crea hijos en un loop y se detiene con break tras cada fork. Genera una cadena lineal donde cada proceso es hijo del anterior.',
    lenguaje: 'c',
    mejoras: [
      'Agregar wait() para evitar procesos zombie.',
      'Imprimir el nivel de profundidad para visualizar la cadena.',
      'Comparar la salida con ejercicio 4 para ver la diferencia de topología.',
    ],
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
int main(void)
{
    pid_t hijo;
    int n = 5;
    for (int i = 0; i < n; i++)
    {
        hijo = fork();
        if (hijo > 0)
        {
            /* El padre deja de crear más procesos */
            break;
        }
        fprintf(stderr,
                "Proceso PID=%ld, PPID=%ld\n",
                (long)getpid(), (long)getppid());
    }
    return EXIT_SUCCESS;
}`,
  },
  {
    id: 5,
    titulo: 'Ejercicio 4 — Árbol plano (hijos no crean más hijos)',
    parcial: '2do parcial',
    descripcion: 'Contrario al ejercicio 3: aquí los hijos se detienen con break. El padre crea todos los procesos directamente, generando una estructura plana.',
    lenguaje: 'c',
    mejoras: [
      'Agregar waitpid() en el padre para esperar a cada hijo en orden.',
      'Imprimir cuántos hijos creó el padre al final.',
      'Comparar el árbol de procesos con pstree para visualizarlo.',
    ],
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
int main(void)
{
    pid_t hijo;
    int n = 5;
    for (int i = 0; i < n; i++)
    {
        hijo = fork();
        if (hijo == 0)
        {
            /* El hijo no crea más procesos */
            break;
        }
    }
    fprintf(stderr, "Proceso PID=%ld, PPID=%ld\n", (long)getpid(), (long)getppid());
    return EXIT_SUCCESS;
}`,
  },
  {
    id: 6,
    titulo: 'Práctica 1.1 — Árbol binario de procesos',
    parcial: '2do parcial',
    descripcion: 'Cada proceso crea dos hijos recursivamente hasta un nivel máximo. Genera un árbol binario completo. Usa waitpid() para sincronizar cada nivel.',
    lenguaje: 'c',
    mejoras: [
      'Agregar indentación en el printf según el nivel para visualizar el árbol.',
      'Limitar nivel_max <= 5 para evitar fork bombs accidentales.',
      'Usar un semáforo para ordenar la salida por nivel de forma consistente.',
    ],
    codigo: `/*
 * Ejercicio 1: Árbol binario de procesos
 * Uso: arbol <nivel>
 * Nivel 0 = solo el proceso principal (raíz)
 * Cada proceso crea dos hijos hasta alcanzar el nivel indicado.
 * Cada nodo imprime su PID (proceso actual) y PPID (proceso padre).
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

/* nivel_actual  : nivel en el que se encuentra este proceso
 * nivel_max     : nivel máximo pedido por el usuario           */
void crear_arbol(int nivel_actual, int nivel_max) {

    /* Imprimir información de este nodo */
    printf("Nivel %d | PID (hijo): %d | PPID (padre): %d\n",
           nivel_actual, getpid(), getppid());
    fflush(stdout);

    /* Si ya llegamos al nivel máximo, no se crean más hijos */
    if (nivel_actual >= nivel_max)
        return;

    pid_t hijo_izq, hijo_der;

    /* ── Hijo izquierdo ── */
    hijo_izq = fork();
    if (hijo_izq < 0) {
        perror("fork hijo izquierdo");
        exit(1);
    }
    if (hijo_izq == 0) {
        /* Soy el hijo izquierdo: bajo un nivel y repito */
        crear_arbol(nivel_actual + 1, nivel_max);
        exit(0);
    }

    /* ── Hijo derecho ── */
    hijo_der = fork();
    if (hijo_der < 0) {
        perror("fork hijo derecho");
        exit(1);
    }
    if (hijo_der == 0) {
        /* Soy el hijo derecho: bajo un nivel y repito */
        crear_arbol(nivel_actual + 1, nivel_max);
        exit(0);
    }

    /* El padre espera a que ambos hijos directos terminen */
    waitpid(hijo_izq, NULL, 0);
    waitpid(hijo_der, NULL, 0);
}

int main(int argc, char *argv[]) {

    if (argc != 2) {
        fprintf(stderr, "Uso: %s <nivel>\n", argv[0]);
        fprintf(stderr, "  nivel 0 = solo el proceso raiz\n");
        return 1;
    }

    int nivel_max = atoi(argv[1]);
    if (nivel_max < 0) {
        fprintf(stderr, "El nivel debe ser >= 0\n");
        return 1;
    }

    printf("=== Árbol binario de procesos (nivel máximo: %d) ===\n\n",
           nivel_max);
    fflush(stdout);

    crear_arbol(0, nivel_max);

    printf("\n[Proceso raíz PID %d] Árbol completado.\n", getpid());
    return 0;
}`,
  },
  {
    id: 7,
    titulo: 'Práctica 1.2 — Factorial con pipe bidireccional',
    parcial: '2do parcial',
    descripcion: 'Padre e hijo calculan factoriales de dos números distintos. Se comunican con dos pipes: uno padre→hijo y otro hijo→padre.',
    lenguaje: 'c',
    mejoras: [
      'Validar que n <= 20 para evitar overflow en unsigned long long.',
      'Cerrar todos los extremos del pipe antes de fork para evitar leaks.',
      'Usar shared memory en lugar de pipe para evitar la serialización.',
    ],
    codigo: `/*
 * Ejercicio 2: Factorial de dos números con procesos y pipe
 * Uso: factorial <num1> <num2>
 *
 * - El PADRE calcula el factorial de num1.
 * - El HIJO  recibe num2 a través de un pipe y calcula su factorial.
 * - El HIJO  envía su resultado de vuelta al padre por otro pipe.
 * - El PADRE imprime ambos resultados en pantalla.
 *
 * Se usa unsigned long long para soportar números razonablemente grandes.
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

/* Calcula n! (retorna 0 si n < 0, 1 si n == 0) */
unsigned long long factorial(int n) {
    if (n < 0) return 0;
    unsigned long long resultado = 1;
    for (int i = 2; i <= n; i++)
        resultado *= (unsigned long long)i;
    return resultado;
}

int main(int argc, char *argv[]) {

    if (argc != 3) {
        fprintf(stderr, "Uso: %s <num1> <num2>\n", argv[0]);
        return 1;
    }

    int num1 = atoi(argv[1]);
    int num2 = atoi(argv[2]);

    if (num1 < 0 || num2 < 0) {
        fprintf(stderr, "Los números deben ser enteros no negativos.\n");
        return 1;
    }


    int pipe_padre_a_hijo[2];
    int pipe_hijo_a_padre[2];

    if (pipe(pipe_padre_a_hijo) == -1) { perror("pipe 1"); return 1; }
    if (pipe(pipe_hijo_a_padre) == -1) { perror("pipe 2"); return 1; }

    pid_t pid = fork();

    if (pid < 0) {
        perror("fork");
        return 1;
    }


    if (pid == 0) {

        /* Cerrar extremos que el hijo no usa */
        close(pipe_padre_a_hijo[1]); /* no escribe en este pipe */
        close(pipe_hijo_a_padre[0]); /* no lee  de este pipe   */

        /* 1. Recibir num2 del padre */
        int numero_recibido;
        read(pipe_padre_a_hijo[0], &numero_recibido, sizeof(int));
        close(pipe_padre_a_hijo[0]);

        printf("[Hijo  PID %d] Recibí el número %d del padre.\n",
               getpid(), numero_recibido);
        fflush(stdout);

        /* 2. Calcular factorial */
        unsigned long long resultado_hijo = factorial(numero_recibido);

        printf("[Hijo  PID %d] %d! = %llu  (calculado por el hijo)\n",
               getpid(), numero_recibido, resultado_hijo);
        fflush(stdout);

        /* 3. Enviar resultado al padre */
        write(pipe_hijo_a_padre[1], &resultado_hijo, sizeof(unsigned long long));
        close(pipe_hijo_a_padre[1]);

        exit(0);
    }



    /* Cerrar extremos que el padre no usa */
    close(pipe_padre_a_hijo[0]); /* no lee  de este pipe   */
    close(pipe_hijo_a_padre[1]); /* no escribe en este pipe */

    /* 1. Enviar num2 al hijo */
    write(pipe_padre_a_hijo[1], &num2, sizeof(int));
    close(pipe_padre_a_hijo[1]);

    printf("[Padre PID %d] Envié el número %d al hijo.\n", getpid(), num2);
    fflush(stdout);

    /* 2. El padre calcula el factorial de num1 mientras el hijo trabaja */
    unsigned long long resultado_padre = factorial(num1);

    printf("[Padre PID %d] %d! = %llu  (calculado por el padre)\n",
           getpid(), num1, resultado_padre);
    fflush(stdout);

    /* 3. Esperar al hijo y leer su resultado */
    wait(NULL);

    unsigned long long resultado_hijo;
    read(pipe_hijo_a_padre[0], &resultado_hijo, sizeof(unsigned long long));
    close(pipe_hijo_a_padre[0]);

    /* 4. El padre imprime ambos resultados finales */
    printf("\nRESULTADOS FINALES (impresos por el padre)\n");
    printf("  %d! = %llu\n", num1, resultado_padre);
    printf("  %d! = %llu\n", num2, resultado_hijo);


    return 0;
}`,
  },
  {
    id: 8,
    titulo: 'Práctica 2 — Productor: matriz aleatoria por FIFO',
    parcial: '2do parcial',
    descripcion: 'Genera una matriz n×n con valores aleatorios y la escribe en una FIFO nombrada (/tmp/matriz_fifo). Bloquea hasta que el consumidor abre el otro extremo.',
    lenguaje: 'c',
    mejoras: [
      'Enviar la matriz en binario en lugar de texto para mayor eficiencia.',
      'Agregar un timeout con alarm() para no bloquear indefinidamente.',
      'Verificar que n no supere MAX_N antes de alocar el arreglo.',
    ],
    codigo: `/*
 * Tarea 2 - Productor
 * Uso: productor <n>   (n <= 8)
 *
 * - Genera una matriz n×n con valores aleatorios (semilla = tiempo).
 * - Crea una tubería con nombre (FIFO): /tmp/matriz_fifo
 * - Escribe primero n, luego cada elemento como texto (un número por línea).
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <time.h>

#define FIFO_PATH "/tmp/matriz_fifo"
#define MAX_N 8

int main(int argc, char *argv[]) {

    if (argc != 2) {
        fprintf(stderr, "Uso: %s <n>  (n entre 1 y %d)\n", argv[0], MAX_N);
        return 1;
    }

    int n = atoi(argv[1]);
    if (n < 1 || n > MAX_N) {
        fprintf(stderr, "Error: n debe estar entre 1 y %d\n", MAX_N);
        return 1;
    }

    /* ── 1. Crear la FIFO si no existe ── */
    if (access(FIFO_PATH, F_OK) == -1) {
        if (mkfifo(FIFO_PATH, 0666) == -1) {
            perror("mkfifo");
            return 1;
        }
    }

    /* ── 2. Generar matriz aleatoria ── */
    srand((unsigned int)time(NULL));

    double matriz[MAX_N][MAX_N];
    printf("[Productor PID %d] Matriz %dx%d generada:\n\n", getpid(), n, n);

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            int val = (rand() % 19) - 9;
            if (val == 0) val = 1;
            matriz[i][j] = (double)val;
            printf("%6.1f ", matriz[i][j]);
        }
        printf("\n");
    }
    printf("\n");

    /* ── 3. Abrir FIFO (bloquea hasta que el consumidor también la abra) ── */
    printf("[Productor] Esperando al consumidor...\n");
    fflush(stdout);

    int fd = open(FIFO_PATH, O_WRONLY);
    if (fd == -1) {
        perror("open FIFO escritura");
        return 1;
    }

    /* ── 4. Enviar n y cada elemento como texto, uno por línea ── */
    dprintf(fd, "%d\n", n);

    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            dprintf(fd, "%.1f\n", matriz[i][j]);

    close(fd);

    printf("[Productor] Matriz enviada al consumidor correctamente.\n");
    return 0;
}`,
  },
  {
    id: 9,
    titulo: 'Práctica 2 — Consumidor: determinante por eliminación de Gauss',
    parcial: '2do parcial',
    descripcion: 'Lee la matriz desde la FIFO y calcula su determinante con eliminación de Gauss con pivoteo parcial. Elimina la FIFO al terminar con unlink().',
    lenguaje: 'c',
    mejoras: [
      'Agregar manejo explícito de matrices singulares con mensaje de error.',
      'Leer en binario si el productor se migra a formato binario.',
      'Mostrar los pasos intermedios de la eliminación para fines didácticos.',
    ],
    codigo: `/*
 * Tarea 2 - Consumidor
 * Uso: consumidor
 *
 * - Lee n y la matriz n×n desde la FIFO /tmp/matriz_fifo (en texto).
 * - Calcula el determinante mediante eliminación de Gauss con pivoteo.
 * - Imprime la matriz recibida y el determinante.
 */

#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <unistd.h>

#define FIFO_PATH "/tmp/matriz_fifo"
#define MAX_N 8

double determinante(double mat[MAX_N][MAX_N], int n) {
    double a[MAX_N][MAX_N];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            a[i][j] = mat[i][j];

    double det = 1.0;
    int intercambios = 0;

    for (int col = 0; col < n; col++) {
        /* Pivoteo parcial */
        int pivot_fila = col;
        double max_val = fabs(a[col][col]);
        for (int fila = col + 1; fila < n; fila++) {
            if (fabs(a[fila][col]) > max_val) {
                max_val = fabs(a[fila][col]);
                pivot_fila = fila;
            }
        }

        if (fabs(a[pivot_fila][col]) < 1e-12)
            return 0.0;

        if (pivot_fila != col) {
            for (int j = 0; j < n; j++) {
                double tmp = a[col][j];
                a[col][j] = a[pivot_fila][j];
                a[pivot_fila][j] = tmp;
            }
            intercambios++;
        }

        for (int fila = col + 1; fila < n; fila++) {
            double factor = a[fila][col] / a[col][col];
            for (int j = col; j < n; j++)
                a[fila][j] -= factor * a[col][j];
        }

        det *= a[col][col];
    }

    if (intercambios % 2 != 0)
        det = -det;

    return det;
}

int main(void) {

    printf("[Consumidor PID %d] Esperando datos del productor...\n", getpid());
    fflush(stdout);

    /* ── 1. Abrir FIFO para lectura ── */
    int fd = open(FIFO_PATH, O_RDONLY);
    if (fd == -1) {
        perror("open FIFO lectura");
        return 1;
    }

    /* Convertir el fd en FILE* para usar fscanf fácilmente */
    FILE *fifo = fdopen(fd, "r");
    if (!fifo) {
        perror("fdopen");
        return 1;
    }

    /* ── 2. Leer n ── */
    int n;
    fscanf(fifo, "%d", &n);

    /* ── 3. Leer cada elemento de la matriz ── */
    double matriz[MAX_N][MAX_N];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            fscanf(fifo, "%lf", &matriz[i][j]);

    fclose(fifo);   /* también cierra fd */

    /* ── 4. Mostrar la matriz recibida ── */
    printf("[Consumidor] Matriz %dx%d recibida:\n\n", n, n);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
            printf("%6.1f ", matriz[i][j]);
        printf("\n");
    }
    printf("\n");

    /* ── 5. Calcular e imprimir el determinante ── */
    double det = determinante(matriz, n);

    printf("========================================\n");
    printf("  Determinante de la matriz %dx%d = %.4f\n", n, n, det);
    printf("========================================\n");

    unlink(FIFO_PATH);
    return 0;
}`,
  },
  {
    id: 10,
    titulo: 'Fuerza bruta — Semáforos + Memoria Compartida + crypt()',
    parcial: '2do parcial',
    descripcion: 'Padre genera permutaciones con algoritmo de Heap y las pasa al hijo por memoria compartida. El hijo verifica cada permutación contra el hash real de /etc/shadow usando crypt_r().',
    lenguaje: 'c',
    mejoras: [
      'Limitar el tamaño del password base para evitar tiempos exponenciales (n! crece muy rápido).',
      'Usar múltiples hijos en paralelo para dividir el espacio de búsqueda.',
      'Agregar un límite de tiempo máximo con alarm() y SIGALRM.',
      'Usar mlock() para evitar que la ZonaCompartida sea paginada a disco.',
    ],
    codigo: `/*
 * tarea3_maria.c  —  Semáforos + Memoria Compartida + crypt()
 *
 * COMPILAR:
 *   gcc -o tarea3 tarea3_maria.c -lcrypt
 *
 * EJECUTAR:
 *   sudo ./tarea3 maria +56milly890
 */

#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <crypt.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <sys/sem.h>
#include <sys/wait.h>
#include <time.h>

#define MAX_WORD 64

typedef struct
{
    char palabra[MAX_WORD];
    int terminado;
    int encontrado;
} ZonaCompartida;

union semun
{
    int val;
};

#define SEM_VACIO 0
#define SEM_LLENO 1

static ZonaCompartida *shm_g = NULL;
static int semid_g = -1;
static int listo_g = 0;

static void sem_P(int semid, int num)
{
    struct sembuf op = {num, -1, 0};
    semop(semid, &op, 1);
}
static void sem_V(int semid, int num)
{
    struct sembuf op = {num, +1, 0};
    semop(semid, &op, 1);
}

static int leer_hash(const char *usuario, char *out, size_t sz)
{
    FILE *f = fopen("/etc/shadow", "r");
    if (!f)
    {
        perror("fopen /etc/shadow (¿eres root?)");
        return -1;
    }
    char buf[512];
    while (fgets(buf, sizeof(buf), f))
    {
        char *sep = strchr(buf, ':');
        if (!sep)
            continue;
        *sep = '\0';
        if (strcmp(buf, usuario) == 0)
        {
            char *h = sep + 1;
            char *e = strchr(h, ':');
            if (e)
                *e = '\0';
            strncpy(out, h, sz - 1);
            out[sz - 1] = '\0';
            fclose(f);
            return 0;
        }
    }
    fclose(f);
    fprintf(stderr, "Usuario '%s' no encontrado en /etc/shadow\n", usuario);
    return -1;
}

static void extraer_salt(const char *hash, char *salt, size_t sz)
{
    const char *p = hash;
    int d = 0;
    size_t i = 0;
    while (*p && i < sz - 1)
    {
        if (*p == '$')
            d++;
        salt[i++] = *p++;
        if (d == 3)
            break;
    }
    salt[i] = '\0';
    if (d < 3)
    {
        strncpy(salt, hash, 2);
        salt[2] = '\0';
    }
}

static void enviar(const char *perm)
{
    if (listo_g)
        return;
    sem_P(semid_g, SEM_VACIO);
    if (shm_g->encontrado)
    {
        listo_g = 1;
        sem_V(semid_g, SEM_VACIO);
        return;
    }
    strncpy(shm_g->palabra, perm, MAX_WORD - 1);
    shm_g->terminado = 0;
    sem_V(semid_g, SEM_LLENO);
}

static void heap(char *a, int n)
{
    if (listo_g)
        return;
    if (n == 1)
    {
        enviar(a);
        return;
    }
    for (int i = 0; i < n && !listo_g; i++)
    {
        heap(a, n - 1);
        if (listo_g)
            return;
        char tmp, rep;
        if (n % 2 == 0)
        {
            tmp = a[i];
            rep = a[n - 1];
            a[i] = rep;
            a[n - 1] = tmp;
        }
        else
        {
            tmp = a[0];
            rep = a[n - 1];
            a[0] = rep;
            a[n - 1] = tmp;
        }
    }
}

int main(int argc, char *argv[])
{

    /* ── MODIFICACIÓN: leer usuario y password desde argv ── */
    if (argc != 3)
    {
        fprintf(stderr, "Uso: %s <usuario> <password>\n", argv[0]);
        fprintf(stderr, "Ejemplo: sudo %s maria +56milly890\n", argv[0]);
        return EXIT_FAILURE;
    }

    const char *USUARIO = argv[1];
    const char *PASSWORD_BASE = argv[2]; /* se permuta completo */
    /* ────────────────────────────────────────────────────── */

    printf("=== Tarea 3 — Semáforos + crypt() + /etc/shadow ===\n");
    printf("Usuario : %s\n", USUARIO);
    printf("Password base a permutar: \"%s\"\n\n", PASSWORD_BASE);

    /* 1. Leer hash real de /etc/shadow */
    char hash_real[256] = {0};
    if (leer_hash(USUARIO, hash_real, sizeof(hash_real)) != 0)
        return EXIT_FAILURE;
    printf("[*] Hash encontrado : %.50s...\n", hash_real);

    char salt[64] = {0};
    extraer_salt(hash_real, salt, sizeof(salt));
    printf("[*] Salt extraído   : %s\n\n", salt);

    /* 2. Generar semilla a partir del PASSWORD_BASE */
    unsigned int semilla = 0;
    for (size_t i = 0; i < strlen(PASSWORD_BASE); i++)
        semilla += (unsigned char)PASSWORD_BASE[i] * (unsigned int)(i + 1);
    srand(semilla);
    printf("[*] Semilla (del password): %u\n\n", semilla);

    /* 3. Crear memoria compartida */
    key_t k1 = ftok("/tmp", 'M');
    int shmid = shmget(k1, sizeof(ZonaCompartida), 0666 | IPC_CREAT);
    if (shmid < 0)
    {
        perror("shmget");
        return EXIT_FAILURE;
    }
    ZonaCompartida *zona = shmat(shmid, NULL, 0);
    if (zona == (void *)-1)
    {
        perror("shmat");
        return EXIT_FAILURE;
    }
    memset(zona, 0, sizeof(ZonaCompartida));
    shm_g = zona;

    /* 4. Crear semáforos */
    key_t k2 = ftok("/tmp", 'N');
    int semid = semget(k2, 2, 0666 | IPC_CREAT);
    if (semid < 0)
    {
        perror("semget");
        return EXIT_FAILURE;
    }
    union semun arg;
    arg.val = 1;
    semctl(semid, SEM_VACIO, SETVAL, arg);
    arg.val = 0;
    semctl(semid, SEM_LLENO, SETVAL, arg);
    semid_g = semid;

    struct timespec ts_inicio, ts_fin;
    clock_gettime(CLOCK_MONOTONIC, &ts_inicio);
    time_t ahora = time(NULL);
    struct tm *t = localtime(&ahora);
    printf("[INICIO] %02d:%02d:%02d\n\n", t->tm_hour, t->tm_min, t->tm_sec);

    /* 5. Fork */
    pid_t pid = fork();
    if (pid < 0)
    {
        perror("fork");
        return EXIT_FAILURE;
    }

    /* ==================================================== */
    /*  PROCESO HIJO                                         */
    /* ==================================================== */
    if (pid == 0)
    {

        while (1)
        {
            sem_P(semid, SEM_LLENO);

            if (zona->terminado && !zona->encontrado)
            {

                sem_V(semid, SEM_VACIO);
                break;
            }
            if (zona->encontrado)
                break;

            char perm[MAX_WORD];
            strncpy(perm, zona->palabra, MAX_WORD - 1);
            sem_V(semid, SEM_VACIO);

            struct crypt_data cd;
            memset(&cd, 0, sizeof(cd));
            char *cifrado = crypt_r(perm, salt, &cd);

            if (cifrado && strcmp(cifrado, hash_real) == 0)
            {
                printf("\n[Hijo] *** CLAVE ENCONTRADA: \"%s\" ***\n\n", perm);
                sem_P(semid, SEM_VACIO);
                strncpy(zona->palabra, perm, MAX_WORD - 1);
                zona->encontrado = 1;
                zona->terminado = 1;
                sem_V(semid, SEM_LLENO);
                break;
            }
        }
        

        shmdt(zona);
        clock_gettime(CLOCK_MONOTONIC, &ts_fin);
        ahora = time(NULL);
        t = localtime(&ahora);
        double segundos = (ts_fin.tv_sec - ts_inicio.tv_sec) +
                          (ts_fin.tv_nsec - ts_inicio.tv_nsec) / 1e9;
        double minutos = segundos / 60.0;
        printf("\n[FIN]    %02d:%02d:%02d\n", t->tm_hour, t->tm_min, t->tm_sec);
        printf("[TIEMPO] %.3f segundos\n", segundos);
        printf("[TIEMPO] %.2f minutos\n\n", minutos);

        exit(EXIT_SUCCESS);
    }

    /* ==================================================== */
    /*  PROCESO PADRE                                        */
    /* ==================================================== */
    printf("[Padre PID=%d] Generando permutaciones de \"%s\"...\n\n",
           getpid(), PASSWORD_BASE);

    char buf[MAX_WORD];
    strncpy(buf, PASSWORD_BASE, MAX_WORD - 1);
    buf[MAX_WORD - 1] = '\0';

    heap(buf, (int)strlen(PASSWORD_BASE));

    if (!listo_g)
    {
        sem_P(semid, SEM_VACIO);
        zona->terminado = 1;
        sem_V(semid, SEM_LLENO);
    }

    wait(NULL);

    if (zona->encontrado)
        printf("[Padre] Confirmado — la clave es: \"%s\"\n", zona->palabra);
    else
        printf("[Padre] No se encontró coincidencia.\n");

    shmdt(zona);
    shmctl(shmid, IPC_RMID, NULL);
    semctl(semid, 0, IPC_RMID);

    printf("[Padre] Recursos IPC liberados. Fin.\n");
    return EXIT_SUCCESS;
}`,
  },
  {
    id: 11,
    titulo: 'who_colas — WHO con colas de mensajes System V',
    parcial: '2do parcial',
    descripcion: 'Implementación del comando who usando colas de mensajes. El padre lee sesiones de /run/utmp con getutent() y las envía por msgsnd(). El hijo recibe con msgrcv() e imprime formateado.',
    lenguaje: 'c',
    mejoras: [
      'Usar IPC_NOWAIT en msgsnd() para no bloquear si la cola está llena.',
      'Agregar filtro por tipo de sesión: X11, tty, pts.',
      'Mostrar tiempo de inactividad calculando diferencia con time().',
      'Manejar SIGCHLD para detectar si el hijo muere inesperadamente.',
    ],
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <time.h>
#include <utmp.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/msg.h>
#include <sys/wait.h>
#include <sys/stat.h>
#include <errno.h>

#define MSG_TIPO    1
#define MSG_FIN     2
#define MAX_TEXTO   256

/* Posibles rutas de utmp segun la distro */
static const char *RUTAS_UTMP[] = {
    "/run/utmp",
    "/var/run/utmp",
    NULL
};

typedef struct {
    long tipo;
    char texto[MAX_TEXTO];
} Mensaje;

/* Devuelve la primera ruta de utmp que exista y sea legible */
static const char *encontrar_utmp(void) {
    for (int i = 0; RUTAS_UTMP[i] != NULL; i++) {
        if (access(RUTAS_UTMP[i], R_OK) == 0)
            return RUTAS_UTMP[i];
    }
    return NULL;
}

int main(void) {
    time_t inicio = time(NULL);
    struct tm *ti = localtime(&inicio);
    printf("=== WHO (utmp) - Cola de Mensajes ===\n");
    printf("Hora inicio : %02d:%02d:%02d\n\n", ti->tm_hour, ti->tm_min, ti->tm_sec);

    /* Verificar que utmp es accesible */
    const char *ruta_utmp = encontrar_utmp();
    if (ruta_utmp == NULL) {
        fprintf(stderr,
            "ERROR: No se puede leer el archivo utmp.\n"
            "  Prueba ejecutar con: sudo ./who_utmp\n"
            "  O agrega tu usuario al grupo utmp: sudo usermod -aG utmp $USER\n");
        return 1;
    }
    printf("Usando utmp : %s\n\n", ruta_utmp);

    /* Crear la cola de mensajes */
    int msqid = msgget(IPC_PRIVATE, IPC_CREAT | 0666);
    if (msqid < 0) { perror("msgget"); return 1; }

    fflush(stdout);
    pid_t pid = fork();
    if (pid < 0) {
        perror("fork");
        msgctl(msqid, IPC_RMID, NULL);
        return 1;
    }

    /* ── PROCESO HIJO: consumidor ── */
    if (pid == 0) {
        Mensaje msg;
        printf("%-16s %-12s %-18s %s\n", "USUARIO",  "TERMINAL", "HORA SESION", "ESTADO");
        printf("%-16s %-12s %-18s %s\n", "-------",  "--------", "-----------", "------");
        fflush(stdout);

        while (1) {
            ssize_t r = msgrcv(msqid, &msg, sizeof(msg.texto), 0, 0);
            if (r < 0) {
                if (errno == EINTR) continue;   /* señal interrumpida, reintentar */
                break;
            }
            if (msg.tipo == MSG_FIN) break;
            printf("%s\n", msg.texto);
            fflush(stdout);
        }
        exit(0);
    }

    /* ── PROCESO PADRE: productor ── */
    struct utmp *entrada;
    Mensaje msg;
    int total = 0;

    utmpname(ruta_utmp);    /* <-- usa la ruta detectada, no hardcodeada */
    setutent();

    while ((entrada = getutent()) != NULL) {
        /* Solo nos interesan sesiones de usuario reales (tipo 7 = USER_PROCESS) */
        if (entrada->ut_type != USER_PROCESS) continue;

        /* Ignorar entradas con usuario vacío (entradas corruptas/incompletas) */
        if (entrada->ut_user[0] == '\0') continue;

        time_t t = (time_t)entrada->ut_tv.tv_sec;
        struct tm *ts = localtime(&t);
        char hora_login[32];
        strftime(hora_login, sizeof(hora_login), "%Y-%m-%d %H:%M", ts);


        char usuario[UT_NAMESIZE + 1];
        char terminal[UT_LINESIZE + 1];
        strncpy(usuario,  entrada->ut_user, UT_NAMESIZE);  usuario[UT_NAMESIZE]  = '\0';
        strncpy(terminal, entrada->ut_line, UT_LINESIZE);  terminal[UT_LINESIZE] = '\0';

        snprintf(msg.texto, MAX_TEXTO, "%-16s %-12s %-18s %s",
                 usuario,
                 terminal,
                 hora_login,
                 "ACTIVA");

        msg.tipo = MSG_TIPO;
        if (msgsnd(msqid, &msg, sizeof(msg.texto), 0) < 0)
            perror("msgsnd");

        total++;
    }
    endutent();

    /* Enviar mensaje de fin al hijo */
    msg.tipo = MSG_FIN;
    msg.texto[0] = '\0';
    msgsnd(msqid, &msg, sizeof(msg.texto), 0);

    /* Esperar a que el hijo termine de imprimir */
    wait(NULL);

    if (total == 0) {
        printf("\n[AVISO] No se encontraron sesiones activas en utmp.\n");
        printf("        Verifica con 'who' o 'loginctl list-sessions'.\n");
        printf("        Si 'who' muestra sesiones, ejecuta con sudo.\n");
    } else {
        printf("\nSesiones encontradas: %d\n", total);
    }

    time_t fin = time(NULL);
    struct tm *tf = localtime(&fin);
    printf("Hora fin    : %02d:%02d:%02d\n", tf->tm_hour, tf->tm_min, tf->tm_sec);
    printf("Tiempo total: %ld segundos\n", fin - inicio);

    /* Eliminar la cola de mensajes */
    msgctl(msqid, IPC_RMID, NULL);
    return 0;
}`,
  },
]

export default function Codigo() {
  const [modal, setModal] = useState<typeof practicas[0] | null>(null)

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <p className="font-mono text-xs text-green-600 tracking-widest uppercase mb-2">
        // código
      </p>
      <h1 className="text-2xl font-medium text-gray-900 mb-1">
        Prácticas y código
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Programas desarrollados durante el segundo y tercer parcial con notas de mejora.
      </p>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {practicas.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-3 hover:border-gray-400 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-xs text-green-600">{p.parcial}</span>
                <h3 className="text-sm font-medium text-gray-900 mt-0.5">{p.titulo}</h3>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{p.descripcion}</p>
            <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
              <span className="text-xs text-amber-600 font-mono">
                {p.mejoras.length} mejoras sugeridas
              </span>
              <button
                onClick={() => setModal(p)}
                className="ml-auto text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded transition-colors"
              >
                Ver código →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <span className="font-mono text-xs text-green-600">{modal.parcial}</span>
                <h2 className="text-sm font-semibold text-gray-900 mt-0.5">{modal.titulo}</h2>
              </div>
              <button
                onClick={() => setModal(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-light"
              >
                ✕
              </button>
            </div>

            {/* Contenido scrolleable */}
            <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-6">
              {/* Código */}
              <div>
                <p className="font-mono text-xs text-gray-400 mb-2">// código</p>
                <pre className="bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-lg overflow-x-auto leading-relaxed whitespace-pre-wrap">
                  {modal.codigo}
                </pre>
              </div>

              {/* Mejoras */}
              <div>
                <p className="font-mono text-xs text-gray-400 mb-3">// mejoras sugeridas</p>
                <ul className="flex flex-col gap-2">
                  {modal.mejoras.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="font-mono text-green-500 text-xs mt-0.5 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}