const scripts = [
  {
    titulo: 'Script de ejemplo — listar procesos',
    version: 'original',
    lenguaje: 'bash',
    codigo: `ps aux | grep firefox`,
    mejora: `ps aux | grep -v grep | grep firefox | awk '{print $2, $11}'`,
    nota: 'La versión mejorada excluye el propio grep del resultado y muestra solo PID y nombre.',
  },
]

export default function Codigo() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <p className="font-mono text-xs text-green-600 tracking-widest uppercase mb-2">
        // código
      </p>
      <h1 className="text-2xl font-medium text-gray-900 mb-1">
        Mejoras de código
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Scripts de las prácticas con anotaciones y versiones mejoradas.
      </p>

      <div className="flex flex-col gap-6">
        {scripts.map((s) => (
          <div key={s.titulo} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <span className="font-mono text-sm font-medium text-gray-800">{s.titulo}</span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div>
                <p className="text-xs text-gray-400 font-mono mb-1">// original</p>
                <code className="block bg-gray-900 text-green-400 font-mono text-xs p-3 rounded-lg">
                  {s.codigo}
                </code>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-mono mb-1">// mejorado</p>
                <code className="block bg-gray-900 text-green-400 font-mono text-xs p-3 rounded-lg">
                  {s.mejora}
                </code>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                {s.nota}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}