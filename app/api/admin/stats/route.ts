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
    const [totalUsers, totalReports, allCredits, allPurchases] = await Promise.all([
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
    const creditRevenue = allCredits.reduce((sum, credit) => sum + credit.amount, 0)
    const purchaseRevenue = allPurchases.reduce((sum, purchase) => sum + purchase.amount, 0)
    const totalRevenue = creditRevenue + purchaseRevenue
    const totalCredits = allCredits.reduce((sum, credit) => sum + credit.credits, 0)

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

    // Get recent purchases (last 10)
    const recentPurchases = await prisma.purchase.findMany({
      take: 10,
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
      recentUsers,
      recentCredits,
      recentPurchases,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

