import { Resend } from 'resend'
import { NextResponse } from 'next/server'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

const SUBJECT_LABELS: Record<string, string> = {
  sales: 'Sales enquiry',
  support: 'Technical support',
  partnership: 'Partnership',
  other: 'Other',
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { name, email, subject, message } = body as Record<string, string>

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const subjectLabel = SUBJECT_LABELS[subject] ?? subject

  try {
    await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'noreply@thraive.com',
      to: 'support@thraive.com',
      replyTo: email,
      subject: `[Contact] ${subjectLabel} — ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subjectLabel}`,
        '',
        message,
      ].join('\n'),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
