import { useMemo } from 'react'

/**
 * Planets - Rich, detailed celestial bodies with atmospheres,
 * rings, surface detail, and glow effects. Way more of them now.
 */

function Planet({ size, color, ringColor, x, y, glow, hasRing, shadow, atmosphere, detail }) {
  return (
    <div
      className="absolute planet-hover cursor-pointer"
      style={{ left: x, top: y }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* Atmospheric glow */}
        {atmosphere && (
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: size * 1.6,
              height: size * 1.6,
              background: `radial-gradient(circle, ${atmosphere} 30%, transparent 70%)`,
              filter: 'blur(15px)',
              opacity: 0.5,
            }}
          />
        )}

        {/* Planet body */}
        <div
          className="w-full h-full rounded-full relative overflow-hidden"
          style={{
            background: color,
            boxShadow: `
              inset -${size / 5}px -${size / 6}px ${size / 3}px rgba(0,0,0,0.6),
              inset ${size / 10}px ${size / 10}px ${size / 5}px rgba(255,255,255,0.05),
              0 0 ${glow}px ${shadow || 'rgba(99,102,241,0.3)'},
              0 0 ${glow * 2}px ${shadow || 'rgba(99,102,241,0.15)'}
            `,
          }}
        >
          {/* Surface bands / detail */}
          {detail && (
            <>
              <div className="absolute w-full" style={{
                top: '30%', height: '8%', opacity: 0.15,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              }} />
              <div className="absolute w-full" style={{
                top: '55%', height: '5%', opacity: 0.1,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              }} />
              <div className="absolute w-full" style={{
                top: '70%', height: '12%', opacity: 0.08,
                background: 'linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.15) 50%, transparent 80%)',
              }} />
            </>
          )}
        </div>

        {/* Ring system */}
        {hasRing && (
          <>
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: size * 2,
                height: size * 0.45,
                border: `2px solid ${ringColor || 'rgba(168,85,247,0.4)'}`,
                transform: 'translate(-50%, -50%) rotateX(75deg)',
                boxShadow: `0 0 10px ${ringColor || 'rgba(168,85,247,0.2)'}`,
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: size * 1.7,
                height: size * 0.38,
                border: `1px solid ${ringColor || 'rgba(168,85,247,0.2)'}`,
                transform: 'translate(-50%, -50%) rotateX(75deg)',
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}

function Moon({ size, x, y, color, glowColor }) {
  return (
    <div className="absolute planet-hover" style={{ left: x, top: y }}>
      <div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: color || 'radial-gradient(circle at 35% 35%, #888, #444)',
          boxShadow: `inset -3px -2px 6px rgba(0,0,0,0.6), 0 0 ${size}px ${glowColor || 'rgba(150,150,200,0.15)'}`,
        }}
      />
    </div>
  )
}

