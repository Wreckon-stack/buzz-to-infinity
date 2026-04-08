import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * HeroTitle - The iconic "TO INFINITY AND BEYOND" title.
 *
 * Cinematic entrance animation:
 * 1. Screen starts black
 * 2. Letters fade in one by one with a stagger
 * 3. Glow intensifies
 * 4. Subtitle fades in below
 *
 * On scroll: title drifts upward and fades out (handled by parent GSAP timeline)
 */
export default function HeroTitle() {
  const containerRef = useRef(null)
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)
  const subtitleRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state
      gsap.set('.hero-letter', { opacity: 0, y: 40, scale: 0.8 })
      gsap.set(subtitleRef.current, { opacity: 0, y: 20 })
      gsap.set(glowRef.current, { opacity: 0, scale: 0.5 })

      const tl = gsap.timeline({ delay: 0.5 })

      // Background glow appears
      tl.to(glowRef.current, {
        opacity: 0.6,
        scale: 1,
        duration: 1.5,
        ease: 'power2.out',
      })

      // Line 1: "TO INFINITY"
      tl.to('.hero-letter-l1', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.04,
        ease: 'back.out(1.7)',
      }, '-=1')

      // Line 2: "AND BEYOND"
      tl.to('.hero-letter-l2', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.04,
        ease: 'back.out(1.7)',
      }, '-=0.4')

      // Subtitle
      tl.to(subtitleRef.current, {
        opacity: 0.7,
        y: 0,
        duration: 1,
        ease: 'power2.out',
      }, '-=0.3')
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Split text into individual letter spans
  const splitText = (text, lineClass) => {
    return text.split('').map((char, i) => (
      <span
        key={i}
        className={`hero-letter ${lineClass} inline-block`}
        style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }

  return (
    <div ref={containerRef} className="relative text-center" data-hero-title>
      {/* Background glow orb behind title */}
      <div
        ref={glowRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.1) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Main title */}
      <h1 className="title-infinity title-glow title-glow-pulse relative z-10">
        <span ref={line1Ref} className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
          {splitText('TO INFINITY', 'hero-letter-l1')}
        </span>
        <span ref={line2Ref} className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mt-2">
          {splitText('AND BEYOND', 'hero-letter-l2')}
        </span>
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="mt-6 text-sm sm:text-base md:text-lg tracking-[0.3em] uppercase"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          color: 'rgba(168, 85, 247, 0.7)',
        }}
      >
        Begin the ascent
      </p>
    </div>
  )
}
