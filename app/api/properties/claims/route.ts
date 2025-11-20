import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // For now, return empty array. This should query PropertyClaim model when schema is updated
    return NextResponse.json({ claims: [] })
  } catch (error) {
    console.error('Error fetching claimed properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch claimed properties' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { propertyId } = body

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 })
    }

    // For now, return success. This should create PropertyClaim when schema is updated
    return NextResponse.json({ success: true, message: 'Property claimed successfully' })
  } catch (error) {
    console.error('Error claiming property:', error)
    return NextResponse.json(
      { error: 'Failed to claim property' },
      { status: 500 }
    )
  }
}

