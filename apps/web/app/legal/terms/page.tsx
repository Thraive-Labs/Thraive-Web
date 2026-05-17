import type { Metadata } from 'next'
import LegalLayout from '@/components/legal/LegalLayout'

export const metadata: Metadata = {
  title: 'Terms of Service — Thraive Labs',
}

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="17 May 2026">
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using any Thraive Labs website, software product, or customer portal, you agree
        to be bound by these Terms of Service. If you do not agree to these terms, please do not use
        our services.
      </p>

      <h2>2. Description of Services</h2>
      <p>
        Thraive Labs provides business management software products licensed for use by businesses and
        individuals. These products are desktop and mobile applications. We also provide a customer
        portal at app.thraive.com for managing your licenses, downloading software, and managing billing.
      </p>

      <h2>3. License Grant</h2>
      <p>
        Upon purchasing a license, Thraive Labs grants you a personal, non-transferable, non-exclusive
        license to use the software as follows:
      </p>
      <ul>
        <li>
          <strong>Starter plan:</strong> Installation on up to the device limit specified in your plan,
          for personal or single-business use.
        </li>
        <li>
          <strong>Business plan:</strong> Installation on up to N devices across your organization,
          as specified at the time of purchase.
        </li>
        <li>
          <strong>One-time license:</strong> A perpetual license to the version purchased, including
          software updates for one year from the purchase date.
        </li>
        <li>
          <strong>Subscription license:</strong> Access to the software and all updates for as long
          as your subscription remains active.
        </li>
      </ul>

      <h2>4. Restrictions</h2>
      <p>You may not:</p>
      <ul>
        <li>Resell, sublicense, or redistribute the software or your license key</li>
        <li>
          Reverse engineer, decompile, or disassemble the software, except to the extent permitted by
          applicable law
        </li>
        <li>Use the software for any illegal purpose or in violation of any applicable law</li>
        <li>Share your license key publicly or transfer it to another person or organization</li>
      </ul>

      <h2>5. Payment Terms</h2>
      <p>
        All prices are displayed in Sri Lankan Rupees (LKR). Subscription plans auto-renew
        automatically at the end of each billing period until you cancel.
      </p>
      <p>
        <strong>Refund policy:</strong> We offer a full refund within 7 days of purchase if the
        software does not function as described. Refund requests must be submitted to{' '}
        <a href="mailto:support@thraive.com">support@thraive.com</a>. Refunds are not available after
        7 days from the original purchase date, or for subscription renewals that have already been
        processed.
      </p>

      <h2>6. Updates and Support</h2>
      <p>
        Software updates are provided during the active license period (one year for one-time licenses,
        ongoing for active subscriptions). Support is available via{' '}
        <a href="mailto:support@thraive.com">support@thraive.com</a>. We aim to respond to all support
        requests within 2 business days, though response times are not guaranteed.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        All software, trademarks, service marks, logos, and content produced by Thraive Labs remain the
        exclusive property of Thraive Labs. Your data — including any business data you create or store
        using our software — belongs to you.
      </p>

      <h2>8. Privacy</h2>
      <p>
        Your use of our services is also governed by our{' '}
        <a href="/legal/privacy">Privacy Policy</a>, which is incorporated into these Terms by
        reference. Please review it carefully.
      </p>

      <h2>9. Disclaimer of Warranties</h2>
      <p>
        The software is provided &quot;as is&quot; without warranties of any kind, express or implied.
        Thraive Labs does not guarantee that the software will be error-free, uninterrupted, or free
        of security vulnerabilities. We are not liable for any loss of data — you are responsible for
        maintaining your own backups.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by applicable law, Thraive Labs&#39; total liability to you for
        any claim arising from or related to these Terms or our services is limited to the total amount
        you paid to Thraive Labs in the twelve months preceding the claim.
      </p>

      <h2>11. Termination</h2>
      <p>
        Thraive Labs reserves the right to suspend or terminate your account if you violate these
        Terms of Service. You may close your account at any time by contacting us at{' '}
        <a href="mailto:support@thraive.com">support@thraive.com</a>. Upon termination, your license
        to use the software will end.
      </p>

      <h2>12. Governing Law</h2>
      <p>
        These Terms of Service are governed by and construed in accordance with the laws of Sri Lanka.
        Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the
        courts of Sri Lanka.
      </p>

      <h2>13. Changes to These Terms</h2>
      <p>
        If we make material changes to these Terms, we will notify you by email before the changes take
        effect. Your continued use of our services after the effective date constitutes your acceptance
        of the updated Terms.
      </p>

      <h2>14. Contact</h2>
      <p>For legal inquiries or questions about these Terms, please contact us:</p>
      <ul>
        <li>
          Email: <a href="mailto:legal@thraive.com">legal@thraive.com</a>
        </li>
        <li>Thraive Labs, Sri Lanka</li>
      </ul>
    </LegalLayout>
  )
}
