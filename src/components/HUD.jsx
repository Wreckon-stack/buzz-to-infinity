import { useState, useEffect, useRef } from 'react'

/**
 * HUD - Heads-Up Display overlay.
 * Shows altitude, speed, and zone info.
 * Altitude climbs forever. Speed oscillates per zone.
 */
export default function HUD({ scrollProgress = 0 }) {
  const [altitude, setAltitude] = useState(0)
  const startRef = useRef(Date.now())

  // Altitude climbs continuously forever (never resets)
  useEffect(() => {
    const tick = () => {
      const elapsed = (Date.now() - startRef.current) / 1000
      setAltitude(Math.floor(elapsed * 1337)) // ~1,337 km/s climb
    }
    const id = setInterval(tick, 50)
    return () => clearInterval(id)
  }, [])

  const speed = Math.floor(8000 + Math.sin(scrollProgress * Math.PI * 2) * 6000 + altitude * 0.003)
  const zone = scrollProgress < 0.2
    ? 'ATMOSPHERE'
    : scrollProgress < 0.4
    ? 'LOW ORBIT'
    : scrollProgress < 0.6
    ? 'DEEP SPACE'
    : scrollProgress < 0.8
    ? 'GALAXY CORE'
    : 'INFINITY'

  return (
    <div className="fixed inset-0 pointer-events-none z-40 p-4 sm:p-6 md:p-8">
      {/* Top left - Zone */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
        <div className="hud-text text-indigo-400/60 mb-1">ZONE</div>
        <div
          className="hud-text text-white/80 text-xs sm:text-sm transition-all duration-500"
          style={{
            textShadow: '0 0 10px rgba(99,102,241,0.5)',
          }}
        >
          {zone}
        </div>
      </div>

      {/* Top right - Altitude */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 text-right">
        <div className="hud-text text-indigo-400/60 mb-1">ALTITUDE</div>
        <div
          className="hud-text text-white/80 text-xs sm:text-sm tabular-nums"
          style={{ textShadow: '0 0 10px rgba(99,102,241,0.5)' }}
        >
          {altitude.toLocaleString()} KM
        </div>
      </div>

      {/* Bottom left - Speed */}
      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
        <div className="hud-text text-indigo-400/60 mb-1">VELOCITY</div>
        <div
          className="hud-text text-white/80 text-xs sm:text-sm tabular-nums"
          style={{ textShadow: '0 0 10px rgba(99,102,241,0.5)' }}
        >
          {speed.toLocaleString()} KM/S
        </div>
      </div>

      {/* Bottom right - Zone cycle progress */}
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 text-right">
        <div className="hud-text text-indigo-400/60 mb-2">CYCLE</div>
        <div className="w-20 sm:w-24 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${scrollProgress * 100}%`,
              background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
              boxShadow: '0 0 10px rgba(99,102,241,0.5)',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
        <div className="hud-text text-white/60 text-xs mt-1 tabular-nums">
          {altitude.toLocaleString()} KM
        </div>
      </div>

      {/* ── $BUZZ branding ── */}
      <div className="absolute top-1/2 left-6 sm:left-8 -translate-y-1/2">
        <div
          className="title-infinity text-lg sm:text-xl md:text-2xl"
          style={{
            background: 'linear-gradient(180deg, #6366f1, #a855f7, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 12px rgba(99,102,241,0.4))',
            letterSpacing: '0.15em',
          }}
        >
          $BUZZ
        </div>
      </div>

      {/* Corner brackets - cinematic framing */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-indigo-500/20" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-indigo-500/20" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-indigo-500/20" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-indigo-500/20" />
    </div>
  )
}
