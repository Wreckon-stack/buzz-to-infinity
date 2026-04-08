import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * MouseParallax - A wrapper that adds mouse-driven parallax to its children.
 * Tracks mouse position relative to viewport center and applies a subtle
 * CSS translate transform. On mobile, uses device orientation (gyroscope)
 * if available.
 */
export default function MouseParallax({ children, intensity = 1 }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)
  const isTouchDevice = useRef(false)
  const hasGyroscope = useRef(false)

  const MAX_SHIFT = 18

  // Smooth lerp animation loop
  const animate = useCallback(() => {
    const lerp = 0.08
    const target = targetRef.current
    const current = currentRef.current

    current.x += (target.x - current.x) * lerp
    current.y += (target.y - current.y) * lerp

    // Only update state when movement is perceptible
    if (
      Math.abs(current.x - target.x) > 0.01 ||
      Math.abs(current.y - target.y) > 0.01
    ) {
      setOffset({ x: current.x, y: current.y })
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    // Detect touch device
    isTouchDevice.current =
      'ontouchstart' in window || navigator.maxTouchPoints > 0

    if (isTouchDevice.current) {
      // Try device orientation for mobile parallax
      const handleOrientation = (e) => {
        if (e.gamma === null && e.beta === null) return
        hasGyroscope.current = true

        // gamma: left-right tilt (-90 to 90), beta: front-back tilt (-180 to 180)
        const x = ((e.gamma || 0) / 45) * MAX_SHIFT * intensity
        const y = (((e.beta || 0) - 45) / 45) * MAX_SHIFT * intensity

        targetRef.current = {
          x: Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, x)),
          y: Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, y)),
        }
      }

      window.addEventListener('deviceorientation', handleOrientation, {
        passive: true,
      })

      rafRef.current = requestAnimationFrame(animate)

      return () => {
        window.removeEventListener('deviceorientation', handleOrientation)
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
      }
    }

    // Desktop: track mouse position
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const ratioX = (e.clientX - centerX) / centerX
      const ratioY = (e.clientY - centerY) / centerY

      targetRef.current = {
        x: ratioX * MAX_SHIFT * intensity,
        y: ratioY * MAX_SHIFT * intensity,
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [intensity, animate])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        willChange: 'transform',
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }}
    >
      {children}
    </div>
  )
}

/**
 * Scanlines - A CRT/retro scanline overlay for cinematic texture.
 * Renders fullscreen horizontal scanlines with an optional animated
 * vertical scan bar that sweeps top-to-bottom like an old CRT refresh.
 */
export function Scanlines({ visible = true }) {
  if (!visible) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 45,
        willChange: 'transform',
      }}
    >
      {/* Scanline pattern via repeating-linear-gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'repeating-linear-gradient(to bottom, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 4px)',
        }}
      />

      {/* Animated scan bar — a faint bright band that sweeps top to bottom */}
      <div
        className="absolute inset-x-0"
        style={{
          height: '8%',
          background:
            'linear-gradient(to bottom, transparent, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.03) 60%, transparent)',
          animation: 'scanBarSweep 8s linear infinite',
          willChange: 'transform',
        }}
      />

      <style>{`
        @keyframes scanBarSweep {
          0% { transform: translateY(-10vh); }
          100% { transform: translateY(110vh); }
        }
      `}</style>
    </div>
  )
}
