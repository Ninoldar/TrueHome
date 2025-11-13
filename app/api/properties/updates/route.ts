import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(2, 'Description is required'),
  workDate: z.string().min(4, 'Date is required'),
  contractor: z.string().optional(),
  cost: z.number().nonnegative().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = updateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { propertyId, title, description, workDate, contractor, cost } = parsed.data

    // Ensure user has claimed this property
    const claim = await prisma.propertyClaim.findFirst({
      where: {
        propertyId,
        userId: session.user.id as string,
        status: 'ACTIVE',
      },
    })

    if (!claim) {
      return NextResponse.json(
        { error: 'You must claim this property before adding updates.' },
        { status: 403 }
      )
    }

    const workRecord = await prisma.workRecord.create({
      data: {
        propertyId,
        workType: title,
        description,
        contractor: contractor || null,
        workDate: new Date(workDate),
        cost: cost ?? null,
        dataSource: 'USER',
        enteredByUserId: session.user.id as string,
      },
    })

    return NextResponse.json({
      success: true,
      workRecord,
    })
  } catch (error) {
    console.error('Error creating property update:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

