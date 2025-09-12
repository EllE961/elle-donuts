'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { FLAVORS } from '@/lib/flavors'
import { useTheme } from '@/components/ThemeProvider'
import { CartProvider, useCart } from '@/lib/cart-context'
import HeaderPremium from '@/components/HeaderPremium'
import HeroPremium from '@/components/HeroPremium'
import MenuGridPremium from '@/components/MenuGridPremium'
import Story from '@/components/Story'
import Reviews from '@/components/Reviews'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import { useConfetti } from '@/components/useConfetti'

function HomeContent() {
  const allFlavors = useMemo(() => FLAVORS, [])
  const [activeFlavor, setActiveFlavor] = useState(allFlavors[0])
  const { setAccent } = useTheme()
  const { addToCurrentBox } = useCart()
  const fireConfetti = useConfetti()


  useEffect(() => {
    setAccent(activeFlavor.accent)
  }, [activeFlavor, setAccent])

  useEffect(() => {
    const handleOrderClick = () => {
      fireConfetti()
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
  }, [fireConfetti])

  const handleFlavorChange = useCallback((flavor: typeof activeFlavor | ((prev: typeof activeFlavor) => typeof activeFlavor)) => {
    if (typeof flavor === 'function') {
      setActiveFlavor(flavor)
    } else {
      setActiveFlavor(flavor)
    }
  }, [])

  const handleAddToBox = useCallback((flavor: typeof allFlavors[0]) => {
    // Always add 6 donuts at a time
    addToCurrentBox(flavor, 6)
    fireConfetti()
  }, [addToCurrentBox, fireConfetti])


  return (
    <>
      <HeaderPremium />
      <main>
        <HeroPremium 
          activeFlavor={activeFlavor}
          onFlavorChange={handleFlavorChange}
          featuredFlavors={allFlavors}
        />
        <MenuGridPremium 
          flavors={allFlavors}
          onAddToBox={handleAddToBox}
        />
        <Story />
        <Reviews />
      </main>
      <Footer />
      <CartDrawer />
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