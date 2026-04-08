/**
 * ZoneLabel - Dramatic zone transition titles with decorative elements.
 * Animated in via GSAP timeline in the parent App.
 */
export default function ZoneLabel({ title, subtitle }) {
  return (
    <div className="text-center px-8" data-zone-label>
      {/* Decorative line above */}
      <div className="flex items-center justify-center gap-4 mb-4" style={{ opacity: 0.4 }}>
        <div className="h-px w-16 sm:w-24" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6))' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/60" />
        <div className="h-px w-16 sm:w-24" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.6), transparent)' }} />
      </div>

      {/* Main title */}
      <h2
        className="title-infinity text-2xl sm:text-3xl md:text-5xl lg:text-6xl title-glow mb-4"
        data-zone-title
      >
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p
          className="text-xs sm:text-sm md:text-base tracking-[0.25em] uppercase"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            color: 'rgba(168,85,247,0.6)',
          }}
          data-zone-subtitle
        >
          {subtitle}
        </p>
      )}

      {/* Decorative line below */}
      <div className="flex items-center justify-center gap-4 mt-4" style={{ opacity: 0.3 }}>
        <div className="h-px w-12 sm:w-20" style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.5))' }} />
        <div className="w-1 h-1 rounded-full bg-purple-400/50" />
        <div className="h-px w-12 sm:w-20" style={{ background: 'linear-gradient(90deg, rgba(168,85,247,0.5), transparent)' }} />
      </div>
    </div>
  )
}
