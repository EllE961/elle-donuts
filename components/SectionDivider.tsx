'use client'

import { motion } from 'framer-motion'

interface SectionDividerProps {
  variant?: 'fade' | 'glow' | 'gradient'
}

export default function SectionDivider({ variant = 'fade' }: SectionDividerProps) {
  if (variant === 'fade') {
    return (
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ zIndex: 10 }}>
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.6) 100%)`
          }}
        />
      </div>
    )
  }

  if (variant === 'glow') {
    return (
      <div className="absolute -bottom-px left-0 right-0 h-px overflow-visible pointer-events-none" style={{ zIndex: 10 }}>
        <motion.div 
          className="absolute left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent 0%, var(--accent-light) 50%, transparent 100%)`,
            filter: 'blur(4px)',
            opacity: 0.3,
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    )
  }

  if (variant === 'gradient') {
    return (
      <div className="absolute -bottom-20 left-0 right-0 h-40 pointer-events-none" style={{ zIndex: 10 }}>
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, var(--accent-light) 0%, transparent 70%)`,
            opacity: 0.05,
            filter: 'blur(40px)',
          }}
        />
      </div>
    )
  }

  return null
}