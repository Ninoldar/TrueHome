import nodemailer from 'nodemailer'

// Create a reusable transporter
// In production, configure with your email service (Gmail, SendGrid, etc.)
const createTransporter = () => {
  // For development, you can use a test account or configure with real credentials
  // Example for Gmail: https://nodemailer.com/usage/using-gmail/
  // Example for SendGrid: https://nodemailer.com/transports/sendgrid/
  
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }
  
  // Fallback: Use a test account (for development only)
  // In production, you MUST configure SMTP settings
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'test@ethereal.email',
      pass: 'test',
    },
  })
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const transporter = createTransporter()
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@truehome.com',
    to: email,
    subject: 'Reset Your Password - TrueHome',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Reset Your Password</h1>
            <p>You requested to reset your password for your TrueHome account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
      Reset Your Password - TrueHome
      
      You requested to reset your password for your TrueHome account.
      
      Click this link to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
    `,
  }
  
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Password reset email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    // In development, log the reset URL instead of failing
    if (process.env.NODE_ENV === 'development') {
      console.log('DEV MODE: Password reset URL:', resetUrl)
      return { success: true, devMode: true, resetUrl }
    }
    throw error
  }
}

