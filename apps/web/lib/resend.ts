import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@thraive.com'

const PRODUCT_NAMES: Record<string, string> = {
  wildcafe:  'WildCafe POS',
  smartpos:  'SmartPOS',
  pharmacy:  'Pharmacy POS',
  routeflow: 'RouteFlow',
  autoserv:  'AutoServ',
  sonara:    'Sonara',
}

interface LicenseEmailParams {
  to: string
  product: string
  plan: string
  licenseKey: string
  downloadUrl: string
  portalUrl: string
}

export async function sendLicenseEmail(params: LicenseEmailParams) {
  const { to, product, plan, licenseKey, downloadUrl, portalUrl } = params
  const productName = PRODUCT_NAMES[product] ?? product

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Your ${productName} license is ready`,
    text: [
      `Your purchase is confirmed. Here is everything you need to get started.`,
      ``,
      `LICENSE KEY`,
      licenseKey,
      ``,
      `DOWNLOAD`,
      downloadUrl,
      ``,
      `ACTIVATE`,
      `1. Install the software using the downloaded installer`,
      `2. Open the app — you will be prompted to enter your license key`,
      `3. Enter the key above and click Activate`,
      `4. You are ready to go`,
      ``,
      `Manage your license anytime at ${portalUrl}`,
      ``,
      `Questions? Reply to this email or contact support@thraive.com`,
      ``,
      `Thraive Labs`,
    ].join('\n'),
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#111">
        <h2 style="margin:0 0 8px;font-size:22px">Your ${productName} license is ready</h2>
        <p style="color:#555;margin:0 0 28px">Your purchase is confirmed. Here is everything you need to get started.</p>

        <div style="background:#f5f5f5;border-radius:8px;padding:16px 20px;margin-bottom:28px">
          <p style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#888;margin:0 0 8px">License Key — ${plan} plan</p>
          <code style="font-family:monospace;font-size:18px;font-weight:700;color:#111;letter-spacing:0.04em">${licenseKey}</code>
        </div>

        <p style="font-weight:700;margin:0 0 8px">Download &amp; Activate</p>
        <ol style="margin:0 0 24px;padding-left:20px;color:#555;line-height:1.8">
          <li>Download from <a href="${downloadUrl}" style="color:#7C3AED">${downloadUrl}</a></li>
          <li>Install and open the app</li>
          <li>Enter your license key when prompted</li>
        </ol>

        <p style="color:#888;font-size:13px">
          Manage your license at <a href="${portalUrl}" style="color:#7C3AED">${portalUrl}</a><br>
          Questions? <a href="mailto:support@thraive.com" style="color:#7C3AED">support@thraive.com</a>
        </p>

        <p style="color:#bbb;font-size:12px;margin-top:32px">Thraive Labs</p>
      </div>
    `,
  })
}

interface PaymentFailedParams {
  to: string
  product: string
  gracePeriodEnd: string
  portalUrl: string
}

export async function sendPaymentFailedEmail(params: PaymentFailedParams) {
  const { to, product, gracePeriodEnd, portalUrl } = params
  const productName = PRODUCT_NAMES[product] ?? product

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Action needed: payment failed for ${productName}`,
    text: [
      `We could not process your subscription payment for ${productName}.`,
      `Your access will continue until ${gracePeriodEnd} while you update your payment method.`,
      ``,
      `Update your payment method at: ${portalUrl}`,
      ``,
      `Questions? support@thraive.com`,
      ``,
      `Thraive Labs`,
    ].join('\n'),
  })
}

interface RenewalReminderParams {
  to: string
  product: string
  renewalDate: string
  amount: string
  portalUrl: string
}

export async function sendRenewalReminderEmail(params: RenewalReminderParams) {
  const { to, product, renewalDate, amount, portalUrl } = params
  const productName = PRODUCT_NAMES[product] ?? product

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Your ${productName} subscription renews in 7 days`,
    text: [
      `Your ${productName} subscription renews on ${renewalDate} for ${amount}.`,
      ``,
      `To cancel or update your payment method: ${portalUrl}`,
      ``,
      `Questions? support@thraive.com`,
      ``,
      `Thraive Labs`,
    ].join('\n'),
  })
}