export default function Planets() {
  return (
    <div className="absolute inset-0 pointer-events-none">

      {/* ── ZONE 1 - Small moon visible early ── */}
      <Moon size={18} x="88%" y="8%" color="radial-gradient(circle at 30% 30%, #aaa, #555)" glowColor="rgba(180,180,220,0.15)" />

      {/* ── ZONE 2 - Rocky planet + satellite ── */}
      <div className="pointer-events-auto">
        <Planet
          size={70}
          color="radial-gradient(circle at 28% 28%, #6b7ec7, #3a4580, #1e2550)"
          x="85%"
          y="18%"
          glow={35}
          shadow="rgba(91,106,191,0.35)"
          atmosphere="rgba(91,106,191,0.2)"
          detail
        />
        <Moon size={14} x="78%" y="15%" color="radial-gradient(circle at 35% 35%, #888, #444)" />
        <Moon size={8} x="92%" y="22%" color="radial-gradient(circle at 30% 30%, #666, #333)" />
      </div>

      {/* ── Small distant planet cluster ── */}
      <Planet
        size={30}
        color="radial-gradient(circle at 35% 30%, #8b6cc7, #4a3570)"
        x="12%"
        y="25%"
        glow={15}
        shadow="rgba(139,108,199,0.3)"
      />
      <Planet
        size={20}
        color="radial-gradient(circle at 30% 30%, #6ba5c7, #3a6580)"
        x="18%"
        y="28%"
        glow={10}
        shadow="rgba(107,165,199,0.2)"
      />

      {/* ── ZONE 3 - Gas giant with rings ── */}
      <div className="pointer-events-auto">
        <Planet
          size={120}
          color="radial-gradient(circle at 32% 28%, #7a4d90, #3d2050, #1e0e30)"
          x="8%"
          y="42%"
          glow={60}
          shadow="rgba(122,77,144,0.4)"
          hasRing
          ringColor="rgba(168,85,247,0.3)"
          atmosphere="rgba(122,77,144,0.25)"
          detail
        />
        <Moon size={16} x="3%" y="38%" color="radial-gradient(circle at 35% 30%, #9a8ab0, #5a4a70)" glowColor="rgba(168,85,247,0.1)" />
      </div>

      {/* Distant tiny planet */}
      <Planet
        size={25}
        color="radial-gradient(circle at 30% 30%, #c79b6b, #806040)"
        x="92%"
        y="48%"
        glow={12}
        shadow="rgba(199,155,107,0.2)"
      />

      {/* ── ZONE 4 - Vivid planet pair ── */}
      <div className="pointer-events-auto">
        <Planet
          size={90}
          color="radial-gradient(circle at 30% 25%, #ec4899, #9333ea, #4f1d91)"
          x="78%"
          y="60%"
          glow={50}
          shadow="rgba(236,72,153,0.4)"
          atmosphere="rgba(236,72,153,0.2)"
          detail
        />
        <Moon size={12} x="74%" y="57%" color="radial-gradient(circle at 30% 30%, #f0a0c0, #a06080)" glowColor="rgba(236,72,153,0.15)" />
      </div>

      <div className="pointer-events-auto">
        <Planet
          size={55}
          color="radial-gradient(circle at 35% 28%, #60a5fa, #2563eb, #1e1b4b)"
          x="15%"
          y="68%"
          glow={30}
          shadow="rgba(96,165,250,0.35)"
          hasRing
          ringColor="rgba(96,165,250,0.25)"
          atmosphere="rgba(96,165,250,0.15)"
        />
      </div>

      {/* Small vivid moon */}
      <Moon size={22} x="55%" y="72%" color="radial-gradient(circle at 30% 30%, #f472b6, #9333ea)" glowColor="rgba(244,114,182,0.2)" />

      {/* ── ZONE 5 - Massive cosmic planet ── */}
      <div className="pointer-events-auto">
        <Planet
          size={160}
          color="radial-gradient(circle at 28% 22%, #c084fc, #7c3aed, #3b0764, #1a0533)"
          x="65%"
          y="82%"
          glow={100}
          shadow="rgba(192,132,252,0.35)"
          hasRing
          ringColor="rgba(236,72,153,0.2)"
          atmosphere="rgba(192,132,252,0.3)"
          detail
        />
        <Moon size={20} x="58%" y="78%" color="radial-gradient(circle at 30% 30%, #d8b4fe, #8b5cf6)" glowColor="rgba(192,132,252,0.2)" />
        <Moon size={10} x="82%" y="88%" color="radial-gradient(circle at 30% 30%, #a78bfa, #6d28d9)" />
      </div>

      {/* Final tiny distant planets */}
      <Planet size={35} color="radial-gradient(circle at 30% 30%, #f9a8d4, #be185d)" x="20%" y="88%" glow={18} shadow="rgba(249,168,212,0.25)" />
      <Planet size={15} color="radial-gradient(circle at 30% 30%, #a5b4fc, #4338ca)" x="45%" y="92%" glow={8} shadow="rgba(165,180,252,0.2)" />
    </div>
  )
}
