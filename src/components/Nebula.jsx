import { useMemo } from 'react'

/**
 * Nebula - Renders layered, animated gradient clouds.
 * Much denser and more vivid than before. Each zone has
 * multiple large overlapping clouds for depth.
 */

const NEBULA_CONFIGS = [
  // Zone 1 - Launch: moody atmosphere, dark blues with hint of teal
  [
    { x: 15, y: 20, w: 600, h: 450, color: 'rgba(20, 30, 90, 0.5)', blur: 100 },
    { x: 65, y: 50, w: 500, h: 400, color: 'rgba(40, 20, 80, 0.4)', blur: 120 },
    { x: 40, y: 75, w: 450, h: 350, color: 'rgba(15, 40, 70, 0.35)', blur: 110 },
    { x: 85, y: 15, w: 350, h: 300, color: 'rgba(30, 50, 100, 0.3)', blur: 90 },
    { x: 5, y: 60, w: 400, h: 300, color: 'rgba(10, 20, 60, 0.45)', blur: 130 },
  ],
  // Zone 2 - Orbit: electric blues and teals
  [
    { x: 10, y: 15, w: 700, h: 500, color: 'rgba(40, 60, 180, 0.4)', blur: 110 },
    { x: 55, y: 40, w: 600, h: 450, color: 'rgba(60, 80, 200, 0.35)', blur: 130 },
    { x: 80, y: 5, w: 450, h: 400, color: 'rgba(30, 100, 180, 0.3)', blur: 100 },
    { x: 25, y: 65, w: 550, h: 400, color: 'rgba(50, 40, 160, 0.35)', blur: 120 },
    { x: 70, y: 70, w: 400, h: 350, color: 'rgba(40, 120, 200, 0.25)', blur: 140 },
    { x: 5, y: 35, w: 350, h: 300, color: 'rgba(60, 50, 170, 0.3)', blur: 90 },
  ],
  // Zone 3 - Deep Space: mysterious, dark purples
  [
    { x: 20, y: 30, w: 800, h: 550, color: 'rgba(30, 10, 80, 0.55)', blur: 140 },
    { x: 65, y: 15, w: 600, h: 450, color: 'rgba(50, 20, 100, 0.4)', blur: 120 },
    { x: 40, y: 60, w: 550, h: 400, color: 'rgba(20, 5, 60, 0.5)', blur: 130 },
    { x: 85, y: 55, w: 450, h: 380, color: 'rgba(60, 25, 110, 0.35)', blur: 110 },
    { x: 10, y: 80, w: 500, h: 350, color: 'rgba(40, 15, 90, 0.4)', blur: 150 },
  ],
  // Zone 4 - Galaxy: VIVID pinks, magentas, hot purples
  [
    { x: 10, y: 15, w: 750, h: 550, color: 'rgba(160, 40, 180, 0.45)', blur: 120 },
    { x: 50, y: 35, w: 650, h: 500, color: 'rgba(220, 60, 140, 0.4)', blur: 130 },
    { x: 80, y: 10, w: 500, h: 400, color: 'rgba(100, 50, 220, 0.35)', blur: 110 },
    { x: 25, y: 60, w: 600, h: 450, color: 'rgba(240, 80, 160, 0.35)', blur: 140 },
    { x: 70, y: 70, w: 450, h: 380, color: 'rgba(180, 30, 200, 0.3)', blur: 100 },
    { x: 5, y: 40, w: 400, h: 350, color: 'rgba(200, 100, 180, 0.3)', blur: 120 },
    { x: 45, y: 85, w: 550, h: 400, color: 'rgba(150, 60, 220, 0.25)', blur: 150 },
  ],
  // Zone 5 - Cosmic: MAXIMUM intensity, surreal, psychedelic
  [
    { x: 15, y: 10, w: 900, h: 600, color: 'rgba(180, 60, 240, 0.5)', blur: 140 },
    { x: 50, y: 30, w: 800, h: 550, color: 'rgba(240, 100, 180, 0.45)', blur: 130 },
    { x: 30, y: 55, w: 700, h: 500, color: 'rgba(120, 80, 255, 0.4)', blur: 120 },
    { x: 75, y: 15, w: 600, h: 450, color: 'rgba(255, 120, 200, 0.35)', blur: 150 },
    { x: 10, y: 70, w: 650, h: 400, color: 'rgba(200, 50, 255, 0.4)', blur: 110 },
    { x: 60, y: 65, w: 550, h: 450, color: 'rgba(100, 140, 255, 0.35)', blur: 140 },
    { x: 85, y: 50, w: 500, h: 400, color: 'rgba(255, 80, 220, 0.3)', blur: 130 },
    { x: 40, y: 85, w: 450, h: 350, color: 'rgba(160, 100, 255, 0.35)', blur: 120 },
  ],
]

export default function Nebula({ zone = 0 }) {
  const clouds = useMemo(() => NEBULA_CONFIGS[zone] || NEBULA_CONFIGS[0], [zone])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map((cloud, i) => (
        <div
          key={i}
          className="absolute rounded-full nebula-drift"
          style={{
            left: `${cloud.x}%`,
            top: `${cloud.y}%`,
            width: cloud.w,
            height: cloud.h,
            background: `radial-gradient(ellipse at ${45 + i * 5}% ${40 + i * 3}%, ${cloud.color}, transparent 65%)`,
            filter: `blur(${cloud.blur}px)`,
            mixBlendMode: 'screen',
            animationDelay: `${i * -3.5}s`,
            animationDuration: `${14 + i * 2.5}s`,
          }}
        />
      ))}
    </div>
  )
}
