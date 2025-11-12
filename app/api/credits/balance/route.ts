import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all active credits (COMPLETED status)
    const activeCredits = await prisma.reportCredit.findMany({
      where: {
        userId: session.user.id as string,
        status: 'COMPLETED',
      },
      include: {
        usedCredits: true,
      },
    })

    // Calculate total credits and used credits
    let totalCredits = 0
    let usedCredits = 0

    activeCredits.forEach((credit) => {
      totalCredits += credit.credits
      usedCredits += credit.usedCredits.length
    })

    const availableCredits = totalCredits - usedCredits

    return NextResponse.json({
      totalCredits,
      usedCredits,
      availableCredits: Math.max(0, availableCredits),
      credits: activeCredits.map((credit) => ({
        id: credit.id,
        packType: credit.packType,
        totalCredits: credit.credits,
        usedCredits: credit.usedCredits.length,
        availableCredits: credit.credits - credit.usedCredits.length,
        purchasedAt: credit.purchasedAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching credit balance:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

