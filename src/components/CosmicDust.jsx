import { useMemo } from 'react'

/**
 * CosmicDust - Floating micro-particles with varied colors and glow.
 * Creates a dense, atmospheric sense of being immersed in cosmic debris.
 */

const COLORS = [
  'rgba(168, 85, 247,',   // purple
  'rgba(99, 102, 241,',   // indigo
  'rgba(236, 72, 153,',   // pink
  'rgba(96, 165, 250,',   // blue
  'rgba(200, 200, 255,',  // white-blue
]

export default function CosmicDust({ count = 80 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const colorBase = COLORS[i % COLORS.length]
      const opacity = 0.15 + (i % 7) * 0.06
      return {
        id: i,
        x: (i * 31.7) % 100,
        y: (i * 19.3) % 100,
        size: 1 + (i % 4) * 0.7,
        opacity,
        color: `${colorBase}${opacity})`,
        glowColor: `${colorBase}${opacity * 0.5})`,
        duration: 12 + (i % 8) * 3,
        delay: (i % 12) * -2,
        drift: i % 4,
      }
    })
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.glowColor}`,
            animation: `dustDrift${p.drift} ${p.duration}s ease-in-out infinite alternate`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes dustDrift0 {
          0% { transform: translate(0, 0); }
          100% { transform: translate(25px, -35px); }
        }
        @keyframes dustDrift1 {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-30px, -18px); }
        }
        @keyframes dustDrift2 {
          0% { transform: translate(0, 0); }
          100% { transform: translate(18px, 28px); }
        }
        @keyframes dustDrift3 {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-22px, 22px); }
        }
      `}</style>
    </div>
  )
}
