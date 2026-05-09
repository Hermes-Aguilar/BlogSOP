type Props = {
  text: string
  className?: string
  delayStep?: number
  baseDelay?: number
  as?: 'h1' | 'h2'
}

export default function RevealHeading({
  text,
  className = '',
  delayStep = 90,
  baseDelay = 100,
  as: Tag = 'h1',
}: Props) {
  const words = text.split(' ')
  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
        >
          <span
            className="reveal-word"
            style={{ ['--reveal-delay' as string]: `${baseDelay + i * delayStep}ms` }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </Tag>
  )
}
