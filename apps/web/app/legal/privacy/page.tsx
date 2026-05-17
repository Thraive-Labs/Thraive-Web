import type { Metadata } from 'next'
import LegalLayout from '@/components/legal/LegalLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy — Thraive Labs',
}

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="17 May 2026">
      <h2>1. Introduction</h2>
      <p>
        Thraive Labs is a software company based in Sri Lanka that builds business management software
        for restaurants, pharmacies, retailers, and other industries. This Privacy Policy explains how
        we collect, use, and protect information when you use our website at thraive.com and our
        software products.
      </p>
      <p>
        If you have any questions or concerns about this policy, please contact us at{' '}
        <a href="mailto:privacy@thraive.com">privacy@thraive.com</a>.
      </p>

      <h2>2. Information We Collect</h2>
      <p>When you create an account or purchase a license, we collect:</p>
      <ul>
        <li>Account information — your name, email address, and a hashed password</li>
        <li>License and billing data — the products you have purchased, your plan tier, and purchase dates</li>
        <li>Usage data — anonymized, aggregate analytics about how our website is used</li>
      </ul>
      <p>We do <strong>not</strong> collect or have access to:</p>
      <ul>
        <li>Your business data (customers, sales records, inventory) — this stays on your device</li>
        <li>Your customers&#39; personal data processed by our software</li>
        <li>Transaction records stored by our desktop or mobile applications</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide and maintain your account and licenses</li>
        <li>Deliver software updates and manage license keys</li>
        <li>Send transactional emails such as purchase receipts and license expiry reminders</li>
        <li>Improve our products using anonymized, aggregate data only</li>
      </ul>
      <p>
        We never sell your personal data to third parties, and we never use your data for advertising purposes.
      </p>

      <h2>4. Data Storage and Security</h2>
      <p>
        Your account data is stored securely in Supabase, a managed database provider with industry-standard
        security practices. Payment data is handled exclusively by Stripe — we never store your card
        details or payment credentials. Software data created by our applications stays on your device;
        we cannot access it remotely.
      </p>
      <p>
        All data in transit is encrypted using TLS. Data at rest is encrypted by our storage providers.
      </p>

      <h2>5. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Correct inaccurate data in your account</li>
        <li>Delete your account and all associated data</li>
        <li>Export your account data in a portable format</li>
      </ul>
      <p>
        To exercise any of these rights, please contact us at{' '}
        <a href="mailto:privacy@thraive.com">privacy@thraive.com</a>.
      </p>

      <h2>6. Cookies</h2>
      <p>
        We use only essential cookies for session management — to keep you signed in to your account.
        We do not use tracking cookies, advertising cookies, or any third-party analytics cookies.
      </p>
      <p>
        Your dark mode preference is stored in your browser&#39;s localStorage (not a cookie) and never
        transmitted to our servers.
      </p>

      <h2>7. Third-Party Services</h2>
      <p>We use the following third-party services to operate our platform. Each has its own privacy policy:</p>
      <ul>
        <li>
          <strong>Supabase</strong> — database and authentication
        </li>
        <li>
          <strong>Stripe</strong> — payment processing
        </li>
        <li>
          <strong>Resend</strong> — transactional email delivery
        </li>
        <li>
          <strong>Vercel</strong> — website and application hosting
        </li>
        <li>
          <strong>GitHub</strong> — software distribution for licensed updates
        </li>
      </ul>

      <h2>8. Children</h2>
      <p>
        Our services are not directed at children under the age of 13. We do not knowingly collect
        personal information from children. If you believe a child has provided us with personal data,
        please contact us at <a href="mailto:privacy@thraive.com">privacy@thraive.com</a> and we will
        promptly delete it.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        If we make material changes to this Privacy Policy, we will notify you by email before the
        changes take effect. Minor or clarifying changes may be made at any time. The date of the
        most recent update is always shown at the top of this page.
      </p>

      <h2>10. Contact</h2>
      <p>
        For any privacy-related questions or requests, please contact us:
      </p>
      <ul>
        <li>
          Email: <a href="mailto:privacy@thraive.com">privacy@thraive.com</a>
        </li>
        <li>Thraive Labs, Sri Lanka</li>
      </ul>
    </LegalLayout>
  )
}
