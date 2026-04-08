import { useMemo } from 'react'

/**
 * LensFlare - Cinematic light effects that add dramatic atmosphere.
 * Renders 2-3 flare sources with concentric rings, light streaks,
 * and hexagonal bokeh. Adapts color temperature based on zone prop.
 *
 * @param {number} zone - Current zone (0-4) controlling color temperature
 */

const ZONE_PALETTES = [
  // Zone 0: deep cool blues
  {
    core: 'rgba(180,220,255,1)',
    rings: ['rgba(80,160,255,0.25)', 'rgba(60,120,220,0.18)', 'rgba(100,140,255,0.12)', 'rgba(70,100,200,0.08)'],
    streak: 'rgba(140,200,255,0.35)',
    bokeh: ['rgba(100,180,255,0.3)', 'rgba(80,140,240,0.25)', 'rgba(120,160,255,0.2)'],
    glow: 'rgba(100,180,255,0.6)',
  },
  // Zone 1: cool blues (slightly brighter)
  {
    core: 'rgba(200,230,255,1)',
    rings: ['rgba(100,180,255,0.28)', 'rgba(80,150,240,0.2)', 'rgba(120,170,255,0.14)', 'rgba(90,130,220,0.09)'],
    streak: 'rgba(160,210,255,0.38)',
    bokeh: ['rgba(120,190,255,0.32)', 'rgba(100,160,250,0.26)', 'rgba(140,180,255,0.22)'],
    glow: 'rgba(130,200,255,0.65)',
  },
  // Zone 2: neutral whites
  {
    core: 'rgba(255,250,245,1)',
    rings: ['rgba(200,200,255,0.25)', 'rgba(220,210,240,0.18)', 'rgba(180,190,255,0.12)', 'rgba(210,200,230,0.08)'],
    streak: 'rgba(240,235,255,0.35)',
    bokeh: ['rgba(220,215,255,0.3)', 'rgba(200,200,240,0.24)', 'rgba(230,220,255,0.2)'],
    glow: 'rgba(230,225,255,0.6)',
  },
  // Zone 3: warm purples
  {
    core: 'rgba(255,220,255,1)',
    rings: ['rgba(200,100,255,0.28)', 'rgba(180,80,240,0.2)', 'rgba(220,120,255,0.14)', 'rgba(170,90,220,0.09)'],
    streak: 'rgba(230,160,255,0.38)',
    bokeh: ['rgba(210,130,255,0.32)', 'rgba(190,110,250,0.26)', 'rgba(230,150,255,0.22)'],
    glow: 'rgba(200,120,255,0.65)',
  },
  // Zone 4: warm pinks
  {
    core: 'rgba(255,210,240,1)',
    rings: ['rgba(255,100,200,0.25)', 'rgba(240,80,180,0.18)', 'rgba(255,130,210,0.12)', 'rgba(230,90,170,0.08)'],
    streak: 'rgba(255,170,220,0.35)',
    bokeh: ['rgba(255,140,210,0.3)', 'rgba(240,120,190,0.25)', 'rgba(255,160,220,0.2)'],
    glow: 'rgba(255,130,200,0.6)',
  },
]

// Flare source positions (percentage-based)
const FLARE_SOURCES = [
  { x: 18, y: 22, scale: 1, brightnessDelay: 0, driftAngle: 30 },
  { x: 75, y: 15, scale: 0.7, brightnessDelay: -1.5, driftAngle: 150 },
  { x: 52, y: 65, scale: 0.5, brightnessDelay: -3, driftAngle: 260 },
]

// Ring sizes (px radius from center)
const RING_RADII = [40, 70, 110, 150]

function generateBokehDots(count = 6) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    offsetX: (i - count / 2) * (30 + Math.random() * 25),
    offsetY: (Math.random() - 0.5) * 16,
    size: 4 + Math.random() * 6,
    opacityMul: 0.4 + Math.random() * 0.6,
    delay: Math.random() * -4,
  }))
}

