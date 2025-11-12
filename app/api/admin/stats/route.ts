import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('[Admin Stats] Starting request...')
    const session = await auth()
    console.log('[Admin Stats] Session:', session?.user?.id ? 'Authenticated' : 'Not authenticated')

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    console.log('[Admin Stats] Checking admin role...')
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { role: true },
    })
    console.log('[Admin Stats] User role:', user?.role)

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    console.log('[Admin Stats] Admin verified, fetching data...')

    // Get today's date range (start of today to now)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get total counts
    console.log('[Admin Stats] Fetching total counts...')
    const [totalUsers, totalReports, creditsForRevenue, purchasesForRevenue] = await Promise.all([
      prisma.user.count().catch((err) => {
        console.error('[Admin Stats] Error counting users:', err)
        return 0
      }),
      prisma.report.count().catch((err) => {
        console.error('[Admin Stats] Error counting reports:', err)
        return 0
      }),
      prisma.reportCredit.findMany({
        where: { status: 'COMPLETED' },
        select: { credits: true, amount: true },
      }).catch((err) => {
        console.error('[Admin Stats] Error fetching credits:', err)
        return []
      }),
      prisma.purchase.findMany({
        where: { status: 'COMPLETED' },
        select: { amount: true },
      }).catch((err) => {
        console.error('[Admin Stats] Error fetching purchases:', err)
        return []
      }),
    ])
    console.log('[Admin Stats] Total counts fetched:', { totalUsers, totalReports })

    // Get today's statistics
    console.log('[Admin Stats] Fetching today\'s statistics...')
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
      }).catch((err) => {
        console.error('[Admin Stats] Error counting users today:', err)
        return 0
      }),
      prisma.report.count({
        where: {
          generatedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }).catch((err) => {
        console.error('[Admin Stats] Error counting reports today:', err)
        return 0
      }),
      prisma.reportCredit.count({
        where: {
          status: 'COMPLETED',
          purchasedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }).catch((err) => {
        console.error('[Admin Stats] Error counting credits today:', err)
        return 0
      }),
      prisma.purchase.count({
        where: {
          status: 'COMPLETED',
          purchasedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }).catch((err) => {
        console.error('[Admin Stats] Error counting purchases today:', err)
        return 0
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
      }).catch((err) => {
        console.error('[Admin Stats] Error aggregating revenue today:', err)
        return { _sum: { amount: null } }
      }),
    ])
    console.log('[Admin Stats] Today\'s stats fetched')

    // Calculate total revenue
    const creditRevenue = creditsForRevenue.reduce((sum, credit) => sum + credit.amount, 0)
    const purchaseRevenue = purchasesForRevenue.reduce((sum, purchase) => sum + purchase.amount, 0)
    const totalRevenue = creditRevenue + purchaseRevenue
    const totalCredits = creditsForRevenue.reduce((sum, credit) => sum + credit.credits, 0)
    
    // Calculate today's revenue
    console.log('[Admin Stats] Calculating today\'s revenue...')
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
    }).catch((err) => {
      console.error('[Admin Stats] Error aggregating purchase revenue today:', err)
      return { _sum: { amount: null } }
    })
    const todayRevenue = todayCreditRevenue + (todayPurchaseRevenue._sum.amount || 0)
    console.log('[Admin Stats] Today\'s revenue calculated:', todayRevenue)

    // Get recent users (last 10)
    console.log('[Admin Stats] Fetching recent users...')
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
    }).catch((err) => {
      console.error('[Admin Stats] Error fetching recent users:', err)
      return []
    })

    // Get recent credit purchases (last 10)
    console.log('[Admin Stats] Fetching recent credits...')
    let recentCredits = []
    try {
      recentCredits = await prisma.reportCredit.findMany({
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
    } catch (err: any) {
      console.error('[Admin Stats] Error fetching recent credits:', err.message)
      recentCredits = []
    }

    // Get all users (for users table)
    console.log('[Admin Stats] Fetching all users...')
    let allUsers = []
    try {
      allUsers = await prisma.user.findMany({
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
      console.log('[Admin Stats] Fetched', allUsers.length, 'users')
    } catch (err: any) {
      console.error('[Admin Stats] Error fetching users:', err.message)
      // Try without _count if that's the issue
      try {
        allUsers = await prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        })
        // Add empty _count for compatibility
        allUsers = allUsers.map(u => ({
          ...u,
          _count: { purchasedReports: 0, reportCredits: 0 },
        }))
        console.log('[Admin Stats] Fetched users without _count')
      } catch (err2: any) {
        console.error('[Admin Stats] Error fetching users (fallback):', err2.message)
        allUsers = []
      }
    }

    // Get all reports (for reports table)
    console.log('[Admin Stats] Fetching all reports...')
    let allReports = []
    try {
      allReports = await prisma.report.findMany({
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
      console.log('[Admin Stats] Fetched', allReports.length, 'reports')
    } catch (err: any) {
      console.error('[Admin Stats] Error fetching reports:', err.message)
      // Try without _count if that's the issue
      try {
        allReports = await prisma.report.findMany({
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
          },
        })
        // Add empty _count for compatibility
        allReports = allReports.map(r => ({
          ...r,
          _count: { purchases: 0 },
        }))
        console.log('[Admin Stats] Fetched reports without _count')
      } catch (err2: any) {
        console.error('[Admin Stats] Error fetching reports (fallback):', err2.message)
        allReports = []
      }
    }

    // Get all credit purchases (for revenue table)
    console.log('[Admin Stats] Fetching all credits...')
    let allCredits = []
    try {
      allCredits = await prisma.reportCredit.findMany({
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
      console.log('[Admin Stats] Fetched', allCredits.length, 'credits')
    } catch (err: any) {
      console.error('[Admin Stats] Error fetching credits:', err.message)
      allCredits = []
    }

    // Get all purchases (for revenue table)
    console.log('[Admin Stats] Fetching all purchases...')
    let allPurchases = []
    try {
      allPurchases = await prisma.purchase.findMany({
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
      console.log('[Admin Stats] Fetched', allPurchases.length, 'purchases')
    } catch (err: any) {
      console.error('[Admin Stats] Error fetching purchases:', err.message)
      allPurchases = []
    }

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
      recentCredits: recentCredits,
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
      usersToday: response.usersToday,
      reportsToday: response.reportsToday,
      revenueToday: response.revenueToday,
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

