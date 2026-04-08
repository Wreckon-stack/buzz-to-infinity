import { useEffect, useRef } from 'react'

/**
 * SpeedLines - Creates a hyperspace / warp-speed streak effect.
 * Vertical lines rain downward at high speed, concentrated toward
 * the screen edges for a tunnel-vision feel. Uses direct DOM
 * manipulation to avoid React re-render overhead.
 *
 * @param {number} intensity - 0 to 1. Controls line count, speed, and opacity.
 */
export default function SpeedLines({ intensity = 0.5 }) {
  const containerRef = useRef(null)
  const intensityRef = useRef(intensity)

  // Keep intensity ref in sync without re-running the spawn effect
  useEffect(() => {
    intensityRef.current = intensity
  }, [intensity])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Inject keyframes once
    const styleEl = document.createElement('style')
    styleEl.textContent = `
      @keyframes speedLineDown {
        0% {
          transform: translateY(-100%) var(--sl-rotate);
          opacity: var(--sl-opacity);
        }
        15% {
          opacity: var(--sl-opacity);
        }
        100% {
          transform: translateY(110vh) var(--sl-rotate);
          opacity: 0;
        }
      }
    `
    container.appendChild(styleEl)

    /**
     * Bias random x-positions toward screen edges.
     * Uses a power-curve mapped to [0, 100] where values
     * cluster near 0% and 100% (left/right edges).
     */
    const edgeBiasedX = () => {
      const r = Math.random()
      // Push toward edges: map [0,0.5) -> left side, [0.5,1) -> right side
      if (r < 0.5) {
        // Left edge bias — cube root pulls toward 0
        return Math.pow(r * 2, 2.5) * 50
      }
      // Right edge bias — cube root pulls toward 100
      return 100 - Math.pow((1 - r) * 2, 2.5) * 50
    }

    const spawnLine = () => {
      const t = intensityRef.current
      if (t <= 0) return

      const line = document.createElement('div')

      const x = edgeBiasedX()
      const isThick = Math.random() < 0.15
      const width = isThick ? 2 + Math.random() * 1.5 : 1 + Math.random() * 0.5
      const height = 40 + Math.random() * 120 + t * 80
      const angle = (Math.random() - 0.5) * 8 // slight angle, +-4 degrees
      const baseDuration = 0.8 - t * 0.5        // 0.8s at t=0 -> 0.3s at t=1
      const duration = baseDuration + Math.random() * 0.2
      const baseOpacity = 0.15 + t * 0.55        // 0.15 at t=0 -> 0.7 at t=1
      const opacity = baseOpacity * (0.5 + Math.random() * 0.5)
      const blur = isThick ? 1.5 : 0.5 + Math.random() * 1

      // Colour: white to light blue
      const blue = Math.random() < 0.4
      const color = blue
        ? `rgba(160, 200, 255, ${opacity})`
        : `rgba(255, 255, 255, ${opacity})`

      Object.assign(line.style, {
        position: 'absolute',
        left: `${x}%`,
        top: '0',
        width: `${width}px`,
        height: `${height}px`,
        background: `linear-gradient(180deg, transparent 0%, ${color} 20%, ${color} 80%, transparent 100%)`,
        borderRadius: '1px',
        filter: `blur(${blur}px)`,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
        '--sl-rotate': `rotate(${angle}deg)`,
        '--sl-opacity': `${opacity}`,
        animation: `speedLineDown ${duration}s linear forwards`,
      })

      container.appendChild(line)

      // Clean up after animation completes
      const removeDelay = duration * 1000 + 50
      setTimeout(() => {
        if (line.parentNode) line.remove()
      }, removeDelay)
    }

    let rafId
    let lastSpawn = 0

    const tick = (now) => {
      const t = intensityRef.current
      // Spawn interval: fewer lines at low intensity, many at high
      // ~120ms gap at t=0.1, ~15ms gap at t=1
      const interval = Math.max(15, 120 - t * 105)

      if (now - lastSpawn >= interval && t > 0) {
        // Spawn a batch — more lines at higher intensity
        const batch = Math.ceil(1 + t * 3)
        for (let i = 0; i < batch; i++) {
          spawnLine()
        }
        lastSpawn = now
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      // Clean up all spawned lines
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
  }, []) // runs once — reads intensity from ref

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    />
  )
}
