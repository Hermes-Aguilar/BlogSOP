import SpotlightCard from './SpotlightCard'

type Props = {
  prevHref: string
  prevLabel: string
  nextHref: string
  nextLabel: string
  className?: string
}

export default function FooterNav({
  prevHref,
  prevLabel,
  nextHref,
  nextLabel,
  className = '',
}: Props) {
  return (
    <footer className={`mt-12 pt-8 border-t border-white/10 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden">
        <SpotlightCard
          href={prevHref}
          className="group bg-[#0a0a0a] hover:bg-[#101010] p-5 transition-colors block"
        >
          <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            anterior
          </p>
          <p className="text-sm text-gray-200 group-hover:text-green-400 transition-colors">
            {prevLabel}
          </p>
        </SpotlightCard>

        <SpotlightCard
          href={nextHref}
          className="group bg-[#0a0a0a] hover:bg-[#101010] p-5 transition-colors text-right block"
        >
          <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2 justify-end">
            siguiente
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </p>
          <p className="text-sm text-gray-200 group-hover:text-green-400 transition-colors">
            {nextLabel}
          </p>
        </SpotlightCard>
      </div>
    </footer>
  )
}
