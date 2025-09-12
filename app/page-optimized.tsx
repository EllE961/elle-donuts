'use client'

import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { FLAVORS } from '@/lib/flavors'
import { useTheme } from '@/components/ThemeProvider'
import { CartProvider, useCart } from '@/lib/cart-context'
import { usePerformance } from '@/hooks/usePerformance'
import HeaderPremium from '@/components/HeaderPremium'
import Footer from '@/components/Footer'

// Lazy load components based on performance
const HeroPremium = lazy(() => import('@/components/HeroPremium'))
const HeroOptimized = lazy(() => import('@/components/HeroOptimized'))
const MenuGridPremium = lazy(() => import('@/components/MenuGridPremium'))
const MenuGridOptimized = lazy(() => import('@/components/MenuGridOptimized'))

// Lazy load heavy components
const Story = lazy(() => import('@/components/Story'))
const Reviews = lazy(() => import('@/components/Reviews'))
const CartDrawer = lazy(() => import('@/components/CartDrawer'))

// Import confetti normally
import { useConfetti } from '@/components/useConfetti'

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading delicious donuts...</p>
      </div>
    </div>
  )
}

function HomeContent() {
  const allFlavors = useMemo(() => FLAVORS, [])
  const [activeFlavor, setActiveFlavor] = useState(allFlavors[0])
  const { setAccent } = useTheme()
  const { addToCurrentBox } = useCart()
  const fireConfetti = useConfetti()
  const { isMobile, shouldReduceAnimations, isSlowConnection } = usePerformance()
  
  // Use optimized components for mobile/low performance
  const Hero = shouldReduceAnimations ? HeroOptimized : HeroPremium
  const MenuGrid = shouldReduceAnimations ? MenuGridOptimized : MenuGridPremium

  useEffect(() => {
    setAccent(activeFlavor.accent)
  }, [activeFlavor, setAccent])

  // Optimized confetti for order buttons
  useEffect(() => {
    if (shouldReduceAnimations) return // Skip on low performance devices

    const handleOrderClick = () => {
      if (fireConfetti) fireConfetti()
    }

    const orderButtons = document.querySelectorAll('a[href^="https://wa.me"]')
    orderButtons.forEach(button => {
      button.addEventListener('click', handleOrderClick)
    })

    return () => {
      orderButtons.forEach(button => {
        button.removeEventListener('click', handleOrderClick)
      })
    }
  }, [fireConfetti, shouldReduceAnimations])

  const handleFlavorChange = useCallback((flavor: typeof activeFlavor | ((prev: typeof activeFlavor) => typeof activeFlavor)) => {
    if (typeof flavor === 'function') {
      setActiveFlavor(flavor)
    } else {
      setActiveFlavor(flavor)
    }
  }, [])

  const handleAddToBox = useCallback((flavor: typeof allFlavors[0]) => {
    addToCurrentBox(flavor, 6)
    if (!shouldReduceAnimations && fireConfetti) {
      fireConfetti()
    }
  }, [addToCurrentBox, fireConfetti, shouldReduceAnimations])

  return (
    <>
      <HeaderPremium />
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Hero 
            activeFlavor={activeFlavor}
            onFlavorChange={handleFlavorChange}
            featuredFlavors={allFlavors}
          />
        </Suspense>
        
        <Suspense fallback={<LoadingFallback />}>
          <MenuGrid 
            flavors={allFlavors}
            onAddToBox={handleAddToBox}
          />
        </Suspense>
        
        {/* Lazy load Story and Reviews for better initial load */}
        {!isSlowConnection && (
          <>
            <Suspense fallback={<div className="min-h-[400px]" />}>
              <Story />
            </Suspense>
            <Suspense fallback={<div className="min-h-[400px]" />}>
              <Reviews />
            </Suspense>
          </>
        )}
      </main>
      <Footer />
      
      <Suspense fallback={null}>
        <CartDrawer />
      </Suspense>
    </>
  )
}

export default function Home() {
  return (
    <CartProvider>
      <HomeContent />
    </CartProvider>
  )
}