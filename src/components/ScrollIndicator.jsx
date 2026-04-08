/**
 * ScrollIndicator - Pulsing arrow at bottom of hero section
 * that hints the user should scroll to begin the journey.
 * Fades out after scrolling begins.
 */
export default function ScrollIndicator({ visible = true }) {
  return (
    <div
      className="scroll-bounce transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="flex flex-col items-center gap-2">
        <span
          className="text-xs tracking-[0.3em] uppercase"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            color: 'rgba(99,102,241,0.5)',
          }}
        >
          Scroll to launch
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(99,102,241,0.6)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 13l5 5 5-5" />
          <path d="M7 6l5 5 5-5" />
        </svg>
      </div>
    </div>
  )
}
