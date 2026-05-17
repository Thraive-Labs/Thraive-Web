import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AboutHero from '@/components/about/AboutHero'
import AboutMission from '@/components/about/AboutMission'
import AboutValues from '@/components/about/AboutValues'
import AboutTeam from '@/components/about/AboutTeam'

export const metadata: Metadata = {
  title: 'About — Thraive Labs',
  description:
    'Thraive Labs is a Sri Lanka-based software company building practical business software for restaurants, pharmacies, retailers, and more.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <AboutHero />
        <AboutMission />
        <AboutValues />
        <AboutTeam />
      </main>
      <Footer />
    </>
  )
}
