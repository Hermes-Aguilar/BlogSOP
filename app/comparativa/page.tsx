const parciales = [
  {
    num: '2do parcial',
    temas: [
      {
        temario: 'Gestión de procesos',
        practica: 'Práctica 3 — ps, kill, top',
        estado: 'cubierto',
      },
      {
        temario: 'Sistema de archivos',
        practica: 'Práctica 4 — permisos chmod',
        estado: 'cubierto',
      },
      {
        temario: 'Memoria virtual',
        practica: 'Solo teoría, sin práctica',
        estado: 'sin práctica',
      },
    ],
  },
  {
    num: '3er parcial',
    temas: [
      {
        temario: 'Shell scripting',
        practica: 'Práctica 7 — bash scripts',
        estado: 'cubierto',
      },
      {
        temario: 'Sincronización',
        practica: 'Práctica adaptada — semáforos',
        estado: 'modificado',
      },
      {
        temario: 'Redes y sockets',
        practica: 'Sin cobertura',
        estado: 'sin práctica',
      },
    ],
  },
]

const badgeStyle: Record<string, string> = {
  cubierto: 'bg-green-100 text-green-800',
  modificado: 'bg-amber-100 text-amber-800',
  'sin práctica': 'bg-red-100 text-red-800',
}

export default function Comparativa() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <p className="font-mono text-xs text-green-600 tracking-widest uppercase mb-2">
        // comparativa
      </p>
      <h1 className="text-2xl font-medium text-gray-900 mb-1">
        Temario vs Prácticas
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Comparación entre el plan de estudios oficial y lo que se realizó en clase.
      </p>

      {parciales.map((p) => (
        <div key={p.num} className="mb-8">
          <p className="font-mono text-xs text-green-600 uppercase tracking-widest mb-3">
            // {p.num}
          </p>
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Header */}
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
              <div className="px-4 py-2 text-xs font-medium text-gray-500">Tema del temario</div>
              <div className="px-4 py-2 text-xs font-medium text-gray-500">Práctica realizada</div>
              <div className="px-4 py-2 text-xs font-medium text-gray-500">Estado</div>
            </div>
            {/* Rows */}
            {p.temas.map((t, i) => (
              <div
                key={i}
                className="grid grid-cols-3 border-b border-gray-100 last:border-0"
              >
                <div className="px-4 py-3 text-sm text-gray-800">{t.temario}</div>
                <div className="px-4 py-3 text-sm text-gray-600">{t.practica}</div>
                <div className="px-4 py-3">
                  <span className={`text-xs font-mono px-2 py-1 rounded-full ${badgeStyle[t.estado]}`}>
                    {t.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  )
}