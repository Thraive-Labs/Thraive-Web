import type { Product } from './products'
import { PRODUCTS } from './products'

export interface ProductFeature {
  iconName: string
  title: string
  description: string
}

export interface ProductStep {
  num: string
  title: string
  description: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
}

export interface ProductDetail extends Product {
  longDescription: string
  customerType: string
  problem: { heading: string; body: string }
  features: ProductFeature[]
  steps: ProductStep[]
  faq: FAQItem[]
  pricing: PricingPlan[]
}

const PRODUCT_DETAILS: Record<string, Omit<ProductDetail, keyof Product>> = {
  wildcafe: {
    longDescription:
      'WildCafe POS is built from the ground up for Sri Lankan restaurants, cafes, and food courts. It handles the full operation — from the moment a customer sits down to the moment they pay — without needing an internet connection.',
    customerType: 'Restaurants, cafes, and food businesses',
    problem: {
      heading: 'Running a cafe is hard enough without your software failing you.',
      body: 'During a lunch rush, the last thing you need is a system that hangs because the router dropped. Most POS software is designed for markets with reliable power and stable internet. Sri Lankan cafes deal with neither. WildCafe POS was designed around this reality from day one.',
    },
    features: [
      {
        iconName: 'table',
        title: 'Table management',
        description: 'Visual floor plan, drag-and-drop tables, split and merge orders. See the full floor at a glance.',
      },
      {
        iconName: 'order',
        title: 'Order tracking',
        description: 'Orders flow from table to kitchen automatically. Status updates in real time across devices on the same local network.',
      },
      {
        iconName: 'kitchen',
        title: 'Kitchen display system',
        description: 'Replace the paper chit. Kitchen staff see orders on a screen, mark them done, and the server is notified instantly.',
      },
      {
        iconName: 'bill',
        title: 'Split billing',
        description: 'Split bills by item, by person, or by percentage. Handle cash, card, and mixed payments without workarounds.',
      },
      {
        iconName: 'report',
        title: 'Daily sales reports',
        description: 'End-of-day summaries, top-selling items, revenue by table, hourly breakdown. Everything you need to run a smarter cafe.',
      },
      {
        iconName: 'offline',
        title: 'Fully offline',
        description: 'No internet required. Your LAN keeps everything in sync across your devices. Data syncs to the cloud when connection returns.',
      },
    ],
    steps: [
      { num: '1', title: 'Set up your floor plan', description: 'Add your tables, name them, and arrange your floor visually. Takes under five minutes.' },
      { num: '2', title: 'Add your menu', description: 'Enter items, prices, and categories. Add modifiers for size, extras, and notes.' },
      { num: '3', title: 'Start taking orders', description: 'Servers tap the table, add items, and send to the kitchen — all from any Android tablet or Windows PC.' },
      { num: '4', title: 'Print and close', description: 'Generate itemised bills, accept payment, and close the day with a full summary report.' },
    ],
    faq: [
      {
        question: 'Does it work during a power cut?',
        answer: 'Yes. If you have a UPS or generator keeping your devices and local router running, WildCafe POS continues operating without any internet connection. All data is stored locally.',
      },
      {
        question: 'How many devices can I use?',
        answer: 'Standard plan supports up to 3 devices on the same local network. Pro supports unlimited devices. All devices stay in sync over LAN.',
      },
      {
        question: 'Does it support multiple locations?',
        answer: 'Pro plan includes multi-location support with a central dashboard. Each location operates independently offline and syncs when online.',
      },
      {
        question: 'Can I use it on Android tablets?',
        answer: 'Yes. WildCafe POS runs on Android (tablet recommended) and Windows. A single license covers both platforms.',
      },
      {
        question: 'Is there a trial?',
        answer: 'Yes — 30 days free, full features, no credit card required. Download the installer and enter your trial key from your email.',
      },
    ],
    pricing: [
      {
        name: 'Standard',
        price: 'LKR 2,500',
        period: '/month',
        description: 'For single-location cafes and small restaurants.',
        features: [
          'Up to 3 devices',
          'Unlimited tables',
          'Full menu management',
          'Kitchen display',
          'Daily reports',
          'Offline mode',
          'Email support',
        ],
        cta: 'Start free trial',
      },
      {
        name: 'Pro',
        price: 'LKR 4,500',
        period: '/month',
        description: 'For growing restaurants and multi-location operations.',
        features: [
          'Unlimited devices',
          'Multi-location support',
          'Staff management',
          'Advanced analytics',
          'Custom receipt branding',
          'Priority support',
          'Everything in Standard',
        ],
        highlighted: true,
        cta: 'Start free trial',
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For chains, food courts, and franchise operations.',
        features: [
          'Custom integrations',
          'Dedicated account manager',
          'On-site setup and training',
          'SLA guarantee',
          'Everything in Pro',
        ],
        cta: 'Contact us',
      },
    ],
  },

  pharmacy: {
    longDescription:
      'Pharmacy POS is a complete management system for Sri Lankan pharmacies — handling drug inventory, prescriptions, customer records, and billing in a single offline-capable application.',
    customerType: 'Pharmacies and medical shops',
    problem: {
      heading: 'A missed expiry date or a lost prescription can have serious consequences.',
      body: 'Manual record keeping leaves too much room for error. Expired stock sits unnoticed. Prescriptions are lost or misread. Customer medication history is scattered across paper books. Pharmacy POS centralises all of this, with alerts, records, and reports that keep your pharmacy running safely.',
    },
    features: [
      {
        iconName: 'inventory',
        title: 'Drug inventory management',
        description: 'Track every item — batch number, expiry date, supplier, reorder level. Get alerts before stock runs out or expires.',
      },
      {
        iconName: 'prescription',
        title: 'Prescription records',
        description: 'Log prescriptions digitally, link to customer profiles, and retrieve any past prescription in seconds.',
      },
      {
        iconName: 'alert',
        title: 'Expiry and restock alerts',
        description: 'Automated alerts 30 and 7 days before expiry. Reorder notifications when stock drops below your set threshold.',
      },
      {
        iconName: 'customer',
        title: 'Customer profiles',
        description: 'Full medication history per customer. Helpful for long-term patients, chronic conditions, and allergy tracking.',
      },
      {
        iconName: 'report',
        title: 'Financial reports',
        description: 'Daily sales, profit margins, top-selling drugs, supplier payment tracking. Full visibility into your pharmacy\'s finances.',
      },
      {
        iconName: 'offline',
        title: 'Offline-first',
        description: 'All features work without internet. No cloud dependency — your data stays on your hardware.',
      },
    ],
    steps: [
      { num: '1', title: 'Import your inventory', description: 'Add drugs with batch numbers, expiry dates, and supplier info. Import via spreadsheet or add manually.' },
      { num: '2', title: 'Create customer profiles', description: 'Register customers and link their prescription history. Returning customers are found in seconds.' },
      { num: '3', title: 'Dispense and bill', description: 'Record prescriptions, dispense items, and generate detailed receipts with one workflow.' },
      { num: '4', title: 'Review and restock', description: 'End-of-day reports, expiry alerts, and automatic reorder suggestions keep your stock healthy.' },
    ],
    faq: [
      {
        question: 'Does it work during internet outages?',
        answer: 'Yes, completely. Pharmacy POS is designed for offline-first operation. All dispensing, billing, and record-keeping works without internet.',
      },
      {
        question: 'Can it handle controlled drug records?',
        answer: 'Yes. Controlled substances can be flagged with additional record-keeping fields including prescriber details and quantity dispensed.',
      },
      {
        question: 'How does the expiry alert system work?',
        answer: 'When you add stock, you enter the expiry date. The system sends alerts at 30 days and 7 days before expiry so you can return or discount stock proactively.',
      },
      {
        question: 'Can multiple staff members use it simultaneously?',
        answer: 'Yes. Multiple cashiers can operate simultaneously on the same LAN. Each transaction is logged with the staff member\'s name.',
      },
      {
        question: 'Is patient data secure?',
        answer: 'All data is stored locally on your hardware. We have no access to it. You control your data completely.',
      },
    ],
    pricing: [
      {
        name: 'Standard',
        price: 'LKR 2,800',
        period: '/month',
        description: 'For independent pharmacies.',
        features: [
          'Up to 2 terminals',
          'Full inventory management',
          'Prescription records',
          'Expiry alerts',
          'Customer profiles',
          'Daily reports',
          'Email support',
        ],
        cta: 'Start free trial',
      },
      {
        name: 'Pro',
        price: 'LKR 5,000',
        period: '/month',
        description: 'For multi-terminal pharmacies and chains.',
        features: [
          'Unlimited terminals',
          'Multi-location',
          'Advanced analytics',
          'Staff management',
          'Supplier management',
          'Priority support',
          'Everything in Standard',
        ],
        highlighted: true,
        cta: 'Start free trial',
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For pharmacy chains and hospital pharmacies.',
        features: [
          'Custom integrations',
          'On-site training',
          'SLA guarantee',
          'Everything in Pro',
        ],
        cta: 'Contact us',
      },
    ],
  },

  smartpos: {
    longDescription:
      'SmartPOS is a fast, reliable point-of-sale system for any retail business — from a small boutique to a multi-branch store. Works on Windows and Android, with or without internet.',
    customerType: 'Retail shops, boutiques, and stores',
    problem: {
      heading: 'Generic POS systems are built for markets with reliable infrastructure.',
      body: 'Most retail software assumes 24/7 internet, a stable power supply, and pricing in USD. SmartPOS assumes none of this. It runs on your hardware, in LKR, through power cuts and internet outages, and gives small Sri Lankan retailers the same capabilities that large chains take for granted.',
    },
    features: [
      {
        iconName: 'catalog',
        title: 'Product catalog',
        description: 'Add unlimited products with photos, barcodes, variants, and multiple price tiers. Bulk import from spreadsheet.',
      },
      {
        iconName: 'barcode',
        title: 'Barcode scanning',
        description: 'Scan any standard barcode to add items to a sale. Works with USB scanners, Bluetooth scanners, and the Android camera.',
      },
      {
        iconName: 'customer',
        title: 'Customer loyalty',
        description: 'Track customer purchases, apply loyalty discounts, and view purchase history. Build repeat business without complexity.',
      },
      {
        iconName: 'returns',
        title: 'Returns and exchanges',
        description: 'Handle returns cleanly — link to original receipt, restock items, and issue refunds or store credit.',
      },
      {
        iconName: 'report',
        title: 'Sales analytics',
        description: 'Top products, slow movers, peak hours, staff performance. The data you need to make better buying decisions.',
      },
      {
        iconName: 'offline',
        title: 'Offline-first',
        description: 'Complete a sale, accept payment, and print receipt — even with no internet. Syncs when connection returns.',
      },
    ],
    steps: [
      { num: '1', title: 'Add your products', description: 'Enter products manually or import from a spreadsheet. Assign barcodes, prices, and categories.' },
      { num: '2', title: 'Serve your customers', description: 'Scan items, apply discounts, and accept cash or card. A sale takes seconds.' },
      { num: '3', title: 'Print receipts', description: 'Thermal printer support out of the box. Digital receipts via WhatsApp or email.' },
      { num: '4', title: 'Review your business', description: 'Daily reports, stock alerts, and trend data keep you in control of your inventory and revenue.' },
    ],
    faq: [
      {
        question: 'What hardware does it run on?',
        answer: 'SmartPOS runs on Windows 10/11 and Android 8+. It supports thermal printers, barcode scanners, cash drawers, and customer displays via standard connections.',
      },
      {
        question: 'Can I use it on both Windows and Android?',
        answer: 'Yes. A single license covers both platforms. Use Windows at the main counter and Android for a mobile cashier simultaneously.',
      },
      {
        question: 'How does it handle multiple staff?',
        answer: 'Each staff member has their own PIN login. Sales are attributed to the cashier who processed them, and shift reports are per-staff.',
      },
      {
        question: 'Does it support VAT and SVAT?',
        answer: 'Yes. Tax rates are configurable per product category. Receipts show tax breakdowns as required by Sri Lankan regulations.',
      },
      {
        question: 'How many products can I add?',
        answer: 'Unlimited products on all plans. There is no cap on catalog size.',
      },
    ],
    pricing: [
      {
        name: 'Standard',
        price: 'LKR 1,800',
        period: '/month',
        description: 'For single-location retailers.',
        features: [
          'Up to 2 terminals',
          'Unlimited products',
          'Barcode scanning',
          'Customer loyalty',
          'Returns',
          'Daily reports',
          'Email support',
        ],
        cta: 'Start free trial',
      },
      {
        name: 'Pro',
        price: 'LKR 3,500',
        period: '/month',
        description: 'For multi-branch retailers.',
        features: [
          'Unlimited terminals',
          'Multi-location',
          'Advanced analytics',
          'Staff management',
          'Custom receipt branding',
          'Priority support',
          'Everything in Standard',
        ],
        highlighted: true,
        cta: 'Start free trial',
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For chains and franchise operations.',
        features: [
          'Custom integrations',
          'On-site setup',
          'SLA guarantee',
          'Everything in Pro',
        ],
        cta: 'Contact us',
      },
    ],
  },

  routeflow: {
    longDescription:
      'RouteFlow gives distribution companies full visibility and control over their agent network — from route planning to order collection to delivery confirmation — all working offline in the field.',
    customerType: 'Distributors and FMCG companies',
    problem: {
      heading: 'Managing a field agent team via phone calls and WhatsApp is not a business system.',
      body: 'Distribution companies across Sri Lanka manage dozens of agents, hundreds of routes, and thousands of orders using spreadsheets, phone calls, and group chats. Orders get missed. Routes are inefficient. Management has no real-time picture of what\'s happening in the field. RouteFlow brings all of this into one system.',
    },
    features: [
      {
        iconName: 'agent',
        title: 'Agent management',
        description: 'Create agent profiles, assign territories, track performance, and view daily activity from a central dashboard.',
      },
      {
        iconName: 'route',
        title: 'Route planning',
        description: 'Define routes with stops, sequence, and target outlets. Agents load their route for the day and follow it step by step.',
      },
      {
        iconName: 'order',
        title: 'Order collection',
        description: 'Agents collect orders on their Android device, even without signal. Orders sync to head office when connectivity returns.',
      },
      {
        iconName: 'delivery',
        title: 'Delivery tracking',
        description: 'Agents confirm delivery and capture signatures or photos. Head office sees delivery status without calling anyone.',
      },
      {
        iconName: 'report',
        title: 'Area-wise reporting',
        description: 'Sales by route, by agent, by outlet, by product. Identify your best and worst performing areas at a glance.',
      },
      {
        iconName: 'offline',
        title: 'Field-ready offline mode',
        description: 'Agents work fully offline in remote areas. All data syncs when they return to coverage — nothing is lost.',
      },
    ],
    steps: [
      { num: '1', title: 'Set up your routes', description: 'Define your distribution routes, add outlets, and set daily targets for each route.' },
      { num: '2', title: 'Assign agents', description: 'Assign agents to routes, distribute stock, and brief for the day — all from the dashboard.' },
      { num: '3', title: 'Agents work offline', description: 'Agents use the Android app to visit outlets, collect orders, and confirm deliveries without internet.' },
      { num: '4', title: 'Review and dispatch', description: 'When agents sync, you see every order, delivery, and exception. Generate invoices and plan tomorrow.' },
    ],
    faq: [
      {
        question: 'How does offline sync work?',
        answer: 'Agent devices cache the full route and product catalog. All orders and delivery confirmations are stored locally and sync automatically when the device reconnects to the internet.',
      },
      {
        question: 'How many agents can I manage?',
        answer: 'Standard supports up to 10 agents. Pro supports unlimited agents across unlimited routes.',
      },
      {
        question: 'Does it work in remote areas with no signal?',
        answer: 'Yes. The Android app is fully functional without signal. Agents load their route in the morning when they have connectivity, then work offline all day.',
      },
      {
        question: 'Can agents collect payments?',
        answer: 'Yes. Agents can record cash collections against deliveries. Payment records sync to head office and reconcile automatically.',
      },
      {
        question: 'Does it integrate with my accounting software?',
        answer: 'RouteFlow can export to CSV and common accounting formats. Native integrations are on the roadmap for the Pro plan.',
      },
    ],
    pricing: [
      {
        name: 'Standard',
        price: 'LKR 4,500',
        period: '/month',
        description: 'For distribution teams up to 10 agents.',
        features: [
          'Up to 10 agents',
          'Unlimited routes',
          'Order collection',
          'Delivery tracking',
          'Route reports',
          'Offline mode',
          'Email support',
        ],
        cta: 'Start free trial',
      },
      {
        name: 'Pro',
        price: 'LKR 8,500',
        period: '/month',
        description: 'For larger networks and regional distributors.',
        features: [
          'Unlimited agents',
          'Payment collection',
          'Advanced analytics',
          'Custom integrations',
          'API access',
          'Priority support',
          'Everything in Standard',
        ],
        highlighted: true,
        cta: 'Start free trial',
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For large-scale FMCG and national distributors.',
        features: [
          'Dedicated infrastructure',
          'Custom workflows',
          'SLA guarantee',
          'Everything in Pro',
        ],
        cta: 'Contact us',
      },
    ],
  },

  autoserv: {
    longDescription:
      'AutoServ is a complete management system for vehicle service stations — handling job cards, vehicle history, parts inventory, technician assignments, and customer billing in one place.',
    customerType: 'Vehicle service stations and garages',
    problem: {
      heading: 'Paper job cards get lost, parts go missing, and customers forget what was done to their vehicle.',
      body: 'Vehicle service stations in Sri Lanka still run largely on paper. Job cards disappear. Parts inventory is guesswork. A customer asks what was done to their car two services ago and nobody knows. AutoServ replaces the paper trail with a complete digital system that works even when the power is unstable.',
    },
    features: [
      {
        iconName: 'jobcard',
        title: 'Digital job cards',
        description: 'Create job cards when a vehicle arrives. Track every task, assign technicians, and follow progress in real time.',
      },
      {
        iconName: 'history',
        title: 'Vehicle history',
        description: 'Full service history per vehicle, searchable by plate number. Customers appreciate knowing you remember their car.',
      },
      {
        iconName: 'parts',
        title: 'Parts inventory',
        description: 'Track parts in, parts out, and parts on order. Get alerts when common items run low.',
      },
      {
        iconName: 'technician',
        title: 'Technician management',
        description: 'Assign jobs to technicians, track workload, and measure productivity per staff member.',
      },
      {
        iconName: 'sms',
        title: 'Customer notifications',
        description: 'Notify customers when their vehicle is ready via SMS. Reduce phone calls and improve customer satisfaction.',
      },
      {
        iconName: 'billing',
        title: 'Integrated billing',
        description: 'Generate professional invoices from the job card automatically. Parts, labour, and taxes handled correctly every time.',
      },
    ],
    steps: [
      { num: '1', title: 'Create the job card', description: 'When a vehicle arrives, open a job card. Capture the vehicle details, customer contact, and reported issues.' },
      { num: '2', title: 'Assign and track', description: 'Assign tasks to technicians, add parts from inventory, and update job status as work progresses.' },
      { num: '3', title: 'Notify the customer', description: 'Send an SMS when the vehicle is ready. No phone tag — the customer knows before they call.' },
      { num: '4', title: 'Bill and close', description: 'Generate the invoice from the job card. All parts and labour are already itemised.' },
    ],
    faq: [
      {
        question: 'Can I search vehicle history by plate number?',
        answer: 'Yes. Searching by licence plate instantly pulls up every service that vehicle has had at your station, with dates, work done, and parts used.',
      },
      {
        question: 'Does it send SMS to customers automatically?',
        answer: 'Yes. When you mark a job as complete, the system can automatically send a preconfigured SMS to the customer\'s registered number.',
      },
      {
        question: 'Does it work offline?',
        answer: 'Yes. All job card creation, technician assignment, and billing works without internet. SMS notifications queue and send when connectivity returns.',
      },
      {
        question: 'How many technicians can I manage?',
        answer: 'There is no limit. Add all your technicians and see workload distribution at any time.',
      },
      {
        question: 'Can I manage multiple bays or locations?',
        answer: 'Pro plan supports multiple bays with separate queues. Enterprise supports multiple locations from a central dashboard.',
      },
    ],
    pricing: [
      {
        name: 'Standard',
        price: 'LKR 2,200',
        period: '/month',
        description: 'For single-location service stations.',
        features: [
          'Unlimited job cards',
          'Vehicle history',
          'Parts inventory',
          'Up to 10 technicians',
          'Customer SMS',
          'Basic reports',
          'Email support',
        ],
        cta: 'Start free trial',
      },
      {
        name: 'Pro',
        price: 'LKR 4,000',
        period: '/month',
        description: 'For larger workshops and multi-bay stations.',
        features: [
          'Unlimited technicians',
          'Multi-bay management',
          'Advanced analytics',
          'Supplier management',
          'Custom invoice branding',
          'Priority support',
          'Everything in Standard',
        ],
        highlighted: true,
        cta: 'Start free trial',
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For chains and franchise service networks.',
        features: [
          'Multi-location dashboard',
          'Custom integrations',
          'SLA guarantee',
          'Everything in Pro',
        ],
        cta: 'Contact us',
      },
    ],
  },

  sonara: {
    longDescription:
      'Sonara is an AI-powered vocal coaching app that gives anyone — from complete beginners to intermediate singers — a structured, personalised path to developing their voice.',
    customerType: 'Aspiring singers and vocal students',
    problem: {
      heading: 'Vocal coaching is expensive, time-consuming, and not available everywhere.',
      body: 'A good vocal coach in Colombo costs more per session than most people can justify. Outside of the major cities, it\'s even harder to find one. Sonara uses AI to bring real vocal coaching to anyone with a smartphone — listening to your voice, identifying what to work on, and building a practice plan around you.',
    },
    features: [
      {
        iconName: 'pitch',
        title: 'Real-time pitch detection',
        description: 'Sonara listens to your voice as you sing and shows you exactly how close you are to the target note — in real time.',
      },
      {
        iconName: 'exercise',
        title: 'Structured exercise library',
        description: 'Over 150 vocal exercises covering warmups, scales, breath control, vibrato, and stylistic techniques.',
      },
      {
        iconName: 'plan',
        title: 'Personalised practice plans',
        description: 'After your voice assessment, Sonara builds a daily practice plan targeted at your specific weaknesses and goals.',
      },
      {
        iconName: 'progress',
        title: 'Progress tracking',
        description: 'See your pitch accuracy improve over time with visual progress charts. Weekly summaries keep you motivated.',
      },
      {
        iconName: 'voice',
        title: 'Voice type identification',
        description: 'Identifies your voice type — soprano, alto, tenor, baritone, or bass — and tailors all exercises accordingly.',
      },
      {
        iconName: 'offline',
        title: 'Offline practice',
        description: 'Download exercises and songs for offline practice. Perfect for areas with limited connectivity.',
      },
    ],
    steps: [
      { num: '1', title: 'Complete your voice assessment', description: 'Sing a set of reference notes. Sonara identifies your voice type and measures your current range and accuracy.' },
      { num: '2', title: 'Start your daily plan', description: 'Your personalised plan is ready immediately. Warm up, practise scales, and work on your weak areas every day.' },
      { num: '3', title: 'Track your improvement', description: 'Weekly comparisons show how your pitch accuracy and range have grown. Small wins add up fast.' },
      { num: '4', title: 'Unlock advanced techniques', description: 'As you improve, new exercises unlock. Vibrato, belt technique, mixed voice — built into the progression.' },
    ],
    faq: [
      {
        question: 'Do I need any prior singing experience?',
        answer: 'No. Sonara is designed to work with complete beginners. The assessment figures out where you are and builds from there.',
      },
      {
        question: 'What languages does Sonara support?',
        answer: 'The app interface supports Sinhala, Tamil, and English. Exercise songs include Sinhala, Tamil, and English tracks.',
      },
      {
        question: 'Does it work without internet?',
        answer: 'Yes. You can download your daily practice plan and exercise tracks for offline use. Progress syncs when you reconnect.',
      },
      {
        question: 'Is it suitable for children?',
        answer: 'Sonara is suitable for ages 12 and up. Younger learners should use it with parental guidance. Exercises are designed with developing voices in mind.',
      },
      {
        question: 'How is Sonara different from singing game apps?',
        answer: 'Sonara is a coaching tool, not a game. It analyses your voice technically, not just whether you matched the pitch on a fun meter. The feedback is specific — like a real coach.',
      },
    ],
    pricing: [
      {
        name: 'Monthly',
        price: 'LKR 990',
        period: '/month',
        description: 'Flexible monthly access.',
        features: [
          'Full exercise library',
          'AI voice assessment',
          'Personalised plan',
          'Progress tracking',
          'Offline mode',
          '5 songs/month',
        ],
        cta: 'Start free trial',
      },
      {
        name: 'Annual',
        price: 'LKR 7,900',
        period: '/year',
        description: 'Save 33% with annual billing.',
        features: [
          'Everything in Monthly',
          'Unlimited song downloads',
          'Early access to new exercises',
          'Priority support',
        ],
        highlighted: true,
        cta: 'Start free trial',
      },
      {
        name: 'Lifetime',
        price: 'LKR 19,900',
        period: 'one-time',
        description: 'Pay once, use forever.',
        features: [
          'Everything in Annual',
          'All future updates included',
          'No recurring fees',
        ],
        cta: 'Buy lifetime access',
      },
    ],
  },
}

export function getProductDetail(slug: string): ProductDetail | null {
  const base = PRODUCTS.find((p) => p.slug === slug)
  const detail = PRODUCT_DETAILS[slug]
  if (!base || !detail) return null
  return { ...base, ...detail }
}

export function getAllProductDetails(): ProductDetail[] {
  return PRODUCTS.map((p) => ({ ...p, ...PRODUCT_DETAILS[p.slug] })).filter(Boolean) as ProductDetail[]
}
