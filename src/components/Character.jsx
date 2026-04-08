import { useEffect, useRef, useMemo } from 'react'
import characterImg from '../assets/hero.png'

/**
 * Character - Buzz Lightyear ascending through space.
 *
 * The PNG shows Buzz in a diagonal flying pose (fist forward, leaning right).
 * All effects are positioned to match this pose:
 * - Thruster fires from his jetpack / lower-back area
 * - Aura centered on his body mass
 * - Energy rings orbit around his torso
 * - Wake trail follows behind/below him
 */

const STYLE_ID = '__character-fx-styles'
const injectStyles = () => {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes orbitRingA {
      0%   { transform: rotateX(70deg) rotateZ(0deg); }
      100% { transform: rotateX(70deg) rotateZ(360deg); }
    }
    @keyframes orbitRingB {
      0%   { transform: rotateX(55deg) rotateY(30deg) rotateZ(0deg); }
      100% { transform: rotateX(55deg) rotateY(30deg) rotateZ(-360deg); }
    }
    @keyframes orbitRingC {
      0%   { transform: rotateX(80deg) rotateY(-20deg) rotateZ(0deg); }
      100% { transform: rotateX(80deg) rotateY(-20deg) rotateZ(360deg); }
    }
    @keyframes auraPulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1);   opacity: 0.3; }
      50%      { transform: translate(-50%, -50%) scale(1.2);  opacity: 0.5; }
    }
    @keyframes speedLineFall {
      0%   { transform: translateY(-60px); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 1; }
      100% { transform: translateY(350px); opacity: 0; }
    }
    @keyframes wakeDrift {
      0%   { opacity: 0.6; transform: translateY(0) scale(1); }
      100% { opacity: 0;   transform: translateY(80px) scale(0.2); }
    }
    @keyframes thrusterBreath {
      0%, 100% { opacity: 0.7; transform: scaleY(1) scaleX(0.95); }
      50%      { opacity: 1;   transform: scaleY(1.15) scaleX(1.08); }
    }
    @keyframes thrusterCoreBreath {
      0%, 100% { opacity: 0.85; transform: scaleY(1) scaleX(1); }
      50%      { opacity: 1;    transform: scaleY(1.2) scaleX(1.1); }
    }
    @keyframes buzzFloat {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      25%      { transform: translateY(-6px) rotate(0.8deg); }
      50%      { transform: translateY(-2px) rotate(-0.5deg); }
      75%      { transform: translateY(-8px) rotate(0.3deg); }
    }
  `
  document.head.appendChild(style)
}

export default function Character({ scrollProgress = 0 }) {
  const thrusterParticlesRef = useRef(null)
  const wakeRef = useRef(null)

  useEffect(() => { injectStyles() }, [])

  // Thruster particles — emit from jetpack area (offset right and down)
  useEffect(() => {
    const container = thrusterParticlesRef.current
    if (!container) return

    const interval = setInterval(() => {
      const drift = (Math.random() - 0.5) * 24
      const size = 2.5 + Math.random() * 4
      const hue = Math.random()

      const particle = document.createElement('div')
      let color
      if (hue < 0.3)      color = 'rgba(130,170,255,0.9)'
      else if (hue < 0.6) color = 'rgba(140,100,240,0.8)'
      else                color = 'rgba(236,72,153,0.7)'

      Object.assign(particle.style, {
        position: 'absolute',
        left: `calc(50% + ${drift}px)`,
        top: '0px',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 ${size + 3}px ${color}`,
        pointerEvents: 'none',
        transition: 'all 0.8s ease-out',
        opacity: '1',
      })

      container.appendChild(particle)

      requestAnimationFrame(() => {
        particle.style.transform = `translateY(${60 + Math.random() * 50}px) translateX(${drift * 0.6}px) scale(0)`
        particle.style.opacity = '0'
      })

      setTimeout(() => particle.remove(), 900)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Wake trail
  useEffect(() => {
    const container = wakeRef.current
    if (!container) return

    const interval = setInterval(() => {
      const dot = document.createElement('div')
      const x = (Math.random() - 0.5) * 40
      const size = 2 + Math.random() * 3

      Object.assign(dot.style, {
        position: 'absolute',
        left: `calc(50% + ${x}px)`,
        top: '0px',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'rgba(168,130,255,0.5)',
        pointerEvents: 'none',
        animation: `wakeDrift ${1 + Math.random() * 0.6}s ease-out forwards`,
      })

      container.appendChild(dot)
      setTimeout(() => dot.remove(), 1800)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Aura color
  const auraColor = useMemo(() => {
    const p = scrollProgress
    const r = Math.round(99 + p * 137)
    const g = Math.round(102 - p * 30)
    const b = Math.round(241 - p * 88)
    return `${r},${g},${b}`
  }, [scrollProgress])

  // Speed lines at higher progress
  const speedLineCount = scrollProgress > 0.3
    ? Math.floor((scrollProgress - 0.3) / 0.7 * 14) + 2
    : 0

  const speedLines = useMemo(() => {
    return Array.from({ length: speedLineCount }, (_, i) => ({
      id: i,
      left: 5 + (i * 41.3) % 90,
      delay: (i * 0.13) % 0.8,
      duration: 0.25 + (i % 4) * 0.08,
      height: 20 + (i % 5) * 8,
      opacity: 0.2 + (i % 4) * 0.12,
    }))
  }, [speedLineCount])

  return (
    <div className="relative z-20">

      {/* ── Aura pulse — centered on Buzz's body ── */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${auraColor},0.3) 0%, rgba(${auraColor},0.1) 40%, transparent 70%)`,
          animation: 'auraPulse 3s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Energy rings — orbit around Buzz's center mass ── */}
      {[
        { size: 320, anim: 'orbitRingA', dur: '6s',  color: 'rgba(99,102,241,0.3)',  width: 1.5 },
        { size: 380, anim: 'orbitRingB', dur: '8s',  color: 'rgba(140,90,235,0.22)', width: 1.2 },
        { size: 440, anim: 'orbitRingC', dur: '11s', color: 'rgba(168,85,247,0.18)', width: 1   },
      ].map((ring, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: `${ring.size}px`,
            height: `${ring.size}px`,
            marginLeft: `-${ring.size / 2}px`,
            marginTop: `-${ring.size / 2}px`,
            borderRadius: '50%',
            border: `${ring.width}px solid ${ring.color}`,
            boxShadow: `0 0 8px ${ring.color}, inset 0 0 8px ${ring.color}`,
            animation: `${ring.anim} ${ring.dur} linear infinite`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      ))}

      {/* ── Speed lines around Buzz ── */}
      {speedLineCount > 0 && (
        <div
          style={{
            position: 'absolute',
            left: '-80px',
            right: '-80px',
            top: '-60px',
            bottom: '-60px',
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 2,
          }}
        >
          {speedLines.map((line) => (
            <div
              key={line.id}
              style={{
                position: 'absolute',
                left: `${line.left}%`,
                top: '-60px',
                width: '1.5px',
                height: `${line.height}px`,
                background: `linear-gradient(180deg, transparent, rgba(255,255,255,${line.opacity}), transparent)`,
                animation: `speedLineFall ${line.duration}s ${line.delay}s linear infinite`,
                pointerEvents: 'none',
              }}
            />
          ))}
        </div>
      )}

      {/* ── BUZZ LIGHTYEAR ── */}
      <div style={{ animation: 'buzzFloat 3.5s ease-in-out infinite', zIndex: 5, position: 'relative' }}>
        <img
          src={characterImg}
          alt="Buzz Lightyear"
          className="h-auto drop-shadow-[0_0_35px_rgba(99,102,241,0.5)]"
          style={{ width: 'clamp(180px, 25vw, 350px)', maxWidth: 'none' }}
        />
      </div>

      {/* ── Thruster: outer glow — from jetpack area (lower center) ── */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '-5px',
          transform: 'translateX(-50%)',
          transformOrigin: 'top center',
          width: '50px',
          height: `${90 + scrollProgress * 25}px`,
          background: `linear-gradient(180deg,
            rgba(236,72,153,0.5) 0%,
            rgba(236,72,153,0.2) 35%,
            rgba(236,72,153,0.05) 65%,
            transparent 100%)`,
          borderRadius: '20% 20% 50% 50%',
          filter: 'blur(10px)',
          animation: 'thrusterBreath 0.14s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      {/* ── Thruster: mid flame ── */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '0px',
          transform: 'translateX(-50%)',
          transformOrigin: 'top center',
          width: '32px',
          height: `${70 + scrollProgress * 20}px`,
          background: `linear-gradient(180deg,
            rgba(140,90,235,0.9) 0%,
            rgba(168,85,247,0.5) 35%,
            rgba(200,100,220,0.2) 65%,
            transparent 100%)`,
          borderRadius: '15% 15% 50% 50%',
          filter: 'blur(5px)',
          animation: 'thrusterBreath 0.1s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      {/* ── Thruster: hot core ── */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '5px',
          transform: 'translateX(-50%)',
          transformOrigin: 'top center',
          width: '12px',
          height: `${40 + scrollProgress * 15}px`,
          background: `linear-gradient(180deg,
            rgba(220,235,255,0.95) 0%,
            rgba(130,170,255,0.7) 30%,
            rgba(99,102,241,0.3) 65%,
            transparent 100%)`,
          borderRadius: '10% 10% 50% 50%',
          filter: 'blur(3px)',
          animation: 'thrusterCoreBreath 0.08s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      {/* ── Thruster particles ── */}
      <div
        ref={thrusterParticlesRef}
        className="absolute left-0 right-0"
        style={{ top: 'calc(100% + 5px)', height: '120px', pointerEvents: 'none', zIndex: 4 }}
      />

      {/* ── Wake trail ── */}
      <div
        ref={wakeRef}
        className="absolute left-0 right-0"
        style={{ top: 'calc(100% + 60px)', height: '100px', pointerEvents: 'none', zIndex: 3 }}
      />
    </div>
  )
}
