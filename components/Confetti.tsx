'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfettiProps {
  trigger: boolean
}

export default function Confetti({ trigger }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; color: string; x: number }>>([])

  useEffect(() => {
    if (trigger) {
      const colors = ['#FF69B4', '#FFD700', '#87CEEB', '#98FB98', '#DDA0DD']
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        x: Math.random() * 100 - 50,
      }))
      setParticles(newParticles)
      
      setTimeout(() => {
        setParticles([])
      }, 1000)
    }
  }, [trigger])

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ 
            opacity: 1, 
            y: 0, 
            x: 0,
            scale: 0,
            rotate: 0,
          }}
          animate={{ 
            opacity: 0, 
            y: -200, 
            x: particle.x,
            scale: [0, 1, 1],
            rotate: Math.random() * 360,
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 1,
            ease: 'easeOut',
            scale: { duration: 0.3 },
          }}
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            width: '10px',
            height: '10px',
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
        />
      ))}
    </AnimatePresence>
  )
}