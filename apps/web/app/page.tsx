import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'Thraive Labs — Business Software Built for Sri Lanka',
  description:
    'Offline-first, privacy-first business software for Sri Lankan restaurants, pharmacies, retailers, and service businesses. Built locally, priced locally.',
  openGraph: {
    title: 'Thraive Labs — Business Software Built for Sri Lanka',
    description: 'Offline-first POS, pharmacy, route management, and AI productivity software made for Sri Lankan businesses.',
    type: 'website',
  },
}
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import StatementSection from '@/components/home/StatementSection'
import ProductsSection from '@/components/home/ProductsSection'
import ProblemSection from '@/components/home/ProblemSection'
import ValuesSection from '@/components/home/ValuesSection'
import StatsSection from '@/components/home/StatsSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import ClosingSection from '@/components/home/ClosingSection'
import SeasonalDivider from '@/components/ui/SeasonalDivider'

export default function Home() {
  return (
    <>
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <StatementSection />
        <ProductsSection />
        <div style={{ padding: '0 24px' }}>
          <SeasonalDivider />
        </div>
        <ProblemSection />
        <ValuesSection />
        <StatsSection />
        <HowItWorksSection />
        <div style={{ padding: '0 24px' }}>
          <SeasonalDivider />
        </div>
        <TestimonialsSection />
        <ClosingSection />
      </main>
      <Footer />
    </>
  )
}
