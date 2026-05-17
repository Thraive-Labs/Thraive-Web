export interface Product {
  slug: string
  name: string
  tagline: string
  description: string
  accent: string
  platforms: string[]
  category: string
}

export const PRODUCTS: Product[] = [
  {
    slug: 'wildcafe',
    name: 'WildCafe POS',
    tagline: 'Restaurant management, reimagined.',
    description: 'Built for Sri Lankan cafes, restaurants, and food courts — from tables to receipts.',
    accent: '#F97316',
    platforms: ['Windows', 'Android'],
    category: 'Food & Beverage',
  },
  {
    slug: 'pharmacy',
    name: 'Pharmacy POS',
    tagline: 'Complete pharmacy management.',
    description: 'Inventory, dispensing, prescriptions, and billing in one offline-ready system.',
    accent: '#06B6D4',
    platforms: ['Windows'],
    category: 'Healthcare',
  },
  {
    slug: 'smartpos',
    name: 'SmartPOS',
    tagline: 'Retail POS for any business.',
    description: 'Fast, reliable point-of-sale that works whether the internet does or not.',
    accent: '#10B981',
    platforms: ['Windows', 'Android'],
    category: 'Retail',
  },
  {
    slug: 'routeflow',
    name: 'RouteFlow',
    tagline: 'Distribution, route by route.',
    description: 'Manage agents, plan routes, and track orders across your entire distribution network.',
    accent: '#3B82F6',
    platforms: ['Windows', 'Android'],
    category: 'Distribution',
  },
  {
    slug: 'autoserv',
    name: 'AutoServ',
    tagline: 'Service station management.',
    description: 'Vehicle history, job cards, parts inventory, and billing for service stations.',
    accent: '#8B5CF6',
    platforms: ['Windows'],
    category: 'Automotive',
  },
  {
    slug: 'sonara',
    name: 'Sonara',
    tagline: 'AI vocal coaching.',
    description: 'Learn to sing with real-time AI feedback, personalised to your voice and goals.',
    accent: '#7C3AED',
    platforms: ['Windows', 'Android', 'iOS'],
    category: 'AI / Music',
  },
]
