# Skills recomendadas para este proyecto

Análisis del proyecto y sugerencias de skills (capacidades reutilizables) que valdría la pena tener configuradas en Claude Code para trabajar más rápido y con menos fricción aquí.

---

## Contexto del proyecto

- **Stack**: Next.js `16.2.4` (App Router) + React `19.2.4` + TailwindCSS `v4` + TypeScript `5`.
- **Tipo**: Portafolio / blog estático de la materia *Sistemas Operativos* (6° semestre).
- **Estructura**: 4 rutas principales bajo `app/` — `comparativa`, `laboratorio`, `codigo`, `reflexion` — cada una con un `page.tsx` que mapea sobre un array local de datos.
- **Estética compartida**: fondo `#0a0a0a`, acentos `green-400`, `font-mono` (JetBrains Mono), tarjetas `bg-[#0a0a0a] hover:bg-[#141414]`, encabezados tipo `// seccion`, prefijo `~$ sudo` en navbar.
- **Idioma**: contenido en español.
- **Restricción explícita** (`AGENTS.md`): "This is NOT the Next.js you know" — Next 16 introduce breaking changes; hay que leer `node_modules/next/dist/docs/` antes de escribir código.

---

## Skills propuestas

### 1. `nextjs16-guard` — verificador de APIs de Next 16
**Por qué**: el propio `AGENTS.md` advierte que Next 16 rompe APIs y convenciones. Es el riesgo #1 al pedir cualquier cambio (rutas, metadata, fetch, headers, params async, etc.).
**Qué haría**: antes de generar/editar código de Next, consultar `node_modules/next/dist/docs/` para la API en cuestión y avisar deprecaciones. Si se va a usar `params`, `searchParams`, `cookies()`, `headers()`, `fetch` con cache, etc., validar la firma actual.
**Disparador**: cualquier edición que toque `app/**/*.tsx`, `next.config.ts`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`.

### 2. `tailwind-v4-syntax` — guía de Tailwind v4
**Por qué**: el proyecto usa Tailwind v4 (`@import "tailwindcss"` en `globals.css`, sin `tailwind.config` clásico activo, clases como `bg-linear-to-b` en vez de `bg-gradient-to-b`). La mayoría de modelos asumen v3.
**Qué haría**: traducir patrones v3 → v4, recordar el nuevo sistema de tema con `@theme`, validar que no se inventen clases viejas (`bg-gradient-to-*`, `divide-*` con la sintaxis previa, etc.).
**Disparador**: ediciones en `*.tsx` con `className=` o en `globals.css`.

### 3. `seccion-nueva` — scaffolding de páginas con estilo del blog
**Por qué**: las 4 páginas comparten un patrón muy claro (header `// nombre` verde + título `text-3xl font-light` + grid de tarjetas mapeadas sobre array tipado). Hacer una nueva sección a mano es repetitivo.
**Qué haría**: a partir de una descripción ("nueva sección sobre hilos con pthreads"), generar `app/<slug>/page.tsx` siguiendo exactamente la convención visual existente (paleta, tipografía, márgenes, `font-mono text-[11px] text-green-400 tracking-[0.2em] uppercase`, etc.) y agregar el link al `Navbar.tsx` y a `sections` en `app/page.tsx`.
**Disparador**: el usuario pide "agrega una sección de X" o "nueva página sobre Y".

### 4. `comando-doc` — añadir comandos al laboratorio
**Por qué**: `app/laboratorio/page.tsx` es un array de `categorias > comandos` con campos fijos: `nombre`, `syscall`, `descripcion`, `uso`, `ejemplo`. Igual `app/codigo/page.tsx` documenta scripts/prácticas.
**Qué haría**: cuando se diga "agrega el comando `kill` al laboratorio" o "documenta esta práctica de pthreads", insertar la entrada respetando el shape exacto, sin romper el orden por categoría/parcial, y validar que el `syscall` y la descripción sean técnicamente correctas para Linux/POSIX.
**Disparador**: peticiones de tipo "agrega/documenta comando|práctica|syscall".

### 5. `build-check` — pasar build + lint antes de declarar terminado
**Por qué**: es un proyecto sin tests; la única red de seguridad es `next build` y `eslint`. Tras editar `.tsx` conviene correrlos siempre.
**Qué haría**: tras cualquier cambio en `app/**`, ejecutar `npm run lint` y `npm run build` y reportar errores con su ubicación. Idealmente como hook `Stop` o `PostToolUse` en `settings.json`.
**Disparador**: terminar una tanda de ediciones.

### 6. `consistencia-visual` — auditor de estilo
**Por qué**: hay micro-divergencias visibles (p. ej. `app/reflexion/page.tsx` usa `text-gray-900` y `text-green-600` mientras el resto del sitio es dark con `text-gray-100` y `text-green-400`). Sin guardrail, esto crece.
**Qué haría**: revisar que las páginas nuevas/editadas mantengan: fondo dark, paleta de grises (`gray-100/400/500`), acento `green-400`, tarjetas `bg-[#0a0a0a]`, headers `font-mono text-[11px] text-green-400 tracking-[0.2em] uppercase` con prefijo `// `, contenedor `max-w-5xl mx-auto px-6/8 py-16`.
**Disparador**: PRs o ediciones de páginas; idealmente review on demand.

### 7. `es-tech-writing` — redacción técnica en español
**Por qué**: todo el contenido está en español neutro técnico (no machine-translated): "syscall", "padre/hijo", "memoria compartida", "tubería con nombre". Cualquier texto nuevo debe sonar igual.
**Qué haría**: al generar copy nuevo, mantener registro: tono didáctico-conciso, usar términos técnicos en inglés cuando son estándar (`fork`, `pipe`, `syscall`), explicaciones cortas (< 3 líneas en tarjetas), ejemplos concretos ("Práctica 1.2 — factorial con pipe bidireccional").
**Disparador**: generación de descripciones, reflexiones, intros.

### 8. `syscall-accuracy` — verificador de exactitud técnica
**Por qué**: el blog documenta APIs reales de Linux. Un error tipo "shmget pertenece a `sys/ipc.h`" (cuando es `sys/shm.h`) destruye credibilidad académica.
**Qué haría**: validar que `nombre`/`syscall`/`descripcion`/`uso` de cada comando documentado sean correctos según `man 2 <syscall>` o `man 3`. Comprobar headers, firmas y semántica antes de comitear.
**Disparador**: ediciones a `laboratorio/page.tsx` o `codigo/page.tsx`.

---

## Skills que NO recomiendo (para este proyecto)

- **Testing E2E (Playwright/Cypress)** — proyecto puramente estático, sin lógica de cliente compleja; sería over-engineering.
- **DB / migraciones** — no hay backend ni base de datos.
- **Auth / sesiones** — fuera de alcance.
- **i18n** — el proyecto es monolingüe (es) por diseño.

---

## Cómo seguir desde aquí

1. Decidir cuáles de las 8 te interesan más (sugerencia mínima: **1, 2, 5** — son las que evitan errores de runtime/build).
2. Para cada una, crear `.claude/skills/<nombre>/SKILL.md` con frontmatter `name`, `description`, y los disparadores. Claude Code las invoca automáticamente cuando el contexto coincide.
3. Para `build-check` además vale configurarlo como hook en `.claude/settings.json` (`PostToolUse` sobre `Edit|Write` filtrando `app/**`) para que corra sin que tengas que pedirlo.

Si quieres, puedo generar los `SKILL.md` de las que elijas.
