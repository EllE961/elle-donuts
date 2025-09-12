'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Flavor } from '@/lib/flavors'
import Cookies from 'js-cookie'

export interface CartItem {
  flavor: Flavor
  quantity: number
}

export interface Box {
  id: string
  items: CartItem[]
  totalItems: number
}

interface CartContextType {
  boxes: Box[]
  currentBox: Box | null
  totalBoxes: number
  totalPrice: number
  createNewBox: () => void
  addToCurrentBox: (flavor: Flavor, quantity: number) => void
  removeBox: (boxId: string) => void
  clearCart: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_COOKIE_NAME = 'donut_boxes'
const MAX_ITEMS_PER_BOX = 12 // Exactly 12 donuts per box

export function CartProvider({ children }: { children: ReactNode }) {
  const [boxes, setBoxes] = useState<Box[]>([])
  const [currentBox, setCurrentBox] = useState<Box | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Load boxes from cookies on mount
  useEffect(() => {
    const savedBoxes = Cookies.get(CART_COOKIE_NAME)
    if (savedBoxes) {
      try {
        setBoxes(JSON.parse(savedBoxes))
      } catch (e) {
        console.error('Failed to parse boxes from cookies', e)
      }
    }
  }, [])

  // Save boxes to cookies whenever they change
  useEffect(() => {
    if (boxes.length > 0) {
      Cookies.set(CART_COOKIE_NAME, JSON.stringify(boxes), { expires: 7 })
    } else {
      Cookies.remove(CART_COOKIE_NAME)
    }
  }, [boxes])

  const totalBoxes = boxes.length
  const totalPrice = boxes.reduce((sum, box) => {
    const boxPrice = box.items.reduce((boxSum, item) => 
      boxSum + ((item.flavor.priceOMR / 6) * item.quantity), 0
    )
    return sum + boxPrice
  }, 0)

  const createNewBox = () => {
    const newBox: Box = {
      id: Date.now().toString(),
      items: [],
      totalItems: 0
    }
    setCurrentBox(newBox)
    return newBox
  }

  const addToCurrentBox = (flavor: Flavor, quantity: number) => {
    let remainingToAdd = quantity
    
    // First, try to fill existing boxes (including currentBox)
    const allBoxes = currentBox 
      ? [...boxes.filter(b => b.id !== currentBox.id), currentBox]
      : boxes
    
    // Sort boxes to prioritize partially filled ones
    const sortedBoxes = [...allBoxes].sort((a, b) => {
      // Prioritize boxes that already have this flavor
      const aHasFlavor = a.items.some(item => item.flavor.id === flavor.id)
      const bHasFlavor = b.items.some(item => item.flavor.id === flavor.id)
      if (aHasFlavor && !bHasFlavor) return -1
      if (!aHasFlavor && bHasFlavor) return 1
      // Then by available space
      return b.totalItems - a.totalItems
    })
    
    // Try to add to existing boxes first
    for (const box of sortedBoxes) {
      if (remainingToAdd <= 0) break
      if (box.totalItems >= MAX_ITEMS_PER_BOX) continue
      
      const spaceInBox = MAX_ITEMS_PER_BOX - box.totalItems
      const quantityToAdd = Math.min(remainingToAdd, spaceInBox)
      
      const existingItem = box.items.find(item => item.flavor.id === flavor.id)
      
      let updatedItems: CartItem[]
      if (existingItem) {
        updatedItems = box.items.map(item =>
          item.flavor.id === flavor.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        )
      } else {
        updatedItems = [...box.items, { flavor, quantity: quantityToAdd }]
      }
      
      const updatedBox: Box = {
        ...box,
        items: updatedItems,
        totalItems: box.totalItems + quantityToAdd
      }
      
      // Update the box
      setBoxes(prev => prev.map(b => 
        b.id === updatedBox.id ? updatedBox : b
      ))
      
      // Update currentBox if it was updated
      if (currentBox?.id === updatedBox.id) {
        setCurrentBox(updatedBox)
      }
      
      remainingToAdd -= quantityToAdd
    }
    
    // If we still have items to add, create new box(es)
    while (remainingToAdd > 0) {
      const newBox = createNewBox()
      const quantityToAdd = Math.min(remainingToAdd, MAX_ITEMS_PER_BOX)
      
      const updatedBox: Box = {
        ...newBox,
        items: [{ flavor, quantity: quantityToAdd }],
        totalItems: quantityToAdd
      }
      
      setBoxes(prev => [...prev, updatedBox])
      setCurrentBox(updatedBox)
      
      remainingToAdd -= quantityToAdd
    }
  }

  const removeBox = (boxId: string) => {
    setBoxes(prev => prev.filter(box => box.id !== boxId))
    if (currentBox?.id === boxId) {
      setCurrentBox(null)
    }
  }

  const clearCart = () => {
    setBoxes([])
    setCurrentBox(null)
    Cookies.remove(CART_COOKIE_NAME)
  }

  return (
    <CartContext.Provider
      value={{
        boxes,
        currentBox,
        totalBoxes,
        totalPrice,
        createNewBox,
        addToCurrentBox,
        removeBox,
        clearCart,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}