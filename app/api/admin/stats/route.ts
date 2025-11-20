import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin (case-insensitive)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    })

    console.log('[AdminStats] User role from DB:', user?.role)
    console.log('[AdminStats] Session user role:', session.user.role)

    if (!user || user.role?.toLowerCase() !== 'admin') {
      console.log('[AdminStats] User is not admin, returning 403')
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Get today's date range
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Fetch stats
    const [
      totalUsers,
      todaySignups,
      totalReports,
      todayReports,
      recentUsers,
      recentReports
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      prisma.report.count(),
      prisma.report.count({
        where: {
          generatedAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true
        }
      }),
      prisma.report.findMany({
        take: 10,
        orderBy: { generatedAt: 'desc' },
        select: {
          id: true,
          propertyId: true,
          generatedAt: true
        }
      })
    ])

    // Calculate revenue (placeholder - should query from ReportCredit/CreditUsage when schema is updated)
    const totalRevenue = 0
    const todayRevenue = 0

    return NextResponse.json({
      totalUsers,
      totalReports,
      totalRevenue,
      todaySignups,
      todayReports,
      todayRevenue,
      recentUsers,
      recentReports
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
}

