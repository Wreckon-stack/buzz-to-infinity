import { useState, useEffect } from 'react'

/**
 * Returns a 0-1 value representing how far the user has scrolled
 * through the entire document. Used to drive zone transitions
 * and parallax intensity.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const p = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0
      setProgress(p)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return progress
}
