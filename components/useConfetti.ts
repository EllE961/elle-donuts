'use client'

import confetti from 'canvas-confetti'

export const useConfetti = () => {
  const fireConfetti = () => {
    const colors = ['#FF69B4', '#FFD700', '#87CEEB', '#98FB98', '#DDA0DD', '#FFA500']
    
    // First burst
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
      startVelocity: 30,
      gravity: 0.5,
      scalar: 1.2,
      drift: 0,
    })

    // Second burst with delay
    setTimeout(() => {
      confetti({
        particleCount: 25,
        spread: 100,
        origin: { y: 0.55 },
        colors: colors,
        startVelocity: 25,
        gravity: 0.5,
        scalar: 1,
        drift: 0,
      })
    }, 150)

    // Side bursts
    confetti({
      particleCount: 20,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    })
    
    confetti({
      particleCount: 20,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    })
  }

  return fireConfetti
}