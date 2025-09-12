export const BRAND = {
  name: 'ELLE Donuts',
  tagline: 'Premium Artisan Donuts',
  // WhatsApp order number, set in .env.local or the Vercel project settings
  phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
  email: 'hello@elledonuts.com',
  social: {
    instagram: '@elledonuts',
    facebook: 'elledonuts',
    twitter: '@elledonuts',
  },
  location: 'Muscat, Oman',
  hours: {
    weekdays: '8:00 AM - 10:00 PM',
    weekends: '9:00 AM - 11:00 PM',
  },
  currency: 'OMR',
  deliveryInfo: 'Free delivery on orders above 5 OMR',
  minOrder: 2,
} as const

export type BrandInfo = typeof BRAND