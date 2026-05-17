import type { Metadata } from 'next'
import BlogClient from './BlogClient'

export const metadata: Metadata = {
  title: 'Blog — Thraive Labs',
}

export default function BlogPage() {
  return <BlogClient />
}
