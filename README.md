# EllE Donuts - Premium Artisan Donuts Website

A production-ready, mobile-first donut shop website built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. Features beautiful animations, smooth parallax effects, and WhatsApp integration for easy ordering.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn installed
- Your donut images (PNG format)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd elle-donuts
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Add your images:
Place your PNG images in the following structure:
```
public/
├── assets/
│   ├── donuts/
│   │   ├── Classic honey glaze.png
│   │   ├── Pistachio drizzle.png
│   │   ├── Red velvet.png
│   │   ├── Oreo swirl.png
│   │   ├── Vanilla sprinkle.png
│   │   ├── Caramel glaze.png
│   │   ├── Chocolate sprinkle.png
│   │   ├── Nutty crunch.png
│   │   └── Saffron gold.png
│   └── props/
│       ├── cocoa nibs.png
│       ├── crushed cookie crumbs.png
│       ├── dark-chocolate squares.png
│       ├── green cardamom pods.png
│       ├── honey dipper.png
│       ├── mini Oreo cookies.png
│       ├── pinch of flaky sea salt.png
│       ├── pistachio nuts.png
│       ├── powdered sugar.png
│       ├── red-velvet cake crumbs.png
│       ├── saffron threads.png
│       ├── small swirl of white cream-cheese frosting.png
│       ├── soft caramel cubes.png
│       ├── split vanilla bean pod with seeds.png
│       ├── strawberry.png
│       ├── strawberry leaves.png
│       └── white-chocolate chips.png
```

**Note:** Keep the exact filenames with spaces. The app handles encoding automatically.

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see your website!

## 🎨 Customization

### Changing Brand Information

Edit `lib/brand.ts` to update:
- Business name
- WhatsApp phone number (IMPORTANT!)
- Email and social media links
- Location and opening hours

```typescript
export const BRAND = {
  name: 'Your Donut Shop',           // Your brand name
  phone: '+968XXXXXXXX',             // Your WhatsApp number
  email: 'hello@yourshop.com',       // Your email
  // ... other details
}
```

### Adding New Flavors

Edit `lib/flavors.ts` to add new donut flavors:

```typescript
{
  id: 'new-flavor',
  name: 'New Flavor Name',
  priceOMR: 2.5,
  accent: '#HEX_COLOR',
  gradientVar: '--grad-vanilla',  // Choose from existing gradients
  donutImg: '/assets/donuts/new-flavor.png',
  props: ['/assets/props/prop1.png', '/assets/props/prop2.png'],
  featured: true  // Optional: marks as featured
}
```

### Customizing Colors & Gradients

Edit `app/globals.css` to modify:
- Color tokens (--bg, --surface, --ink, --muted)
- Gradient definitions (--grad-strawberry, etc.)

## 📱 Features

- **Mobile-First Design**: Optimized for all devices with touch gestures
- **Premium Animations**: Smooth parallax, idle float, and micro-interactions
- **WhatsApp Integration**: Direct ordering with prefilled messages
- **Performance Optimized**: Lazy loading, image optimization, >90 Lighthouse score
- **Accessibility**: WCAG compliant with reduced motion support
- **SEO Ready**: Meta tags, Open Graph, structured data

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **Animations**: Framer Motion
- **Images**: Next/Image with automatic optimization

## 📦 Building for Production

1. Build the application:
```bash
npm run build
# or
yarn build
```

2. Test the production build:
```bash
npm run start
# or
yarn start
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy with zero configuration

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Digital Ocean
- Self-hosted with Node.js

## 📝 Environment Variables

No environment variables are required for basic setup. All configuration is done through `lib/brand.ts`.

## 🎯 Performance Tips

1. **Image Optimization**: Use PNG images under 500KB each
2. **Lazy Loading**: Images are automatically lazy-loaded
3. **Caching**: Static assets are cached for 1 year
4. **CDN**: Deploy to Vercel/Netlify for automatic CDN

## 🤝 Support

For issues or questions:
1. Check the codebase documentation
2. Review component files in `/components`
3. Inspect data models in `/lib`

## 📄 License

This project is created for EllE Donuts. All rights reserved.

---

Built with ❤️ using Next.js and Tailwind CSS