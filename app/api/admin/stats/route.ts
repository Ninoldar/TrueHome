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

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { role: true },
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Get total counts
    const [totalUsers, totalReports, creditsForRevenue, purchasesForRevenue] = await Promise.all([
      prisma.user.count(),
      prisma.report.count(),
      prisma.reportCredit.findMany({
        where: { status: 'COMPLETED' },
        select: { credits: true, amount: true },
      }),
      prisma.purchase.findMany({
        where: { status: 'COMPLETED' },
        select: { amount: true },
      }),
    ])

    // Calculate total revenue
    const creditRevenue = creditsForRevenue.reduce((sum, credit) => sum + credit.amount, 0)
    const purchaseRevenue = purchasesForRevenue.reduce((sum, purchase) => sum + purchase.amount, 0)
    const totalRevenue = creditRevenue + purchaseRevenue
    const totalCredits = creditsForRevenue.reduce((sum, credit) => sum + credit.credits, 0)

    // Get recent users (last 10)
    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            purchasedReports: true,
            reportCredits: true,
          },
        },
      },
    })

    // Get recent credit purchases (last 10)
    const recentCredits = await prisma.reportCredit.findMany({
      take: 10,
      where: { status: 'COMPLETED' },
      orderBy: { purchasedAt: 'desc' },
      select: {
        id: true,
        credits: true,
        packType: true,
        amount: true,
        purchasedAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Get all users (for users table)
    const allUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            purchasedReports: true,
            reportCredits: true,
          },
        },
      },
    })

    // Get all reports (for reports table)
    const allReports = await prisma.report.findMany({
      orderBy: { generatedAt: 'desc' },
      select: {
        id: true,
        reportNumber: true,
        generatedAt: true,
        price: true,
        status: true,
        property: {
          select: {
            address: true,
            city: true,
            state: true,
            zipCode: true,
          },
        },
        _count: {
          select: {
            purchases: true,
          },
        },
      },
    })

    // Get all credit purchases (for revenue table)
    const allCredits = await prisma.reportCredit.findMany({
      where: { status: 'COMPLETED' },
      orderBy: { purchasedAt: 'desc' },
      select: {
        id: true,
        credits: true,
        packType: true,
        amount: true,
        purchasedAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Get all purchases (for revenue table)
    const allPurchases = await prisma.purchase.findMany({
      where: { status: 'COMPLETED' },
      orderBy: { purchasedAt: 'desc' },
      select: {
        id: true,
        amount: true,
        purchasedAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        report: {
          select: {
            reportNumber: true,
            property: {
              select: {
                address: true,
                city: true,
                state: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      totalUsers,
      totalReports,
      totalRevenue,
      totalCredits,
      recentUsers: allUsers.slice(0, 10), // Keep recent for overview
      recentCredits: allCredits.slice(0, 10), // Keep recent for overview
      recentPurchases: allPurchases.slice(0, 10), // Keep recent for overview
      allUsers, // Full list for users table
      allReports, // Full list for reports table
      allCredits, // Full list for credits
      allPurchases, // Full list for purchases
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

