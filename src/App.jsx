import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'

import Starfield from './components/Starfield'
import Nebula from './components/Nebula'
import Character from './components/Character'
import HeroTitle from './components/HeroTitle'
import ShootingStars from './components/ShootingStars'
import Planets from './components/Planets'
import HUD from './components/HUD'
import CosmicDust from './components/CosmicDust'
import ZoneLabel from './components/ZoneLabel'
import ScreenFlash from './components/ScreenFlash'
import SpeedLines from './components/SpeedLines'
import LensFlare, { Asteroids } from './components/LensFlare'
import MouseParallax, { Scanlines } from './components/CinematicEffects'

/*
 * ═══════════════════════════════════════════════════════════════
 *  APP - INFINITE AUTO-ASCENDING COSMIC JOURNEY
 *  MAXIMUM INTENSITY EDITION
 * ═══════════════════════════════════════════════════════════════
 *
 * The character automatically ascends forever through space.
 * No scrolling. Pure cinematic auto-animation.
 *
 * Visual layers (back to front):
 *  1. Zone background gradients (crossfaded)
 *  2. Distant stars (slowest parallax)
 *  3. Nebula clouds
 *  4. Mid stars
 *  5. Cosmic dust
 *  6. Close stars (fastest)
 *  7. Planets + asteroids
 *  8. Lens flares
 *  9. Shooting stars
 * 10. Speed lines
 * 11. Zone labels
 * 12. Character (with aura, rings, thruster, wake)
 * 13. HUD overlay
 * 14. Scanlines (subtle CRT texture)
 * 15. Screen flash (zone transitions)
 *
 * Everything wrapped in MouseParallax for subtle depth on hover.
 */

const LAYER_SPEEDS = {
  distant: 40,
  mid: 80,
  close: 180,
  nebula: 55,
  planets: 120,
  dust: 45,
  asteroids: 100,
}

const ZONE_DURATION = 12

