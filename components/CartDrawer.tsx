'use client'

import { Fragment, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useCart } from '@/lib/cart-context'
import { generateWhatsAppUrl } from '@/lib/whatsapp'
import { BRAND } from '@/lib/brand'
import confetti from 'canvas-confetti'

export default function CartDrawer() {
  const { boxes, currentBox, totalBoxes, totalPrice, removeBox, clearCart, isOpen, setIsOpen, createNewBox, addToCurrentBox } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderSent, setOrderSent] = useState(false)

  const handleCheckout = async () => {
    setIsProcessing(true)
    
    // Simulate processing animation
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Flatten all boxes into order items
    const orderItems = boxes.flatMap(box => 
      box.items.map(item => ({
        flavor: item.flavor,
        quantity: item.quantity
      }))
    )
    
    const whatsappUrl = generateWhatsAppUrl(undefined, orderItems)
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6FAE', '#FFD93D', '#6BCF7F', '#4E9FFF', '#A78BFA']
    })
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank')
    
    setOrderSent(true)
    setIsProcessing(false)
    
    // Reset after delay
    setTimeout(() => {
      setOrderSent(false)
      clearCart()
      setIsOpen(false)
    }, 3000)
  }

  const allBoxes = currentBox && currentBox.items.length > 0 
    ? [...boxes.filter(b => b.id !== currentBox.id), currentBox]
    : boxes

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Boxes</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {totalBoxes} {totalBoxes === 1 ? 'box' : 'boxes'} • {totalPrice.toFixed(2)} OMR
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {allBoxes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No boxes yet</h3>
                  <p className="text-gray-600 mb-6">Start by adding donuts to create your first box (12 per box)!</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {allBoxes.map((box, boxIndex) => {
                      const isCurrentBox = box.id === currentBox?.id
                      const boxTotal = box.items.reduce((sum, item) => 
                        sum + ((item.flavor.priceOMR / 6) * item.quantity), 0
                      )
                      
                      return (
                        <motion.div
                          key={box.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-200"
                        >
                          {/* Box Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold">
                                {boxIndex + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  Box {boxIndex + 1} {isCurrentBox && '(Current)'}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {box.totalItems}/12 donuts • {boxTotal.toFixed(2)} OMR
                                </p>
                              </div>
                            </div>
                            {box.totalItems === 12 ? (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                Complete
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                {12 - box.totalItems} more needed
                              </span>
                            )}
                          </div>

                          {/* Box Items */}
                          <div className="space-y-2">
                            {box.items.map((item) => (
                              <div key={item.flavor.id} className="flex items-center gap-3 bg-white rounded-lg p-3">
                                <div className="relative w-12 h-12 flex-shrink-0">
                                  <Image
                                    src={encodeURI(item.flavor.donutImg)}
                                    alt={item.flavor.name}
                                    fill
                                    className="object-contain"
                                    sizes="48px"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{item.flavor.name}</p>
                                  <p className="text-xs text-gray-600">
                                    {item.quantity} donuts • {((item.flavor.priceOMR / 6) * item.quantity).toFixed(2)} OMR
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-gray-400 to-gray-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${(box.totalItems / 12) * 100}%` }}
                                transition={{ type: 'spring' }}
                                style={{
                                  background: box.totalItems === 12 
                                    ? 'linear-gradient(to right, #10b981, #059669)'
                                    : 'linear-gradient(to right, #fbbf24, #f59e0b)'
                                }}
                              />
                            </div>
                          </div>

                          {/* Remove Box Button */}
                          <button
                            onClick={() => removeBox(box.id)}
                            className="mt-3 w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Remove Box
                          </button>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>

                  {/* Add New Box Button */}
                  {(!currentBox || currentBox.totalItems >= 12) && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => {
                        createNewBox()
                        setIsOpen(false)
                      }}
                      className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Start New Box
                    </motion.button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {allBoxes.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-2xl">{totalPrice.toFixed(2)} OMR</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={clearCart}
                    disabled={isProcessing || orderSent}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Clear All
                  </button>
                  <motion.button
                    onClick={handleCheckout}
                    disabled={isProcessing || orderSent}
                    className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      orderSent 
                        ? 'bg-green-600 text-white' 
                        : isProcessing
                        ? 'bg-gray-400 text-white cursor-wait'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                    whileHover={!isProcessing && !orderSent ? { scale: 1.02 } : {}}
                    whileTap={!isProcessing && !orderSent ? { scale: 0.98 } : {}}
                  >
                    {orderSent ? (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Order Sent!
                      </>
                    ) : isProcessing ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Order via WhatsApp
                      </>
                    )}
                  </motion.button>
                </div>

                <p className="text-xs text-center text-gray-500">
                  {BRAND.deliveryInfo}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}