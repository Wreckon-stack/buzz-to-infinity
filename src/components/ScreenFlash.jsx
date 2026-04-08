import { forwardRef } from 'react'

/**
 * ScreenFlash - A full-screen white flash overlay.
 * Triggered at dramatic moments (launch ignition, zone transitions).
 * Controlled by GSAP in parent.
 */
const ScreenFlash = forwardRef(function ScreenFlash(_, ref) {
  return (
    <div
      ref={ref}
      className="fixed inset-0 bg-white pointer-events-none z-50"
      style={{ opacity: 0 }}
    />
  )
})

export default ScreenFlash
