import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getAllProductDetails, getProductDetail } from '@/lib/product-details'
import ProductHero from '@/components/product/ProductHero'
import ProductProblem from '@/components/product/ProductProblem'
import ProductFeatures from '@/components/product/ProductFeatures'
import ProductHowItWorks from '@/components/product/ProductHowItWorks'
import ProductPricing from '@/components/product/ProductPricing'
import ProductFAQ from '@/components/product/ProductFAQ'
import ProductCTA from '@/components/product/ProductCTA'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllProductDetails().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProductDetail(slug)
  if (!product) return {}
  return {
    title: `${product.name} — Thraive Labs`,
    description: product.longDescription,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProductDetail(slug)
  if (!product) notFound()

  return (
    <>
      <Navbar />
      <main id="main-content">
        <ProductHero product={product} />
        <ProductProblem product={product} />
        <ProductFeatures product={product} />
        <ProductHowItWorks product={product} />
        <ProductPricing product={product} />
        <ProductFAQ product={product} />
        <ProductCTA product={product} />
      </main>
      <Footer />
    </>
  )
}
