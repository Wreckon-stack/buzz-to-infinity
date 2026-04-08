import { useEffect, useRef } from 'react'

/**
 * ShootingStars - Spawns dramatic shooting stars that streak across the viewport.
 * Multiple sizes: small streaks, medium trails, and occasional BIG ones with glow.
 * Frequency increases deeper into the journey.
 */
export default function ShootingStars({ scrollProgress = 0 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const spawnStar = () => {
      const star = document.createElement('div')
      const startX = Math.random() * 70
      const startY = Math.random() * 60
      const angle = -20 + Math.random() * 15

      // Occasionally spawn a BIG dramatic one
      const isBig = Math.random() < 0.15
      const length = isBig ? (150 + Math.random() * 200) : (60 + Math.random() * 100)
      const height = isBig ? 3 : (1 + Math.random())
      const duration = isBig ? (0.8 + Math.random() * 0.5) : (0.4 + Math.random() * 0.6)
      const travelX = isBig ? (500 + Math.random() * 300) : (250 + Math.random() * 200)
      const travelY = travelX * Math.tan((angle * Math.PI) / 180) * -1

      const color = isBig
        ? 'linear-gradient(90deg, rgba(168,85,247,0.9), rgba(255,255,255,0.95), rgba(236,72,153,0.6), transparent)'
        : 'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(168,85,247,0.5), transparent)'

      Object.assign(star.style, {
        position: 'absolute',
        left: `${startX}%`,
        top: `${startY}%`,
        width: `${length}px`,
        height: `${height}px`,
        background: color,
        borderRadius: '2px',
        transform: `rotate(${angle}deg)`,
        opacity: '0',
        pointerEvents: 'none',
        zIndex: '15',
        filter: isBig ? 'blur(0.5px)' : 'none',
        boxShadow: isBig ? '0 0 8px rgba(168,85,247,0.4), 0 0 20px rgba(99,102,241,0.2)' : 'none',
      })

      container.appendChild(star)

      // Animate
      requestAnimationFrame(() => {
        star.style.transition = `all ${duration}s ease-out`
        star.style.opacity = '1'

        requestAnimationFrame(() => {
          star.style.transform = `rotate(${angle}deg) translateX(${travelX}px)`
          star.style.opacity = '0'
        })
      })

      setTimeout(() => star.remove(), duration * 1000 + 200)
    }

    let timeout
    const scheduleNext = () => {
      const baseInterval = 2500
      const minInterval = 400
      const interval = baseInterval - (scrollProgress * (baseInterval - minInterval))
      const jitter = Math.random() * interval * 0.6
      timeout = setTimeout(() => {
        spawnStar()
        // Sometimes spawn 2 at once
        if (Math.random() < 0.2) setTimeout(spawnStar, 100 + Math.random() * 200)
        scheduleNext()
      }, interval * 0.4 + jitter)
    }

    scheduleNext()
    return () => clearTimeout(timeout)
  }, [scrollProgress])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-10"
    />
  )
}
