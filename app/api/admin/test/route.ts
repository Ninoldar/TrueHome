import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('[Admin Test] Starting test endpoint...')
    
    // Test 1: Check auth
    const session = await auth()
    console.log('[Admin Test] Session check:', session?.user?.id ? 'Has user ID' : 'No user ID')
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated', step: 'auth' }, { status: 401 })
    }

    // Test 2: Check database connection
    console.log('[Admin Test] Testing database connection...')
    const userCount = await prisma.user.count()
    console.log('[Admin Test] User count:', userCount)

    // Test 3: Check admin role
    console.log('[Admin Test] Checking admin role...')
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { role: true, email: true },
    })
    console.log('[Admin Test] User found:', user?.email, 'Role:', user?.role)

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ 
        error: 'Not admin', 
        step: 'role_check',
        userRole: user?.role,
        userId: session.user.id 
      }, { status: 403 })
    }

    // Test 4: Try a simple query
    console.log('[Admin Test] Testing simple query...')
    const testUsers = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        email: true,
        role: true,
      },
    })
    console.log('[Admin Test] Test query successful, found', testUsers.length, 'users')

    return NextResponse.json({
      success: true,
      message: 'All tests passed',
      data: {
        userCount,
        testUsersCount: testUsers.length,
        yourRole: user.role,
        yourEmail: user.email,
      },
    })
  } catch (error: any) {
    console.error('[Admin Test] Error:', error)
    return NextResponse.json({
      error: 'Test failed',
      message: error?.message,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    }, { status: 500 })
  }
}

