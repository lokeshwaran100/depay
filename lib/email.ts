import { Resend } from 'resend'

// Lazy initialization to avoid build errors when API key is not set
let resend: Resend | null = null

function getResendClient(): Resend {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured')
    }
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'DePay <onboarding@resend.dev>'

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const client = getResendClient()
    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    })

    if (error) {
      console.error('Failed to send email:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Email service error:', error)
    throw error
  }
}

// Email Templates
export function paymentReceivedEmail(senderName: string, amount: string) {
  return {
    subject: `You received $${amount} USDC on DePay 💸`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .container { max-width: 500px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px; }
          .amount { font-size: 36px; font-weight: bold; color: #10b981; text-align: center; margin: 16px 0; }
          .cta { display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💸 Payment Received!</h1>
          </div>
          <div class="content">
            <p>Great news! <strong>${senderName}</strong> just sent you:</p>
            <div class="amount">$${amount} USDC</div>
            <p>The funds are now available in your DePay wallet.</p>
            <center>
              <a href="${process.env.NEXTAUTH_URL}" class="cta">View Dashboard</a>
            </center>
          </div>
          <div class="footer">
            <p>DePay - Crypto payments as easy as email</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }
}

export function paymentSentEmail(recipientEmail: string, amount: string) {
  return {
    subject: `Payment of $${amount} USDC sent successfully ✅`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .container { max-width: 500px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px; }
          .amount { font-size: 36px; font-weight: bold; color: #ef4444; text-align: center; margin: 16px 0; }
          .recipient { background: white; padding: 12px; border-radius: 8px; text-align: center; margin: 16px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Payment Sent!</h1>
          </div>
          <div class="content">
            <p>Your payment has been successfully processed.</p>
            <div class="amount">-$${amount} USDC</div>
            <div class="recipient">
              <p style="margin: 0; color: #6b7280;">Sent to</p>
              <p style="margin: 4px 0 0 0; font-weight: bold;">${recipientEmail}</p>
            </div>
          </div>
          <div class="footer">
            <p>DePay - Crypto payments as easy as email</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }
}

export function inviteUserEmail(senderName: string, amount: string, inviteLink: string) {
  return {
    subject: `${senderName} wants to send you $${amount} USDC on DePay! 🎉`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .container { max-width: 500px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px; }
          .amount { font-size: 36px; font-weight: bold; color: #10b981; text-align: center; margin: 16px 0; }
          .cta { display: inline-block; background: #f59e0b; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; margin-top: 16px; font-weight: bold; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 You've Got Money Waiting!</h1>
          </div>
          <div class="content">
            <p><strong>${senderName}</strong> wants to send you:</p>
            <div class="amount">$${amount} USDC</div>
            <p>Sign up for DePay to receive your funds instantly. It only takes a few seconds!</p>
            <center>
              <a href="${inviteLink}" class="cta">Claim Your Payment</a>
            </center>
            <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
              DePay lets you send and receive crypto payments using just an email address. No wallet addresses, no complexity.
            </p>
          </div>
          <div class="footer">
            <p>DePay - Crypto payments as easy as email</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }
}

export function welcomeEmail(userName: string) {
  return {
    subject: `Welcome to DePay! 🚀`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .container { max-width: 500px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px; }
          .feature { display: flex; align-items: center; margin: 16px 0; }
          .feature-icon { font-size: 24px; margin-right: 12px; }
          .cta { display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to DePay! 🚀</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${userName}</strong>,</p>
            <p>Your DePay account is ready! We've automatically created a secure crypto wallet for you.</p>
            <h3>What you can do:</h3>
            <div class="feature">
              <span class="feature-icon">📧</span>
              <span>Send USDC to anyone with just their email</span>
            </div>
            <div class="feature">
              <span class="feature-icon">💰</span>
              <span>Deposit USDC via QR code or wallet address</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🔒</span>
              <span>No private keys to manage - we handle security</span>
            </div>
            <center style="margin-top: 24px;">
              <a href="${process.env.NEXTAUTH_URL}" class="cta">Go to Dashboard</a>
            </center>
          </div>
          <div class="footer">
            <p>DePay - Crypto payments as easy as email</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }
}
