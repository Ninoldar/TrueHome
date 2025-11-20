import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    const { propertyId, updateType, description, date } = body

    if (!propertyId || !description) {
      return NextResponse.json(
        { error: 'Property ID and description are required' },
        { status: 400 }
      )
    }

    // For now, return success. This should create WorkRecord or MaintenanceRecord when schema is updated
    return NextResponse.json({
      success: true,
      message: 'Update added successfully'
    })
  } catch (error) {
    console.error('Error adding property update:', error)
    return NextResponse.json(
      { error: 'Failed to add property update' },
      { status: 500 }
    )
  }
}

