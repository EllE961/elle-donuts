import { useEffect, useState } from 'react'

export function usePerformance() {
  const [isLowPerformance, setIsLowPerformance] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSlowConnection, setIsSlowConnection] = useState(false)

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(mobile || window.innerWidth < 768)
    }

    // Check connection speed
    const checkConnection = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection

      if (connection) {
        const effectiveType = connection.effectiveType
        setIsSlowConnection(effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g')
      }
    }

    // Check device performance
    const checkPerformance = () => {
      // Check for low-end device indicators
      const memory = (navigator as any).deviceMemory
      const hardwareConcurrency = navigator.hardwareConcurrency

      const isLowEnd = 
        (memory && memory < 4) || 
        (hardwareConcurrency && hardwareConcurrency < 4) ||
        isMobile

      setIsLowPerformance(isLowEnd)
    }

    checkMobile()
    checkConnection()
    checkPerformance()

    // Listen for resize events
    const handleResize = () => {
      checkMobile()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobile])

  return {
    isLowPerformance,
    isMobile,
    isSlowConnection,
    shouldReduceAnimations: isLowPerformance || isSlowConnection,
    shouldOptimizeImages: isSlowConnection || isMobile,
  }
}