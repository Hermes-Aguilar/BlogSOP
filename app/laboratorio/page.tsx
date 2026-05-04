const comandos = [
  {
    titulo: 'Listar archivos',
    sistemas: ['linux', 'macos', 'windows'],
    rows: [
      { os: 'linux', cmd: 'ls -la' },
      { os: 'macos', cmd: 'ls -la' },
      { os: 'windows', cmd: 'dir /a' },
    ],
    nota: 'En Linux y macOS el comportamiento es idéntico. Windows usa un modelo de permisos distinto (NTFS vs ext4).',
  },
  {
    titulo: 'Matar un proceso',
    sistemas: ['linux', 'macos', 'windows'],
    rows: [
      { os: 'linux', cmd: 'kill -9 <PID>' },
      { os: 'macos', cmd: 'kill -9 <PID>' },
      { os: 'windows', cmd: 'taskkill /PID <PID> /F' },
    ],
    nota: 'La señal SIGKILL (-9) existe solo en sistemas POSIX. Windows usa su propio mecanismo con /F (force).',
  },
  {
    titulo: 'Permisos de archivo',
    sistemas: ['linux', 'macos'],
    rows: [
      { os: 'linux', cmd: 'chmod 755 archivo' },
      { os: 'macos', cmd: 'chmod 755 archivo' },
    ],
    nota: 'Windows no tiene equivalente nativo. En PowerShell se usa icacls, pero el modelo ACL es distinto al octal Unix.',
  },
]

const osBadge: Record<string, string> = {
  linux: 'bg-green-100 text-green-800',
  macos: 'bg-blue-100 text-blue-800',
  windows: 'bg-amber-100 text-amber-800',
}

export default function Laboratorio() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <p className="font-mono text-xs text-green-600 tracking-widest uppercase mb-2">
        // laboratorio
      </p>
      <h1 className="text-2xl font-medium text-gray-900 mb-1">
        Laboratorio de comandos
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Comparación de comandos entre sistemas operativos y notas sobre sus diferencias.
      </p>

      <div className="flex flex-col gap-4">
        {comandos.map((c) => (
          <div key={c.titulo} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
              <span className="font-mono text-sm font-medium text-gray-800">{c.titulo}</span>
              <div className="flex gap-2">
                {c.sistemas.map((s) => (
                  <span key={s} className={`font-mono text-xs px-2 py-0.5 rounded-full ${osBadge[s]}`}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="px-4 py-3 flex flex-col gap-2">
              {c.rows.map((r) => (
                <div key={r.os} className="flex items-center gap-4 text-sm">
                  <span className="font-mono text-xs text-gray-400 w-16">{r.os}</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800">
                    {r.cmd}
                  </code>
                </div>
              ))}
              <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100 leading-relaxed">
                {c.nota}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}