export default function LensFlare({ zone = 0 }) {
  const palette = ZONE_PALETTES[Math.min(Math.max(Math.round(zone), 0), 4)]

  const bokehSets = useMemo(
    () => FLARE_SOURCES.map(() => generateBokehDots(6)),
    []
  )

  return (
    <>
      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes lensFlare-pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes lensFlare-drift {
          0%, 100% { translate: 0px 0px; }
          25% { translate: 3px -2px; }
          50% { translate: -2px 3px; }
          75% { translate: 2px 1px; }
        }
        @keyframes lensFlare-bokehTwinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes lensFlare-streakShimmer {
          0%, 100% { opacity: 0.6; filter: blur(2px); }
          50% { opacity: 1; filter: blur(3px); }
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 30,
          mixBlendMode: 'screen',
          overflow: 'hidden',
        }}
      >
        {FLARE_SOURCES.map((source, si) => {
          const bokehDots = bokehSets[si]
          return (
            <div
              key={si}
              style={{
                position: 'absolute',
                left: `${source.x}%`,
                top: `${source.y}%`,
                transform: `scale(${source.scale})`,
                animation: `lensFlare-pulse 4s ease-in-out infinite, lensFlare-drift 12s ease-in-out infinite`,
                animationDelay: `${source.brightnessDelay}s, ${source.brightnessDelay * 2}s`,
                willChange: 'opacity, transform, translate',
              }}
            >
              {/* Central bright point */}
              <div
                style={{
                  position: 'absolute',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: palette.core,
                  boxShadow: `0 0 20px 8px ${palette.glow}, 0 0 60px 20px ${palette.glow}`,
                  transform: 'translate(-50%, -50%)',
                  filter: 'blur(1px)',
                }}
              />

              {/* Concentric rings */}
              {RING_RADII.map((radius, ri) => (
                <div
                  key={ri}
                  style={{
                    position: 'absolute',
                    width: radius * 2,
                    height: radius * 2,
                    borderRadius: '50%',
                    border: `1.5px solid ${palette.rings[ri]}`,
                    boxShadow: `inset 0 0 ${8 + ri * 4}px ${palette.rings[ri]}, 0 0 ${6 + ri * 3}px ${palette.rings[ri]}`,
                    transform: 'translate(-50%, -50%)',
                    filter: `blur(${1 + ri * 0.5}px)`,
                  }}
                />
              ))}

              {/* Horizontal light streak */}
              <div
                style={{
                  position: 'absolute',
                  width: 320,
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${palette.streak}, ${palette.core}, ${palette.streak}, transparent)`,
                  transform: 'translate(-50%, -50%)',
                  filter: 'blur(2px)',
                  animation: `lensFlare-streakShimmer 3.5s ease-in-out infinite`,
                  animationDelay: `${source.brightnessDelay}s`,
                }}
              />
              {/* Secondary thicker streak for glow depth */}
              <div
                style={{
                  position: 'absolute',
                  width: 220,
                  height: 6,
                  background: `linear-gradient(90deg, transparent, ${palette.streak}, transparent)`,
                  transform: 'translate(-50%, -50%)',
                  filter: 'blur(6px)',
                  opacity: 0.5,
                }}
              />

              {/* Hexagonal bokeh dots along the streak line */}
              {bokehDots.map((dot) => (
                <div
                  key={dot.id}
                  style={{
                    position: 'absolute',
                    left: dot.offsetX,
                    top: dot.offsetY,
                    width: dot.size,
                    height: dot.size,
                    background: palette.bokeh[dot.id % palette.bokeh.length],
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    transform: 'translate(-50%, -50%)',
                    filter: 'blur(0.5px)',
                    animation: `lensFlare-bokehTwinkle ${2.5 + dot.opacityMul}s ease-in-out infinite`,
                    animationDelay: `${dot.delay}s`,
                  }}
                />
              ))}
            </div>
          )
        })}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Asteroids - Small drifting asteroid shapes scattered across the   */
/*  viewport. Simple CSS rotated squares/rectangles in dark grays.    */
/* ------------------------------------------------------------------ */

const ASTEROID_COUNT = 10

function generateAsteroids(count) {
  return Array.from({ length: count }, (_, i) => {
    const size = 4 + Math.random() * 10
    const aspect = 0.6 + Math.random() * 0.8 // width-to-height ratio
    const hue = 25 + Math.random() * 20       // brown-ish
    const lightness = 15 + Math.random() * 15  // dark
    return {
      id: i,
      x: Math.random() * 100,
      startY: -(5 + Math.random() * 15),       // start above viewport
      width: size * aspect,
      height: size,
      color: `hsl(${hue}, ${15 + Math.random() * 10}%, ${lightness}%)`,
      rotate: Math.random() * 360,
      rotateSpeed: 8 + Math.random() * 20,     // seconds per full rotation
      fallDuration: 30 + Math.random() * 50,   // seconds to cross viewport
      delay: Math.random() * -40,
      borderRadius: `${2 + Math.random() * 3}px`,
    }
  })
}

export function Asteroids() {
  const asteroids = useMemo(() => generateAsteroids(ASTEROID_COUNT), [])

  return (
    <>
      <style>{`
        @keyframes asteroid-fall {
          0%   { transform: translateY(0)    rotate(var(--ast-rot)); }
          100% { transform: translateY(130vh) rotate(calc(var(--ast-rot) + 360deg)); }
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 8,
          overflow: 'hidden',
        }}
      >
        {asteroids.map((a) => (
          <div
            key={a.id}
            style={{
              position: 'absolute',
              left: `${a.x}%`,
              top: `${a.startY}%`,
              width: a.width,
              height: a.height,
              background: a.color,
              borderRadius: a.borderRadius,
              boxShadow: `inset -1px -1px 2px rgba(0,0,0,0.5), 0 0 1px rgba(0,0,0,0.3)`,
              '--ast-rot': `${a.rotate}deg`,
              animation: `asteroid-fall ${a.fallDuration}s linear infinite`,
              animationDelay: `${a.delay}s`,
              opacity: 0.7,
              willChange: 'transform',
            }}
          />
        ))}
      </div>
    </>
  )
}
