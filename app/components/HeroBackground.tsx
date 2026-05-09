type Props = {
  image?: string
}

export default function HeroBackground({ image }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#070707]">
      {/* Imagen de fondo (si se pasa) */}
      {image && (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Oscurece la imagen para que los blobs y el texto destaquen */}
          <div className="absolute inset-0 bg-black/55" />
        </>
      )}

      {/* Mesh blobs animados */}
      <div
        className="mesh-blob"
        style={{
          width: '55%',
          height: '70%',
          top: '-10%',
          left: '-10%',
          background: 'radial-gradient(circle, rgba(29,158,117,0.55), transparent 70%)',
          animationDelay: '0s',
        }}
      />
      <div
        className="mesh-blob"
        style={{
          width: '45%',
          height: '60%',
          bottom: '-15%',
          right: '-5%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.35), transparent 70%)',
          animationDelay: '-6s',
        }}
      />
      <div
        className="mesh-blob"
        style={{
          width: '40%',
          height: '50%',
          top: '20%',
          right: '20%',
          background: 'radial-gradient(circle, rgba(192,132,252,0.25), transparent 70%)',
          animationDelay: '-12s',
        }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern" />

      {/* Vignette / fade hacia abajo para integrar con la siguiente sección */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
    </div>
  )
}
