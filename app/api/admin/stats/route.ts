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

    // Get today's date range (start of today to now)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

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

    // Get today's statistics
    const [
      usersToday,
      reportsToday,
      creditsToday,
      purchasesToday,
      revenueToday,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      prisma.report.count({
        where: {
          generatedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      prisma.reportCredit.count({
        where: {
          status: 'COMPLETED',
          purchasedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      prisma.purchase.count({
        where: {
          status: 'COMPLETED',
          purchasedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      prisma.reportCredit.aggregate({
        where: {
          status: 'COMPLETED',
          purchasedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        _sum: {
          amount: true,
        },
      }),
    ])

    // Calculate total revenue
    const creditRevenue = creditsForRevenue.reduce((sum, credit) => sum + credit.amount, 0)
    const purchaseRevenue = purchasesForRevenue.reduce((sum, purchase) => sum + purchase.amount, 0)
    const totalRevenue = creditRevenue + purchaseRevenue
    const totalCredits = creditsForRevenue.reduce((sum, credit) => sum + credit.credits, 0)
    
    // Calculate today's revenue
    const todayCreditRevenue = revenueToday._sum.amount || 0
    const todayPurchaseRevenue = await prisma.purchase.aggregate({
      where: {
        status: 'COMPLETED',
        purchasedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      _sum: {
        amount: true,
      },
    })
    const todayRevenue = todayCreditRevenue + (todayPurchaseRevenue._sum.amount || 0)

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
    }).catch((err) => {
      console.error('Error fetching users:', err)
      return []
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
    }).catch((err) => {
      console.error('Error fetching reports:', err)
      return []
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
    }).catch((err) => {
      console.error('Error fetching credits:', err)
      return []
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

    const response = {
      totalUsers,
      totalReports,
      totalRevenue,
      totalCredits,
      // Today's statistics
      usersToday,
      reportsToday,
      creditsToday,
      purchasesToday,
      revenueToday: todayRevenue,
      // Recent data for overview
      recentUsers: allUsers.slice(0, 10),
      recentCredits: allCredits.slice(0, 10),
      recentPurchases: allPurchases.slice(0, 10),
      // Full lists for tables
      allUsers,
      allReports,
      allCredits,
      allPurchases,
    }

    console.log('[Admin Stats API] Returning data:', {
      totalUsers: response.totalUsers,
      totalReports: response.totalReports,
      totalRevenue: response.totalRevenue,
      usersCount: response.allUsers.length,
      reportsCount: response.allReports.length,
      creditsCount: response.allCredits.length,
      purchasesCount: response.allPurchases.length,
    })

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error fetching admin stats:', error)
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    })
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 }
    )
  }
}