export default function App() {
  const [progress, setProgress] = useState(0)
  const [launched, setLaunched] = useState(false)
  const [currentZone, setCurrentZone] = useState(0)
  const viewportRef = useRef(null)
  const heroTitleRef = useRef(null)
  const flashRef = useRef(null)
  const warpBurstRef = useRef(null)
  const shakeRef = useRef(null)

  // Parallax layer refs
  const distantRef = useRef(null)
  const midRef = useRef(null)
  const closeRef = useRef(null)
  const nebulaRef = useRef(null)
  const planetsRef = useRef(null)
  const dustRef = useRef(null)
  const asteroidsRef = useRef(null)

  // Zone refs
  const zone1Ref = useRef(null)
  const zone2Ref = useRef(null)
  const zone3Ref = useRef(null)
  const zone4Ref = useRef(null)
  const zone5Ref = useRef(null)

  // Zone label refs
  const zoneLabel1Ref = useRef(null)
  const zoneLabel2Ref = useRef(null)
  const zoneLabel3Ref = useRef(null)
  const zoneLabel4Ref = useRef(null)
  const zoneLabel5Ref = useRef(null)

  const startTimeRef = useRef(null)

  const handleLaunch = useCallback(() => {
    if (launched) return
    setLaunched(true)
  }, [launched])

  // Auto-launch after 3.5s
  useEffect(() => {
    const timer = setTimeout(handleLaunch, 3500)
    return () => clearTimeout(timer)
  }, [handleLaunch])

  // ── WARP BURST: visual punch on zone transitions ──
  const triggerWarpBurst = useCallback(() => {
    // Screen shake
    if (shakeRef.current) {
      gsap.fromTo(shakeRef.current,
        { x: 0, y: 0 },
        {
          x: () => (Math.random() - 0.5) * 8,
          y: () => (Math.random() - 0.5) * 6,
          duration: 0.05,
          repeat: 8,
          yoyo: true,
          ease: 'none',
          onComplete: () => gsap.set(shakeRef.current, { x: 0, y: 0 }),
        }
      )
    }

    // Radial warp burst
    if (warpBurstRef.current) {
      gsap.fromTo(warpBurstRef.current,
        { scale: 0.3, opacity: 0 },
        { scale: 2.5, opacity: 0.12, duration: 0.8, ease: 'power2.out',
          onComplete: () => gsap.to(warpBurstRef.current, { opacity: 0, duration: 0.4 })
        }
      )
    }

    // Quick flash
    if (flashRef.current) {
      gsap.to(flashRef.current, { opacity: 0.3, duration: 0.08,
        onComplete: () => gsap.to(flashRef.current, { opacity: 0, duration: 0.3 })
      })
    }
  }, [])

  // ── MAIN ANIMATION ENGINE ──
  useEffect(() => {
    if (!launched) return

    const ctx = gsap.context(() => {

      // Launch flash — BIG dramatic flash
      gsap.to(flashRef.current, {
        opacity: 0.9,
        duration: 0.12,
        ease: 'power4.in',
        onComplete: () => {
          gsap.to(flashRef.current, {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
          })
        }
      })

      // Screen shake on launch
      gsap.fromTo(shakeRef.current,
        { x: 0, y: 0 },
        {
          x: () => (Math.random() - 0.5) * 12,
          y: () => (Math.random() - 0.5) * 8,
          duration: 0.04,
          repeat: 14,
          yoyo: true,
          ease: 'none',
          onComplete: () => gsap.set(shakeRef.current, { x: 0, y: 0 }),
        }
      )

      // Fade out hero title
      gsap.to(heroTitleRef.current, {
        y: -250,
        opacity: 0,
        scale: 0.8,
        duration: 1.8,
        ease: 'power2.in',
        delay: 0.2,
      })

      // ── INFINITE PARALLAX LOOPS ──
      const createLoop = (ref, speed) => {
        const el = ref.current
        if (!el) return null
        const h = window.innerHeight

        return gsap.to(el, {
          y: h,
          duration: h / speed,
          ease: 'none',
          repeat: -1,
          modifiers: {
            y: gsap.utils.unitize(gsap.utils.wrap(0, h)),
          },
        })
      }

      const loops = [
        createLoop(distantRef, LAYER_SPEEDS.distant),
        createLoop(midRef, LAYER_SPEEDS.mid),
        createLoop(closeRef, LAYER_SPEEDS.close),
        createLoop(nebulaRef, LAYER_SPEEDS.nebula),
        createLoop(planetsRef, LAYER_SPEEDS.planets),
        createLoop(dustRef, LAYER_SPEEDS.dust),
        createLoop(asteroidsRef, LAYER_SPEEDS.asteroids),
      ]

      // ── ZONE CYCLING with warp bursts ──
      const zoneBgs = [zone1Ref, zone2Ref, zone3Ref, zone4Ref, zone5Ref]
      const zoneLabels = [zoneLabel1Ref, zoneLabel2Ref, zoneLabel3Ref, zoneLabel4Ref, zoneLabel5Ref]

      zoneLabels.forEach(ref => {
        gsap.set(ref.current, { opacity: 0, y: 40, scale: 0.9 })
      })

      const zoneTL = gsap.timeline({ repeat: -1, delay: 1.5 })

      zoneBgs.forEach((ref, i) => {
        const nextRef = zoneBgs[(i + 1) % zoneBgs.length]
        const labelRef = zoneLabels[i]

        // Zone label in
        zoneTL.to(labelRef.current, {
          opacity: 1, y: 0, scale: 1,
          duration: 1.2, ease: 'power2.out',
        })

        // Hold
        zoneTL.to({}, { duration: ZONE_DURATION - 5 })

        // Zone label out
        zoneTL.to(labelRef.current, {
          opacity: 0, y: -40,
          duration: 1, ease: 'power2.in',
        })

        // Warp burst + crossfade on transition
        zoneTL.call(() => {
          triggerWarpBurst()
          setCurrentZone((i + 1) % 5)
        })

        zoneTL.to(ref.current, { opacity: 0, duration: 1.5, ease: 'power2.inOut' }, '<')
        zoneTL.to(nextRef.current, { opacity: 1, duration: 1.5, ease: 'power2.inOut' }, '<')
      })

      // ── PROGRESS TRACKER ──
      startTimeRef.current = Date.now()
      const totalCycle = ZONE_DURATION * 5

      const ticker = () => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000
        const p = (elapsed % totalCycle) / totalCycle
        setProgress(p)
      }

      gsap.ticker.add(ticker)

      return () => {
        loops.forEach(l => l?.kill())
        zoneTL.kill()
        gsap.ticker.remove(ticker)
      }

    }, viewportRef)

    return () => ctx.revert()
  }, [launched, triggerWarpBurst])

  const nebulaZone = progress < 0.2 ? 0
    : progress < 0.4 ? 1
    : progress < 0.6 ? 2
    : progress < 0.8 ? 3
    : 4

  // Speed lines intensity ramps up over time
  const speedIntensity = launched ? Math.min(0.2 + progress * 0.8, 1) : 0

  return (
    <div
      ref={viewportRef}
      className="fixed inset-0 w-full h-full overflow-hidden cursor-pointer"
      style={{ background: '#000' }}
      onClick={handleLaunch}
    >
      {/* ═══ HUD ═══ */}
      <HUD scrollProgress={progress} />

      {/* ═══ Scanlines (subtle CRT texture) ═══ */}
      <Scanlines visible />

      {/* ═══ Screen flash ═══ */}
      <ScreenFlash ref={flashRef} />

      {/* ═══ Warp burst ring ═══ */}
      <div
        ref={warpBurstRef}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-45 rounded-full"
        style={{
          width: '50vmax',
          height: '50vmax',
          border: '2px solid rgba(168,85,247,0.4)',
          boxShadow: '0 0 40px rgba(168,85,247,0.2), inset 0 0 40px rgba(99,102,241,0.1)',
          opacity: 0,
        }}
      />

      {/* ═══ SHAKE WRAPPER — everything visual goes inside ═══ */}
      <div ref={shakeRef} className="absolute inset-0" style={{ willChange: 'transform' }}>

        <MouseParallax intensity={0.8}>

          {/* ── Zone backgrounds ── */}
          <div ref={zone1Ref} className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, #000 0%, #050510 30%, #0a0a2e 60%, #0f0f3d 90%, #0a0a20 100%)' }}
          />
          <div ref={zone2Ref} className="absolute inset-0"
            style={{ opacity: 0, background: 'linear-gradient(180deg, #000 0%, #030318 20%, #0a1040 50%, #061030 80%, #000 100%)' }}
          />
          <div ref={zone3Ref} className="absolute inset-0"
            style={{ opacity: 0, background: 'linear-gradient(180deg, #020010 0%, #0a0525 30%, #060020 60%, #030012 80%, #000 100%)' }}
          />
          <div ref={zone4Ref} className="absolute inset-0"
            style={{ opacity: 0, background: 'linear-gradient(180deg, #0a0020 0%, #180a38 25%, #200e42 45%, #150830 70%, #050015 100%)' }}
          />
          <div ref={zone5Ref} className="absolute inset-0"
            style={{ opacity: 0, background: 'radial-gradient(ellipse at 50% 40%, #200a50 0%, #150835 30%, #0a0420 55%, #030010 80%, #000 100%)' }}
          />

          {/* ── PARALLAX LAYERS ── */}

          {/* Distant stars */}
          <div ref={distantRef} className="absolute left-0 w-full pointer-events-none"
            style={{ top: '-100vh', height: '300vh' }}>
            <Starfield />
          </div>

          {/* Nebula */}
          <div ref={nebulaRef} className="absolute left-0 w-full pointer-events-none"
            style={{ top: '-100vh', height: '300vh' }}>
            <Nebula zone={nebulaZone} />
          </div>

          {/* Mid stars */}
          <div ref={midRef} className="absolute left-0 w-full pointer-events-none"
            style={{ top: '-100vh', height: '300vh' }}>
            {Array.from({ length: 150 }, (_, i) => (
              <div
                key={i}
                className="absolute rounded-full star-twinkle"
                style={{
                  left: `${(i * 37.7) % 100}%`,
                  top: `${(i * 23.3) % 100}%`,
                  width: 1.5 + (i % 3),
                  height: 1.5 + (i % 3),
                  background: i % 7 === 0
                    ? 'rgba(236, 72, 153, 0.8)'
                    : i % 5 === 0
                    ? 'rgba(96, 165, 250, 0.8)'
                    : i % 3 === 0
                    ? 'rgba(168, 85, 247, 0.8)'
                    : 'white',
                  opacity: 0.3 + (i % 5) * 0.14,
                  boxShadow: i % 4 === 0 ? `0 0 3px rgba(168,85,247,0.4)` : 'none',
                  '--duration': `${2 + (i % 4)}s`,
                  '--delay': `${(i % 7) * 0.7}s`,
                }}
              />
            ))}
          </div>

          {/* Cosmic dust */}
          <div ref={dustRef} className="absolute left-0 w-full pointer-events-none"
            style={{ top: '-100vh', height: '300vh' }}>
            <CosmicDust count={80} />
          </div>

          {/* Close stars */}
          <div ref={closeRef} className="absolute left-0 w-full pointer-events-none"
            style={{ top: '-100vh', height: '300vh' }}>
            {Array.from({ length: 50 }, (_, i) => (
              <div
                key={i}
                className="absolute rounded-full star-twinkle"
                style={{
                  left: `${(i * 41.3) % 100}%`,
                  top: `${(i * 29.7) % 100}%`,
                  width: 2.5 + (i % 3),
                  height: 2.5 + (i % 3),
                  background: 'white',
                  boxShadow: `0 0 ${6 + (i % 4) * 3}px rgba(255,255,255,0.7)`,
                  opacity: 0.5 + (i % 4) * 0.12,
                  '--duration': `${1.5 + (i % 3)}s`,
                  '--delay': `${(i % 5) * 0.6}s`,
                }}
              />
            ))}
          </div>

          {/* Planets */}
          <div ref={planetsRef} className="absolute left-0 w-full"
            style={{ top: '-100vh', height: '300vh' }}>
            <Planets />
          </div>

          {/* Asteroids */}
          <div ref={asteroidsRef} className="absolute left-0 w-full pointer-events-none"
            style={{ top: '-100vh', height: '300vh' }}>
            <Asteroids />
          </div>

          {/* Lens flares */}
          <LensFlare zone={currentZone} />

          {/* Shooting stars */}
          <ShootingStars scrollProgress={progress} />

          {/* Speed lines */}
          <SpeedLines intensity={speedIntensity} />

          {/* ── ZONE LABELS ── */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-25">
            <div ref={zoneLabel1Ref} className="absolute">
              <ZoneLabel title="LAUNCH SEQUENCE" subtitle="Initiating ascent protocol" />
            </div>
            <div ref={zoneLabel2Ref} className="absolute">
              <ZoneLabel title="ENTERING ORBIT" subtitle="Gravity releasing" />
            </div>
            <div ref={zoneLabel3Ref} className="absolute">
              <ZoneLabel title="DEEP SPACE" subtitle="Beyond all boundaries" />
            </div>
            <div ref={zoneLabel4Ref} className="absolute">
              <ZoneLabel title="GALAXY CORE" subtitle="Heart of the cosmos" />
            </div>
            <div ref={zoneLabel5Ref} className="absolute">
              <ZoneLabel title="INFINITY" subtitle="You made it" />
            </div>
          </div>

          {/* ── HERO TITLE — upper third of screen ── */}
          <div
            ref={heroTitleRef}
            className="absolute inset-x-0 top-0 flex items-center justify-center z-30"
            style={{ height: '45%' }}
          >
            <div className="flex flex-col items-center gap-6">
              <HeroTitle />
              {!launched && (
                <div className="mt-4 scroll-bounce">
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className="text-xs tracking-[0.3em] uppercase"
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        color: 'rgba(99,102,241,0.6)',
                      }}
                    >
                      Click to launch
                    </span>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(99,102,241,0.7)" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="10 8 16 12 10 16 10 8" fill="rgba(99,102,241,0.5)" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── CHARACTER — lower center of screen ── */}
          <div
            className="absolute left-1/2 z-30"
            style={{ bottom: '8%', transform: 'translateX(-50%)' }}
          >
            <Character scrollProgress={progress} />
          </div>

        </MouseParallax>

        {/* ── Vignette (outside MouseParallax so it doesn't shift) ── */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            boxShadow: 'inset 0 0 200px 80px rgba(0,0,0,0.7)',
          }}
        />

      </div> {/* end shake wrapper */}
    </div>
  )
}
