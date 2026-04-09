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
      <div className="absolute top-1/2 left-6 sm:left-8 -translate-y-1/2 flex flex-col items-start gap-4">
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

        {/* JOIN TELEGRAM */}
        <a
          href="https://t.me/BUZZLIGHTYEARMEME"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:brightness-125"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.2))',
            border: '1px solid rgba(99,102,241,0.35)',
            boxShadow: '0 0 15px rgba(99,102,241,0.15), inset 0 0 15px rgba(99,102,241,0.05)',
            textDecoration: 'none',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.05 1.577c-.393-.016-.784.08-1.117.235-.484.186-4.92 1.902-9.41 3.64L2.97 8.6c-.832.296-.154.163-.886.47-.37.155-.756.406-.898.82-.14.41.015.737.178 1.011.163.275.37.477.63.626l4.33 2.174c.262.127.567.148.85.05L20.2 8.172c.152-.058.466-.188.604.015.14.203-.04.45-.174.583L12.8 16.26c-.283.262-.47.655-.442 1.078l-.004.14c0 .37.1.735.32 1.052.22.317.547.553.92.655l.078.024 3.95 1.182c.31.092.633.093.95.01.315-.082.598-.255.82-.498l2.23-2.43 4.23 3.122c.478.353 1.025.488 1.527.336.5-.15.86-.53 1.01-1.05.15-.52 7.74-32.56 7.74-32.56.16-.648.08-1.272-.22-1.752-.3-.48-.82-.793-1.4-.816zM21.1 4.6L9.14 14.26l-.004-.002-4.16-2.088L21.1 4.6z" fill="rgba(99,102,241,0.9)"/>
          </svg>
          <span
            className="hud-text text-xs"
            style={{
              color: 'rgba(255,255,255,0.85)',
              textShadow: '0 0 8px rgba(99,102,241,0.4)',
            }}
          >
            Join Telegram
          </span>
        </a>
      </div>

      {/* Corner brackets - cinematic framing */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-indigo-500/20" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-indigo-500/20" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-indigo-500/20" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-indigo-500/20" />
    </div>
  )
}
