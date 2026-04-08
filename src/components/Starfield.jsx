import { useMemo } from 'react'

/**
 * Starfield - Dense, multi-layered star generation.
 * Uses a seeded pseudo-random for deterministic positions.
 * Includes colored stars, bright hotspots, and glow effects.
 */

// Seeded random to avoid hydration issues
function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generateStars(count, sizeRange, opacityRange, seed, colorChance = 0) {
  const rand = seededRandom(seed)
  const stars = []
  const COLORS = [
    'rgba(99,102,241,0.9)',   // indigo
    'rgba(168,85,247,0.85)',  // purple
    'rgba(236,72,153,0.8)',   // pink
    'rgba(96,165,250,0.85)',  // blue
    'rgba(248,113,113,0.7)',  // warm red
    'rgba(250,204,21,0.6)',   // gold
  ]

  for (let i = 0; i < count; i++) {
    const size = sizeRange[0] + rand() * (sizeRange[1] - sizeRange[0])
    const opacity = opacityRange[0] + rand() * (opacityRange[1] - opacityRange[0])
    const isColored = rand() < colorChance
    const color = isColored ? COLORS[Math.floor(rand() * COLORS.length)] : 'white'
    const isHotspot = rand() < 0.04 // 4% chance of being a bright hotspot

    stars.push({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: isHotspot ? size * 2 : size,
      opacity: isHotspot ? Math.min(opacity + 0.4, 1) : opacity,
      duration: 1.5 + rand() * 4,
      delay: rand() * 6,
      color,
      glow: isHotspot || size > sizeRange[1] * 0.8,
      glowSize: isHotspot ? size * 5 : size * 3,
      glowColor: isColored ? color : 'rgba(255,255,255,0.4)',
    })
  }
  return stars
}

export default function Starfield() {
  const distantStars = useMemo(() => generateStars(300, [0.4, 1.5], [0.15, 0.55], 12345, 0.08), [])
  const midStars = useMemo(() => generateStars(150, [1, 2.5], [0.35, 0.85], 67890, 0.15), [])
  const closeStars = useMemo(() => generateStars(60, [2, 4.5], [0.5, 1], 11111, 0.2), [])

  return (
    <>
      {/* Layer 1: Deep distant stars */}
      <div className="absolute inset-0 w-full h-full">
        {distantStars.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full star-twinkle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              background: s.color,
              boxShadow: s.glow ? `0 0 ${s.glowSize}px ${s.glowColor}` : 'none',
              '--duration': `${s.duration}s`,
              '--delay': `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Layer 2: Mid-range stars */}
      <div className="absolute inset-0 w-full h-full">
        {midStars.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full star-twinkle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              background: s.color,
              boxShadow: s.glow ? `0 0 ${s.glowSize}px ${s.glowColor}` : 'none',
              '--duration': `${s.duration}s`,
              '--delay': `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Layer 3: Close stars — bright, glowing */}
      <div className="absolute inset-0 w-full h-full">
        {closeStars.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full star-twinkle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              background: s.color,
              boxShadow: `0 0 ${s.glowSize}px ${s.glowColor}, 0 0 ${s.glowSize * 0.5}px white`,
              '--duration': `${s.duration}s`,
              '--delay': `${s.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  )
}
