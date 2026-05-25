import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587')

const transporter = SMTP_HOST
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    })
  : undefined

export type SendMailOptions = {
  to: string
  subject: string
  text?: string
  html?: string
}

export async function sendMail(options: SendMailOptions): Promise<boolean> {
  const from = process.env.SMTP_FROM || 'noreply@localhost'

  if (!transporter) {
    throw new Error('transporter is not configured')
  }

  await transporter.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  })

  return true
}
