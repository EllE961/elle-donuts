import { BRAND } from './brand'
import type { Flavor } from './flavors'

export type OrderItem = {
  flavor: Flavor
  quantity: number
}

export type CustomerInfo = {
  name?: string
  phone?: string
  address?: string
  deliveryDate?: string
  deliveryTime?: string
  notes?: string
}

function formatCurrency(amount: number): string {
  return `${BRAND.currency} ${amount.toFixed(2)}`
}

function getCurrentDateTime(): string {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = { 
    timeZone: 'Asia/Muscat', 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return now.toLocaleString('en-GB', options)
}

export function generateWhatsAppUrl(flavor?: Flavor, items?: OrderItem[], customerInfo?: CustomerInfo): string {
  const phone = BRAND.phone.replace(/[^0-9]/g, '')
  
  // Quick order for single flavor
  if (flavor && !items) {
    const boxPrice = flavor.priceOMR
    const message = [
      `🍩 *NEW ORDER - ${BRAND.name}*`,
      ``,
      `📦 *Quick Order:*`,
      `• ${flavor.name} 🍩`,
      `• Quantity: 6 donuts (1 box)`,
      `• Price: ${formatCurrency(boxPrice)}`,
      ``,
      `📍 *Delivery Details:*`,
      `Please provide:`,
      `• Delivery address`,
      `• Preferred date & time`,
      `• Contact number`,
      ``,
      `⏰ Order placed: ${getCurrentDateTime()}`,
      ``,
      `Thank you! 🙏`
    ].join('\n')
    
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }
  
  // Full cart order
  if (items && items.length > 0) {
    let total = 0
    const totalDonuts = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalBoxes = Math.ceil(totalDonuts / 12)
    
    // Group items by flavor for cleaner display
    const groupedItems = items.reduce((acc, item) => {
      const existing = acc.find(i => i.flavor.id === item.flavor.id)
      if (existing) {
        existing.quantity += item.quantity
      } else {
        acc.push({ ...item })
      }
      return acc
    }, [] as OrderItem[])
    
    // Sort by quantity (highest first)
    groupedItems.sort((a, b) => b.quantity - a.quantity)
    
    let message = [
      `🍩 *NEW ORDER - ${BRAND.name}*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      ``,
      `📋 *ORDER DETAILS:*`
    ]
    
    // Add items with better formatting
    groupedItems.forEach((item, index) => {
      const itemTotal = (item.flavor.priceOMR / 6) * item.quantity
      total += itemTotal
      const boxes = item.quantity / 6
      const boxText = boxes === 1 ? '1 box' : `${boxes.toFixed(1)} boxes`
      
      message.push(
        ``,
        `${index + 1}. *${item.flavor.name}* 🍩`,
        `   └ ${item.quantity} pcs (${boxText})`,
        `   └ ${formatCurrency(itemTotal)}`
      )
    })
    
    // Add order summary
    message.push(
      ``,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📊 *ORDER SUMMARY:*`,
      `• Total Items: ${totalDonuts} donuts`,
      `• Total Boxes: ${totalBoxes} ${totalBoxes === 1 ? 'box' : 'boxes'}`,
      `• *Total Amount: ${formatCurrency(total)}*`
    )
    
    // Add delivery info section
    if (total >= 5) {
      message.push(`• ✅ *FREE DELIVERY* (Order > 5 OMR)`)
    } else {
      const deliveryFee = 1.5
      const totalWithDelivery = total + deliveryFee
      message.push(
        `• Delivery Fee: ${formatCurrency(deliveryFee)}`,
        `• *Final Total: ${formatCurrency(totalWithDelivery)}*`
      )
    }
    
    // Add customer info if provided
    if (customerInfo) {
      message.push(
        ``,
        `━━━━━━━━━━━━━━━━━━━━`,
        `👤 *CUSTOMER INFO:*`
      )
      
      if (customerInfo.name) message.push(`• Name: ${customerInfo.name}`)
      if (customerInfo.phone) message.push(`• Phone: ${customerInfo.phone}`)
      if (customerInfo.address) message.push(`• Address: ${customerInfo.address}`)
      if (customerInfo.deliveryDate) message.push(`• Preferred Date: ${customerInfo.deliveryDate}`)
      if (customerInfo.deliveryTime) message.push(`• Preferred Time: ${customerInfo.deliveryTime}`)
      if (customerInfo.notes) message.push(`• Notes: ${customerInfo.notes}`)
    } else {
      message.push(
        ``,
        `━━━━━━━━━━━━━━━━━━━━`,
        `📍 *DELIVERY DETAILS:*`,
        `Please provide:`,
        `• Full delivery address`,
        `• Preferred date & time`,
        `• Contact number for delivery`
      )
    }
    
    // Add footer
    message.push(
      ``,
      `━━━━━━━━━━━━━━━━━━━━`,
      `⏰ Order placed: ${getCurrentDateTime()}`,
      `📱 ${BRAND.location}`,
      ``,
      `Thank you for choosing ${BRAND.name}! 🙏`,
      `We'll confirm your order shortly.`
    )
    
    return `https://wa.me/${phone}?text=${encodeURIComponent(message.join('\n'))}`
  }
  
  // Default inquiry message
  const message = [
    `Hello! 👋`,
    ``,
    `I'm interested in ordering from *${BRAND.name}*.`,
    `Could you please share:`,
    `• Available flavors`,
    `• Pricing details`,
    `• Delivery options`,
    ``,
    `Thank you!`
  ].join('\n')
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function generateQuickOrderUrl(flavor: Flavor, quantity: number = 6): string {
  return generateWhatsAppUrl(flavor)
}

export function generateInquiryUrl(topic?: string): string {
  const phone = BRAND.phone.replace(/[^0-9]/g, '')
  
  const topics: { [key: string]: string } = {
    'custom': 'I would like to inquire about custom donut orders and bulk pricing.',
    'catering': 'I need information about catering services for an event.',
    'delivery': 'I have questions about delivery areas and timing.',
    'general': 'I would like to know more about your products and services.'
  }
  
  const message = [
    `Hello! 👋`,
    ``,
    topics[topic || 'general'] || topics.general,
    ``,
    `Please let me know the details.`,
    ``,
    `Thank you!`
  ].join('\n')
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}