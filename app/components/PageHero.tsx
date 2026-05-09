import HeroBackground from './HeroBackground'
import RevealHeading from './RevealHeading'

type Props = {
  kicker: string
  title: string
  accent?: string
  subtitle?: string
  height?: string
  align?: 'left' | 'center'
  maxWidth?: string
  image?: string
}

export default function PageHero({
  kicker,
  title,
  accent,
  subtitle,
  height = 'h-80',
  align = 'left',
  maxWidth = 'max-w-5xl',
  image,
}: Props) {
  return (
    <header
      className={`relative ${height} flex items-end px-6 pb-12 border-b border-white/10 overflow-hidden`}
    >
      <HeroBackground image={image} />

      <div
        className={`relative z-10 ${maxWidth} ${
          align === 'center' ? 'mx-auto text-center' : 'mx-auto'
        } w-full`}
      >
        <p
          className={`font-mono text-[11px] text-green-400 tracking-[0.25em] uppercase mb-4 flex items-center gap-2 animate-fade-up ${
            align === 'center' ? 'justify-center' : ''
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
          {kicker}
        </p>

        <RevealHeading
          text={title}
          as="h1"
          className="text-4xl sm:text-6xl font-light text-white leading-[1.05] tracking-[-0.035em] mb-3 bg-gradient-to-br from-white via-white to-green-200 bg-clip-text text-transparent"
        />

        {accent && (
          <p
            className="text-2xl sm:text-3xl font-extralight italic text-gray-400 leading-tight mb-4 animate-fade-up"
            style={{ animationDelay: '450ms' }}
          >
            {accent}
          </p>
        )}

        {subtitle && (
          <p
            className="text-sm text-gray-300 leading-relaxed max-w-xl animate-fade-up"
            style={{ animationDelay: '600ms' }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </header>
  )
}
