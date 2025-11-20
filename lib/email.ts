// Email utility - simplified version without actual email sending
// For now, we just log the reset URL. Email sending can be added later if needed.

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
  
  // For now, just log the reset URL
  // In production, you would integrate with an email service (SendGrid, AWS SES, etc.)
  console.log('Password reset requested for:', email)
  console.log('Reset URL:', resetUrl)
  
  // Return success - the URL is logged for manual use or can be displayed to user
  return { success: true, resetUrl }
}

