'use client'

import { motion } from 'framer-motion'

interface SectionBackgroundProps {
  variant?: 'default' | 'hero' | 'accent' | 'subtle'
  showOrbs?: boolean
}

export default function SectionBackground({ variant = 'default', showOrbs = true }: SectionBackgroundProps) {
  return (
    <>
      {/* Base gradient layer with extended height for blending */}
      <div className="absolute -inset-y-32 inset-x-0">
        {/* Primary glow */}
        <div 
          className="absolute inset-0"
          style={{
            background: variant === 'hero' 
              ? `radial-gradient(ellipse 100% 80% at center, var(--accent-light) 0%, transparent 50%)`
              : variant === 'accent'
              ? `radial-gradient(ellipse 120% 100% at top center, var(--accent-light) 0%, transparent 45%)`
              : variant === 'subtle'
              ? `radial-gradient(ellipse 150% 120% at center, var(--accent-light) 0%, transparent 65%)`
              : `radial-gradient(ellipse 110% 90% at center, var(--accent-light) 0%, transparent 55%)`,
            opacity: variant === 'subtle' ? 0.03 : variant === 'hero' ? 0.2 : 0.08,
          }}
        />
        
        {/* Soft gradient overlay for smooth transitions */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(0deg, 
              transparent 0%,
              rgba(255,255,255,${variant === 'hero' ? '0.7' : '0.85'}) 15%, 
              rgba(255,255,255,${variant === 'hero' ? '0.85' : '0.92'}) 50%,
              rgba(255,255,255,${variant === 'hero' ? '0.7' : '0.85'}) 85%,
              transparent 100%)`,
          }}
        />
        
        {/* Very subtle noise texture for depth */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='60' height='60' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
      
      {/* Floating orbs - consistent across sections */}
      {showOrbs && (
        <>
          <motion.div
            className="absolute w-64 h-64 rounded-full hidden lg:block pointer-events-none"
            style={{
              background: `radial-gradient(circle, var(--accent-light) 0%, transparent 60%)`,
              right: '10%',
              top: '20%',
              filter: 'blur(80px)',
              opacity: 0.2,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute w-48 h-48 rounded-full hidden lg:block pointer-events-none"
            style={{
              background: `radial-gradient(circle, var(--accent) 0%, transparent 60%)`,
              left: '5%',
              bottom: '30%',
              filter: 'blur(60px)',
              opacity: 0.15,
            }}
            animate={{
              x: [0, -20, 0],
              y: [0, 15, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      )}
    </>
  )
}