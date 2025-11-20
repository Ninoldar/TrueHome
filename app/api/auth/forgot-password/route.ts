import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive'
        }
      }
    })

    // Always return success to prevent email enumeration
    // Don't reveal whether the email exists or not
    if (!user) {
      return NextResponse.json({ 
        message: 'If an account exists with that email, a password reset link has been sent.' 
      })
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

    // Delete any existing reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id }
    })

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt,
      }
    })

    // Generate reset URL (email sending disabled for now)
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    
    // Log the reset URL (in production, this would send an email)
    await sendPasswordResetEmail(user.email, resetToken)
    console.log(`Password reset URL for ${user.email}: ${resetUrl}`)

    return NextResponse.json({ 
      message: 'If an account exists with that email, a password reset link has been sent.' 
    })
  } catch (error) {
    console.error('Error processing forgot password request:', error)
    return NextResponse.json(
      { error: 'Failed to process request. Please try again later.' },
      { status: 500 }
    )
  }
}

