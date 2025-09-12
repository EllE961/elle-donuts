export type Flavor = {
  id: string
  name: string
  description?: string
  priceOMR: number
  accent: string
  gradientVar: string
  donutImg: string
  props: [string, string]
  featured?: boolean
}

export const FLAVORS: Flavor[] = [
  {
    id: 'classic-honey-glaze',
    name: 'Classic Honey Glaze',
    description: 'Sweet golden honey drizzled over fluffy dough',
    priceOMR: 1.6,
    accent: '#F0B36A',
    gradientVar: '--grad-vanilla',
    donutImg: '/assets/donuts/Classic honey glaze.png',
    props: ['/assets/props/honey dipper.png', '/assets/props/powdered sugar.png']
  },
  {
    id: 'pistachio-drizzle',
    name: 'Pistachio Drizzle',
    description: 'Premium pistachios with white chocolate',
    priceOMR: 2.0,
    accent: '#62D092',
    gradientVar: '--grad-pistachio',
    donutImg: '/assets/donuts/Pistachio drizzle.png',
    props: ['/assets/props/pistachio nuts.png', '/assets/props/dark-chocolate squares.png'],
    featured: true
  },
  {
    id: 'red-velvet',
    name: 'Red Velvet',
    description: 'Rich cocoa with cream cheese frosting',
    priceOMR: 2.0,
    accent: '#E94148',
    gradientVar: '--grad-strawberry',
    donutImg: '/assets/donuts/Red velvet.png',
    props: ['/assets/props/red-velvet cake crumbs.png', '/assets/props/small swirl of white cream-cheese frosting.png'],
    featured: true
  },
  {
    id: 'oreo-swirl',
    name: 'Oreo Swirl',
    description: 'Crushed Oreos swirled with vanilla cream',
    priceOMR: 1.6,
    accent: '#3D3D3D',
    gradientVar: '--grad-chocolate',
    donutImg: '/assets/donuts/Oreo swirl.png',
    props: ['/assets/props/mini Oreo cookies.png', '/assets/props/crushed cookie crumbs.png']
  },
  {
    id: 'vanilla-sprinkle',
    name: 'Vanilla Sprinkle',
    description: 'Classic vanilla with rainbow sprinkles',
    priceOMR: 1.6,
    accent: '#9B7E5C',
    gradientVar: '--grad-vanilla',
    donutImg: '/assets/donuts/Vanilla sprinkle.png',
    props: ['/assets/props/white-chocolate chips.png', '/assets/props/split vanilla bean pod with seeds.png']
  },
  {
    id: 'caramel-glaze',
    name: 'Caramel Glaze',
    description: 'Buttery caramel with a hint of sea salt',
    priceOMR: 1.6,
    accent: '#C68B59',
    gradientVar: '--grad-caramel',
    donutImg: '/assets/donuts/Caramel glaze.png',
    props: ['/assets/props/soft caramel cubes.png', '/assets/props/pinch of flaky sea salt.png']
  },
  {
    id: 'chocolate-sprinkle',
    name: 'Chocolate Sprinkle',
    description: 'Belgian dark chocolate with sprinkles',
    priceOMR: 1.6,
    accent: '#8B5E34',
    gradientVar: '--grad-chocolate',
    donutImg: '/assets/donuts/Chocolate sprinkle.png',
    props: ['/assets/props/dark-chocolate squares.png', '/assets/props/cocoa nibs.png']
  },
  {
    id: 'nutty-crunch',
    name: 'Nutty Crunch',
    description: 'Roasted almonds and hazelnuts with toffee',
    priceOMR: 1.6,
    accent: '#A77248',
    gradientVar: '--grad-caramel',
    donutImg: '/assets/donuts/Nutty crunch.png',
    props: ['/assets/props/pistachio nuts.png', '/assets/props/cocoa nibs.png']
  },
  {
    id: 'saffron-gold',
    name: 'Saffron Gold',
    description: 'Luxurious saffron glaze with gold dust',
    priceOMR: 2.0,
    accent: '#FFD24D',
    gradientVar: '--grad-saffron',
    donutImg: '/assets/donuts/Saffron gold.png',
    props: ['/assets/props/saffron threads.png', '/assets/props/green cardamom pods.png'],
    featured: true
  }
]

export const getFeaturedFlavors = () => FLAVORS.filter(f => f.featured)

export const getFlavorById = (id: string) => FLAVORS.find(f => f.id === id)