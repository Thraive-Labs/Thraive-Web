import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getAllProductDetails } from '@/lib/product-details'
import ProductsClient from '@/components/products/ProductsClient'

export const metadata: Metadata = {
  title: 'Products — Thraive Labs',
  description:
    'A complete suite of business software built for Sri Lankan businesses. POS, pharmacy, restaurant, delivery, field service, and fitness management.',
}

export default function ProductsPage() {
  const products = getAllProductDetails()

  return (
    <>
      <Navbar />
      <main id="main-content">
        <ProductsClient products={products} />
      </main>
      <Footer />
    </>
  )
}
